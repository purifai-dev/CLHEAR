"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, RotateCcw, Check, X, Pencil, ChevronDown, ChevronRight, Plus } from "lucide-react"
import { COUNTRIES_CATALOGUE, type Country } from "@/lib/countries-catalogue"
import { FCA_LICENSES_CATALOGUE } from "@/lib/fca-licenses-catalogue"
import { PRODUCTS_SERVICES_CATALOGUE } from "@/lib/products-services-catalogue"

// Types
interface LegalEntity {
  id: string
  name: string
  regulator?: string
  businessPurpose?: string
}

interface CountryConfig {
  countryCode: string
  entityId: string
  regulator: string
  licenses: string[]
  offerings: Record<string, boolean>
}

interface ProductAssignment {
  productId: string
  entityIds: string[]
}

// Available regulators
const REGULATORS = [
  "FCA (UK)",
  "CySEC (Cyprus)",
  "BaFin (Germany)",
  "AMF (France)",
  "CONSOB (Italy)",
  "CNMV (Spain)",
  "AFM (Netherlands)",
  "FINMA (Switzerland)",
  "SEC (USA)",
  "ASIC (Australia)",
  "MAS (Singapore)",
  "SFC (Hong Kong)",
  "FSA (Japan)",
  "Passported (MiFID II)",
  "Cross-Border Exempt",
  "Reverse Solicitation",
  "Local License Required",
  "Not Permitted",
]

const STORAGE_KEY = "clhear-cross-border-matrix"

export function CrossBorderMatrixContent() {
  // State
  const [entities, setEntities] = useState<LegalEntity[]>([])
  const [assignedProducts, setAssignedProducts] = useState<{ id: string; name: string }[]>([])
  const [configs, setConfigs] = useState<CountryConfig[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set(["Europe"]))
  const [isLoading, setIsLoading] = useState(true)

  // Edit dialog state
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editEntity, setEditEntity] = useState<string>("")
  const [editRegulator, setEditRegulator] = useState<string>("")
  const [editLicenses, setEditLicenses] = useState<string[]>([])
  const [editOfferings, setEditOfferings] = useState<Record<string, boolean>>({})

  // Load data from localStorage
  useEffect(() => {
    console.log("[v0] Loading cross-border matrix data...")

    // Load entities
    const storedEntities = localStorage.getItem("clhear-entities")
    if (storedEntities) {
      try {
        const parsed = JSON.parse(storedEntities)
        console.log("[v0] Loaded entities:", parsed.length)
        setEntities(parsed)
      } catch (e) {
        console.log("[v0] Failed to parse entities")
      }
    }

    // Load product assignments
    const storedAssignments = localStorage.getItem("clhear-product-assignments")
    if (storedAssignments) {
      try {
        const assignments: ProductAssignment[] = JSON.parse(storedAssignments)
        const assignedProductIds = new Set<string>()
        assignments.forEach((a) => {
          if (a.entityIds && a.entityIds.length > 0) {
            assignedProductIds.add(a.productId)
          }
        })

        const products = PRODUCTS_SERVICES_CATALOGUE.filter((p) => assignedProductIds.has(p.id)).map((p) => ({
          id: p.id,
          name: p.name,
        }))
        console.log("[v0] Loaded assigned products:", products.length)
        setAssignedProducts(products)
      } catch (e) {
        console.log("[v0] Failed to parse product assignments")
      }
    }

    // Load configs
    const storedConfigs = localStorage.getItem(STORAGE_KEY)
    if (storedConfigs) {
      try {
        const parsed = JSON.parse(storedConfigs)
        if (Array.isArray(parsed)) {
          console.log("[v0] Loaded configs:", parsed.length)
          setConfigs(parsed)
        } else {
          console.log("[v0] Configs is not an array, using empty array")
          setConfigs([])
        }
      } catch (e) {
        console.log("[v0] Failed to parse configs")
        setConfigs([])
      }
    } else {
      console.log("[v0] No configs in localStorage")
      setConfigs([])
    }

    setIsLoading(false)
  }, [])

  // Save configs to localStorage
  const saveConfigs = (newConfigs: CountryConfig[]) => {
    console.log("[v0] Saving configs:", newConfigs.length, JSON.stringify(newConfigs).slice(0, 200))
    setConfigs(newConfigs)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfigs))
  }

  // Get config for a country
  const getCountryConfigs = (countryCode: string): CountryConfig[] => {
    return configs.filter((c) => c.countryCode === countryCode)
  }

  // Toggle product offering directly in table
  const toggleOffering = (countryCode: string, entityId: string, productId: string) => {
    console.log("[v0] Toggle offering called:", countryCode, entityId, productId)
    console.log("[v0] Current configs count:", configs.length)

    const configIndex = configs.findIndex((c) => c.countryCode === countryCode && c.entityId === entityId)
    console.log("[v0] Found config at index:", configIndex)

    if (configIndex === -1) {
      console.log("[v0] No config found for this country/entity")
      return
    }

    const config = configs[configIndex]
    const currentValue = config.offerings[productId]
    let newValue: boolean

    // Cycle through: undefined -> true -> false -> true
    if (currentValue === undefined || currentValue === false) {
      newValue = true
    } else {
      newValue = false
    }

    console.log("[v0] Changing from", currentValue, "to", newValue)

    const newConfig = {
      ...config,
      offerings: {
        ...config.offerings,
        [productId]: newValue,
      },
    }

    const newConfigs = [...configs]
    newConfigs[configIndex] = newConfig
    saveConfigs(newConfigs)
  }

  // Open edit dialog for a country
  const openEditDialog = (country: Country, existingConfig?: CountryConfig) => {
    console.log("[v0] Opening edit dialog for:", country.name, "existing:", !!existingConfig)
    setEditingCountry(country)

    if (existingConfig) {
      setEditEntity(existingConfig.entityId)
      setEditRegulator(existingConfig.regulator)
      setEditLicenses([...existingConfig.licenses])
      setEditOfferings({ ...existingConfig.offerings })
    } else {
      // Default to first entity if available
      setEditEntity(entities.length > 0 ? entities[0].id : "")
      setEditRegulator("")
      setEditLicenses([])
      // Default all products to undefined (not set)
      const defaultOfferings: Record<string, boolean> = {}
      setEditOfferings(defaultOfferings)
    }

    setDialogOpen(true)
  }

  // Save edit dialog
  const saveEditDialog = () => {
    if (!editingCountry || !editEntity) {
      console.log("[v0] Cannot save - no country or entity selected")
      return
    }

    console.log("[v0] Saving edit dialog:", editingCountry.code, editEntity)

    const existingIndex = configs.findIndex((c) => c.countryCode === editingCountry.code && c.entityId === editEntity)

    const newConfig: CountryConfig = {
      countryCode: editingCountry.code,
      entityId: editEntity,
      regulator: editRegulator,
      licenses: editLicenses,
      offerings: editOfferings,
    }

    let newConfigs: CountryConfig[]
    if (existingIndex >= 0) {
      newConfigs = [...configs]
      newConfigs[existingIndex] = newConfig
      console.log("[v0] Updated existing config at index:", existingIndex)
    } else {
      newConfigs = [...configs, newConfig]
      console.log("[v0] Added new config, total:", newConfigs.length)
    }

    saveConfigs(newConfigs)
    setDialogOpen(false)
    setEditingCountry(null)
  }

  // Delete config
  const deleteConfig = (countryCode: string, entityId: string) => {
    console.log("[v0] Deleting config:", countryCode, entityId)
    const newConfigs = configs.filter((c) => !(c.countryCode === countryCode && c.entityId === entityId))
    saveConfigs(newConfigs)
  }

  // Reset all data
  const resetAll = () => {
    console.log("[v0] Resetting all configs")
    saveConfigs([])
  }

  // Toggle region expansion
  const toggleRegion = (region: string) => {
    const newExpanded = new Set(expandedRegions)
    if (newExpanded.has(region)) {
      newExpanded.delete(region)
    } else {
      newExpanded.add(region)
    }
    setExpandedRegions(newExpanded)
  }

  // Get unique regions
  const regions = [...new Set(COUNTRIES_CATALOGUE.map((c) => c.region))]

  // Filter countries
  const filteredCountries = COUNTRIES_CATALOGUE.filter((country) => {
    const matchesSearch =
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = regionFilter === "all" || country.region === regionFilter
    return matchesSearch && matchesRegion
  })

  // Group by region
  const countriesByRegion = regions.reduce(
    (acc, region) => {
      acc[region] = filteredCountries.filter((c) => c.region === region)
      return acc
    },
    {} as Record<string, Country[]>,
  )

  // Get entity name
  const getEntityName = (entityId: string) => {
    const entity = entities.find((e) => e.id === entityId)
    return entity?.name || entityId
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading cross-border matrix...</p>
        </CardContent>
      </Card>
    )
  }

  if (entities.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No legal entities found.</p>
          <p className="text-sm text-muted-foreground">
            Please add legal entities in the Company Profile section first.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (assignedProducts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No products have been assigned to entities.</p>
          <p className="text-sm text-muted-foreground">
            Please assign products to legal entities in the Products & Services section first.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cross-Border Offering Matrix</CardTitle>
                <CardDescription>
                  Configure which products each entity offers in each country. Click + to add an entity to a country,
                  then use the checkmarks to toggle offerings.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetAll}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
              <span>Entities: {entities.length}</span>
              <span>Products: {assignedProducts.length}</span>
              <span>Configurations: {configs.length}</span>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-auto max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">Country</TableHead>
                    <TableHead className="min-w-[150px]">Entity</TableHead>
                    <TableHead className="min-w-[120px]">Regulator</TableHead>
                    <TableHead className="min-w-[150px]">Licenses</TableHead>
                    {assignedProducts.map((product) => (
                      <TableHead key={product.id} className="text-center min-w-[80px] max-w-[100px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block truncate cursor-help">{product.name}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{product.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                    ))}
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regions.map((region) => {
                    const regionCountries = countriesByRegion[region] || []
                    if (regionCountries.length === 0) return null

                    const isExpanded = expandedRegions.has(region)

                    return (
                      <React.Fragment key={region}>
                        {/* Region Header */}
                        <TableRow
                          className="bg-muted/50 cursor-pointer hover:bg-muted"
                          onClick={() => toggleRegion(region)}
                        >
                          <TableCell colSpan={5 + assignedProducts.length} className="font-semibold">
                            <div className="flex items-center gap-2">
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              {region} ({regionCountries.length} countries)
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Country Rows */}
                        {isExpanded &&
                          regionCountries.map((country) => {
                            const countryConfigs = getCountryConfigs(country.code)

                            // If no configs, show single row with + button
                            if (countryConfigs.length === 0) {
                              return (
                                <TableRow key={country.code}>
                                  <TableCell className="sticky left-0 bg-background">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{getFlag(country.code)}</span>
                                      <span>{country.name}</span>
                                      {country.isEU && (
                                        <Badge variant="secondary" className="text-xs">
                                          EU
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell colSpan={3 + assignedProducts.length}>
                                    <span className="text-muted-foreground text-sm italic">No entity configured</span>
                                  </TableCell>
                                  <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(country)}>
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            }

                            // Render a row for each config
                            return countryConfigs.map((config, idx) => (
                              <TableRow key={`${country.code}-${config.entityId}`}>
                                <TableCell className="sticky left-0 bg-background">
                                  {idx === 0 && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{getFlag(country.code)}</span>
                                      <span>{country.name}</span>
                                      {country.isEU && (
                                        <Badge variant="secondary" className="text-xs">
                                          EU
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium text-sm">{getEntityName(config.entityId)}</span>
                                </TableCell>
                                <TableCell>
                                  {config.regulator ? (
                                    <Badge variant="outline" className="text-xs">
                                      {config.regulator}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">Not set</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {config.licenses.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {config.licenses.slice(0, 2).map((licId) => {
                                        const lic = FCA_LICENSES_CATALOGUE.find((l) => l.id === licId)
                                        return (
                                          <Badge key={licId} variant="secondary" className="text-xs">
                                            {lic?.name?.slice(0, 15) || licId}...
                                          </Badge>
                                        )
                                      })}
                                      {config.licenses.length > 2 && (
                                        <Badge variant="secondary" className="text-xs">
                                          +{config.licenses.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">None</span>
                                  )}
                                </TableCell>
                                {assignedProducts.map((product) => {
                                  const isOffered = config.offerings[product.id] === true
                                  const isNotOffered = config.offerings[product.id] === false

                                  return (
                                    <TableCell key={product.id} className="text-center p-1">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          toggleOffering(country.code, config.entityId, product.id)
                                        }}
                                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer ${
                                          isOffered
                                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                                            : isNotOffered
                                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                        }`}
                                      >
                                        {isOffered ? (
                                          <Check className="h-4 w-4" />
                                        ) : isNotOffered ? (
                                          <X className="h-4 w-4" />
                                        ) : (
                                          <span className="text-xs">—</span>
                                        )}
                                      </button>
                                    </TableCell>
                                  )
                                })}
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        openEditDialog(country, config)
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        deleteConfig(country.code, config.entityId)
                                      }}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          })}
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure {editingCountry?.name}</DialogTitle>
              <DialogDescription>
                Set entity, regulator, licenses, and product offerings for this country
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Entity Selection */}
              <div className="space-y-2">
                <Label>Legal Entity *</Label>
                <Select value={editEntity} onValueChange={setEditEntity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Regulator Selection */}
              <div className="space-y-2">
                <Label>Regulator</Label>
                <Select value={editRegulator} onValueChange={setEditRegulator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a regulator" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGULATORS.map((reg) => (
                      <SelectItem key={reg} value={reg}>
                        {reg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Licenses Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Licenses</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditLicenses(FCA_LICENSES_CATALOGUE.map((l) => l.id))}
                    >
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditLicenses([])}>
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                  {FCA_LICENSES_CATALOGUE.map((license) => (
                    <div key={license.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lic-${license.id}`}
                        checked={editLicenses.includes(license.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditLicenses([...editLicenses, license.id])
                          } else {
                            setEditLicenses(editLicenses.filter((id) => id !== license.id))
                          }
                        }}
                      />
                      <label htmlFor={`lic-${license.id}`} className="text-sm cursor-pointer">
                        {license.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Offerings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Product Offerings</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const allOffered: Record<string, boolean> = {}
                        assignedProducts.forEach((p) => {
                          allOffered[p.id] = true
                        })
                        setEditOfferings(allOffered)
                      }}
                    >
                      All Offered
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const noneOffered: Record<string, boolean> = {}
                        assignedProducts.forEach((p) => {
                          noneOffered[p.id] = false
                        })
                        setEditOfferings(noneOffered)
                      }}
                    >
                      None Offered
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                  {assignedProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <span className="text-sm">{product.name}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            editOfferings[product.id] === true
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          onClick={() => setEditOfferings({ ...editOfferings, [product.id]: true })}
                        >
                          Offered
                        </button>
                        <button
                          type="button"
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            editOfferings[product.id] === false
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          onClick={() => setEditOfferings({ ...editOfferings, [product.id]: false })}
                        >
                          Not Offered
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveEditDialog} disabled={!editEntity}>
                Save Configuration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

// Helper function to get country flag emoji
function getFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
