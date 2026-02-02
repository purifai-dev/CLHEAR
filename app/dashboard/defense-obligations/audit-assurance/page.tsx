import { DashboardShell } from "@/components/dashboard-shell"
import { DefenseObligationsContent } from "@/components/defense-obligations-content"

export default function AuditAssurancePage() {
  return (
    <DashboardShell>
      <DefenseObligationsContent obligationType="AUDIT_ASSURANCE" />
    </DashboardShell>
  )
}
