"use server"

export async function fetchCompanyLogo(companyName: string): Promise<string> {
  try {
    // Simple domain extraction logic for common companies
    const domain =
      companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/group|holdings?|limited|ltd|plc|inc|corp|corporation|llc/g, "")
        .trim() + ".com"

    console.log("[v0] Fetching logo for domain:", domain)

    // Try DuckDuckGo favicon API
    const logoUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`

    try {
      const response = await fetch(logoUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      })

      if (response.ok) {
        console.log("[v0] Successfully fetched logo from DuckDuckGo")
        return logoUrl
      }
    } catch (err) {
      console.log("[v0] DuckDuckGo favicon failed, trying Google favicon")
    }

    // Fallback to Google's favicon service
    const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    console.log("[v0] Using Google favicon service")
    return googleFaviconUrl
  } catch (error) {
    console.error("[v0] Error fetching logo:", error)
    return ""
  }
}
