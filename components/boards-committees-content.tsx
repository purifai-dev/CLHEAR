"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, ChevronDown, ChevronUp, Building2, AlertCircle, Info, FileText } from "lucide-react"
import { type BoardCommittee, generateAllGovernanceBodiesForEntities } from "@/lib/board-committee-catalogue"

interface Person {
  personId: string
  fullName: string
  jobTitle: string
  email: string
  phone?: string
}

interface LegalEntity {
  id: string
  brandName: string
  legalName: string
  lei: string
  address: string
  jurisdiction: string
  entityRole: string
  logo?: string
  entityType: "parent" | "subsidiary"
  licenses?: Array<{ licenseType: string; licenseNumber: string; issuingAuthority: string }>
}

export function BoardsCommitteesContent() {
  const [boards, setBoards] = useState<BoardCommittee[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [entities, setEntities] = useState<LegalEntity[]>([])
  const [expandedBoards, setExpandedBoards] = useState<Set<string>>(new Set())
  const [generateStatus, setGenerateStatus] = useState<"idle" | "loading" | "generated">("idle")
  const [hasCompanyDetails, setHasCompanyDetails] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"matrix" | "priority" | "entity">("matrix")
  const [selectedBoard, setSelectedBoard] = useState<BoardCommittee | null>(null)

  // Load entities from company profile
  useEffect(() => {
    const storedProfile = localStorage.getItem("company-profile")
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile)
        const hasDetails = parsed.entities && parsed.entities.length > 0
        setHasCompanyDetails(hasDetails)

        if (parsed.entities && Array.isArray(parsed.entities)) {
          setEntities(parsed.entities)
          console.log("[v0] Loaded entities for boards:", parsed.entities.length)
        }
      } catch (e) {
        console.error("[v0] Error loading entities:", e)
        setHasCompanyDetails(false)
      }
    } else {
      setHasCompanyDetails(false)
    }

    const storedBoards = localStorage.getItem("clhear-boards")
    if (storedBoards) {
      try {
        const parsedBoards = JSON.parse(storedBoards)
        setBoards(parsedBoards)
      } catch (e) {
        console.error("[v0] Error loading boards:", e)
      }
    }

    const storedPeople = localStorage.getItem("clhear-people")
    if (storedPeople) {
      try {
        setPeople(JSON.parse(storedPeople))
      } catch (e) {
        console.error("[v0] Error loading people:", e)
      }
    }
  }, [])

  // Auto-save boards
  useEffect(() => {
    if (boards.length > 0) {
      localStorage.setItem("clhear-boards", JSON.stringify(boards))
      console.log("[v0] Auto-saved boards:", boards.length)
    }
  }, [boards])

  const handleGenerateBoards = () => {
    if (entities.length === 0) {
      alert("Please add legal entities in the Entities & Licenses section first")
      return
    }

    setGenerateStatus("loading")

    // Generate governance bodies per entity
    const generatedBodies = generateAllGovernanceBodiesForEntities(entities)

    console.log("[v0] Generated governance bodies:", generatedBodies.length)
    setBoards(generatedBodies)
    setExpandedBoards(new Set())
    setGenerateStatus("generated")
    setTimeout(() => setGenerateStatus("idle"), 3000)
  }

  const toggleExpanded = (boardId: string) => {
    const newExpanded = new Set(expandedBoards)
    if (newExpanded.has(boardId)) {
      newExpanded.delete(boardId)
    } else {
      newExpanded.add(boardId)
    }
    setExpandedBoards(newExpanded)
  }

  const handleUpdateMember = (boardId: string, memberId: string, personId: string | null) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              seats: board.seats.map((seat) =>
                seat.memberId === memberId
                  ? { ...seat, assignedPerson: personId ? people.find((p) => p.personId === personId) : undefined }
                  : seat,
              ),
            }
          : board,
      ),
    )
  }

  // Filter boards by selected entity
  const filteredBoards =
    selectedEntity === "all" ? boards : boards.filter((board) => board.applicableEntityIds.includes(selectedEntity))

  // Group by entity
  const boardsByEntity = entities.reduce(
    (acc, entity) => {
      acc[entity.id] = boards.filter((board) => board.applicableEntityIds.includes(entity.id))
      return acc
    },
    {} as Record<string, BoardCommittee[]>,
  )

  // Group by priority
  const boardsByPriority = {
    Mandatory: filteredBoards.filter((b) => b.priority === "Mandatory"),
    "Strongly Recommended": filteredBoards.filter((b) => b.priority === "Strongly Recommended"),
    "Optional/Conditional": filteredBoards.filter((b) => b.priority === "Optional/Conditional"),
  }

  const boardsByLevel = {
    "Board-Level": filteredBoards.filter((b) => b.name.includes("Board") && !b.name.includes("Committee")),
    "Management-Level": filteredBoards.filter((b) => b.name.includes("Committee") || b.name.includes("Executive")),
    "Working-Level": filteredBoards.filter((b) => b.name.includes("Forum") || b.name.includes("Team")),
  }

  const getSharedBodies = () => {
    return boards.filter((board) => board.canBeSharedWith.length > 1)
  }

  const getStandaloneBodies = () => {
    return boards.filter((board) => board.mustBeStandaloneFor.length > 0)
  }

  const isSharedBody = (board: BoardCommittee) => {
    return board.canBeSharedWith.length > 1
  }

  const getMustBeStandaloneEntities = (board: BoardCommittee) => {
    return entities.filter((e) => board.mustBeStandaloneFor.includes(e.id))
  }

  const stats = {
    total: boards.length,
    required: boards.filter((b) => b.isRequired).length,
    totalSeats: boards.reduce((sum, b) => sum + b.seats.length, 0),
    filledSeats: boards.reduce((sum, b) => sum + b.seats.filter((s) => s.assignedPerson).length, 0),
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Boards & Committees</h1>
        <p className="text-sm text-muted-foreground">
          Governance bodies required for each legal entity based on their type, licenses, and regulatory obligations
        </p>
      </div>

      {!hasCompanyDetails && (
        <Card className="p-6 border-amber-500/50 bg-amber-500/10">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-500 mb-2">Ready to Generate</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Once you save legal entities, click "Generate Governance Structure" to analyze each entity and create
                only the governance bodies essential for that specific entity to operate compliantly based on CLHEAR's
                22 best practice standards.
              </p>
              <p className="text-sm text-muted-foreground">
                Please navigate to{" "}
                <span className="font-semibold text-foreground">Company Profile → Entities & Licenses</span> and add
                your legal entities first.
              </p>
            </div>
          </div>
        </Card>
      )}

      {hasCompanyDetails && boards.length > 0 && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Bodies</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold">{entities.length}</div>
              <div className="text-xs text-muted-foreground">Legal Entities</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold">{stats.required}</div>
              <div className="text-xs text-muted-foreground">Required Bodies</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold">
                {stats.filledSeats}/{stats.totalSeats}
              </div>
              <div className="text-xs text-muted-foreground">Filled Seats</div>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">View Mode</h3>
              <Select value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matrix">Consolidated Matrix View</SelectItem>
                  <SelectItem value="priority">Priority Tiers View</SelectItem>
                  <SelectItem value="entity">By Entity View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {viewMode === "matrix" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Consolidated Governance Map</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">Governance Body</th>
                      {entities.map((entity) => (
                        <th key={entity.id} className="text-center p-3 font-semibold min-w-32">
                          {entity.legalName}
                        </th>
                      ))}
                      <th className="text-center p-3 font-semibold">Shared?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(boardsByLevel).map(([level, levelBoards]) => (
                      <>
                        <tr key={level} className="bg-muted/30">
                          <td colSpan={entities.length + 2} className="p-2 font-semibold text-xs uppercase">
                            {level} ({levelBoards.length})
                          </td>
                        </tr>
                        {levelBoards.map((board) => (
                          <tr key={board.id} className="border-b border-border hover:bg-muted/20">
                            <td className="p-3 font-medium">{board.name}</td>
                            {entities.map((entity) => {
                              const applicable = board.applicableEntityIds.includes(entity.id)
                              const mustBeStandalone = board.mustBeStandaloneFor.includes(entity.id)
                              return (
                                <td key={entity.id} className="text-center p-3">
                                  {applicable ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <Badge variant="default" className="bg-green-500/20 text-green-400">
                                        ✓
                                      </Badge>
                                      {mustBeStandalone && (
                                        <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-400">
                                          Standalone
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">✗</span>
                                  )}
                                </td>
                              )
                            })}
                            <td className="text-center p-3">
                              {isSharedBody(board) ? (
                                <div className="flex flex-col items-center gap-1">
                                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                                    SHARED
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    ({board.canBeSharedWith.length} entities)
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">NO</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-3">
                <h4 className="text-sm font-semibold text-blue-400">KEY INSIGHTS:</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    • <strong>{getSharedBodies().length}</strong> governance bodies can be shared across multiple
                    entities
                  </p>
                  <p>
                    • <strong>{getStandaloneBodies().length}</strong> bodies require standalone implementations for
                    specific entities
                  </p>
                  <p>
                    • Each entity maintains its own board-level and management committees while feeding upward into
                    group-level risk and audit governance
                  </p>
                </div>
              </div>

              {getSharedBodies().length > 0 && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-green-400 mb-3">Shareable Governance Bodies:</h4>
                  <div className="space-y-2">
                    {getSharedBodies().map((board) => (
                      <div key={board.id} className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{board.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Can be shared across:{" "}
                            {entities
                              .filter((e) => board.canBeSharedWith.includes(e.id))
                              .map((e) => e.legalName)
                              .join(", ")}
                          </p>
                          {board.sharingRationale && (
                            <p className="text-xs text-muted-foreground mt-1 italic">{board.sharingRationale}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {getStandaloneBodies().length > 0 && (
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-amber-400 mb-3">Standalone Requirements:</h4>
                  <div className="space-y-2">
                    {getStandaloneBodies().map((board) => {
                      const standaloneEntities = getMustBeStandaloneEntities(board)
                      return (
                        <div key={board.id} className="flex items-start gap-2">
                          <span className="text-amber-400">⚠</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{board.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Must be standalone for: {standaloneEntities.map((e) => e.legalName).join(", ")}
                            </p>
                            {board.sharingRationale && (
                              <p className="text-xs text-muted-foreground mt-1 italic">{board.sharingRationale}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </Card>
          )}

          {viewMode === "entity" && (
            <div className="space-y-4">
              {entities.map((entity) => {
                const entityBoards = boardsByEntity[entity.id] || []
                const boardLevel = entityBoards.filter(
                  (b) => b.level === "Apex Governance" || b.level === "Board Sub-Committee",
                )
                const mgmtLevel = entityBoards.filter((b) => b.level === "Senior Management Forum")
                const workingLevel = entityBoards.filter((b) => b.level === "Working-Level Forum")

                return (
                  <Card key={entity.id} className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{entity.legalName} – Governance Structure</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {entity.entityRole} • {entity.jurisdiction}
                    </p>

                    <div className="space-y-4 font-mono text-sm">
                      {boardLevel.length > 0 && (
                        <div>
                          <div className="text-green-400 mb-2">├─ BOARD-LEVEL BODIES ({boardLevel.length})</div>
                          {boardLevel.map((board, idx) => (
                            <div key={board.id} className="ml-4 text-muted-foreground">
                              {idx === boardLevel.length - 1 ? "└─" : "├─"} {board.name}
                            </div>
                          ))}
                        </div>
                      )}

                      {mgmtLevel.length > 0 && (
                        <div>
                          <div className="text-blue-400 mb-2">├─ MANAGEMENT-LEVEL BODIES ({mgmtLevel.length})</div>
                          {mgmtLevel.map((board, idx) => (
                            <div key={board.id} className="ml-4 text-muted-foreground">
                              {idx === mgmtLevel.length - 1 ? "└─" : "├─"} {board.name}
                            </div>
                          ))}
                        </div>
                      )}

                      {workingLevel.length > 0 && (
                        <div>
                          <div className="text-amber-400 mb-2">└─ WORKING-LEVEL BODIES ({workingLevel.length})</div>
                          {workingLevel.map((board, idx) => (
                            <div key={board.id} className="ml-4 text-muted-foreground">
                              {idx === workingLevel.length - 1 ? "└─" : "├─"} {board.name}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-border text-foreground">
                        TOTAL: {entityBoards.length} governance bodies
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Priority Tiers View */}
          {viewMode === "priority" && (
            <div className="space-y-6">
              {(Object.keys(boardsByPriority) as Array<keyof typeof boardsByPriority>).map((priority) => {
                const priorityBoards = boardsByPriority[priority]
                if (priorityBoards.length === 0) return null

                return (
                  <div key={priority} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-lg font-semibold ${
                          priority === "Mandatory"
                            ? "text-red-400"
                            : priority === "Strongly Recommended"
                              ? "text-amber-400"
                              : "text-blue-400"
                        }`}
                      >
                        Priority Tier {priority === "Mandatory" ? "1" : priority === "Strongly Recommended" ? "2" : "3"}
                        : {priority.toUpperCase()}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`${
                          priority === "Mandatory"
                            ? "bg-red-500/20 text-red-400"
                            : priority === "Strongly Recommended"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {priorityBoards.length} {priorityBoards.length === 1 ? "body" : "bodies"}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {priorityBoards.map((board) => {
                        const entity = entities.find((e) => board.applicableEntityIds.includes(e.id))

                        return (
                          <Card
                            key={board.id}
                            className={`border-l-4 ${
                              priority === "Mandatory"
                                ? "border-l-red-500"
                                : priority === "Strongly Recommended"
                                  ? "border-l-amber-500"
                                  : "border-l-blue-500"
                            }`}
                            onClick={() => setSelectedBoard(board)}
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{board.name}</h4>
                                    {board.isRequired && (
                                      <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400">
                                        Required
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400">
                                      {board.type}
                                    </Badge>
                                  </div>

                                  {entity && (
                                    <Badge variant="outline" className="text-xs mb-2">
                                      {entity.legalName}
                                    </Badge>
                                  )}

                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <Users className="h-4 w-4 text-blue-400" />
                                    <span>
                                      {board.seats.filter((s) => s.assignedPerson).length} / {board.seats.length} seats
                                      filled
                                    </span>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleExpanded(board.id)}
                                    className="text-xs mt-2"
                                  >
                                    {expandedBoards.has(board.id) ? (
                                      <>
                                        <ChevronUp className="h-3 w-3 mr-1" />
                                        Hide Details
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="h-3 w-3 mr-1" />
                                        Show Details
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>

                              {expandedBoards.has(board.id) && (
                                <div className="mt-4 space-y-4 border-t border-border pt-4">
                                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                                    <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                      <Building2 className="h-4 w-4 text-blue-400" />
                                      Governance Structure
                                    </h5>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <div className="text-xs font-semibold text-muted-foreground mb-1">
                                          Size & Composition:
                                        </div>
                                        <div className="text-foreground">{board.sizeAndComposition}</div>
                                      </div>
                                      <div>
                                        <div className="text-xs font-semibold text-muted-foreground mb-1">
                                          Reporting Line:
                                        </div>
                                        <div className="text-sm text-foreground">{board.reportingLine}</div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                                        Key Responsibilities:
                                      </div>
                                      <ul className="list-none space-y-1 text-sm">
                                        {board.keyResponsibilities.map((resp, idx) => (
                                          <li key={idx} className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span className="text-foreground">{resp}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div>
                                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                                        Meeting Frequency:
                                      </div>
                                      <div className="text-sm text-foreground">{board.meetingFrequency}</div>
                                    </div>

                                    <div>
                                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                                        Evidence/Documentation Required:
                                      </div>
                                      <ul className="list-none space-y-1 text-sm">
                                        {board.evidenceRequired.map((evidence, idx) => (
                                          <li key={idx} className="flex items-start gap-2">
                                            <FileText className="h-3 w-3 text-amber-400 mt-1 flex-shrink-0" />
                                            <span className="text-muted-foreground">{evidence}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div>
                                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                                        Cross-Reference to CLHEAR 39 Roles:
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {board.clhearRolesRequired.map((role, idx) => (
                                          <Badge
                                            key={idx}
                                            variant="outline"
                                            className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30"
                                          >
                                            {role}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-4">
                                    <h5 className="text-sm font-semibold text-blue-400 flex items-center gap-2 border-b border-blue-500/30 pb-2">
                                      <Info className="h-4 w-4" />
                                      CLHEAR Rationale
                                    </h5>

                                    <div>
                                      <div className="text-xs font-semibold text-muted-foreground mb-1">
                                        Pillar(s) Covered:
                                      </div>
                                      <div className="text-sm text-foreground">
                                        {board.clhearRationale.pillarsCovered}
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-xs font-semibold text-muted-foreground mb-1">
                                        Mandatory Reason:
                                      </div>
                                      <div className="text-sm text-foreground leading-relaxed">
                                        {board.clhearRationale.mandatoryReason}
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                                        Reference Standards:
                                      </div>
                                      <div className="space-y-2">
                                        {board.clhearRationale.referenceStandards.map((ref, idx) => (
                                          <div key={idx} className="pl-4 border-l-2 border-blue-500/50">
                                            <div className="text-xs font-semibold text-blue-400 mb-1">
                                              • {ref.standard}:
                                            </div>
                                            <div className="text-xs text-muted-foreground italic pl-2">
                                              "{ref.quote}"
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                                        Applicability Analysis:
                                      </div>
                                      <div className="space-y-2">
                                        {board.clhearRationale.entityApplicability.map((app, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-start gap-2 text-xs p-2 rounded bg-muted/30"
                                          >
                                            <Badge
                                              variant={app.applicable ? "default" : "outline"}
                                              className={`text-xs ${
                                                app.applicable
                                                  ? "bg-green-500/20 text-green-400"
                                                  : "bg-red-500/20 text-red-400"
                                              }`}
                                            >
                                              {app.applicable ? "YES" : "NO"}
                                            </Badge>
                                            <div className="flex-1">
                                              <div className="font-semibold text-foreground mb-1">{app.entityName}</div>
                                              <div className="text-muted-foreground">{app.reason}</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="text-sm font-semibold mb-1">Purpose</h5>
                                    <p className="text-sm text-muted-foreground">{board.purpose}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h5 className="text-sm font-semibold mb-1">Meeting Frequency</h5>
                                      <p className="text-sm text-muted-foreground">{board.meetingFrequency}</p>
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-semibold mb-1">Chair</h5>
                                      <p className="text-sm text-muted-foreground">{board.chair}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="text-sm font-semibold mb-1">Core Membership</h5>
                                    <p className="text-sm text-muted-foreground">{board.coreMembership}</p>
                                  </div>

                                  <div>
                                    <h5 className="text-sm font-semibold mb-1">Standards Basis</h5>
                                    <p className="text-sm text-muted-foreground">{board.standardsBasis}</p>
                                  </div>

                                  {board.keyStandardQuote && (
                                    <div>
                                      <h5 className="text-sm font-semibold mb-1">Key Standard Quote</h5>
                                      <p className="text-sm text-muted-foreground italic">{board.keyStandardQuote}</p>
                                    </div>
                                  )}

                                  <div>
                                    <h5 className="text-sm font-semibold mb-2">Pillars Covered</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {board.pillarsCovered.map((pillar, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                          {pillar}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="text-sm font-semibold mb-2">Members</h5>
                                    <div className="space-y-2">
                                      {board.seats.map((seat) => (
                                        <div
                                          key={seat.memberId}
                                          className="flex items-center justify-between p-2 bg-muted/50 rounded"
                                        >
                                          <div>
                                            <div className="text-sm font-medium">{seat.role}</div>
                                            {seat.assignedPerson && (
                                              <div className="text-xs text-muted-foreground">
                                                {seat.assignedPerson.fullName}
                                              </div>
                                            )}
                                          </div>
                                          <Select
                                            value={seat.assignedPerson?.personId || "unassigned"}
                                            onValueChange={(value) =>
                                              handleUpdateMember(
                                                board.id,
                                                seat.memberId,
                                                value === "unassigned" ? null : value,
                                              )
                                            }
                                          >
                                            <SelectTrigger className="w-48">
                                              <SelectValue placeholder="Assign person" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="unassigned">Unassigned</SelectItem>
                                              {people.map((person) => (
                                                <SelectItem key={person.personId} value={person.personId}>
                                                  {person.fullName} - {person.jobTitle}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {hasCompanyDetails && boards.length === 0 && (
        <Card className="p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Click "Generate Governance Structure" to analyze each legal entity and create the governance bodies
            essential for compliance
          </p>
        </Card>
      )}

      {selectedBoard && expandedBoards.has(selectedBoard.id) && (
        <Card className="p-6 space-y-6">
          <h3 className="text-lg font-semibold mb-2">{selectedBoard.name}</h3>

          {/* Sharing Analysis */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Sharing Analysis
            </h4>
            <div className="space-y-3">
              {isSharedBody(selectedBoard) ? (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                  <p className="text-sm font-medium text-blue-400 mb-2">Can Be Shared</p>
                  <p className="text-sm text-muted-foreground">
                    This body can operate at group level serving:{" "}
                    {entities
                      .filter((e) => selectedBoard.canBeSharedWith.includes(e.id))
                      .map((e) => e.legalName)
                      .join(", ")}
                  </p>
                  {selectedBoard.sharingRationale && (
                    <p className="text-xs text-muted-foreground mt-2 italic">{selectedBoard.sharingRationale}</p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-muted/30 border border-border rounded">
                  <p className="text-sm font-medium mb-2">Entity-Specific</p>
                  <p className="text-sm text-muted-foreground">
                    This body cannot be shared and must be established separately for each applicable entity.
                  </p>
                </div>
              )}

              {selectedBoard.mustBeStandaloneFor.length > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded">
                  <p className="text-sm font-medium text-amber-400 mb-2">Standalone Required For:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {getMustBeStandaloneEntities(selectedBoard).map((entity) => (
                      <li key={entity.id}>• {entity.legalName}</li>
                    ))}
                  </ul>
                  {selectedBoard.sharingRationale && (
                    <p className="text-xs text-muted-foreground mt-2 italic">{selectedBoard.sharingRationale}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
