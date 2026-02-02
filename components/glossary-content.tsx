"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Scale,
  FileText,
  AlertTriangle,
  Info,
  Filter,
  Tag,
} from "lucide-react"
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, type GlossaryTerm } from "@/lib/glossary-catalogue"

export function GlossaryContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set())

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    let terms = GLOSSARY_TERMS

    // Filter by category
    if (selectedCategory !== "all") {
      terms = terms.filter((term) => term.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      terms = terms.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query) ||
          term.licenseCode?.toLowerCase().includes(query) ||
          term.fcaHandbook?.toLowerCase().includes(query) ||
          term.raoReference?.toLowerCase().includes(query) ||
          term.mappedOffenseActivities?.some((a) => a.toLowerCase().includes(query)) ||
          term.mappedDefenseActivities?.some((a) => a.toLowerCase().includes(query)),
      )
    }

    return terms
  }, [searchQuery, selectedCategory])

  // Group terms by category for display
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {}

    filteredTerms.forEach((term) => {
      if (!groups[term.category]) {
        groups[term.category] = []
      }
      groups[term.category].push(term)
    })

    return groups
  }, [filteredTerms])

  const toggleTerm = (termId: string) => {
    setExpandedTerms((prev) => {
      const next = new Set(prev)
      if (next.has(termId)) {
        next.delete(termId)
      } else {
        next.add(termId)
      }
      return next
    })
  }

  const getCategoryName = (categoryId: string): string => {
    return GLOSSARY_CATEGORIES.find((c) => c.id === categoryId)?.name || categoryId
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            FCA Regulations Glossary
          </h1>
          <p className="text-muted-foreground mt-1">61 regulatory terms across 11 categories with CLHEAR mapping</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredTerms.length} of {GLOSSARY_TERMS.length} terms
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search terms, definitions, license codes, handbook references..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories ({GLOSSARY_TERMS.length})</SelectItem>
                  {GLOSSARY_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.termCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {GLOSSARY_CATEGORIES.slice(0, 6).map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            className="text-xs h-auto py-2 justify-start"
            onClick={() => setSelectedCategory(selectedCategory === category.id ? "all" : category.id)}
          >
            <span className="truncate">{category.name.split(" ")[0]}</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {category.termCount}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Terms List */}
      {filteredTerms.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No terms found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTerms).map(([categoryId, terms]) => (
            <Card key={categoryId}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  {getCategoryName(categoryId)}
                  <Badge variant="secondary" className="ml-2">
                    {terms.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {terms.map((term) => (
                  <Collapsible key={term.id} open={expandedTerms.has(term.id)} onOpenChange={() => toggleTerm(term.id)}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors">
                        <div className="mt-0.5">
                          {expandedTerms.has(term.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-foreground">{term.term}</h4>
                            {term.licenseCode && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30"
                              >
                                {term.licenseCode}
                              </Badge>
                            )}
                            {term.criticalNote && (
                              <Badge variant="destructive" className="text-xs">
                                Critical
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{term.definition}</p>
                        </div>
                        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                          {term.fcaHandbook && (
                            <Badge variant="secondary" className="text-xs">
                              {term.fcaHandbook.split(",")[0]}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-7 mt-2 p-4 rounded-lg bg-muted/50 space-y-4">
                        {/* Full Definition */}
                        <div>
                          <h5 className="text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            Definition
                          </h5>
                          <p className="text-sm text-muted-foreground">{term.definition}</p>
                        </div>

                        {/* Regulatory References */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {term.raoReference && (
                            <div>
                              <h5 className="text-sm font-medium text-foreground mb-1">RAO Reference</h5>
                              <p className="text-sm text-muted-foreground">{term.raoReference}</p>
                            </div>
                          )}
                          {term.fsmaReference && (
                            <div>
                              <h5 className="text-sm font-medium text-foreground mb-1">FSMA Reference</h5>
                              <p className="text-sm text-muted-foreground">{term.fsmaReference}</p>
                            </div>
                          )}
                          {term.fcaHandbook && (
                            <div>
                              <h5 className="text-sm font-medium text-foreground mb-1">FCA Handbook</h5>
                              <p className="text-sm text-muted-foreground">{term.fcaHandbook}</p>
                            </div>
                          )}
                          {term.regulatoryBasis && (
                            <div>
                              <h5 className="text-sm font-medium text-foreground mb-1">Regulatory Basis</h5>
                              <p className="text-sm text-muted-foreground">{term.regulatoryBasis}</p>
                            </div>
                          )}
                        </div>

                        {/* License Code */}
                        {term.licenseCode && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                              <Tag className="h-3.5 w-3.5" />
                              License Code
                            </h5>
                            <Badge className="bg-primary/10 text-primary border-primary/30">{term.licenseCode}</Badge>
                          </div>
                        )}

                        {/* Capital Requirements */}
                        {term.capitalRequirements && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-1">Capital Requirements</h5>
                            <p className="text-sm text-muted-foreground">{term.capitalRequirements}</p>
                          </div>
                        )}

                        {/* CLHEAR Mappings */}
                        {(term.mappedOffenseActivities?.length || term.mappedDefenseActivities?.length) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {term.mappedOffenseActivities && term.mappedOffenseActivities.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                  Mapped Offense Activities
                                </h5>
                                <div className="space-y-1">
                                  {term.mappedOffenseActivities.map((activity, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30 mr-1 mb-1"
                                    >
                                      {activity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {term.mappedDefenseActivities && term.mappedDefenseActivities.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                                  <Scale className="h-3.5 w-3.5 text-green-500" />
                                  Mapped Defense Activities
                                </h5>
                                <div className="space-y-1">
                                  {term.mappedDefenseActivities.map((activity, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs bg-green-500/10 text-green-600 border-green-500/30 mr-1 mb-1"
                                    >
                                      {activity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Key Points */}
                        {term.keyPoints && term.keyPoints.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                              <Info className="h-3.5 w-3.5" />
                              Key Points
                            </h5>
                            <ul className="list-disc list-inside space-y-1">
                              {term.keyPoints.map((point, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground">
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Examples */}
                        {term.examples && term.examples.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-2">Examples</h5>
                            <div className="flex flex-wrap gap-1">
                              {term.examples.map((example, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Critical Note */}
                        {term.criticalNote && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-sm">{term.criticalNote}</AlertDescription>
                          </Alert>
                        )}

                        {/* Key Distinction */}
                        {term.keyDistinction && (
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              <strong>Key Distinction:</strong> {term.keyDistinction}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
