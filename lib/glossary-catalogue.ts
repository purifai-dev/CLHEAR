// FCA Regulations Glossary Catalogue - 61 terms across 11 categories

export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: string
  raoReference?: string
  fsmaReference?: string
  fcaHandbook?: string
  regulatoryBasis?: string
  licenseCode?: string
  mappedOffenseActivities?: string[]
  mappedDefenseActivities?: string[]
  keyPoints?: string[]
  criticalNote?: string
  keyDistinction?: string
  capitalRequirements?: string
  examples?: string[]
}

export interface GlossaryCategory {
  id: string
  name: string
  termCount: number
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  { id: "CAT-01", name: "Regulated Activities & Permissions", termCount: 7 },
  { id: "CAT-02", name: "Fund & Collective Investment Activities", termCount: 7 },
  { id: "CAT-03", name: "Conduct & Compliance Terms", termCount: 11 },
  { id: "CAT-04", name: "Customer & Client Classifications", termCount: 3 },
  { id: "CAT-05", name: "Operations & Infrastructure", termCount: 7 },
  { id: "CAT-06", name: "Authorization & Regulatory Requirements", termCount: 5 },
  { id: "CAT-07", name: "Market Conduct & Integrity", termCount: 3 },
  { id: "CAT-08", name: "Investment Vehicles & Structures", termCount: 4 },
  { id: "CAT-09", name: "Support & Control Functions", termCount: 4 },
  { id: "CAT-10", name: "Reporting & Notifications", termCount: 4 },
  { id: "CAT-11", name: "Critical Distinctions", termCount: 6 },
]

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // CATEGORY 1: REGULATED ACTIVITIES & PERMISSIONS (7 Terms)
  {
    id: "TERM-001",
    term: "Advising on Investments",
    definition:
      "Advising a person (as an investor or potential investor, or as agent for an investor) on the merits of buying, selling, subscribing for, exchanging, redeeming, holding or underwriting a particular investment which is a security, structured deposit or relevant investment.",
    category: "CAT-01",
    raoReference: "Article 53(1), Regulated Activities Order 2001",
    fcaHandbook: "PERG 2.7, COBS 6",
    licenseCode: "LIC-007",
    mappedOffenseActivities: [
      "OA-PSD-0008 (Advisory delivery)",
      "OA-PSD-0009 (Suitability assessment)",
      "OA-CSR-0016 (Client communication)",
    ],
    mappedDefenseActivities: [
      "DA-CDD-0013 (Customer ID verification)",
      "DA-SCT-0054 (Training & certification)",
      "DA-SUP-0019 (Suitability assessment)",
    ],
    keyPoints: [
      "Requires full suitability assessment for each client",
      "Personal recommendation standard applies",
      "Different from execution services (no advice)",
    ],
  },
  {
    id: "TERM-002",
    term: "Arranging (Bringing About) Deals",
    definition:
      "Making arrangements with a view to a particular person buying, selling, subscribing for or underwriting a particular investment (Article 25(1)). This is for specific deal arrangement (closing a deal).",
    category: "CAT-01",
    raoReference: "Article 25(1), Regulated Activities Order 2001",
    fcaHandbook: "PERG 2.7.7B",
    licenseCode: "LIC-003",
    keyDistinction:
      "Article 25(1) = specific deal arrangement (closing a deal). Article 25(2) = ongoing arrangements facilitating transactions. Each requires SEPARATE FCA application and license.",
  },
  {
    id: "TERM-003",
    term: "Arranging (With a View to)",
    definition:
      "Making arrangements for a person for the purpose of facilitating the carrying out of a transaction in an investment (Article 25(2)). This covers ongoing intermediary arrangements.",
    category: "CAT-01",
    raoReference: "Article 25(2), Regulated Activities Order 2001",
    fcaHandbook: "PERG 2.7.7B",
    licenseCode: "LIC-004",
    keyDistinction:
      "Article 25(2) = ongoing facilitation role. Article 25(1) = specific deal arrangement. Each requires SEPARATE FCA application and license.",
  },
  {
    id: "TERM-004",
    term: "Dealing as Agent",
    definition:
      "Engaging as an agent in buying, selling, subscribing for or underwriting investments (or offering to do so). Agent role means firm executes for client without taking principal risk.",
    category: "CAT-01",
    raoReference: "Article 21, Regulated Activities Order 2001",
    fcaHandbook: "PERG 2.7.6G",
    licenseCode: "LIC-002",
    keyDistinction:
      "Article 21 (Agent) = executes for client, no principal risk. Article 14 (Principal) = firm takes principal risk. Each requires SEPARATE FCA application and license.",
  },
  {
    id: "TERM-005",
    term: "Dealing as Principal",
    definition:
      "Engaging as principal in buying, selling, subscribing for or underwriting investments (or offering to do so), either without exposure to risk or with exposure to risk. Firm takes principal risk on own account.",
    category: "CAT-01",
    raoReference: "Article 14, Regulated Activities Order 2001",
    fcaHandbook: "PERG 2.7.6G",
    licenseCode: "LIC-001",
    keyDistinction:
      "Article 14 (Principal) = firm takes risk. Article 21 (Agent) = no principal risk. Each requires SEPARATE FCA application and license.",
    capitalRequirements: "Permanent Minimum Capital Requirement (PMR) = €730,000",
  },
  {
    id: "TERM-006",
    term: "Managing Investments",
    definition:
      "Managing investments or portfolios of investments belonging to another person where management is exercised on the basis of discretion. Exercising discretion over client assets.",
    category: "CAT-01",
    raoReference: "Article 37, Regulated Activities Order 2001",
    fcaHandbook: "PERG 2.7.8G",
    licenseCode: "LIC-005",
    keyDistinction:
      "Article 37 (Managing) = exercising discretion. Article 40 (Safeguarding) = holding assets. Each is separate activity.",
    capitalRequirements: "PMR varies by client type",
  },
  {
    id: "TERM-007",
    term: "Safeguarding and Administering Investments",
    definition:
      "Safeguarding and administering investments belonging to another person, including arranging for the holding and administration of investments on behalf of another person. Holding client assets on their behalf.",
    category: "CAT-01",
    raoReference: "Article 40, Regulated Activities Order 2001",
    fcaHandbook: "PERG 2.7.9G, CASS 6 & 7",
    licenseCode: "LIC-006",
    keyDistinction:
      "Article 40 (Safeguarding) = holding assets. Article 37 (Managing) = exercising discretion. Both can be done by same firm but are separate permissions.",
    criticalNote:
      "Client Asset Segregation (CASS) rules apply. Must keep client money separate from firm's own money. Protects clients in case of firm failure.",
  },

  // CATEGORY 2: FUND & COLLECTIVE INVESTMENT ACTIVITIES (7 Terms)
  {
    id: "TERM-008",
    term: "Establishing/Operating Collective Investment Scheme",
    definition:
      "Establishing, operating or winding up a collective investment scheme. Enables operation of fund structures.",
    category: "CAT-02",
    licenseCode: "LIC-008",
    criticalNote:
      "Manager role requires BOTH managing and trustee/depositary licenses. LIC-008 = operating the scheme. LIC-009 or LIC-012 or LIC-014 = trustee/depositary role (required separately).",
  },
  {
    id: "TERM-009",
    term: "Acting as Trustee of Unit Trust",
    definition:
      "Acting as trustee of an authorised unit trust scheme. Trustee role is separate from managing the fund.",
    category: "CAT-02",
    licenseCode: "LIC-009",
    keyDistinction: "Separate license from operating the scheme (LIC-008).",
  },
  {
    id: "TERM-010",
    term: "Acting as Depositary/Director of OEIC",
    definition:
      "Acting as a depositary or sole director of an open-ended investment company. Depositary role is separate from managing the fund.",
    category: "CAT-02",
    licenseCode: "LIC-010",
    keyDistinction: "Separate license from operating the scheme (LIC-008).",
  },
  {
    id: "TERM-011",
    term: "Managing a UK UCITS",
    definition:
      "Managing a UK UCITS (Undertakings for Collective Investment in Transferable Securities). EU-compliant collective investment schemes with specific requirements.",
    category: "CAT-02",
    licenseCode: "LIC-011",
    keyDistinction: "Separate license from trustee/depositary (LIC-012).",
  },
  {
    id: "TERM-012",
    term: "Acting as Trustee/Depositary of UCITS",
    definition: "Acting as trustee or depositary of a UCITS. Required as separate role from managing the fund.",
    category: "CAT-02",
    licenseCode: "LIC-012",
    keyDistinction: "Separate license from managing the fund (LIC-011).",
  },
  {
    id: "TERM-013",
    term: "Managing an AIF",
    definition:
      "Managing an alternative investment fund (AIF). Covers hedge funds, private equity, and other alternative investments.",
    category: "CAT-02",
    licenseCode: "LIC-013",
    keyDistinction: "Separate license from trustee/depositary (LIC-014).",
  },
  {
    id: "TERM-014",
    term: "Acting as Trustee/Depositary of AIF",
    definition:
      "Acting as trustee or depositary of an alternative investment fund. Required as separate role from managing the fund.",
    category: "CAT-02",
    licenseCode: "LIC-014",
    keyDistinction: "Separate license from managing the fund (LIC-013).",
  },

  // CATEGORY 3: CONDUCT & COMPLIANCE TERMS (11 Terms)
  {
    id: "TERM-015",
    term: "Authorised Person",
    definition:
      "A person who has permission from the FCA under Part 4A of FSMA to carry on one or more regulated activities. Authorized to conduct specific regulated activities.",
    category: "CAT-03",
    fsmaReference: "Part 4A, Financial Services and Markets Act 2000",
    fcaHandbook: "PERG 2.2",
  },
  {
    id: "TERM-016",
    term: "Best Execution",
    definition:
      "Executing client orders at the best possible terms available in the market. Obligation to execute client orders at best price, speed, and certainty.",
    category: "CAT-03",
    fcaHandbook: "COBS 6.1.5R",
    regulatoryBasis: "MiFID II, COBS 6",
    mappedOffenseActivities: ["OA-TTE-0004 (Trade execution)"],
    mappedDefenseActivities: ["DA-BEX-0036 (Best execution monitoring)"],
  },
  {
    id: "TERM-017",
    term: "Client Due Diligence (CDD)",
    definition:
      "Process of identifying and verifying the identity of customers. Required when establishing business relationship with a customer.",
    category: "CAT-03",
    fcaHandbook: "COBS 6.1.4R, SYSC 6",
    regulatoryBasis: "AML/CFT requirements, MLRs 2017",
    mappedDefenseActivities: ["DA-CDD-0013 (Customer ID verification)"],
  },
  {
    id: "TERM-018",
    term: "Conflicts of Interest",
    definition:
      "Situations where the firm's interest might be in conflict with a client's interest. Must identify, prevent and manage.",
    category: "CAT-03",
    fcaHandbook: "COBS 6.1.1R",
    regulatoryBasis: "COBS 6.1, SYSC 8",
    mappedOffenseActivities: ["OA-CFO-0006 (Conflict management)"],
    mappedDefenseActivities: ["DA-CFO-0028 (Conflict of interest controls)"],
  },
  {
    id: "TERM-019",
    term: "Designated Investment",
    definition:
      "An investment specified in the RAO, such as shares, debentures, units in a collective investment scheme, derivatives, etc.",
    category: "CAT-03",
    raoReference: "Schedule 2, Regulated Activities Order 2001",
    fcaHandbook: "PERG 2.3",
    examples: ["Equities", "Bonds", "Derivatives", "Funds", "Structured products"],
  },
  {
    id: "TERM-020",
    term: "Fair, Clear and Not Misleading",
    definition:
      "Standard for all communications with clients. Communications must be honest, fair, not misleading and presented clearly.",
    category: "CAT-03",
    fcaHandbook: "COBS 4 (Financial promotion rules)",
    regulatoryBasis: "COBS 4.1.1R",
    mappedOffenseActivities: ["OA-MKT-0013 (Marketing & promotion)"],
  },
  {
    id: "TERM-021",
    term: "Financial Promotion",
    definition:
      "Any communication which invites or induces a person to engage in investment activity. Subject to Section 21 FSMA restrictions.",
    category: "CAT-03",
    fsmaReference: "Section 21, Financial Services and Markets Act 2000",
    fcaHandbook: "COBS 4",
    licenseCode: "LIC-020",
    criticalNote: "NEW as of February 7, 2024: License LIC-020 for firms approving promotions for third parties.",
  },
  {
    id: "TERM-022",
    term: "Know Your Customer (KYC)",
    definition:
      "Process of understanding a customer's investment needs, financial situation, experience and risk tolerance. Basis for suitability and appropriateness.",
    category: "CAT-03",
    fcaHandbook: "COBS 6.1.2R",
    regulatoryBasis: "COBS 6 (Suitability)",
    mappedDefenseActivities: ["DA-SUI-0024 (Customer profiling)"],
  },
  {
    id: "TERM-023",
    term: "Personal Recommendation",
    definition:
      "Any recommendation that is presented as suitable for a person or is based on consideration of the circumstances of a particular person.",
    category: "CAT-03",
    fcaHandbook: "COBS 2.1.1R",
    regulatoryBasis: "MiFID II",
    mappedOffenseActivities: ["OA-PSD-0008 (Advisory delivery)"],
    mappedDefenseActivities: ["DA-SUP-0019 (Suitability assessment)"],
  },
  {
    id: "TERM-024",
    term: "Regulated Activity",
    definition:
      "Any activity specified in the RAO (Schedule 2 FSMA) carried on by way of business in relation to an investment. Requires FCA authorization.",
    category: "CAT-03",
    raoReference: "Regulated Activities Order 2001",
    fsmaReference: "Section 22 and Schedule 2, FSMA 2000",
    fcaHandbook: "PERG 2",
    criticalNote: "Each of the 20 licenses is a separate regulated activity requiring separate FCA application.",
  },
  {
    id: "TERM-025",
    term: "Suitability",
    definition:
      "Advice must be suitable to the customer's investment objectives, financial situation, knowledge and experience. Firm must have reasonable basis for recommendation.",
    category: "CAT-03",
    fcaHandbook: "COBS 6.1.2R (Suitability rule)",
    regulatoryBasis: "COBS 6, MiFID II",
    mappedOffenseActivities: ["OA-PSD-0009 (Suitability assessment)"],
    mappedDefenseActivities: ["DA-SUP-0019 (Suitability assessment)"],
  },

  // CATEGORY 4: CUSTOMER & CLIENT CLASSIFICATIONS (3 Terms)
  {
    id: "TERM-026",
    term: "Eligible Counterparty",
    definition:
      "A professional client deemed able to deal with investment firms without full MiFID II protections. Includes central banks, governments, large companies, large financial institutions.",
    category: "CAT-04",
    fcaHandbook: "COBS 1.2.1R",
    regulatoryBasis: "MiFID II",
    keyPoints: ["Firm can choose to treat as professional client with prior consent"],
  },
  {
    id: "TERM-027",
    term: "Professional Client",
    definition:
      "A client (other than retail) deemed to have sufficient experience and understanding of investment services. Subject to reduced MiFID II protections.",
    category: "CAT-04",
    fcaHandbook: "COBS 1.2.1R, Annex II COBS",
    regulatoryBasis: "MiFID II",
    examples: ["Financial institutions", "Corporations with assets >€50m", "Government agencies"],
  },
  {
    id: "TERM-028",
    term: "Retail Client",
    definition:
      "Any consumer or customer who is not a professional or eligible counterparty. Receives full COBS protections including suitability, appropriateness, information requirements.",
    category: "CAT-04",
    fcaHandbook: "COBS 1.2.1R",
    regulatoryBasis: "COBS, MiFID II",
    keyPoints: ["Full suitability assessment", "Detailed disclosures", "Best execution", "Complaint handling"],
    mappedOffenseActivities: ["OA-CSR-0016 (Client support)"],
  },

  // CATEGORY 5: OPERATIONS & INFRASTRUCTURE (7 Terms)
  {
    id: "TERM-029",
    term: "Client Asset Segregation (CASS)",
    definition:
      "Requirement to keep client money separate from firm's own money. Protects clients in case of firm failure.",
    category: "CAT-05",
    fcaHandbook: "COBS 6.1.5R, CASS 6 & 7",
    regulatoryBasis: "CASS rules",
    licenseCode: "LIC-006",
    mappedOffenseActivities: ["OA-CST-0017 (Client cash management)"],
  },
  {
    id: "TERM-030",
    term: "Dealing (General)",
    definition: "General term covering both Dealing as Principal (Article 14) and Dealing as Agent (Article 21).",
    category: "CAT-05",
    raoReference: "Articles 14 & 21, Regulated Activities Order 2001",
    keyPoints: [
      "LIC-001 (Principal)",
      "LIC-002 (Agent)",
      "These are separate licenses requiring separate applications",
    ],
  },
  {
    id: "TERM-031",
    term: "Investment Instrument",
    definition:
      "A transferable security, money-market instrument, derivative, unit in a collective investment scheme, or structured deposit.",
    category: "CAT-05",
    raoReference: "Schedule 2, Regulated Activities Order 2001",
    fcaHandbook: "PERG 2.3",
    examples: ["Shares", "Bonds", "Derivatives", "Funds", "Structured products"],
  },
  {
    id: "TERM-032",
    term: "Multilateral Trading Facility (MTF)",
    definition:
      "A trading venue where multiple traders can trade with each other. Operates under specific MiFID II rules.",
    category: "CAT-05",
    raoReference: "Article 25D, Regulated Activities Order 2001",
    fcaHandbook: "MAR 5",
    licenseCode: "LIC-015",
    mappedOffenseActivities: ["OA-TO-0023 (Payment processing)", "OA-TTE-0004 (Trade execution)"],
  },
  {
    id: "TERM-033",
    term: "Organised Trading Facility (OTF)",
    definition:
      "A trading venue for non-equities (bonds, derivatives, commodities) with operator discretion. Specific MiFID II requirements.",
    category: "CAT-05",
    raoReference: "Article 25DA, Regulated Activities Order 2001",
    fcaHandbook: "MAR 5A",
    licenseCode: "LIC-016",
  },
  {
    id: "TERM-034",
    term: "Record-Keeping",
    definition:
      "Obligation to create, maintain and retain records of all regulated activities. Different retention periods apply (typically 5-6 years).",
    category: "CAT-05",
    fcaHandbook: "COBS 6.1.5R (Records of advice), SUP 16 (Record-keeping)",
    regulatoryBasis: "COBS 6, SYSC 5",
    mappedOffenseActivities: ["OA-REC-0025 (Record-keeping)"],
    mappedDefenseActivities: ["DA-RKM-0032 (Record management)"],
  },
  {
    id: "TERM-035",
    term: "Transaction Monitoring",
    definition:
      "Ongoing monitoring of customer transactions for suspicious activity (AML/CFT) and compliance with market abuse rules.",
    category: "CAT-05",
    fcaHandbook: "COBS 6.1.4R, SYSC 6",
    regulatoryBasis: "MLRs 2017, Market Abuse Regulation",
    mappedOffenseActivities: ["OA-TTE-0004 (Trade execution)"],
    mappedDefenseActivities: ["DA-TMS-0026 (Transaction monitoring system)"],
  },

  // CATEGORY 6: AUTHORIZATION & REGULATORY REQUIREMENTS (5 Terms)
  {
    id: "TERM-036",
    term: "Variation of Permission (VoP)",
    definition:
      "Application to the FCA to add, remove, or modify regulated activity permissions. Used when firm wants to change scope of authorization.",
    category: "CAT-06",
    fsmaReference: "Section 55E, Financial Services and Markets Act 2000",
    fcaHandbook: "SUP 6.1.5R",
    keyPoints: [
      "Adding License LIC-017 for CREST",
      "Adding License LIC-020 for promotions",
      "Adding new fund management licenses",
    ],
  },
  {
    id: "TERM-037",
    term: "Senior Management Function (SMF)",
    definition:
      "Specific roles designated as having significant responsibility (CEO, CFO, Head of Compliance, etc.). Individuals in SMF must be registered with FCA.",
    category: "CAT-06",
    fcaHandbook: "SYSC 1, TC 2-5",
    regulatoryBasis: "SMCR (Senior Managers and Certification Regime)",
    mappedOffenseActivities: ["OA-GSM-0001 (Authorization verification)"],
  },
  {
    id: "TERM-038",
    term: "MLRO (Money Laundering Reporting Officer)",
    definition:
      "Designated function responsible for reporting suspicious activities and ensuring AML/CFT compliance. Mandatory for all firms.",
    category: "CAT-06",
    fcaHandbook: "SYSC 6.1.1R, CRIM 5",
    regulatoryBasis: "MLRs 2017",
    mappedOffenseActivities: ["OA-AML-0002 (Anti-money laundering)"],
  },
  {
    id: "TERM-039",
    term: "Compliance Officer",
    definition:
      "Designated function responsible for ensuring firm complies with FCA rules. Can be multiple people or part of senior management function.",
    category: "CAT-06",
    fcaHandbook: "SYSC 2.1.1R",
    mappedOffenseActivities: ["OA-GSM-0001 (Authorization verification)"],
  },
  {
    id: "TERM-040",
    term: "Permanent Minimum Capital Requirement (PMR)",
    definition:
      "Minimum own funds requirement for MIFIDPRU investment firms. Varies by activity: €25,000-€730,000 depending on licenses held.",
    category: "CAT-06",
    fcaHandbook: "MIFIDPRU 4.4",
    regulatoryBasis: "MiFID II, UK Capital Requirements",
    examples: ["Advising only: €25,000", "Dealing: €730,000", "MTF Operation: €750,000", "Execution only: €150,000"],
  },

  // CATEGORY 7: MARKET CONDUCT & INTEGRITY (3 Terms)
  {
    id: "TERM-041",
    term: "Market Abuse",
    definition:
      "Insider dealing or market manipulation. Prohibited conduct affecting financial markets. Includes trading on inside information.",
    category: "CAT-07",
    regulatoryBasis: "Market Abuse Regulation (MAR)",
    fcaHandbook: "SYSC 11 (Systems for insider trading controls)",
    mappedOffenseActivities: ["OA-TTE-0004 (Trade execution)"],
    mappedDefenseActivities: ["DA-ITC-0046 (Insider trading controls)"],
  },
  {
    id: "TERM-042",
    term: "Financial Crime",
    definition:
      "Broad term covering money laundering, terrorist financing, sanctions evasion, bribery, fraud and market abuse.",
    category: "CAT-07",
    fcaHandbook: "SYSC 6 (AML/CFT controls), CRIM",
    mappedOffenseActivities: ["OA-AML-0002 (Anti-money laundering)"],
  },
  {
    id: "TERM-043",
    term: "Sanctions Screening",
    definition:
      "Process of checking customers and transactions against government sanctions lists. Mandatory for all firms.",
    category: "CAT-07",
    fcaHandbook: "SYSC 6.1.4R",
    regulatoryBasis: "MLRs 2017, OFAC, EU sanctions",
    mappedDefenseActivities: ["DA-SAN-0040 (Sanctions screening)"],
  },

  // CATEGORY 8: INVESTMENT VEHICLES & STRUCTURES (4 Terms)
  {
    id: "TERM-044",
    term: "UCITS",
    definition:
      "Undertakings for Collective Investment in Transferable Securities. EU-compliant fund structure with specific authorization and investor protection requirements.",
    category: "CAT-08",
    fcaHandbook: "COLL 6.9, COLL 1-7",
    keyPoints: [
      "LIC-011 (Managing)",
      "LIC-012 (Trustee/Depositary)",
      "Separate licenses required for manager and trustee/depositary roles",
    ],
  },
  {
    id: "TERM-045",
    term: "AIF",
    definition:
      "Alternative Investment Fund. Any collective investment scheme not meeting UCITS criteria. Includes hedge funds, private equity, etc.",
    category: "CAT-08",
    fcaHandbook: "FUND 1-3",
    regulatoryBasis: "AIFMD",
    keyPoints: [
      "LIC-013 (Managing)",
      "LIC-014 (Trustee/Depositary)",
      "Separate licenses required for manager and trustee/depositary roles",
    ],
  },
  {
    id: "TERM-046",
    term: "Unit Trust",
    definition:
      "Collective investment scheme in trust form. Requires manager and trustee. Trustee holds assets on behalf of unitholders.",
    category: "CAT-08",
    fcaHandbook: "COLL 6.6",
    keyPoints: [
      "LIC-008 (Operating)",
      "LIC-009 (Trustee)",
      "Trustee role is separate license from operating the scheme",
    ],
  },
  {
    id: "TERM-047",
    term: "OEIC",
    definition:
      "Open-Ended Investment Company. Collective investment scheme in company form. Requires director/depositary separate from manager.",
    category: "CAT-08",
    fcaHandbook: "COLL 5",
    keyPoints: [
      "LIC-008 (Operating)",
      "LIC-010 (Depositary/Director)",
      "Depositary role is separate license from operating the scheme",
    ],
  },

  // CATEGORY 9: SUPPORT & CONTROL FUNCTIONS (4 Terms)
  {
    id: "TERM-048",
    term: "Internal Audit",
    definition:
      "Independent review of firm's controls and compliance. Provides assurance on effectiveness of risk management and compliance systems.",
    category: "CAT-09",
    fcaHandbook: "SYSC 3.2 (Internal audit)",
    regulatoryBasis: "SYSC",
    mappedOffenseActivities: ["OA-IA3-0033 (Internal audit reviews)"],
  },
  {
    id: "TERM-049",
    term: "Compliance Monitoring",
    definition:
      "Ongoing process of verifying firm's adherence to FCA rules. Includes testing of controls and procedures.",
    category: "CAT-09",
    fcaHandbook: "SYSC 2.1 (Compliance control function)",
    mappedDefenseActivities: ["DA-CF2-0060 (Compliance monitoring)"],
  },
  {
    id: "TERM-050",
    term: "Risk Management",
    definition:
      "Identification, assessment and mitigation of risks faced by the firm. Includes credit, market, liquidity, operational risk.",
    category: "CAT-09",
    fcaHandbook: "SYSC 4 (Risk management)",
    mappedOffenseActivities: ["OA-RMF-0021 (Risk framework)"],
  },
  {
    id: "TERM-051",
    term: "Training and Certification",
    definition:
      "Requirement for staff to receive training relevant to their roles. Certification regime requires those in specified roles to meet competence requirements.",
    category: "CAT-09",
    fcaHandbook: "SYSC 1, TC 1",
    regulatoryBasis: "SMCR",
    mappedDefenseActivities: ["DA-SCT-0054 (Training & certification)"],
  },

  // CATEGORY 10: REPORTING & NOTIFICATIONS (4 Terms)
  {
    id: "TERM-052",
    term: "Annual Regulatory Return (ARR)",
    definition:
      "Annual report to FCA covering firm's regulatory metrics, capital, large exposures, etc. Deadline typically end of April.",
    category: "CAT-10",
    fcaHandbook: "SUP 16.12",
    mappedOffenseActivities: ["OA-RER-0037 (Regulatory reporting)"],
  },
  {
    id: "TERM-053",
    term: "Breach Reporting",
    definition:
      "Notification to FCA within 3 business days of any breach of regulatory requirements that causes or could cause material harm.",
    category: "CAT-10",
    fcaHandbook: "SUP 15.3 (Reporting of breaches of rules)",
    mappedDefenseActivities: ["DA-IRP-0031 (Incident/breach reporting)"],
  },
  {
    id: "TERM-054",
    term: "Suspicious Activity Report (SAR)",
    definition:
      "Report to Financial Intelligence Unit (FIU) when firm suspects money laundering, terrorist financing or other financial crime.",
    category: "CAT-10",
    fcaHandbook: "CRIM 5 (Suspicious activity reporting)",
    regulatoryBasis: "MLRs 2017",
    keyPoints: ["Related Function: MLRO (Money Laundering Reporting Officer)"],
  },
  {
    id: "TERM-055",
    term: "Variation of Permission Application",
    definition:
      "Application to FCA to add, remove, or modify regulated activity permissions. Typically for adding licenses like LIC-017 or LIC-020.",
    category: "CAT-10",
    fcaHandbook: "SUP 6.1.5R",
    mappedOffenseActivities: ["OA-GSM-0001 (Authorization verification)"],
  },

  // CATEGORY 11: CRITICAL DISTINCTIONS (6 Terms)
  {
    id: "TERM-056",
    term: "Article 14 vs Article 21 (Dealing)",
    definition:
      "Article 14 (Principal): Firm takes principal risk on own account. Requires capital, market risk exposure. Article 21 (Agent): Firm executes for client without taking principal risk. Acts as intermediary.",
    category: "CAT-11",
    criticalNote: "Each requires separate FCA application and license.",
    keyPoints: [
      "Article 14 (Principal) = firm takes risk",
      "Article 21 (Agent) = no principal risk",
      "LIC-001 vs LIC-002",
    ],
  },
  {
    id: "TERM-057",
    term: "Article 25(1) vs Article 25(2) (Arranging)",
    definition:
      "Article 25(1) - Direct: Making arrangements that directly conclude a specific transaction (closing a deal). Article 25(2) - With a View: Making arrangements for purpose of facilitating transactions (ongoing intermediary role).",
    category: "CAT-11",
    criticalNote: "Each requires separate FCA application and license.",
    keyPoints: ["Article 25(1) = closing deals", "Article 25(2) = ongoing facilitation", "LIC-003 vs LIC-004"],
  },
  {
    id: "TERM-058",
    term: "Article 37 vs Article 40 (Asset Handling)",
    definition:
      "Article 37 (Managing): Exercising discretion over client assets (discretionary portfolio management). Article 40 (Safeguarding): Holding client assets on their behalf (custody, depository).",
    category: "CAT-11",
    keyPoints: [
      "Managing = decision-making (LIC-005)",
      "Safeguarding = holding (LIC-006)",
      "Different activities, can be combined",
    ],
  },
  {
    id: "TERM-059",
    term: "Manager vs Trustee/Depositary (Funds)",
    definition:
      "Managing License: Managing the fund - investment decisions, strategy, operations. Trustee/Depositary License: Holding assets, safeguarding interests, oversight. Required as SEPARATE license.",
    category: "CAT-11",
    criticalNote: "Fund structure requires BOTH licenses (cannot be combined).",
    keyPoints: [
      "Manager = investment decisions",
      "Trustee/Depositary = asset safeguarding",
      "Both required for fund operations",
    ],
  },
  {
    id: "TERM-060",
    term: "Article 45 NOT Automatic",
    definition:
      "Article 45: Sending dematerialised instructions (CREST). NOT automatic even with dealing licenses (LIC-001, LIC-002). Requires SEPARATE application.",
    category: "CAT-11",
    criticalNote: "FCA 2013 Guidance (FSA-FG13-03) explicitly confirms this.",
    licenseCode: "LIC-017",
  },
  {
    id: "TERM-061",
    term: "Section 21 NEW (2024)",
    definition:
      "Section 21 FSMA: Approving financial promotions for third parties. Effective February 7, 2024. Only required if approving promotions for THIRD parties. Different rules if approving only own promotions.",
    category: "CAT-11",
    fsmaReference: "PS23/13",
    licenseCode: "LIC-020",
    criticalNote: "New requirement effective February 7, 2024.",
  },
]

// Helper to get terms by category
export function getTermsByCategory(categoryId: string): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter((term) => term.category === categoryId)
}

// Helper to get category by ID
export function getCategoryById(categoryId: string): GlossaryCategory | undefined {
  return GLOSSARY_CATEGORIES.find((cat) => cat.id === categoryId)
}

// Helper to search terms
export function searchTerms(query: string): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase()
  return GLOSSARY_TERMS.filter(
    (term) =>
      term.term.toLowerCase().includes(lowerQuery) ||
      term.definition.toLowerCase().includes(lowerQuery) ||
      term.licenseCode?.toLowerCase().includes(lowerQuery) ||
      term.fcaHandbook?.toLowerCase().includes(lowerQuery) ||
      term.raoReference?.toLowerCase().includes(lowerQuery),
  )
}
