"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const pillars = [
  { name: "Anti-Money Laundering", score: 96, status: "compliant", category: "Financial Crime" },
  { name: "Know Your Customer", score: 94, status: "compliant", category: "Financial Crime" },
  { name: "Market Conduct", score: 92, status: "compliant", category: "Trading" },
  { name: "Best Execution", score: 88, status: "review", category: "Trading" },
  { name: "Trade Reporting", score: 95, status: "compliant", category: "Reporting" },
  { name: "Capital Adequacy", score: 91, status: "compliant", category: "Financial" },
  { name: "Liquidity Management", score: 89, status: "compliant", category: "Financial" },
  { name: "Risk Management", score: 87, status: "review", category: "Risk" },
  { name: "Cybersecurity", score: 93, status: "compliant", category: "Technology" },
  { name: "Data Privacy (GDPR)", score: 90, status: "compliant", category: "Privacy" },
  { name: "Business Continuity", score: 85, status: "review", category: "Operations" },
  { name: "Conflicts of Interest", score: 94, status: "compliant", category: "Ethics" },
  { name: "Insider Trading", score: 97, status: "compliant", category: "Ethics" },
  { name: "Recordkeeping", score: 92, status: "compliant", category: "Operations" },
  { name: "Client Disclosure", score: 91, status: "compliant", category: "Client Relations" },
  { name: "Suitability & Fiduciary", score: 89, status: "compliant", category: "Client Relations" },
  { name: "Supervision & Surveillance", score: 88, status: "review", category: "Oversight" },
  { name: "Vendor Management", score: 86, status: "review", category: "Third Party" },
]

export function CompliancePillars() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>18 Compliance Pillars</CardTitle>
        <CardDescription>Key risk indicators across regulatory frameworks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {pillars.map((pillar) => (
            <div key={pillar.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{pillar.name}</span>
                    <Badge
                      variant={pillar.status === "compliant" ? "default" : "secondary"}
                      className={pillar.status === "compliant" ? "bg-success/20 text-success border-success/30" : ""}
                    >
                      {pillar.status === "compliant" ? "Compliant" : "Review"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{pillar.category}</span>
                </div>
                <span className="text-sm font-bold ml-4">{pillar.score}%</span>
              </div>
              <Progress value={pillar.score} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
