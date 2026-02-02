"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Building2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { generateCompanyProfile } from "@/app/actions/generate-company-profile"
import { generateBusinessPurpose } from "@/app/actions/generate-business-purpose"

interface LegalEntity {
  id: string
  entityType: "group" | "subsidiary"
  // Core GLEIF fields
  entityName: string // Primary Legal Name
  lei: string // LEI Code
  registeredAt: string // Registry name (e.g., Companies House)
  registeredAs: string // Company/registration number
  jurisdictionOfFormation: string // Country code (e.g., GB)
  generalCategory: string // GENERAL, BRANCH, FUND, etc.
  entityLegalForm: string // Private Limited Company, PLC, etc.
  entityStatus: "ACTIVE" | "INACTIVE" | "PENDING" | ""
  entityCreatedAt: string // Date of incorporation
  registeredAddress: string // Full legal address
  businessPurpose: string // Description of entity's business activities
  entityRole: string // Role of the entity
  regulator: string // Regulator of the entity
  licenseType: string // Type of license
  // Additional identifiers
  bicCode: string // SWIFT/BIC code
  openCorporatesId: string // OpenCorporates ID
  qccCode: string // QCC Code
  spCiqCompanyId: string // S&P CIQ Company ID
  // Relationship
  parentEntityId: string
  logo: string
}

const defaultEntity: LegalEntity = {
  id: "1",
  entityType: "group",
  entityName: "",
  lei: "",
  registeredAt: "",
  registeredAs: "",
  jurisdictionOfFormation: "",
  generalCategory: "",
  entityLegalForm: "",
  entityStatus: "",
  entityCreatedAt: "",
  registeredAddress: "",
  businessPurpose: "",
  entityRole: "",
  regulator: "",
  licenseType: "",
  bicCode: "",
  openCorporatesId: "",
  qccCode: "",
  spCiqCompanyId: "",
  parentEntityId: "",
  logo: "",
}

export function LegalEntitiesContent() {
  const [entities, setEntities] = useState<LegalEntity[]>([defaultEntity])
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(new Set(["1"]))
  const [companyName, setCompanyName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const [generatingBusinessPurpose, setGeneratingBusinessPurpose] = useState<Record<string, boolean>>({})

  // Load saved data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("company-profile")
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        if (parsed.companyName) setCompanyName(parsed.companyName)
        if (parsed.entities && parsed.entities.length > 0) {
          const mappedEntities = parsed.entities.map((e: any) => ({
            id: e.id,
            entityType: e.entityType || "group",
            entityName: e.entityName || "",
            lei: e.lei || "",
            registeredAt: e.registeredAt || "",
            registeredAs: e.registeredAs || "",
            jurisdictionOfFormation: e.jurisdictionOfFormation || "",
            generalCategory: e.generalCategory || "",
            entityLegalForm: e.entityLegalForm || "",
            entityStatus: e.entityStatus || "",
            entityCreatedAt: e.entityCreatedAt || "",
            registeredAddress: e.registeredAddress || "",
            businessPurpose: e.businessPurpose || "",
            entityRole: e.entityRole || "",
            regulator: e.regulator || "",
            licenseType: e.licenseType || "",
            bicCode: e.bicCode || "",
            openCorporatesId: e.openCorporatesId || "",
            qccCode: e.qccCode || "",
            spCiqCompanyId: e.spCiqCompanyId || "",
            parentEntityId: e.parentEntityId || "",
            logo: e.logo || "",
          }))
          setEntities(mappedEntities)
          setExpandedEntities(new Set([mappedEntities[0]?.id || "1"]))
        }
      } catch (e) {
        console.error("Failed to parse saved profile:", e)
      }
    }
  }, [])

  // Auto-save on changes
  useEffect(() => {
    const savedProfile = localStorage.getItem("company-profile")
    let existingData: any = {}
    if (savedProfile) {
      try {
        existingData = JSON.parse(savedProfile)
      } catch (e) {}
    }

    // Merge entity data with existing license data
    const mergedEntities = entities.map((entity) => {
      const existingEntity = existingData.entities?.find((e: any) => e.id === entity.id)
      return {
        ...entity,
        regulator: existingEntity?.regulator || "",
        licenseType: existingEntity?.licenseType || "",
        licenseId: existingEntity?.licenseId || "",
      }
    })

    const dataToSave = {
      ...existingData,
      companyName,
      entities: mergedEntities,
    }
    localStorage.setItem("company-profile", JSON.stringify(dataToSave))
    localStorage.setItem("clhear-entities", JSON.stringify(mergedEntities))
  }, [entities, companyName])

  const groupEntities = entities.filter((e) => e.entityType === "group")
  const subsidiaryEntities = entities.filter((e) => e.entityType === "subsidiary")

  const addEntity = (type: "group" | "subsidiary") => {
    const newId = `entity-${Date.now()}`
    const newEntity: LegalEntity = {
      id: newId,
      entityType: type,
      entityName: "",
      lei: "",
      registeredAt: "",
      registeredAs: "",
      jurisdictionOfFormation: "",
      generalCategory: "GENERAL",
      entityLegalForm: "",
      entityStatus: "ACTIVE",
      entityCreatedAt: "",
      registeredAddress: "",
      businessPurpose: "", // Added business purpose field
      entityRole: "",
      regulator: "",
      licenseType: "",
      bicCode: "",
      openCorporatesId: "",
      qccCode: "",
      spCiqCompanyId: "",
      parentEntityId: type === "subsidiary" && groupEntities.length > 0 ? groupEntities[0].id : "",
      logo: "",
    }
    setEntities([...entities, newEntity])
    setExpandedEntities(new Set([...expandedEntities, newId]))
  }

  const removeEntity = (id: string) => {
    const updatedEntities = entities.filter((e) => e.id !== id)
    const finalEntities = updatedEntities.map((e) => {
      if (e.parentEntityId === id) {
        return { ...e, parentEntityId: "" }
      }
      return e
    })

    setEntities(finalEntities)

    const newExpanded = new Set(expandedEntities)
    newExpanded.delete(id)
    setExpandedEntities(newExpanded)

    // Immediately save to localStorage
    const savedProfile = localStorage.getItem("company-profile")
    let existingData: any = {}
    if (savedProfile) {
      try {
        existingData = JSON.parse(savedProfile)
      } catch (e) {}
    }

    const mergedEntities = finalEntities.map((entity) => {
      const existingEntity = existingData.entities?.find((e: any) => e.id === entity.id)
      return {
        ...entity,
        regulator: existingEntity?.regulator || "",
        licenseType: existingEntity?.licenseType || "",
        licenseId: existingEntity?.licenseId || "",
      }
    })

    localStorage.setItem(
      "company-profile",
      JSON.stringify({
        ...existingData,
        companyName,
        entities: mergedEntities,
      }),
    )
    localStorage.setItem("clhear-entities", JSON.stringify(mergedEntities))
  }

  const updateEntity = (id: string, updates: Partial<LegalEntity>) => {
    setEntities(entities.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedEntities)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedEntities(newExpanded)
  }

  const handleLogoUpload = (entityId: string, file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      updateEntity(entityId, { logo: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleAIGeneration = async () => {
    if (!companyName.trim()) {
      setGenerationError("Please enter a company name first")
      return
    }

    setIsGenerating(true)
    setGenerationError(null)

    try {
      const result = await generateCompanyProfile(companyName)

      if (result.entities && result.entities.length > 0) {
        const mappedEntities: LegalEntity[] = result.entities.map((e: any, index: number) => ({
          id: `entity-${Date.now()}-${index}`,
          entityType: e.entityType || "subsidiary",
          entityName: e.entityName || e.legalName || "",
          lei: e.lei || "",
          registeredAt: e.registeredAt || "",
          registeredAs: e.registeredAs || "",
          jurisdictionOfFormation: e.jurisdictionOfFormation || e.jurisdiction || "",
          generalCategory: e.generalCategory || "GENERAL",
          entityLegalForm: e.entityLegalForm || "",
          entityStatus: e.entityStatus || "ACTIVE",
          entityCreatedAt: e.entityCreatedAt || "",
          registeredAddress: e.registeredAddress || e.address || "",
          businessPurpose: e.businessPurpose || "",
          entityRole: e.entityRole || "",
          regulator: e.regulator || "",
          licenseType: e.licenseType || "",
          bicCode: e.bicCode || "",
          openCorporatesId: e.openCorporatesId || "",
          qccCode: e.qccCode || "",
          spCiqCompanyId: e.spCiqCompanyId || "",
          parentEntityId: "",
          logo: "",
        }))

        // Link subsidiaries to first group entity
        const firstGroup = mappedEntities.find((e) => e.entityType === "group")
        if (firstGroup) {
          mappedEntities.forEach((e) => {
            if (e.entityType === "subsidiary") {
              e.parentEntityId = firstGroup.id
            }
          })
        }

        setEntities(mappedEntities)
        setExpandedEntities(new Set(mappedEntities.map((e) => e.id)))

        // Save with merged license data
        const savedProfile = localStorage.getItem("company-profile")
        let existingData: any = {}
        if (savedProfile) {
          try {
            existingData = JSON.parse(savedProfile)
          } catch (e) {}
        }

        const fullEntities = result.entities.map((e: any, index: number) => ({
          ...mappedEntities[index],
          regulator: e.regulator || "",
          licenseType: e.licenseType || "",
          licenseId: e.licenseId || "",
        }))

        localStorage.setItem(
          "company-profile",
          JSON.stringify({
            ...existingData,
            companyName,
            entities: fullEntities,
          }),
        )
        localStorage.setItem("clhear-entities", JSON.stringify(fullEntities))
      }
    } catch (error) {
      console.error("Generation failed:", error)
      setGenerationError("Failed to generate company profile. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateBusinessPurpose = async (entity: LegalEntity) => {
    setGeneratingBusinessPurpose((prev) => ({ ...prev, [entity.id]: true }))
    try {
      const result = await generateBusinessPurpose(
        entity.entityName,
        entity.jurisdictionOfFormation || "",
        entity.entityRole || "",
        entity.regulator || "",
        entity.licenseType || "",
      )
      if (result.success && result.businessPurpose) {
        updateEntity(entity.id, { businessPurpose: result.businessPurpose })
      }
    } catch (error) {
      console.error("[v0] Failed to generate business purpose:", error)
    } finally {
      setGeneratingBusinessPurpose((prev) => ({ ...prev, [entity.id]: false }))
    }
  }

  const renderEntityCard = (entity: LegalEntity) => {
    const isExpanded = expandedEntities.has(entity.id)
    const parentEntity = groupEntities.find((g) => g.id === entity.parentEntityId)

    return (
      <Card key={entity.id} className="border border-border">
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors py-3"
          onClick={() => toggleExpand(entity.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              {entity.logo ? (
                <img src={entity.logo || "/placeholder.svg"} alt="Logo" className="w-8 h-8 rounded object-contain" />
              ) : (
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div>
                <CardTitle className="text-sm font-medium">{entity.entityName || "Unnamed Entity"}</CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {entity.entityType === "group" ? "Group / Holding" : "Subsidiary"}
                    {parentEntity && ` • Parent: ${parentEntity.entityName}`}
                  </p>
                  {entity.entityStatus && (
                    <Badge
                      variant={entity.entityStatus === "ACTIVE" ? "default" : "secondary"}
                      className="text-[10px] h-4"
                    >
                      {entity.entityStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                removeEntity(entity.id)
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 space-y-6">
            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(el) => {
                  fileInputRefs.current[entity.id] = el
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleLogoUpload(entity.id, file)
                }}
              />
              {entity.logo ? (
                <div className="relative">
                  <img
                    src={entity.logo || "/placeholder.svg"}
                    alt="Entity logo"
                    className="w-16 h-16 rounded-lg object-contain border border-border"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => updateEntity(entity.id, { logo: "" })}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRefs.current[entity.id]?.click()}
                >
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="text-xs text-muted-foreground">Click to upload logo</div>
            </div>

            {/* Entity Type Toggle */}
            <div>
              <Label className="text-sm font-medium">Entity Type</Label>
              <Select
                value={entity.entityType}
                onValueChange={(value: "group" | "subsidiary") => {
                  updateEntity(entity.id, {
                    entityType: value,
                    parentEntityId: value === "group" ? "" : entity.parentEntityId,
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group">Group / Holding Company</SelectItem>
                  <SelectItem value="subsidiary">Subsidiary / Operating Entity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                GLEIF Registration Details
              </h4>

              {/* Primary Legal Name */}
              <div>
                <Label className="text-sm font-medium">(Primary) Legal Name</Label>
                <Input
                  value={entity.entityName}
                  onChange={(e) => updateEntity(entity.id, { entityName: e.target.value })}
                  placeholder="e.g., ETORO (UK) LIMITED"
                />
              </div>

              {/* LEI Code */}
              <div>
                <Label className="text-sm font-medium">LEI Code</Label>
                <Input
                  value={entity.lei}
                  onChange={(e) => updateEntity(entity.id, { lei: e.target.value })}
                  placeholder="e.g., 213800FLAB1OVA8OHT72"
                />
              </div>

              {/* Registered At */}
              <div>
                <Label className="text-sm font-medium">Registered At</Label>
                <Textarea
                  value={entity.registeredAt}
                  onChange={(e) => updateEntity(entity.id, { registeredAt: e.target.value })}
                  placeholder="e.g., Companies Register (Companies House)&#10;England and Wales, United Kingdom&#10;RA000585"
                  className="min-h-[80px]"
                />
              </div>

              {/* Registered As (Company Number) */}
              <div>
                <Label className="text-sm font-medium">Registered As (Company Number)</Label>
                <Input
                  value={entity.registeredAs}
                  onChange={(e) => updateEntity(entity.id, { registeredAs: e.target.value })}
                  placeholder="e.g., 07973792"
                />
              </div>

              {/* Jurisdiction Of Formation */}
              <div>
                <Label className="text-sm font-medium">Jurisdiction Of Formation</Label>
                <Input
                  value={entity.jurisdictionOfFormation}
                  onChange={(e) => updateEntity(entity.id, { jurisdictionOfFormation: e.target.value })}
                  placeholder="e.g., GB, CY, US"
                />
              </div>

              {/* General Category */}
              <div>
                <Label className="text-sm font-medium">General Category</Label>
                <Select
                  value={entity.generalCategory || "GENERAL"}
                  onValueChange={(value) => updateEntity(entity.id, { generalCategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">GENERAL</SelectItem>
                    <SelectItem value="BRANCH">BRANCH</SelectItem>
                    <SelectItem value="FUND">FUND</SelectItem>
                    <SelectItem value="SOLE_PROPRIETOR">SOLE_PROPRIETOR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Entity Legal Form */}
              <div>
                <Label className="text-sm font-medium">Entity Legal Form</Label>
                <Textarea
                  value={entity.entityLegalForm}
                  onChange={(e) => updateEntity(entity.id, { entityLegalForm: e.target.value })}
                  placeholder="e.g., Private Limited Company (en)&#10;H0PO"
                  className="min-h-[60px]"
                />
              </div>

              {/* Entity Status */}
              <div>
                <Label className="text-sm font-medium">Entity Status</Label>
                <Select
                  value={entity.entityStatus || "ACTIVE"}
                  onValueChange={(value: "ACTIVE" | "INACTIVE" | "PENDING" | "") =>
                    updateEntity(entity.id, { entityStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Entity Created At */}
              <div>
                <Label className="text-sm font-medium">Entity Created At</Label>
                <Input
                  value={entity.entityCreatedAt}
                  onChange={(e) => updateEntity(entity.id, { entityCreatedAt: e.target.value })}
                  placeholder="e.g., 2012-03-02"
                  type="date"
                />
              </div>

              {/* Registered Address */}
              <div>
                <Label className="text-sm font-medium">Legal Address</Label>
                <Textarea
                  value={entity.registeredAddress}
                  onChange={(e) => updateEntity(entity.id, { registeredAddress: e.target.value })}
                  placeholder="Full registered/legal address"
                  className="min-h-[80px]"
                />
              </div>

              {/* Business Purpose */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm font-medium">Business Purpose</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateBusinessPurpose(entity)}
                    disabled={generatingBusinessPurpose[entity.id] || !entity.entityName}
                    className="h-7 text-xs gap-1"
                  >
                    {generatingBusinessPurpose[entity.id] ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  value={entity.businessPurpose || ""}
                  onChange={(e) => updateEntity(entity.id, { businessPurpose: e.target.value })}
                  placeholder="Describe the entity's business activities, services offered, and target markets (e.g., 'Provides investment services including portfolio management, investment advice, and execution of client orders for retail and professional clients across EU markets')"
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-1">Used to estimate required licences and permissions</p>
              </div>
            </div>

            {/* Parent Entity (only for subsidiaries) */}
            {entity.entityType === "subsidiary" && (
              <div>
                <Label className="text-sm font-medium">Parent Entity</Label>
                {groupEntities.length === 0 ? (
                  <div className="mt-1">
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                      No group entities defined
                    </div>
                    <p className="text-xs text-amber-500 mt-1">Add a Group entity first to link subsidiaries</p>
                  </div>
                ) : (
                  <Select
                    value={entity.parentEntityId}
                    onValueChange={(value) => updateEntity(entity.id, { parentEntityId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {groupEntities.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.entityName || "Unnamed Group Entity"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    )
  }

  const clearAllEntities = () => {
    setEntities([])
    setExpandedEntities(new Set())
    localStorage.removeItem("company-profile")
    localStorage.removeItem("clhear-entities")
    setCompanyName("")
    setGenerationError(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Legal Entities</h2>
        <p className="text-muted-foreground mt-1">Define your corporate structure and legal entities with GLEIF data</p>
      </div>

      {/* AI Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Generate Legal Entities
          </CardTitle>
          <CardDescription>
            Enter a company name to automatically discover and populate all legal entities in the corporate group
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter company name (e.g., eToro, Revolut, Interactive Brokers)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAIGeneration} disabled={isGenerating || !companyName.trim()}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
            <Button variant="outline" onClick={clearAllEntities} disabled={isGenerating || entities.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
          {generationError && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{generationError}</AlertDescription>
            </Alert>
          )}

          {entities.length > 0 && (
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{entities.length} Total Entities</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {groupEntities.length} Group
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {subsidiaryEntities.length} Subsidiary
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Entities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Group / Holding Companies</h3>
            <Badge variant="outline">{groupEntities.length}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={() => addEntity("group")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Group Entity
          </Button>
        </div>
        {groupEntities.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No group entities defined yet</p>
              <p className="text-sm">Add a holding company or use AI generation</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">{groupEntities.map(renderEntityCard)}</div>
        )}
      </div>

      {/* Subsidiary Entities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Subsidiaries / Operating Entities</h3>
            <Badge variant="outline">{subsidiaryEntities.length}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={() => addEntity("subsidiary")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subsidiary
          </Button>
        </div>
        {subsidiaryEntities.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No subsidiary entities defined yet</p>
              <p className="text-sm">Add operating entities or use AI generation</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">{subsidiaryEntities.map(renderEntityCard)}</div>
        )}
      </div>
    </div>
  )
}
