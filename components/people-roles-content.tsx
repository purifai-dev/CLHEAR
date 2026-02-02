"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Loader2, User, Users, AlertCircle } from "lucide-react"
import {
  type Role,
  type Person,
  type LineOfDefence,
  type RoleStatus,
  getRequiredRolesForEntities,
} from "@/lib/role-catalogue"

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
  parentEntityId?: string
}

export function PeopleRolesContent() {
  const [roles, setRoles] = useState<Role[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [entities, setEntities] = useState<LegalEntity[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [generateStatus, setGenerateStatus] = useState<"idle" | "loading" | "generated">("idle")
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [selectedLine, setSelectedLine] = useState<string>("all")
  const [selectedEntity, setSelectedEntity] = useState<string>("all")
  const [showGapsOnly, setShowGapsOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasCompanyDetails, setHasCompanyDetails] = useState(false)

  useEffect(() => {
    const storedEntities = localStorage.getItem("company-profile")
    if (storedEntities) {
      const parsed = JSON.parse(storedEntities)
      const hasDetails = parsed.entities && parsed.entities.length > 0
      setHasCompanyDetails(hasDetails)

      if (parsed.entities && Array.isArray(parsed.entities)) {
        setEntities(parsed.entities)
        console.log("[v0] Loaded entities from localStorage:", parsed.entities.length)
      }
    } else {
      setHasCompanyDetails(false)
    }

    const storedRoles = localStorage.getItem("clhear-roles")
    if (storedRoles) {
      const parsed = JSON.parse(storedRoles)
      setRoles(parsed)
      console.log("[v0] Loaded roles from localStorage:", parsed.length)
    }

    const storedPeople = localStorage.getItem("clhear-people")
    if (storedPeople) {
      const parsed = JSON.parse(storedPeople)
      setPeople(parsed)
    } else {
      const mockPeople: Person[] = [
        {
          personId: "person-1",
          fullName: "John Smith",
          jobTitle: "Chief Compliance Officer",
          email: "john.smith@example.com",
          phone: "+1 555 0100",
        },
        {
          personId: "person-2",
          fullName: "Sarah Johnson",
          jobTitle: "Head of Risk",
          email: "sarah.johnson@example.com",
          phone: "+1 555 0101",
        },
      ]
      setPeople(mockPeople)
      localStorage.setItem("clhear-people", JSON.stringify(mockPeople))
    }

    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("clhear-roles", JSON.stringify(roles))
      console.log("[v0] Auto-saved roles to localStorage:", roles.length)
    }
  }, [roles, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("clhear-people", JSON.stringify(people))
    }
  }, [people, isInitialized])

  const handleGenerateRoles = () => {
    if (entities.length === 0) {
      alert("Please add legal entities in the Company Details section first")
      return
    }

    setGenerateStatus("loading")

    if (roles.length === 0) {
      const requiredRoles = getRequiredRolesForEntities(entities)
      setRoles(requiredRoles)
      console.log("[v0] Generated roles based on entities:", requiredRoles.length)
    }

    setGenerateStatus("generated")
    setTimeout(() => setGenerateStatus("idle"), 3000)
  }

  const handleUpdateRole = (updatedRole: Role) => {
    setRoles((prev) => prev.map((r) => (r.roleId === updatedRole.roleId ? updatedRole : r)))
    setEditingRole(null)
  }

  const toggleEntityCoverage = (roleId: string, entityId: string) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.roleId === roleId) {
          const currentCoverage = role.coveredEntityIds || []
          const isCurrentlyCovered = currentCoverage.includes(entityId)
          return {
            ...role,
            coveredEntityIds: isCurrentlyCovered
              ? currentCoverage.filter((id) => id !== entityId)
              : [...currentCoverage, entityId],
          }
        }
        return role
      }),
    )
  }

  const filteredRoles = roles.filter((role) => {
    if (selectedLine !== "all" && role.lineOfDefence !== selectedLine) return false
    if (showGapsOnly && role.status !== "VACANT") return false
    if (selectedEntity !== "all" && !role.coveredEntityIds?.includes(selectedEntity)) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return role.roleTitle.toLowerCase().includes(query) || role.coreResponsibilities.toLowerCase().includes(query)
    }
    return true
  })

  const rolesByLine = {
    GOVERNANCE: filteredRoles.filter((r) => r.lineOfDefence === "GOVERNANCE"),
    FIRST_LINE: filteredRoles.filter((r) => r.lineOfDefence === "FIRST_LINE"),
    SECOND_LINE: filteredRoles.filter((r) => r.lineOfDefence === "SECOND_LINE"),
    THIRD_LINE: filteredRoles.filter((r) => r.lineOfDefence === "THIRD_LINE"),
    SUPPORT: filteredRoles.filter((r) => r.lineOfDefence === "SUPPORT"),
  }

  const getLineColor = (lineOfDefence: LineOfDefence) => {
    switch (lineOfDefence) {
      case "GOVERNANCE":
        return "border-purple-500 text-purple-500"
      case "FIRST_LINE":
        return "border-blue-500 text-blue-500"
      case "SECOND_LINE":
        return "border-amber-500 text-amber-500"
      case "THIRD_LINE":
        return "border-green-500 text-green-500"
      case "SUPPORT":
        return "border-gray-500 text-gray-500"
      default:
        return "border-gray-500 text-gray-500"
    }
  }

  const getStatusColor = (status: RoleStatus) => {
    switch (status) {
      case "FILLED":
        return "bg-green-500/10 text-green-500"
      case "VACANT":
        return "bg-red-500/10 text-red-500"
      case "COMBINED":
        return "bg-yellow-500/10 text-yellow-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const roleStats = {
    total: roles.length,
    filled: roles.filter((r) => r.status === "FILLED").length,
    vacant: roles.filter((r) => r.status === "VACANT").length,
    combined: roles.filter((r) => r.status === "COMBINED").length,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">People & Roles</h1>
        <p className="text-sm text-muted-foreground">
          Personnel requirements based on your legal entities and their regulatory obligations
        </p>
      </div>

      {!hasCompanyDetails && (
        <Card className="p-6 border-red-500/50 bg-red-500/10">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-500 mb-2">Cannot Be Determined</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Required personnel roles cannot be determined until company details are registered in the system.
              </p>
              <p className="text-sm text-muted-foreground">
                Please navigate to{" "}
                <span className="font-semibold text-foreground">Company Profile → Company Details</span> and add:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1 ml-2">
                <li>Company name and basic information</li>
                <li>Legal entities with their jurisdictions and roles</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {hasCompanyDetails && (
        <>
          {entities.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Legal Entities Requiring Personnel</h3>
              <div className="flex flex-wrap gap-2">
                {entities.map((entity) => (
                  <Badge key={entity.id} variant="outline" className="text-xs">
                    {entity.legalName || entity.brandName}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Roles</CardDescription>
                <CardTitle className="text-4xl">{roleStats.total}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">CLHEAR Framework</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Filled Roles</CardDescription>
                <CardTitle className="text-4xl text-green-500">{roleStats.filled}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">People assigned</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Vacant Roles</CardDescription>
                <CardTitle className="text-4xl text-red-500">{roleStats.vacant}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Require assignment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Combined Roles</CardDescription>
                <CardTitle className="text-4xl text-yellow-500">{roleStats.combined}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Multiple duties</p>
              </CardContent>
            </Card>
          </div>

          {/* Toolbar */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-balance">People & Roles</h2>
                <p className="text-muted-foreground mt-2 text-pretty">
                  Personnel requirements based on your legal entities and their regulatory obligations
                </p>
              </div>
              <Button
                onClick={handleGenerateRoles}
                disabled={generateStatus === "loading" || entities.length === 0}
                variant={generateStatus === "generated" ? "outline" : "default"}
              >
                {generateStatus === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {generateStatus === "generated" && <Check className="mr-2 h-4 w-4" />}
                {generateStatus === "loading"
                  ? "Loading..."
                  : generateStatus === "generated"
                    ? "Generated"
                    : roles.length === 0
                      ? "Generate Roles Based on Entities"
                      : "Refresh Roles"}
              </Button>
            </div>
          </Card>

          {/* Roles Display */}
          {roles.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Roles Generated Yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                {entities.length === 0
                  ? "Add legal entities in Company Details, then generate the required personnel roles"
                  : "Click the button above to generate the CLHEAR 67 Roles Framework based on your entities"}
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              <Tabs defaultValue="GOVERNANCE" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="GOVERNANCE">Governance ({rolesByLine.GOVERNANCE.length})</TabsTrigger>
                  <TabsTrigger value="FIRST_LINE">First Line ({rolesByLine.FIRST_LINE.length})</TabsTrigger>
                  <TabsTrigger value="SECOND_LINE">Second Line ({rolesByLine.SECOND_LINE.length})</TabsTrigger>
                  <TabsTrigger value="THIRD_LINE">Third Line ({rolesByLine.THIRD_LINE.length})</TabsTrigger>
                  <TabsTrigger value="SUPPORT">Support ({rolesByLine.SUPPORT.length})</TabsTrigger>
                </TabsList>

                {(["GOVERNANCE", "FIRST_LINE", "SECOND_LINE", "THIRD_LINE", "SUPPORT"] as const).map((lineType) => (
                  <TabsContent key={lineType} value={lineType} className="space-y-4 mt-6">
                    {rolesByLine[lineType].length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No roles in this line of defence match your filters
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {rolesByLine[lineType].map((role) => {
                          const assignedPerson = people.find((p) => p.personId === role.personAssignedId)
                          const coveredEntitiesForRole = entities.filter((e) => role.coveredEntityIds?.includes(e.id))

                          return (
                            <Card key={role.roleId} className="hover:border-primary/50 transition-colors">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs font-mono">
                                        #{role.roleNumber}
                                      </Badge>
                                      <CardTitle className="text-base">{role.roleTitle}</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">Reports to: {role.reportsTo}</CardDescription>
                                  </div>
                                  <Badge variant="outline" className={getLineColor(role.lineOfDefence)}>
                                    {role.lineOfDefence === "GOVERNANCE"
                                      ? "Governance"
                                      : role.lineOfDefence === "SUPPORT"
                                        ? "Support"
                                        : role.lineOfDefence.replace("_", " ")}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium mb-1">Core Responsibilities:</p>
                                  <p className="text-sm text-muted-foreground">{role.coreResponsibilities}</p>
                                </div>

                                <div>
                                  <p className="text-xs font-medium mb-1">Standards Basis:</p>
                                  <p className="text-xs text-muted-foreground">{role.standardsBasis}</p>
                                </div>

                                <div>
                                  <p className="text-xs font-medium mb-1">Pillars Linked:</p>
                                  <p className="text-xs text-muted-foreground">{role.pillarsLinked}</p>
                                </div>

                                {entities.length > 0 && (
                                  <div className="pt-2 border-t">
                                    <p className="text-xs font-medium mb-2">Entity Coverage:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {entities.map((entity) => {
                                        const isCovered = role.coveredEntityIds?.includes(entity.id)
                                        return (
                                          <Badge
                                            key={entity.id}
                                            variant={isCovered ? "default" : "outline"}
                                            className="cursor-pointer text-xs"
                                            onClick={() => toggleEntityCoverage(role.roleId, entity.id)}
                                          >
                                            {isCovered && <Check className="mr-1 h-3 w-3" />}
                                            {entity.brandName}
                                          </Badge>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t">
                                  <div className="flex-1">
                                    {assignedPerson ? (
                                      <div className="text-sm">
                                        <div className="font-medium">{assignedPerson.fullName}</div>
                                        <div className="text-xs text-muted-foreground">{assignedPerson.jobTitle}</div>
                                        <div className="text-xs text-muted-foreground">{assignedPerson.email}</div>
                                      </div>
                                    ) : (
                                      <Badge className={getStatusColor(role.status)}>{role.status}</Badge>
                                    )}
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => setEditingRole(role)}>
                                    <User className="h-4 w-4 mr-1" />
                                    Assign
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </>
      )}

      {editingRole && (
        <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Role: {editingRole.roleTitle}</DialogTitle>
              <DialogDescription>Assign a person and update role details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Assign Person</Label>
                <Select
                  value={editingRole.personAssignedId || "none"}
                  onValueChange={(value) =>
                    setEditingRole({ ...editingRole, personAssignedId: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No one assigned</SelectItem>
                    {people.map((person) => (
                      <SelectItem key={person.personId} value={person.personId}>
                        {person.fullName} - {person.jobTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Role Status</Label>
                <Select
                  value={editingRole.status}
                  onValueChange={(value) => setEditingRole({ ...editingRole, status: value as RoleStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FILLED">Filled</SelectItem>
                    <SelectItem value="VACANT">Vacant</SelectItem>
                    <SelectItem value="COMBINED">Combined with Another Role</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Core Responsibilities (Read-only)</Label>
                <Textarea value={editingRole.coreResponsibilities} disabled rows={4} />
              </div>

              <div>
                <Label>Key Standard Quote (Read-only)</Label>
                <Textarea value={editingRole.keyStandardQuote} disabled rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRole(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdateRole(editingRole)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
