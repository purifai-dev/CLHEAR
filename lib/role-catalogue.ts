export type LineOfDefence = "GOVERNANCE" | "FIRST_LINE" | "SECOND_LINE" | "THIRD_LINE" | "SUPPORT"
export type RoleStatus = "FILLED" | "VACANT" | "COMBINED"

export interface Role {
  roleId: string
  roleNumber: number
  roleTitle: string
  lineOfDefence: LineOfDefence
  reportsTo: string
  coreResponsibilities: string
  standardsBasis: string
  keyStandardQuote: string
  pillarsLinked: string
  personAssignedId: string | null
  status: RoleStatus
  requiredForEntities?: string[] // Added for new functionality
}

export interface Person {
  personId: string
  fullName: string
  jobTitle: string
  email: string
  phone?: string
}

export function analyzeEntityTypeForRoles(entityRole: string): string[] {
  const role = entityRole.toLowerCase()
  const types: string[] = []

  if (
    role.includes("investment") ||
    role.includes("broker") ||
    role.includes("dealer") ||
    role.includes("securities")
  ) {
    types.push("INVESTMENT_FIRM")
  }

  if (
    role.includes("crypto") ||
    role.includes("digital asset") ||
    role.includes("token") ||
    role.includes("exchange")
  ) {
    types.push("CRYPTO_EXCHANGE")
  }

  if (role.includes("holding") || role.includes("parent") || role.includes("group")) {
    types.push("HOLDING_COMPANY")
  }

  if (role.includes("payment") || role.includes("emi") || role.includes("money")) {
    types.push("PAYMENT_INSTITUTION")
  }

  if (types.length === 0) {
    types.push("REGULATED_ENTITY")
  }

  return types
}

export function getRequiredRolesForEntities(
  entities: Array<{ id: string; entityRole: string; legalName: string }>,
): Role[] {
  const allEntityTypes = new Set<string>()

  entities.forEach((entity) => {
    const types = analyzeEntityTypeForRoles(entity.entityRole)
    types.forEach((type) => allEntityTypes.add(type))
  })

  // All 67 roles are required for any regulated entity
  return CLHEAR_67_ROLES.map((role) => ({
    roleId: `role-${role.roleNumber}`,
    roleNumber: role.roleNumber,
    roleTitle: role.roleTitle,
    lineOfDefence: role.lineOfDefence,
    reportsTo: role.reportsTo,
    coreResponsibilities: role.coreResponsibilities,
    standardsBasis: role.standardsBasis,
    keyStandardQuote: role.keyStandardQuote,
    pillarsLinked: role.pillarsLinked,
    personAssignedId: null,
    status: "VACANT" as RoleStatus,
    requiredForEntities: entities.map((e) => e.id), // All roles required for all entities
  }))
}

export const CLHEAR_67_ROLES = [
  // TIER 1: SENIOR ACCOUNTABLE ROLES (19 ROLES)
  {
    roleNumber: 1,
    roleTitle: "Board of Directors / Board Members",
    lineOfDefence: "GOVERNANCE" as const,
    reportsTo: "Shareholders",
    coreResponsibilities:
      "Define and approve strategy, risk appetite, major policies; oversee management and hold executives accountable; receive regular compliance, risk, and control reports; approve material changes to compliance program",
    standardsBasis:
      "OECD Corporate Governance Principles, COSO Internal Control, ISO 37301, BCBS Compliance Principles",
    keyStandardQuote:
      "The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal control. (COSO IC 2013)",
    pillarsLinked: "Pillar 1 (Governance)",
  },
  {
    roleNumber: 2,
    roleTitle: "Chief Executive Officer (CEO)",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "Board of Directors",
    coreResponsibilities:
      "Day-to-day operational management; implementation of board strategy and risk appetite; setting tone from top; ultimate accountability for business operations and compliance culture",
    standardsBasis: "COSO, BCBS, OECD, ISO 37301",
    keyStandardQuote:
      "Top management shall demonstrate leadership and commitment with respect to the compliance management system by taking accountability for the effectiveness of the compliance management system. (ISO 37301:2021)",
    pillarsLinked: "Pillar 1 (Governance), All Pillars",
  },
  {
    roleNumber: 3,
    roleTitle: "Chief Operating Officer (COO)",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "CEO",
    coreResponsibilities:
      "Design and operation of business processes and operational controls; business continuity and operational resilience; coordination with second-line risk and compliance",
    standardsBasis: "COSO, ISO 22301 (Business Continuity), BCBS",
    keyStandardQuote:
      "Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives. (COSO IC 2013)",
    pillarsLinked: "Pillar 12 (Operational Resilience), Pillar 16 (Internal Controls)",
  },
  {
    roleNumber: 4,
    roleTitle: "Chief Financial Officer (CFO)",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "CEO",
    coreResponsibilities:
      "Financial reporting, capital adequacy, liquidity management; financial control; coordination with risk and prudential reporting; financial risk management aligned with ICAAP/ICARA",
    standardsBasis: "ICAAP/ICARA, BCBS 239 (Risk Data Aggregation), SEC/FINRA Capital Rules, COSO",
    keyStandardQuote:
      "A bank's risk data aggregation capabilities and risk reporting practices should be subject to strong governance arrangements. Senior management should have a good understanding of the implications of the bank's risk reporting. (BCBS 239 2013)",
    pillarsLinked: "Pillar 10 (Capital Adequacy), Pillar 14 (Regulatory Reporting)",
  },
  {
    roleNumber: 5,
    roleTitle: "Chief Legal Officer / General Counsel (CLO)",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CEO / Board",
    coreResponsibilities:
      "Legal risk identification and interpretation; regulatory change interpretation; policy language review; legal liability assessment; regulatory correspondence oversight",
    standardsBasis: "OECD, COSO, ISO 37301, SEC/FINRA/FCA/ESMA",
    keyStandardQuote:
      "The organization shall identify and have access to up-to-date compliance obligations that are applicable to the organization, its activities, products and services. The organization shall determine how these compliance obligations apply. (ISO 37301:2021)",
    pillarsLinked: "Pillar 18 (Regulatory Engagement), Pillar 6 (Conduct)",
  },
  {
    roleNumber: 6,
    roleTitle: "Chief Risk Officer / Head of Risk (CRO)",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CEO / Board",
    coreResponsibilities:
      "Risk identification, measurement, monitoring, reporting; risk framework development and oversight; independence from operations; reporting on risk profile",
    standardsBasis: "COSO ERM, BCBS, ISO 31000 (Risk Management), ICAAP/ICARA",
    keyStandardQuote:
      "An entity identifies risks that affect performance, and assesses the severity to determine how to manage them. (COSO ERM 2017)",
    pillarsLinked: "Pillar 16 (Internal Controls), All Pillars",
  },
  {
    roleNumber: 7,
    roleTitle: "Chief Compliance Officer (CCO) / Head of Compliance",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CEO / Board",
    coreResponsibilities:
      "Compliance framework ownership; interpretation of regulatory obligations; policy development; monitoring plan oversight; business advisory; escalation of compliance risk",
    standardsBasis: "SEC/FINRA/FCA/ESMA, BCBS Compliance Principles, COSO, ISO 37301, ICA Professional Standards",
    keyStandardQuote:
      "The head of compliance should have direct access to the board of directors. (BCBS Compliance 2005)",
    pillarsLinked: "All 18 Pillars",
  },
  {
    roleNumber: 8,
    roleTitle: "Money Laundering Reporting Officer (MLRO) / Head of Financial Crime",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CEO / CCO",
    coreResponsibilities:
      "AML/CFT and sanctions framework ownership; customer due diligence, transaction monitoring, SAR/STR filing; AML training; financial crime risk escalation",
    standardsBasis: "FATF 40 Recommendations, Wolfsberg, SEC/FINRA/FCA/ESMA AML Rules, ISO 37301",
    keyStandardQuote:
      "Financial institutions should be required to implement programmes against money laundering and terrorist financing including: the appointment of a compliance officer at management level. (FATF Rec 18)",
    pillarsLinked: "Pillar 8 (Financial Crime), Pillar 3 (KYC/CIP)",
  },
  {
    roleNumber: 9,
    roleTitle: "Chief Information Security Officer (CISO) / Head of Information Security",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CEO / Board",
    coreResponsibilities:
      "Information security framework and cyber risk management; data protection; incident response; third-party security oversight; data security standards compliance",
    standardsBasis:
      "ISO 27001 (Information Security Management), ISO 22301 (Business Continuity), BCBS, SOC 2 / ISAE 3000",
    keyStandardQuote:
      "Top management shall ensure that the resources needed for establishing, implementing, maintaining and continually improving the BCMS are determined and provided. (ISO 22301:2019)",
    pillarsLinked: "Pillar 5 (RegTech & Data), Pillar 12 (Operational Resilience)",
  },
  {
    roleNumber: 10,
    roleTitle: "Data Protection Officer (DPO) / Privacy Lead",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CEO / Chief Legal Officer",
    coreResponsibilities:
      "Data protection compliance; DPIA (Data Protection Impact Assessments); privacy policy review; data subject rights handling; regulatory liaison with data protection authorities",
    standardsBasis: "ISO 27001, SEC/ESMA/FCA Conduct Rules, GDPR",
    keyStandardQuote:
      "The organization shall establish, implement and maintain documented information for data protection requirements applicable statutory, regulatory and contractual requirements. (ISO 27001:2022)",
    pillarsLinked: "Pillar 5 (RegTech & Data), Pillar 11 (Record Keeping)",
  },
  {
    roleNumber: 11,
    roleTitle: "Head of Product Governance",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "CEO / CCO",
    coreResponsibilities:
      "Product approval process, target market definition; conduct-of-business assessment; periodic product reviews; client suitability oversight",
    standardsBasis: "SEC Regulation Best Interest, FINRA, ESMA/FCA MiFID Product Governance, IOSCO",
    keyStandardQuote:
      "Manufacturers should determine a target market for each product and specify the type of clients for whose needs, characteristics and objectives the product is compatible. (ESMA MiFID II Guidelines 2017)",
    pillarsLinked: "Pillar 5 (Product Governance)",
  },
  {
    roleNumber: 12,
    roleTitle: "Head of Regulatory Reporting / Prudential Reporting Lead",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "CFO / Head of Risk",
    coreResponsibilities:
      "Regulatory report compilation and data validation; timely submission; coordination with risk and compliance; maintenance of reporting controls",
    standardsBasis: "SEC/FINRA/ESMA/FCA/BCBS 239 Reporting Standards, ICAAP/ICARA",
    keyStandardQuote:
      "A bank should have documented policies and processes governing the production and distribution of risk reports. (BCBS 239 2013)",
    pillarsLinked: "Pillar 14 (Regulatory Reporting)",
  },
  {
    roleNumber: 13,
    roleTitle: "Head of Outsourcing and Third-Party Risk Management",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CEO / CCO",
    coreResponsibilities:
      "Vendor due diligence and contract management; ongoing vendor monitoring and SLA tracking; vendor risk assessment and escalation",
    standardsBasis: "BCBS, COSO, ISO 27001/22301, SEC/FINRA/FCA/ESMA Outsourcing Rules",
    keyStandardQuote:
      "Banks should have a process for managing outsourcing relationships and risks, including due diligence in selecting service providers, structuring contracts, and monitoring performance. (BCBS Sound Practices 2011)",
    pillarsLinked: "Pillar 13 (Outsourcing)",
  },
  {
    roleNumber: 14,
    roleTitle: "Head of Regulatory Affairs / Regulatory Change Management",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CEO / CCO",
    coreResponsibilities:
      "Regulatory horizon scanning and new-rule impact assessment; regulatory interpretation; change-management coordination; regulator engagement and liaison",
    standardsBasis: "ISO 37301, COSO, BCBS, SEC/FINRA/FCA/ESMA Governance",
    keyStandardQuote:
      "The organization shall establish, implement and maintain a process(es) to identify, have access to and monitor changes to compliance obligations and determine how they apply to the organization. (ISO 37301:2021)",
    pillarsLinked: "Pillar 18 (Regulatory Engagement)",
  },
  {
    roleNumber: 15,
    roleTitle: "Head of Client Complaints and Client Outcomes",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "CCO / Head of Risk",
    coreResponsibilities:
      "Complaint receipt, logging, investigation, and remediation; root cause analysis; complaints trending; client outcome tracking and reporting",
    standardsBasis: "SEC/FINRA/FCA/ESMA Conduct Rules, IOSCO, COSO",
    keyStandardQuote:
      "A firm must have in place and operate appropriate and effective internal complaints handling procedures. Management must receive regular reports on the volume and nature of complaints. (FCA DISP 1.3)",
    pillarsLinked: "Pillar 15 (Complaints)",
  },
  {
    roleNumber: 16,
    roleTitle: "Head of Data and Records Governance",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CISO / CFO",
    coreResponsibilities:
      "Data standards, lineage, and quality governance; records retention and archiving; alignment with reporting and surveillance systems; compliance with records rules",
    standardsBasis: "BCBS 239 (Risk Data Aggregation), SEC/FINRA Books and Records Rules, ISO 27001/22301",
    keyStandardQuote:
      "A bank should design, build and maintain data architecture and IT infrastructure which fully supports its risk data aggregation capabilities. (BCBS 239 2013)",
    pillarsLinked: "Pillar 11 (Record Keeping), Pillar 5 (RegTech & Data)",
  },
  {
    roleNumber: 17,
    roleTitle: "Head of Training and Competence Management",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CCO / HR",
    coreResponsibilities:
      "Training programme design and delivery; role-based curricula; training tracking and attestation; competence assessment; ethics and culture training",
    standardsBasis: "ICA Professional Standards, ISO 37301, SEC/FINRA/FCA/ESMA Supervision and Training Rules, BCBS",
    keyStandardQuote:
      "The organization shall determine the necessary competence of persons doing work under its control that affects its compliance performance and ensure that these persons are competent on the basis of appropriate education, training or experience. (ISO 37301:2021)",
    pillarsLinked: "Pillar 4 (Governance - Culture), All Pillars",
  },
  {
    roleNumber: 18,
    roleTitle: "Head of Internal Audit / Chief Audit Executive (CAE)",
    lineOfDefence: "THIRD_LINE" as const,
    reportsTo: "Board or Audit Committee",
    coreResponsibilities:
      "Independent assurance over compliance program design and effectiveness; audit planning and execution; control testing; management findings tracking; board reporting",
    standardsBasis:
      "COSO, ISO 37301, ISAE 3000 (Assurance Engagements), IIA Three Lines Model, SEC/FINRA/FCA/ESMA Governance",
    keyStandardQuote:
      "Internal auditing is an independent, objective assurance and consulting activity designed to add value and improve an organization's operations. (IIA Definition of Internal Auditing)",
    pillarsLinked: "Pillar 17 (Internal Audit), All Pillars",
  },
  {
    roleNumber: 19,
    roleTitle: "Company Secretary / Governance Officer",
    lineOfDefence: "GOVERNANCE" as const,
    reportsTo: "CEO / Board",
    coreResponsibilities:
      "Board and committee administration; minutes and records; statutory and regulatory filings; governance documentation; board member coordination",
    standardsBasis: "OECD Corporate Governance, COSO",
    keyStandardQuote:
      "The governance framework should ensure the strategic guidance of the company, the effective monitoring of management by the board, and the board's accountability to the company and the shareholders. (OECD Principles 2015)",
    pillarsLinked: "Pillar 1 (Governance)",
  },

  // TIER 2: EXECUTION AND SPECIALIST ROLES (48 ROLES)
  // Financial Crime and AML Domain (7 roles)
  {
    roleNumber: 20,
    roleTitle: "AML Compliance Officer (Head of AML Operations)",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "MLRO (Role #8)",
    coreResponsibilities:
      "AML program design and procedures; AML compliance monitoring and testing; Training program delivery and content development; Regulatory reporting on AML effectiveness; Policy updates aligned with regulatory changes",
    standardsBasis: "FATF Rec 18, SEC/FINRA/FCA/ESMA AML Rules",
    keyStandardQuote:
      "Programmes should include policies and procedures to identify and report suspicious transactions. (FATF Rec 18)",
    pillarsLinked: "Pillar 8 (Financial Crime)",
  },
  {
    roleNumber: 21,
    roleTitle: "Transaction Monitoring Specialist",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "MLRO or AML Officer (Role #20)",
    coreResponsibilities:
      "Daily transaction monitoring and alert investigation; Suspicious activity pattern identification; SAR/STR preparation and filing; Alert triage and prioritization; System maintenance and tuning",
    standardsBasis: "FATF Rec 20, SEC/FINRA/FCA/ESMA AML Rules",
    keyStandardQuote:
      "Financial institutions should pay special attention to all complex, unusual large transactions. (FATF Rec 20)",
    pillarsLinked: "Pillar 8 (Financial Crime)",
  },
  {
    roleNumber: 22,
    roleTitle: "Know Your Customer (KYC) Specialist",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "MLRO or Compliance Officer (Role #20)",
    coreResponsibilities:
      "Customer due diligence (CDD) and enhanced due diligence (EDD); Customer identity verification and beneficial ownership identification; KYC file maintenance and review; Periodic KYC refresh cycles",
    standardsBasis: "FATF Rec 10, USA PATRIOT Act Section 326, SEC CIP Rule, FCA COBS",
    keyStandardQuote:
      "Financial institutions should be required to undertake customer due diligence measures, including: (a) Identifying the customer and verifying that customer's identity; (b) Identifying the beneficial owner. (FATF Rec 10)",
    pillarsLinked: "Pillar 3 (KYC/CIP)",
  },
  {
    roleNumber: 23,
    roleTitle: "Sanctions and OFAC Compliance Specialist",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "MLRO (Role #8)",
    coreResponsibilities:
      "Sanctions list maintenance and updates (OFAC, UN, EU); Customer and transaction sanctions screening; Screening procedure design and optimization; Blocked transaction investigation and reporting",
    standardsBasis: "FATF Rec 6, OFAC, UN Sanctions, EU Sanctions",
    keyStandardQuote:
      "Countries should implement targeted financial sanctions regimes to comply with United Nations Security Council resolutions. (FATF Rec 6)",
    pillarsLinked: "Pillar 8 (Financial Crime)",
  },
  {
    roleNumber: 24,
    roleTitle: "AML Testing and Audit Specialist",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "MLRO or CCO (Role #7)",
    coreResponsibilities:
      "Independent AML program testing (annual requirement per FATF Rec 18); Control effectiveness testing of AML procedures; Findings documentation and recommendation tracking; Audit coordination with internal audit",
    standardsBasis: "FATF Rec 18, SEC Rule 17a-12(c)(2)",
    keyStandardQuote:
      "Financial institutions should have an independent audit function to test the AML/CFT system. (FATF Rec 18)",
    pillarsLinked: "Pillar 8 (Financial Crime)",
  },
  {
    roleNumber: 25,
    roleTitle: "Beneficial Ownership Verification Specialist",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "MLRO or KYC Specialist (Role #22)",
    coreResponsibilities:
      "Beneficial owner identification procedures; UBO verification and documentation; Complex corporate structure analysis; Ownership chain validation; Registry searches and public records review",
    standardsBasis: "FATF Rec 10, EU AML Directives, SEC/FINRA/FCA CIP Rules",
    keyStandardQuote:
      "Financial institutions should identify the beneficial owner and take reasonable measures to verify the identity of the beneficial owner. (FATF Rec 10)",
    pillarsLinked: "Pillar 3 (KYC/CIP), Pillar 8 (Financial Crime)",
  },
  {
    roleNumber: 26,
    roleTitle: "Customer Risk Categorization and EDD Analyst",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "MLRO or KYC Specialist (Role #22)",
    coreResponsibilities:
      "Customer risk assessment and categorization (low/medium/high); Enhanced due diligence trigger identification; Politically exposed person (PEP) screening; High-risk customer ongoing monitoring; Source of funds and source of wealth verification",
    standardsBasis: "FATF Rec 10, Wolfsberg AML Principles, FCA COBS",
    keyStandardQuote: "The extent of CDD measures should be commensurate with the risks identified. (FATF Rec 10)",
    pillarsLinked: "Pillar 3 (KYC/CIP), Pillar 8 (Financial Crime)",
  },

  // Compliance and Conduct Domain (9 roles)
  {
    roleNumber: 27,
    roleTitle: "Conduct Compliance Officer",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CCO (Role #7)",
    coreResponsibilities:
      "Conduct rules monitoring (SEC/FINRA/FCA/ESMA); Conduct breach identification and escalation; Conduct training and awareness programs; Suitability and best interest monitoring; Client communications review for fair dealing",
    standardsBasis: "SEC/FINRA/FCA/ESMA Conduct Rules, FCA Principles for Businesses",
    keyStandardQuote:
      "A firm must conduct its business with integrity and pay due regard to the interests of its customers and treat them fairly. (FCA Principles)",
    pillarsLinked: "Pillar 6 (Conduct), Pillar 4 (Suitability)",
  },
  {
    roleNumber: 28,
    roleTitle: "Conflicts of Interest Officer",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CCO (Role #7)",
    coreResponsibilities:
      "Conflicts of interest identification and documentation; Conflicts register maintenance and review; Mitigation strategy development and implementation; Personal trading and outside business activity monitoring; Gifts, entertainment, and inducements policy enforcement",
    standardsBasis: "FCA SYSC 10, ESMA MiFID II Conflicts, SEC/FINRA Conduct Rules, IOSCO Principles",
    keyStandardQuote:
      "Investment firms should establish, implement and maintain an effective conflicts of interest policy. (ESMA MiFID II Guidelines)",
    pillarsLinked: "Pillar 6 (Conduct and Conflicts)",
  },
  {
    roleNumber: 29,
    roleTitle: "Market Surveillance Officer",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CCO (Role #7) or Head of Compliance",
    coreResponsibilities:
      "Trade surveillance for insider trading and market manipulation; Market abuse alert investigation; Surveillance system tuning and optimization; Regulatory reporting of suspected violations; Trading error identification and escalation",
    standardsBasis: "SEC Rule 15c3-5, FINRA Rule 5210, ESMA MiFID II Best Execution",
    keyStandardQuote:
      "A member in any transaction for or with a customer shall use reasonable diligence to ascertain the best market. (FINRA Rule 5310)",
    pillarsLinked: "Pillar 7 (Market Conduct)",
  },
  {
    roleNumber: 30,
    roleTitle: "Best Execution Monitoring Specialist",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CCO or Compliance Officer (Role #27)",
    coreResponsibilities:
      "Best execution testing and monitoring; Execution quality analysis per FINRA Rule 5310 and ESMA requirements; Execution venue comparison and analysis; Trader guidance and compliance education; Best execution exception investigation",
    standardsBasis: "FINRA Rule 5310, ESMA MiFID II Best Execution RTS 27, SEC Rule 10b-18",
    keyStandardQuote:
      "Firms must take all sufficient steps to obtain the best possible result for their clients. (ESMA MiFID II)",
    pillarsLinked: "Pillar 7 (Market Conduct)",
  },
  {
    roleNumber: 31,
    roleTitle: "Suitability and Best Interest Monitoring Specialist",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "Compliance Officer (Role #27) or Head of Product",
    coreResponsibilities:
      "Suitability and best interest assessment reviews; Advisor training and competence oversight; Suitability file sampling and testing; Exception investigation (unsuitable recommendations); Regulatory Reg BI compliance monitoring",
    standardsBasis: "SEC Regulation Best Interest, FINRA Rule 2111, FCA COBS, ESMA MiFID II Suitability",
    keyStandardQuote:
      "A broker-dealer shall act in the best interest of the retail customer at the time the recommendation is made. (SEC Reg BI)",
    pillarsLinked: "Pillar 4 (Suitability and Best Interest)",
  },
  {
    roleNumber: 32,
    roleTitle: "Consumer Protection and Fair Outcomes Specialist",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "CCO or Head of Compliance (Role #27)",
    coreResponsibilities:
      "Fair outcomes and consumer detriment monitoring; Customer harm identification and tracking; Compensation recommendation and approval; Consumer protection regulatory compliance; Fair treatment principles enforcement",
    standardsBasis: "FCA Consumer Duty, COBS, ESMA MiFID II Client Interests",
    keyStandardQuote: "A firm must act to deliver good outcomes for retail customers. (FCA Consumer Duty)",
    pillarsLinked: "Pillars 4, 6, 15 (Suitability, Conduct, Complaints)",
  },
  {
    roleNumber: 33,
    roleTitle: "Communications and Marketing Compliance Officer",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CCO (Role #7) or Head of Compliance",
    coreResponsibilities:
      "Marketing materials review and approval; Advertisement compliance with FINRA Rule 2210 and FCA rules; Social media and website content review; Client-facing communications review for accuracy; Promotional materials oversight",
    standardsBasis: "FINRA Rule 2210, SEC Advertising Rules, FCA COBS, ESMA Guidelines on Communications",
    keyStandardQuote:
      "No member may make any false, exaggerated, unwarranted, promissory or misleading statement in any communication. (FINRA Rule 2210)",
    pillarsLinked: "Pillar 9 (Communications and Marketing)",
  },
  {
    roleNumber: 34,
    roleTitle: "Enterprise Conduct and Culture Officer",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CCO or Head of HR",
    coreResponsibilities:
      "Conduct and culture surveys and assessments; Tone-from-the-top measurement and reporting; Conduct training curriculum development; Misconduct investigation coordination; Disciplinary action tracking and reporting; Culture improvement initiatives",
    standardsBasis: "FCA Principle 2 (Due Care), BCBS Corporate Governance, ISO 37301",
    keyStandardQuote: "A firm must conduct its business with due skill, care and diligence. (FCA Principle 2)",
    pillarsLinked: "Pillar 4 (Governance - Culture), Pillar 6 (Conduct)",
  },
  {
    roleNumber: 35,
    roleTitle: "Regulatory Correspondence and Inquiry Specialist",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "CCO or General Counsel (Role #5)",
    coreResponsibilities:
      "Receiving and logging regulatory inquiries and requests; Response drafting and coordination; Escalation of material regulatory matters; Tracking regulatory request deadlines and status; Regulatory correspondence filing and organization",
    standardsBasis: "FCA Principle 11 (Relations with Regulators), SEC/FINRA expectations",
    keyStandardQuote: "A firm must deal with its regulators in an open and cooperative way. (FCA Principle 11)",
    pillarsLinked: "Pillar 18 (Regulatory Engagement)",
  },

  // Product Governance Domain (2 roles)
  {
    roleNumber: 36,
    roleTitle: "Product Governance Specialist",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "Head of Product Governance (Role #11)",
    coreResponsibilities:
      "Product approval documentation and file preparation; Target market assessment and documentation; Product testing and validation procedures; Conduct-of-business review for products; Periodic product review execution and documentation",
    standardsBasis: "ESMA MiFID II Product Governance, SEC Regulation Best Interest, FINRA Product Governance",
    keyStandardQuote:
      "Manufacturers should determine a target market for each product. (ESMA MiFID II Guidelines 2017)",
    pillarsLinked: "Pillar 5 (Product Governance), Pillar 4 (Suitability)",
  },
  {
    roleNumber: 37,
    roleTitle: "Product Risk and Approval Analyst",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "Head of Product Governance (Role #11)",
    coreResponsibilities:
      "Product risk assessment (conduct, operational, financial, capital); Risk documentation and mitigation planning; Capital and liquidity impact analysis; Regulatory approval and notification coordination; Approval recommendation documentation",
    standardsBasis: "ESMA MiFID II Product Governance, IOSCO Principles, COSO IC",
    keyStandardQuote:
      "Product governance arrangements should ensure products meet the needs of an identified target market. (ESMA Guidelines)",
    pillarsLinked: "Pillar 5 (Product Governance), Pillar 10 (Capital Adequacy)",
  },

  // Regulatory Reporting and Data Governance Domain (5 roles)
  {
    roleNumber: 38,
    roleTitle: "Regulatory Reporting Analyst",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "Head of Regulatory Reporting (Role #12)",
    coreResponsibilities:
      "Regulatory report data preparation and aggregation; Data validation and quality control; Report submission and tracking; Error correction and resubmission procedures; System testing and validation",
    standardsBasis: "SEC Rule 17a-5, FINRA Rule 4524, BCBS 239, ESMA Transaction Reporting",
    keyStandardQuote:
      "A bank should have documented policies and processes governing the production and distribution of risk reports. (BCBS 239 2013)",
    pillarsLinked: "Pillar 14 (Regulatory Reporting)",
  },
  {
    roleNumber: 39,
    roleTitle: "Prudential Risk and Capital Analyst",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "CFO (Role #4) or Head of Risk (Role #6)",
    coreResponsibilities:
      "Capital ratio calculations and monitoring; Liquidity forecasting and monitoring (LCR/NSFR); Prudential reporting inputs and coordination; Risk data aggregation (BCBS 239) support; Stress testing calculations and scenario analysis",
    standardsBasis: "ICAAP/ICARA, BCBS 239, SEC/FINRA Capital Rules, Basel III",
    keyStandardQuote: "Banks should have a sound capital planning process. (BCBS Basel III)",
    pillarsLinked: "Pillars 10 (Capital Adequacy), 5 (RegTech & Data), 14 (Regulatory Reporting)",
  },
  {
    roleNumber: 40,
    roleTitle: "Data Quality Officer / Data Governance Specialist",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "Head of Data & Records Governance (Role #16)",
    coreResponsibilities:
      "Data lineage mapping and documentation; Data quality testing and validation procedures; Metadata management and standards; Data governance policy development; Records retention schedule maintenance; BCBS 239 data quality support",
    standardsBasis: "BCBS 239, ISO 27001/22301, SEC/FINRA Books and Records Rules",
    keyStandardQuote:
      "A bank should design, build and maintain data architecture and IT infrastructure which fully supports its risk data aggregation capabilities. (BCBS 239 2013)",
    pillarsLinked: "Pillars 5 (RegTech & Data), 11 (Record Keeping), 14 (Regulatory Reporting)",
  },
  {
    roleNumber: 41,
    roleTitle: "Treasury and Liquidity Management Specialist",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "CFO (Role #4) or Head of Risk (Role #6)",
    coreResponsibilities:
      "Daily liquidity management and cash positioning; Liquidity forecasting and stress testing; LCR and NSFR monitoring and reporting; Contingency liquidity plans; Liquidity risk monitoring and reporting",
    standardsBasis: "BCBS LCR/NSFR Rules, Central Bank Liquidity Requirements, ICAAP/ICARA",
    keyStandardQuote:
      "Banks should have an adequate liquidity cushion to withstand a range of stress events. (BCBS Liquidity Standards)",
    pillarsLinked: "Pillar 10 (Capital Adequacy and Financial Resilience)",
  },
  {
    roleNumber: 42,
    roleTitle: "Records Management and Archives Officer",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "Head of Data & Records Governance (Role #16)",
    coreResponsibilities:
      "Physical and electronic records storage and retrieval; Retention schedule enforcement; Document destruction and disposal procedures; Records organization and indexing; Access controls for sensitive records",
    standardsBasis: "SEC/FINRA Books and Records Rules, SEC Rule 17a-4, ISO 27001/22301",
    keyStandardQuote: "Every broker or dealer shall preserve records for the periods specified. (SEC Rule 17a-4)",
    pillarsLinked: "Pillar 11 (Record Keeping and Books and Records)",
  },

  // Information Security and Technology Domain (3 roles)
  {
    roleNumber: 43,
    roleTitle: "Information Security Analyst / Cybersecurity Specialist",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CISO (Role #9)",
    coreResponsibilities:
      "Vulnerability assessments and penetration testing; Security incident monitoring and response; Access control management and enforcement; Encryption and data protection implementation; Security patch management and updates; Security awareness training",
    standardsBasis: "ISO 27001, ISO 22301, SOC 2 Trust Services Criteria, BCBS",
    keyStandardQuote:
      "The organization shall establish and maintain information security processes to mitigate risks. (ISO 27001)",
    pillarsLinked: "Pillars 5 (RegTech & Data), 12 (Operational Resilience)",
  },
  {
    roleNumber: 44,
    roleTitle: "GRC Platform and Compliance Technology Manager",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "CCO (Role #7) or IT Director",
    coreResponsibilities:
      "GRC platform administration and maintenance; User access management and provisioning; Data integrity and system validation; Compliance workflow and automation design; Reporting and dashboard development; Integration with business systems",
    standardsBasis: "ISO 27001, SOC 2, BCBS 239",
    keyStandardQuote: "Technology infrastructure should support compliance and risk management processes. (BCBS)",
    pillarsLinked: "Pillar 5 (RegTech & Data), all Pillars (technology enablement)",
  },
  {
    roleNumber: 45,
    roleTitle: "Data Privacy and Security Analyst",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "Data Protection Officer (Role #10) or CISO (Role #9)",
    coreResponsibilities:
      "Data protection compliance monitoring; Privacy impact assessments (DPIA); Privacy policy implementation and testing; Data breach notification procedures; Cross-border data transfer compliance; Regulatory liaison with data protection authorities",
    standardsBasis: "ISO 27001, GDPR, BCBS, SEC/FCA Privacy Expectations",
    keyStandardQuote:
      "Organizations should implement appropriate technical and organizational measures to ensure data protection. (GDPR)",
    pillarsLinked: "Pillar 5 (RegTech & Data), Pillar 11 (Record Keeping)",
  },

  // Operational Resilience and Business Continuity Domain (3 roles)
  {
    roleNumber: 46,
    roleTitle: "Business Continuity Officer",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "COO (Role #3) or CISO (Role #9)",
    coreResponsibilities:
      "Business continuity plan (BCP) development and maintenance; Critical business service identification; Recovery time objective (RTO) and recovery point objective (RPO) definition; Disaster recovery plan (DRP) testing and validation; BCP update and annual refreshes",
    standardsBasis: "ISO 22301, BCBS, FINRA Rule 4370, FCA Operational Resilience PS21/3",
    keyStandardQuote:
      "Organizations should ensure they can continue to deliver critical services through disruptions. (ISO 22301)",
    pillarsLinked: "Pillar 12 (Operational Resilience and Business Continuity)",
  },
  {
    roleNumber: 47,
    roleTitle: "Third-Party / Vendor Risk Officer",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "Head of Outsourcing & Third-Party Risk (Role #13)",
    coreResponsibilities:
      "Vendor onboarding due diligence procedures; Contract negotiation and documentation; SLA definition and enforcement; Vendor performance monitoring and reporting; Vendor incident and breach management; Periodic vendor risk reassessment",
    standardsBasis: "BCBS Outsourcing Principles, ISO 27001/22301, FCA/SEC/ESMA Outsourcing Rules",
    keyStandardQuote:
      "Banks should have a process for managing outsourcing relationships and risks. (BCBS Sound Practices 2011)",
    pillarsLinked: "Pillar 13 (Outsourcing), Pillars 5, 12 (secondary)",
  },
  {
    roleNumber: 48,
    roleTitle: "Crisis Management and Incident Response Coordinator",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "COO or CISO (Role #3 or #9)",
    coreResponsibilities:
      "Crisis communication procedures; Incident escalation and notification; Crisis team coordination and activation; External communication (regulators, clients, media); Post-incident review and documentation; BCP testing coordination",
    standardsBasis: "ISO 22301, BCBS, FINRA Rule 4370",
    keyStandardQuote:
      "Organizations should establish and maintain documented procedures for responding to incidents. (ISO 22301)",
    pillarsLinked: "Pillar 12 (Operational Resilience and Business Continuity)",
  },

  // Training and Competence Domain (2 roles)
  {
    roleNumber: 49,
    roleTitle: "Compliance Training Specialist",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "Head of Training & Competence (Role #17)",
    coreResponsibilities:
      "Training curriculum development and updates; Training delivery scheduling and administration; Training material development and maintenance; Attendee tracking and attestation; Training effectiveness evaluation; Competence assessment coordination",
    standardsBasis: "ISO 37301, ICA Professional Standards, FATF Rec 18, SEC/FINRA/FCA/ESMA Training Rules",
    keyStandardQuote:
      "The organization shall determine the necessary competence of persons and ensure they are competent. (ISO 37301:2021)",
    pillarsLinked: "Pillar 4 (Governance - Culture), all Pillars (training support)",
  },
  {
    roleNumber: 50,
    roleTitle: "Professional Development and Competence Assessment Specialist",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "Head of Training & Competence (Role #17)",
    coreResponsibilities:
      "Competence assessment procedures and testing; Role-based training requirement definition; Credential and qualification verification; Professional development planning (ICA, CFA, etc.); Competence gap identification and closure plans",
    standardsBasis: "ICA Professional Standards, ISO 37301, SEC/FINRA/FCA/ESMA Competence Rules",
    keyStandardQuote: "Firms should assess and maintain the competence of employees. (ICA Professional Standards)",
    pillarsLinked: "Pillar 4 (Governance - Culture)",
  },

  // Internal Audit Domain (2 roles)
  {
    roleNumber: 51,
    roleTitle: "Internal Audit Associate / Audit Specialist",
    lineOfDefence: "THIRD_LINE" as const,
    reportsTo: "Head of Internal Audit / CAE (Role #18)",
    coreResponsibilities:
      "Control testing execution; Audit workpaper preparation and documentation; Audit evidence gathering; Findings documentation; Management action plan tracking; Recommendation follow-up verification",
    standardsBasis: "COSO IC, ISAE 3000, IIA IPPF",
    keyStandardQuote: "Internal auditing provides independent assurance over an organization's operations. (IIA IPPF)",
    pillarsLinked: "Pillar 17 (Internal Audit), all Pillars (assurance)",
  },
  {
    roleNumber: 52,
    roleTitle: "Audit Coordinator / Audit Administration",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "Head of Internal Audit / CAE (Role #18)",
    coreResponsibilities:
      "Audit scheduling and logistics; Audit plan development support; Workpaper file organization; Findings tracking and reporting; Management action plan follow-up; Audit documentation and records",
    standardsBasis: "IIA IPPF, COSO IC",
    keyStandardQuote:
      "The internal audit activity must evaluate and contribute to the improvement of governance, risk management, and control processes. (IIA IPPF)",
    pillarsLinked: "Pillar 17 (Internal Audit)",
  },

  // Regulatory Affairs and Change Management Domain (2 roles)
  {
    roleNumber: 53,
    roleTitle: "Regulatory Intelligence and Horizon Scanning Analyst",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "Head of Regulatory Affairs (Role #14)",
    coreResponsibilities:
      "Regulatory horizon scanning and new-rule monitoring; Regulatory change tracking and documentation; Impact assessment preliminary analysis; Regulatory source monitoring (Federal Register, FCA updates, etc.); Alert distribution to relevant stakeholders",
    standardsBasis: "ISO 37301 (Change Management), BCBS, FCA/SEC/ESMA Governance",
    keyStandardQuote:
      "The organization shall monitor changes to compliance obligations and determine how they apply. (ISO 37301:2021)",
    pillarsLinked: "Pillar 18 (Regulatory Engagement and Change Management)",
  },
  {
    roleNumber: 54,
    roleTitle: "Regulatory Change Implementation Coordinator",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "Head of Regulatory Affairs (Role #14)",
    coreResponsibilities:
      "Regulatory change project management; Impact assessment and gap analysis; Implementation plan development and coordination; Cross-functional stakeholder coordination; Implementation timeline and milestone tracking; Compliance testing and validation",
    standardsBasis: "ISO 37301 (Change Management), COSO IC, BCBS",
    keyStandardQuote: "Organizations should have processes to implement changes to compliance obligations. (ISO 37301)",
    pillarsLinked: "Pillar 18 (Regulatory Engagement and Change Management)",
  },

  // Complaints Handling Domain (2 roles)
  {
    roleNumber: 55,
    roleTitle: "Complaints Handler / Complaints Investigator",
    lineOfDefence: "FIRST_LINE" as const,
    reportsTo: "Head of Client Complaints & Outcomes (Role #15)",
    coreResponsibilities:
      "Complaint receipt and initial triage; Investigation coordination and execution; Root cause analysis; Client communication and updates; Remediation and compensation processing; File documentation and closure",
    standardsBasis: "FCA DISP, SEC/FINRA Customer Complaint Rules, ESMA MiFID II Complaints",
    keyStandardQuote:
      "A firm must have in place and operate appropriate and effective internal complaints handling procedures. (FCA DISP 1.3)",
    pillarsLinked: "Pillar 15 (Complaints Handling and Client Outcomes)",
  },
  {
    roleNumber: 56,
    roleTitle: "Complaints Administrator and Statistical Reporter",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "Head of Client Complaints & Outcomes (Role #15)",
    coreResponsibilities:
      "Complaint intake and logging; Complaint acknowledgment letter preparation; File management and tracking; Statistical analysis and trends reporting; Management reporting and dashboards; Regulatory reporting on complaints",
    standardsBasis: "FCA DISP, SEC/FINRA Complaint Rules, ESMA Complaints",
    keyStandardQuote: "Management must receive regular reports on the volume and nature of complaints. (FCA DISP 1.3)",
    pillarsLinked: "Pillar 15 (Complaints Handling and Client Outcomes)",
  },

  // Licensing and Registration Domain (1 role)
  {
    roleNumber: 57,
    roleTitle: "Licensing and Registration Officer",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CCO (Role #7) or General Counsel (Role #5)",
    coreResponsibilities:
      "Firm registration and license maintenance; Individual registration and qualification management; License renewal tracking and application; License condition compliance monitoring; Registration update and amendment coordination; Regulatory filing and submission",
    standardsBasis: "SEC/FINRA/FCA/ESMA Registration and Licensing Rules, IOSCO Principles",
    keyStandardQuote:
      "Countries should have clear and objective criteria for licensing regulated entities. (IOSCO Principles)",
    pillarsLinked: "Pillar 2 (Licensing and Registration)",
  },

  // Compliance Support and Administrative Domain (5 roles)
  {
    roleNumber: 58,
    roleTitle: "Compliance Coordinator / Compliance Administrative Support",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "CCO (Role #7) or Compliance Officer",
    coreResponsibilities:
      "Compliance documentation filing and organization; Policy library maintenance and version control; Committee meeting scheduling and minutes; Evidence archiving and retrieval; Compliance reporting support; Administrative task coordination",
    standardsBasis: "COSO IC, ISO 37301",
    keyStandardQuote:
      "The organization shall establish, implement and maintain a compliance management system. (ISO 37301:2021)",
    pillarsLinked: "All 18 Pillars (administrative support)",
  },
  {
    roleNumber: 59,
    roleTitle: "Compliance Policy and Procedures Specialist",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "CCO (Role #7)",
    coreResponsibilities:
      "Policy documentation and drafting; Policy approval workflow management; Policy distribution and training coordination; Version control and policy archiving; Policy effectiveness review and updates; Procedure development and documentation",
    standardsBasis: "COSO IC, ISO 37301, BCBS",
    keyStandardQuote: "Organizations should document compliance obligations and related processes. (ISO 37301)",
    pillarsLinked: "All 18 Pillars (policy governance)",
  },
  {
    roleNumber: 60,
    roleTitle: "Governance and Board Support Coordinator",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "Company Secretary (Role #19) or Board Administrator",
    coreResponsibilities:
      "Board packet and agenda preparation; Committee materials coordination; Board meeting logistics and scheduling; Governance documentation maintenance; Board portal administration; Board minutes and records",
    standardsBasis: "OECD Corporate Governance, COSO IC",
    keyStandardQuote:
      "The governance framework should ensure strategic guidance of the company. (OECD Principles 2015)",
    pillarsLinked: "Pillar 1 (Governance)",
  },
  {
    roleNumber: 61,
    roleTitle: "Regulatory Change Tracking and Documentation Specialist",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "Head of Regulatory Affairs (Role #14)",
    coreResponsibilities:
      "Regulatory source document collection and filing; Change tracking database maintenance; Regulatory requirement documentation; Implementation tracking and documentation; Compliance verification documentation; Regulatory correspondence filing",
    standardsBasis: "ISO 37301 (Change Management), BCBS",
    keyStandardQuote: "Organizations should monitor and track changes to compliance obligations. (ISO 37301)",
    pillarsLinked: "Pillar 18 (Regulatory Engagement and Change Management)",
  },
  {
    roleNumber: 62,
    roleTitle: "Compliance Metrics and Dashboard Manager",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "CCO (Role #7)",
    coreResponsibilities:
      "Compliance metrics definition and calculation; Compliance dashboard development and maintenance; Management reporting and analytics; Compliance KPI tracking and trending; Board and management reporting; Data quality assurance for compliance metrics",
    standardsBasis: "ISO 37301, BCBS",
    keyStandardQuote: "Organizations should monitor and measure compliance performance. (ISO 37301)",
    pillarsLinked: "All 18 Pillars (compliance oversight metrics)",
  },

  // Optional/Specialized Roles (5 additional roles for larger firms)
  {
    roleNumber: 63,
    roleTitle: "Financial Crime Investigation Specialist",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "MLRO (Role #8)",
    coreResponsibilities:
      "Complex financial crime investigations; Sanctions violation investigations; AML program violation investigations; Evidence gathering and documentation; Regulatory reporting on investigations",
    standardsBasis: "FATF Recommendations, SEC/FINRA/FCA/ESMA AML Rules",
    keyStandardQuote:
      "Financial institutions should have procedures to detect and report suspicious activities. (FATF)",
    pillarsLinked: "Pillar 8 (Financial Crime)",
  },
  {
    roleNumber: 64,
    roleTitle: "Compliance Culture and Tone Measurement Specialist",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CCO or Head of HR",
    coreResponsibilities:
      "Culture survey design and execution; Tone-from-the-top measurement; Conduct culture assessment and improvement; Culture metrics and reporting; Behavioral risk identification",
    standardsBasis: "FCA Principles, BCBS Corporate Governance, ISO 37301",
    keyStandardQuote: "The board and senior management should foster a culture of compliance. (BCBS Compliance 2005)",
    pillarsLinked: "Pillar 4 (Governance - Culture)",
  },
  {
    roleNumber: 65,
    roleTitle: "GRC Systems Architect",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "CCO or CTO",
    coreResponsibilities:
      "GRC platform design and implementation; Integration architecture; Reporting framework design; System optimization and performance; Technology roadmap development",
    standardsBasis: "ISO 27001, SOC 2, BCBS 239",
    keyStandardQuote: "Technology should support governance, risk and compliance processes. (BCBS)",
    pillarsLinked: "Pillar 5 (RegTech & Data)",
  },
  {
    roleNumber: 66,
    roleTitle: "Regulatory Intelligence Technology Manager",
    lineOfDefence: "SUPPORT" as const,
    reportsTo: "Head of Regulatory Affairs (Role #14)",
    coreResponsibilities:
      "Regulatory change tracking systems; Automated alerts and monitoring; Regulatory source integration; Technology platform management; AI/ML regulatory monitoring tools",
    standardsBasis: "ISO 37301, BCBS",
    keyStandardQuote: "Organizations should use appropriate technology to monitor compliance obligations. (ISO 37301)",
    pillarsLinked: "Pillar 18 (Regulatory Engagement)",
  },
  {
    roleNumber: 67,
    roleTitle: "Specialized Compliance Counsel / Associate General Counsel",
    lineOfDefence: "SECOND_LINE" as const,
    reportsTo: "CLO (Role #5)",
    coreResponsibilities:
      "Compliance-specific legal advice; Regulatory examination response coordination; Compliance litigation support; Legal interpretation of regulatory requirements; Enforcement action management",
    standardsBasis: "SEC/FINRA/FCA/ESMA, IOSCO Principles",
    keyStandardQuote: "Legal support is essential for compliance program effectiveness. (IOSCO)",
    pillarsLinked: "All 18 Pillars (legal support)",
  },
]

export function generateDefaultRoles(): Role[] {
  return CLHEAR_67_ROLES.map((role) => ({
    roleId: `role-${role.roleNumber}`,
    roleNumber: role.roleNumber,
    roleTitle: role.roleTitle,
    lineOfDefence: role.lineOfDefence,
    reportsTo: role.reportsTo,
    coreResponsibilities: role.coreResponsibilities,
    standardsBasis: role.standardsBasis,
    keyStandardQuote: role.keyStandardQuote,
    pillarsLinked: role.pillarsLinked,
    personAssignedId: null,
    status: "VACANT" as RoleStatus,
  }))
}
