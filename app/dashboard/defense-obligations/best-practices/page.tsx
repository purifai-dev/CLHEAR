import { DashboardShell } from "@/components/dashboard-shell"
import { DefenseObligationsContent } from "@/components/defense-obligations-content"

export default function BestPracticesPage() {
  return (
    <DashboardShell>
      <DefenseObligationsContent obligationType="BEST_PRACTICE" />
    </DashboardShell>
  )
}
