"use server"

import { generateObject } from "ai"
import { z } from "zod"
import { FCA_LICENSES_CATALOGUE } from "@/lib/fca-licenses-catalogue"

interface LegalEntity {
  id: string
  entityName?: string
  legalName?: string
  businessPurpose?: string
  regulator?: string
  licenseType?: string
  jurisdictionOfFormation?: string
  registeredAddress?: string
}

interface LicenseEstimation {
  entityId: string
  licenseId: string
  status: "active" | "inactive" | "pending"
  confidence: "high" | "medium" | "low"
  reasoning: string
}

export async function estimateLicensesForEntities(entities: LegalEntity[]): Promise<{
  estimations: LicenseEstimation[]
  error?: string
}> {
  try {
    // Filter to entities with business purposes
    const entitiesWithPurpose = entities.filter((e) => e.businessPurpose && e.businessPurpose.trim().length > 0)

    if (entitiesWithPurpose.length === 0) {
      return {
        estimations: [],
        error: "No entities have business purposes defined",
      }
    }

    const licenseSummary = FCA_LICENSES_CATALOGUE.map((lic) => ({
      id: lic.id,
      name: lic.name,
      purpose: lic.purpose,
    }))

    // Build entity summary for AI
    const entitySummary = entitiesWithPurpose.map((e) => ({
      id: e.id,
      name: e.entityName || e.legalName || "Unknown",
      businessPurpose: e.businessPurpose,
      regulator: e.regulator || "",
      jurisdiction: e.jurisdictionOfFormation || "",
    }))

    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4",
      schema: z.object({
        estimations: z.array(
          z.object({
            entityId: z.string(),
            licenseId: z.string(),
            status: z.enum(["active", "inactive", "pending"]),
            confidence: z.enum(["high", "medium", "low"]),
            reasoning: z.string().max(200),
          }),
        ),
      }),
      prompt: `Analyze which FCA licenses each UK/FCA-regulated entity needs based on their business.

RULES:
- ONLY assign licenses to UK/FCA entities (check regulator field)
- Skip non-UK entities (CySEC, SEC, ASIC, etc.)
- Be thorough for UK entities - trading platforms need multiple licenses

LICENSES:
${licenseSummary.map((l) => `${l.id}: ${l.name} - ${l.purpose}`).join("\n")}

ENTITIES:
${entitySummary.map((e) => `ID:${e.id} | Name:${e.name} | Regulator:${e.regulator} | Purpose:${e.businessPurpose}`).join("\n\n")}

Return array of {entityId, licenseId, status:"active"/"pending"/"inactive", confidence:"high"/"medium"/"low", reasoning:string(max 200 chars)}.`,
    })

    return {
      estimations: object.estimations,
    }
  } catch (error) {
    console.error("[v0] License estimation error:", error)
    return {
      estimations: [],
      error: error instanceof Error ? error.message : "Failed to estimate licenses",
    }
  }
}
