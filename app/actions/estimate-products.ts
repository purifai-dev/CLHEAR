"use server"

import { generateObject } from "ai"
import { z } from "zod"
import { PRODUCTS_SERVICES_CATALOGUE } from "@/lib/products-services-catalogue"

interface LegalEntity {
  id: string
  entityName?: string
  legalName?: string
  businessPurpose?: string
  regulator?: string
  licenseType?: string
}

interface LicenseAssignment {
  licenseId: string
  entityId: string
  status: string
}

interface ProductEstimation {
  entityId: string
  productId: string
  reasoning: string
}

const LICENSE_TO_PRODUCT_CATEGORY_MAP: Record<string, string[]> = {
  "LIC-001": ["Trading & Execution", "Execution & Order Routing"], // Dealing in Investments as Principal
  "LIC-002": ["Trading & Execution", "Execution & Order Routing"], // Dealing in Investments as Agent
  "LIC-003": ["Trading & Execution", "Execution & Order Routing", "Prime Brokerage"], // Arranging Deals in Investments
  "LIC-004": ["Investment Advice & Portfolio Management", "Advisory & Planning"], // Advising on Investments
  "LIC-005": ["Investment Advice & Portfolio Management", "Wealth & Asset Management"], // Managing Investments
  "LIC-006": ["Custody & Settlement"], // Safeguarding and Administering Investments
  "LIC-007": ["Fund Operations", "Wealth & Asset Management"], // Establishing/Operating CIS
  "LIC-008": ["Fund Operations", "Wealth & Asset Management"], // Acting as Trustee/Depositary
  "LIC-009": ["Fund Operations"], // Managing an AIF
  "LIC-010": ["Fund Operations"], // Managing a UCITS
  "LIC-011": ["Investment Banking & Capital Markets"], // MTF Operator
  "LIC-012": ["Investment Banking & Capital Markets"], // OTF Operator
  "LIC-013": ["Insurance-Linked & Alternative"], // Insurance Distribution
  "LIC-014": ["Insurance-Linked & Alternative"], // Insurance Mediation
  "LIC-015": ["Retirement & Pensions"], // Pension Transfer Specialist
  "LIC-016": ["Investment Banking & Capital Markets"], // Providing Investment Services
  "LIC-017": ["Corporate Services", "Investment Banking & Capital Markets"], // Sending Dematerialised Instructions
  "LIC-018": ["Trading & Execution", "Crypto & Digital Assets"], // Agreeing to Carry On
  "LIC-019": ["Analytics & Research"], // Making Arrangements for Safeguarding
  "LIC-020": ["Investment Banking & Capital Markets"], // Bidding in Emissions Auctions
}

const BUSINESS_PURPOSE_KEYWORDS: Record<string, string[]> = {
  "Trading & Execution": [
    "trading",
    "broker",
    "execution",
    "cfd",
    "forex",
    "fx",
    "spread betting",
    "derivatives",
    "options",
    "futures",
    "equities",
    "stocks",
    "shares",
  ],
  "Investment Advice & Portfolio Management": [
    "advice",
    "advisory",
    "portfolio",
    "management",
    "wealth",
    "financial planning",
    "investment advice",
  ],
  "Wealth & Asset Management": ["wealth", "asset management", "hnw", "high net worth", "private", "discretionary"],
  "Fund Operations": ["fund", "ucits", "aif", "collective investment", "pooled", "unit trust"],
  "Investment Banking & Capital Markets": [
    "capital markets",
    "ipo",
    "underwriting",
    "corporate finance",
    "m&a",
    "debt capital",
  ],
  "Custody & Settlement": ["custody", "safekeeping", "settlement", "clearing", "depositary"],
  "Analytics & Research": ["research", "analysis", "analytics", "market data", "ratings"],
  "Insurance-Linked & Alternative": ["insurance", "reinsurance", "cat bond", "ils"],
  "Retirement & Pensions": ["pension", "retirement", "sipp", "annuity"],
  "Lending & Credit": ["lending", "credit", "loan", "mortgage", "margin"],
  "Crypto & Digital Assets": [
    "crypto",
    "digital asset",
    "bitcoin",
    "blockchain",
    "token",
    "cryptocurrency",
    "virtual asset",
  ],
  "Advisory & Planning": ["planning", "tax", "estate", "financial planning"],
  "Corporate Services": ["corporate", "treasury", "nominee", "company"],
  "Execution & Order Routing": ["execution", "order routing", "dma", "direct market access", "sor", "smart order"],
  "Prime Brokerage": ["prime", "prime brokerage", "hedge fund", "leverage", "financing"],
}

export async function estimateProductsForEntities(
  entities: LegalEntity[],
  activeLicenses: LicenseAssignment[],
): Promise<{
  estimations: ProductEstimation[]
  error?: string
}> {
  try {
    const entityRelevantCategories: Map<string, Set<string>> = new Map()

    for (const entity of entities) {
      const categories = new Set<string>()

      // Get categories from active licenses
      const entityActiveLicenses = activeLicenses.filter((l) => l.entityId === entity.id && l.status === "active")

      for (const license of entityActiveLicenses) {
        const licenseCategories = LICENSE_TO_PRODUCT_CATEGORY_MAP[license.licenseId] || []
        licenseCategories.forEach((cat) => categories.add(cat))
      }

      // Get categories from business purpose keywords
      const businessPurpose = (entity.businessPurpose || "").toLowerCase()
      for (const [category, keywords] of Object.entries(BUSINESS_PURPOSE_KEYWORDS)) {
        if (keywords.some((kw) => businessPurpose.includes(kw))) {
          categories.add(category)
        }
      }

      if (categories.size > 0) {
        entityRelevantCategories.set(entity.id, categories)
      }
    }

    if (entityRelevantCategories.size === 0) {
      return {
        estimations: [],
        error:
          "No entities have active licenses or recognizable business purposes. Please ensure entities have business purposes defined and licenses assigned.",
      }
    }

    const allRelevantCategories = new Set<string>()
    entityRelevantCategories.forEach((cats) => cats.forEach((c) => allRelevantCategories.add(c)))

    const relevantProducts = PRODUCTS_SERVICES_CATALOGUE.filter((p) => allRelevantCategories.has(p.category))

    const productList = relevantProducts.map((p) => `${p.id}|${p.category}|${p.name}`).join("\n")

    const entityList = entities
      .filter((e) => entityRelevantCategories.has(e.id))
      .map((e) => {
        const licenses = activeLicenses
          .filter((l) => l.entityId === e.id && l.status === "active")
          .map((l) => l.licenseId)
          .join(",")
        const cats = Array.from(entityRelevantCategories.get(e.id) || []).join(",")
        return `${e.id}|${e.entityName || e.legalName}|${licenses}|${cats}|${(e.businessPurpose || "").substring(0, 200)}`
      })
      .join("\n")

    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4",
      schema: z.object({
        matches: z.array(
          z.object({
            e: z.string().describe("entity id"),
            p: z.string().describe("product id"),
            r: z.string().max(100).describe("brief reason"),
          }),
        ),
      }),
      prompt: `Match products to entities based on their business activities and FCA licenses.

PRODUCTS (id|category|name):
${productList}

ENTITIES (id|name|licenses|categories|business):
${entityList}

Return matches where the product category matches the entity's relevant categories AND aligns with their business purpose.
Be comprehensive - include ALL relevant products for each entity.
Format: {matches: [{e: entityId, p: productId, r: "brief reason"}]}`,
    })

    const estimations: ProductEstimation[] = object.matches.map((m) => ({
      entityId: m.e,
      productId: m.p,
      reasoning: m.r,
    }))

    return { estimations }
  } catch (error) {
    console.error("[v0] Product estimation error:", error)

    const fallbackEstimations: ProductEstimation[] = []

    for (const entity of entities) {
      const entityActiveLicenses = activeLicenses.filter((l) => l.entityId === entity.id && l.status === "active")

      if (entityActiveLicenses.length === 0 && !entity.businessPurpose) continue

      // Get categories from licenses
      const categories = new Set<string>()
      for (const license of entityActiveLicenses) {
        const licenseCategories = LICENSE_TO_PRODUCT_CATEGORY_MAP[license.licenseId] || []
        licenseCategories.forEach((cat) => categories.add(cat))
      }

      // Get categories from business purpose
      const businessPurpose = (entity.businessPurpose || "").toLowerCase()
      for (const [category, keywords] of Object.entries(BUSINESS_PURPOSE_KEYWORDS)) {
        if (keywords.some((kw) => businessPurpose.includes(kw))) {
          categories.add(category)
        }
      }

      // Match products in these categories
      for (const product of PRODUCTS_SERVICES_CATALOGUE) {
        if (categories.has(product.category)) {
          fallbackEstimations.push({
            entityId: entity.id,
            productId: product.id,
            reasoning: `Matched via ${product.category} category (rule-based fallback)`,
          })
        }
      }
    }

    if (fallbackEstimations.length > 0) {
      return {
        estimations: fallbackEstimations,
        error: "AI estimation failed, using rule-based matching instead",
      }
    }

    return {
      estimations: [],
      error: error instanceof Error ? error.message : "Failed to estimate products",
    }
  }
}
