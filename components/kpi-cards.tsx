import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const kpis = [
  {
    title: "Overall Compliance Score",
    value: "94.2%",
    change: "+2.3%",
    trend: "up",
    icon: CheckCircle2,
    color: "text-success",
  },
  {
    title: "Open Risk Items",
    value: "23",
    change: "-5",
    trend: "up",
    icon: AlertTriangle,
    color: "text-warning",
  },
  {
    title: "Pending Reviews",
    value: "12",
    change: "+3",
    trend: "down",
    icon: Clock,
    color: "text-primary",
  },
  {
    title: "Completed Audits",
    value: "47",
    change: "+8",
    trend: "up",
    icon: FileCheck,
    color: "text-success",
  },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        const isPositive = kpi.trend === "up"
        const TrendIcon = isPositive ? TrendingUp : TrendingDown

        return (
          <Card key={kpi.title} className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold mt-2">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendIcon className={cn("w-4 h-4", isPositive ? "text-success" : "text-destructive")} />
                    <span className={cn("text-sm font-medium", isPositive ? "text-success" : "text-destructive")}>
                      {kpi.change}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                  </div>
                </div>
                <div className={cn("w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center", kpi.color)}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
