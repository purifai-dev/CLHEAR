// Registry of public sources where license information can be found

export interface LicenseRegistrySource {
  jurisdiction: string
  regulator: string
  searchUrl: string
  description: string
}

export const LICENSE_REGISTRY_SOURCES: LicenseRegistrySource[] = [
  // Europe
  {
    jurisdiction: "United Kingdom",
    regulator: "FCA (Financial Conduct Authority)",
    searchUrl: "https://register.fca.org.uk/s/",
    description: "Search by firm name or FRN number",
  },
  {
    jurisdiction: "Cyprus",
    regulator: "CySEC (Cyprus Securities and Exchange Commission)",
    searchUrl: "https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/",
    description: "Browse authorized investment firms",
  },
  {
    jurisdiction: "Malta",
    regulator: "MFSA (Malta Financial Services Authority)",
    searchUrl: "https://www.mfsa.mt/financial-services-register/",
    description: "Search licensed entities",
  },
  {
    jurisdiction: "France",
    regulator: "AMF (Autorité des Marchés Financiers)",
    searchUrl: "https://www.amf-france.org/en/professionals/find-firm",
    description: "Search regulated firms",
  },
  {
    jurisdiction: "Germany",
    regulator: "BaFin (Federal Financial Supervisory Authority)",
    searchUrl: "https://www.bafin.de/EN/Databases/DatabaseSearch/DatabaseSearch_node.html",
    description: "Database search for regulated entities",
  },

  // Middle East & Africa
  {
    jurisdiction: "United Arab Emirates",
    regulator: "ADGM FSRA (Abu Dhabi Global Market)",
    searchUrl: "https://www.adgm.com/operating-in-adgm/registers",
    description: "Register of authorized persons",
  },
  {
    jurisdiction: "Seychelles",
    regulator: "FSA (Financial Services Authority)",
    searchUrl: "https://www.fsaseychelles.sc/register",
    description: "Register of licensed entities",
  },

  // Asia Pacific
  {
    jurisdiction: "Australia",
    regulator: "ASIC (Australian Securities and Investments Commission)",
    searchUrl: "https://connectonline.asic.gov.au/RegistrySearch/faces/landing/SearchRegisters.jspx",
    description: "Search professional registers",
  },
  {
    jurisdiction: "Singapore",
    regulator: "MAS (Monetary Authority of Singapore)",
    searchUrl: "https://eservices.mas.gov.sg/fid",
    description: "Financial Institutions Directory",
  },

  // Americas
  {
    jurisdiction: "United States",
    regulator: "SEC (Securities and Exchange Commission)",
    searchUrl: "https://www.sec.gov/edgar/searchedgar/companysearch.html",
    description: "Search SEC filings",
  },
  {
    jurisdiction: "United States",
    regulator: "FINRA (Financial Industry Regulatory Authority)",
    searchUrl: "https://brokercheck.finra.org/",
    description: "BrokerCheck - verify broker registration",
  },
  {
    jurisdiction: "United States",
    regulator: "FinCEN (Financial Crimes Enforcement Network)",
    searchUrl: "https://www.fincen.gov/msb-state-selector",
    description: "Money Services Business registration",
  },

  // Gibraltar
  {
    jurisdiction: "Gibraltar",
    regulator: "GFSC (Gibraltar Financial Services Commission)",
    searchUrl: "https://www.fsc.gi/regulated-entities",
    description: "Register of regulated entities",
  },
]

export const LICENSE_SEARCH_INSTRUCTIONS = `
**How to Find License Information for Any Company:**

1. **Start with the Company Website:**
   - Look for "Regulation", "Licenses", "Legal", or "About Us" pages
   - Companies are legally required to display their regulatory information
   - Example: etoro.com/customer-service/regulation-license/

2. **Check SEC Filings (for US entities or SPAC listings):**
   - Go to sec.gov/edgar/searchedgar/companysearch.html
   - Search by company name
   - Look in Form S-1, F-4, 10-K, or 20-F filings for subsidiary information

3. **Use GLEIF Database:**
   - Already integrated - provides LEI numbers and entity addresses
   - Use address to determine jurisdiction

4. **Search Regulator Databases:**
   - Once you know the jurisdiction, search the relevant regulator's database
   - See LICENSE_REGISTRY_SOURCES for direct links to each regulator

5. **What Information to Collect:**
   For each entity:
   - Legal name (exact as registered)
   - License type (e.g., MiFID Investment Firm, EMI, VASP)
   - License number (FRN, CIF, AFSL, etc.)
   - Issuing authority (FCA, CySEC, ASIC, etc.)
   - Status (Active, Pending, Expired, Suspended)
   - Permitted activities/scope
   - Issue and expiry dates (if available)

6. **Common License Types by Jurisdiction:**
   - **UK**: FCA FRN (Firm Reference Number)
   - **Cyprus**: CySEC CIF (Cyprus Investment Firm)
   - **Australia**: ASIC AFSL (Australian Financial Services Licence)
   - **Singapore**: MAS CMSL (Capital Markets Services Licence)
   - **UAE**: ADGM FSRA Registration Number
   - **USA**: SEC Registered Broker-Dealer, FinCEN MSB
   - **Gibraltar**: GFSC License Number (e.g., for DLT providers)

7. **Pro Tips:**
   - Holding companies rarely have operating licenses
   - Operating subsidiaries usually have country-specific licenses
   - Payment entities may have separate EMI/PI licenses
   - Crypto entities may have VASP/DLT provider licenses in addition to securities licenses
`
