import { DashboardShell } from "@/components/dashboard-shell"
import { DefenseObligationsContent } from "@/components/defense-obligations-content"

export default function RegulationsPage() {
  return (
    <DashboardShell>
      <DefenseObligationsContent obligationType="REGULATION" />
    </DashboardShell>
  )
}
