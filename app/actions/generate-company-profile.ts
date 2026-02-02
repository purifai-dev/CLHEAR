"use server"

import { generateObject } from "ai"
import { z } from "zod"
import { fetchCompanyLogo } from "./fetchCompanyLogo" // Assuming fetchCompanyLogo is in the same directory

const REGULATOR_MAP: Record<string, { regulator: string; licenseTypes: string[] }> = {
  Cyprus: { regulator: "CySEC", licenseTypes: ["Investment Firm (MiFID II)", "Crypto Asset Service Provider (MiCA)"] },
  CY: { regulator: "CySEC", licenseTypes: ["Investment Firm (MiFID II)", "Crypto Asset Service Provider (MiCA)"] },
  "United Kingdom": {
    regulator: "FCA",
    licenseTypes: ["Investment Firm", "EMI", "Payment Institution", "Crypto Asset Business"],
  },
  UK: { regulator: "FCA", licenseTypes: ["Investment Firm", "EMI", "Payment Institution", "Crypto Asset Business"] },
  GB: { regulator: "FCA", licenseTypes: ["Investment Firm", "EMI", "Payment Institution", "Crypto Asset Business"] },
  "United States": {
    regulator: "SEC/FINRA",
    licenseTypes: ["Broker-Dealer", "Investment Adviser", "Money Services Business"],
  },
  US: { regulator: "SEC/FINRA", licenseTypes: ["Broker-Dealer", "Investment Adviser", "Money Services Business"] },
  Germany: { regulator: "BaFin", licenseTypes: ["Investment Firm", "Payment Institution", "Crypto Custody"] },
  DE: { regulator: "BaFin", licenseTypes: ["Investment Firm", "Payment Institution", "Crypto Custody"] },
  France: { regulator: "AMF/ACPR", licenseTypes: ["Investment Firm", "Payment Institution", "DASP"] },
  FR: { regulator: "AMF/ACPR", licenseTypes: ["Investment Firm", "Payment Institution", "DASP"] },
  Australia: { regulator: "ASIC", licenseTypes: ["AFSL (Financial Services License)", "ACL (Credit License)"] },
  AU: { regulator: "ASIC", licenseTypes: ["AFSL (Financial Services License)", "ACL (Credit License)"] },
  Singapore: { regulator: "MAS", licenseTypes: ["CMS License", "Payment Institution", "Major Payment Institution"] },
  SG: { regulator: "MAS", licenseTypes: ["CMS License", "Payment Institution", "Major Payment Institution"] },
  Gibraltar: { regulator: "GFSC", licenseTypes: ["DLT Provider", "Investment Firm"] },
  GI: { regulator: "GFSC", licenseTypes: ["DLT Provider", "Investment Firm"] },
  Malta: { regulator: "MFSA", licenseTypes: ["Investment Services License", "VFA License"] },
  MT: { regulator: "MFSA", licenseTypes: ["Investment Services License", "VFA License"] },
  Ireland: { regulator: "CBI", licenseTypes: ["Investment Firm", "EMI", "Payment Institution"] },
  IE: { regulator: "CBI", licenseTypes: ["Investment Firm", "EMI", "Payment Institution"] },
  Netherlands: { regulator: "AFM/DNB", licenseTypes: ["Investment Firm", "EMI", "Payment Institution"] },
  NL: { regulator: "AFM/DNB", licenseTypes: ["Investment Firm", "EMI", "Payment Institution"] },
  Luxembourg: { regulator: "CSSF", licenseTypes: ["Investment Firm", "Payment Institution", "EMI"] },
  LU: { regulator: "CSSF", licenseTypes: ["Investment Firm", "Payment Institution", "EMI"] },
  Switzerland: { regulator: "FINMA", licenseTypes: ["Securities Dealer", "Bank", "FinTech License"] },
  CH: { regulator: "FINMA", licenseTypes: ["Securities Dealer", "Bank", "FinTech License"] },
  Seychelles: { regulator: "FSA Seychelles", licenseTypes: ["Securities Dealer License"] },
  SC: { regulator: "FSA Seychelles", licenseTypes: ["Securities Dealer License"] },
  "British Virgin Islands": { regulator: "BVI FSC", licenseTypes: ["Investment Business License"] },
  VG: { regulator: "BVI FSC", licenseTypes: ["Investment Business License"] },
  "Cayman Islands": { regulator: "CIMA", licenseTypes: ["Securities Investment Business License", "VASP License"] },
  KY: { regulator: "CIMA", licenseTypes: ["Securities Investment Business License", "VASP License"] },
  UAE: { regulator: "DFSA/ADGM FSRA/SCA", licenseTypes: ["Financial Services Permission", "VASP License"] },
  AE: { regulator: "DFSA/ADGM FSRA/SCA", licenseTypes: ["Financial Services Permission", "VASP License"] },
  Israel: { regulator: "ISA", licenseTypes: ["Investment Portfolio Manager", "Investment Adviser"] },
  IL: { regulator: "ISA", licenseTypes: ["Investment Portfolio Manager", "Investment Adviser"] },
  Jersey: { regulator: "JFSC", licenseTypes: ["Fund Services Business", "Investment Business"] },
  JE: { regulator: "JFSC", licenseTypes: ["Fund Services Business", "Investment Business"] },
  Guernsey: { regulator: "GFSC", licenseTypes: ["Licensee under POI Law"] },
  GG: { regulator: "GFSC", licenseTypes: ["Licensee under POI Law"] },
}

async function searchWebForCompanyEntities(companyName: string): Promise<string[]> {
  try {
    // Use AI to search and find all known legal entities
    const { object } = await generateObject({
      model: "anthropic/claude-opus-4",
      schema: z.object({
        entities: z.array(z.string()),
        holdingCompany: z.string().optional(),
        notes: z.string().optional(),
      }),
      prompt: `You are a corporate research expert. Research ${companyName} and list ALL known legal entities in their corporate group.

For ${companyName}, provide:
1. The ultimate parent/holding company name (exact legal name)
2. ALL regulated subsidiaries across all jurisdictions
3. Any known branches or representative offices

For well-known companies like eToro, Interactive Brokers, Revolut, etc., you should know their full corporate structure.

For eToro specifically, the known entities include:
- eToro Group Ltd (BVI - holding company in British Virgin Islands) - THIS IS THE ULTIMATE PARENT
- eToro (Europe) Ltd (CySEC regulated, Cyprus)
- eToro (UK) Ltd (FCA regulated, UK)
- eToro USA LLC / eToro USA Securities Inc (SEC/FINRA, USA)
- eToro AUS Capital Pty Ltd (ASIC, Australia)
- eToro (Seychelles) Ltd (FSA Seychelles)
- eToro Money (UK) Ltd (EMI, UK)
- eToro X Limited (Gibraltar GFSC)
- And any other entities

IMPORTANT: Always include the ultimate holding/parent company even if it's in an offshore jurisdiction like BVI, Cayman, Jersey, etc.

List the EXACT legal names as they would appear in official registrations.`,
      maxOutputTokens: 2000,
    })

    console.log("[v0] Web search found entities:", object.entities?.length || 0)
    return object.entities || []
  } catch (error) {
    console.error("[v0] Web search for entities failed:", error)
    return []
  }
}

async function searchGLEIFComprehensive(companyName: string, knownEntities: string[]): Promise<any[]> {
  const allResults: any[] = []
  const seenLEIs = new Set<string>()

  // Search for the main company name
  const searchTerms = [companyName]

  // Add known entity names to search
  knownEntities.forEach((entity) => {
    if (!searchTerms.includes(entity)) {
      searchTerms.push(entity)
    }
  })

  // Also try variations
  const baseName = companyName.toLowerCase().replace(/[^a-z0-9]/g, "")
  searchTerms.push(baseName)

  console.log("[v0] Searching GLEIF with", searchTerms.length, "search terms")

  for (const term of searchTerms.slice(0, 10)) {
    // Limit to 10 searches
    try {
      // Try exact match first
      const exactResponse = await fetch(
        `https://api.gleif.org/api/v1/lei-records?filter[entity.legalName]=${encodeURIComponent(term)}&page[size]=50`,
        { headers: { Accept: "application/json" } },
      )

      if (exactResponse.ok) {
        const exactData = await exactResponse.json()
        if (exactData.data) {
          for (const record of exactData.data) {
            if (!seenLEIs.has(record.attributes.lei)) {
              seenLEIs.add(record.attributes.lei)
              allResults.push(parseGLEIFRecord(record))
            }
          }
        }
      }

      // Also try fuzzy search
      const fuzzyResponse = await fetch(
        `https://api.gleif.org/api/v1/lei-records?filter[fulltext]=${encodeURIComponent(term)}&page[size]=50`,
        { headers: { Accept: "application/json" } },
      )

      if (fuzzyResponse.ok) {
        const fuzzyData = await fuzzyResponse.json()
        if (fuzzyData.data) {
          for (const record of fuzzyData.data) {
            // Only add if it seems related to the company
            const legalName = record.attributes.entity?.legalName?.name?.toLowerCase() || ""
            if (legalName.includes(baseName) || baseName.includes(legalName.replace(/[^a-z0-9]/g, "").slice(0, 5))) {
              if (!seenLEIs.has(record.attributes.lei)) {
                seenLEIs.add(record.attributes.lei)
                allResults.push(parseGLEIFRecord(record))
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("[v0] GLEIF search error for term:", term, error)
    }
  }

  console.log("[v0] Total unique GLEIF records found:", allResults.length)
  return allResults
}

function parseGLEIFRecord(record: any): any {
  const entity = record.attributes.entity
  const registration = record.attributes.registration

  // Build registered at string
  const registeredAtParts = []
  if (entity.registeredAt?.id) registeredAtParts.push(entity.registeredAt.id)
  if (entity.registeredAt?.other) registeredAtParts.push(entity.registeredAt.other)
  if (entity.legalAddress?.region) registeredAtParts.push(entity.legalAddress.region)
  if (entity.legalAddress?.country) registeredAtParts.push(entity.legalAddress.country)

  // Build full address
  const addressParts = [
    ...(entity.legalAddress?.addressLines || []),
    entity.legalAddress?.city,
    entity.legalAddress?.postalCode,
    entity.legalAddress?.region,
    entity.legalAddress?.country,
  ].filter(Boolean)

  return {
    legalName: entity.legalName?.name || "",
    lei: record.attributes.lei || "",
    registeredAt: registeredAtParts.join("\n"),
    registeredAs: entity.registeredAs || "",
    jurisdictionOfFormation: entity.jurisdiction || entity.legalAddress?.country || "",
    generalCategory: entity.category || "GENERAL",
    entityLegalForm: entity.legalForm?.id || "",
    entityStatus: entity.status || "ACTIVE",
    entityCreatedAt: registration?.initialRegistrationDate?.split("T")[0] || "",
    address: addressParts.join(", "),
    bicCode: record.attributes.bic?.[0] || "",
    openCorporatesId: "",
    qccCode: "",
    spCiqCompanyId: "",
  }
}

async function enhanceEntitiesWithAI(gleifResults: any[], companyName: string, knownEntities: string[]) {
  try {
    const missingEntities = knownEntities.filter((known) => {
      const knownLower = known.toLowerCase()
      return !gleifResults.some((r) => r.legalName.toLowerCase().includes(knownLower.split(" ")[0]))
    })

    const { object } = await generateObject({
      model: "anthropic/claude-opus-4",
      schema: z.object({
        entities: z.array(
          z.object({
            legalName: z.string(),
            entityType: z.enum(["group", "subsidiary", "branch"]),
            entityRole: z.string(),
            regulator: z.string(),
            licenseType: z.string(),
            licenseId: z.string(),
            businessPurpose: z.string(),
            jurisdiction: z.string().optional(),
            isFromGLEIF: z.boolean().optional(),
          }),
        ),
        missingHoldingCompanies: z
          .array(
            z.object({
              legalName: z.string(),
              jurisdiction: z.string(),
              entityRole: z.string(),
              businessPurpose: z.string(),
            }),
          )
          .optional(),
      }),
      prompt: `You are a senior financial regulatory compliance expert with deep knowledge of global financial services companies and their corporate structures.

COMPANY: ${companyName}

You are analyzing ${gleifResults.length} legal entities from the official GLEIF database:

${gleifResults
  .map(
    (r: any, i: number) => `
ENTITY ${i + 1}:
  Legal Name: ${r.legalName}
  LEI: ${r.lei}
  Jurisdiction: ${r.jurisdictionOfFormation}
  Entity Status: ${r.entityStatus}
  Registered Address: ${r.address}
`,
  )
  .join("\n")}

KNOWN ENTITIES FROM WEB RESEARCH (some may not be in GLEIF):
${knownEntities.map((e, i) => `${i + 1}. ${e}`).join("\n")}

IMPORTANT CONTEXT:
- ${companyName} is a well-known fintech/financial services company
- Research what you know about this company from your training data
- Consider the company's public information, regulatory filings, and press releases
- MANY HOLDING COMPANIES (especially in BVI, Cayman, Jersey) ARE NOT IN GLEIF - identify these!

FOR EACH GLEIF ENTITY, provide:

1. ENTITY TYPE (CRITICAL - use exact values):
   - "group" for holding companies (names containing "Holdings", "Group", "International", or ultimate parent entities)
   - "subsidiary" for regulated operating entities
   - "branch" for branch offices

2. ENTITY ROLE: Specific function (e.g., "Ultimate Holding Company", "EU Investment Firm", "Crypto Trading Platform", "Payment Services Provider")

3. REGULATOR: Primary financial regulator based on jurisdiction:
   - Cyprus/CY → CySEC
   - UK/GB → FCA
   - USA/US → SEC/FINRA (or FinCEN for money services)
   - Germany/DE → BaFin
   - Australia/AU → ASIC
   - Gibraltar/GI → GFSC
   - Seychelles/SC → FSA Seychelles
   - Israel/IL → ISA
   - British Virgin Islands/VG → BVI FSC
   - Cayman Islands/KY → CIMA
   - For unregulated holding companies → "N/A - Unregulated Holding"

4. LICENSE TYPE: 
   - For regulated entities: Specific license (e.g., "CIF License", "Investment Firm Authorization", "Money Transmitter License")
   - For holding companies: "N/A - Holding Company"

5. LICENSE ID: 
   - Actual license number if you know it (e.g., "109/10" for eToro Europe's CySEC license)
   - Otherwise: "To be verified"

6. BUSINESS PURPOSE: 
   A comprehensive description (3-5 sentences) including:
   - Main business activities and services
   - Types of clients (retail, professional, institutional)
   - Products offered (stocks, CFDs, crypto, ETFs, etc.)
   - Geographic scope and markets served
   - Any special regulatory status or permissions
   
   For holding companies: Describe corporate governance role, subsidiary oversight, capital allocation, and group strategy.

ALSO IDENTIFY MISSING HOLDING COMPANIES:
If the ultimate parent/holding company of ${companyName} is NOT in the GLEIF list above, provide it in the missingHoldingCompanies array.
For eToro, if "eToro Group Ltd" (BVI) is not in the list, add it as a missing holding company.

CRITICAL REQUIREMENTS:
- Return EXACTLY ${gleifResults.length} entities in the SAME ORDER for the main entities array
- Use "group" for holding/parent companies and "subsidiary" for operating entities
- Use your knowledge of ${companyName} to provide accurate regulatory details
- For well-known companies, provide actual license numbers if known
- Business purposes should be specific to what each entity actually does
- Identify any missing holding companies not in GLEIF`,
      maxOutputTokens: 10000,
    })

    if (!object.entities || object.entities.length === 0) {
      throw new Error("AI returned empty entities array")
    }

    console.log("[v0] AI successfully enhanced", object.entities.length, "entities")

    if (object.missingHoldingCompanies && object.missingHoldingCompanies.length > 0) {
      console.log("[v0] AI identified", object.missingHoldingCompanies.length, "missing holding companies")
    }

    return {
      entities: object.entities,
      missingHoldingCompanies: object.missingHoldingCompanies || [],
    }
  } catch (error) {
    console.error("[v0] AI enhancement failed:", error)
    // Fallback logic - use "group" instead of "parent"
    return {
      entities: gleifResults.map((r: any) => {
        const name = r.legalName.toLowerCase()
        const jurisdiction = r.jurisdictionOfFormation || ""
        const regulatorInfo = REGULATOR_MAP[jurisdiction] || {
          regulator: "Unknown",
          licenseTypes: ["Financial Services License"],
        }

        let entityType: "group" | "subsidiary" | "branch" = "subsidiary"
        let entityRole = "Financial Services Entity"
        let licenseType = regulatorInfo.licenseTypes[0]
        let regulator = regulatorInfo.regulator
        let businessPurpose = ""

        if (
          name.includes("holdings") ||
          name.includes("group") ||
          name.includes("international") ||
          name.includes("holding")
        ) {
          entityType = "group"
          entityRole = "Ultimate Holding Company"
          licenseType = "N/A - Holding Company"
          regulator = "N/A - Unregulated Holding"
          businessPurpose = `${r.legalName} serves as the ultimate parent and holding company of the ${companyName} group. It provides strategic oversight, capital allocation, group-wide governance, risk management, and coordination of subsidiary operations across multiple jurisdictions.`
        } else {
          businessPurpose = `${r.legalName} is a regulated financial services entity providing investment and trading services to clients in ${jurisdiction || "its jurisdiction"}. Regulated by ${regulator}.`
        }

        return {
          legalName: r.legalName,
          entityType,
          entityRole,
          regulator,
          licenseType,
          licenseId: "To be verified",
          businessPurpose,
        }
      }),
      missingHoldingCompanies: [],
    }
  }
}

export async function generateCompanyProfile(prompt: string) {
  try {
    console.log("[v0] Starting comprehensive entity search for:", prompt)

    const knownEntities = await searchWebForCompanyEntities(prompt)
    console.log("[v0] Web research found", knownEntities.length, "known entity names")

    // Step 2: Fetch logo
    const logoUrl = await fetchCompanyLogo(prompt)
    console.log("[v0] Logo URL:", logoUrl || "not found")

    const gleifResults = await searchGLEIFComprehensive(prompt, knownEntities)

    if (gleifResults.length === 0 && knownEntities.length === 0) {
      return {
        success: false,
        error: "No entities found in GLEIF database. Please check the company name.",
      }
    }

    // Step 4: Enhance with AI - pass knownEntities to help identify missing holdings
    const { entities: enhancedEntities, missingHoldingCompanies } = await enhanceEntitiesWithAI(
      gleifResults,
      prompt,
      knownEntities,
    )

    const entities = gleifResults.map((result: any, index: number) => {
      const enhanced = enhancedEntities[index] || {}

      return {
        entityName: result.legalName,
        lei: result.lei,
        registeredAt: result.registeredAt || "",
        registeredAs: result.registeredAs || "",
        jurisdictionOfFormation: result.jurisdictionOfFormation || "",
        generalCategory: result.generalCategory || "GENERAL",
        entityLegalForm: result.entityLegalForm || "",
        entityStatus: result.entityStatus || "ACTIVE",
        entityCreatedAt: result.entityCreatedAt || "",
        registeredAddress: result.address || "",
        bicCode: result.bicCode || "",
        openCorporatesId: result.openCorporatesId || "",
        qccCode: result.qccCode || "",
        spCiqCompanyId: result.spCiqCompanyId || "",
        entityRole: enhanced.entityRole || "Financial Services Entity",
        entityType: enhanced.entityType || "subsidiary",
        regulator: enhanced.regulator || REGULATOR_MAP[result.jurisdictionOfFormation]?.regulator || "Unknown",
        licenseType: enhanced.licenseType || "To be verified",
        licenseId: enhanced.licenseId || "To be verified",
        businessPurpose: enhanced.businessPurpose || "",
      }
    })

    if (missingHoldingCompanies && missingHoldingCompanies.length > 0) {
      for (const holding of missingHoldingCompanies) {
        // Check if not already in list
        const alreadyExists = entities.some((e) =>
          e.entityName.toLowerCase().includes(holding.legalName.toLowerCase().split(" ")[0]),
        )

        if (!alreadyExists) {
          console.log("[v0] Adding missing holding company:", holding.legalName)
          entities.push({
            entityName: holding.legalName,
            lei: "",
            registeredAt: "",
            registeredAs: "",
            jurisdictionOfFormation: holding.jurisdiction,
            generalCategory: "GENERAL",
            entityLegalForm: "",
            entityStatus: "ACTIVE",
            entityCreatedAt: "",
            registeredAddress: holding.jurisdiction,
            bicCode: "",
            openCorporatesId: "",
            qccCode: "",
            spCiqCompanyId: "",
            entityRole: holding.entityRole || "Ultimate Holding Company",
            entityType: "group",
            regulator: "N/A - Unregulated Holding",
            licenseType: "N/A - Holding Company",
            licenseId: "N/A",
            businessPurpose: holding.businessPurpose,
          })
        }
      }
    }

    // Sort: group entities first, then subsidiaries
    entities.sort((a, b) => {
      if (a.entityType === "group" && b.entityType !== "group") return -1
      if (a.entityType !== "group" && b.entityType === "group") return 1
      return 0
    })

    const groupCount = entities.filter((e) => e.entityType === "group").length
    const subsidiaryCount = entities.filter((e) => e.entityType === "subsidiary").length
    console.log(
      `[v0] Successfully generated ${entities.length} entities: ${groupCount} group(s), ${subsidiaryCount} subsidiary(ies)`,
    )

    return { success: true, entities, logoUrl, groupCount, subsidiaryCount }
  } catch (error) {
    console.error("[v0] Error generating company profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate company profile",
    }
  }
}
