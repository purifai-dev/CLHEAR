"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Search, Users, UserCheck, Shield, FileText, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import {
  DEFENSE_OBLIGATIONS_CATALOGUE,
  OBLIGATION_TYPE_LABELS,
  STATUS_LABELS,
  type DefenseObligation,
  type ImplementationStatus,
} from "@/lib/defense-obligations-catalogue"

interface Role {
  id: string
  name: string
  department: string
  description: string
  responsibilities: string[]
  isRegulatory: boolean
}

// Key compliance roles
const KEY_ROLES = [
  {
    id: "role-board",
    name: "Board of Directors",
    department: "Executive Management",
    description: "Ultimate responsibility for firm governance and oversight of senior management",
    responsibilities: ["Strategic direction", "Risk appetite", "Culture and conduct", "Oversight of executive management"],
    isRegulatory: true,
  },
  {
    id: "role-ceo",
    name: "Chief Executive Officer (SMF1)",
    department: "Executive Management",
    description: "Senior Manager Function responsible for overall management of the firm",
    responsibilities: ["Day-to-day management", "Implementation of strategy", "Culture and conduct"],
    isRegulatory: true,
  },
  {
    id: "role-cfo",
    name: "Chief Finance Officer (SMF2)",
    department: "Finance",
    description: "Senior Manager Function responsible for financial affairs",
    responsibilities: ["Financial reporting", "Capital management", "Financial controls"],
    isRegulatory: true,
  },
  {
    id: "role-cco",
    name: "Chief Compliance Officer (SMF16)",
    department: "Compliance",
    description: "Senior Manager Function responsible for compliance with FCA rules",
    responsibilities: ["Regulatory compliance", "Compliance monitoring", "Regulatory reporting", "FCA relationship"],
    isRegulatory: true,
  },
  {
    id: "role-mlro",
    name: "Money Laundering Reporting Officer (SMF17)",
    department: "Compliance",
    description: "Senior Manager Function responsible for AML/CFT compliance",
    responsibilities: ["AML program oversight", "SAR reporting", "Transaction monitoring oversight", "AML training"],
    isRegulatory: true,
  },
  {
    id: "role-cro",
    name: "Chief Risk Officer (SMF4)",
    department: "Risk Management",
    description: "Senior Manager Function responsible for risk management",
    responsibilities: ["Risk framework", "Risk appetite monitoring", "Risk reporting", "Stress testing"],
    isRegulatory: true,
  },
  {
    id: "role-hia",
    name: "Head of Internal Audit (SMF5)",
    department: "Internal Audit",
    description: "Senior Manager Function responsible for internal audit function",
    responsibilities: ["Audit planning", "Audit execution", "Audit reporting", "Follow-up on findings"],
    isRegulatory: true,
  },
  {
    id: "role-dpo",
    name: "Data Protection Officer",
    department: "Compliance",
    description: "Responsible for data protection compliance and GDPR obligations",
    responsibilities: ["Data protection compliance", "Privacy impact assessments", "Data subject requests", "Privacy training"],
    isRegulatory: false,
  },
  {
    id: "role-ciso",
    name: "Chief Information Security Officer",
    department: "Technology",
    description: "Responsible for information security and cyber resilience",
    responsibilities: ["Security strategy", "Cyber risk management", "Incident response", "Security awareness"],
    isRegulatory: false,
  },
  {
    id: "role-coo",
    name: "Chief Operating Officer (SMF24)",
    department: "Operations",
    description: "Senior Manager Function responsible for operations",
    responsibilities: ["Operational management", "Business continuity", "Vendor management", "Operational resilience"],
    isRegulatory: true,
  },
]

const STORAGE_KEY = "clhear-people-organization"

export function PeopleOrganizationContent() {
  const [roles, setRoles] = useState<Role[]>([])
  const [obligations, setObligations] = useState<DefenseObligation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load data
  useEffect(() => {
    // Load roles from operations or use key roles
    const storedRoles = localStorage.getItem("clhear-operations-roles")
    if (storedRoles) {
      try {
        const parsed = JSON.parse(storedRoles)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRoles(parsed)
        } else {
          setRoles(KEY_ROLES)
        }
      } catch (e) {
        setRoles(KEY_ROLES)
      }
    } else {
      setRoles(KEY_ROLES)
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

  // Get obligations tagged with PEOPLE
  const peopleObligations = obligations.filter((o) => o.domainTags.includes("PEOPLE"))

  // Get unique departments
  const departments = [...new Set(roles.map((r) => r.department))]

  // Filter roles
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || role.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  // Get obligations for a role (simplified mapping based on department/responsibilities)
  const getRoleObligations = (role: Role): DefenseObligation[] => {
    return peopleObligations.filter((o) => {
      // Simple heuristic: match based on keywords in role responsibilities and obligation title/description
      const roleText = `${role.name} ${role.description} ${role.responsibilities.join(" ")}`.toLowerCase()
      const obligationText = `${o.title} ${o.description}`.toLowerCase()

      // Match compliance roles with compliance obligations
      if (role.department === "Compliance" && (obligationText.includes("compliance") || obligationText.includes("aml") || obligationText.includes("mlr"))) {
        return true
      }
      // Match risk roles with risk obligations
      if (role.department === "Risk Management" && (obligationText.includes("risk") || obligationText.includes("resilience"))) {
        return true
      }
      // Match audit roles with audit obligations
      if (role.department === "Internal Audit" && obligationText.includes("audit")) {
        return true
      }
      // Match executive roles with governance obligations
      if (role.department === "Executive Management" && (obligationText.includes("governance") || obligationText.includes("senior manager") || obligationText.includes("consumer duty"))) {
        return true
      }
      return false
    })
  }

  // Stats
  const stats = {
    totalRoles: roles.length,
    regulatoryRoles: roles.filter((r) => r.isRegulatory).length,
    peopleObligations: peopleObligations.length,
    departments: departments.length,
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
                <Users className="h-5 w-5" />
                People & Organization
              </CardTitle>
              <CardDescription>
                View roles and their linked obligations, controls, and accountability
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.totalRoles}</div>
                <div className="text-sm text-muted-foreground">Total Roles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.regulatoryRoles}</div>
                <div className="text-sm text-muted-foreground">SMF/CF Roles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.peopleObligations}</div>
                <div className="text-sm text-muted-foreground">People Obligations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.departments}</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </CardContent>
            </Card>
          </div>

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
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Roles List */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Linked Obligations</TableHead>
                  <TableHead>Coverage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => {
                  const roleObligations = getRoleObligations(role)
                  const implementedCount = roleObligations.filter((o) => o.implementationStatus === "implemented").length
                  const coverage = roleObligations.length > 0 ? Math.round((implementedCount / roleObligations.length) * 100) : 0

                  return (
                    <TableRow
                      key={role.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedRole(role)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {role.name}
                            {role.isRegulatory && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                SMF/CF
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {role.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{role.department}</Badge>
                      </TableCell>
                      <TableCell>
                        {role.isRegulatory ? (
                          <Badge className="bg-purple-100 text-purple-700">Regulatory</Badge>
                        ) : (
                          <Badge variant="outline">Operational</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{roleObligations.length}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 w-32">
                          <Progress value={coverage} className="h-2" />
                          <span className="text-sm text-muted-foreground">{coverage}%</span>
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

      {/* Role Detail Dialog */}
      <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedRole && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedRole.department}</Badge>
                  {selectedRole.isRegulatory && (
                    <Badge className="bg-purple-100 text-purple-700">SMF/CF</Badge>
                  )}
                </div>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  {selectedRole.name}
                </DialogTitle>
                <DialogDescription>{selectedRole.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Responsibilities */}
                <div>
                  <h4 className="font-semibold mb-2">Key Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedRole.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>

                {/* Linked Obligations */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Linked Obligations (People Domain)
                  </h4>
                  {getRoleObligations(selectedRole).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No obligations directly linked to this role.</p>
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
                          {getRoleObligations(selectedRole).map((obligation) => (
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
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Linked Controls & Evidence
                  </h4>
                  {(() => {
                    const roleObs = getRoleObligations(selectedRole)
                    const allControls = roleObs.flatMap((o) => o.linkedControls)
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
    </div>
  )
}
