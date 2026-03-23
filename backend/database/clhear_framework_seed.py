"""
Seed CLHEAR reference data (7 verticals, 18 pillars, regulators, 22 standards, 39 roles, 20 governance bodies).
Idempotent: safe to run multiple times.
"""
from __future__ import annotations

import uuid
from sqlalchemy import text

_NS = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")


def role_uuid(role_number: int) -> str:
    return str(uuid.uuid5(_NS, f"clhear-role-{role_number}"))


VERTICALS = [
    (1, "Company Profile", "Legal entities, licenses, jurisdictions, ownership, board committees, senior management roles, CCO mandate."),
    (2, "Business Activities", "Products, services, client segments, geographies, distribution channels, regulatory taxonomies."),
    (3, "Obligations & Risk", "Regulatory obligation register with citations, interpretations, applicability, control mapping, risk scoring."),
    (4, "Governance", "CCO independence, committee structures, policy framework, cultural governance."),
    (5, "RegTech & Data", "Surveillance, screening, archiving, case management, data lineage, vendor management."),
    (6, "Standard Operating Procedures", "Workflows: triggers, roles, actions, decision points, SLAs, documentation."),
    (7, "Assurance & Remediation", "Monitoring, testing, issue logging, CAPA management, training, board reporting."),
]

# pillar_number, vertical_id (1-7), name, description
PILLARS = [
    (1, 4, "Governance and Organizational Structure", "Accountability at board, senior management, and functional levels; CCO role; committee architecture."),
    (2, 1, "Licensing and Registration", "Firm and individual registration with regulators (SEC, FINRA, FCA)."),
    (3, 1, "Client Onboarding, KYC, and CIP", "Customer identification, verification, risk and suitability assessment."),
    (4, 2, "Suitability and Best Interest", "Reg BI, suitability, conflicts disclosure, diligence on customer financial situation."),
    (5, 2, "Product Governance and Approval", "New product approval, target market, risk assessment, infrastructure readiness."),
    (6, 2, "Conduct of Business and Conflicts of Interest", "Code of conduct, material conflicts, escalation and management."),
    (7, 2, "Market Conduct and Trading Controls", "Fair and orderly markets, surveillance, insider trading, best execution."),
    (8, 3, "Financial Crime and Sanctions", "AML, sanctions screening, beneficial ownership, SAR filing, transaction monitoring."),
    (9, 2, "Communications and Marketing Compliance", "Oversight of customer communications, marketing, advertisements, digital channels."),
    (10, 3, "Capital Adequacy and Financial Resilience", "Net capital, liquidity, reporting of capital levels."),
    (11, 5, "Record Keeping and Books and Records", "Comprehensive records, retention, trade and customer account records."),
    (12, 5, "Operational Resilience and Business Continuity", "Critical services during disruptions, continuity planning."),
    (13, 5, "Outsourcing and Third Party Risk Management", "Vendor due diligence, contracting, ongoing monitoring."),
    (14, 3, "Regulatory Reporting and Disclosures", "SEC/FINRA filings, transaction reporting, AML/CFT reporting."),
    (15, 7, "Complaints Handling and Client Outcomes", "Receipt, investigation, resolution, root cause analysis."),
    (16, 4, "Internal Controls and Compliance Monitoring", "First and second line monitoring, behavior vs. policies."),
    (17, 7, "Internal Audit and Independent Review", "Third line assurance, periodic audits, control design assessment."),
    (18, 7, "Regulatory Engagement and Change Management", "Regulator relationships, response to regulatory change."),
]

REGULATORS = [
    ("FINRA", "FINRA", "United States", "https://www.finra.org", "live", '{"pipeline":"finra_scrape"}'),
    ("FCA", "Financial Conduct Authority", "United Kingdom", "https://www.fca.org.uk", "static", "{}"),
    ("SEC", "Securities and Exchange Commission", "United States", "https://www.sec.gov", "none", "{}"),
    ("ESMA", "European Securities and Markets Authority", "EU", "https://www.esma.europa.eu", "none", "{}"),
]

# code, name, category, primary_focus, clhear_relevance, sort_order
STANDARDS = [
    ("SEC", "SEC – Securities and Exchange Commission", "regulatory", "US broker-dealer and investment adviser regulation", "Core US conduct, market, disclosure, capital and program rules", 1),
    ("FINRA", "FINRA – Financial Industry Regulatory Authority", "regulatory", "US broker-dealer rules and examinations", "Supervision, WSPs, testing, best execution", 2),
    ("ESMA", "ESMA – European Securities and Markets Authority", "regulatory", "EU MiFID II/MiFIR standards", "Activity classifications, conduct rules, technical standards", 3),
    ("FCA", "FCA – Financial Conduct Authority", "regulatory", "UK conduct regulation", "Principles for Businesses, SM&CR, SYSC governance", 4),
    ("IOSCO", "IOSCO – International Organization of Securities Commissions", "regulatory", "Global securities regulation principles", "High-level principles for markets and intermediaries", 5),
    ("OECD", "OECD – Organisation for Economic Co-operation and Development", "governance_risk", "Corporate governance standards", "G20/OECD Principles of Corporate Governance", 6),
    ("COSO", "COSO – Committee of Sponsoring Organizations", "governance_risk", "Internal control and enterprise risk management", "Internal Control and ERM frameworks, three-lines model", 7),
    ("IIA", "IIA – Institute of Internal Auditors", "governance_risk", "Internal audit standards and practices", "IPPF framework and Definition of Internal Auditing", 8),
    ("BCBS", "BCBS – Basel Committee on Banking Supervision", "governance_risk", "Banking supervision and risk data", "Compliance function principles and BCBS 239", 9),
    ("ISO_37301", "ISO 37001 – Compliance Management Systems", "international", "Compliance management systems", "Requirements to establish and improve CMS", 10),
    ("ISO_31000", "ISO 31000 – Risk Management", "international", "Risk management principles and guidelines", "Common framework for risk identification and treatment", 11),
    ("ISO_27001", "ISO 27001 – Information Security Management", "international", "Information security management", "Confidentiality, integrity, availability", 12),
    ("ISO_22301", "ISO 22301 – Business Continuity Management", "international", "Business continuity and resilience", "Critical services and continuity planning", 13),
    ("FATF", "FATF – Financial Action Task Force", "financial_crime", "AML/CFT global standard setting", "The 40 Recommendations on AML/CFT and sanctions", 14),
    ("WOLFSBERG", "Wolfsberg Group", "financial_crime", "Banking AML and sanctions best practice", "Industry guidance on financial crime controls", 15),
    ("SOC2", "AICPA (SOC 2) – American Institute of CPAs", "tech_assurance", "Assurance over service providers and SaaS", "SOC 2 trust services criteria for RegTech vendors", 16),
    ("ISAE3000", "ISAE 3000 – Assurance Engagements", "tech_assurance", "Assurance on non-financial information", "Methodology for assurance over controls and culture", 17),
    ("G30", "G30 – Group of Thirty", "tech_assurance", "Financial stability and market infrastructures", "Systemic risk and infrastructure recommendations", 18),
    ("ICAAP", "ICAAP / ICARA – Internal Capital Assessment", "governance_risk", "Internal capital and risk assessment", "Linking compliance risk into capital planning", 19),
    ("AGILE", "Agile Alliance", "operational", "Agile and iterative delivery practices", "Iterative design and evolution", 20),
    ("BABOK", "IIBA (BABOK) – International Institute of Business Analysis", "operational", "Business analysis and requirements", "Process mapping and workflow design", 21),
    ("ICA", "ICA – International Compliance Association", "professional", "Compliance profession standards", "Competence and ethics benchmarks", 22),
]

# role_number, title, line_of_defence, reports_to, tier
ROLES = [
    (1, "Chief Executive Officer (CEO)", "first", "Board", "senior"),
    (2, "Chief Operating Officer (COO)", "first", "CEO", "senior"),
    (3, "Chief Financial Officer (CFO)", "first", "CEO", "senior"),
    (4, "Chief Legal Officer / General Counsel", "second", "CEO / Board", "senior"),
    (5, "Chief Risk Officer / Head of Risk", "second", "CEO / Board", "senior"),
    (6, "Chief Compliance Officer (CCO)", "second", "CEO / Board", "senior"),
    (7, "Money Laundering Reporting Officer (MLRO)", "second", "CEO / CCO", "senior"),
    (8, "Chief Information Security Officer (CISO)", "second", "CEO / Board", "senior"),
    (9, "Data Protection Officer (DPO)", "second", "CEO / Legal", "senior"),
    (10, "Head of Product Governance", "first", "CEO / CCO", "senior"),
    (11, "Head of Regulatory Reporting", "first", "CFO / Risk", "senior"),
    (12, "Head of Outsourcing & Third-Party Risk", "second", "CEO / CCO", "senior"),
    (13, "Head of Regulatory Affairs", "second", "CEO / CCO", "senior"),
    (14, "Head of Client Complaints", "first", "CCO / Risk", "senior"),
    (15, "Head of Data & Records Governance", "second", "CISO / CFO", "senior"),
    (16, "Head of Training & Competence", "second", "CCO / HR", "senior"),
    (17, "Head of Internal Audit / CAE", "third", "Board / Audit Committee", "senior"),
    (18, "Company Secretary / Governance Officer", "support", "CEO / Board", "senior"),
    (19, "Compliance Officer / Analyst", "second", "CCO", "execution"),
    (20, "AML Officer / Specialist", "second", "MLRO", "execution"),
    (21, "Sanctions & Screening Specialist", "second", "MLRO", "execution"),
    (22, "KYC / Customer Onboarding Specialist", "second", "MLRO / Compliance", "execution"),
    (23, "Market Surveillance Officer", "second", "CCO", "execution"),
    (24, "Conflicts of Interest Officer", "second", "Compliance Officer", "execution"),
    (25, "Product Governance Specialist", "first", "Head of Product Governance", "execution"),
    (26, "Communications & Marketing Compliance", "second", "CCO", "execution"),
    (27, "Regulatory Reporting Analyst", "first", "Head of Regulatory Reporting", "execution"),
    (28, "Prudential Risk & Capital Analyst", "first", "CFO / Risk", "execution"),
    (29, "Complaints Handler / Client Outcomes", "first", "Head of Complaints", "execution"),
    (30, "Information Security Analyst", "second", "CISO", "execution"),
    (31, "Data Quality Officer", "second", "Head of Data Governance", "execution"),
    (32, "Vendor Risk Officer", "second", "Head of Outsourcing", "execution"),
    (33, "Business Continuity Officer", "first_second", "COO / CISO", "execution"),
    (34, "Training Coordinator", "support", "Head of Training", "execution"),
    (35, "Regulatory Change Analyst", "second", "Head of Regulatory Affairs", "execution"),
    (36, "Internal Audit Associate", "third", "CAE", "execution"),
    (37, "Licensing & Registration Officer", "second_support", "CCO / General Counsel", "support"),
    (38, "Compliance Coordinator / Admin Support", "support", "CCO / Compliance Officer", "support"),
    (39, "Regulatory Correspondence Specialist", "support", "CCO / General Counsel", "support"),
]

# body_number, name, tier, chair_role_number (nullable), meeting_frequency, description, key_standards
GOVERNANCE_BODIES = [
    (1, "Board of Directors", "board", None, "Quarterly (minimum)", "Oversees all pillars at the apex level.", "OECD, COSO, ISO 37301, BCBS"),
    (2, "Board Audit Committee", "board", 17, "Quarterly (minimum)", "Financial reporting and internal controls.", "COSO, OECD, FCA/SEC, SOX Section 301"),
    (3, "Board Risk Committee", "board", 5, "Quarterly (minimum)", "Enterprise risk oversight.", "COSO ERM, BCBS, ISO 31000, ICAAP/ICARA"),
    (4, "Board Compliance and Conduct Committee", "board", 6, "Quarterly (minimum)", "Compliance culture and conduct risk.", "BCBS, ISO 37301, FCA Principles, SEC/FINRA"),
    (5, "Board Remuneration / Compensation Committee", "board", None, "Annually (minimum)", "Executive compensation alignment.", "OECD, FCA Remuneration Code, SEC/FINRA, BCBS"),
    (6, "Executive Committee (ExCo)", "senior_management", 1, "Weekly or Bi-Weekly", "Strategic and operational decisions.", "COSO, ISO 37301, BCBS, FCA/SEC/ESMA"),
    (7, "Enterprise Risk Management Committee", "senior_management", 5, "Monthly", "ERM framework and risk appetite.", "COSO ERM, ISO 31000, BCBS, ICAAP/ICARA"),
    (8, "Compliance Management Committee", "senior_management", 6, "Monthly", "Compliance program oversight.", "ISO 37301, BCBS, SEC/FINRA/FCA/ESMA"),
    (9, "Financial Crime and AML Committee", "senior_management", 7, "Monthly", "AML and financial crime program.", "FATF Rec 18, Wolfsberg, BCBS, SEC/FINRA/FCA"),
    (10, "Product Governance and Approval Committee", "senior_management", 10, "Monthly (or per product launch)", "New product approvals.", "ESMA/FCA MiFID II, SEC Reg BI, FINRA"),
    (11, "Conduct and Conflicts Committee", "senior_management", 6, "Quarterly", "Conduct risk and conflicts management.", "FCA Principles, ESMA MiFID II, SEC/FINRA, IOSCO"),
    (12, "Operational Resilience and Business Continuity Committee", "senior_management", 2, "Quarterly", "Resilience and BCP.", "ISO 22301, BCBS, FCA PS21/3, FINRA Rule 4370"),
    (13, "Information Security and Cyber Risk Committee", "senior_management", 8, "Monthly", "Cyber and information security.", "ISO 27001, ISO 22301, BCBS, SOC 2"),
    (14, "Data Governance and Quality Committee", "senior_management", 15, "Quarterly", "Data quality and BCBS 239.", "BCBS 239, ISO 27001, SEC/FINRA Books & Records"),
    (15, "Regulatory Change Steering Committee", "senior_management", 13, "Monthly", "Regulatory horizon scanning and implementation.", "ISO 37301, BCBS, FCA/SEC/ESMA"),
    (16, "Outsourcing and Vendor Risk Forum", "senior_management", 12, "Quarterly", "Third-party risk management.", "BCBS, ISO 27001/22301, EBA Guidelines, FCA/SEC/ESMA"),
    (17, "Training and Competence Forum", "working_level", 16, "Quarterly", "Training and competence across the firm.", "ICA, ISO 37301, FATF Rec 18, SEC/FINRA/FCA/ESMA"),
    (18, "Regulatory Reporting and Disclosure Forum", "working_level", 11, "Monthly", "Regulatory filings accuracy and timeliness.", "SEC/FINRA/ESMA/FCA, BCBS 239, MiFID II"),
    (19, "Client Complaints Review Forum", "working_level", 14, "Monthly", "Complaints trends and remediation.", "FCA DISP, SEC/FINRA, ESMA MiFID II"),
    (20, "Market Surveillance and Trading Controls Forum", "working_level", 23, "Weekly or Bi-Weekly", "Trading surveillance and market conduct.", "SEC Rule 15c3-5, FINRA Rule 5310, ESMA MiFID II, IOSCO"),
]


def run_clhear_seed(engine) -> dict:
    """Insert reference data. Returns counts."""
    counts = {"verticals": 0, "pillars": 0, "regulators": 0, "standards": 0, "roles": 0, "governance": 0, "maps": 0}
    with engine.connect() as conn:
        for vn, name, desc in VERTICALS:
            conn.execute(
                text(
                    """
                    INSERT INTO verticals (vertical_number, name, description)
                    VALUES (:vn, :name, :desc)
                    ON CONFLICT (vertical_number) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
                    """
                ),
                {"vn": vn, "name": name, "desc": desc},
            )
            counts["verticals"] += 1
        conn.commit()

    with engine.connect() as conn:
        vmap = {
            row[0]: row[1]
            for row in conn.execute(text("SELECT vertical_number, id FROM verticals")).fetchall()
        }
        for pn, vnum, name, desc in PILLARS:
            vid = vmap.get(vnum)
            if not vid:
                continue
            conn.execute(
                text(
                    """
                    INSERT INTO pillars (pillar_number, vertical_id, name, description)
                    VALUES (:pn, :vid, :name, :desc)
                    ON CONFLICT (pillar_number) DO UPDATE SET
                      vertical_id = EXCLUDED.vertical_id, name = EXCLUDED.name, description = EXCLUDED.description
                    """
                ),
                {"pn": pn, "vid": vid, "name": name, "desc": desc},
            )
            counts["pillars"] += 1
        conn.commit()

    with engine.connect() as conn:
        for code, name, jur, web, stype, cfg in REGULATORS:
            conn.execute(
                text(
                    """
                    INSERT INTO regulators (code, name, jurisdiction, website, scraper_type, scraper_config)
                    VALUES (:code, :name, :jur, :web, :stype, CAST(:cfg AS jsonb))
                    ON CONFLICT (code) DO UPDATE SET
                      name = EXCLUDED.name, jurisdiction = EXCLUDED.jurisdiction, website = EXCLUDED.website,
                      scraper_type = EXCLUDED.scraper_type, scraper_config = EXCLUDED.scraper_config
                    """
                ),
                {"code": code, "name": name, "jur": jur, "web": web, "stype": stype, "cfg": cfg},
            )
            counts["regulators"] += 1
        conn.commit()

    with engine.connect() as conn:
        for code, name, cat, focus, rel, so in STANDARDS:
            conn.execute(
                text(
                    """
                    INSERT INTO reference_standards (code, name, category, primary_focus, clhear_relevance, sort_order)
                    VALUES (:code, :name, :cat, :focus, :rel, :so)
                    ON CONFLICT (code) DO UPDATE SET
                      name = EXCLUDED.name, category = EXCLUDED.category, primary_focus = EXCLUDED.primary_focus,
                      clhear_relevance = EXCLUDED.clhear_relevance, sort_order = EXCLUDED.sort_order
                    """
                ),
                {"code": code, "name": name, "cat": cat, "focus": focus, "rel": rel, "so": so},
            )
            counts["standards"] += 1
        conn.commit()

    with engine.connect() as conn:
        for rn, title, lod, rpt, tier in ROLES:
            rid = role_uuid(rn)
            conn.execute(
                text(
                    """
                    INSERT INTO compliance_roles (id, role_number, title, line_of_defence, reports_to, tier)
                    VALUES (CAST(:id AS uuid), :rn, :title, :lod, :rpt, :tier)
                    ON CONFLICT (role_number) DO UPDATE SET
                      title = EXCLUDED.title, line_of_defence = EXCLUDED.line_of_defence,
                      reports_to = EXCLUDED.reports_to, tier = EXCLUDED.tier
                    """
                ),
                {"id": rid, "rn": rn, "title": title, "lod": lod, "rpt": rpt, "tier": tier},
            )
            counts["roles"] += 1
        conn.commit()

    # CCO covers all pillars
    with engine.connect() as conn:
        cco_id = conn.execute(text("SELECT id FROM compliance_roles WHERE role_number = 6")).scalar()
        if cco_id:
            for pn in range(1, 19):
                conn.execute(
                    text(
                        """
                        INSERT INTO role_pillar_map (role_id, pillar_number)
                        VALUES (CAST(:rid AS uuid), :pn)
                        ON CONFLICT DO NOTHING
                        """
                    ),
                    {"rid": str(cco_id), "pn": pn},
                )
                counts["maps"] += 1
        mlro_id = conn.execute(text("SELECT id FROM compliance_roles WHERE role_number = 7")).scalar()
        if mlro_id:
            for pn in (3, 8):
                conn.execute(
                    text(
                        "INSERT INTO role_pillar_map (role_id, pillar_number) VALUES (CAST(:rid AS uuid), :pn) ON CONFLICT DO NOTHING"
                    ),
                    {"rid": str(mlro_id), "pn": pn},
                )
        conn.commit()

    with engine.connect() as conn:
        for bn, name, tier, chair_rn, freq, desc, ks in GOVERNANCE_BODIES:
            chair_id = None
            if chair_rn is not None:
                row = conn.execute(
                    text("SELECT id FROM compliance_roles WHERE role_number = :rn"),
                    {"rn": chair_rn},
                ).fetchone()
                chair_id = str(row[0]) if row else None
            conn.execute(
                text(
                    """
                    INSERT INTO governance_bodies (body_number, name, tier, chair_role_id, meeting_frequency, description, key_standards)
                    VALUES (:bn, :name, :tier, CAST(:chair AS uuid), :freq, :desc, :ks)
                    ON CONFLICT (body_number) DO UPDATE SET
                      name = EXCLUDED.name, tier = EXCLUDED.tier, chair_role_id = EXCLUDED.chair_role_id,
                      meeting_frequency = EXCLUDED.meeting_frequency, description = EXCLUDED.description, key_standards = EXCLUDED.key_standards
                    """
                ),
                {"bn": bn, "name": name, "tier": tier, "chair": chair_id, "freq": freq, "desc": desc, "ks": ks},
            )
            counts["governance"] += 1
        conn.commit()

    # Governance pillar map from whitepaper examples (Board Audit -> 1,10,14,17 etc.) — minimal seed
    _gov_pillar_examples = [
        (2, [1, 10, 14, 17]),
        (3, [8, 10]),
        (4, [5]),
        (9, [7]),
    ]
    with engine.connect() as conn:
        for body_num, pnums in _gov_pillar_examples:
            row = conn.execute(
                text("SELECT id FROM governance_bodies WHERE body_number = :bn"),
                {"bn": body_num},
            ).fetchone()
            if not row:
                continue
            gid = str(row[0])
            for pn in pnums:
                conn.execute(
                    text(
                        """
                        INSERT INTO governance_pillar_map (governance_body_id, pillar_number)
                        VALUES (CAST(:gid AS uuid), :pn)
                        ON CONFLICT DO NOTHING
                        """
                    ),
                    {"gid": gid, "pn": pn},
                )
        conn.commit()

    # Backfill regulator_id on existing rows
    with engine.connect() as conn:
        conn.execute(
            text(
                """
                UPDATE regulatory_sources rs
                SET regulator_id = r.id
                FROM regulators r
                WHERE rs.regulator = r.code AND rs.regulator_id IS NULL
                """
            )
        )
        conn.execute(
            text(
                """
                UPDATE regulatory_items ri
                SET regulator_id = r.id
                FROM regulators r
                WHERE ri.regulator = r.code AND ri.regulator_id IS NULL
                """
            )
        )
        conn.execute(
            text(
                """
                UPDATE regulatory_obligations ro
                SET regulator_id = r.id
                FROM regulators r
                WHERE ro.regulator = r.code AND ro.regulator_id IS NULL
                """
            )
        )
        conn.execute(
            text(
                """
                UPDATE regulatory_news rn
                SET regulator_id = r.id
                FROM regulators r
                WHERE rn.regulator = r.code AND rn.regulator_id IS NULL
                """
            )
        )
        conn.commit()

    return counts


if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    from sqlalchemy import create_engine

    load_dotenv()
    eng = create_engine(os.getenv("DATABASE_URL", "postgresql://clhear_user:dev123@localhost:5432/clhear"))
    print(run_clhear_seed(eng))
