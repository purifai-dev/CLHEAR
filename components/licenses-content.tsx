"use client"

import type React from "react"
import { useRef } from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  ChevronDown,
  ChevronUp,
  Building2,
  AlertTriangle,
  Info,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  RotateCcw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  FCA_LICENSES_CATALOGUE,
  FCA_LICENSE_CATEGORIES,
  LICENSE_CATEGORY_LABELS,
  type LicenseStatus,
  type EntityLicenseMapping,
} from "@/lib/fca-licenses-catalogue"
import { estimateLicensesForEntities } from "@/app/actions/estimate-licenses"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LegalEntity {
  id: string
  entityName?: string
  legalName?: string
  businessPurpose?: string
  regulator?: string
  licenseType?: string
  jurisdictionOfFormation?: string
  registeredAddress?: string
  entityType?: string
}

const STATUS_CONFIG: Record<LicenseStatus | "not_assigned", { label: string; color: string; icon: React.ReactNode }> = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  inactive: {
    label: "Inactive",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <XCircle className="w-3 h-3" />,
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <Clock className="w-3 h-3" />,
  },
  revoked: { label: "Revoked", color: "bg-red-100 text-red-800 border-red-200", icon: <Ban className="w-3 h-3" /> },
  not_assigned: { label: "Not Assigned", color: "bg-muted text-muted-foreground border-border", icon: null },
}

export function LicensesContent() {
  const router = useRouter()
  const [entities, setEntities] = useState<LegalEntity[]>([])
  const [assignments, setAssignments] = useState<EntityLicenseMapping[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [expandedLicenses, setExpandedLicenses] = useState<Set<string>>(new Set())
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState("")
  const [lastEstimationResults, setLastEstimationResults] = useState<
    Map<string, { confidence: string; reasoning: string }>
  >(new Map())
  const isLocalChange = useRef(false)

  useEffect(() => {
    console.log("[v0] LicensesContent mounted")
    console.log("[v0] FCA_LICENSES_CATALOGUE length:", FCA_LICENSES_CATALOGUE?.length || 0)
    console.log("[v0] FCA_LICENSE_CATEGORIES:", FCA_LICENSE_CATEGORIES)
  }, [])

  // Load entities and assignments from localStorage
  useEffect(() => {
    const loadData = () => {
      if (isLocalChange.current) {
        isLocalChange.current = false
        return
      }

      try {
        // Load entities
        const storedEntities = localStorage.getItem("clhear-entities")
        if (storedEntities) {
          const parsed = JSON.parse(storedEntities)
          setEntities(parsed)
        } else {
          const storedProfile = localStorage.getItem("company-profile")
          if (storedProfile) {
            const profile = JSON.parse(storedProfile)
            if (profile.entities) {
              setEntities(profile.entities)
            }
          }
        }

        // Load license assignments
        const storedAssignments = localStorage.getItem("clhear-license-assignments")
        if (storedAssignments) {
          const parsed = JSON.parse(storedAssignments)
          setAssignments(parsed)
        }
      } catch (error) {
        console.error("[v0] Error loading data:", error)
      }
    }

    loadData()
  }, [])

  // Auto-save assignments
  useEffect(() => {
    if (assignments.length > 0) {
      isLocalChange.current = true
      localStorage.setItem("clhear-license-assignments", JSON.stringify(assignments))
    }
  }, [assignments])

  const estimateLicensesWithAI = async () => {
    const entitiesWithPurpose = entities.filter((e) => e.businessPurpose && e.businessPurpose.trim().length > 0)

    if (entitiesWithPurpose.length === 0) {
      alert(
        "No entities have business purposes defined. Please add business purpose descriptions to your legal entities first.",
      )
      return
    }

    setIsGenerating(true)
    setGenerationProgress("Analyzing business purposes with AI...")

    try {
      const result = await estimateLicensesForEntities(entities)

      if (result.error) {
        alert(`Error: ${result.error}`)
        setIsGenerating(false)
        setGenerationProgress("")
        return
      }

      // Convert AI estimations to assignments
      const newAssignments: EntityLicenseMapping[] = [...assignments]
      const newResults = new Map<string, { confidence: string; reasoning: string }>()

      for (const estimation of result.estimations) {
        // Check if assignment already exists
        const existingIndex = newAssignments.findIndex(
          (a) => a.entityId === estimation.entityId && a.licenseId === estimation.licenseId,
        )

        if (existingIndex >= 0) {
          // Update existing
          newAssignments[existingIndex].status = estimation.status
        } else {
          // Add new
          newAssignments.push({
            entityId: estimation.entityId,
            licenseId: estimation.licenseId,
            status: estimation.status,
          })
        }

        // Store reasoning for display
        const key = `${estimation.entityId}-${estimation.licenseId}`
        newResults.set(key, {
          confidence: estimation.confidence,
          reasoning: estimation.reasoning,
        })
      }

      setAssignments(newAssignments)
      setLastEstimationResults(newResults)
      setGenerationProgress(`Successfully estimated ${result.estimations.length} license assignments!`)

      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress("")
      }, 2000)
    } catch (error) {
      console.error("Error estimating licenses:", error)
      alert("Failed to estimate licenses. Please try again.")
      setIsGenerating(false)
      setGenerationProgress("")
    }
  }

  const resetAllLicenses = () => {
    setAssignments([])
    setLastEstimationResults(new Map())
    localStorage.removeItem("clhear-license-assignments")
  }

  const toggleExpanded = (licenseId: string) => {
    setExpandedLicenses((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(licenseId)) {
        newSet.delete(licenseId)
      } else {
        newSet.add(licenseId)
      }
      return newSet
    })
  }

  const getEntityStatus = (licenseId: string, entityId: string): LicenseStatus | "not_assigned" => {
    const assignment = assignments.find((a) => a.licenseId === licenseId && a.entityId === entityId)
    return assignment?.status || "not_assigned"
  }

  const setEntityStatus = (licenseId: string, entityId: string, status: LicenseStatus | "not_assigned") => {
    setAssignments((prev) => {
      const filtered = prev.filter((a) => !(a.licenseId === licenseId && a.entityId === entityId))
      if (status !== "not_assigned") {
        filtered.push({ licenseId, entityId, status })
      }
      return filtered
    })
  }

  const getAssignedEntitiesForLicense = (licenseId: string) => {
    return assignments.filter((a) => a.licenseId === licenseId)
  }

  // Filter licenses
  const filteredLicenses = FCA_LICENSES_CATALOGUE.filter((license) => {
    const matchesSearch =
      searchQuery === "" ||
      license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.purpose.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || license.category === categoryFilter

    const matchesEntity =
      entityFilter === "all" || assignments.some((a) => a.licenseId === license.id && a.entityId === entityFilter)

    const matchesStatus =
      statusFilter === "all" || assignments.some((a) => a.licenseId === license.id && a.status === statusFilter)

    return matchesSearch && matchesCategory && matchesEntity && matchesStatus
  })

  // Statistics
  const totalAssignments = assignments.length
  const activeCount = assignments.filter((a) => a.status === "active").length
  const inactiveCount = assignments.filter((a) => a.status === "inactive").length
  const pendingCount = assignments.filter((a) => a.status === "pending").length

  // Check if entities exist
  if (entities.length === 0) {
    return (
      <div className="p-6">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
              Cannot Be Determined
            </CardTitle>
            <CardDescription className="text-amber-700">
              Legal entities must be defined before licences can be assigned.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 mb-4">
              The Licences section allows you to map FCA regulated activities to your legal entities. Please define your
              legal entities in the Company Profile section first.
            </p>
            <Button onClick={() => router.push("/dashboard/company-profile")} variant="outline" className="gap-2">
              <Building2 className="w-4 h-4" />
              Go to Legal Entities
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">FCA Licences</h1>
        <p className="text-muted-foreground mt-1">
          Map FCA regulated activities to your {entities.length} legal entit{entities.length === 1 ? "y" : "ies"}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{FCA_LICENSES_CATALOGUE.length}</div>
            <p className="text-xs text-muted-foreground">Total Licences</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">Assignments</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-500">{inactiveCount}</div>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Estimation Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">AI Licence Estimation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Automatically estimate required licences based on each entity's business purpose using AI analysis.
                Entities must have a business purpose defined in the Legal Entities section.
              </p>
              {isGenerating && generationProgress && (
                <p className="text-sm text-primary mt-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {generationProgress}
                </p>
              )}
              {!isGenerating && lastEstimationResults.size > 0 && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Last estimation: {lastEstimationResults.size} licence-entity mappings identified
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetAllLicenses}
                disabled={isGenerating || totalAssignments === 0}
                className="gap-2 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button onClick={estimateLicensesWithAI} disabled={isGenerating} className="gap-2">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Estimate Licences
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search licences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {FCA_LICENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="All Entities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {entities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.entityName || entity.legalName || "Unknown"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Licence List */}
      <div className="space-y-4">
        {filteredLicenses.map((license) => {
          const isExpanded = expandedLicenses.has(license.id)
          const assignedEntities = getAssignedEntitiesForLicense(license.id)

          return (
            <Card key={license.id} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleExpanded(license.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {license.id}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {license.raoArticle}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-muted">
                        {LICENSE_CATEGORY_LABELS[license.category]}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{license.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{license.purpose}</CardDescription>

                    {/* Entity tags */}
                    {assignedEntities.length > 0 && (
                      <TooltipProvider>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {assignedEntities.map((assignment) => {
                            const entity = entities.find((e) => e.id === assignment.entityId)
                            const statusConfig = STATUS_CONFIG[assignment.status]
                            const key = `${assignment.entityId}-${license.id}`
                            const estimation = lastEstimationResults.get(key)

                            if (estimation) {
                              return (
                                <Tooltip key={assignment.entityId}>
                                  <TooltipTrigger asChild>
                                    <Badge className={`text-xs ${statusConfig.color} border cursor-help`}>
                                      {statusConfig.icon}
                                      <span className="ml-1">
                                        {entity?.entityName || entity?.legalName || "Unknown"}
                                      </span>
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom" className="max-w-sm p-3 bg-background border shadow-lg">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                            estimation.confidence === "high"
                                              ? "bg-green-100 text-green-700"
                                              : estimation.confidence === "medium"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-red-100 text-red-700"
                                          }`}
                                        >
                                          {estimation.confidence.toUpperCase()} CONFIDENCE
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground leading-relaxed">
                                        {estimation.reasoning}
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )
                            }

                            return (
                              <Badge key={assignment.entityId} className={`text-xs ${statusConfig.color} border`}>
                                {statusConfig.icon}
                                <span className="ml-1">{entity?.entityName || entity?.legalName || "Unknown"}</span>
                              </Badge>
                            )
                          })}
                        </div>
                      </TooltipProvider>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {assignedEntities.length > 0 && (
                      <Badge variant="secondary">{assignedEntities.length} assigned</Badge>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 border-t">
                  <div className="space-y-4 pt-4">
                    {/* License Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">RAO Article:</span>
                        <span className="ml-2">{license.raoArticle}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">FCA Handbook:</span>
                        <span className="ml-2">{license.fcaHandbook}</span>
                      </div>
                    </div>

                    {/* Definition */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">Definition</h4>
                      <p className="text-sm text-muted-foreground">{license.definition}</p>
                    </div>

                    {/* Purpose */}
                    {license.purpose && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Purpose</h4>
                        <p className="text-sm text-muted-foreground">{license.purpose}</p>
                      </div>
                    )}

                    {/* When Required */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">When Required</h4>
                      <p className="text-sm text-muted-foreground">{license.whenRequired}</p>
                    </div>

                    {/* Examples */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">Examples</h4>
                      <p className="text-sm text-muted-foreground">{license.examples}</p>
                    </div>

                    {/* Typical Firms & Applies To */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Typical Firms</h4>
                        <p className="text-sm text-muted-foreground">{license.typicalFirms}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Applies To</h4>
                        <p className="text-sm text-muted-foreground">{license.appliesTo}</p>
                      </div>
                    </div>

                    {/* Critical Note */}
                    {license.criticalNote && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800 text-sm">
                          <strong>Critical:</strong> {license.criticalNote}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Regulatory Note */}
                    {license.regulatoryNote && (
                      <Alert className="border-amber-200 bg-amber-50">
                        <Info className="w-4 h-4 text-amber-600" />
                        <AlertDescription className="text-amber-800 text-sm">
                          <strong>Regulatory Note:</strong> {license.regulatoryNote}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* AI Reasoning Section - Shows why entities are assigned to this license */}
                    {(() => {
                      const assignedEntities = entities.filter((e) => {
                        const status = getEntityStatus(license.id, e.id)
                        return status !== "not_assigned"
                      })
                      const hasAIReasons = assignedEntities.some((e) => {
                        const key = `${e.id}-${license.id}`
                        return lastEstimationResults.get(key)
                      })

                      if (hasAIReasons && assignedEntities.length > 0) {
                        return (
                          <Alert className="border-blue-200 bg-blue-50">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <AlertDescription className="text-blue-800 text-sm">
                              <strong>AI Analysis:</strong>
                              <ul className="mt-2 space-y-1 list-disc list-inside">
                                {assignedEntities
                                  .map((entity) => {
                                    const key = `${entity.id}-${license.id}`
                                    const estimation = lastEstimationResults.get(key)
                                    if (!estimation) return null
                                    return (
                                      <li key={entity.id}>
                                        <span className="font-medium">{entity.entityName || entity.legalName}:</span>{" "}
                                        {estimation.reasoning}
                                      </li>
                                    )
                                  })
                                  .filter(Boolean)}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )
                      }
                      return null
                    })()}

                    {/* Entity Assignments - Compact Table Format */}
                    <div>
                      <h4 className="font-medium text-sm mb-3">Legal Entity Assignments</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-2 font-medium">Entity</th>
                              <th className="text-left p-2 font-medium hidden sm:table-cell">Regulator</th>
                              <th className="text-right p-2 font-medium w-[140px]">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {entities.map((entity) => {
                              const currentStatus = getEntityStatus(license.id, entity.id)
                              return (
                                <tr key={entity.id} className="hover:bg-muted/30">
                                  <td className="p-2">
                                    <p className="font-medium truncate max-w-[200px]">
                                      {entity.entityName || entity.legalName || "Unknown Entity"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:hidden">
                                      {entity.regulator || "No regulator"}
                                    </p>
                                  </td>
                                  <td className="p-2 hidden sm:table-cell">
                                    <span className="text-muted-foreground truncate block max-w-[150px]">
                                      {entity.regulator || "N/A"}
                                    </span>
                                  </td>
                                  <td className="p-2 text-right">
                                    <Select
                                      value={currentStatus}
                                      onValueChange={(value) =>
                                        setEntityStatus(license.id, entity.id, value as LicenseStatus | "not_assigned")
                                      }
                                    >
                                      <SelectTrigger className="w-[130px] h-8 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="not_assigned">Not Assigned</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="revoked">Revoked</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                      {entities.length > 10 && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Showing all {entities.length} entities
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {filteredLicenses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No licences match your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

console.log("[v0] FCA_LICENSES_CATALOGUE loaded:", FCA_LICENSES_CATALOGUE?.length || 0, "licenses")
console.log("[v0] FCA_LICENSE_CATEGORIES loaded:", FCA_LICENSE_CATEGORIES?.length || 0, "categories")
