// CLHEAR Products and Services Catalogue
// Comprehensive repository of financial services products based on regulatory frameworks

export interface ProductService {
  id: string
  category: string
  name: string
  description: string
  assignedEntityIds: string[]
}

export const PRODUCT_CATEGORIES = [
  "Trading & Execution",
  "Investment Advice & Portfolio Management",
  "Wealth & Asset Management",
  "Fund Operations",
  "Investment Banking & Capital Markets",
  "Custody & Settlement",
  "Analytics & Research",
  "Insurance-Linked & Alternative",
  "Retirement & Pensions",
  "Lending & Credit",
  "Crypto & Digital Assets",
  "Advisory & Planning",
  "Corporate Services",
  "Execution & Order Routing",
  "Prime Brokerage",
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const PRODUCTS_SERVICES_CATALOGUE: ProductService[] = [
  // Trading & Execution
  {
    id: "PS-TE-0001",
    category: "Trading & Execution",
    name: "Equities Trading (Listed Shares)",
    description:
      "Spot trading of equities listed on regulated exchanges (LSE, Euronext, etc). Includes cash equities and margin trading where applicable.",
    assignedEntityIds: [],
  },
  {
    id: "PS-TE-0002",
    category: "Trading & Execution",
    name: "Bonds Trading (Government & Corporate)",
    description:
      "Trading of government and corporate debt securities, including gilts, investment-grade corporates and high-yield bonds.",
    assignedEntityIds: [],
  },
  {
    id: "PS-TE-0003",
    category: "Trading & Execution",
    name: "ETF Trading (Exchange-Traded Funds)",
    description: "Trading of exchange-traded funds covering equities, bonds, commodities and multi-asset indices.",
    assignedEntityIds: [],
  },
  {
    id: "PS-TE-0004",
    category: "Trading & Execution",
    name: "Options Trading (Equity & Index Options)",
    description:
      "Trading of equity and index options including calls, puts, spreads and complex strategies. Subject to leverage controls for retail.",
    assignedEntityIds: [],
  },
  {
    id: "PS-TE-0005",
    category: "Trading & Execution",
    name: "Futures Trading (Financial & Commodity Futures)",
    description:
      "Trading of financial futures (indices, bonds, FX) and commodity futures. Subject to leverage and complexity rules.",
    assignedEntityIds: [],
  },
  {
    id: "PS-TE-0006",
    category: "Trading & Execution",
    name: "FX Trading (Foreign Exchange Spot & Forwards)",
    description:
      "Trading of foreign exchange spot contracts and forwards. Subject to leverage limits for retail clients.",
    assignedEntityIds: [],
  },
  {
    id: "PS-TE-0007",
    category: "Trading & Execution",
    name: "CFD Trading (Contracts for Difference)",
    description:
      "Trading of Contracts for Difference on equities, indices, commodities and FX. Highly leveraged and complex product.",
    assignedEntityIds: [],
  },
  {
    id: "PS-TE-0008",
    category: "Trading & Execution",
    name: "Structured Products Trading",
    description:
      "Trading of structured products combining underlying assets with derivatives (e.g., barrier notes, reverse convertibles, autocallables).",
    assignedEntityIds: [],
  },
  {
    id: "PS-TE-0009",
    category: "Trading & Execution",
    name: "Warrants & Derivatives Trading",
    description: "Trading of warrants and other derivative securities issued by financial institutions.",
    assignedEntityIds: [],
  },

  // Investment Advice & Portfolio Management
  {
    id: "PS-IA-0010",
    category: "Investment Advice & Portfolio Management",
    name: "Investment Advice (Personal Recommendations)",
    description:
      "Personal investment recommendations based on client circumstances, objectives and risk tolerance (restricted or independent).",
    assignedEntityIds: [],
  },
  {
    id: "PS-IA-0011",
    category: "Investment Advice & Portfolio Management",
    name: "Independent Financial Advice",
    description:
      "Advice based on a comprehensive analysis of the market without restrictions or conflicts, treating the client's best interests.",
    assignedEntityIds: [],
  },
  {
    id: "PS-IA-0012",
    category: "Investment Advice & Portfolio Management",
    name: "Restricted Investment Advice",
    description:
      "Advice limited to a restricted range of products, investments or strategies disclosed to the client upfront.",
    assignedEntityIds: [],
  },
  {
    id: "PS-IA-0013",
    category: "Investment Advice & Portfolio Management",
    name: "Portfolio Management (Discretionary)",
    description:
      "Discretionary management of client portfolios with authority to invest without seeking approval for each transaction.",
    assignedEntityIds: [],
  },
  {
    id: "PS-IA-0014",
    category: "Investment Advice & Portfolio Management",
    name: "Execution-Only Services",
    description:
      "Execution of client instructions to buy/sell investments without advice or suitability assessment. Lowest regulatory intensity.",
    assignedEntityIds: [],
  },

  // Wealth & Asset Management
  {
    id: "PS-WA-0015",
    category: "Wealth & Asset Management",
    name: "Private Wealth Management",
    description:
      "Comprehensive asset management services for high-net-worth individuals, typically with bespoke strategies and dedicated advisors.",
    assignedEntityIds: [],
  },
  {
    id: "PS-WA-0016",
    category: "Wealth & Asset Management",
    name: "Robo-Advisory Services",
    description:
      "Automated advisory service using algorithms to determine asset allocation and manage portfolios based on client profile questionnaires.",
    assignedEntityIds: [],
  },
  {
    id: "PS-WA-0017",
    category: "Wealth & Asset Management",
    name: "Model Portfolio Management",
    description:
      "Client portfolios managed in accordance with pre-designed model portfolios based on risk profile or investment theme.",
    assignedEntityIds: [],
  },
  {
    id: "PS-WA-0018",
    category: "Wealth & Asset Management",
    name: "Discretionary Fund Management",
    description:
      "Management of client funds as discretionary mandates with full authority to invest in accordance with investment policy and fund documents.",
    assignedEntityIds: [],
  },
  {
    id: "PS-WA-0019",
    category: "Wealth & Asset Management",
    name: "Managed Accounts",
    description:
      "Individual client accounts managed on a discretionary basis with investments tailored to specific client objectives and constraints.",
    assignedEntityIds: [],
  },

  // Fund Operations
  {
    id: "PS-FO-0020",
    category: "Fund Operations",
    name: "UCITS Fund Management",
    description:
      "Management of Undertakings for Collective Investment in Transferable Securities (UCITS) - harmonized EU/UK retail investment funds.",
    assignedEntityIds: [],
  },
  {
    id: "PS-FO-0021",
    category: "Fund Operations",
    name: "Non-UCITS Collective Investment Schemes",
    description:
      "Collective investment schemes not meeting UCITS criteria (e.g., less liquid assets, higher leverage, performance fees). Typically for sophisticated investors.",
    assignedEntityIds: [],
  },
  {
    id: "PS-FO-0022",
    category: "Fund Operations",
    name: "AIF Management (Alternative Investment Funds)",
    description:
      "Management of alternative investment funds (hedges, private equity, real assets) under the AIFM Directive framework.",
    assignedEntityIds: [],
  },
  {
    id: "PS-FO-0023",
    category: "Fund Operations",
    name: "Mutual Fund Platforms (Fund Supermarket)",
    description:
      "Platform aggregating multiple funds from different managers for direct investor access and holdings management.",
    assignedEntityIds: [],
  },
  {
    id: "PS-FO-0024",
    category: "Fund Operations",
    name: "Fund Distribution & Administration",
    description:
      "Third-party distribution and administrative services for funds, including NAV calculation, investor register, redemptions and investor communications.",
    assignedEntityIds: [],
  },

  // Investment Banking & Capital Markets
  {
    id: "PS-IB-0025",
    category: "Investment Banking & Capital Markets",
    name: "Underwriting Services (Equity IPOs & Secondaries)",
    description:
      "Underwriting and placement of equity offerings including initial public offerings (IPOs) and secondary offerings.",
    assignedEntityIds: [],
  },
  {
    id: "PS-IB-0026",
    category: "Investment Banking & Capital Markets",
    name: "Underwriting Services (Debt Offerings)",
    description: "Underwriting and placement of debt securities including bonds, notes and syndicated loans.",
    assignedEntityIds: [],
  },
  {
    id: "PS-IB-0027",
    category: "Investment Banking & Capital Markets",
    name: "Corporate Advisory Services",
    description:
      "Mergers & acquisitions advisory, corporate restructuring, valuations and strategic advisory to corporate clients.",
    assignedEntityIds: [],
  },
  {
    id: "PS-IB-0028",
    category: "Investment Banking & Capital Markets",
    name: "Private Placements",
    description: "Placement of securities with institutional and qualified investors (not public offering).",
    assignedEntityIds: [],
  },
  {
    id: "PS-IB-0029",
    category: "Investment Banking & Capital Markets",
    name: "Equity Capital Markets (ECM) Services",
    description:
      "Equity underwriting, IPO advisory, secondary offerings, block trading and equity research for corporate clients.",
    assignedEntityIds: [],
  },
  {
    id: "PS-IB-0030",
    category: "Investment Banking & Capital Markets",
    name: "Fixed Income Capital Markets (FIC) Services",
    description: "Debt underwriting, bond placement, syndication, trading and corporate credit advisory.",
    assignedEntityIds: [],
  },

  // Custody & Settlement
  {
    id: "PS-CS-0031",
    category: "Custody & Settlement",
    name: "Securities Custody",
    description:
      "Holding and safekeeping of client securities in segregated accounts, with reconciliation and corporate action processing.",
    assignedEntityIds: [],
  },
  {
    id: "PS-CS-0032",
    category: "Custody & Settlement",
    name: "Clearance & Settlement Services",
    description:
      "Trade clearing and settlement through recognized central counterparties (CCPs) and central securities depositories (CSDs).",
    assignedEntityIds: [],
  },
  {
    id: "PS-CS-0033",
    category: "Custody & Settlement",
    name: "Depositary Services",
    description:
      "Depositary function for collective investment schemes (funds, AIFs) ensuring asset safekeeping and fund governance compliance.",
    assignedEntityIds: [],
  },
  {
    id: "PS-CS-0034",
    category: "Custody & Settlement",
    name: "Cash Management",
    description:
      "Management and investment of client cash balances, cash collateral, and liquidity across multiple currency and settlement venues.",
    assignedEntityIds: [],
  },
  {
    id: "PS-CS-0035",
    category: "Custody & Settlement",
    name: "Corporate Actions Processing",
    description:
      "Processing of corporate events (dividends, interest, rights issues, bonus shares, spin-offs) on behalf of custody clients.",
    assignedEntityIds: [],
  },

  // Analytics & Research
  {
    id: "PS-AR-0036",
    category: "Analytics & Research",
    name: "Investment Research",
    description:
      "Production and distribution of investment research reports, equity research, credit research and macroeconomic analysis.",
    assignedEntityIds: [],
  },
  {
    id: "PS-AR-0037",
    category: "Analytics & Research",
    name: "Market Data & Analytics",
    description:
      "Supply of market data (prices, volumes, corporate actions), indices and analytics platforms to traders and portfolio managers.",
    assignedEntityIds: [],
  },
  {
    id: "PS-AR-0038",
    category: "Analytics & Research",
    name: "ESG (Environmental, Social, Governance) Analysis",
    description:
      "Analysis and ratings of companies and investments based on environmental, social and governance criteria and impact metrics.",
    assignedEntityIds: [],
  },
  {
    id: "PS-AR-0039",
    category: "Analytics & Research",
    name: "Performance Analytics & Reporting",
    description:
      "Attribution, performance measurement, risk analysis and reporting tools for portfolio managers and advisors.",
    assignedEntityIds: [],
  },

  // Insurance-Linked & Alternative
  {
    id: "PS-IA2-0040",
    category: "Insurance-Linked & Alternative",
    name: "Variable Annuities",
    description:
      "Investment-linked annuity products providing guaranteed income with investment growth potential. Insurance product with investment features.",
    assignedEntityIds: [],
  },
  {
    id: "PS-IA2-0041",
    category: "Insurance-Linked & Alternative",
    name: "Investment-Linked Insurance",
    description:
      "Insurance contracts (life, bonds) with investment-linked benefits, combining insurance protection and investment exposure.",
    assignedEntityIds: [],
  },
  {
    id: "PS-IA2-0042",
    category: "Insurance-Linked & Alternative",
    name: "Structured Products (Equity-Linked Notes)",
    description:
      "Notes with payoffs linked to underlying equities, indices or baskets, typically with capital protection or participation limits.",
    assignedEntityIds: [],
  },
  {
    id: "PS-IA2-0043",
    category: "Insurance-Linked & Alternative",
    name: "REITs (Real Estate Investment Trusts)",
    description:
      "Securities representing ownership in real estate portfolios and providing regular distributions from rental income.",
    assignedEntityIds: [],
  },

  // Retirement & Pensions
  {
    id: "PS-RP-0044",
    category: "Retirement & Pensions",
    name: "SIPP Management (Self-Invested Personal Pensions)",
    description:
      "Self-invested personal pension plans (SIPPs) allowing individuals to manage their own pension investments across a range of assets.",
    assignedEntityIds: [],
  },
  {
    id: "PS-RP-0045",
    category: "Retirement & Pensions",
    name: "Workplace Pension Services",
    description:
      "Administration and investment management of employer-sponsored pension schemes (defined benefit, defined contribution, hybrid).",
    assignedEntityIds: [],
  },
  {
    id: "PS-RP-0046",
    category: "Retirement & Pensions",
    name: "Pension Advisory Services",
    description:
      "Advice on pension planning, options at retirement, transfer decisions and income planning for pension-related questions.",
    assignedEntityIds: [],
  },
  {
    id: "PS-RP-0047",
    category: "Retirement & Pensions",
    name: "Pension Fund Management",
    description:
      "Investment management of pension scheme assets (DB/DC/hybrid) in accordance with scheme rules and trustee mandates.",
    assignedEntityIds: [],
  },

  // Lending & Credit
  {
    id: "PS-LC-0048",
    category: "Lending & Credit",
    name: "Margin Lending",
    description:
      "Credit facilities secured by client securities, allowing leverage for investment. Subject to collateral management and margin calls.",
    assignedEntityIds: [],
  },
  {
    id: "PS-LC-0049",
    category: "Lending & Credit",
    name: "Securities-Backed Lines of Credit",
    description:
      "Credit lines secured by collateral (typically securities) for general liquidity purposes. Requires active collateral monitoring.",
    assignedEntityIds: [],
  },

  // Crypto & Digital Assets
  {
    id: "PS-CR-0050",
    category: "Crypto & Digital Assets",
    name: "Cryptocurrency Trading",
    description:
      "Trading of digital assets (Bitcoin, Ethereum, etc.) on spot and derivative markets. Subject to evolving FCA guidance.",
    assignedEntityIds: [],
  },
  {
    id: "PS-CR-0051",
    category: "Crypto & Digital Assets",
    name: "Crypto Custody",
    description:
      "Safekeeping of cryptocurrency and digital assets for clients, typically in cold storage or multi-signature arrangements.",
    assignedEntityIds: [],
  },
  {
    id: "PS-CR-0052",
    category: "Crypto & Digital Assets",
    name: "Cryptocurrency Fund Management",
    description: "Management of collective investment vehicles holding cryptocurrency and digital asset portfolios.",
    assignedEntityIds: [],
  },
  {
    id: "PS-CR-0053",
    category: "Crypto & Digital Assets",
    name: "Tokenization Services",
    description: "Issuance, management and settlement of tokenized securities and assets on blockchain infrastructure.",
    assignedEntityIds: [],
  },

  // Advisory & Planning
  {
    id: "PS-AP-0054",
    category: "Advisory & Planning",
    name: "Financial Planning",
    description:
      "Comprehensive financial planning covering savings, investments, tax planning, insurance, mortgages and retirement in an integrated manner.",
    assignedEntityIds: [],
  },
  {
    id: "PS-AP-0055",
    category: "Advisory & Planning",
    name: "Tax-Efficient Investment Planning",
    description:
      "Advice and strategies to minimize tax impact of investments through vehicles, location and timing strategies.",
    assignedEntityIds: [],
  },
  {
    id: "PS-AP-0056",
    category: "Advisory & Planning",
    name: "Risk Management & Hedging Advisory",
    description:
      "Advisory on hedging strategies, insurance and risk mitigation for investment and business-related risks.",
    assignedEntityIds: [],
  },

  // Corporate Services
  {
    id: "PS-CS2-0057",
    category: "Corporate Services",
    name: "Company Share Scheme Administration",
    description:
      "Administration of employee share plans (ESOP, SAYE, restricted stock, performance shares) for corporate sponsors.",
    assignedEntityIds: [],
  },
  {
    id: "PS-CS2-0058",
    category: "Corporate Services",
    name: "Investor Relations Support",
    description:
      "Support services for corporate investor relations, shareholder communication and regulatory disclosure compliance.",
    assignedEntityIds: [],
  },

  // Execution & Order Routing
  {
    id: "PS-EX-0059",
    category: "Execution & Order Routing",
    name: "Best Execution & Order Routing",
    description:
      "Independent execution service routing client orders to best venues and counterparties, without proprietary trading or market making.",
    assignedEntityIds: [],
  },
  {
    id: "PS-EX-0060",
    category: "Execution & Order Routing",
    name: "Algorithmic Trading Services",
    description:
      "Provision of algorithm-based trading strategies (VWAP, TWAP, peg, iceberg, etc.) for execution of large orders with minimal market impact.",
    assignedEntityIds: [],
  },
  {
    id: "PS-EX-0061",
    category: "Execution & Order Routing",
    name: "Systematic Internalization",
    description:
      "Internalization of client orders (matching them without routing to external venues), subject to disclosure and pricing fairness requirements.",
    assignedEntityIds: [],
  },

  // Prime Brokerage
  {
    id: "PS-PB-0062",
    category: "Prime Brokerage",
    name: "Prime Brokerage Services",
    description:
      "Integrated services for institutional clients (hedge funds, proprietary traders) including execution, clearing, financing, reporting and risk management.",
    assignedEntityIds: [],
  },
  {
    id: "PS-PB-0063",
    category: "Prime Brokerage",
    name: "Securities Lending (from Prime Brokerage)",
    description:
      "Provision of securities lending services enabling hedge funds and traders to short securities or optimize portfolios.",
    assignedEntityIds: [],
  },
]

export function getProductsByCategory(category: string): ProductService[] {
  return PRODUCTS_SERVICES_CATALOGUE.filter((p) => p.category === category)
}

export function getCategoriesWithCounts(): { category: string; count: number }[] {
  const counts: Record<string, number> = {}
  PRODUCTS_SERVICES_CATALOGUE.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1
  })
  return Object.entries(counts).map(([category, count]) => ({ category, count }))
}
