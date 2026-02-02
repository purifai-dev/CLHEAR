"use client"
import { CompliancePillars } from "@/components/compliance-pillars"
import { RiskHeatMap } from "@/components/risk-heat-map"
import { ComplianceHealthChart } from "@/components/compliance-health-chart"
import { RecentActivity } from "@/components/recent-activity"
import { KPICards } from "@/components/kpi-cards"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Real-Time Governance View</h1>
        <p className="text-muted-foreground mt-1">Monitor compliance health across all regulatory frameworks</p>
      </div>

      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompliancePillars />
        </div>
        <div>
          <RiskHeatMap />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceHealthChart />
        <RecentActivity />
      </div>
    </div>
  )
}
