"use client"

import { useEffect } from "react"

const DEFAULT_ETORO_ENTITIES = [
  {
    id: "etoro-group-ltd",
    entityType: "group",
    entityName: "eToro Group Ltd",
    lei: "213800NKBMKZJXQ5IR67",
    registeredAt: "",
    registeredAs: "",
    jurisdictionOfFormation: "IL",
    generalCategory: "GENERAL",
    entityLegalForm: "",
    entityStatus: "ACTIVE",
    entityCreatedAt: "",
    registeredAddress: "Bnei Brak, Israel",
    businessPurpose:
      "Parent holding company for the eToro Group, providing strategic oversight and corporate governance for all regulated subsidiaries across multiple jurisdictions.",
    bicCode: "",
    openCorporatesId: "",
    qccCode: "",
    spCiqCompanyId: "",
    parentEntityId: "",
    logo: "",
    // Legacy fields
    regulator: "N/A (Holding Company)",
    licenseType: "Holding Company",
    licenseId: "N/A",
    legalName: "eToro Group Ltd",
  },
  {
    id: "etoro-europe-ltd",
    entityType: "subsidiary",
    entityName: "eToro (Europe) Ltd",
    lei: "213800ZKS5WQZGCXY36",
    registeredAt: "Cyprus Department of Registrar of Companies",
    registeredAs: "HE200585",
    jurisdictionOfFormation: "CY",
    generalCategory: "GENERAL",
    entityLegalForm: "Private Company Limited by Shares",
    entityStatus: "ACTIVE",
    entityCreatedAt: "2007-01-01",
    registeredAddress:
      "4 Profiti Ilia Street, Kanika International Business Centre, 7th floor, Germasogeia, 4046 Limassol, Cyprus",
    businessPurpose:
      "Provides investment services including portfolio management, investment advice, reception and transmission of orders, and execution of orders on behalf of clients. Offers CFD trading, cryptocurrency trading, stocks, and ETFs to retail and professional clients across EU/EEA markets under MiFID II passporting.",
    bicCode: "",
    openCorporatesId: "cy/he200585",
    qccCode: "",
    spCiqCompanyId: "",
    parentEntityId: "etoro-group-ltd",
    logo: "",
    regulator: "CySEC",
    licenseType: "Investment Firm (MiFID II)",
    licenseId: "109/10",
    legalName: "eToro (Europe) Ltd",
  },
  {
    id: "etoro-uk-ltd",
    entityType: "subsidiary",
    entityName: "eToro (UK) Ltd",
    lei: "213800FLAB1OVA8OHT72",
    registeredAt: "Companies Register (Companies House)\nEngland and Wales, United Kingdom\nRA000585",
    registeredAs: "07973792",
    jurisdictionOfFormation: "GB",
    generalCategory: "GENERAL",
    entityLegalForm: "Private Limited Company (en)\nH0PO",
    entityStatus: "ACTIVE",
    entityCreatedAt: "2012-03-02",
    registeredAddress: "24th Floor, One Canada Square, Canary Wharf, London E14 5AB, United Kingdom",
    businessPurpose:
      "FCA-authorised investment firm providing dealing in investments as agent, arranging deals in investments, managing investments, and advising on investments. Offers multi-asset trading platform including stocks, ETFs, CFDs, and cryptocurrency trading to UK retail and professional clients.",
    bicCode: "ETORGB21XXX",
    openCorporatesId: "gb/07973792",
    qccCode: "QGB45FP0FM",
    spCiqCompanyId: "635849470",
    parentEntityId: "etoro-group-ltd",
    logo: "",
    regulator: "FCA",
    licenseType: "Investment Firm",
    licenseId: "583263",
    legalName: "eToro (UK) Ltd",
  },
  {
    id: "etoro-usa-securities",
    entityType: "subsidiary",
    entityName: "eToro USA Securities Inc",
    lei: "549300GQKJ9HLPVJV276",
    registeredAt: "Delaware Division of Corporations",
    registeredAs: "",
    jurisdictionOfFormation: "US",
    generalCategory: "GENERAL",
    entityLegalForm: "Corporation",
    entityStatus: "ACTIVE",
    entityCreatedAt: "",
    registeredAddress: "221 River Street, 9th Floor, Hoboken, NJ 07030, USA",
    businessPurpose:
      "SEC-registered broker-dealer and FINRA member providing securities brokerage services to US customers. Offers commission-free stock and ETF trading, fractional shares, and social trading features to retail investors in the United States.",
    bicCode: "",
    openCorporatesId: "",
    qccCode: "",
    spCiqCompanyId: "",
    parentEntityId: "etoro-group-ltd",
    logo: "",
    regulator: "SEC / FINRA",
    licenseType: "Broker-Dealer",
    licenseId: "CRD# 298869",
    legalName: "eToro USA Securities Inc",
  },
  {
    id: "etoro-aus-capital",
    entityType: "subsidiary",
    entityName: "eToro AUS Capital Ltd",
    lei: "529900T3QMV8QSTAL689",
    registeredAt: "ASIC",
    registeredAs: "",
    jurisdictionOfFormation: "AU",
    generalCategory: "GENERAL",
    entityLegalForm: "Proprietary Limited Company",
    entityStatus: "ACTIVE",
    entityCreatedAt: "",
    registeredAddress: "Level 19, 9 Hunter Street, Sydney NSW 2000, Australia",
    businessPurpose:
      "ASIC-licensed financial services provider offering CFD trading, forex, stocks, ETFs, and cryptocurrency trading to Australian retail and wholesale clients under Australian Financial Services License.",
    bicCode: "",
    openCorporatesId: "",
    qccCode: "",
    spCiqCompanyId: "",
    parentEntityId: "etoro-group-ltd",
    logo: "",
    regulator: "ASIC",
    licenseType: "Australian Financial Services License",
    licenseId: "491139",
    legalName: "eToro AUS Capital Ltd",
  },
  {
    id: "etoro-seychelles",
    entityType: "subsidiary",
    entityName: "eToro (Seychelles) Ltd",
    lei: "",
    registeredAt: "Seychelles Financial Services Authority",
    registeredAs: "",
    jurisdictionOfFormation: "SC",
    generalCategory: "GENERAL",
    entityLegalForm: "Limited Company",
    entityStatus: "ACTIVE",
    entityCreatedAt: "",
    registeredAddress: "Mahe, Seychelles",
    businessPurpose:
      "Securities dealer providing CFD trading, forex, and cryptocurrency services to clients in emerging markets and jurisdictions not covered by other eToro entities.",
    bicCode: "",
    openCorporatesId: "",
    qccCode: "",
    spCiqCompanyId: "",
    parentEntityId: "etoro-group-ltd",
    logo: "",
    regulator: "FSA Seychelles",
    licenseType: "Securities Dealer",
    licenseId: "SD076",
    legalName: "eToro (Seychelles) Ltd",
  },
  {
    id: "etoro-x-limited",
    entityType: "subsidiary",
    entityName: "eToro X Limited",
    lei: "",
    registeredAt: "Gibraltar Companies House",
    registeredAs: "",
    jurisdictionOfFormation: "GI",
    generalCategory: "GENERAL",
    entityLegalForm: "Limited Company",
    entityStatus: "ACTIVE",
    entityCreatedAt: "",
    registeredAddress: "57/63 Line Wall Road, Gibraltar",
    businessPurpose:
      "DLT provider offering cryptocurrency exchange and wallet services, including buying, selling, and custody of digital assets for retail and professional clients.",
    bicCode: "",
    openCorporatesId: "",
    qccCode: "",
    spCiqCompanyId: "",
    parentEntityId: "etoro-group-ltd",
    logo: "",
    regulator: "GFSC",
    licenseType: "DLT Provider",
    licenseId: "1333B",
    legalName: "eToro X Limited",
  },
]

export function DataReset() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingEntities = localStorage.getItem("clhear-entities")
      if (!existingEntities) {
        localStorage.setItem("clhear-entities", JSON.stringify(DEFAULT_ETORO_ENTITIES))
        localStorage.setItem(
          "company-profile",
          JSON.stringify({
            companyName: "eToro Group",
            companyDescription: "eToro is a global multi-asset investment platform",
            entities: DEFAULT_ETORO_ENTITIES,
          }),
        )
        console.log("[v0] Seeded default eToro entities for development")
      }

      // Clear other data but keep entities
      localStorage.removeItem("clhear-boards")
      localStorage.removeItem("clhear-roles")
      localStorage.removeItem("clhear-people")
      localStorage.removeItem("clhear-activities")
      localStorage.removeItem("clhear-products")
    }
  }, [])

  return null
}
