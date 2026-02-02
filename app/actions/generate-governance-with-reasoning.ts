"use server"

import { generateObject } from "ai"
import { z } from "zod"

const GovernanceBodySchema = z.object({
  bodyId: z.string(),
  bodyName: z.string(),
  reasoning: z.string().describe("Detailed reasoning based on CLHEAR standards explaining why this body is required"),
  applicableStandards: z.array(z.string()).describe("List of applicable CLHEAR/regulatory standards"),
  keyRequirements: z.array(z.string()).describe("Key regulatory requirements this body addresses"),
  risksCovered: z.array(z.string()).describe("Types of risks this body manages and oversees"),
})

const GovernanceRecommendationSchema = z.object({
  bodies: z.array(GovernanceBodySchema),
  overallRationale: z.string().describe("Overall explanation of the governance structure"),
  complianceGaps: z.array(z.string()).describe("Potential compliance gaps if any bodies are missing"),
})

export async function generateGovernanceWithReasoning(
  entities: Array<{
    id: string
    legalName: string
    entityRole: string
    jurisdiction: string
  }>,
) {
  try {
    const entityContext = entities.map((e) => `- ${e.legalName} (${e.jurisdiction}): ${e.entityRole}`).join("\n")

    const prompt = `You are a regulatory compliance expert analyzing the governance structure requirements for a financial services group.

Company Structure:
${entityContext}

Based on CLHEAR's 22 best practice standards covering:
1. Governance & Oversight
2. Regulatory Licensing & Notifications  
3. Financial Crime (AML/CFT/Sanctions)
4. Product Governance & Target Market
5. Client Asset Protection & Custody
6. Conflicts of Interest & Market Conduct
7. Order Execution & Best Execution
8. Market Surveillance & Abuse Prevention
9. Investment Research & Analysis
10. Risk Management & ICARA
11. Operational Resilience & BCM
12. Change Management & Technology Risk
13. Regulatory Reporting & Records
14. Data Privacy & Protection (GDPR/CCPA)
15. Information Security & Cyber
16. Internal Audit & Assurance
17. Financial Reporting & Controls
18. Complaints & Client Communications

Analyze which of the following 30 governance bodies are REQUIRED for this corporate structure and explain WHY based on the specific standards:

**Tier 1: Board Level (5 bodies)**
1. Board of Directors
2. Board Audit Committee  
3. Board Risk Committee
4. Board Compliance and Conduct Committee
5. Board Remuneration/Compensation Committee

**Tier 2: Senior Management Forums (12 bodies)**
6. Executive Committee (ExCo)
7. Enterprise Risk Management (ERM) Committee
8. Compliance Management Committee
9. Financial Crime and AML Committee
10. Product Governance and Approval Committee
11. Conduct and Conflicts Committee
12. Operational Resilience Committee
13. Data Governance and Privacy Committee
14. Information Security and Cyber Committee
15. Regulatory Reporting Committee
16. Client Asset and Custody Committee
17. Market Conduct and Surveillance Committee

**Tier 3: Working-Level Forums (13 bodies)**
18. KYC/Onboarding Working Group
19. Transaction Monitoring Working Group
20. Sanctions Screening Working Group
21. Product Design and Review Working Group
22. Best Execution Working Group
23. Order Management Working Group
24. Change Advisory Board (CAB)
25. IT Security Operations Forum
26. Business Continuity Planning Forum
27. Data Quality and Lineage Forum
28. Records and Document Management Forum
29. Training and Competence Forum
30. Complaints Review Forum

For each required body, provide:
- Clear reasoning based on CLHEAR standards
- Specific standard references (e.g., "BCBS Principle 3", "ISO 37301", "FATF Rec 18")
- Key regulatory requirements it addresses
- Types of risks it manages

Prioritize based on entity types (investment firm, crypto exchange, EMI, holding company).`

    const { object } = await generateObject({
      model: "anthropic/claude-opus-4",
      schema: GovernanceRecommendationSchema,
      prompt,
      maxOutputTokens: 4000,
    })

    return {
      success: true,
      data: object,
    }
  } catch (error: any) {
    console.error("[v0] AI governance generation error:", error)
    return {
      success: false,
      error: error.message || "Failed to generate governance structure",
    }
  }
}
