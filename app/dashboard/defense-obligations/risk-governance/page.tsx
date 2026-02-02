import { DashboardShell } from "@/components/dashboard-shell"
import { DefenseObligationsContent } from "@/components/defense-obligations-content"

export default function RiskGovernancePage() {
  return (
    <DashboardShell>
      <DefenseObligationsContent obligationType="RISK_GOVERNANCE" />
    </DashboardShell>
  )
}
