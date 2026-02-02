"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const riskMatrix = [
  { risk: "AML", likelihood: "Low", impact: "High", level: "medium" },
  { risk: "Cyber", likelihood: "High", impact: "High", level: "high" },
  { risk: "Market", likelihood: "Medium", impact: "Medium", level: "medium" },
  { risk: "Credit", likelihood: "Low", impact: "Medium", level: "low" },
  { risk: "Operational", likelihood: "Medium", impact: "High", level: "medium" },
  { risk: "Liquidity", likelihood: "Low", impact: "High", level: "medium" },
  { risk: "Regulatory", likelihood: "Medium", impact: "High", level: "high" },
  { risk: "Reputation", likelihood: "Low", impact: "High", level: "medium" },
]

export function RiskHeatMap() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Risk Heat Map</CardTitle>
        <CardDescription>Impact vs likelihood assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {riskMatrix.map((item) => (
            <div
              key={item.risk}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{item.risk}</p>
                <p className="text-xs text-muted-foreground">
                  {item.likelihood} likelihood • {item.impact} impact
                </p>
              </div>
              <div
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium",
                  item.level === "high" && "bg-destructive/20 text-destructive",
                  item.level === "medium" && "bg-warning/20 text-warning",
                  item.level === "low" && "bg-success/20 text-success",
                )}
              >
                {item.level.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-success/20"></div>
            <span className="text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-warning/20"></div>
            <span className="text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-destructive/20"></div>
            <span className="text-muted-foreground">High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
