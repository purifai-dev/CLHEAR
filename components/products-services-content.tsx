"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Search,
  ChevronDown,
  ChevronRight,
  Building2,
  Package,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Info,
} from "lucide-react"
import { PRODUCTS_SERVICES_CATALOGUE, PRODUCT_CATEGORIES } from "@/lib/products-services-catalogue"
import { estimateProductsForEntities } from "@/app/actions/estimate-products"

interface LegalEntity {
  id: string
  entityType: "group" | "subsidiary"
  entityName: string
  lei: string
  registeredAddress: string
  regulator: string
  licenseType: string
  licenseId: string
  parentEntityId: string
  businessPurpose?: string
}

interface ProductAssignment {
  productId: string
  entityIds: string[]
}

interface ProductEstimationResult {
  entityId: string
  productId: string
  reasoning: string
}

interface LicenseAssignment {
  licenseId: string
  entityId: string
  status: string
}

export function ProductsServicesContent() {
  const [entities, setEntities] = useState<LegalEntity[]>([])
  const [assignments, setAssignments] = useState<ProductAssignment[]>([])
  const [licenseAssignments, setLicenseAssignments] = useState<LicenseAssignment[]>([])
  const [estimationResults, setEstimationResults] = useState<ProductEstimationResult[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [expandedProducts, setExpandedProducts] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const isLocalChange = useRef(false)

  // Load entities, assignments, and license assignments from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedEntities = localStorage.getItem("clhear-entities")
        if (storedEntities) {
          setEntities(JSON.parse(storedEntities))
        }

        const storedAssignments = localStorage.getItem("clhear-product-assignments")
        if (storedAssignments) {
          setAssignments(JSON.parse(storedAssignments))
        }

        const storedEstimations = localStorage.getItem("clhear-product-estimations")
        if (storedEstimations) {
          setEstimationResults(JSON.parse(storedEstimations))
        }

        // Load license assignments to cross-reference
        const storedLicenses = localStorage.getItem("clhear-license-assignments")
        if (storedLicenses) {
          setLicenseAssignments(JSON.parse(storedLicenses))
        }
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadData()
  }, [])

  // Auto-save assignments
  useEffect(() => {
    if (assignments.length > 0 || isLocalChange.current) {
      isLocalChange.current = true
      localStorage.setItem("clhear-product-assignments", JSON.stringify(assignments))
    }
  }, [assignments])

  // Toggle entity assignment for a product
  const toggleEntityAssignment = (productId: string, entityId: string) => {
    isLocalChange.current = true
    setAssignments((prev) => {
      const existingAssignment = prev.find((a) => a.productId === productId)
      if (existingAssignment) {
        const hasEntity = existingAssignment.entityIds.includes(entityId)
        if (hasEntity) {
          // Remove entity
          const newEntityIds = existingAssignment.entityIds.filter((id) => id !== entityId)
          if (newEntityIds.length === 0) {
            return prev.filter((a) => a.productId !== productId)
          }
          return prev.map((a) => (a.productId === productId ? { ...a, entityIds: newEntityIds } : a))
        } else {
          // Add entity
          return prev.map((a) => (a.productId === productId ? { ...a, entityIds: [...a.entityIds, entityId] } : a))
        }
      } else {
        // Create new assignment
        return [...prev, { productId, entityIds: [entityId] }]
      }
    })
  }

  // Check if entity is assigned to product
  const isEntityAssigned = (productId: string, entityId: string) => {
    const assignment = assignments.find((a) => a.productId === productId)
    return assignment?.entityIds.includes(entityId) || false
  }

  // Get assigned entities for a product
  const getAssignedEntities = (productId: string) => {
    const assignment = assignments.find((a) => a.productId === productId)
    return assignment?.entityIds || []
  }

  // Get AI reasoning for entity-product match
  const getEstimationReasoning = (productId: string, entityId: string) => {
    const estimation = estimationResults.find((e) => e.productId === productId && e.entityId === entityId)
    return estimation?.reasoning
  }

  // AI-based product generation using server action
  const generateProductsForEntities = async () => {
    setIsGenerating(true)
    setGenerationError(null)

    try {
      const result = await estimateProductsForEntities(entities, licenseAssignments)

      if (result.error) {
        setGenerationError(result.error)
        setIsGenerating(false)
        return
      }

      // Store estimation results for reasoning display
      setEstimationResults(result.estimations)
      localStorage.setItem("clhear-product-estimations", JSON.stringify(result.estimations))

      // Convert estimations to assignments
      const newAssignments: ProductAssignment[] = []
      result.estimations.forEach((estimation) => {
        const existingAssignment = newAssignments.find((a) => a.productId === estimation.productId)
        if (existingAssignment) {
          if (!existingAssignment.entityIds.includes(estimation.entityId)) {
            existingAssignment.entityIds.push(estimation.entityId)
          }
        } else {
          newAssignments.push({ productId: estimation.productId, entityIds: [estimation.entityId] })
        }
      })

      isLocalChange.current = true
      setAssignments(newAssignments)
      localStorage.setItem("clhear-product-assignments", JSON.stringify(newAssignments))
    } catch (error) {
      console.error("Product generation error:", error)
      setGenerationError(error instanceof Error ? error.message : "Failed to generate products")
    }

    setIsGenerating(false)
  }

  // Reset all assignments
  const resetAssignments = () => {
    isLocalChange.current = true
    setAssignments([])
    setEstimationResults([])
    localStorage.removeItem("clhear-product-assignments")
    localStorage.removeItem("clhear-product-estimations")
  }

  // Filter products
  const filteredProducts = PRODUCTS_SERVICES_CATALOGUE.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    const matchesEntity = entityFilter === "all" || getAssignedEntities(product.id).includes(entityFilter)

    return matchesSearch && matchesCategory && matchesEntity
  })

  // Group products by category
  const productsByCategory = PRODUCT_CATEGORIES.map((category) => ({
    category,
    products: filteredProducts.filter((p) => p.category === category),
  })).filter((group) => group.products.length > 0)

  // Toggle product expansion
  const toggleProductExpansion = (productId: string) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  // Statistics
  const totalProducts = PRODUCTS_SERVICES_CATALOGUE.length
  const assignedProducts = assignments.length
  const totalAssignments = assignments.reduce((sum, a) => sum + a.entityIds.length, 0)
  const activeLicenseCount = licenseAssignments.filter((l) => l.status === "active").length

  if (entities.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Products & Services</h1>
          <p className="text-muted-foreground mt-1">Map products and services to your legal entities</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please define legal entities in the Company Profile section first before mapping products and services.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Products & Services</h1>
            <p className="text-muted-foreground mt-1">Map products and services offered by each legal entity</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetAssignments}
              disabled={assignments.length === 0 || isGenerating}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={generateProductsForEntities} disabled={isGenerating} size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? "Analyzing..." : "Estimate Products"}
            </Button>
          </div>
        </div>

        {/* Error message */}
        {generationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{generationError}</AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Total Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{assignedProducts}</div>
              <p className="text-xs text-muted-foreground">Products Mapped</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{totalAssignments}</div>
              <p className="text-xs text-muted-foreground">Entity Mappings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{activeLicenseCount}</div>
              <p className="text-xs text-muted-foreground">Active Licenses</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {PRODUCT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {entities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id}>
                  {entity.entityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products List */}
        <div className="space-y-6">
          {productsByCategory.map(({ category, products }) => (
            <div key={category} className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                {category}
                <Badge variant="secondary" className="ml-2">
                  {products.length}
                </Badge>
              </h2>

              <div className="space-y-2">
                {products.map((product) => {
                  const assignedEntityIds = getAssignedEntities(product.id)
                  const isExpanded = expandedProducts.includes(product.id)

                  return (
                    <Card key={product.id}>
                      <Collapsible open={isExpanded} onOpenChange={() => toggleProductExpansion(product.id)}>
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                {isExpanded ? (
                                  <ChevronDown className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                )}
                                <div>
                                  <CardTitle className="text-base">{product.name}</CardTitle>
                                  <CardDescription className="mt-1 line-clamp-2">{product.description}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {assignedEntityIds.length > 0 && (
                                  <div className="flex flex-wrap gap-1 max-w-[300px]">
                                    {assignedEntityIds.slice(0, 3).map((entityId) => {
                                      const entity = entities.find((e) => e.id === entityId)
                                      const reasoning = getEstimationReasoning(product.id, entityId)
                                      return (
                                        <Tooltip key={entityId}>
                                          <TooltipTrigger asChild>
                                            <Badge variant="default" className="text-xs cursor-help">
                                              {entity?.entityName?.split(" ")[0] || "Entity"}
                                              {reasoning && <Info className="ml-1 h-3 w-3" />}
                                            </Badge>
                                          </TooltipTrigger>
                                          {reasoning && (
                                            <TooltipContent side="bottom" className="max-w-sm">
                                              <p className="text-xs">{reasoning}</p>
                                            </TooltipContent>
                                          )}
                                        </Tooltip>
                                      )
                                    })}
                                    {assignedEntityIds.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{assignedEntityIds.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                <Badge variant={assignedEntityIds.length > 0 ? "default" : "outline"}>
                                  {assignedEntityIds.length} {assignedEntityIds.length === 1 ? "entity" : "entities"}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <CardContent className="pt-0 pb-4">
                            {/* AI Analysis Summary */}
                            {estimationResults.filter((e) => e.productId === product.id).length > 0 && (
                              <Alert className="mb-4 bg-blue-50 border-blue-200">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800">
                                  <span className="font-medium">AI Analysis:</span>
                                  <ul className="mt-1 space-y-1 text-sm">
                                    {estimationResults
                                      .filter((e) => e.productId === product.id)
                                      .map((estimation) => {
                                        const entity = entities.find((e) => e.id === estimation.entityId)
                                        return (
                                          <li key={estimation.entityId}>
                                            <strong>{entity?.entityName}</strong>: {estimation.reasoning}
                                          </li>
                                        )
                                      })}
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            )}

                            {/* Entity Assignment Table */}
                            <div className="border rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="text-left p-3 font-medium">Entity</th>
                                    <th className="text-left p-3 font-medium hidden sm:table-cell">Regulator</th>
                                    <th className="text-center p-3 font-medium w-24">Assigned</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y">
                                  {entities.map((entity) => {
                                    const isAssigned = isEntityAssigned(product.id, entity.id)
                                    const reasoning = getEstimationReasoning(product.id, entity.id)

                                    return (
                                      <tr
                                        key={entity.id}
                                        className={`hover:bg-muted/30 transition-colors ${isAssigned ? "bg-primary/5" : ""}`}
                                      >
                                        <td className="p-3">
                                          <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <div className="font-medium">{entity.entityName}</div>
                                              <div className="text-xs text-muted-foreground sm:hidden">
                                                {entity.regulator || "N/A"}
                                              </div>
                                              {reasoning && (
                                                <div className="text-xs text-blue-600 mt-0.5 line-clamp-1">
                                                  AI: {reasoning}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                        <td className="p-3 hidden sm:table-cell text-muted-foreground">
                                          {entity.regulator || "N/A"}
                                        </td>
                                        <td className="p-3 text-center">
                                          <Checkbox
                                            checked={isAssigned}
                                            onCheckedChange={() => toggleEntityAssignment(product.id, entity.id)}
                                          />
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No products found matching your filters.
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
