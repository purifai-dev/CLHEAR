"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Pencil, Trash2, FileText, RotateCcw, ClipboardList } from "lucide-react"

interface Procedure {
  id: string
  name: string
  category: string
  description: string
  purpose: string
  steps: string[]
  responsibleRoles: string[]
  frequency: string
  relatedProducts: string[]
  relatedLicenses: string[]
  documents: string[]
  status: "draft" | "active" | "under-review" | "deprecated"
}

interface ProductAssignment {
  productId: string
  entityIds: string[]
}

const CATEGORIES = [
  "Product Development",
  "Client Onboarding",
  "Transaction Processing",
  "Risk Management",
  "Compliance Monitoring",
  "Reporting",
  "Customer Service",
  "Complaint Handling",
  "Data Management",
  "Security & Access",
  "Business Continuity",
  "Change Management",
]

const FREQUENCIES = [
  "On demand",
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Annually",
  "Ad-hoc",
  "Per transaction",
  "Per client",
]

const STORAGE_KEY = "clhear-operations-procedures"

export function OperationsProceduresContent() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([])
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [licenses, setLicenses] = useState<{ id: string; name: string }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null)
  const [formData, setFormData] = useState<Partial<Procedure>>({})

  // Load data
  useEffect(() => {
    // Load roles
    const storedRoles = localStorage.getItem("clhear-operations-roles")
    if (storedRoles) {
      try {
        const parsed = JSON.parse(storedRoles)
        if (Array.isArray(parsed)) {
          setRoles(parsed.map((r: any) => ({ id: r.id, name: r.name })))
        }
      } catch (e) {}
    }

    // Load products
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
        const { PRODUCTS_SERVICES_CATALOGUE } = require("@/lib/products-services-catalogue")
        const prods = PRODUCTS_SERVICES_CATALOGUE.filter((p: any) => assignedProductIds.has(p.id)).map((p: any) => ({
          id: p.id,
          name: p.name,
        }))
        setProducts(prods)
      } catch (e) {}
    }

    // Load licenses
    const storedLicenses = localStorage.getItem("clhear-license-assignments")
    if (storedLicenses) {
      try {
        const assignments = JSON.parse(storedLicenses)
        const activeLicenseIds = new Set<string>()
        Object.entries(assignments).forEach(([licenseId, entityAssignments]: [string, any]) => {
          Object.values(entityAssignments).forEach((status: any) => {
            if (status === "active") {
              activeLicenseIds.add(licenseId)
            }
          })
        })
        const { FCA_LICENSES_CATALOGUE } = require("@/lib/fca-licenses-catalogue")
        const lics = FCA_LICENSES_CATALOGUE.filter((l: any) => activeLicenseIds.has(l.id)).map((l: any) => ({
          id: l.id,
          name: l.name,
        }))
        setLicenses(lics)
      } catch (e) {}
    }

    // Load procedures
    const storedProcedures = localStorage.getItem(STORAGE_KEY)
    if (storedProcedures) {
      try {
        const parsed = JSON.parse(storedProcedures)
        if (Array.isArray(parsed)) {
          setProcedures(parsed)
        }
      } catch (e) {}
    }

    setIsLoading(false)
  }, [])

  // Save procedures
  const saveProcedures = (newProcedures: Procedure[]) => {
    setProcedures(newProcedures)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProcedures))
  }

  // Open dialog for new/edit
  const openDialog = (procedure?: Procedure) => {
    if (procedure) {
      setEditingProcedure(procedure)
      setFormData({ ...procedure })
    } else {
      setEditingProcedure(null)
      setFormData({
        name: "",
        category: "",
        description: "",
        purpose: "",
        steps: [],
        responsibleRoles: [],
        frequency: "",
        relatedProducts: [],
        relatedLicenses: [],
        documents: [],
        status: "draft",
      })
    }
    setDialogOpen(true)
  }

  // Save procedure
  const saveProcedure = () => {
    if (!formData.name || !formData.category) return

    const procedure: Procedure = {
      id: editingProcedure?.id || `proc-${Date.now()}`,
      name: formData.name || "",
      category: formData.category || "",
      description: formData.description || "",
      purpose: formData.purpose || "",
      steps: formData.steps || [],
      responsibleRoles: formData.responsibleRoles || [],
      frequency: formData.frequency || "",
      relatedProducts: formData.relatedProducts || [],
      relatedLicenses: formData.relatedLicenses || [],
      documents: formData.documents || [],
      status: formData.status || "draft",
    }

    if (editingProcedure) {
      saveProcedures(procedures.map((p) => (p.id === editingProcedure.id ? procedure : p)))
    } else {
      saveProcedures([...procedures, procedure])
    }

    setDialogOpen(false)
  }

  // Delete procedure
  const deleteProcedure = (id: string) => {
    saveProcedures(procedures.filter((p) => p.id !== id))
  }

  // Filter procedures
  const filteredProcedures = procedures.filter((procedure) => {
    const matchesSearch =
      procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || procedure.category === categoryFilter
    const matchesStatus = statusFilter === "all" || procedure.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Group by category
  const proceduresByCategory = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = filteredProcedures.filter((p) => p.category === cat)
      return acc
    },
    {} as Record<string, Procedure[]>,
  )

  // Reset all
  const resetAll = () => {
    saveProcedures([])
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "under-review":
        return <Badge className="bg-yellow-100 text-yellow-700">Under Review</Badge>
      case "deprecated":
        return <Badge variant="destructive">Deprecated</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Get role name
  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    return role?.name || roleId
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading procedures...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Procedures
              </CardTitle>
              <CardDescription>
                Define the procedures required to develop, offer, and maintain your products and services
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetAll}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Procedure
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search procedures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{procedures.length}</div>
                <div className="text-sm text-muted-foreground">Total Procedures</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{procedures.filter((p) => p.status === "active").length}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{procedures.filter((p) => p.status === "draft").length}</div>
                <div className="text-sm text-muted-foreground">Draft</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {procedures.reduce((acc, p) => acc + p.steps.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Steps</div>
              </CardContent>
            </Card>
          </div>

          {/* Procedures List */}
          {procedures.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No procedures defined yet.</p>
              <p className="text-sm">Click "Add Procedure" to define procedures for your operations.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {CATEGORIES.map((cat) => {
                const catProcedures = proceduresByCategory[cat]
                if (catProcedures.length === 0) return null

                return (
                  <AccordionItem key={cat} value={cat} className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{cat}</span>
                        <Badge variant="secondary">{catProcedures.length}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Procedure</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Steps</TableHead>
                            <TableHead>Responsible</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {catProcedures.map((procedure) => (
                            <TableRow key={procedure.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{procedure.name}</div>
                                  <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                    {procedure.description}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{procedure.frequency || "—"}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{procedure.steps.length}</Badge>
                              </TableCell>
                              <TableCell>
                                {procedure.responsibleRoles.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {procedure.responsibleRoles.slice(0, 2).map((roleId) => (
                                      <Badge key={roleId} variant="secondary" className="text-xs">
                                        {getRoleName(roleId).slice(0, 15)}
                                      </Badge>
                                    ))}
                                    {procedure.responsibleRoles.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{procedure.responsibleRoles.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  "—"
                                )}
                              </TableCell>
                              <TableCell>{getStatusBadge(procedure.status)}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => openDialog(procedure)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteProcedure(procedure.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProcedure ? "Edit Procedure" : "Add New Procedure"}</DialogTitle>
            <DialogDescription>
              Define the procedure details, steps, and responsible roles
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Procedure Name *</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Client Onboarding Process"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the procedure..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Purpose</Label>
              <Textarea
                value={formData.purpose || ""}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Why is this procedure required..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={formData.frequency || ""}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status || "draft"}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <Label>Procedure Steps (one per line)</Label>
              <Textarea
                value={(formData.steps || []).join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    steps: e.target.value.split("\n").filter((s) => s.trim()),
                  })
                }
                placeholder="Enter steps, one per line..."
                rows={5}
              />
            </div>

            {/* Responsible Roles */}
            {roles.length > 0 && (
              <div className="space-y-2">
                <Label>Responsible Roles</Label>
                <div className="border rounded-md p-3 max-h-32 overflow-y-auto space-y-1">
                  {roles.map((role) => (
                    <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.responsibleRoles || []).includes(role.id)}
                        onChange={(e) => {
                          const current = formData.responsibleRoles || []
                          if (e.target.checked) {
                            setFormData({ ...formData, responsibleRoles: [...current, role.id] })
                          } else {
                            setFormData({
                              ...formData,
                              responsibleRoles: current.filter((id) => id !== role.id),
                            })
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Related Products */}
            {products.length > 0 && (
              <div className="space-y-2">
                <Label>Related Products</Label>
                <div className="border rounded-md p-3 max-h-32 overflow-y-auto space-y-1">
                  {products.map((product) => (
                    <label key={product.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.relatedProducts || []).includes(product.id)}
                        onChange={(e) => {
                          const current = formData.relatedProducts || []
                          if (e.target.checked) {
                            setFormData({ ...formData, relatedProducts: [...current, product.id] })
                          } else {
                            setFormData({
                              ...formData,
                              relatedProducts: current.filter((id) => id !== product.id),
                            })
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{product.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Related Licenses */}
            {licenses.length > 0 && (
              <div className="space-y-2">
                <Label>Related Licenses</Label>
                <div className="border rounded-md p-3 max-h-32 overflow-y-auto space-y-1">
                  {licenses.map((license) => (
                    <label key={license.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.relatedLicenses || []).includes(license.id)}
                        onChange={(e) => {
                          const current = formData.relatedLicenses || []
                          if (e.target.checked) {
                            setFormData({ ...formData, relatedLicenses: [...current, license.id] })
                          } else {
                            setFormData({
                              ...formData,
                              relatedLicenses: current.filter((id) => id !== license.id),
                            })
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{license.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            <div className="space-y-2">
              <Label>Related Documents (one per line)</Label>
              <Textarea
                value={(formData.documents || []).join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: e.target.value.split("\n").filter((d) => d.trim()),
                  })
                }
                placeholder="Enter document names or links, one per line..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveProcedure} disabled={!formData.name || !formData.category}>
              {editingProcedure ? "Save Changes" : "Add Procedure"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
