"use server"

import { generateText } from "ai"

export async function generateBusinessPurpose(
  entityName: string,
  jurisdiction: string,
  entityRole: string,
  regulator: string,
  licenseType: string,
) {
  try {
    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4",
      prompt: `You are a financial regulatory expert. Generate a concise business purpose description (2-3 sentences) for the following legal entity:

Entity Name: ${entityName}
Jurisdiction: ${jurisdiction}
Entity Role: ${entityRole}
Regulator: ${regulator}
License Type: ${licenseType}

The business purpose should describe:
1. The primary business activities the entity conducts
2. The types of products/services offered
3. The target client types (retail, professional, institutional)

Be specific and factual based on the entity's jurisdiction and license type. If this is a well-known company (like eToro, Revolut, Coinbase, etc.), include accurate details about their actual business activities.

Return ONLY the business purpose text, no additional formatting or labels.`,
      maxTokens: 300,
    })

    return { success: true, businessPurpose: text.trim() }
  } catch (error) {
    console.error("[v0] Error generating business purpose:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate business purpose",
    }
  }
}
