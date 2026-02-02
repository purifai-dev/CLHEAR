"use client"

export type DefenseObligationType = "REGULATION" | "AUDIT_ASSURANCE" | "RISK_GOVERNANCE" | "BEST_PRACTICE"

export type DomainTag = "PEOPLE" | "TECHNOLOGY" | "PROCESS" | "REPORTING" | "OTHER"

export type ImplementationStatus = "implemented" | "partially_implemented" | "not_implemented" | "not_applicable"

export interface DefenseObligation {
  id: string
  title: string
  shortLabel: string
  description: string
  defenseObligationType: DefenseObligationType
  domainTags: DomainTag[]
  source: {
    type: "regulator" | "standard" | "framework" | "internal"
    name: string
    document?: string
    citation?: string
  }
  jurisdiction?: string
  linkedOffenseActivities: string[] // product/activity IDs
  linkedControls: {
    id: string
    name: string
    type: "policy" | "procedure" | "test" | "evidence"
    status: ImplementationStatus
  }[]
  linkedRoles: string[] // role IDs
  linkedSystems: string[] // system IDs
  implementationStatus: ImplementationStatus
  effectiveDate?: string
  reviewDate?: string
  notes?: string
}

// Sample obligations for each type
export const DEFENSE_OBLIGATIONS_CATALOGUE: DefenseObligation[] = [
  // REGULATIONS
  {
    id: "OBL-REG-001",
    title: "Client Money Protection",
    shortLabel: "CASS 7",
    description: "Requirements for firms holding client money to protect client assets through proper segregation and reconciliation.",
    defenseObligationType: "REGULATION",
    domainTags: ["PROCESS", "REPORTING"],
    source: {
      type: "regulator",
      name: "FCA",
      document: "Client Assets Sourcebook (CASS)",
      citation: "CASS 7.1-7.19",
    },
    jurisdiction: "UK",
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-001", name: "Client Money Reconciliation", type: "procedure", status: "implemented" },
      { id: "CTL-002", name: "Segregation Controls", type: "policy", status: "implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "implemented",
  },
  {
    id: "OBL-REG-002",
    title: "Transaction Reporting",
    shortLabel: "MiFIR Art. 26",
    description: "Obligation to report transactions in financial instruments to competent authorities.",
    defenseObligationType: "REGULATION",
    domainTags: ["TECHNOLOGY", "REPORTING"],
    source: {
      type: "regulator",
      name: "FCA/ESMA",
      document: "MiFIR",
      citation: "Article 26",
    },
    jurisdiction: "UK/EU",
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-003", name: "Trade Reporting System", type: "procedure", status: "implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "implemented",
  },
  {
    id: "OBL-REG-003",
    title: "Anti-Money Laundering",
    shortLabel: "MLR 2017",
    description: "Requirements for customer due diligence, ongoing monitoring, and suspicious activity reporting.",
    defenseObligationType: "REGULATION",
    domainTags: ["PEOPLE", "PROCESS", "TECHNOLOGY"],
    source: {
      type: "regulator",
      name: "FCA",
      document: "Money Laundering Regulations 2017",
      citation: "Part 2-4",
    },
    jurisdiction: "UK",
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-004", name: "CDD Procedures", type: "procedure", status: "implemented" },
      { id: "CTL-005", name: "Transaction Monitoring", type: "procedure", status: "partially_implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "partially_implemented",
  },
  {
    id: "OBL-REG-004",
    title: "Senior Managers Regime",
    shortLabel: "SM&CR",
    description: "Requirements for senior manager accountability, certification, and conduct rules.",
    defenseObligationType: "REGULATION",
    domainTags: ["PEOPLE"],
    source: {
      type: "regulator",
      name: "FCA",
      document: "Senior Managers and Certification Regime",
      citation: "SYSC 4.7-4.9",
    },
    jurisdiction: "UK",
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-006", name: "SMF Register", type: "evidence", status: "implemented" },
      { id: "CTL-007", name: "Annual Certification", type: "procedure", status: "implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "implemented",
  },
  {
    id: "OBL-REG-005",
    title: "Consumer Duty",
    shortLabel: "PS22/9",
    description: "Requirement to deliver good outcomes for retail customers across products and services.",
    defenseObligationType: "REGULATION",
    domainTags: ["PEOPLE", "PROCESS"],
    source: {
      type: "regulator",
      name: "FCA",
      document: "Consumer Duty",
      citation: "PRIN 2A",
    },
    jurisdiction: "UK",
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-008", name: "Fair Value Assessment", type: "procedure", status: "partially_implemented" },
      { id: "CTL-009", name: "Customer Outcomes Monitoring", type: "test", status: "not_implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "partially_implemented",
  },

  // AUDIT & ASSURANCE
  {
    id: "OBL-AUD-001",
    title: "Internal Audit Function",
    shortLabel: "IIA Standards",
    description: "Requirements for an independent internal audit function following IIA standards.",
    defenseObligationType: "AUDIT_ASSURANCE",
    domainTags: ["PEOPLE", "PROCESS"],
    source: {
      type: "standard",
      name: "Institute of Internal Auditors",
      document: "International Standards for the Professional Practice of Internal Auditing",
    },
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-010", name: "Audit Charter", type: "policy", status: "implemented" },
      { id: "CTL-011", name: "Annual Audit Plan", type: "procedure", status: "implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "implemented",
  },
  {
    id: "OBL-AUD-002",
    title: "SOC 2 Type II Compliance",
    shortLabel: "SOC 2",
    description: "Third-party attestation of security, availability, processing integrity, confidentiality, and privacy controls.",
    defenseObligationType: "AUDIT_ASSURANCE",
    domainTags: ["TECHNOLOGY", "PROCESS"],
    source: {
      type: "standard",
      name: "AICPA",
      document: "SOC 2 Trust Services Criteria",
    },
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-012", name: "Access Control Policy", type: "policy", status: "implemented" },
      { id: "CTL-013", name: "Change Management", type: "procedure", status: "implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "implemented",
  },
  {
    id: "OBL-AUD-003",
    title: "CASS Audit",
    shortLabel: "CASS Audit",
    description: "Annual external audit of client asset arrangements and compliance with CASS rules.",
    defenseObligationType: "AUDIT_ASSURANCE",
    domainTags: ["PROCESS", "REPORTING"],
    source: {
      type: "regulator",
      name: "FCA",
      document: "SUP 3.10",
      citation: "Client Assets Audit",
    },
    jurisdiction: "UK",
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-014", name: "CASS Resolution Pack", type: "evidence", status: "implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "implemented",
  },

  // RISK & GOVERNANCE
  {
    id: "OBL-RISK-001",
    title: "Enterprise Risk Management",
    shortLabel: "COSO ERM",
    description: "Framework for enterprise-wide risk identification, assessment, and management.",
    defenseObligationType: "RISK_GOVERNANCE",
    domainTags: ["PEOPLE", "PROCESS"],
    source: {
      type: "framework",
      name: "COSO",
      document: "Enterprise Risk Management - Integrating with Strategy and Performance",
    },
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-015", name: "Risk Appetite Statement", type: "policy", status: "implemented" },
      { id: "CTL-016", name: "Risk Register", type: "evidence", status: "implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "implemented",
  },
  {
    id: "OBL-RISK-002",
    title: "Operational Resilience",
    shortLabel: "PS21/3",
    description: "Requirements to identify important business services and set impact tolerances.",
    defenseObligationType: "RISK_GOVERNANCE",
    domainTags: ["TECHNOLOGY", "PROCESS"],
    source: {
      type: "regulator",
      name: "FCA/PRA",
      document: "Operational Resilience",
      citation: "PS21/3",
    },
    jurisdiction: "UK",
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-017", name: "IBS Mapping", type: "evidence", status: "partially_implemented" },
      { id: "CTL-018", name: "Scenario Testing", type: "test", status: "not_implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "partially_implemented",
  },
  {
    id: "OBL-RISK-003",
    title: "Three Lines of Defense",
    shortLabel: "3LoD",
    description: "Governance model separating risk ownership, oversight, and assurance functions.",
    defenseObligationType: "RISK_GOVERNANCE",
    domainTags: ["PEOPLE", "PROCESS"],
    source: {
      type: "framework",
      name: "IIA",
      document: "Three Lines Model",
    },
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-019", name: "3LoD Policy", type: "policy", status: "implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "implemented",
  },

  // BEST PRACTICES
  {
    id: "OBL-BP-001",
    title: "Information Security Management",
    shortLabel: "ISO 27001",
    description: "Best practice framework for establishing, implementing, and maintaining an ISMS.",
    defenseObligationType: "BEST_PRACTICE",
    domainTags: ["TECHNOLOGY", "PROCESS"],
    source: {
      type: "standard",
      name: "ISO",
      document: "ISO/IEC 27001:2022",
    },
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-020", name: "ISMS Policy", type: "policy", status: "implemented" },
      { id: "CTL-021", name: "Security Risk Assessment", type: "procedure", status: "implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "implemented",
  },
  {
    id: "OBL-BP-002",
    title: "Data Privacy Management",
    shortLabel: "GDPR",
    description: "Best practices for personal data protection and privacy compliance.",
    defenseObligationType: "BEST_PRACTICE",
    domainTags: ["TECHNOLOGY", "PROCESS", "PEOPLE"],
    source: {
      type: "regulator",
      name: "ICO",
      document: "UK GDPR",
    },
    jurisdiction: "UK",
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-022", name: "Privacy Policy", type: "policy", status: "implemented" },
      { id: "CTL-023", name: "DPIA Process", type: "procedure", status: "partially_implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "partially_implemented",
  },
  {
    id: "OBL-BP-003",
    title: "Business Continuity Management",
    shortLabel: "ISO 22301",
    description: "Framework for business continuity planning and disaster recovery.",
    defenseObligationType: "BEST_PRACTICE",
    domainTags: ["TECHNOLOGY", "PROCESS"],
    source: {
      type: "standard",
      name: "ISO",
      document: "ISO 22301:2019",
    },
    linkedOffenseActivities: [],
    linkedControls: [
      { id: "CTL-024", name: "BCP", type: "policy", status: "implemented" },
      { id: "CTL-025", name: "DR Testing", type: "test", status: "partially_implemented" },
    ],
    linkedRoles: [],
    linkedSystems: [],
    implementationStatus: "partially_implemented",
  },
]

export const OBLIGATION_TYPE_LABELS: Record<DefenseObligationType, string> = {
  REGULATION: "Regulations",
  AUDIT_ASSURANCE: "Audit & Assurance",
  RISK_GOVERNANCE: "Risk & Governance",
  BEST_PRACTICE: "Best Practices",
}

export const DOMAIN_TAG_LABELS: Record<DomainTag, string> = {
  PEOPLE: "People",
  TECHNOLOGY: "Technology",
  PROCESS: "Process",
  REPORTING: "Reporting",
  OTHER: "Other",
}

export const STATUS_LABELS: Record<ImplementationStatus, string> = {
  implemented: "Implemented",
  partially_implemented: "Partially Implemented",
  not_implemented: "Not Implemented",
  not_applicable: "Not Applicable",
}
