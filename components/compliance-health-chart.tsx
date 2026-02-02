"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { month: "Jan", score: 89, target: 90 },
  { month: "Feb", score: 91, target: 90 },
  { month: "Mar", score: 88, target: 90 },
  { month: "Apr", score: 92, target: 90 },
  { month: "May", score: 90, target: 90 },
  { month: "Jun", score: 93, target: 90 },
  { month: "Jul", score: 91, target: 90 },
  { month: "Aug", score: 94, target: 90 },
  { month: "Sep", score: 93, target: 90 },
  { month: "Oct", score: 95, target: 90 },
  { month: "Nov", score: 94, target: 90 },
  { month: "Dec", score: 94.2, target: 90 },
]

export function ComplianceHealthChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Compliance Health Trend</CardTitle>
        <CardDescription>12-month compliance score vs target</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={13} fontWeight={500} />
            <YAxis stroke="#94a3b8" fontSize={13} fontWeight={500} domain={[80, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--popover-foreground))",
              }}
              labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#06b6d4"
              strokeWidth={4}
              dot={{ fill: "#06b6d4", r: 6, strokeWidth: 2, stroke: "#0891b2" }}
              name="Actual Score"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#10b981"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-cyan-500 rounded" />
            <span className="text-sm font-medium text-slate-300">Actual Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-emerald-500 rounded border-2 border-dashed border-emerald-500" />
            <span className="text-sm font-medium text-slate-300">Target (90%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
