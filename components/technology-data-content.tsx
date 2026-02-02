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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Search, Server, Database, Shield, Plus, Pencil, Trash2, CheckCircle, AlertCircle, XCircle, RotateCcw } from "lucide-react"
import {
  DEFENSE_OBLIGATIONS_CATALOGUE,
  OBLIGATION_TYPE_LABELS,
  STATUS_LABELS,
  type DefenseObligation,
  type ImplementationStatus,
} from "@/lib/defense-obligations-catalogue"

interface System {
  id: string
  name: string
  type: "application" | "platform" | "database" | "infrastructure" | "service"
  description: string
  vendor?: string
  criticality: "critical" | "high" | "medium" | "low"
  dataClassification: "confidential" | "internal" | "public"
  linkedProducts: string[]
  linkedObligations: string[]
}

// Sample critical systems
const SAMPLE_SYSTEMS: System[] = [
  {
    id: "sys-001",
    name: "Trading Platform",
    type: "platform",
    description: "Core trading execution platform for retail and institutional clients",
    vendor: "Internal",
    criticality: "critical",
    dataClassification: "confidential",
    linkedProducts: [],
    linkedObligations: ["OBL-REG-002", "OBL-RISK-002"],
  },
  {
    id: "sys-002",
    name: "KYC/AML System",
    type: "application",
    description: "Customer due diligence and anti-money laundering monitoring system",
    vendor: "LexisNexis",
    criticality: "critical",
    dataClassification: "confidential",
    linkedProducts: [],
    linkedObligations: ["OBL-REG-003"],
  },
  {
    id: "sys-003",
    name: "Transaction Monitoring System",
    type: "application",
    description: "Real-time transaction monitoring for suspicious activity detection",
    vendor: "NICE Actimize",
    criticality: "critical",
    dataClassification: "confidential",
    linkedProducts: [],
    linkedObligations: ["OBL-REG-003"],
  },
  {
    id: "sys-004",
    name: "Client Money Ledger",
    type: "database",
    description: "Core ledger for client money segregation and reconciliation",
    vendor: "Internal",
    criticality: "critical",
    dataClassification: "confidential",
    linkedProducts: [],
    linkedObligations: ["OBL-REG-001", "OBL-AUD-003"],
  },
  {
    id: "sys-005",
    name: "Regulatory Reporting Engine",
    type: "application",
    description: "Automated regulatory reporting for MiFIR, EMIR, and other obligations",
    vendor: "Kaizen",
    criticality: "high",
    dataClassification: "confidential",
    linkedProducts: [],
    linkedObligations: ["OBL-REG-002"],
  },
  {
    id: "sys-006",
    name: "Data Warehouse",
    type: "database",
    description: "Central data repository for analytics and reporting",
    vendor: "Snowflake",
    criticality: "high",
    dataClassification: "internal",
    linkedProducts: [],
    linkedObligations: ["OBL-BP-001", "OBL-BP-002"],
  },
  {
    id: "sys-007",
    name: "Identity & Access Management",
    type: "infrastructure",
    description: "Centralized identity management and access control system",
    vendor: "Okta",
    criticality: "critical",
    dataClassification: "confidential",
    linkedProducts: [],
    linkedObligations: ["OBL-BP-001", "OBL-AUD-002"],
  },
  {
    id: "sys-008",
    name: "Backup & Recovery System",
    type: "infrastructure",
    description: "Enterprise backup and disaster recovery infrastructure",
    vendor: "Veeam",
    criticality: "critical",
    dataClassification: "internal",
    linkedProducts: [],
    linkedObligations: ["OBL-BP-003", "OBL-RISK-002"],
  },
]

const SYSTEM_TYPES = [
  { value: "application", label: "Application" },
  { value: "platform", label: "Platform" },
  { value: "database", label: "Database" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "service", label: "Service" },
]

const CRITICALITY_LEVELS = [
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "low", label: "Low", color: "bg-green-100 text-green-700 border-green-200" },
]

const DATA_CLASSIFICATIONS = [
  { value: "confidential", label: "Confidential", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "internal", label: "Internal", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "public", label: "Public", color: "bg-green-100 text-green-700 border-green-200" },
]

const STORAGE_KEY = "clhear-technology-systems"

export function TechnologyDataContent() {
  const [systems, setSystems] = useState<System[]>([])
  const [obligations, setObligations] = useState<DefenseObligation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [criticalityFilter, setCriticalityFilter] = useState<string>("all")
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSystem, setEditingSystem] = useState<System | null>(null)
  const [formData, setFormData] = useState<Partial<System>>({})

  // Load data
  useEffect(() => {
    // Load systems
    const storedSystems = localStorage.getItem(STORAGE_KEY)
    if (storedSystems) {
      try {
        const parsed = JSON.parse(storedSystems)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSystems(parsed)
        } else {
          setSystems(SAMPLE_SYSTEMS)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SYSTEMS))
        }
      } catch (e) {
        setSystems(SAMPLE_SYSTEMS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SYSTEMS))
      }
    } else {
      setSystems(SAMPLE_SYSTEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SYSTEMS))
    }

    // Load obligations
    const storedObligations = localStorage.getItem("clhear-defense-obligations")
    if (storedObligations) {
      try {
        const parsed = JSON.parse(storedObligations)
        if (Array.isArray(parsed)) {
          setObligations(parsed)
        } else {
          setObligations(DEFENSE_OBLIGATIONS_CATALOGUE)
        }
      } catch (e) {
        setObligations(DEFENSE_OBLIGATIONS_CATALOGUE)
      }
    } else {
      setObligations(DEFENSE_OBLIGATIONS_CATALOGUE)
    }

    setIsLoading(false)
  }, [])

  // Save systems
  const saveSystems = (newSystems: System[]) => {
    setSystems(newSystems)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSystems))
  }

  // Get technology obligations
  const techObligations = obligations.filter((o) => o.domainTags.includes("TECHNOLOGY"))

  // Get unique types
  const types = [...new Set(systems.map((s) => s.type))]

  // Filter systems
  const filteredSystems = systems.filter((system) => {
    const matchesSearch =
      system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || system.type === typeFilter
    const matchesCriticality = criticalityFilter === "all" || system.criticality === criticalityFilter
    return matchesSearch && matchesType && matchesCriticality
  })

  // Get obligations for a system
  const getSystemObligations = (system: System): DefenseObligation[] => {
    return obligations.filter((o) => system.linkedObligations.includes(o.id))
  }

  // Open dialog
  const openDialog = (system?: System) => {
    if (system) {
      setEditingSystem(system)
      setFormData({ ...system })
    } else {
      setEditingSystem(null)
      setFormData({
        name: "",
        type: "application",
        description: "",
        vendor: "",
        criticality: "medium",
        dataClassification: "internal",
        linkedProducts: [],
        linkedObligations: [],
      })
    }
    setDialogOpen(true)
  }

  // Save system
  const saveSystem = () => {
    if (!formData.name || !formData.type) return

    const system: System = {
      id: editingSystem?.id || `sys-${Date.now()}`,
      name: formData.name || "",
      type: formData.type as System["type"],
      description: formData.description || "",
      vendor: formData.vendor,
      criticality: formData.criticality as System["criticality"] || "medium",
      dataClassification: formData.dataClassification as System["dataClassification"] || "internal",
      linkedProducts: formData.linkedProducts || [],
      linkedObligations: formData.linkedObligations || [],
    }

    if (editingSystem) {
      saveSystems(systems.map((s) => (s.id === editingSystem.id ? system : s)))
    } else {
      saveSystems([...systems, system])
    }

    setDialogOpen(false)
  }

  // Delete system
  const deleteSystem = (id: string) => {
    saveSystems(systems.filter((s) => s.id !== id))
  }

  // Reset
  const resetAll = () => {
    saveSystems(SAMPLE_SYSTEMS)
  }

  // Stats
  const stats = {
    totalSystems: systems.length,
    criticalSystems: systems.filter((s) => s.criticality === "critical").length,
    techObligations: techObligations.length,
    types: types.length,
  }

  const getStatusIcon = (status: ImplementationStatus) => {
    switch (status) {
      case "implemented":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "partially_implemented":
        return <AlertCircle className="h-4 w-4 text-amber-600" />
      case "not_implemented":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: ImplementationStatus) => {
    const variants: Record<ImplementationStatus, string> = {
      implemented: "bg-green-100 text-green-700 border-green-200",
      partially_implemented: "bg-amber-100 text-amber-700 border-amber-200",
      not_implemented: "bg-red-100 text-red-700 border-red-200",
      not_applicable: "bg-gray-100 text-gray-600 border-gray-200",
    }
    return (
      <Badge variant="outline" className={variants[status]}>
        {STATUS_LABELS[status]}
      </Badge>
    )
  }

  const getCriticalityBadge = (criticality: System["criticality"]) => {
    const level = CRITICALITY_LEVELS.find((l) => l.value === criticality)
    return (
      <Badge variant="outline" className={level?.color}>
        {level?.label}
      </Badge>
    )
  }

  const getDataClassBadge = (classification: System["dataClassification"]) => {
    const cls = DATA_CLASSIFICATIONS.find((c) => c.value === classification)
    return (
      <Badge variant="outline" className={cls?.color}>
        {cls?.label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
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
                <Server className="h-5 w-5" />
                Technology & Data
              </CardTitle>
              <CardDescription>
                View systems and their linked obligations, controls, and dependencies
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetAll}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add System
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.totalSystems}</div>
                <div className="text-sm text-muted-foreground">Total Systems</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{stats.criticalSystems}</div>
                <div className="text-sm text-muted-foreground">Critical Systems</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.techObligations}</div>
                <div className="text-sm text-muted-foreground">Tech Obligations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.types}</div>
                <div className="text-sm text-muted-foreground">System Types</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search systems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {SYSTEM_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Criticality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {CRITICALITY_LEVELS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Systems List */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>System</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Criticality</TableHead>
                  <TableHead>Data Class</TableHead>
                  <TableHead className="text-center">Obligations</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSystems.map((system) => {
                  const sysObligations = getSystemObligations(system)
                  const implementedCount = sysObligations.filter((o) => o.implementationStatus === "implemented").length
                  const coverage = sysObligations.length > 0 ? Math.round((implementedCount / sysObligations.length) * 100) : 0

                  return (
                    <TableRow
                      key={system.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedSystem(system)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{system.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                            {system.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {system.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getCriticalityBadge(system.criticality)}</TableCell>
                      <TableCell>{getDataClassBadge(system.dataClassification)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{sysObligations.length}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 w-32">
                          <Progress value={coverage} className="h-2" />
                          <span className="text-sm text-muted-foreground">{coverage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" onClick={() => openDialog(system)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSystem(system.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* System Detail Dialog */}
      <Dialog open={!!selectedSystem} onOpenChange={() => setSelectedSystem(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedSystem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {selectedSystem.type}
                  </Badge>
                  {getCriticalityBadge(selectedSystem.criticality)}
                  {getDataClassBadge(selectedSystem.dataClassification)}
                </div>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {selectedSystem.name}
                </DialogTitle>
                <DialogDescription>{selectedSystem.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* System Info */}
                {selectedSystem.vendor && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Vendor:</span>
                      <span className="ml-2 font-medium">{selectedSystem.vendor}</span>
                    </div>
                  </div>
                )}

                {/* Linked Obligations */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Linked Obligations
                  </h4>
                  {getSystemObligations(selectedSystem).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No obligations linked to this system.</p>
                  ) : (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Obligation</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getSystemObligations(selectedSystem).map((obligation) => (
                            <TableRow key={obligation.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{obligation.title}</div>
                                  <div className="text-xs text-muted-foreground">{obligation.shortLabel}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {OBLIGATION_TYPE_LABELS[obligation.defenseObligationType]}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{obligation.source.name}</TableCell>
                              <TableCell>{getStatusBadge(obligation.implementationStatus)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div>
                  <h4 className="font-semibold mb-2">Linked Controls & Evidence</h4>
                  {(() => {
                    const sysObs = getSystemObligations(selectedSystem)
                    const allControls = sysObs.flatMap((o) => o.linkedControls)
                    if (allControls.length === 0) {
                      return <p className="text-sm text-muted-foreground">No controls linked through obligations.</p>
                    }
                    return (
                      <div className="flex flex-wrap gap-2">
                        {allControls.map((control) => (
                          <Badge key={control.id} variant="outline" className="flex items-center gap-1">
                            {getStatusIcon(control.status)}
                            {control.name}
                          </Badge>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit System Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSystem ? "Edit System" : "Add New System"}</DialogTitle>
            <DialogDescription>
              Define the system details and link to obligations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>System Name *</Label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Trading Platform"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={formData.type || "application"}
                  onValueChange={(value) => setFormData({ ...formData, type: value as System["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEM_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Input
                  value={formData.vendor || ""}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  placeholder="e.g., Internal, AWS"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the system..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Criticality</Label>
                <Select
                  value={formData.criticality || "medium"}
                  onValueChange={(value) => setFormData({ ...formData, criticality: value as System["criticality"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CRITICALITY_LEVELS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data Classification</Label>
                <Select
                  value={formData.dataClassification || "internal"}
                  onValueChange={(value) => setFormData({ ...formData, dataClassification: value as System["dataClassification"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATA_CLASSIFICATIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linked Obligations */}
            <div className="space-y-2">
              <Label>Linked Obligations (Technology Domain)</Label>
              <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-1">
                {techObligations.map((obligation) => (
                  <label key={obligation.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData.linkedObligations || []).includes(obligation.id)}
                      onChange={(e) => {
                        const current = formData.linkedObligations || []
                        if (e.target.checked) {
                          setFormData({ ...formData, linkedObligations: [...current, obligation.id] })
                        } else {
                          setFormData({
                            ...formData,
                            linkedObligations: current.filter((id) => id !== obligation.id),
                          })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{obligation.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSystem} disabled={!formData.name}>
              {editingSystem ? "Save Changes" : "Add System"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
