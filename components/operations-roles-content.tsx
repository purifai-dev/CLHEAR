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
import { Search, Plus, Pencil, Trash2, Users, RotateCcw } from "lucide-react"

interface Role {
  id: string
  name: string
  department: string
  description: string
  responsibilities: string[]
  requiredSkills: string[]
  reportsTo: string
  relatedProducts: string[]
  relatedLicenses: string[]
  isRegulatory: boolean
}

interface ProductAssignment {
  productId: string
  entityIds: string[]
}

const DEPARTMENTS = [
  "Compliance",
  "Risk Management",
  "Legal",
  "Operations",
  "Technology",
  "Finance",
  "Customer Service",
  "Sales & Marketing",
  "Human Resources",
  "Internal Audit",
  "Executive Management",
]

const STORAGE_KEY = "clhear-operations-roles"

export function OperationsRolesContent() {
  const [roles, setRoles] = useState<Role[]>([])
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [licenses, setLicenses] = useState<{ id: string; name: string }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<Partial<Role>>({})

  // Load data
  useEffect(() => {
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

    // Load roles
    const storedRoles = localStorage.getItem(STORAGE_KEY)
    if (storedRoles) {
      try {
        const parsed = JSON.parse(storedRoles)
        if (Array.isArray(parsed)) {
          setRoles(parsed)
        }
      } catch (e) {}
    }

    setIsLoading(false)
  }, [])

  // Save roles
  const saveRoles = (newRoles: Role[]) => {
    setRoles(newRoles)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRoles))
  }

  // Open dialog for new/edit
  const openDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role)
      setFormData({ ...role })
    } else {
      setEditingRole(null)
      setFormData({
        name: "",
        department: "",
        description: "",
        responsibilities: [],
        requiredSkills: [],
        reportsTo: "",
        relatedProducts: [],
        relatedLicenses: [],
        isRegulatory: false,
      })
    }
    setDialogOpen(true)
  }

  // Save role
  const saveRole = () => {
    if (!formData.name || !formData.department) return

    const role: Role = {
      id: editingRole?.id || `role-${Date.now()}`,
      name: formData.name || "",
      department: formData.department || "",
      description: formData.description || "",
      responsibilities: formData.responsibilities || [],
      requiredSkills: formData.requiredSkills || [],
      reportsTo: formData.reportsTo || "",
      relatedProducts: formData.relatedProducts || [],
      relatedLicenses: formData.relatedLicenses || [],
      isRegulatory: formData.isRegulatory || false,
    }

    if (editingRole) {
      saveRoles(roles.map((r) => (r.id === editingRole.id ? role : r)))
    } else {
      saveRoles([...roles, role])
    }

    setDialogOpen(false)
  }

  // Delete role
  const deleteRole = (id: string) => {
    saveRoles(roles.filter((r) => r.id !== id))
  }

  // Filter roles
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || role.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  // Group by department
  const rolesByDepartment = DEPARTMENTS.reduce(
    (acc, dept) => {
      acc[dept] = filteredRoles.filter((r) => r.department === dept)
      return acc
    },
    {} as Record<string, Role[]>,
  )

  // Reset all
  const resetAll = () => {
    saveRoles([])
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading roles...</p>
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
                <Users className="h-5 w-5" />
                Roles & Responsibilities
              </CardTitle>
              <CardDescription>
                Define the roles required to develop, offer, and maintain your products and services
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetAll}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
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
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{roles.length}</div>
                <div className="text-sm text-muted-foreground">Total Roles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{roles.filter((r) => r.isRegulatory).length}</div>
                <div className="text-sm text-muted-foreground">Regulatory Roles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{new Set(roles.map((r) => r.department)).size}</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {roles.reduce((acc, r) => acc + r.responsibilities.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Responsibilities</div>
              </CardContent>
            </Card>
          </div>

          {/* Roles List */}
          {roles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No roles defined yet.</p>
              <p className="text-sm">Click "Add Role" to define roles for your operations.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {DEPARTMENTS.map((dept) => {
                const deptRoles = rolesByDepartment[dept]
                if (deptRoles.length === 0) return null

                return (
                  <AccordionItem key={dept} value={dept} className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{dept}</span>
                        <Badge variant="secondary">{deptRoles.length}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Role</TableHead>
                            <TableHead>Reports To</TableHead>
                            <TableHead>Responsibilities</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deptRoles.map((role) => (
                            <TableRow key={role.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{role.name}</div>
                                  <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                    {role.description}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{role.reportsTo || "—"}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{role.responsibilities.length}</Badge>
                              </TableCell>
                              <TableCell>
                                {role.isRegulatory ? (
                                  <Badge className="bg-purple-100 text-purple-700">Regulatory</Badge>
                                ) : (
                                  <Badge variant="secondary">Operational</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => openDialog(role)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteRole(role.id)}
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
            <DialogTitle>{editingRole ? "Edit Role" : "Add New Role"}</DialogTitle>
            <DialogDescription>
              Define the role details, responsibilities, and related products/licenses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role Name *</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Compliance Officer"
                />
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select
                  value={formData.department || ""}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
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
                placeholder="Brief description of the role..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reports To</Label>
                <Input
                  value={formData.reportsTo || ""}
                  onChange={(e) => setFormData({ ...formData, reportsTo: e.target.value })}
                  placeholder="e.g., Chief Compliance Officer"
                />
              </div>
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRegulatory || false}
                    onChange={(e) => setFormData({ ...formData, isRegulatory: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Regulatory Role (FCA SMF/CF)</span>
                </label>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <Label>Responsibilities (one per line)</Label>
              <Textarea
                value={(formData.responsibilities || []).join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    responsibilities: e.target.value.split("\n").filter((r) => r.trim()),
                  })
                }
                placeholder="Enter responsibilities, one per line..."
                rows={4}
              />
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <Label>Required Skills (one per line)</Label>
              <Textarea
                value={(formData.requiredSkills || []).join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiredSkills: e.target.value.split("\n").filter((s) => s.trim()),
                  })
                }
                placeholder="Enter required skills, one per line..."
                rows={3}
              />
            </div>

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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRole} disabled={!formData.name || !formData.department}>
              {editingRole ? "Save Changes" : "Add Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
