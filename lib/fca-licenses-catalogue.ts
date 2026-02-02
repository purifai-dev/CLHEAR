// FCA 20 Licenses Master Reference
// Based on the Regulated Activities Order (RAO) and FCA Handbook

export type LicenseCategory = "CORE_INVESTMENT" | "FUND_MANAGEMENT" | "TRADING_INFRASTRUCTURE" | "SPECIALIZED"

export type ClientType = "Retail" | "Professional" | "Eligible Counterparties"

export type LicenseStatus = "active" | "inactive" | "pending" | "revoked"

export interface FCALicense {
  id: string
  name: string
  purpose: string // New field for AI matching
  raoArticle: string
  regulationUrl: string
  fcaHandbook: string
  category: LicenseCategory
  definition: string
  whenRequired: string
  examples: string[]
  appliesTo: ClientType[]
  typicalFirms: string[]
  keyDistinction?: string
  criticalNote?: string
  regulatoryNote?: string
}

export interface EntityLicenseMapping {
  entityId: string
  licenseId: string
  status: LicenseStatus
  authorizationDate?: string
  notes?: string
}

// Category labels for display
export const LICENSE_CATEGORY_LABELS: Record<LicenseCategory, string> = {
  CORE_INVESTMENT: "Core Investment Licenses",
  FUND_MANAGEMENT: "Fund Management Licenses",
  TRADING_INFRASTRUCTURE: "Trading Infrastructure Licenses",
  SPECIALIZED: "Specialized Licenses",
}

export const LICENSE_CATEGORY_DESCRIPTIONS: Record<LicenseCategory, string> = {
  CORE_INVESTMENT: "Foundational licenses enabling core investment business activities",
  FUND_MANAGEMENT: "Licenses enabling managing collective investment schemes and funds",
  TRADING_INFRASTRUCTURE: "Licenses enabling operating trading venues",
  SPECIALIZED: "Licenses enabling specific specialized activities",
}

// The 20 FCA Licenses Master Reference
export const FCA_LICENSES_CATALOGUE: FCALicense[] = [
  // CATEGORY 1: CORE INVESTMENT LICENSES (7)
  {
    id: "LIC-001",
    name: "Dealing in investments as principal",
    purpose:
      "Enables firms to trade securities, derivatives, and other investments using their own capital and taking on principal risk. Required for proprietary trading, market-making, underwriting, and any dealing where the firm is the counterparty to the trade.",
    raoArticle: "Article 14",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/14",
    fcaHandbook: "PERG 2.7.6G",
    category: "CORE_INVESTMENT",
    definition:
      "Engaging, as principal, in buying, selling, subscribing for or underwriting investments (or offering to do so), either without exposure to risk or with exposure to risk.",
    whenRequired: "When the firm takes principal risk on its own account.",
    examples: ["Proprietary trading", "Market-making", "Underwriting", "Dealing for own account"],
    appliesTo: ["Retail", "Professional", "Eligible Counterparties"],
    typicalFirms: ["Broker-dealers", "Market makers", "Proprietary traders", "Investment banks"],
    keyDistinction: "Different from LIC-002. This license requires the firm to take principal risk.",
  },
  {
    id: "LIC-002",
    name: "Dealing in investments as agent",
    purpose:
      "Enables firms to execute buy and sell orders on behalf of clients without taking principal risk. Required for stockbrokers, execution-only platforms, trading platforms that execute client orders, and any firm that buys or sells investments as an agent for customers.",
    raoArticle: "Article 21",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/21",
    fcaHandbook: "PERG 2.7.6G",
    category: "CORE_INVESTMENT",
    definition:
      "Engaging as an agent in buying, selling, subscribing for or underwriting investments (or offering to do so).",
    whenRequired: "When executing client orders on their behalf without taking principal risk.",
    examples: ["Executing stock trades for clients", "Matching buyers and sellers"],
    appliesTo: ["Retail", "Professional", "Eligible Counterparties"],
    typicalFirms: ["Stock brokers", "Execution venues", "Investment platforms", "Stockbroking platforms"],
    keyDistinction: "Different from LIC-001. Agent role = no principal risk.",
  },
  {
    id: "LIC-003",
    name: "Arranging (bringing about) deals in investments",
    purpose:
      "Enables firms to arrange specific investment transactions between parties. Required for M&A advisory, corporate finance, deal broking, and any activity that directly brings about a specific investment deal or transaction.",
    raoArticle: "Article 25(1)",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/25",
    fcaHandbook: "PERG 2.7.7B, PERG 8.32",
    category: "CORE_INVESTMENT",
    definition:
      "Making arrangements with a view to a particular person buying, selling, subscribing for or underwriting a particular investment or offering to do so.",
    whenRequired: "When making arrangements that directly conclude/bring about a specific transaction.",
    examples: ["Closing an M&A deal", "Bringing buyer and seller together for a specific transaction"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["Corporate finance advisers", "Investment banks", "M&A advisers", "Deal brokers"],
    criticalNote: "Article 25(1) = specific deal arrangement (closing a deal). This is different from Article 25(2).",
  },
  {
    id: "LIC-004",
    name: "Making arrangements with a view to transactions",
    purpose:
      "Enables firms to provide ongoing arrangements that facilitate investment transactions. Required for operating trading platforms, brokerage services, introducing brokers, investment platforms, and any intermediary role that helps clients access investment markets on an ongoing basis.",
    raoArticle: "Article 25(2)",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/25",
    fcaHandbook: "PERG 2.7.7B",
    category: "CORE_INVESTMENT",
    definition:
      "Making arrangements for a person, for the purpose of facilitating the carrying out of a transaction in an investment.",
    whenRequired: "When the firm has an ongoing intermediary role in facilitating transactions.",
    examples: ["Operating a trading platform", "Brokerage services", "Ongoing intermediary arrangements"],
    appliesTo: ["Retail", "Professional", "Eligible Counterparties"],
    typicalFirms: ["Brokers", "Intermediaries", "Trading platforms", "Investment platforms"],
    criticalNote:
      "Article 25(2) = ongoing arrangements facilitating transactions. This is different from Article 25(1).",
  },
  {
    id: "LIC-005",
    name: "Managing investments",
    purpose:
      "Enables firms to manage client investment portfolios on a discretionary basis. Required for portfolio management, wealth management, discretionary investment management, and any service where the firm makes investment decisions on behalf of clients without requiring prior approval for each trade.",
    raoArticle: "Article 37",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/37",
    fcaHandbook: "PERG 2.7.8G",
    category: "CORE_INVESTMENT",
    definition:
      "Managing investments, or portfolios of investments, belonging to another person, where the management is exercised on the basis of discretion.",
    whenRequired: "When exercising discretion over client assets (portfolio management).",
    examples: [
      "Discretionary portfolio management",
      "Investment management services",
      "Fund management (managing client portfolios)",
    ],
    appliesTo: ["Retail", "Professional", "Eligible Counterparties"],
    typicalFirms: [
      "Asset managers",
      "Portfolio managers",
      "Discretionary IFAs",
      "Wealth managers",
      "Investment managers",
    ],
    keyDistinction: "Different from LIC-006. Managing = exercising discretion. Safeguarding = holding assets.",
  },
  {
    id: "LIC-006",
    name: "Safeguarding and administering investments",
    purpose:
      "Enables firms to hold and safeguard client assets and securities. Required for custody services, depository services, holding client money and assets, and any firm that holds investments belonging to clients for safekeeping.",
    raoArticle: "Article 40",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/40",
    fcaHandbook: "PERG 2.7.9G",
    category: "CORE_INVESTMENT",
    definition:
      "Safeguarding and administering investments belonging to another person, including arranging for the holding and administration of investments on behalf of another person.",
    whenRequired: "When holding client assets on their behalf.",
    examples: ["Custody services", "Depository services", "Safekeeping of securities", "Client asset holding"],
    appliesTo: ["Retail", "Professional", "Eligible Counterparties"],
    typicalFirms: ["Custodians", "Depositaries", "Banks", "Trust companies"],
    keyDistinction: "Different from LIC-005. Safeguarding = holding assets. Managing = exercising discretion.",
    regulatoryNote: "Subject to CASS (Client Asset Segregation) rules under COBS 6 & 7.",
  },
  {
    id: "LIC-007",
    name: "Advising on investments",
    purpose:
      "Enables firms to provide personal investment recommendations to clients. Required for financial advisers, investment consultants, wealth advisers, and any firm that gives advice on buying, selling, or holding specific investments tailored to individual client circumstances.",
    raoArticle: "Article 53(1)",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/53",
    fcaHandbook: "PERG 8.24",
    category: "CORE_INVESTMENT",
    definition:
      "Advising a person in their capacity as an investor or potential investor in an investment, or advising a person in relation to the exercise of rights conferred by an investment.",
    whenRequired: "When providing personal investment recommendations.",
    examples: ["Investment advice", "Financial advice", "Portfolio recommendations", "Suitability assessments"],
    appliesTo: ["Retail", "Professional", "Eligible Counterparties"],
    typicalFirms: ["Financial advisers", "IFAs", "Investment consultants", "Wealth managers", "Brokers"],
    regulatoryNote: "Subject to detailed advice rules in COBS 6 (suitability, best interests, record-keeping).",
  },

  // CATEGORY 2: FUND MANAGEMENT LICENSES (7)
  {
    id: "LIC-008",
    name: "Establishing, operating or winding up a collective investment scheme",
    purpose:
      "Enables firms to create and operate investment funds where multiple investors pool their money. Required for fund operators, investment scheme managers, and any firm establishing or running pooled investment vehicles.",
    raoArticle: "Article 51(1)(a)",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/51",
    fcaHandbook: "PERG 2.7.12G, COLL",
    category: "FUND_MANAGEMENT",
    definition: "Establishing, operating or winding up a collective investment scheme.",
    whenRequired: "When operating collective investment vehicles (funds, schemes).",
    examples: ["Operating a fund", "Managing a collective investment scheme", "Fund management services"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["Fund managers", "Investment companies", "UCITS managers", "AIF managers"],
    keyDistinction:
      "This is the general scheme operation license. Separate licenses exist for specific roles (trustee, depositary) and specific types (UCITS, AIF).",
  },
  {
    id: "LIC-009",
    name: "Acting as trustee of an authorised unit trust scheme",
    purpose:
      "Enables firms to act as trustees overseeing unit trust funds on behalf of investors. Required for trust companies and custodians serving as trustees for authorized unit trust schemes.",
    raoArticle: "Article 51(1)(b)",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/51",
    fcaHandbook: "COLL 6.6",
    category: "FUND_MANAGEMENT",
    definition: "Acting as trustee of an authorised unit trust scheme.",
    whenRequired: "When serving as trustee for a unit trust (different from managing the fund).",
    examples: ["Trustee for a unit trust fund"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["Custodians", "Trust companies", "Specialist trustees"],
    criticalNote: "This is SEPARATE from LIC-008. A fund needs BOTH a manager (LIC-008) AND a trustee (LIC-009).",
  },
  {
    id: "LIC-010",
    name: "Acting as depositary or sole director of an OEIC",
    purpose:
      "Enables firms to act as depositaries or directors for open-ended investment companies (OEICs). Required for custodians and administrators serving OEIC fund structures.",
    raoArticle: "Article 51(1)(c)",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/51",
    fcaHandbook: "COLL 5",
    category: "FUND_MANAGEMENT",
    definition: "Acting as a depositary or sole director of an open-ended investment company.",
    whenRequired: "When serving as depositary/director for OEIC structure.",
    examples: ["Depositary for an OEIC fund", "Director of OEIC"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["Custodians", "Trust companies", "OEIC administrators"],
    criticalNote: "OEIC structure requires BOTH a manager/director AND a depositary. This is a separate license.",
  },
  {
    id: "LIC-011",
    name: "Managing a UK UCITS",
    purpose:
      "Enables firms to manage UK UCITS funds (retail-focused collective investment schemes). Required for firms managing UCITS-compliant funds marketed to retail investors.",
    raoArticle: "Article 51ZA",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/51ZA",
    fcaHandbook: "PERG 13.5, COLL 6.9",
    category: "FUND_MANAGEMENT",
    definition: "Managing a UK UCITS.",
    whenRequired: "When managing UCITS funds (EU-compliant collective investment schemes).",
    examples: ["UCITS fund management"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["UCITS fund managers", "Investment managers"],
    criticalNote:
      "SEPARATE from LIC-012. A UCITS fund needs BOTH a manager (LIC-011) AND a trustee/depositary (LIC-012).",
    regulatoryNote:
      "UCITS (Undertakings for Collective Investment in Transferable Securities) - requires HMT marketing exemption.",
  },
  {
    id: "LIC-012",
    name: "Acting as trustee or depositary of a UCITS",
    purpose:
      "Enables firms to act as trustees or depositaries for UCITS funds, safeguarding fund assets and overseeing fund operations on behalf of investors.",
    raoArticle: "Article 51ZB",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/51ZB",
    fcaHandbook: "COLL 6.6",
    category: "FUND_MANAGEMENT",
    definition: "Acting as a trustee or depositary of a UCITS.",
    whenRequired: "When serving as trustee/depositary for UCITS fund.",
    examples: ["Trustee/depositary for a UCITS fund"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["Custodians", "Depositaries", "Trust companies"],
    criticalNote:
      "SEPARATE from LIC-011. A UCITS fund needs BOTH a manager (LIC-011) AND a trustee/depositary (LIC-012).",
  },
  {
    id: "LIC-013",
    name: "Managing an AIF (Alternative Investment Fund)",
    purpose:
      "Enables firms to manage alternative investment funds including hedge funds, private equity funds, real estate funds, and other non-UCITS collective investment schemes marketed to professional investors.",
    raoArticle: "Article 51ZC",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/51ZC",
    fcaHandbook: "PERG 16.3, FUND",
    category: "FUND_MANAGEMENT",
    definition: "Managing an alternative investment fund.",
    whenRequired: "When managing alternative investment funds (hedge funds, private equity, etc.).",
    examples: ["Hedge fund management", "Private equity fund management", "AIF management"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["AIF managers", "Hedge fund managers", "Private equity firms"],
    criticalNote: "SEPARATE from LIC-014. An AIF needs BOTH a manager (LIC-013) AND a trustee/depositary (LIC-014).",
  },
  {
    id: "LIC-014",
    name: "Acting as trustee or depositary of an AIF",
    purpose:
      "Enables firms to act as trustees or depositaries for alternative investment funds, safeguarding AIF assets and providing independent oversight of fund operations.",
    raoArticle: "Article 51ZD",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/51ZD",
    fcaHandbook: "FUND 3.11",
    category: "FUND_MANAGEMENT",
    definition: "Acting as a trustee or depositary of an alternative investment fund.",
    whenRequired: "When serving as trustee/depositary for AIF.",
    examples: ["Trustee/depositary for a hedge fund", "Private equity fund", "Other AIF"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["Custodians", "Depositaries", "Trust companies"],
    criticalNote: "SEPARATE from LIC-013. An AIF needs BOTH a manager (LIC-013) AND a trustee/depositary (LIC-014).",
  },

  // CATEGORY 3: TRADING INFRASTRUCTURE LICENSES (2)
  {
    id: "LIC-015",
    name: "Operating a multilateral trading facility (MTF)",
    purpose:
      "Enables firms to operate electronic trading venues where multiple parties can trade securities and other instruments. Required for exchange operators, alternative trading systems, and platforms providing multilateral execution.",
    raoArticle: "Article 25D",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/25D",
    fcaHandbook: "MAR 5, PERG 13.3",
    category: "TRADING_INFRASTRUCTURE",
    definition: "Operating a multilateral trading facility.",
    whenRequired: "When operating a trading venue where multiple traders can trade with each other.",
    examples: ["Exchange operations", "Trading platform for equities", "Multilateral matching system"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["Exchange operators", "Trading platform providers", "Brokers with proprietary platforms"],
    regulatoryNote: "MiFID II regulated venue with specific operational and transparency requirements.",
  },
  {
    id: "LIC-016",
    name: "Operating an organised trading facility (OTF)",
    purpose:
      "Enables firms to operate trading venues for non-equity instruments like bonds, derivatives, and commodities with operator discretion over execution. Required for bond trading platforms, derivatives venues, and commodity trading systems.",
    raoArticle: "Article 25DA",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/25DA",
    fcaHandbook: "MAR 5A, PERG 13.3",
    category: "TRADING_INFRASTRUCTURE",
    definition: "Operating an organised trading facility.",
    whenRequired: "When operating a non-equities trading venue with own discretion.",
    examples: ["Bond trading platform", "Derivatives venue", "Commodity trading platform"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["Bond trading platforms", "Derivatives venues", "Commodity platforms", "OTC venues"],
    regulatoryNote: "MiFID II regulated venue (non-equities focus) with specific operational requirements.",
  },

  // CATEGORY 4: SPECIALIZED LICENSES (4)
  {
    id: "LIC-017",
    name: "Sending dematerialised instructions",
    purpose:
      "Enables firms to send electronic settlement instructions to CREST for transferring uncertificated UK securities. Required for stockbrokers, custodians, and settlement agents that need to settle UK equity and bond trades.",
    raoArticle: "Article 45",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/45",
    fcaHandbook: "PERG 2.7.11G",
    category: "SPECIALIZED",
    definition: "Sending dematerialised instructions with a view to the transfer of uncertificated securities.",
    whenRequired: "When sending instructions to CREST (UK securities settlement system).",
    examples: ["CREST instruction sending", "Settlement of UK equities", "Securities settlement services"],
    appliesTo: ["Retail", "Professional", "Eligible Counterparties"],
    typicalFirms: ["Stock brokers", "Settlement agents", "Custodians", "Settlement service providers"],
    criticalNote:
      "This license is NOT AUTOMATIC even if the firm has dealing licenses (LIC-001, LIC-002). Requires SEPARATE FCA application. FCA 2013 Guidance (FSA-FG13-03) explicitly confirms this.",
  },
  {
    id: "LIC-018",
    name: "Operating an electronic system in relation to lending (P2P)",
    purpose:
      "Enables firms to operate peer-to-peer lending platforms that match borrowers with lenders. Required for crowdfunding platforms, P2P lending marketplaces, and alternative finance platforms facilitating direct lending between parties.",
    raoArticle: "Article 36H",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/36H",
    fcaHandbook: "PERG 2.7, PERG 14",
    category: "SPECIALIZED",
    definition: "Operating an electronic system in relation to lending.",
    whenRequired: "When operating a peer-to-peer lending platform.",
    examples: ["P2P lending platforms", "Crowdfunding platforms", "Lending marketplaces"],
    appliesTo: ["Retail", "Professional", "Eligible Counterparties"],
    typicalFirms: ["P2P lending platforms", "Crowdfunding platforms", "Alternative finance platforms"],
  },
  {
    id: "LIC-019",
    name: "Administering a benchmark",
    purpose:
      "Enables firms to create and administer financial benchmarks and indices used for investment tracking, pricing, or performance measurement. Required for index providers and benchmark administrators.",
    raoArticle: "Article 63O",
    regulationUrl: "https://www.legislation.gov.uk/uksi/2001/544/article/63O",
    fcaHandbook: "BENCH",
    category: "SPECIALIZED",
    definition: "Administering a benchmark.",
    whenRequired: "When providing a benchmark (index) for investment tracking.",
    examples: ["Index provision", "Benchmark administration", "Index fund benchmarks"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["Index providers", "Benchmark administrators", "Major asset managers"],
  },
  {
    id: "LIC-020",
    name: "Approving financial promotions",
    purpose:
      "Enables firms to approve financial marketing materials for third parties who cannot approve their own promotions. Required for compliance service providers and marketing approval agencies.",
    raoArticle: "Section 21, FSMA",
    regulationUrl: "https://www.legislation.gov.uk/ukpga/2000/8/section/21",
    fcaHandbook: "COBS 4, PS23/13",
    category: "SPECIALIZED",
    definition: "Approving financial promotions for third parties.",
    whenRequired: "When approving marketing materials for firms without their own approval function.",
    examples: ["Promotion approval agency services", "Compliance approval services"],
    appliesTo: ["Professional", "Eligible Counterparties"],
    typicalFirms: ["Compliance service providers", "Marketing approval agencies", "Specialized compliance firms"],
    criticalNote:
      "NEW (February 7, 2024): This is a brand-new license. Applies only if approving promotions for THIRD parties. If approving only own promotions, different rules in COBS 4 apply. See PS23/13 for implementation details.",
  },
]

export const FCA_LICENSES = FCA_LICENSES_CATALOGUE

export const FCA_LICENSE_CATEGORIES = [
  { id: "CORE_INVESTMENT", name: "Core Investment Licenses" },
  { id: "FUND_MANAGEMENT", name: "Fund Management Licenses" },
  { id: "TRADING_INFRASTRUCTURE", name: "Trading Infrastructure Licenses" },
  { id: "SPECIALIZED", name: "Specialized Licenses" },
]

// Helper functions
export function getLicensesByCategory(category: LicenseCategory): FCALicense[] {
  return FCA_LICENSES_CATALOGUE.filter((l) => l.category === category)
}

export function getLicenseById(id: string): FCALicense | undefined {
  return FCA_LICENSES_CATALOGUE.find((l) => l.id === id)
}

export function getCategories(): LicenseCategory[] {
  return ["CORE_INVESTMENT", "FUND_MANAGEMENT", "TRADING_INFRASTRUCTURE", "SPECIALIZED"]
}
