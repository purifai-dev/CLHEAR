export interface Jurisdiction {
  id: string
  country: string
  region: "EU" | "UK" | "US" | "APAC" | "MENA" | "LATAM" | "Other"
  subJurisdiction?: string
  regulators: string[]
  entityLicense?: string
}

export interface CrossBorderMatrixEntry {
  id: string
  companyId: string
  productId: string
  jurisdictionId: string
  status: "Allowed" | "Restricted" | "Prohibited" | "Not Set" | "Planned"
  conditions?: string
  effectiveFrom?: string
  effectiveTo?: string
  approvalReference?: string
  lastUpdatedBy?: string
  lastUpdatedAt?: string
  productOwner?: string
  jurisdictionOwner?: string
  approvalStatus?: "Draft" | "Pending Approval" | "Approved" | "Rejected"
}

export const JURISDICTIONS_CATALOGUE: Jurisdiction[] = [
  // EU jurisdictions
  {
    id: "jur-001",
    country: "Cyprus",
    region: "EU",
    subJurisdiction: "CySEC",
    regulators: ["CySEC"],
    entityLicense: "CIF License 109/10",
  },
  {
    id: "jur-002",
    country: "Germany",
    region: "EU",
    subJurisdiction: "BaFin",
    regulators: ["BaFin"],
    entityLicense: "Passported Services",
  },
  {
    id: "jur-003",
    country: "France",
    region: "EU",
    subJurisdiction: "AMF",
    regulators: ["AMF", "ACPR"],
    entityLicense: "Passported Services",
  },
  {
    id: "jur-004",
    country: "Spain",
    region: "EU",
    subJurisdiction: "CNMV",
    regulators: ["CNMV"],
    entityLicense: "Passported Services",
  },
  {
    id: "jur-005",
    country: "Italy",
    region: "EU",
    subJurisdiction: "CONSOB",
    regulators: ["CONSOB"],
    entityLicense: "Passported Services",
  },
  {
    id: "jur-006",
    country: "Netherlands",
    region: "EU",
    subJurisdiction: "AFM",
    regulators: ["AFM", "DNB"],
    entityLicense: "Passported Services",
  },

  // UK
  {
    id: "jur-007",
    country: "United Kingdom",
    region: "UK",
    subJurisdiction: "FCA",
    regulators: ["FCA", "PRA"],
    entityLicense: "FRN 583263",
  },

  // US
  {
    id: "jur-008",
    country: "United States",
    region: "US",
    subJurisdiction: "Federal",
    regulators: ["SEC", "FINRA", "CFTC"],
    entityLicense: "Under Application",
  },
  {
    id: "jur-009",
    country: "United States",
    region: "US",
    subJurisdiction: "New York",
    regulators: ["NYDFS"],
    entityLicense: "Not Authorized",
  },
  {
    id: "jur-010",
    country: "United States",
    region: "US",
    subJurisdiction: "California",
    regulators: ["DFPI"],
    entityLicense: "Not Authorized",
  },

  // APAC
  {
    id: "jur-011",
    country: "Australia",
    region: "APAC",
    subJurisdiction: "ASIC",
    regulators: ["ASIC"],
    entityLicense: "AFSL 491139",
  },
  {
    id: "jur-012",
    country: "Singapore",
    region: "APAC",
    subJurisdiction: "MAS",
    regulators: ["MAS"],
    entityLicense: "Under Application",
  },
  {
    id: "jur-013",
    country: "Hong Kong",
    region: "APAC",
    subJurisdiction: "SFC",
    regulators: ["SFC"],
    entityLicense: "Representative Office Only",
  },
  {
    id: "jur-014",
    country: "Japan",
    region: "APAC",
    subJurisdiction: "FSA",
    regulators: ["JFSA"],
    entityLicense: "Not Authorized",
  },

  // MENA
  {
    id: "jur-015",
    country: "United Arab Emirates",
    region: "MENA",
    subJurisdiction: "ADGM",
    regulators: ["FSRA"],
    entityLicense: "Category 4 License",
  },
  {
    id: "jur-016",
    country: "United Arab Emirates",
    region: "MENA",
    subJurisdiction: "DIFC",
    regulators: ["DFSA"],
    entityLicense: "Not Authorized",
  },
  {
    id: "jur-017",
    country: "Israel",
    region: "MENA",
    subJurisdiction: "ISA",
    regulators: ["ISA"],
    entityLicense: "Licensed Dealer",
  },

  // Other
  {
    id: "jur-018",
    country: "Switzerland",
    region: "Other",
    subJurisdiction: "FINMA",
    regulators: ["FINMA"],
    entityLicense: "Not Authorized",
  },
  {
    id: "jur-019",
    country: "Gibraltar",
    region: "Other",
    subJurisdiction: "GFSC",
    regulators: ["GFSC"],
    entityLicense: "DLT License",
  },
  {
    id: "jur-020",
    country: "Canada",
    region: "Other",
    subJurisdiction: "Various Provinces",
    regulators: ["CSA", "IIROC"],
    entityLicense: "Not Authorized",
  },
]

export function getJurisdictionsByRegion(region: Jurisdiction["region"]) {
  return JURISDICTIONS_CATALOGUE.filter((j) => j.region === region)
}

export function getJurisdictionById(id: string) {
  return JURISDICTIONS_CATALOGUE.find((j) => j.id === id)
}
