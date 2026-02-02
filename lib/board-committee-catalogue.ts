interface LegalEntity {
  id: string
  brandName: string
  legalName: string
  lei: string
  address: string
  jurisdiction: string
  entityRole: string
  logo?: string
  entityType: "parent" | "subsidiary"
  licenses?: Array<{
    licenseType: string
    licenseNumber: string
    issuingAuthority: string
  }>
}

export interface CommitteeMember {
  memberId: string
  personId: string | null
  role: "Chair" | "Member" | "Secretary"
  appointmentDate?: string
}

export interface BoardCommittee {
  id: string
  name: string
  type: "Board" | "Committee" | "Forum"
  level: "Apex Governance" | "Board Sub-Committee" | "Senior Management Forum" | "Working-Level Forum"
  purpose: string
  meetingFrequency: string
  isRequired: boolean
  seats: Array<{
    memberId: string
    role: string
    assignedPerson?: { personId: string; fullName: string; jobTitle: string }
  }>
  chair: string
  coreMembership: string
  coreResponsibilities: string
  standardsBasis: string
  keyStandardQuote?: string
  pillarsCovered: string[]
  escalationTo?: string
  applicableEntityIds: string[]
  sizeAndComposition: string
  reportingLine: string
  keyResponsibilities: string[]
  evidenceRequired: string[]
  clhearRolesRequired: string[]
  clhearRationale: {
    pillarsCovered: string
    mandatoryReason: string
    referenceStandards: Array<{
      standard: string
      quote: string
    }>
    entityApplicability: Array<{
      entityId: string
      entityName: string
      applicable: boolean
      reason: string
    }>
  }
  suggestedTier?: "MANDATORY" | "STRONGLY_RECOMMENDED" | "OPTIONAL"
  canBeSharedWith: string[] // Entity IDs this body can be shared with
  mustBeStandaloneFor: string[] // Entity IDs that require their own standalone version
  sharingRationale?: string // Explanation of why sharing is/isn't possible
}

interface BoardCommitteeTemplate {
  id: string
  name: string
  type: "Board" | "Committee" | "Forum"
  level: "Apex Governance" | "Board Sub-Committee" | "Senior Management Forum" | "Working-Level Forum"
  priority: "Mandatory" | "Strongly Recommended" | "Optional/Conditional"
  purpose: string
  meetingFrequency: string
  chair: string
  coreMembership: string
  coreResponsibilities: string
  standardsBasis: string
  keyStandardQuote?: string
  pillarsCovered: string[]
  escalationTo?: string
  defaultMemberCount: number
  requiredForEntityTypes: string[]
  requiredForParentOnly?: boolean
  requiredForRegulatedOnly?: boolean
  sizeAndComposition: string
  reportingLine: string
  keyResponsibilities: string[]
  evidenceRequired: string[]
  clhearRolesRequired: string[]
  suggestedTier?: "MANDATORY" | "STRONGLY_RECOMMENDED" | "OPTIONAL"
  canBeSharedWith: string[] // Entity IDs this body can be shared with
  mustBeStandaloneFor: string[] // Entity IDs that require their own standalone version
  sharingRationale?: string // Explanation of why sharing is/isn't possible
}

// ============== MANDATORY BODIES (Board Level) ==============
const COMPREHENSIVE_GOVERNANCE_TEMPLATES: BoardCommitteeTemplate[] = [
  {
    id: "BOARD_OF_DIRECTORS",
    name: "Board of Directors",
    type: "Board",
    level: "Apex Governance",
    priority: "Mandatory",
    purpose: "Ultimate governing body responsible for strategy, oversight, and compliance",
    meetingFrequency: "Quarterly minimum",
    chair: "Independent Chair",
    coreMembership: "CEO, CCO, CRO, CFO, Independent Directors",
    coreResponsibilities: "Strategic direction, risk oversight, regulatory compliance oversight",
    standardsBasis: "CySEC MiFID II (EU 2017/565), FCA SYSC, SOX Section 301",
    keyStandardQuote: "Management body shall collectively ensure effective governance",
    pillarsCovered: ["Governance & Roles", "Risk Management", "Regulatory Requirements"],
    defaultMemberCount: 5,
    requiredForEntityTypes: ["parent", "subsidiary"],
    sizeAndComposition: "5+ directors, minimum 1 independent",
    reportingLine: "None (Apex body)",
    keyResponsibilities: [
      "Approve annual strategy and business plan",
      "Oversee risk appetite and risk management framework",
      "Approve significant transactions and capital allocation",
      "Monitor regulatory compliance and approve compliance policies",
      "Appoint and oversee senior management",
      "Review and approve financial statements",
    ],
    evidenceRequired: [
      "Board minutes (quarterly)",
      "Annual strategy documents",
      "Risk appetite statements (approved)",
      "Compliance policy approvals",
      "Director appointment letters",
      "Retention: 7 years minimum",
    ],
    clhearRolesRequired: ["CEO", "CCO", "CRO", "CFO", "Independent Chair"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Each entity must have its own Board of Directors for legal and regulatory reasons",
  },
  {
    id: "BOARD_RISK_COMMITTEE",
    name: "Board Risk Committee",
    type: "Committee",
    level: "Board Sub-Committee",
    priority: "Mandatory",
    purpose: "Board-level oversight of risk strategy, risk appetite, and material risk exposures",
    meetingFrequency: "Monthly minimum",
    chair: "CRO or Independent Director",
    coreMembership: "CRO (Chair), Independent Directors, CFO",
    coreResponsibilities: "Risk strategy approval, risk appetite setting, material risk escalations",
    standardsBasis: "CySEC MiFID II (EU 2017/1200), BCBS Sound Practices, FCA SYSC",
    keyStandardQuote:
      "Investment firms shall establish a Board-level committee with responsibility for risk strategy and escalation",
    pillarsCovered: ["Risk Management", "Regulatory Requirements"],
    escalationTo: "Board of Directors",
    defaultMemberCount: 3,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "3+ members, minimum 2 independent",
    reportingLine: "Reports to Board of Directors monthly",
    keyResponsibilities: [
      "Review and approve risk appetite framework",
      "Monitor material risk exposures (market, credit, operational, liquidity)",
      "Escalate breaches of risk limits to full Board",
      "Approve risk mitigation strategies",
      "Review stress testing and scenario analysis results",
      "Oversee capital adequacy and regulatory capital calculations",
    ],
    evidenceRequired: [
      "Risk Committee minutes (monthly)",
      "Risk appetite statements (updated annually)",
      "Risk limit breach reports",
      "Stress test results (quarterly)",
      "Capital adequacy reports",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["CRO", "Independent Director", "CFO"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Regulated entities require standalone Board Risk Committees per jurisdiction",
  },
  {
    id: "BOARD_AUDIT_COMMITTEE",
    name: "Board Audit Committee",
    type: "Committee",
    level: "Board Sub-Committee",
    priority: "Mandatory",
    purpose: "Independent oversight of financial reporting, internal audit, and external audit",
    meetingFrequency: "Quarterly minimum",
    chair: "Independent Chair",
    coreMembership: "Independent Directors (all), Head of Internal Audit, External Audit Partner (observer)",
    coreResponsibilities:
      "Financial statement oversight, internal audit oversight, external audit relationship management",
    standardsBasis: "CySEC MiFID II, EU Audit Regulation (2014/537), SOX Section 301",
    keyStandardQuote:
      "Establishment of an independent audit committee with oversight of financial reporting and audit processes",
    pillarsCovered: ["Assurance & Remediation", "Governance & Roles"],
    escalationTo: "Board of Directors",
    defaultMemberCount: 3,
    requiredForEntityTypes: ["parent", "subsidiary"],
    sizeAndComposition: "3+ members, all independent non-executive directors",
    reportingLine: "Reports to Board of Directors quarterly",
    keyResponsibilities: [
      "Review quarterly and annual financial statements before Board approval",
      "Approve internal audit charter and annual audit plan",
      "Review internal audit findings and management responses",
      "Oversee external auditor appointment and independence",
      "Review effectiveness of internal controls (ICFR)",
      "Monitor whistleblowing reports and investigations",
    ],
    evidenceRequired: [
      "Audit Committee minutes (quarterly)",
      "Internal audit reports and management action plans",
      "External auditor independence letters",
      "ICFR effectiveness assessments",
      "Whistleblowing case summaries",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["Independent Chair", "Head of Internal Audit"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Each entity requires independent Audit Committee per regulatory requirements",
  },
  {
    id: "BOARD_REMUNERATION_NOMINATIONS",
    name: "Board Remuneration & Nominations Committee",
    type: "Committee",
    level: "Board Sub-Committee",
    priority: "Mandatory",
    purpose: "Oversight of remuneration policies, director nominations, and succession planning",
    meetingFrequency: "Semi-annually",
    chair: "Independent Chair",
    coreMembership: "Independent Directors, CEO (observer for certain items)",
    coreResponsibilities: "Remuneration policy approval, director nominations, succession planning",
    standardsBasis: "CySEC MiFID II (EU 2017/565), FCA SYSC 19D, EBA Remuneration Guidelines",
    keyStandardQuote: "Remuneration policies shall be approved by board and monitored by independent committee",
    pillarsCovered: ["Governance & Roles"],
    escalationTo: "Board of Directors",
    defaultMemberCount: 3,
    requiredForEntityTypes: ["parent", "subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "3+ members, all independent",
    reportingLine: "Reports to Board of Directors semi-annually",
    keyResponsibilities: [
      "Approve remuneration policy for senior management and risk takers",
      "Review and approve variable remuneration awards (bonus, LTIP)",
      "Ensure alignment with risk outcomes and deferral rules",
      "Approve director nominations and appointment processes",
      "Oversee succession planning for Board and C-suite",
      "Monitor gender diversity and board composition",
    ],
    evidenceRequired: [
      "Remuneration Committee minutes (semi-annual)",
      "Remuneration policy documents",
      "Variable pay award schedules with deferral schedules",
      "Director nomination and appointment records",
      "Succession planning documents",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["Independent Chair", "Independent Director", "CEO"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Remuneration oversight must be entity-specific per regulatory requirements",
  },
  {
    id: "AML_CFT_OVERSIGHT_COMMITTEE",
    name: "AML/CFT Oversight Committee",
    type: "Committee",
    level: "Board Sub-Committee",
    priority: "Mandatory",
    purpose: "Board-level oversight of anti-money laundering, counter-terrorist financing, and sanctions compliance",
    meetingFrequency: "Monthly minimum (given crypto exposure)",
    chair: "CCO",
    coreMembership: "CCO (Chair), MLRO, Head of Crypto Compliance, CFO",
    coreResponsibilities: "AML/CFT program oversight, sanctions compliance, crypto asset AML (MiCA)",
    standardsBasis: "FATF 40 Recommendations (2012), CySEC MiCA (EU 2023/1114), FCA MLR 2017",
    keyStandardQuote:
      "Senior management shall establish governance and oversight of AML/CFT. Service providers shall maintain appropriate AML/CFT governance for crypto assets",
    pillarsCovered: ["Financial Crime Prevention", "Sanctions Compliance"],
    escalationTo: "Board of Directors",
    defaultMemberCount: 4,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "4+ members including CCO, MLRO, Crypto Compliance Lead",
    reportingLine: "Reports to Board of Directors monthly",
    keyResponsibilities: [
      "Approve AML/CFT policies and procedures",
      "Review transaction monitoring effectiveness and alert disposition",
      "Oversee Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD)",
      "Monitor sanctions screening effectiveness and false positive rates",
      "Review Suspicious Activity Reports (SARs) and escalations",
      "Approve crypto asset-specific AML controls (MiCA requirements)",
      "Oversee MLRO independence and resources",
    ],
    evidenceRequired: [
      "AML/CFT Committee minutes (monthly)",
      "AML/CFT risk assessments (annual)",
      "Transaction monitoring effectiveness reports",
      "SAR filing summaries (anonymized)",
      "Sanctions screening audit logs",
      "MiCA crypto AML compliance reports",
      "Retention: 7 years minimum (10 years for crypto under MiCA)",
    ],
    clhearRolesRequired: ["CCO", "MLRO", "Head of Crypto Compliance", "CFO"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "AML/CFT governance must be entity-specific per FATF and MiCA requirements",
  },
  {
    id: "PRODUCT_GOVERNANCE_COMMITTEE",
    name: "Product Governance Committee",
    type: "Committee",
    level: "Board Sub-Committee",
    priority: "Mandatory",
    purpose: "Governance over product design, testing, approval, and ongoing suitability assessment",
    meetingFrequency: "Quarterly minimum (or upon new product launch)",
    chair: "Head of Product",
    coreMembership: "Head of Product (Chair), CRO, Compliance Manager, Client Operations, Legal",
    coreResponsibilities: "Product approval, target market definition, distribution strategy oversight",
    standardsBasis: "CySEC MiFID II (EU 2017/1200, ESMA Guidelines), FCA Product Governance Rules",
    keyStandardQuote:
      "Investment firms shall establish governance for product design, testing, and suitability controls",
    pillarsCovered: ["Risk Management", "Regulatory Requirements"],
    escalationTo: "Board of Directors",
    defaultMemberCount: 5,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "5+ members including Product, Risk, Compliance, Legal",
    reportingLine: "Reports to Board of Directors quarterly",
    keyResponsibilities: [
      "Approve new product launches and target market definitions",
      "Review product testing results and suitability assessments",
      "Monitor product performance and customer outcomes",
      "Approve distribution strategies and marketing materials",
      "Review product-related complaints and customer feedback",
      "Ensure ongoing product reviews and sunset decisions",
    ],
    evidenceRequired: [
      "Product Committee minutes (quarterly + ad hoc)",
      "Product approval documents with target market definitions",
      "Product testing results and scenario analysis",
      "Distribution strategy approvals",
      "Product performance monitoring reports",
      "Retention: Life of product + 7 years",
    ],
    clhearRolesRequired: ["Head of Product", "CRO", "Compliance Manager", "Legal"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Product governance must be entity-specific per MiFID II requirements",
  },

  // ============== STRONGLY RECOMMENDED BODIES ==============
  {
    id: "TECHNOLOGY_CYBERSECURITY_COMMITTEE",
    name: "Technology & Cybersecurity Committee",
    type: "Committee",
    level: "Board Sub-Committee",
    priority: "Strongly Recommended",
    purpose: "Board-level oversight of technology strategy, IT risk, and cybersecurity resilience",
    meetingFrequency: "Quarterly",
    chair: "CTO / Chief Information Officer",
    coreMembership: "CTO/CIO (Chair), CRO, CCO, CISO",
    coreResponsibilities: "Technology strategy, cybersecurity oversight, IT risk management",
    standardsBasis: "EBA Guidelines on ICT Risk Management (2021), NIST Cybersecurity Framework, DORA (EU 2022/2554)",
    keyStandardQuote: "Senior management shall establish board-level oversight of IT and cybersecurity risks",
    pillarsCovered: ["Data, Evidence & Technology", "Risk Management"],
    escalationTo: "Board of Directors",
    defaultMemberCount: 3,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "3+ members including CTO, CISO, CRO",
    reportingLine: "Reports to Board of Directors quarterly",
    keyResponsibilities: [
      "Approve technology strategy and IT investment plans",
      "Review cybersecurity risk assessments and threat intelligence",
      "Monitor cybersecurity incident response and breach notifications",
      "Oversee third-party technology risk (cloud, SaaS, vendors)",
      "Review IT disaster recovery and business continuity testing",
      "Approve significant technology projects and system changes",
    ],
    evidenceRequired: [
      "Technology Committee minutes (quarterly)",
      "Cybersecurity risk assessments (annual)",
      "Incident response reports and post-mortems",
      "Third-party vendor risk assessments",
      "DR/BC test results",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["CTO/CIO", "CISO", "CRO"],
    suggestedTier: "STRONGLY_RECOMMENDED",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Technology oversight increasingly required by regulators (EBA, DORA)",
  },
  {
    id: "CONFLICTS_OF_INTEREST_COMMITTEE",
    name: "Conflicts of Interest Committee",
    type: "Committee",
    level: "Board Sub-Committee",
    priority: "Strongly Recommended",
    purpose: "Oversight of conflicts of interest management, related party transactions, and independence",
    meetingFrequency: "Quarterly or as needed",
    chair: "General Counsel",
    coreMembership: "General Counsel (Chair), CCO, Independent Director",
    coreResponsibilities: "Conflicts identification, management, escalation, and disclosure",
    standardsBasis: "CySEC MiFID II (EU 2017/565 Art 23-24), FCA COBS 11.2, IAS 24 Related Party Disclosures",
    keyStandardQuote: "Investment firms shall maintain conflicts of interest policies and escalation procedures",
    pillarsCovered: ["Governance & Roles", "Risk Management"],
    escalationTo: "Board of Directors",
    defaultMemberCount: 3,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "3+ members including Legal, Compliance, Independent Director",
    reportingLine: "Reports to Board of Directors quarterly",
    keyResponsibilities: [
      "Review and approve conflicts of interest policy",
      "Assess material conflicts arising from business activities",
      "Review related party transactions and approve/reject",
      "Monitor gifts and entertainment registers",
      "Review personal account dealing by employees",
      "Oversee disclosure of conflicts to clients and regulators",
    ],
    evidenceRequired: [
      "Conflicts Committee minutes (quarterly)",
      "Conflicts of interest register (live document)",
      "Related party transaction approvals",
      "Gifts and entertainment registers",
      "Personal account dealing logs",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["General Counsel", "CCO", "Independent Director"],
    suggestedTier: "STRONGLY_RECOMMENDED",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Conflicts management can benefit from entity-specific oversight",
  },

  // ============== MANAGEMENT-LEVEL BODIES ==============
  {
    id: "EXECUTIVE_RISK_COMMITTEE",
    name: "Executive Risk Committee",
    type: "Committee",
    level: "Senior Management Forum",
    priority: "Mandatory",
    purpose: "Management-level risk identification, assessment, and mitigation coordination",
    meetingFrequency: "Monthly",
    chair: "CRO",
    coreMembership: "CRO (Chair), CFO, COO, Head of Trading, Head of Operations, MLRO",
    coreResponsibilities: "Operational risk management, risk mitigation execution, Board Risk Committee feed",
    standardsBasis: "BCBS Sound Practices (2013), CySEC MiFID II Risk Management",
    keyStandardQuote: "The CRO shall chair a management-level risk committee with cross-functional representation",
    pillarsCovered: ["Risk Management"],
    escalationTo: "Board Risk Committee",
    defaultMemberCount: 6,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "6-8 members including CRO, CFO, COO, business heads",
    reportingLine: "Reports to Board Risk Committee monthly",
    keyResponsibilities: [
      "Identify and assess emerging risks across business units",
      "Coordinate risk mitigation actions and monitor effectiveness",
      "Review operational risk events and root cause analysis",
      "Monitor key risk indicators (KRIs) and trigger alerts",
      "Prepare Board Risk Committee reporting packs",
      "Approve operational risk policies and procedures",
    ],
    evidenceRequired: [
      "Executive Risk Committee minutes (monthly)",
      "Risk event logs and root cause analyses",
      "KRI dashboards and breach reports",
      "Risk mitigation action trackers",
      "Board Risk Committee reporting packs",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["CRO", "CFO", "COO", "MLRO"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: ["group_level"],
    mustBeStandaloneFor: [],
    sharingRationale: "Can be shared at group level with entity-specific sub-committees feeding in",
  },
  {
    id: "ASSET_LIABILITY_COMMITTEE",
    name: "Asset & Liability Committee (ALCO)",
    type: "Committee",
    level: "Senior Management Forum",
    priority: "Mandatory",
    purpose: "Management of balance sheet, funding, liquidity, and interest rate risk",
    meetingFrequency: "Monthly",
    chair: "CFO",
    coreMembership: "CFO (Chair), CRO, Treasurer, COO, FP&A Lead",
    coreResponsibilities: "Liquidity management, funding strategy, interest rate risk, capital planning",
    standardsBasis: "BCBS Guidelines on Interest Rate Risk (2015), CRD V / CRR II Capital Requirements",
    keyStandardQuote: "ALCO shall oversee funding, liquidity, and interest rate risk with monthly reporting",
    pillarsCovered: ["Risk Management", "Regulatory Requirements"],
    escalationTo: "Board Risk Committee / Board of Directors",
    defaultMemberCount: 4,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "4-5 members including CFO, Treasurer, CRO",
    reportingLine: "Reports to Board Risk Committee monthly",
    keyResponsibilities: [
      "Monitor liquidity ratios (LCR, NSFR) and internal liquidity buffers",
      "Approve funding strategy and capital raising plans",
      "Manage interest rate risk and hedging strategies",
      "Review balance sheet composition and risk concentrations",
      "Oversee regulatory capital calculations and planning",
      "Coordinate stress testing for liquidity and capital adequacy",
    ],
    evidenceRequired: [
      "ALCO minutes (monthly)",
      "Liquidity monitoring reports (daily/weekly summaries)",
      "Funding plans and capital raising approvals",
      "Interest rate risk sensitivity analyses",
      "Regulatory capital reports",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["CFO", "CRO", "Treasurer", "COO"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Balance sheet management must be entity-specific per regulatory requirements",
  },
  {
    id: "AML_CFT_EXECUTION_COMMITTEE",
    name: "AML/CFT Execution Committee",
    type: "Committee",
    level: "Senior Management Forum",
    priority: "Mandatory",
    purpose: "Operational execution of AML/CFT program and ongoing monitoring",
    meetingFrequency: "Fortnightly (given crypto exposure)",
    chair: "MLRO",
    coreMembership: "MLRO (Chair), Compliance Team Lead, Risk Manager, Operations Lead",
    coreResponsibilities: "Transaction monitoring, alert review, SAR filing, remediation execution",
    standardsBasis: "FATF 40 Recommendations (2012), CySEC MiCA AML Rules",
    keyStandardQuote: "Ongoing monitoring and remediation of AML/CFT controls with escalation protocols",
    pillarsCovered: ["Financial Crime Prevention", "Sanctions Compliance"],
    escalationTo: "AML/CFT Oversight Committee",
    defaultMemberCount: 4,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "4-5 members including MLRO, Compliance, Risk, Operations",
    reportingLine: "Reports to Board AML/CFT Oversight Committee monthly",
    keyResponsibilities: [
      "Review transaction monitoring alerts and disposition decisions",
      "Approve Suspicious Activity Report (SAR) filings",
      "Monitor Customer Due Diligence (CDD) effectiveness",
      "Review sanctions screening hits and false positive rates",
      "Coordinate remediation of AML/CFT audit findings",
      "Oversee crypto asset-specific AML controls (MiCA)",
    ],
    evidenceRequired: [
      "AML/CFT Execution Committee minutes (fortnightly)",
      "Transaction monitoring alert logs and disposition records",
      "SAR filing records (anonymized summaries for committee)",
      "CDD/EDD quality assurance reviews",
      "Sanctions screening audit trails",
      "Retention: 7 years minimum",
    ],
    clhearRolesRequired: ["MLRO", "Compliance Team Lead", "Risk Manager"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "AML execution must be entity-specific due to jurisdictional requirements",
  },

  // ============== WORKING-LEVEL BODIES (Forums) ==============
  {
    id: "TRANSACTION_MONITORING_REVIEW_FORUM",
    name: "Transaction Monitoring Review Forum",
    type: "Forum",
    level: "Working-Level Forum",
    priority: "Mandatory",
    purpose: "Operational review of transaction monitoring alerts and disposition quality",
    meetingFrequency: "Bi-weekly",
    chair: "Compliance Analyst Lead",
    coreMembership: "Compliance Analysts (4-5), Operations, Risk",
    coreResponsibilities: "Alert review, quality assurance, tuning transaction monitoring rules",
    standardsBasis: "FATF 40 Recommendations (2012), Ongoing transaction monitoring requirement",
    keyStandardQuote: "Ongoing transaction monitoring and alert review with documentation of disposition decisions",
    pillarsCovered: ["Financial Crime Prevention"],
    escalationTo: "AML/CFT Execution Committee",
    defaultMemberCount: 4,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "4-5 compliance analysts, operations staff",
    reportingLine: "Escalates to AML/CFT Execution Committee bi-weekly",
    keyResponsibilities: [
      "Review transaction monitoring alerts for suspicious activity",
      "Document disposition decisions (close, escalate, SAR)",
      "Conduct quality assurance on alert handling",
      "Tune transaction monitoring rules to reduce false positives",
      "Identify typology trends and emerging risks",
    ],
    evidenceRequired: [
      "Alert review logs with disposition rationale",
      "Quality assurance audit samples",
      "Rule tuning documentation",
      "Typology trend reports",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["Compliance Analyst", "Operations Lead"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Transaction monitoring is entity-specific per FATF requirements",
  },
  {
    id: "SURVEILLANCE_ALERT_ESCALATION_FORUM",
    name: "Surveillance Alert Escalation Forum",
    type: "Forum",
    level: "Working-Level Forum",
    priority: "Mandatory",
    purpose: "Market surveillance and market abuse detection",
    meetingFrequency: "Weekly",
    chair: "Market Surveillance Officer",
    coreMembership: "Market Surveillance Officer, Compliance, Operations (3-4 people)",
    coreResponsibilities: "Market abuse detection, alert escalation, regulatory reporting (STORs)",
    standardsBasis: "CySEC MiFID II (EU 2017/1200), MAR (Market Abuse Regulation EU 596/2014)",
    keyStandardQuote:
      "Market manipulation surveillance and escalation with Suspicious Transaction and Order Reports (STORs)",
    pillarsCovered: ["Market Abuse Prevention", "Regulatory Requirements"],
    escalationTo: "AML/CFT Execution Committee / Compliance Manager",
    defaultMemberCount: 3,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "3-4 members including Market Surveillance Officer, Compliance",
    reportingLine: "Escalates to Compliance Manager weekly",
    keyResponsibilities: [
      "Review market surveillance alerts for potential market abuse",
      "Investigate suspicious trading patterns (layering, spoofing, wash trades)",
      "File Suspicious Transaction and Order Reports (STORs) with regulator",
      "Coordinate with AML team on cross-functional cases",
      "Document investigation outcomes and regulatory submissions",
    ],
    evidenceRequired: [
      "Market surveillance alert logs",
      "Investigation case files",
      "STOR filing records",
      "Cross-functional case coordination notes",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["Market Surveillance Officer", "Compliance Manager"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Market surveillance must be entity-specific per MAR requirements",
  },
  {
    id: "PRODUCT_TESTING_SUITABILITY_FORUM",
    name: "Product Testing & Suitability Forum",
    type: "Forum",
    level: "Working-Level Forum",
    priority: "Mandatory",
    purpose: "Operational testing of new products before launch",
    meetingFrequency: "Monthly standing + ad hoc for new launches",
    chair: "Product Manager",
    coreMembership: "Product, Compliance, Risk, Legal, Client Operations, Data (5-6 people)",
    coreResponsibilities: "Product testing, target market validation, distribution suitability checks",
    standardsBasis: "CySEC MiFID II (ESMA Guidelines on product governance)",
    keyStandardQuote: "Testing of new products before launch with documented target market and distribution strategy",
    pillarsCovered: ["Risk Management", "Regulatory Requirements"],
    escalationTo: "Product Governance Committee",
    defaultMemberCount: 5,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "5-6 members cross-functional",
    reportingLine: "Escalates to Product Governance Committee for approval",
    keyResponsibilities: [
      "Conduct product testing and scenario analysis",
      "Validate target market definitions",
      "Review distribution strategy and customer suitability",
      "Test product risk warnings and disclosure materials",
      "Document testing outcomes and approval recommendations",
    ],
    evidenceRequired: [
      "Product testing reports",
      "Target market validation documentation",
      "Distribution strategy assessments",
      "Testing sign-off records",
      "Retention: Life of product + 7 years",
    ],
    clhearRolesRequired: ["Product Manager", "Compliance Manager", "Risk Manager"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Product testing is entity-specific per MiFID II requirements",
  },
  {
    id: "CYBERSECURITY_INCIDENT_RESPONSE_TEAM",
    name: "Cybersecurity Incident Response Team",
    type: "Forum",
    level: "Working-Level Forum",
    priority: "Mandatory",
    purpose: "Operational response to cybersecurity incidents",
    meetingFrequency: "Ad hoc (escalates if critical incident)",
    chair: "CISO",
    coreMembership: "CISO, CTO, Compliance, Legal, PR (4-5 people)",
    coreResponsibilities: "Incident response, breach notification, root cause analysis",
    standardsBasis: "EBA IT Risk Guidelines (2021), GDPR (EU 2016/679), DORA (EU 2022/2554)",
    keyStandardQuote: "Establishment of cyber incident response procedures with board notification protocols",
    pillarsCovered: ["Data, Evidence & Technology", "Risk Management"],
    escalationTo: "Technology & Cybersecurity Committee / Board of Directors (if material)",
    defaultMemberCount: 4,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "4-5 members including CISO, Legal, PR",
    reportingLine: "Escalates to Technology Committee and Board if material",
    keyResponsibilities: [
      "Activate incident response procedures upon detection",
      "Contain and remediate cybersecurity incidents",
      "Conduct forensic analysis and root cause determination",
      "Prepare breach notifications to regulators and customers (GDPR Article 33/34)",
      "Document lessons learned and update incident response plans",
    ],
    evidenceRequired: [
      "Incident response logs and timelines",
      "Forensic analysis reports",
      "Breach notification submissions to regulators",
      "Post-incident reviews and remediation plans",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["CISO", "CTO", "Legal", "PR/Communications"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: ["group_level"],
    mustBeStandaloneFor: [],
    sharingRationale: "Incident response can be coordinated at group level with local escalation",
  },
  {
    id: "REGULATORY_CHANGE_COMPLIANCE_FORUM",
    name: "Regulatory Change & Compliance Tracking Forum",
    type: "Forum",
    level: "Working-Level Forum",
    priority: "Mandatory",
    purpose: "Operational tracking of regulatory changes and implementation",
    meetingFrequency: "Monthly",
    chair: "CCO",
    coreMembership: "CCO (Chair), Compliance Team Leads, Risk, Product, Operations (5+ people)",
    coreResponsibilities: "Regulatory horizon scanning, change impact assessment, implementation tracking",
    standardsBasis: "CySEC Supervisory Guidelines, FCA Principle 11 (Relations with Regulators)",
    keyStandardQuote: "Ongoing monitoring of regulatory change and implementation planning with documented assessments",
    pillarsCovered: ["Regulatory Requirements", "Continuous Improvement"],
    escalationTo: "Board of Directors / Product Governance Committee",
    defaultMemberCount: 5,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "5+ members cross-functional",
    reportingLine: "Reports to Board via CCO monthly",
    keyResponsibilities: [
      "Monitor regulatory publications and upcoming changes",
      "Conduct impact assessments for new regulations",
      "Develop implementation plans and assign owners",
      "Track implementation milestones and deadlines",
      "Coordinate regulatory submissions and consultations",
    ],
    evidenceRequired: [
      "Regulatory change register (live tracker)",
      "Impact assessment documents",
      "Implementation project plans",
      "Regulatory submission records",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["CCO", "Compliance Team Lead", "Risk Manager"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Regulatory tracking is entity-specific due to jurisdictional differences",
  },
  {
    id: "CUSTOMER_COMPLAINTS_ESCALATION_FORUM",
    name: "Customer Complaints & Escalation Review Forum",
    type: "Forum",
    level: "Working-Level Forum",
    priority: "Strongly Recommended",
    purpose: "Operational review of escalated customer complaints and remediation",
    meetingFrequency: "Monthly",
    chair: "Client Services Manager",
    coreMembership: "Compliance, Client Services Manager, Legal, Risk (3-4 people)",
    coreResponsibilities: "Complaint review, root cause analysis, remediation execution",
    standardsBasis: "CySEC MiFID II (ESMA Guidelines on complaint handling), FCA DISP",
    keyStandardQuote: "Review of escalated customer complaints and remediation with root cause analysis",
    pillarsCovered: ["Assurance & Remediation"],
    escalationTo: "Board Audit Committee (quarterly summary)",
    defaultMemberCount: 3,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "3-4 members",
    reportingLine: "Reports to Board Audit Committee quarterly",
    keyResponsibilities: [
      "Review escalated complaints and customer feedback",
      "Conduct root cause analysis for systemic issues",
      "Approve remediation plans and customer redress",
      "Monitor complaint handling timeliness and quality",
      "Report trends and systemic issues to Board",
    ],
    evidenceRequired: [
      "Complaint review forum minutes (monthly)",
      "Complaint registers and categorization",
      "Root cause analysis reports",
      "Remediation plans and customer redress records",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["Client Services Manager", "Compliance Manager", "Legal"],
    suggestedTier: "STRONGLY_RECOMMENDED",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Complaint handling is entity-specific per regulatory requirements",
  },
  {
    id: "DATA_PROTECTION_PRIVACY_COMMITTEE",
    name: "Data Protection & Privacy Committee",
    type: "Committee",
    level: "Working-Level Forum",
    priority: "Mandatory",
    purpose: "Operational oversight of data protection compliance and privacy controls",
    meetingFrequency: "Quarterly",
    chair: "Data Protection Officer",
    coreMembership: "DPO, CCO, CTO, Legal (3-4 people)",
    coreResponsibilities: "GDPR compliance, data subject rights, privacy impact assessments",
    standardsBasis: "GDPR (EU 2016/679)",
    keyStandardQuote: "Data Protection Officer shall report to a board-level governance body on GDPR compliance",
    pillarsCovered: ["Data, Evidence & Technology"],
    escalationTo: "Board of Directors / Technology Committee",
    defaultMemberCount: 3,
    requiredForEntityTypes: ["subsidiary"],
    requiredForRegulatedOnly: true,
    sizeAndComposition: "3-4 members including DPO, Legal, CTO",
    reportingLine: "Reports to Board quarterly",
    keyResponsibilities: [
      "Monitor GDPR compliance and data subject rights requests",
      "Review privacy impact assessments (PIAs) for new systems/products",
      "Oversee data processing agreements with third parties",
      "Manage data breach notifications under GDPR Article 33/34",
      "Coordinate with regulators on data protection inquiries",
    ],
    evidenceRequired: [
      "Data Protection Committee minutes (quarterly)",
      "Data subject rights request logs (access, erasure, portability)",
      "Privacy impact assessments",
      "Data processing agreements",
      "Breach notification records",
      "Retention: 7 years",
    ],
    clhearRolesRequired: ["Data Protection Officer", "CTO", "Legal"],
    suggestedTier: "MANDATORY",
    canBeSharedWith: [],
    mustBeStandaloneFor: [],
    sharingRationale: "Data protection oversight is entity-specific per GDPR requirements",
  },
]

export function generateAllGovernanceBodiesForEntities(entities: LegalEntity[]): BoardCommittee[] {
  const generatedBodies: BoardCommittee[] = []

  // For each entity, generate all applicable governance bodies
  entities.forEach((entity) => {
    const isParent = entity.entityType === "parent"
    const isRegulated = entity.licenses && entity.licenses.length > 0
    const hasCrypto =
      entity.entityRole?.toLowerCase().includes("crypto") ||
      entity.licenses?.some(
        (l: any) => l.licenseType?.toLowerCase().includes("crypto") || l.licenseType?.toLowerCase().includes("mica"),
      )

    // Generate all 18 bodies for this entity
    COMPREHENSIVE_GOVERNANCE_TEMPLATES.forEach((template) => {
      // Determine if this body is applicable to this entity
      let isApplicable = false

      if (template.requiredForParentOnly && isParent) {
        isApplicable = true
      } else if (template.requiredForRegulatedOnly && isRegulated && !isParent) {
        isApplicable = true
      } else if (!template.requiredForParentOnly && !template.requiredForRegulatedOnly) {
        isApplicable = true
      } else if (template.requiredForEntityTypes.includes(entity.entityType)) {
        isApplicable = true
      }

      // Specific check for 'subsidiary' as it might not be in requiredForEntityTypes directly
      if (template.requiredForEntityTypes.includes("subsidiary") && entity.entityType === "subsidiary" && !isParent) {
        isApplicable = true
      }

      if (isApplicable) {
        const body: BoardCommittee = {
          id: `${template.id}_${entity.id}`,
          name: template.name,
          type: template.type,
          level: template.level,
          purpose: template.purpose,
          meetingFrequency: template.meetingFrequency,
          isRequired: template.priority === "Mandatory",
          seats: [],
          chair: template.chair,
          coreMembership: template.coreMembership,
          coreResponsibilities: template.coreResponsibilities,
          standardsBasis: template.standardsBasis,
          keyStandardQuote: template.keyStandardQuote,
          pillarsCovered: template.pillarsCovered,
          escalationTo: template.escalationTo,
          applicableEntityIds: [entity.id],
          sizeAndComposition: template.sizeAndComposition,
          reportingLine: template.reportingLine,
          keyResponsibilities: template.keyResponsibilities,
          evidenceRequired: template.evidenceRequired,
          clhearRolesRequired: template.clhearRolesRequired,
          clhearRationale: {
            pillarsCovered: template.pillarsCovered.join(", "),
            mandatoryReason: generateMandatoryReason(template, entity, hasCrypto),
            referenceStandards: [
              {
                standard: template.standardsBasis,
                quote: template.keyStandardQuote || template.standardsBasis,
              },
            ],
            entityApplicability: [
              {
                entityId: entity.id,
                entityName: entity.brandName || entity.legalName,
                applicable: true,
                reason: generateApplicabilityReason(template, entity, isRegulated, hasCrypto),
              },
            ],
          },
          suggestedTier: template.suggestedTier,
          canBeSharedWith: template.canBeSharedWith,
          mustBeStandaloneFor: template.mustBeStandaloneFor,
          sharingRationale: template.sharingRationale,
        }

        generatedBodies.push(body)
      }
    })
  })

  return generatedBodies
}

function generateMandatoryReason(template: BoardCommitteeTemplate, entity: LegalEntity, hasCrypto: boolean): string {
  const reasons: string[] = []

  if (template.standardsBasis.includes("CySEC")) {
    reasons.push(`Regulation: CySEC ${template.standardsBasis.match(/MiFID|MiCA|MAR/)?.[0] || "requirements"}`)
  } else if (template.standardsBasis.includes("FCA")) {
    reasons.push(`Regulation: FCA ${template.standardsBasis}`)
  } else if (template.standardsBasis.includes("FATF")) {
    reasons.push("Regulation: FATF 40 Recommendations")
  } else {
    reasons.push(`Regulation: ${template.standardsBasis.split(",")[0]}`)
  }

  reasons.push(`Pillar: ${template.pillarsCovered[0]} (CLHEAR)`)

  if (hasCrypto && template.id.includes("AML")) {
    reasons.push("Business: Crypto assets require enhanced AML/CFT governance (MiCA)")
  } else if (entity.licenses?.length > 0) {
    reasons.push(`Business: ${entity.entityRole || "Regulated entity"} requires ${template.name}`)
  }

  return reasons.join(" | ")
}

function generateApplicabilityReason(
  template: BoardCommitteeTemplate,
  entity: LegalEntity,
  isRegulated: boolean,
  hasCrypto: boolean,
): string {
  const reasons: string[] = []

  if (template.requiredForParentOnly && entity.entityType === "parent") {
    reasons.push("Required for parent/holding company")
  }

  if (template.requiredForRegulatedOnly && isRegulated) {
    const licenseTypes = entity.licenses?.map((l: any) => l.licenseType).join(", ") || "regulated activities"
    reasons.push(`Required due to licenses: ${licenseTypes}`)
  }

  if (template.id.includes("AML") && hasCrypto) {
    reasons.push("Enhanced AML/CFT governance required for crypto assets under MiCA")
  }

  if (template.id.includes("PRODUCT") && entity.entityRole?.toLowerCase().includes("trading")) {
    reasons.push("Product governance required for trading/investment activities under MiFID II")
  }

  if (reasons.length === 0) {
    reasons.push(`${template.name} is ${template.priority.toLowerCase()} for ${entity.brandName || entity.legalName}`)
  }

  return reasons.join(". ")
}

export function generateGovernanceBodiesForEntity(entity: LegalEntity, allEntities: LegalEntity[]): BoardCommittee[] {
  const isRegulated = entity.licenses && entity.licenses.length > 0
  const isParent = entity.entityType === "parent"

  const applicableTemplates = COMPREHENSIVE_GOVERNANCE_TEMPLATES.filter((template) => {
    if (template.requiredForParentOnly && !isParent) return false
    if (template.requiredForRegulatedOnly && !isRegulated) return false
    if (template.requiredForEntityTypes.includes("all")) return true
    return template.requiredForEntityTypes.some((type) => entity.entityRole.toLowerCase().includes(type.toLowerCase()))
  })

  return applicableTemplates.map((template) => {
    const clhearRationale = generateDetailedRationale(template, entity, allEntities)

    return {
      id: `${entity.id}-${template.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: template.name,
      type: template.type,
      level: template.level,
      priority: template.priority,
      purpose: template.purpose,
      meetingFrequency: template.meetingFrequency,
      isRequired: true,
      seats: Array.from({ length: template.defaultMemberCount }, (_, i) => ({
        memberId: `${entity.id}-seat-${i + 1}`,
        role: i === 0 ? "Chair" : "Member",
      })),
      chair: template.chair,
      coreMembership: template.coreMembership,
      coreResponsibilities: template.coreResponsibilities,
      standardsBasis: template.standardsBasis,
      keyStandardQuote: template.keyStandardQuote,
      pillarsCovered: template.pillarsCovered,
      escalationTo: template.escalationTo,
      applicableEntityIds: [entity.id],
      sizeAndComposition: template.sizeAndComposition,
      reportingLine: template.reportingLine,
      keyResponsibilities: template.keyResponsibilities,
      evidenceRequired: template.evidenceRequired,
      clhearRolesRequired: template.clhearRolesRequired,
      clhearRationale,
      suggestedTier: template.suggestedTier,
      canBeSharedWith: template.canBeSharedWith,
      mustBeStandaloneFor: template.mustBeStandaloneFor,
      sharingRationale: template.sharingRationale,
    }
  })
}

function generateDetailedRationale(
  template: BoardCommitteeTemplate,
  entity: LegalEntity,
  allEntities: LegalEntity[],
): BoardCommittee["clhearRationale"] {
  const pillarsCovered = template.pillarsCovered.join(", ")

  let mandatoryReason = ""
  if (template.name === "Board Risk Committee") {
    const licenseInfo = entity.licenses?.map((l) => `${l.licenseType} (${l.licenseNumber})`).join(", ") || "N/A"
    mandatoryReason = `${entity.jurisdiction}-regulated investment firms under MiFID II/local equivalents must have a board-level risk oversight body with explicit responsibilities for risk strategy, limits, and escalation. ${entity.legalName} holds licenses: ${licenseInfo}.`
  } else if (template.name === "Board Audit Committee") {
    mandatoryReason = `All regulated financial entities must establish an independent Board Audit Committee responsible for oversight of financial reporting, internal controls, and audit function. This requirement stems from SOX Section 301 and equivalent local regulations.`
  } else if (template.name === "Board of Directors") {
    mandatoryReason = `As a ${entity.entityType} entity, ${entity.legalName} must have an ultimate governing body responsible for strategy, oversight, and accountability to shareholders and regulators.`
  } else {
    mandatoryReason = `${entity.entityRole} entities require ${template.name} to ensure ${template.coreResponsibilities}.`
  }

  const referenceStandards = generateReferenceStandards(template, entity)

  const entityApplicability = allEntities.map((ent) => {
    const { applicable, reason } = determineApplicability(template, ent)
    return {
      entityId: ent.id,
      entityName: ent.legalName,
      applicable,
      reason,
    }
  })

  return {
    pillarsCovered,
    mandatoryReason,
    referenceStandards,
    entityApplicability,
  }
}

function generateReferenceStandards(
  template: BoardCommitteeTemplate,
  entity: LegalEntity,
): Array<{ standard: string; quote: string }> {
  const standards: Array<{ standard: string; quote: string }> = []

  if (template.name === "Board Risk Committee") {
    if (entity.jurisdiction.toLowerCase().includes("cyprus") || entity.entityRole.toLowerCase().includes("mifid")) {
      standards.push({
        standard: "CySEC (MiFID II Implementing Regulation 2017/565)",
        quote:
          "The compliance function shall have the necessary authority and resources to perform its tasks effectively.",
      })
    }
    standards.push({
      standard: "BCBS Principles for Group Governance (2012)",
      quote:
        "Establish a board-level Risk Committee with independent oversight and reporting to the board on consolidated risk.",
    })
    standards.push({
      standard: "IOSCO (2019, Principles for Financial Market Infrastructures)",
      quote: "The board shall establish a risk management framework with explicit accountability at the board level.",
    })
  } else if (template.name === "Board Audit Committee") {
    standards.push({
      standard: "SOX Section 301",
      quote:
        "The audit committee shall be directly responsible for the appointment, compensation, and oversight of the work of any registered public accounting firm.",
    })
    standards.push({
      standard: "COSO Internal Control Framework",
      quote:
        "The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal control.",
    })
  } else if (template.name === "Financial Crime and AML Committee") {
    standards.push({
      standard: "FATF Recommendation 18",
      quote: "Financial institutions should implement programmes against money laundering and terrorist financing.",
    })
    standards.push({
      standard: "Wolfsberg AML Principles",
      quote: "Senior management shall have oversight of the AML program and shall approve policies and procedures.",
    })
  } else {
    const basisStandards = template.standardsBasis.split(",").map((s) => s.trim())
    basisStandards.forEach((standard) => {
      standards.push({
        standard,
        quote: template.keyStandardQuote || `${template.name} requirements per ${standard}`,
      })
    })
  }

  return standards
}

function determineApplicability(
  template: BoardCommitteeTemplate,
  entity: LegalEntity,
): { applicable: boolean; reason: string } {
  const isRegulated = entity.licenses && entity.licenses.length > 0
  const isParent = entity.entityType === "parent"
  const entityRole = entity.entityRole.toLowerCase()
  const jurisdiction = entity.jurisdiction.toLowerCase()

  if (template.name === "Board Risk Committee") {
    if (
      entityRole.includes("investment firm") ||
      entityRole.includes("broker") ||
      entityRole.includes("crypto exchange")
    ) {
      return {
        applicable: true,
        reason: `${entity.jurisdiction} regulation + ${entity.entityRole} business model = high regulatory scrutiny of risk oversight. Required under MiFID II/local equivalents.`,
      }
    }
    if (entityRole.includes("dlt") || entityRole.includes("wallet") || (!isRegulated && !isParent)) {
      return {
        applicable: false,
        reason: `${entity.entityRole} regulation does not mandate a full Board Risk Committee; governance requirements are lighter. A "Compliance & Risk Forum" (working-level) would suffice instead.`,
      }
    }
    return {
      applicable: isRegulated,
      reason: isRegulated
        ? `Regulated entity holding ${entity.licenses?.length || 0} license(s) requires Board Risk Committee.`
        : `Non-regulated ${entity.entityRole} - Risk Committee not mandatory.`,
    }
  }

  if (template.name === "Board of Directors") {
    return {
      applicable: isParent,
      reason: isParent
        ? `Required as parent/holding company to provide ultimate oversight and accountability.`
        : `Subsidiary entity - Board of Directors at group level provides oversight.`,
    }
  }

  if (template.name === "Board Audit Committee" || template.name === "Board Compliance Committee") {
    return {
      applicable: isRegulated,
      reason: isRegulated
        ? `Regulated entity with licenses ${entity.licenses?.map((l) => l.licenseNumber).join(", ")} requires ${template.name}.`
        : `Non-regulated entity - ${template.name} not required.`,
    }
  }

  if (template.requiredForParentOnly && !isParent) {
    return {
      applicable: false,
      reason: `Required for parent entities only. ${entity.legalName} is a subsidiary.`,
    }
  }

  if (template.requiredForRegulatedOnly && !isRegulated) {
    return {
      applicable: false,
      reason: `Required for regulated entities only. ${entity.legalName} holds no licenses.`,
    }
  }

  if (template.requiredForEntityTypes.includes("all")) {
    return {
      applicable: true,
      reason: `Required for all entity types per ${template.standardsBasis}.`,
    }
  }

  const matchesType = template.requiredForEntityTypes.some((type) => entityRole.includes(type.toLowerCase()))
  return {
    applicable: matchesType,
    reason: matchesType
      ? `${entity.entityRole} requires ${template.name} per ${template.standardsBasis}.`
      : `${entity.entityRole} does not require ${template.name}.`,
  }
}

export function generateAllGovernanceBodiesForEntities_OLD(entities: any[]): BoardCommittee[] {
  const allBodies: BoardCommittee[] = []

  // Analyze entity structure for sharing opportunities
  const parentEntities = entities.filter((e) => e.entityRole?.toLowerCase().includes("holding"))
  const subsidiaryEntities = entities.filter((e) => !e.entityRole?.toLowerCase().includes("holding"))
  const regulatedEntities = entities.filter((e) => e.licenses && e.licenses.length > 0)

  // Generate bodies for each entity
  entities.forEach((entity) => {
    const isParent = entity.entityRole?.toLowerCase().includes("holding")
    const isRegulated = entity.licenses && entity.licenses.length > 0
    const hasInvestmentLicense = entity.licenses?.some((l: any) => l.licenseType?.toLowerCase().includes("investment"))
    const hasCryptoLicense = entity.licenses?.some(
      (l: any) => l.licenseType?.toLowerCase().includes("crypto") || l.licenseType?.toLowerCase().includes("mica"),
    )
    const hasPaymentLicense = entity.licenses?.some(
      (l: any) => l.licenseType?.toLowerCase().includes("payment") || l.licenseType?.toLowerCase().includes("emi"),
    )

    // Determine sharing potential based on entity characteristics
    const canShareRiskCommittee =
      regulatedEntities.length > 1 && regulatedEntities.every((e) => e.jurisdiction === entity.jurisdiction)
    const mustHaveOwnBoard = true // All entities need their own board
    const canShareWorkingLevel = subsidiaryEntities.length > 1

    COMPREHENSIVE_GOVERNANCE_TEMPLATES.forEach((template) => {
      const shouldInclude = determineIfBodyIsRequired(
        entity,
        template,
        isParent,
        isRegulated,
        hasInvestmentLicense,
        hasCryptoLicense,
        hasPaymentLicense,
      )

      if (shouldInclude.applicable) {
        // Determine sharing potential
        let canBeSharedWith: string[] = [entity.id]
        let mustBeStandaloneFor: string[] = []
        let sharingRationale = ""

        // Board of Directors - never shared
        if (template.id.includes("BOARD_OF_DIRECTORS")) {
          mustBeStandaloneFor = [entity.id]
          sharingRationale =
            "Each legal entity must maintain its own Board of Directors for legal and fiduciary independence."
        }
        // Risk Committee - can be shared within same jurisdiction
        else if (template.id.includes("RISK_COMMITTEE") && canShareRiskCommittee) {
          canBeSharedWith = regulatedEntities.filter((e) => e.jurisdiction === entity.jurisdiction).map((e) => e.id)
          sharingRationale =
            "Risk committees can operate at group level for entities in the same jurisdiction, providing centralized oversight."
        }
        // Audit Committee - similar to risk
        else if (template.id.includes("AUDIT_COMMITTEE") && canShareRiskCommittee) {
          canBeSharedWith = regulatedEntities.filter((e) => e.jurisdiction === entity.jurisdiction).map((e) => e.id)
          sharingRationale = "Audit committees can be shared across same-jurisdiction entities for efficiency."
        }
        // Working-level forums - highly shareable
        else if (template.level === "Working-Level Forum" && canShareWorkingLevel) {
          canBeSharedWith = subsidiaryEntities.map((e) => e.id)
          sharingRationale = "Working-level forums can operate at group level serving multiple subsidiaries."
        }
        // Entity-specific committees (Compliance, AML, Product Governance)
        else if (
          template.id.includes("COMPLIANCE") ||
          template.id.includes("AML") ||
          template.id.includes("PRODUCT_GOVERNANCE")
        ) {
          mustBeStandaloneFor = [entity.id]
          sharingRationale =
            "This committee must be entity-specific due to regulatory requirements and local compliance obligations."
        }

        const body: BoardCommittee = {
          ...template,
          id: `${template.id}_${entity.id}`,
          applicableEntityIds: [entity.id],
          suggestedTier: shouldInclude.tier,
          canBeSharedWith,
          mustBeStandaloneFor,
          sharingRationale,
          clhearRationale: {
            pillarsCovered: template.pillarsCovered.join(", "),
            mandatoryReason: shouldInclude.reason,
            referenceStandards: [
              {
                standard: template.standardsBasis,
                quote: template.keyStandardQuote || "",
              },
            ],
            entityApplicability: [
              {
                entityId: entity.id,
                entityName: entity.legalName,
                applicable: true,
                reason: shouldInclude.reason,
              },
            ],
          },
        }

        allBodies.push(body)
      }
    })
  })

  return allBodies
}

function determineIfBodyIsRequired(
  entity: LegalEntity,
  template: BoardCommitteeTemplate,
  isParent: boolean,
  isRegulated: boolean,
  hasInvestmentLicense: boolean,
  hasCryptoLicense: boolean,
  hasPaymentLicense: boolean,
): { applicable: boolean; tier: string; reason: string } {
  let applicable = false
  const tier = template.priority
  let reason = ""

  if (template.requiredForParentOnly && !isParent) {
    applicable = false
    reason = `Required for parent entities only. ${entity.legalName} is a subsidiary.`
  } else if (template.requiredForRegulatedOnly && !isRegulated) {
    applicable = false
    reason = `Required for regulated entities only. ${entity.legalName} holds no licenses.`
  } else if (template.requiredForEntityTypes.includes("all")) {
    applicable = true
    reason = `Required for all entity types per ${template.standardsBasis}.`
  } else {
    const matchesType = template.requiredForEntityTypes.some((type) =>
      entity.entityRole.toLowerCase().includes(type.toLowerCase()),
    )
    applicable = matchesType
    reason = matchesType
      ? `${entity.entityRole} requires ${template.name} per ${template.standardsBasis}.`
      : `${entity.entityRole} does not require ${template.name}.`
  }

  return {
    applicable,
    tier,
    reason,
  }
}
