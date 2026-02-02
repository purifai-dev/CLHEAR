export type BusinessActivity = {
  id: string
  name: string
  category: string
  description: string
  linkedProducts: string[] // IDs of products this activity supports
  riskLevel: "Low" | "Medium" | "High" | "Very High"
  keyProcesses: string[]
  responsibleFunction: string
  pillarsLinked: string[]
  enabled: boolean
}

export const BUSINESS_ACTIVITIES_CATALOGUE: BusinessActivity[] = [
  // Client Onboarding & KYC/KYB
  {
    id: "act-001",
    name: "KYC/KYB Due Diligence",
    category: "Client Onboarding",
    description: "Customer identification, verification, and ongoing monitoring for individuals and businesses",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005", "prod-006", "prod-007"],
    riskLevel: "Very High",
    keyProcesses: ["Client risk assessment", "Document collection & verification", "Ongoing monitoring & refresh"],
    responsibleFunction: "Compliance",
    pillarsLinked: ["AML/CFT", "KYC"],
    enabled: true,
  },

  // Transaction Processing
  {
    id: "act-003",
    name: "Deposits & Withdrawals",
    category: "Transaction Processing",
    description: "Processing client funds in and out of the platform",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005", "prod-011", "prod-012"],
    riskLevel: "Very High",
    keyProcesses: ["Payment processing", "Reconciliation", "Failed payment handling", "Refund processing"],
    responsibleFunction: "Operations",
    pillarsLinked: ["AML/CFT", "Client Money Protection"],
    enabled: true,
  },
  {
    id: "act-004",
    name: "Trade Execution",
    category: "Transaction Processing",
    description: "Executing buy/sell orders for securities, crypto, and CFDs",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005"],
    riskLevel: "High",
    keyProcesses: ["Order placement", "Execution", "Trade confirmation", "Settlement"],
    responsibleFunction: "Trading Desk",
    pillarsLinked: ["Best Execution", "Market Conduct", "Order Handling"],
    enabled: true,
  },
  {
    id: "act-005",
    name: "Position Hedging",
    category: "Transaction Processing",
    description: "Managing firm's market risk exposure through hedging strategies",
    linkedProducts: ["prod-001", "prod-003", "prod-004", "prod-005"],
    riskLevel: "Very High",
    keyProcesses: ["Risk exposure calculation", "Hedge strategy execution", "P&L monitoring"],
    responsibleFunction: "Risk Management",
    pillarsLinked: ["Market Risk", "Counterparty Risk"],
    enabled: true,
  },

  // Middle Office Operations
  {
    id: "act-006",
    name: "Trade Reconciliation",
    category: "Middle Office",
    description: "Reconciling trades with counterparties, brokers, and custodians",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005"],
    riskLevel: "High",
    keyProcesses: ["Trade matching", "Break management", "Confirmation processing"],
    responsibleFunction: "Middle Office",
    pillarsLinked: ["Operational Risk", "Record Keeping"],
    enabled: true,
  },
  {
    id: "act-007",
    name: "Corporate Actions Processing",
    category: "Middle Office",
    description: "Managing dividends, stock splits, mergers, and other corporate events",
    linkedProducts: ["prod-002", "prod-007"],
    riskLevel: "Medium",
    keyProcesses: ["Event identification", "Client communication", "Entitlement processing", "Record updates"],
    responsibleFunction: "Middle Office",
    pillarsLinked: ["Client Money Protection", "Operational Risk"],
    enabled: true,
  },
  {
    id: "act-008",
    name: "Pricing & Valuation",
    category: "Middle Office",
    description: "Daily valuation of client positions and firm assets",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005", "prod-008"],
    riskLevel: "High",
    keyProcesses: ["Daily mark-to-market", "NAV calculation", "Price source management"],
    responsibleFunction: "Middle Office",
    pillarsLinked: ["Valuation", "Client Money Protection"],
    enabled: true,
  },
  {
    id: "act-009",
    name: "Margin & Collateral Management",
    category: "Middle Office",
    description: "Monitoring margin requirements and managing collateral for leveraged products",
    linkedProducts: ["prod-001", "prod-012", "prod-013"],
    riskLevel: "Very High",
    keyProcesses: ["Margin calculation", "Margin call issuance", "Collateral monitoring", "Forced liquidation"],
    responsibleFunction: "Risk Management",
    pillarsLinked: ["Credit Risk", "Client Money Protection"],
    enabled: true,
  },

  // Custody & Asset Servicing
  {
    id: "act-010",
    name: "Asset Custody",
    category: "Custody",
    description: "Safekeeping of client assets (cash, securities, crypto)",
    linkedProducts: ["prod-008", "prod-009", "prod-010"],
    riskLevel: "Very High",
    keyProcesses: ["Asset safeguarding", "Access control", "Reconciliation with sub-custodians"],
    responsibleFunction: "Custody Operations",
    pillarsLinked: ["Client Asset Protection", "Operational Risk"],
    enabled: true,
  },
  {
    id: "act-011",
    name: "Blockchain Node Operations",
    category: "Custody",
    description: "Operating and maintaining blockchain infrastructure for crypto custody",
    linkedProducts: ["prod-003", "prod-008", "prod-009", "prod-010"],
    riskLevel: "Very High",
    keyProcesses: ["Node deployment", "Network monitoring", "Protocol upgrades", "Transaction validation"],
    responsibleFunction: "Technology",
    pillarsLinked: ["Information Security", "Technology Risk"],
    enabled: true,
  },

  // Communications
  {
    id: "act-012",
    name: "Client Communications",
    category: "Communications",
    description: "Emails, chat, phone calls, and other client interactions",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005", "prod-006", "prod-007"],
    riskLevel: "High",
    keyProcesses: ["Email archiving", "Call recording", "Chat monitoring", "Social media oversight"],
    responsibleFunction: "Compliance",
    pillarsLinked: ["Market Conduct", "Record Keeping", "Advertising & Marketing"],
    enabled: true,
  },
  {
    id: "act-012a",
    name: "Internal Communications",
    category: "Communications",
    description: "Employee emails, internal messaging, team collaboration tools, and inter-departmental communications",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005"],
    riskLevel: "Medium",
    keyProcesses: ["Email monitoring", "Chat archiving", "Policy communication", "Internal announcements"],
    responsibleFunction: "Human Resources",
    pillarsLinked: ["Market Conduct", "Record Keeping", "Information Security"],
    enabled: true,
  },
  {
    id: "act-013",
    name: "Marketing Campaigns",
    category: "Communications",
    description: "Advertising, promotions, and client acquisition activities",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005", "prod-006", "prod-007"],
    riskLevel: "High",
    keyProcesses: ["Campaign design", "Compliance review", "Distribution", "Performance tracking"],
    responsibleFunction: "Marketing",
    pillarsLinked: ["Advertising & Marketing", "Market Conduct"],
    enabled: true,
  },

  // Legal Operations
  {
    id: "act-018",
    name: "Contract Management",
    category: "Legal",
    description: "Drafting, negotiating, and maintaining legal contracts",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005"],
    riskLevel: "Medium",
    keyProcesses: ["Contract drafting", "Negotiation", "Execution", "Repository management"],
    responsibleFunction: "Legal",
    pillarsLinked: ["Governance", "Operational Risk"],
    enabled: true,
  },
  {
    id: "act-020",
    name: "Litigation & Dispute Resolution",
    category: "Legal",
    description: "Managing legal disputes, arbitration, and client complaints escalation",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005"],
    riskLevel: "High",
    keyProcesses: ["Dispute assessment", "Legal strategy", "Negotiation/litigation", "Resolution"],
    responsibleFunction: "Legal",
    pillarsLinked: ["Complaints Handling", "Governance"],
    enabled: true,
  },

  // Training & HR

  // Data Management
  {
    id: "act-026",
    name: "Data Governance",
    category: "Data Management",
    description: "Managing data quality, lineage, privacy, and protection",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005"],
    riskLevel: "Very High",
    keyProcesses: ["Data catalog maintenance", "Quality monitoring", "Privacy compliance", "Breach management"],
    responsibleFunction: "Data Office",
    pillarsLinked: ["Data Management", "Information Security", "Privacy"],
    enabled: true,
  },
  {
    id: "act-027",
    name: "Cybersecurity Operations",
    category: "Data Management",
    description: "Protecting systems and data from cyber threats",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005"],
    riskLevel: "Very High",
    keyProcesses: ["Threat detection", "Incident response", "Security patching", "Security testing"],
    responsibleFunction: "Information Security",
    pillarsLinked: ["Information Security", "Technology Risk", "Operational Resilience"],
    enabled: true,
  },

  // Business Continuity
  {
    id: "act-028",
    name: "Business Continuity Planning",
    category: "Operational Resilience",
    description: "Maintaining critical operations during disruptions",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005"],
    riskLevel: "High",
    keyProcesses: ["BCP development", "Testing", "Invocation", "Recovery"],
    responsibleFunction: "Risk Management",
    pillarsLinked: ["Operational Resilience", "Technology Risk"],
    enabled: true,
  },
  {
    id: "act-029",
    name: "Incident Management",
    category: "Operational Resilience",
    description: "Detecting, responding to, and resolving operational incidents",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005"],
    riskLevel: "High",
    keyProcesses: ["Incident detection", "Response", "Resolution", "Post-incident review"],
    responsibleFunction: "Operations",
    pillarsLinked: ["Operational Resilience", "Operational Risk"],
    enabled: true,
  },

  // Product Governance
  {
    id: "act-030",
    name: "Product Design & Approval",
    category: "Product Governance",
    description: "Designing, testing, and approving new financial products",
    linkedProducts: ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005", "prod-006", "prod-007"],
    riskLevel: "Very High",
    keyProcesses: ["Product design", "Risk assessment", "Approval", "Launch"],
    responsibleFunction: "Product",
    pillarsLinked: ["Product Governance", "Market Conduct"],
    enabled: true,
  },
]

export const ACTIVITY_CATEGORIES = [
  "Client Onboarding",
  "Transaction Processing",
  "Middle Office",
  "Custody",
  "Communications",
  "Third-Party Management",
  "Finance",
  "Legal",
  "Data Management",
  "Operational Resilience",
  "Product Governance",
]
