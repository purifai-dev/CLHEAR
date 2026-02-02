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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Shield, FileText, CheckCircle, AlertCircle, XCircle, ExternalLink, Filter } from "lucide-react"
import {
  DEFENSE_OBLIGATIONS_CATALOGUE,
  OBLIGATION_TYPE_LABELS,
  DOMAIN_TAG_LABELS,
  STATUS_LABELS,
  type DefenseObligation,
  type DefenseObligationType,
  type ImplementationStatus,
} from "@/lib/defense-obligations-catalogue"

interface DefenseObligationsContentProps {
  obligationType: DefenseObligationType
}

const STORAGE_KEY = "clhear-defense-obligations"

export function DefenseObligationsContent({ obligationType }: DefenseObligationsContentProps) {
  const [obligations, setObligations] = useState<DefenseObligation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>("all")
  const [domainFilter, setDomainFilter] = useState<string>("all")
  const [selectedObligation, setSelectedObligation] = useState<DefenseObligation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setObligations(parsed)
          setIsLoading(false)
          return
        }
      } catch (e) {}
    }
    // Use catalogue data
    setObligations(DEFENSE_OBLIGATIONS_CATALOGUE)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFENSE_OBLIGATIONS_CATALOGUE))
    setIsLoading(false)
  }, [])

  // Filter by type
  const typeObligations = obligations.filter((o) => o.defenseObligationType === obligationType)

  // Apply filters
  const filteredObligations = typeObligations.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shortLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || o.implementationStatus === statusFilter
    const matchesJurisdiction = jurisdictionFilter === "all" || o.jurisdiction === jurisdictionFilter
    const matchesDomain = domainFilter === "all" || o.domainTags.includes(domainFilter as any)
    return matchesSearch && matchesStatus && matchesJurisdiction && matchesDomain
  })

  // Get unique jurisdictions
  const jurisdictions = [...new Set(typeObligations.map((o) => o.jurisdiction).filter(Boolean))]

  // Stats
  const stats = {
    total: typeObligations.length,
    implemented: typeObligations.filter((o) => o.implementationStatus === "implemented").length,
    partial: typeObligations.filter((o) => o.implementationStatus === "partially_implemented").length,
    notImplemented: typeObligations.filter((o) => o.implementationStatus === "not_implemented").length,
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
          <p className="text-muted-foreground">Loading obligations...</p>
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
                <Shield className="h-5 w-5" />
                {OBLIGATION_TYPE_LABELS[obligationType]}
              </CardTitle>
              <CardDescription>
                Defense obligations classified as {OBLIGATION_TYPE_LABELS[obligationType].toLowerCase()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Obligations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.implemented}</div>
                <div className="text-sm text-muted-foreground">Implemented</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-600">{stats.partial}</div>
                <div className="text-sm text-muted-foreground">Partially Implemented</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{stats.notImplemented}</div>
                <div className="text-sm text-muted-foreground">Not Implemented</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search obligations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
                <SelectItem value="partially_implemented">Partially Implemented</SelectItem>
                <SelectItem value="not_implemented">Not Implemented</SelectItem>
              </SelectContent>
            </Select>
            {jurisdictions.length > 0 && (
              <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jurisdictions</SelectItem>
                  {jurisdictions.map((j) => (
                    <SelectItem key={j} value={j!}>
                      {j}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                <SelectItem value="PEOPLE">People</SelectItem>
                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                <SelectItem value="PROCESS">Process</SelectItem>
                <SelectItem value="REPORTING">Reporting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Obligations List */}
          {filteredObligations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No obligations found matching your criteria.</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Reference</TableHead>
                    <TableHead>Obligation</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead className="text-center">Controls</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObligations.map((obligation) => (
                    <TableRow
                      key={obligation.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedObligation(obligation)}
                    >
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {obligation.shortLabel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{obligation.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {obligation.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{obligation.source.name}</div>
                          {obligation.source.document && (
                            <div className="text-muted-foreground text-xs">{obligation.source.document}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {obligation.domainTags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {DOMAIN_TAG_LABELS[tag]}
                            </Badge>
                          ))}
                          {obligation.domainTags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{obligation.domainTags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{obligation.linkedControls.length}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(obligation.implementationStatus)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedObligation} onOpenChange={() => setSelectedObligation(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedObligation && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {selectedObligation.shortLabel}
                  </Badge>
                  {getStatusBadge(selectedObligation.implementationStatus)}
                </div>
                <DialogTitle className="text-xl">{selectedObligation.title}</DialogTitle>
                <DialogDescription>{selectedObligation.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Source Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Source
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Authority:</span>
                      <span className="ml-2 font-medium">{selectedObligation.source.name}</span>
                    </div>
                    {selectedObligation.source.document && (
                      <div>
                        <span className="text-muted-foreground">Document:</span>
                        <span className="ml-2">{selectedObligation.source.document}</span>
                      </div>
                    )}
                    {selectedObligation.source.citation && (
                      <div>
                        <span className="text-muted-foreground">Citation:</span>
                        <span className="ml-2">{selectedObligation.source.citation}</span>
                      </div>
                    )}
                    {selectedObligation.jurisdiction && (
                      <div>
                        <span className="text-muted-foreground">Jurisdiction:</span>
                        <span className="ml-2">{selectedObligation.jurisdiction}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Domain Tags */}
                <div>
                  <h4 className="font-semibold mb-2">Domain Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedObligation.domainTags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {DOMAIN_TAG_LABELS[tag]}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Linked Controls */}
                <div>
                  <h4 className="font-semibold mb-2">Linked Controls / Defense Activities</h4>
                  {selectedObligation.linkedControls.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No controls linked yet.</p>
                  ) : (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Control</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedObligation.linkedControls.map((control) => (
                            <TableRow key={control.id}>
                              <TableCell className="font-medium">{control.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {control.type}
                                </Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(control.status)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                {/* Linked Offense Activities */}
                <div>
                  <h4 className="font-semibold mb-2">Linked Offense Activities (Products/Services)</h4>
                  {selectedObligation.linkedOffenseActivities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No offense activities linked. Link products and services to track coverage.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedObligation.linkedOffenseActivities.map((actId) => (
                        <Badge key={actId} variant="outline">
                          {actId}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
