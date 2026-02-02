// FCA Permissions and Licences Catalogue
// Based on Part 4A of the Financial Services and Markets Act 2000
// and the FCA Handbook PERG 2 Annex 2

export interface FCAPermission {
  id: string
  code: string
  name: string
  category: string
  description: string
  articleReference: string
  specifiedInvestments?: string[]
  subPermissions?: {
    id: string
    name: string
    description: string
  }[]
}

export interface FCAPermissionCategory {
  id: string
  name: string
  description: string
  permissions: FCAPermission[]
}

// Complete FCA Permissions Catalogue
export const FCA_PERMISSIONS_CATALOGUE: FCAPermissionCategory[] = [
  {
    id: "electronic-money",
    name: "Electronic Money",
    description: "Activities related to issuing electronic money",
    permissions: [
      {
        id: "issue-emoney",
        code: "9B",
        name: "Issuing Electronic Money",
        category: "Electronic Money",
        description: "The activity of issuing electronic money",
        articleReference: "Article 9B RAO",
        specifiedInvestments: ["Electronic money (article 74A)"],
      },
    ],
  },
  {
    id: "emissions-auctions",
    name: "Emissions Auctions",
    description: "Bidding in emissions auctions",
    permissions: [
      {
        id: "bidding-emissions",
        code: "25D-EA",
        name: "Bidding in Emissions Auctions",
        category: "Emissions Auctions",
        description: "Bidding in emissions auctions for emissions auction products",
        articleReference: "Article 25D RAO",
        specifiedInvestments: ["Emissions auction products"],
      },
    ],
  },
  {
    id: "designated-investment-business",
    name: "Designated Investment Business",
    description: "Core investment activities including dealing, arranging, managing and advising",
    permissions: [
      {
        id: "deal-principal",
        code: "14",
        name: "Dealing in Investments as Principal",
        category: "Designated Investment Business",
        description: "Buying, selling, subscribing for or underwriting investments as principal",
        articleReference: "Article 14 RAO",
        specifiedInvestments: ["Security", "Contractually based investment"],
      },
      {
        id: "deal-agent",
        code: "21",
        name: "Dealing in Investments as Agent",
        category: "Designated Investment Business",
        description: "Buying, selling, subscribing for or underwriting investments as agent",
        articleReference: "Article 21 RAO",
        specifiedInvestments: ["Security", "Contractually based investment", "Long-term care insurance contract"],
      },
      {
        id: "arrange-deals",
        code: "25(1)",
        name: "Arranging (Bringing About) Deals in Investments",
        category: "Designated Investment Business",
        description: "Making arrangements for another person to buy, sell, subscribe for or underwrite investments",
        articleReference: "Article 25(1) RAO",
        specifiedInvestments: ["Security", "Contractually based investment", "Long-term care insurance contract"],
      },
      {
        id: "make-arrangements",
        code: "25(2)",
        name: "Making Arrangements with a View to Transactions in Investments",
        category: "Designated Investment Business",
        description:
          "Making arrangements with a view to a person buying, selling, subscribing for or underwriting investments",
        articleReference: "Article 25(2) RAO",
        specifiedInvestments: ["Security", "Contractually based investment", "Long-term care insurance contract"],
      },
      {
        id: "operate-mtf",
        code: "25D",
        name: "Operating a Multilateral Trading Facility (MTF)",
        category: "Designated Investment Business",
        description:
          "Operating a multilateral system which brings together multiple third-party buying and selling interests in financial instruments",
        articleReference: "Article 25D RAO",
        specifiedInvestments: ["Securities or contractually based investments which are financial instruments"],
      },
      {
        id: "operate-otf",
        code: "25DA",
        name: "Operating an Organised Trading Facility (OTF)",
        category: "Designated Investment Business",
        description: "Operating a multilateral system for trading certain financial instruments",
        articleReference: "Article 25DA RAO",
        specifiedInvestments: ["Certain securities or contractually based investments which are financial instruments"],
      },
      {
        id: "manage-investments",
        code: "37",
        name: "Managing Investments",
        category: "Designated Investment Business",
        description: "Managing assets belonging to another person where those assets include investments",
        articleReference: "Article 37 RAO",
        specifiedInvestments: ["Security", "Contractually based investment", "Structured deposit"],
        subPermissions: [
          {
            id: "manage-investments-general",
            name: "Managing Investments (General)",
            description: "General discretionary portfolio management",
          },
          {
            id: "manage-investments-pension",
            name: "Managing Investments (Pension)",
            description: "Managing pension scheme investments",
          },
        ],
      },
      {
        id: "safeguard-admin",
        code: "40",
        name: "Safeguarding and Administering Investments",
        category: "Designated Investment Business",
        description: "Safeguarding and administering investments belonging to another person",
        articleReference: "Article 40 RAO",
        specifiedInvestments: ["Security", "Contractually based investment"],
        subPermissions: [
          {
            id: "safeguard-without-arrange",
            name: "Safeguarding and Administration of Assets (without arranging)",
            description: "Holding client assets without arranging custody",
          },
          {
            id: "arrange-safeguard",
            name: "Arranging Safeguarding and Administration of Assets",
            description: "Arranging custody services with third parties",
          },
        ],
      },
      {
        id: "advise-investments",
        code: "53(1)",
        name: "Advising on Investments (except P2P agreements)",
        category: "Designated Investment Business",
        description:
          "Giving advice to a person on the merits of buying, selling, subscribing for or underwriting investments",
        articleReference: "Article 53(1) RAO",
        specifiedInvestments: ["Security", "Contractually based investment", "Structured deposit"],
        subPermissions: [
          {
            id: "advise-except-pension",
            name: "Advising on Investments (except pension transfers and pension opt-outs)",
            description: "General investment advice excluding pension transfers",
          },
          {
            id: "advise-pension-transfers",
            name: "Advising on Pension Transfers and Pension Opt-outs",
            description: "Advice specifically on pension transfers and opt-outs",
          },
        ],
      },
      {
        id: "send-demat",
        code: "45(1)",
        name: "Sending Dematerialised Instructions",
        category: "Designated Investment Business",
        description: "Sending dematerialised instructions relating to a security",
        articleReference: "Article 45(1) RAO",
        specifiedInvestments: ["Security"],
      },
      {
        id: "cause-demat",
        code: "45(2)",
        name: "Causing Dematerialised Instructions to be Sent",
        category: "Designated Investment Business",
        description: "Causing dematerialised instructions to be sent on behalf of another",
        articleReference: "Article 45(2) RAO",
        specifiedInvestments: ["Security"],
      },
    ],
  },
  {
    id: "fund-management",
    name: "Fund Management",
    description: "Activities related to managing collective investment schemes and funds",
    permissions: [
      {
        id: "manage-uk-ucits",
        code: "51ZA",
        name: "Managing a UK UCITS",
        category: "Fund Management",
        description: "Managing a UK undertaking for collective investment in transferable securities",
        articleReference: "Article 51ZA RAO",
      },
      {
        id: "trustee-uk-ucits",
        code: "51ZB",
        name: "Acting as Trustee or Depositary of a UK UCITS",
        category: "Fund Management",
        description: "Acting as trustee or depositary of a UK UCITS",
        articleReference: "Article 51ZB RAO",
      },
      {
        id: "manage-aif",
        code: "51ZC",
        name: "Managing an AIF",
        category: "Fund Management",
        description: "Managing an alternative investment fund",
        articleReference: "Article 51ZC RAO",
        subPermissions: [
          {
            id: "manage-auth-aif",
            name: "Managing an Authorised AIF",
            description: "Managing an authorised alternative investment fund",
          },
          {
            id: "manage-unauth-aif",
            name: "Managing an Unauthorised AIF",
            description: "Managing an unauthorised alternative investment fund",
          },
        ],
      },
      {
        id: "trustee-aif",
        code: "51ZD",
        name: "Acting as Trustee or Depositary of an AIF",
        category: "Fund Management",
        description: "Acting as trustee or depositary of an alternative investment fund",
        articleReference: "Article 51ZD RAO",
        subPermissions: [
          {
            id: "trustee-auth-aif",
            name: "Acting as Trustee or Depositary of an Authorised AIF",
            description: "Depositary for authorised AIFs",
          },
          {
            id: "trustee-unauth-aif",
            name: "Acting as Trustee or Depositary of an Unauthorised AIF",
            description: "Depositary for unauthorised AIFs",
          },
        ],
      },
      {
        id: "establish-cis",
        code: "51(1)(a)",
        name: "Establishing, Operating or Winding Up a Collective Investment Scheme",
        category: "Fund Management",
        description: "Establishing, operating or winding up a collective investment scheme",
        articleReference: "Article 51(1)(a) RAO",
      },
      {
        id: "act-trustee-cis",
        code: "51(1)(b)",
        name: "Acting as Trustee of an Authorised Unit Trust Scheme",
        category: "Fund Management",
        description: "Acting as trustee of an authorised unit trust scheme",
        articleReference: "Article 51(1)(b) RAO",
      },
      {
        id: "act-depositary-oeic",
        code: "51(1)(c)",
        name: "Acting as the Depositary or Sole Director of an OEIC",
        category: "Fund Management",
        description: "Acting as the depositary or sole director of an open-ended investment company",
        articleReference: "Article 51(1)(c) RAO",
      },
    ],
  },
  {
    id: "insurance-distribution",
    name: "Insurance Distribution",
    description: "Insurance mediation activities",
    permissions: [
      {
        id: "ins-deal-agent",
        code: "21-INS",
        name: "Dealing in Investments as Agent (Insurance)",
        category: "Insurance Distribution",
        description: "Dealing in contracts of insurance as agent",
        articleReference: "Article 21 RAO",
        specifiedInvestments: ["Contract of insurance", "Life policy"],
      },
      {
        id: "ins-arrange-deals",
        code: "25(1)-INS",
        name: "Arranging (Bringing About) Deals in Investments (Insurance)",
        category: "Insurance Distribution",
        description: "Arranging deals in contracts of insurance",
        articleReference: "Article 25(1) RAO",
        specifiedInvestments: ["Contract of insurance", "Life policy"],
      },
      {
        id: "ins-make-arrangements",
        code: "25(2)-INS",
        name: "Making Arrangements with a View to Transactions in Investments (Insurance)",
        category: "Insurance Distribution",
        description: "Making arrangements for insurance transactions",
        articleReference: "Article 25(2) RAO",
        specifiedInvestments: ["Contract of insurance", "Life policy"],
      },
      {
        id: "ins-assist-admin",
        code: "39A",
        name: "Assisting in the Administration and Performance of a Contract of Insurance",
        category: "Insurance Distribution",
        description: "Assisting in the administration and performance of an insurance contract",
        articleReference: "Article 39A RAO",
        specifiedInvestments: ["Contract of insurance"],
      },
      {
        id: "ins-advise",
        code: "53(1)-INS",
        name: "Advising on Investments (Insurance)",
        category: "Insurance Distribution",
        description: "Advising on contracts of insurance",
        articleReference: "Article 53(1) RAO",
        specifiedInvestments: ["Contract of insurance", "Life policy"],
        subPermissions: [
          {
            id: "advise-ins-general",
            name: "Advising on Investments (except pension transfers)",
            description: "General insurance advice",
          },
          {
            id: "advise-ins-pension",
            name: "Advising on Pension Transfers and Pension Opt-outs (Insurance)",
            description: "Pension-related insurance advice",
          },
        ],
      },
    ],
  },
  {
    id: "lloyds-market",
    name: "Lloyd's Market",
    description: "Activities specific to the Lloyd's insurance market",
    permissions: [
      {
        id: "advise-syndicate",
        code: "56",
        name: "Advising on Syndicate Participation at Lloyd's",
        category: "Lloyd's Market",
        description: "Advising a person to become a member of a particular Lloyd's syndicate",
        articleReference: "Article 56 RAO",
        specifiedInvestments: ["Membership of a Lloyd's syndicate"],
      },
      {
        id: "arrange-lloyds",
        code: "25(1)-LL",
        name: "Arranging Deals in Investments (Lloyd's)",
        category: "Lloyd's Market",
        description: "Arranging deals in Lloyd's syndicate capacity",
        articleReference: "Article 25(1) RAO",
        specifiedInvestments: ["Underwriting capacity of a Lloyd's syndicate", "Membership of a Lloyd's syndicate"],
      },
    ],
  },
  {
    id: "funeral-plans",
    name: "Funeral Plan Providers",
    description: "Activities related to funeral plan contracts",
    permissions: [
      {
        id: "enter-funeral-plan",
        code: "59(1)",
        name: "Entering as Provider into a Funeral Plan Contract",
        category: "Funeral Plans",
        description: "Entering into a funeral plan contract as the provider",
        articleReference: "Article 59(1) RAO",
        specifiedInvestments: ["Funeral plan contract"],
      },
      {
        id: "carry-out-funeral-plan",
        code: "59(1A)",
        name: "Carrying Out a Funeral Plan Contract as Provider",
        category: "Funeral Plans",
        description: "Carrying out obligations under a funeral plan contract as provider",
        articleReference: "Article 59(1A) RAO",
        specifiedInvestments: ["Funeral plan contract"],
      },
    ],
  },
  {
    id: "home-finance",
    name: "Regulated Home Finance Activity",
    description: "Mortgage and home finance related activities",
    permissions: [
      {
        id: "arrange-mortgage",
        code: "25A(1)",
        name: "Arranging (Bringing About) Regulated Mortgage Contracts",
        category: "Home Finance",
        description: "Making arrangements for another person to enter into a regulated mortgage contract",
        articleReference: "Article 25A(1) RAO",
        specifiedInvestments: ["Regulated mortgage contract"],
      },
      {
        id: "make-arrangements-mortgage",
        code: "25A(2)",
        name: "Making Arrangements with a View to Regulated Mortgage Contracts",
        category: "Home Finance",
        description: "Making arrangements with a view to a person entering into a regulated mortgage contract",
        articleReference: "Article 25A(2) RAO",
        specifiedInvestments: ["Regulated mortgage contract"],
      },
      {
        id: "advise-mortgage",
        code: "53A",
        name: "Advising on Regulated Mortgage Contracts",
        category: "Home Finance",
        description: "Giving advice on the merits of entering into a regulated mortgage contract",
        articleReference: "Article 53A RAO",
        specifiedInvestments: ["Regulated mortgage contract"],
      },
      {
        id: "enter-mortgage",
        code: "61(1)",
        name: "Entering into a Regulated Mortgage Contract",
        category: "Home Finance",
        description: "Entering into a regulated mortgage contract as lender",
        articleReference: "Article 61(1) RAO",
        specifiedInvestments: ["Regulated mortgage contract"],
      },
      {
        id: "admin-mortgage",
        code: "61(2)",
        name: "Administering a Regulated Mortgage Contract",
        category: "Home Finance",
        description: "Administering a regulated mortgage contract",
        articleReference: "Article 61(2) RAO",
        specifiedInvestments: ["Regulated mortgage contract"],
      },
      {
        id: "arrange-home-reversion",
        code: "25B(1)",
        name: "Arranging (Bringing About) a Home Reversion Plan",
        category: "Home Finance",
        description: "Arranging a home reversion plan",
        articleReference: "Article 25B(1) RAO",
        specifiedInvestments: ["Rights under a home reversion plan"],
      },
      {
        id: "advise-home-reversion",
        code: "53B",
        name: "Advising on a Home Reversion Plan",
        category: "Home Finance",
        description: "Advising on home reversion plans",
        articleReference: "Article 53B RAO",
        specifiedInvestments: ["Rights under a home reversion plan"],
      },
      {
        id: "enter-home-reversion",
        code: "63B(1)",
        name: "Entering into a Home Reversion Plan",
        category: "Home Finance",
        description: "Entering into a home reversion plan as provider",
        articleReference: "Article 63B(1) RAO",
        specifiedInvestments: ["Rights under a home reversion plan"],
      },
      {
        id: "arrange-home-purchase",
        code: "25C(1)",
        name: "Arranging (Bringing About) a Home Purchase Plan",
        category: "Home Finance",
        description: "Arranging a home purchase plan",
        articleReference: "Article 25C(1) RAO",
        specifiedInvestments: ["Rights under a home purchase plan"],
      },
      {
        id: "advise-home-purchase",
        code: "53C",
        name: "Advising on a Home Purchase Plan",
        category: "Home Finance",
        description: "Advising on home purchase plans",
        articleReference: "Article 53C RAO",
        specifiedInvestments: ["Rights under a home purchase plan"],
      },
      {
        id: "enter-home-purchase",
        code: "63F(1)",
        name: "Entering into a Home Purchase Plan",
        category: "Home Finance",
        description: "Entering into a home purchase plan as provider",
        articleReference: "Article 63F(1) RAO",
        specifiedInvestments: ["Rights under a home purchase plan"],
      },
      {
        id: "arrange-sale-rent-back",
        code: "25E(1)",
        name: "Arranging (Bringing About) a Regulated Sale and Rent Back Agreement",
        category: "Home Finance",
        description: "Arranging a sale and rent back agreement",
        articleReference: "Article 25E(1) RAO",
        specifiedInvestments: ["Rights under a regulated sale and rent back agreement"],
      },
      {
        id: "advise-sale-rent-back",
        code: "53D",
        name: "Advising on a Regulated Sale and Rent Back Agreement",
        category: "Home Finance",
        description: "Advising on sale and rent back agreements",
        articleReference: "Article 53D RAO",
        specifiedInvestments: ["Rights under a regulated sale and rent back agreement"],
      },
      {
        id: "enter-sale-rent-back",
        code: "63J(1)",
        name: "Entering into a Regulated Sale and Rent Back Agreement",
        category: "Home Finance",
        description: "Entering into a sale and rent back agreement as purchaser",
        articleReference: "Article 63J(1) RAO",
        specifiedInvestments: ["Rights under a regulated sale and rent back agreement"],
      },
    ],
  },
  {
    id: "credit-activities",
    name: "Credit-Related Regulated Activity",
    description: "Consumer credit and related activities",
    permissions: [
      {
        id: "enter-credit-lender",
        code: "60B(1)",
        name: "Entering into a Regulated Credit Agreement as Lender",
        category: "Credit Activities",
        description: "Entering into a regulated credit agreement as the lender",
        articleReference: "Article 60B(1) RAO",
        specifiedInvestments: ["Rights under a credit agreement"],
        subPermissions: [
          {
            id: "credit-general",
            name: "Regulated Credit Agreement (General)",
            description: "Excluding high-cost short-term credit, home credit loans, and bill of sale loans",
          },
          {
            id: "credit-hcstc",
            name: "High-Cost Short-Term Credit",
            description: "Payday loans and similar short-term credit",
          },
          {
            id: "credit-home",
            name: "Home Credit Loan Agreement",
            description: "Doorstep lending",
          },
          {
            id: "credit-bill-sale",
            name: "Bill of Sale Loan Agreement",
            description: "Logbook loans",
          },
        ],
      },
      {
        id: "exercise-credit-rights",
        code: "60B(2)",
        name: "Exercising Rights Under a Regulated Credit Agreement",
        category: "Credit Activities",
        description: "Exercising or having the right to exercise the lender's rights and duties",
        articleReference: "Article 60B(2) RAO",
        specifiedInvestments: ["Rights under a credit agreement"],
      },
      {
        id: "credit-broking",
        code: "36A",
        name: "Credit Broking",
        category: "Credit Activities",
        description: "Introducing individuals to credit providers or presenting credit agreements",
        articleReference: "Article 36A RAO",
        specifiedInvestments: ["Rights under a credit agreement", "Rights under a consumer hire agreement"],
      },
      {
        id: "operate-p2p",
        code: "36H",
        name: "Operating an Electronic System in Relation to Lending",
        category: "Credit Activities",
        description: "Operating a peer-to-peer lending platform",
        articleReference: "Article 36H RAO",
        specifiedInvestments: ["Rights under a credit agreement"],
      },
      {
        id: "debt-adjusting",
        code: "39D",
        name: "Debt Adjusting",
        category: "Credit Activities",
        description: "Negotiating with creditors on behalf of debtors",
        articleReference: "Article 39D RAO",
        specifiedInvestments: ["Rights under a credit agreement", "Rights under a consumer hire agreement"],
      },
      {
        id: "debt-counselling",
        code: "39E",
        name: "Debt Counselling",
        category: "Credit Activities",
        description: "Giving advice to debtors about liquidating debts",
        articleReference: "Article 39E RAO",
        specifiedInvestments: ["Rights under a credit agreement", "Rights under a consumer hire agreement"],
      },
      {
        id: "debt-collecting",
        code: "39F",
        name: "Debt Collecting",
        category: "Credit Activities",
        description: "Taking steps to procure payment of debts",
        articleReference: "Article 39F RAO",
        specifiedInvestments: ["Rights under a credit agreement", "Rights under a consumer hire agreement"],
      },
      {
        id: "debt-admin",
        code: "39G",
        name: "Debt Administration",
        category: "Credit Activities",
        description: "Performing administrative duties relating to credit agreements",
        articleReference: "Article 39G RAO",
        specifiedInvestments: ["Rights under a credit agreement", "Rights under a consumer hire agreement"],
      },
      {
        id: "advise-credit-land",
        code: "53DA",
        name: "Advising on Regulated Credit Agreements for the Acquisition of Land",
        category: "Credit Activities",
        description: "Advising on regulated credit agreements secured on land",
        articleReference: "Article 53DA RAO",
        specifiedInvestments: ["Rights under a credit agreement"],
      },
      {
        id: "enter-hire-owner",
        code: "60N(1)",
        name: "Entering into a Regulated Consumer Hire Agreement as Owner",
        category: "Credit Activities",
        description: "Entering into a consumer hire agreement as owner",
        articleReference: "Article 60N(1) RAO",
        specifiedInvestments: ["Rights under a consumer hire agreement"],
      },
      {
        id: "exercise-hire-rights",
        code: "60N(2)",
        name: "Exercising Rights Under a Regulated Consumer Hire Agreement",
        category: "Credit Activities",
        description: "Exercising the owner's rights and duties under a consumer hire agreement",
        articleReference: "Article 60N(2) RAO",
        specifiedInvestments: ["Rights under a consumer hire agreement"],
      },
      {
        id: "credit-info-services",
        code: "89A",
        name: "Providing Credit Information Services",
        category: "Credit Activities",
        description: "Providing services relating to information held by credit reference agencies",
        articleReference: "Article 89A RAO",
      },
      {
        id: "credit-references",
        code: "89B",
        name: "Providing Credit References",
        category: "Credit Activities",
        description: "Furnishing persons with information about the financial standing of individuals",
        articleReference: "Article 89B RAO",
      },
    ],
  },
  {
    id: "structured-deposits",
    name: "Activities Relating to Structured Deposits",
    description: "Activities involving structured deposits",
    permissions: [
      {
        id: "sd-deal-agent",
        code: "21-SD",
        name: "Dealing in Investments as Agent (Structured Deposits)",
        category: "Structured Deposits",
        description: "Dealing in structured deposits as agent",
        articleReference: "Article 21 RAO",
        specifiedInvestments: ["Structured deposits"],
      },
      {
        id: "sd-arrange-deals",
        code: "25(1)-SD",
        name: "Arranging (Bringing About) Deals in Investments (Structured Deposits)",
        category: "Structured Deposits",
        description: "Arranging deals in structured deposits",
        articleReference: "Article 25(1) RAO",
        specifiedInvestments: ["Structured deposits"],
      },
      {
        id: "sd-make-arrangements",
        code: "25(2)-SD",
        name: "Making Arrangements with a View to Transactions (Structured Deposits)",
        category: "Structured Deposits",
        description: "Making arrangements for structured deposit transactions",
        articleReference: "Article 25(2) RAO",
        specifiedInvestments: ["Structured deposits"],
      },
      {
        id: "sd-manage",
        code: "37-SD",
        name: "Managing Investments (Structured Deposits)",
        category: "Structured Deposits",
        description: "Managing assets including structured deposits",
        articleReference: "Article 37 RAO",
        specifiedInvestments: ["Structured deposits"],
      },
      {
        id: "sd-advise",
        code: "53(1)-SD",
        name: "Advising on Investments (Structured Deposits)",
        category: "Structured Deposits",
        description: "Advising on structured deposits",
        articleReference: "Article 53(1) RAO",
        specifiedInvestments: ["Structured deposits"],
      },
    ],
  },
  {
    id: "pension-schemes",
    name: "Pension Schemes",
    description: "Activities related to pension scheme operation",
    permissions: [
      {
        id: "basic-advice-stakeholder",
        code: "52B",
        name: "Providing Basic Advice on a Stakeholder Product",
        category: "Pension Schemes",
        description: "Providing basic advice on stakeholder products including pensions",
        articleReference: "Article 52B RAO",
        specifiedInvestments: ["Stakeholder product", "Stakeholder pension scheme"],
      },
      {
        id: "establish-personal-pension",
        code: "52(b)",
        name: "Establishing, Operating or Winding Up a Personal Pension Scheme",
        category: "Pension Schemes",
        description: "Establishing, operating or winding up a personal pension scheme",
        articleReference: "Article 52(b) RAO",
        specifiedInvestments: ["Personal pension scheme", "Stakeholder pension scheme"],
      },
    ],
  },
  {
    id: "pra-regulated",
    name: "PRA-Regulated Activities",
    description: "Activities regulated by the Prudential Regulation Authority",
    permissions: [
      {
        id: "accept-deposits",
        code: "5",
        name: "Accepting Deposits",
        category: "PRA-Regulated",
        description: "Accepting deposits from the public (banking)",
        articleReference: "Article 5 RAO",
        specifiedInvestments: ["Deposit"],
      },
      {
        id: "effect-insurance",
        code: "10(1)",
        name: "Effecting Contracts of Insurance",
        category: "PRA-Regulated",
        description: "Effecting contracts of insurance as principal",
        articleReference: "Article 10(1) RAO",
        specifiedInvestments: ["Contract of insurance - general", "Contract of insurance - long-term"],
      },
      {
        id: "carry-out-insurance",
        code: "10(2)",
        name: "Carrying Out Contracts of Insurance",
        category: "PRA-Regulated",
        description: "Carrying out contracts of insurance as principal",
        articleReference: "Article 10(2) RAO",
        specifiedInvestments: ["Contract of insurance - general", "Contract of insurance - long-term"],
      },
      {
        id: "manage-lloyds-syndicate",
        code: "57",
        name: "Managing the Underwriting Capacity of a Lloyd's Syndicate",
        category: "PRA-Regulated",
        description: "Managing the underwriting capacity of a Lloyd's syndicate as a managing agent",
        articleReference: "Article 57 RAO",
        specifiedInvestments: ["Underwriting capacity of a Lloyd's syndicate"],
      },
    ],
  },
]

// Helper function to get all permissions as flat list
export function getAllFCAPermissions(): FCAPermission[] {
  return FCA_PERMISSIONS_CATALOGUE.flatMap((category) => category.permissions)
}

// Helper function to get permission by ID
export function getFCAPermissionById(id: string): FCAPermission | undefined {
  return getAllFCAPermissions().find((p) => p.id === id)
}

// Helper function to get permissions by category
export function getFCAPermissionsByCategory(categoryId: string): FCAPermission[] {
  const category = FCA_PERMISSIONS_CATALOGUE.find((c) => c.id === categoryId)
  return category?.permissions || []
}

// Entity permission assignment type
export interface EntityPermissionAssignment {
  entityId: string
  permissionId: string
  status: "active" | "inactive" | "pending" | "revoked"
  effectiveDate?: string
  expiryDate?: string
  conditions?: string
  limitations?: string[]
}
