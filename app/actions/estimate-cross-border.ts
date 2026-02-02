"use server"

import { generateObject } from "ai"
import { z } from "zod"

interface EntityData {
  id: string
  name: string
  jurisdiction: string
  regulator: string
  businessPurpose: string
  activeLicenses: { id: string; name: string }[]
  assignedProducts: { id: string; name: string; category: string }[]
}

interface ProductData {
  id: string
  name: string
  category: string
  description: string
}

interface CountryData {
  code: string
  name: string
  region: string
  isEU: boolean
  isEEA: boolean
  isFATF: boolean
}

interface EstimateCrossBorderInput {
  entities: EntityData[]
  products: ProductData[]
  countries: CountryData[]
}

export async function estimateCrossBorder(input: EstimateCrossBorderInput) {
  try {
    const { entities, products, countries } = input

    if (!entities || entities.length === 0 || !products || products.length === 0) {
      return { success: false, error: "No entities or products to process" }
    }

    const allAssignments: Array<{
      entityId: string
      productId: string
      countryCode: string
      isOffered: boolean
      reasoning: string
    }> = []

    // Process each entity individually for thorough analysis
    for (const entity of entities) {
      if (!entity.assignedProducts || entity.assignedProducts.length === 0) {
        continue
      }

      // Group countries by regulatory relationship to this entity
      const homeJurisdiction = getHomeCountryCode(entity.jurisdiction)
      const regulatorType = identifyRegulatorType(entity.regulator)

      // Determine which country groups this entity can potentially serve
      const countryGroups = categorizeCountriesForEntity(countries, regulatorType, homeJurisdiction)

      const prompt = `You are a senior regulatory compliance expert conducting a CRITICAL cross-border analysis for a financial services entity.

ENTITY UNDER ANALYSIS:
- Name: ${entity.name}
- Jurisdiction: ${entity.jurisdiction}
- Regulator: ${entity.regulator}
- Business Purpose: ${entity.businessPurpose || "Not specified"}
- Active Licenses: ${entity.activeLicenses?.map((l) => l.name).join(", ") || "None specified"}

PRODUCTS/SERVICES THIS ENTITY OFFERS:
${entity.assignedProducts.map((p) => `- ${p.id}: ${p.name} (${p.category})`).join("\n")}

COUNTRY GROUPS TO ANALYZE:

1. HOME JURISDICTION (${homeJurisdiction}):
   - Can directly offer services without additional authorization

2. ${regulatorType === "CYSEC" ? "EU/EEA PASSPORTING COUNTRIES (entity has passporting rights):" : "EU/EEA COUNTRIES (may require local authorization):"}
   ${countryGroups.euEea.map((c) => `${c.code} (${c.name})`).join(", ") || "None"}

3. FATF MEMBER COUNTRIES (established AML frameworks):
   ${
     countryGroups.fatf
       .slice(0, 30)
       .map((c) => `${c.code}`)
       .join(", ") || "None"
   }

4. OTHER COUNTRIES (require specific analysis):
   ${
     countryGroups.other
       .slice(0, 20)
       .map((c) => `${c.code}`)
       .join(", ") || "None"
   }

CRITICAL ANALYSIS INSTRUCTIONS:
1. For each product, determine which countries this entity can LEGALLY and PRACTICALLY offer it
2. Consider:
   - Does the entity's business purpose suggest they actually operate in this country?
   - Does the license type permit this product in this jurisdiction?
   - Are there regulatory barriers (e.g., UK firms post-Brexit cannot passport to EU)?
   - Would offering this product in this country make business sense given the entity's stated purpose?
3. BE CONSERVATIVE: Only mark as offered if there's a clear regulatory basis
4. For ${regulatorType === "CYSEC" ? "CySEC" : regulatorType === "FCA" ? "FCA" : regulatorType === "ASIC" ? "ASIC" : "this"} entities:
   ${getRegulatorSpecificGuidance(regulatorType)}

Return ONLY countries where offering is CLEARLY permitted. Include reasoning for each decision.`

      try {
        const { object } = await generateObject({
          model: "anthropic/claude-sonnet-4",
          schema: z.object({
            entityAnalysis: z.object({
              entityId: z.string(),
              canOperateCrossBorder: z.boolean(),
              overallReasoning: z.string(),
              countryProductAssignments: z.array(
                z.object({
                  countryCode: z.string(),
                  productId: z.string(),
                  isOffered: z.boolean(),
                  reasoning: z.string(),
                }),
              ),
            }),
          }),
          prompt,
        })

        // Add assignments from AI response
        object.entityAnalysis.countryProductAssignments.forEach((assignment) => {
          allAssignments.push({
            entityId: entity.id,
            productId: assignment.productId,
            countryCode: assignment.countryCode,
            isOffered: assignment.isOffered,
            reasoning: assignment.reasoning,
          })
        })
      } catch (entityError) {
        console.error(`Error processing entity ${entity.name}:`, entityError)
        // Use fallback for this entity
        const fallback = generateFallbackForEntity(entity, countries)
        allAssignments.push(...fallback)
      }
    }

    return {
      success: true,
      assignments: allAssignments,
    }
  } catch (error) {
    console.error("Error estimating cross-border:", error)

    // Complete fallback
    const fallbackAssignments = generateCompleteFallback(input)
    return {
      success: true,
      assignments: fallbackAssignments,
    }
  }
}

// Helper: Get country code from jurisdiction string
function getHomeCountryCode(jurisdiction: string): string {
  const j = jurisdiction?.toUpperCase() || ""
  const map: Record<string, string> = {
    UK: "GB",
    "UNITED KINGDOM": "GB",
    GB: "GB",
    "GREAT BRITAIN": "GB",
    CYPRUS: "CY",
    CY: "CY",
    AUSTRALIA: "AU",
    AU: "AU",
    USA: "US",
    US: "US",
    "UNITED STATES": "US",
    GERMANY: "DE",
    DE: "DE",
    FRANCE: "FR",
    FR: "FR",
    IRELAND: "IE",
    IE: "IE",
    NETHERLANDS: "NL",
    NL: "NL",
    LUXEMBOURG: "LU",
    LU: "LU",
    MALTA: "MT",
    MT: "MT",
    GIBRALTAR: "GI",
    GI: "GI",
    "BRITISH VIRGIN ISLANDS": "VG",
    BVI: "VG",
    VG: "VG",
    SEYCHELLES: "SC",
    SC: "SC",
  }
  return map[j] || j.slice(0, 2).toUpperCase()
}

// Helper: Identify regulator type
function identifyRegulatorType(regulator: string): string {
  const r = regulator?.toUpperCase() || ""
  if (r.includes("FCA")) return "FCA"
  if (r.includes("CYSEC")) return "CYSEC"
  if (r.includes("ASIC")) return "ASIC"
  if (r.includes("SEC") || r.includes("FINRA")) return "SEC"
  if (r.includes("GFSC")) return "GFSC"
  if (r.includes("FSA") && r.includes("SEYCHELLES")) return "FSA_SC"
  if (r.includes("BVI") || r.includes("FSC")) return "BVI_FSC"
  if (r.includes("N/A") || r === "") return "HOLDING"
  return "OTHER"
}

// Helper: Get regulator-specific guidance
function getRegulatorSpecificGuidance(regulatorType: string): string {
  const guidance: Record<string, string> = {
    FCA: "Post-Brexit, FCA entities CANNOT passport to EU. They can serve UK clients directly. Cross-border to EU requires local authorization or reverse solicitation.",
    CYSEC:
      "CySEC entities have MiFID II passporting rights across all EU/EEA countries. They can freely offer MiFID services in these jurisdictions.",
    ASIC: "ASIC entities can serve Australian clients. International offering requires specific arrangements with each jurisdiction.",
    SEC: "SEC/FINRA entities can serve US clients. Offering to non-US clients requires careful analysis of each jurisdiction's rules.",
    GFSC: "Gibraltar entities had EU passporting pre-Brexit. Post-Brexit status varies by country arrangement.",
    FSA_SC:
      "Seychelles FSA is an offshore regulator. Entities cannot freely offer services in major regulated markets without local authorization.",
    BVI_FSC:
      "BVI FSC is typically used for holding companies. Operating entities usually cannot directly offer retail services in regulated markets.",
    HOLDING: "Holding companies typically do not offer products/services directly to clients.",
    OTHER: "Analyze based on specific regulatory agreements and the entity's stated business purpose.",
  }
  return guidance[regulatorType] || guidance.OTHER
}

// Helper: Categorize countries for an entity
function categorizeCountriesForEntity(
  countries: CountryData[],
  regulatorType: string,
  homeCountry: string,
): { home: CountryData | null; euEea: CountryData[]; fatf: CountryData[]; other: CountryData[] } {
  const home = countries.find((c) => c.code === homeCountry) || null
  const euEea = countries.filter((c) => (c.isEU || c.isEEA) && c.code !== homeCountry)
  const fatf = countries.filter((c) => c.isFATF && !c.isEU && !c.isEEA && c.code !== homeCountry)
  const other = countries.filter((c) => !c.isEU && !c.isEEA && !c.isFATF && c.code !== homeCountry)

  return { home, euEea, fatf, other }
}

// Helper: Generate fallback for single entity
function generateFallbackForEntity(
  entity: EntityData,
  countries: CountryData[],
): Array<{ entityId: string; productId: string; countryCode: string; isOffered: boolean; reasoning: string }> {
  const assignments: Array<{
    entityId: string
    productId: string
    countryCode: string
    isOffered: boolean
    reasoning: string
  }> = []

  const homeCountry = getHomeCountryCode(entity.jurisdiction)
  const regulatorType = identifyRegulatorType(entity.regulator)

  // Skip holding companies
  if (regulatorType === "HOLDING" || regulatorType === "BVI_FSC") {
    return assignments
  }

  entity.assignedProducts?.forEach((product) => {
    // Home country always offered
    if (homeCountry && countries.some((c) => c.code === homeCountry)) {
      assignments.push({
        entityId: entity.id,
        productId: product.id,
        countryCode: homeCountry,
        isOffered: true,
        reasoning: `Home jurisdiction - ${entity.regulator} authorization`,
      })
    }

    // CySEC: EU passporting
    if (regulatorType === "CYSEC") {
      countries
        .filter((c) => c.isEU || c.isEEA)
        .forEach((country) => {
          if (country.code !== homeCountry) {
            assignments.push({
              entityId: entity.id,
              productId: product.id,
              countryCode: country.code,
              isOffered: true,
              reasoning: "MiFID II passporting via CySEC license",
            })
          }
        })
    }

    // FCA: UK only post-Brexit
    if (regulatorType === "FCA") {
      if (homeCountry !== "GB") {
        assignments.push({
          entityId: entity.id,
          productId: product.id,
          countryCode: "GB",
          isOffered: true,
          reasoning: "FCA home authorization",
        })
      }
    }
  })

  return assignments
}

// Helper: Generate complete fallback
function generateCompleteFallback(
  input: EstimateCrossBorderInput,
): Array<{ entityId: string; productId: string; countryCode: string; isOffered: boolean; reasoning: string }> {
  const allAssignments: Array<{
    entityId: string
    productId: string
    countryCode: string
    isOffered: boolean
    reasoning: string
  }> = []

  input.entities.forEach((entity) => {
    const fallback = generateFallbackForEntity(entity, input.countries)
    allAssignments.push(...fallback)
  })

  return allAssignments
}
