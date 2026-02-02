"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertCircle, CheckCircle, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "audit",
    title: "Q4 AML Audit Completed",
    time: "2 hours ago",
    status: "completed",
    icon: CheckCircle,
    color: "text-success",
  },
  {
    id: 2,
    type: "alert",
    title: "High-Risk Transaction Flagged",
    time: "4 hours ago",
    status: "attention",
    icon: AlertCircle,
    color: "text-warning",
  },
  {
    id: 3,
    type: "document",
    title: "Updated SOPs Published",
    time: "6 hours ago",
    status: "info",
    icon: FileText,
    color: "text-primary",
  },
  {
    id: 4,
    type: "review",
    title: "Vendor Risk Assessment Due",
    time: "1 day ago",
    status: "pending",
    icon: Clock,
    color: "text-muted-foreground",
  },
  {
    id: 5,
    type: "audit",
    title: "Cybersecurity Review Passed",
    time: "2 days ago",
    status: "completed",
    icon: CheckCircle,
    color: "text-success",
  },
]

export function RecentActivity() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest compliance and risk updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 ${activity.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    activity.status === "completed"
                      ? "bg-success/20 text-success border-success/30"
                      : activity.status === "attention"
                        ? "bg-warning/20 text-warning border-warning/30"
                        : ""
                  }
                >
                  {activity.status}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
