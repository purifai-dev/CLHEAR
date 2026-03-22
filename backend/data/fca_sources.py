"""
CLHEAR - FCA (Financial Conduct Authority) Regulatory Source Texts
Key FCA Handbook modules for loading into regulatory_sources table.

The FCA Handbook (https://www.handbook.fca.org.uk/) is organized into blocks:
  - High Level Standards (PRIN, SYSC, COCON, COND, APER, GEN, FEES)
  - Prudential Standards (GENPRU, BIPRU, IFPRU, MIFIDPRU)
  - Business Standards (COBS, ICOBS, MCOB, BCOBS)
  - Regulatory Processes (SUP, AUTH, DEPP, EG)
  - Redress (DISP, COMP)
  - Specialist Sourcebooks (CASS, COLL, FUND)

Each entry represents a key FCA rule/chapter with its regulatory text.
Source: FCA Handbook (https://www.handbook.fca.org.uk/)
"""

FCA_SOURCES = [
    # =========================================================================
    # PRIN — Principles for Businesses (High Level Standards)
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "PRIN",
        "series_title": "Principles for Businesses",
        "rule_number": "PRIN-2.1",
        "rule_title": "The Principles",
        "source_url": "https://www.handbook.fca.org.uk/handbook/PRIN/2/1.html",
        "raw_text": (
            "PRIN 2.1 — The Principles\n\n"
            "1. Integrity — A firm must conduct its business with integrity.\n\n"
            "2. Skill, care and diligence — A firm must conduct its business with due skill, care "
            "and diligence.\n\n"
            "3. Management and control — A firm must take reasonable care to organise and control its "
            "affairs responsibly and effectively, with adequate risk management systems.\n\n"
            "4. Financial prudence — A firm must maintain adequate financial resources.\n\n"
            "5. Market conduct — A firm must observe proper standards of market conduct.\n\n"
            "6. Customers' interests — A firm must pay due regard to the interests of its customers "
            "and treat them fairly.\n\n"
            "7. Communications with clients — A firm must pay due regard to the information needs of "
            "its clients, and communicate information to them in a way which is clear, fair and not "
            "misleading.\n\n"
            "8. Conflicts of interest — A firm must manage conflicts of interest fairly, both between "
            "itself and its customers and between a customer and another client.\n\n"
            "9. Customers: relationships of trust — A firm must take reasonable care to ensure the "
            "suitability of its advice and discretionary decisions for any customer who is entitled "
            "to rely upon its judgment.\n\n"
            "10. Clients' assets — A firm must arrange adequate protection for clients' assets when "
            "it is responsible for them.\n\n"
            "11. Relations with regulators — A firm must deal with its regulators in an open and "
            "cooperative way, and must disclose to the FCA appropriately anything relating to the firm "
            "of which that regulator would reasonably expect notice.\n\n"
            "12. Consumer Duty — A firm must act to deliver good outcomes for retail customers."
        ),
    },
    {
        "regulator": "FCA",
        "series": "PRIN",
        "series_title": "Principles for Businesses",
        "rule_number": "PRIN-2A",
        "rule_title": "The Consumer Duty",
        "source_url": "https://www.handbook.fca.org.uk/handbook/PRIN/2A.html",
        "raw_text": (
            "PRIN 2A — The Consumer Duty\n\n"
            "2A.1 Application and Purpose\n"
            "The Consumer Duty (Principle 12) requires firms to act to deliver good outcomes for "
            "retail customers. It sets higher and clearer standards of consumer protection across "
            "financial services and requires firms to put their customers' needs first.\n\n"
            "2A.2 The Cross-Cutting Rules\n"
            "(1) A firm must act in good faith towards retail customers.\n"
            "(2) A firm must avoid causing foreseeable harm to retail customers.\n"
            "(3) A firm must enable and support retail customers to pursue their financial objectives.\n\n"
            "2A.3 The Four Outcomes\n"
            "The Duty is built around four outcomes that firms should aim to achieve:\n"
            "(a) Products and Services — Products and services are designed to meet the needs of "
            "consumers in the identified target market and distributed appropriately.\n"
            "(b) Price and Value — The price of products and services represents fair value for "
            "retail customers.\n"
            "(c) Consumer Understanding — Firms communicate in a way that supports consumer "
            "understanding and equips consumers to make effective decisions.\n"
            "(d) Consumer Support — Firms provide a level of support that meets consumers' needs "
            "throughout their relationship with the firm.\n\n"
            "2A.4 Monitoring and Governance\n"
            "Firms must monitor outcomes being experienced by customers and take action where outcomes "
            "are not consistent with the Duty. Boards or equivalent governing bodies must review and "
            "approve an annual assessment of whether the firm is delivering good outcomes."
        ),
    },
    # =========================================================================
    # SYSC — Senior Management Arrangements, Systems and Controls
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "SYSC",
        "series_title": "Senior Management Arrangements, Systems and Controls",
        "rule_number": "SYSC-4",
        "rule_title": "General Organisational Requirements",
        "source_url": "https://www.handbook.fca.org.uk/handbook/SYSC/4.html",
        "raw_text": (
            "SYSC 4 — General Organisational Requirements\n\n"
            "4.1.1R A firm must have robust governance arrangements, which include a clear "
            "organisational structure with well-defined, transparent and consistent lines of "
            "responsibility, effective processes to identify, manage, monitor and report the risks "
            "it is or might be exposed to, and internal control mechanisms.\n\n"
            "4.1.2R A firm's governance arrangements must be comprehensive and proportionate to the "
            "nature, scale and complexity of the risks inherent in the business model and activities.\n\n"
            "4.1.4R A firm must have sound administrative and accounting procedures, internal control "
            "mechanisms, effective procedures for risk assessment, and effective control and safeguard "
            "arrangements for information processing systems.\n\n"
            "4.1.6R A firm must ensure that its relevant persons are aware of the procedures which "
            "must be followed for the proper discharge of their responsibilities.\n\n"
            "4.1.7R A firm must monitor and, on a regular basis, evaluate the adequacy and "
            "effectiveness of its systems, internal control mechanisms and arrangements and take "
            "appropriate measures to address any deficiencies."
        ),
    },
    {
        "regulator": "FCA",
        "series": "SYSC",
        "series_title": "Senior Management Arrangements, Systems and Controls",
        "rule_number": "SYSC-6",
        "rule_title": "Compliance, Internal Audit and Financial Crime",
        "source_url": "https://www.handbook.fca.org.uk/handbook/SYSC/6.html",
        "raw_text": (
            "SYSC 6 — Compliance, Internal Audit and Financial Crime\n\n"
            "6.1.1R A firm must establish, implement and maintain adequate policies and procedures "
            "sufficient to ensure compliance of the firm including its managers, employees and "
            "appointed representatives with its obligations under the regulatory system and for "
            "countering the risk that the firm might be used to further financial crime.\n\n"
            "6.1.2R A firm must maintain a permanent and effective compliance function which operates "
            "independently and has the authority, resources, expertise and access to all relevant "
            "information necessary to carry out its responsibilities.\n\n"
            "6.1.3R The compliance function must: (a) monitor and assess the adequacy of the firm's "
            "measures and procedures and actions taken to address deficiencies; (b) advise and assist "
            "relevant persons responsible for carrying out regulated activities.\n\n"
            "6.2.1R A firm must maintain an effective internal audit function that is separate and "
            "independent from other functions, unless the firm can demonstrate this is disproportionate.\n\n"
            "6.3.1R A firm must establish and maintain effective systems and controls for compliance "
            "with applicable requirements relating to its financial crime obligations."
        ),
    },
    {
        "regulator": "FCA",
        "series": "SYSC",
        "series_title": "Senior Management Arrangements, Systems and Controls",
        "rule_number": "SYSC-10",
        "rule_title": "Conflicts of Interest",
        "source_url": "https://www.handbook.fca.org.uk/handbook/SYSC/10.html",
        "raw_text": (
            "SYSC 10 — Conflicts of Interest\n\n"
            "10.1.3R A firm must take all appropriate steps to identify and to prevent or manage "
            "conflicts of interest between: (a) the firm, including its managers, employees and "
            "appointed representatives, and a client of the firm; or (b) one client of the firm "
            "and another client.\n\n"
            "10.1.4R The types of conflict of interest that a firm should consider include: "
            "(a) the firm is likely to make a financial gain, or avoid a financial loss, at the "
            "expense of the client; (b) the firm has an interest in the outcome of a service "
            "provided to the client which is distinct from the client's interest; (c) the firm "
            "has a financial or other incentive to favour the interest of another client.\n\n"
            "10.1.7R A firm must maintain an effective conflicts of interest policy. The policy "
            "must identify the circumstances which constitute or may give rise to a conflict of "
            "interest and specify procedures and measures to manage such conflicts.\n\n"
            "10.1.8R Where a firm's arrangements are not sufficient to ensure that risks of damage "
            "to client interests will be prevented, the firm must clearly disclose the nature and "
            "source of the conflict of interest to the client before undertaking business."
        ),
    },
    {
        "regulator": "FCA",
        "series": "SYSC",
        "series_title": "Senior Management Arrangements, Systems and Controls",
        "rule_number": "SYSC-19A",
        "rule_title": "Remuneration Code",
        "source_url": "https://www.handbook.fca.org.uk/handbook/SYSC/19A.html",
        "raw_text": (
            "SYSC 19A — Remuneration Code (IFPRU Investment Firms and BIPRU Firms)\n\n"
            "19A.3.1R A firm must establish, implement and maintain remuneration policies, procedures "
            "and practices that are consistent with and promote sound and effective risk management.\n\n"
            "19A.3.2R A firm's remuneration policy must be consistent with the business strategy, "
            "objectives, values and long-term interests of the firm, and incorporate measures to avoid "
            "conflicts of interest.\n\n"
            "19A.3.3R The management body of a firm must adopt, and periodically review, the general "
            "principles of the remuneration policy, and be responsible for its implementation.\n\n"
            "19A.3.22R A firm must ensure that the assessment of performance is set in a multi-year "
            "framework in order to ensure that the assessment process is based on longer-term "
            "performance and that the payment of variable remuneration is spread over a period which "
            "takes account of the underlying business cycle.\n\n"
            "19A.3.27R Variable remuneration must not be paid through vehicles or methods that "
            "facilitate the avoidance of the requirements of the Remuneration Code."
        ),
    },
    {
        "regulator": "FCA",
        "series": "SYSC",
        "series_title": "Senior Management Arrangements, Systems and Controls",
        "rule_number": "SYSC-24",
        "rule_title": "Senior Managers and Certification Regime: Allocation of Prescribed Responsibilities",
        "source_url": "https://www.handbook.fca.org.uk/handbook/SYSC/24.html",
        "raw_text": (
            "SYSC 24 — Senior Managers and Certification Regime\n\n"
            "24.1.1R A firm must allocate each of the prescribed responsibilities applicable to "
            "the firm to one or more persons who perform a senior management function.\n\n"
            "24.2 Prescribed Responsibilities include: (a) responsibility for the firm's performance "
            "of its obligations under the senior managers regime; (b) responsibility for the firm's "
            "compliance with the requirements of the regulatory system about the firm's management "
            "responsibilities map; (c) responsibility for the firm's compliance with its obligations "
            "in relation to the certification regime; (d) responsibility for the firm's obligations "
            "in relation to conduct rules notifications and training.\n\n"
            "24.2.6R The FCA's prescribed responsibilities also include: responsibility for the "
            "firm's policies and procedures for countering the risk that the firm might be used to "
            "further financial crime; responsibility for the firm's compliance with CASS; and "
            "responsibility for overseeing the firm's compliance with Principle 12 (Consumer Duty)."
        ),
    },
    # =========================================================================
    # COCON — Code of Conduct (Individual Conduct Rules)
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "COCON",
        "series_title": "Code of Conduct",
        "rule_number": "COCON-2",
        "rule_title": "Individual Conduct Rules",
        "source_url": "https://www.handbook.fca.org.uk/handbook/COCON/2.html",
        "raw_text": (
            "COCON 2 — Individual Conduct Rules\n\n"
            "2.1 Individual Conduct Rules\n"
            "Rule 1: You must act with integrity.\n"
            "Rule 2: You must act with due skill, care and diligence.\n"
            "Rule 3: You must be open and cooperative with the FCA, the PRA and other regulators.\n"
            "Rule 4: You must pay due regard to the interests of customers and treat them fairly.\n"
            "Rule 5: You must observe proper standards of market conduct.\n\n"
            "2.2 Senior Manager Conduct Rules (additional rules for SMF holders)\n"
            "SC1: You must take reasonable steps to ensure that the business of the firm for which "
            "you are responsible is controlled effectively.\n"
            "SC2: You must take reasonable steps to ensure that the business of the firm for which "
            "you are responsible complies with the relevant requirements and standards of the "
            "regulatory system.\n"
            "SC3: You must take reasonable steps to ensure that any delegation of your responsibilities "
            "is to an appropriate person and that you oversee the discharge of the delegated "
            "responsibility effectively.\n"
            "SC4: You must disclose appropriately any information of which the FCA or PRA would "
            "reasonably expect notice."
        ),
    },
    # =========================================================================
    # COBS — Conduct of Business Sourcebook
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "COBS",
        "series_title": "Conduct of Business Sourcebook",
        "rule_number": "COBS-2",
        "rule_title": "Conduct of Business Obligations",
        "source_url": "https://www.handbook.fca.org.uk/handbook/COBS/2.html",
        "raw_text": (
            "COBS 2 — Conduct of Business Obligations\n\n"
            "2.1.1R A firm must act honestly, fairly and professionally in accordance with the best "
            "interests of its client (the client's best interests rule).\n\n"
            "2.1.2R This rule applies in relation to MiFID or equivalent third country business, "
            "or designated investment business carried on for a retail client or professional client.\n\n"
            "2.3.1R A firm must not, in any communication to a client relating to designated "
            "investment business, seek to exclude or restrict, or rely on any exclusion or "
            "restriction of, any duty or liability it may have to a client under the regulatory system.\n\n"
            "2.4.1R A firm which gives advice to a professional client must have a reasonable basis "
            "for believing that its personal recommendation is suitable."
        ),
    },
    {
        "regulator": "FCA",
        "series": "COBS",
        "series_title": "Conduct of Business Sourcebook",
        "rule_number": "COBS-4",
        "rule_title": "Communicating with Clients, Including Financial Promotions",
        "source_url": "https://www.handbook.fca.org.uk/handbook/COBS/4.html",
        "raw_text": (
            "COBS 4 — Communicating with Clients, Including Financial Promotions\n\n"
            "4.2.1R A firm must ensure that a communication or a financial promotion is fair, clear "
            "and not misleading.\n\n"
            "4.2.2R A firm must ensure that information: (a) includes the name of the firm; "
            "(b) is accurate and in particular does not emphasise any potential benefits of "
            "relevant business without also giving a fair and prominent indication of any "
            "relevant risks; (c) is sufficient for, and presented in a way that is likely to be "
            "understood by, the average member of the group to whom it is directed.\n\n"
            "4.5.2R A firm must not communicate an invitation or inducement to engage in investment "
            "activity unless the firm has approved its content. When providing information to retail "
            "clients, the information must be provided in good time before the provision of the service.\n\n"
            "4.6.1R Information addressed to or likely to reach retail clients must meet additional "
            "requirements including: (a) no disguising or diminishing important items, statements "
            "or warnings; (b) consistent use of font size; (c) clear identification if it is a "
            "financial promotion."
        ),
    },
    {
        "regulator": "FCA",
        "series": "COBS",
        "series_title": "Conduct of Business Sourcebook",
        "rule_number": "COBS-6",
        "rule_title": "Information About the Firm, Its Services and Remuneration",
        "source_url": "https://www.handbook.fca.org.uk/handbook/COBS/6.html",
        "raw_text": (
            "COBS 6 — Information About the Firm, Its Services and Remuneration\n\n"
            "6.1.4R A firm must provide a client with general information about the firm and its "
            "services including: (a) the name and address of the firm; (b) the languages in which "
            "services may be provided; (c) the methods of communication to be used; (d) a statement "
            "that the firm is authorised and the name of the competent authority.\n\n"
            "6.1.6R Where a firm provides investment advice, it must inform the client whether the "
            "advice is provided on an independent or restricted basis.\n\n"
            "6.1.9R A firm must provide information on costs and associated charges to the client, "
            "including the cost of the service and the financial instrument, in a way that enables "
            "the client to understand the overall cost and the cumulative effect on the return of "
            "the investment. An ex ante and ex post itemisation of costs must be provided."
        ),
    },
    {
        "regulator": "FCA",
        "series": "COBS",
        "series_title": "Conduct of Business Sourcebook",
        "rule_number": "COBS-9",
        "rule_title": "Suitability (Including Basic Advice)",
        "source_url": "https://www.handbook.fca.org.uk/handbook/COBS/9.html",
        "raw_text": (
            "COBS 9 — Suitability (Including Basic Advice)\n\n"
            "9.2.1R A firm must take reasonable steps to ensure that a personal recommendation, "
            "or a decision to trade, is suitable for its client.\n\n"
            "9.2.2R A firm must obtain the necessary information regarding the client's: "
            "(a) knowledge and experience in the investment field relevant to the specific type "
            "of product or service; (b) financial situation, including ability to bear losses; "
            "and (c) investment objectives, including risk tolerance.\n\n"
            "9.2.3R The information regarding the financial situation of a client must include, "
            "where relevant, information on the source and extent of regular income, assets "
            "including liquid assets, investments, real property, and regular financial commitments.\n\n"
            "9.2.6R A firm must not make a personal recommendation or take a decision to trade "
            "where the firm does not obtain the necessary information to assess suitability.\n\n"
            "9.4.1R A suitability report must be provided to the retail client before the transaction "
            "is effected, specifying the advice given and how it meets the client's preferences, "
            "objectives, and other characteristics."
        ),
    },
    {
        "regulator": "FCA",
        "series": "COBS",
        "series_title": "Conduct of Business Sourcebook",
        "rule_number": "COBS-9A",
        "rule_title": "Appropriateness Assessment",
        "source_url": "https://www.handbook.fca.org.uk/handbook/COBS/9A.html",
        "raw_text": (
            "COBS 9A — Appropriateness (for Non-Advised Services)\n\n"
            "9A.2.1R When providing a service which does not involve the provision of a personal "
            "recommendation, a firm must ask the client to provide information regarding their "
            "knowledge and experience in the investment field relevant to the specific type of "
            "product or service offered or demanded so as to enable the firm to assess whether "
            "the service or product envisaged is appropriate for the client.\n\n"
            "9A.2.6R Where the firm considers, on the basis of the information received, that the "
            "product or service is not appropriate for the client, the firm must warn the client.\n\n"
            "9A.2.7R If the client does not provide the information or provides insufficient "
            "information, the firm must warn the client that it is not in a position to determine "
            "whether the service or product is appropriate.\n\n"
            "9A.3.1R A firm is not required to assess appropriateness for execution-only "
            "transactions in non-complex instruments where the service is provided at the "
            "initiative of the client."
        ),
    },
    {
        "regulator": "FCA",
        "series": "COBS",
        "series_title": "Conduct of Business Sourcebook",
        "rule_number": "COBS-10A",
        "rule_title": "Best Execution",
        "source_url": "https://www.handbook.fca.org.uk/handbook/COBS/10A.html",
        "raw_text": (
            "COBS 10A — MiFID — Best Execution\n\n"
            "10A.2.1R A firm must take all sufficient steps to obtain, when executing orders, the "
            "best possible result for its clients taking into account price, costs, speed, likelihood "
            "of execution and settlement, size, nature or any other consideration relevant to the "
            "execution of the order.\n\n"
            "10A.2.3R A firm must establish and implement effective arrangements for complying with "
            "best execution. The firm must establish and implement an order execution policy to "
            "allow it to obtain the best possible result for its clients.\n\n"
            "10A.2.4R The order execution policy must include information on the different venues "
            "where the firm executes client orders and the factors affecting the choice of execution "
            "venue. The firm must provide appropriate information to its clients on the policy.\n\n"
            "10A.2.6R A firm must monitor the effectiveness of its order execution arrangements and "
            "execution policy to identify and correct any deficiencies. The firm must assess, on a "
            "regular basis, whether the execution venues included in the policy provide for the best "
            "possible result for the client.\n\n"
            "10A.2.8R A firm must be able to demonstrate to its clients, at their request, that it "
            "has executed their orders in accordance with the firm's execution policy and must be "
            "able to demonstrate to the FCA that it complies with this rule."
        ),
    },
    {
        "regulator": "FCA",
        "series": "COBS",
        "series_title": "Conduct of Business Sourcebook",
        "rule_number": "COBS-11",
        "rule_title": "Order Handling and Client Order Rules",
        "source_url": "https://www.handbook.fca.org.uk/handbook/COBS/11.html",
        "raw_text": (
            "COBS 11 — Dealing and Managing\n\n"
            "11.3.1R A firm which executes client orders must implement procedures and arrangements "
            "which provide for the prompt, fair and expeditious execution of client orders, relative "
            "to other client orders or the trading interests of the firm.\n\n"
            "11.3.2R A firm must execute otherwise comparable client orders sequentially and promptly "
            "unless the characteristics of the order or prevailing market conditions make this "
            "impracticable.\n\n"
            "11.3.7R A firm must not carry out a client order or a transaction for own account in "
            "aggregation with another client order unless it is unlikely that the aggregation will "
            "work overall to the disadvantage of any client whose order is aggregated.\n\n"
            "11.3.15R Where a firm has carried out an aggregated order, the firm must allocate the "
            "related trades fairly. In particular, it must not allocate in a way that is detrimental "
            "to a client."
        ),
    },
    {
        "regulator": "FCA",
        "series": "COBS",
        "series_title": "Conduct of Business Sourcebook",
        "rule_number": "COBS-14",
        "rule_title": "Providing Product Information to Clients",
        "source_url": "https://www.handbook.fca.org.uk/handbook/COBS/14.html",
        "raw_text": (
            "COBS 14 — Providing Product Information to Clients\n\n"
            "14.2.1R A firm must provide a client with a key information document (KID) or key "
            "investor information document (KIID) in good time before the client is bound by any "
            "agreement to purchase a packaged retail investment product.\n\n"
            "14.3.1R A firm that manufactures a PRIIPs product must draw up a KID in accordance with "
            "the PRIIPs Regulation and publish it on its website.\n\n"
            "14.3A.1R A firm must provide appropriate information to a client in good time before "
            "the provision of investment services or ancillary services, including information about: "
            "(a) the firm and its services; (b) financial instruments and proposed investment strategies, "
            "including risks; (c) execution venues; and (d) costs and associated charges."
        ),
    },
    # =========================================================================
    # CASS — Client Assets Sourcebook
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "CASS",
        "series_title": "Client Assets Sourcebook",
        "rule_number": "CASS-6",
        "rule_title": "Custody Rules — Holding Client Assets",
        "source_url": "https://www.handbook.fca.org.uk/handbook/CASS/6.html",
        "raw_text": (
            "CASS 6 — Custody Rules\n\n"
            "6.1.1R A firm must, when holding financial instruments belonging to a client, make "
            "adequate arrangements to safeguard the client's ownership rights, especially in the "
            "event of the firm's insolvency.\n\n"
            "6.2.1R A firm must maintain accurate and up-to-date records and accounts enabling it "
            "at any time and without delay to distinguish assets held for one client from assets "
            "held for any other client and from the firm's own assets.\n\n"
            "6.2.2R A firm's records must enable the total of safe custody assets held for each "
            "client to be readily apparent.\n\n"
            "6.3.1R Where a firm deposits financial instruments held on behalf of a client with a "
            "third party, it must exercise all due skill, care and diligence in the selection, "
            "appointment and periodic review of the third party and of the arrangements for holding "
            "and safekeeping those instruments.\n\n"
            "6.6.1R A firm must carry out reconciliations of its internal records and accounts of "
            "client custody assets with those of third parties by whom those assets are held. "
            "Reconciliations must be performed at intervals of no more than 10 business days.\n\n"
            "6.6.6R Where a firm identifies a discrepancy in a reconciliation, the firm must resolve "
            "it as soon as possible and in any event within 5 business days."
        ),
    },
    {
        "regulator": "FCA",
        "series": "CASS",
        "series_title": "Client Assets Sourcebook",
        "rule_number": "CASS-7",
        "rule_title": "Client Money Rules",
        "source_url": "https://www.handbook.fca.org.uk/handbook/CASS/7.html",
        "raw_text": (
            "CASS 7 — Client Money Rules\n\n"
            "7.2.1R A firm receives and holds client money if, in the course of or in connection "
            "with its regulated business, a firm holds money to which a client is or may be entitled.\n\n"
            "7.4.1R A firm must hold client money in a client bank account at an approved bank, "
            "a central bank, a qualifying money market fund, or through placement with a "
            "regulated entity.\n\n"
            "7.4.9R A firm must take reasonable steps to ensure that client money deposited in "
            "accordance with this chapter is distinguishable from money belonging to the firm "
            "through use of different accounts or other equivalent measures.\n\n"
            "7.6.1R A firm must keep sufficient records to show and explain its dealings with "
            "client money. Records must be maintained in such a way that the firm can at any "
            "point in time ascertain the amount of client money it should hold for each client.\n\n"
            "7.6.2R A firm must carry out internal reconciliations of each client money account "
            "with client money balances every business day.\n\n"
            "7.7.1R A firm must segregate client money from the firm's own money. The firm must "
            "not use one client's money for another client's purposes."
        ),
    },
    {
        "regulator": "FCA",
        "series": "CASS",
        "series_title": "Client Assets Sourcebook",
        "rule_number": "CASS-10",
        "rule_title": "CASS Resolution Pack",
        "source_url": "https://www.handbook.fca.org.uk/handbook/CASS/10.html",
        "raw_text": (
            "CASS 10 — CASS Resolution Pack\n\n"
            "10.1.1R A CASS firm must maintain a CASS resolution pack (a set of information and "
            "documents designed to facilitate the orderly return of client assets and client money "
            "in the event of the firm's failure).\n\n"
            "10.1.8R The CASS resolution pack must include: (a) the contact details of relevant "
            "persons at the firm; (b) details of the firm's client money and custody asset "
            "arrangements; (c) a master document describing the firm's CASS arrangements; "
            "(d) the method of calculation used for internal reconciliations.\n\n"
            "10.1.12R A CASS firm must review its CASS resolution pack at least annually to ensure "
            "it remains accurate and up-to-date."
        ),
    },
    # =========================================================================
    # ICOBS — Insurance: Conduct of Business Sourcebook
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "ICOBS",
        "series_title": "Insurance: Conduct of Business Sourcebook",
        "rule_number": "ICOBS-2",
        "rule_title": "General Matters — Insurance Conduct of Business",
        "source_url": "https://www.handbook.fca.org.uk/handbook/ICOBS/2.html",
        "raw_text": (
            "ICOBS 2 — General Matters\n\n"
            "2.2.2R A firm must act honestly, fairly and professionally in accordance with the "
            "best interests of its customer.\n\n"
            "2.5.1R A firm must ensure that information it provides to a customer is: (a) accurate; "
            "(b) communicated in a way that is clear, fair and not misleading; (c) not inconsistent "
            "with any information the firm has provided to the customer.\n\n"
            "2.5.2R Information must be provided in a way that is comprehensible and, where relevant, "
            "should include warnings of the risks associated with the insurance product."
        ),
    },
    {
        "regulator": "FCA",
        "series": "ICOBS",
        "series_title": "Insurance: Conduct of Business Sourcebook",
        "rule_number": "ICOBS-5",
        "rule_title": "Identifying Customer Needs and Advising",
        "source_url": "https://www.handbook.fca.org.uk/handbook/ICOBS/5.html",
        "raw_text": (
            "ICOBS 5 — Identifying Client Needs and Advising\n\n"
            "5.2.2R Prior to the conclusion of a non-investment insurance contract, a firm must "
            "specify, on the basis of information provided by the customer, the demands and needs "
            "of that customer and provide the customer with objective information about the "
            "insurance product in a comprehensible form to allow that customer to make an informed "
            "decision.\n\n"
            "5.2.3R If a firm provides a personal recommendation, it must provide a personalised "
            "explanation of why a particular product would best meet the customer's demands and needs.\n\n"
            "5.3.1R A firm must take reasonable care to ensure the suitability of its advice for any "
            "customer who is entitled to rely upon its judgment."
        ),
    },
    # =========================================================================
    # SUP — Supervision Manual
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "SUP",
        "series_title": "Supervision Manual",
        "rule_number": "SUP-15",
        "rule_title": "Notifications to the FCA",
        "source_url": "https://www.handbook.fca.org.uk/handbook/SUP/15.html",
        "raw_text": (
            "SUP 15 — Notifications to the FCA\n\n"
            "15.3.1R A firm must notify the FCA immediately if it becomes aware, or has information "
            "which reasonably suggests, that any of the following has occurred or may occur: "
            "(a) the firm failing to satisfy one or more of the threshold conditions; (b) any matter "
            "which could have a significant adverse impact on the firm's reputation; (c) any matter "
            "which could affect the firm's ability to continue to provide adequate services to its "
            "customers; (d) any significant failure in the firm's systems or controls.\n\n"
            "15.3.8R A firm must notify the FCA immediately of any proposed restructuring, "
            "reorganisation or business expansion which could have a significant impact on the "
            "firm's risk profile or resources.\n\n"
            "15.3.11R A firm must notify the FCA of: (a) any significant breach of a rule; "
            "(b) any breach of any requirement imposed by the Act or by regulations; "
            "(c) a significant breach of any applicable requirement by an appointed representative."
        ),
    },
    {
        "regulator": "FCA",
        "series": "SUP",
        "series_title": "Supervision Manual",
        "rule_number": "SUP-16",
        "rule_title": "Reporting Requirements",
        "source_url": "https://www.handbook.fca.org.uk/handbook/SUP/16.html",
        "raw_text": (
            "SUP 16 — Reporting Requirements\n\n"
            "16.3.1R A firm must submit its reports in accordance with the rules in this chapter. "
            "Reports must be submitted by the dates and in the format specified.\n\n"
            "16.3.4R A firm must submit to the FCA: (a) annual financial reports; (b) auditor's "
            "reports; (c) regulatory returns as specified. These must be submitted within the "
            "prescribed time periods.\n\n"
            "16.4.5R A firm must notify the FCA without delay if it becomes aware that information "
            "previously submitted was, or has become, inaccurate in a material respect.\n\n"
            "16.10.1R A firm must make a product sales data report to the FCA at intervals specified "
            "in this section, containing information about: (a) sales of retail investment products; "
            "(b) advised and non-advised sales; (c) complaints data."
        ),
    },
    {
        "regulator": "FCA",
        "series": "SUP",
        "series_title": "Supervision Manual",
        "rule_number": "SUP-10C",
        "rule_title": "Senior Managers Regime — FCA-Designated Senior Management Functions",
        "source_url": "https://www.handbook.fca.org.uk/handbook/SUP/10C.html",
        "raw_text": (
            "SUP 10C — FCA-Designated Senior Management Functions (SMF)\n\n"
            "10C.3.1R A firm must ensure that a person does not perform a designated senior "
            "management function without first being approved by the FCA.\n\n"
            "10C.4 FCA-designated senior management functions include: SMF1 (Chief Executive); "
            "SMF3 (Executive Director); SMF9 (Chair); SMF16 (Compliance Oversight); "
            "SMF17 (Money Laundering Reporting Officer); SMF24 (Chief Operations); "
            "SMF27 (Partner).\n\n"
            "10C.5.1R A firm must take reasonable care to maintain a management responsibilities "
            "map that describes the firm's management and governance arrangements. The map must "
            "include details of each person performing a senior management function.\n\n"
            "10C.11.1R A firm must obtain the FCA's approval before a person begins to perform "
            "a designated senior management function. Applications must include a statement of "
            "responsibilities describing the aspects of the firm's affairs which the person will "
            "be responsible for managing."
        ),
    },
    # =========================================================================
    # DISP — Dispute Resolution: Complaints
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "DISP",
        "series_title": "Dispute Resolution: Complaints",
        "rule_number": "DISP-1",
        "rule_title": "Treating Complainants Fairly",
        "source_url": "https://www.handbook.fca.org.uk/handbook/DISP/1.html",
        "raw_text": (
            "DISP 1 — Treating Complainants Fairly\n\n"
            "1.2.1R A respondent must have in place and operate appropriate and effective internal "
            "complaint handling procedures for handling any expression of dissatisfaction, whether "
            "oral or written, and whether or not justified, from or on behalf of an eligible complainant.\n\n"
            "1.3.1R A respondent must: (a) send the complainant a prompt written acknowledgement "
            "providing early reassurance; (b) ensure that the complaint is investigated competently, "
            "diligently and impartially; (c) assess fairly, consistently and promptly whether the "
            "complaint should be upheld.\n\n"
            "1.4.1R A respondent must comply with the following time limits: (a) within 3 business "
            "days of receipt, attempt early resolution; (b) within 15 business days, issue an initial "
            "response or holding response; (c) within 8 weeks, issue a final response.\n\n"
            "1.6.1R If the respondent decides that the complaint should be upheld, it must provide "
            "fair compensation, a written explanation, and inform the complainant of the right to "
            "refer to the Financial Ombudsman Service.\n\n"
            "1.6.2R The complainant must be informed of the right to refer the complaint to the "
            "Financial Ombudsman Service within 6 months."
        ),
    },
    # =========================================================================
    # MCOB — Mortgages and Home Finance: Conduct of Business
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "MCOB",
        "series_title": "Mortgages and Home Finance: Conduct of Business",
        "rule_number": "MCOB-11",
        "rule_title": "Responsible Lending and Affordability",
        "source_url": "https://www.handbook.fca.org.uk/handbook/MCOB/11.html",
        "raw_text": (
            "MCOB 11 — Responsible Lending and Affordability\n\n"
            "11.6.2R A firm must not enter into a regulated mortgage contract, or make a further "
            "advance, unless it can demonstrate that the contract is affordable for the borrower.\n\n"
            "11.6.3R When assessing affordability, a firm must: (a) not rely on self-certification "
            "of income; (b) take account of the borrower's committed expenditure and essential "
            "outgoings; (c) apply an appropriate interest rate stress test.\n\n"
            "11.6.5R The affordability assessment must also take into account: (a) the impact of "
            "future known or reasonably anticipated changes in the borrower's income or expenditure; "
            "(b) the impact of future interest rate increases.\n\n"
            "11.6.18R Where the regulated mortgage contract is an interest-only mortgage, the firm "
            "must assess whether the borrower has a credible repayment strategy to repay the "
            "capital at the end of the term."
        ),
    },
    # =========================================================================
    # BCOBS — Banking: Conduct of Business Sourcebook
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "BCOBS",
        "series_title": "Banking: Conduct of Business Sourcebook",
        "rule_number": "BCOBS-2",
        "rule_title": "Communications with Banking Customers and Financial Promotions",
        "source_url": "https://www.handbook.fca.org.uk/handbook/BCOBS/2.html",
        "raw_text": (
            "BCOBS 2 — Communications with Banking Customers and Financial Promotions\n\n"
            "2.2.1R A firm must ensure that its communications with banking customers are clear, "
            "fair and not misleading.\n\n"
            "2.3.1R A firm must provide or make available to a banking customer appropriate "
            "information about a retail banking service and any deposit made in connection with "
            "a retail banking service: (a) in good time; (b) in an appropriate medium; and "
            "(c) in easily understandable language and in a clear and comprehensible form.\n\n"
            "2.3.2R Appropriate information includes: (a) the main features of the service; "
            "(b) the applicable interest rate; (c) how interest is calculated and applied; "
            "(d) charges; (e) rights to cancel or withdraw."
        ),
    },
    # =========================================================================
    # GEN — General Provisions
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "GEN",
        "series_title": "General Provisions",
        "rule_number": "GEN-4",
        "rule_title": "Statutory Status Disclosure",
        "source_url": "https://www.handbook.fca.org.uk/handbook/GEN/4.html",
        "raw_text": (
            "GEN 4 — Statutory Status Disclosure\n\n"
            "4.1.1R A firm must take reasonable care to ensure that every letter or electronic "
            "equivalent which it, or its employees, sends to a customer in connection with "
            "regulated activities includes the disclosure required by the applicable regulations.\n\n"
            "4.3.1R A firm must disclose to a client its regulatory status, including: "
            "(a) that the firm is authorised and regulated by the FCA (and, where applicable, "
            "the PRA); (b) the firm's FCA firm reference number; (c) the address of the "
            "firm's registered office."
        ),
    },
    # =========================================================================
    # MAR — Market Conduct
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "MAR",
        "series_title": "Market Conduct",
        "rule_number": "MAR-1",
        "rule_title": "Market Abuse — The Code of Market Conduct",
        "source_url": "https://www.handbook.fca.org.uk/handbook/MAR/1.html",
        "raw_text": (
            "MAR 1 — The Code of Market Conduct\n\n"
            "1.2 Market Abuse (Insider Dealing)\n"
            "1.2.2G Behaviour based on information which is not generally available and which is "
            "relevant to the price of qualifying investments constitutes insider dealing if a "
            "reasonable regular user of the market would regard the information as relevant.\n\n"
            "1.3 Market Abuse (Improper Disclosure)\n"
            "1.3.2G Disclosure of inside information otherwise than in the proper course of the "
            "exercise of employment, profession or duties constitutes market abuse.\n\n"
            "1.4 Market Abuse (Market Manipulation — Transaction Based)\n"
            "1.4.2G Behaviour effecting transactions or orders to trade which give a misleading "
            "impression as to the supply, demand, or price of qualifying investments constitutes "
            "market abuse.\n\n"
            "1.5 Market Abuse (Market Manipulation — Dissemination)\n"
            "1.5.2G Behaviour consisting of the dissemination of information which is likely to "
            "give a false or misleading impression of a qualifying investment constitutes market abuse.\n\n"
            "1.6 Market Abuse (Manipulating Devices)\n"
            "1.6.2G Behaviour effecting transactions or orders to trade which employ fictitious "
            "devices or any other form of deception or contrivance constitutes market abuse."
        ),
    },
    # =========================================================================
    # MIFIDPRU — Prudential Requirements for MiFID Investment Firms
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "MIFIDPRU",
        "series_title": "Prudential Sourcebook for MiFID Investment Firms",
        "rule_number": "MIFIDPRU-3",
        "rule_title": "Own Funds Requirements",
        "source_url": "https://www.handbook.fca.org.uk/handbook/MIFIDPRU/3.html",
        "raw_text": (
            "MIFIDPRU 3 — Own Funds Requirements\n\n"
            "3.2.1R A MIFIDPRU investment firm must at all times hold own funds equal to or in "
            "excess of its own funds requirement.\n\n"
            "3.3.1R The own funds requirement for a MIFIDPRU investment firm is the higher of: "
            "(a) the firm's permanent minimum capital requirement; (b) the firm's fixed overheads "
            "requirement; and (c) the firm's K-factor requirement (if applicable).\n\n"
            "3.4.1R The permanent minimum capital requirement for a small and non-interconnected (SNI) "
            "MIFIDPRU investment firm is GBP 75,000. For a non-SNI firm, it is GBP 150,000 or "
            "GBP 750,000 depending on the activities performed.\n\n"
            "3.5.1R The fixed overheads requirement is at least one quarter of the fixed overheads "
            "of the preceding year."
        ),
    },
    {
        "regulator": "FCA",
        "series": "MIFIDPRU",
        "series_title": "Prudential Sourcebook for MiFID Investment Firms",
        "rule_number": "MIFIDPRU-7",
        "rule_title": "Liquid Assets Requirement and Internal Capital Adequacy and Risk Assessment",
        "source_url": "https://www.handbook.fca.org.uk/handbook/MIFIDPRU/7.html",
        "raw_text": (
            "MIFIDPRU 7 — Liquid Assets Requirement\n\n"
            "7.3.1R A MIFIDPRU investment firm must at all times hold liquid assets of a value "
            "at least equal to one third of its fixed overheads requirement (the basic liquid "
            "assets requirement).\n\n"
            "7.4.1R A non-SNI MIFIDPRU investment firm must carry out an internal capital "
            "adequacy and risk assessment (ICARA) process. The ICARA process must: (a) identify "
            "the material potential harms that the firm's ongoing activities and wind-down could "
            "pose to consumers and markets; (b) assess the own funds and liquid assets the firm "
            "needs to address those harms.\n\n"
            "7.4.7R The ICARA must be reviewed at least annually, or more frequently when there "
            "are material changes to the firm's business or risk profile. Senior management must "
            "be actively involved in the ICARA process."
        ),
    },
    # =========================================================================
    # COMP — Compensation
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "COMP",
        "series_title": "Compensation",
        "rule_number": "COMP-3",
        "rule_title": "The Financial Services Compensation Scheme (FSCS)",
        "source_url": "https://www.handbook.fca.org.uk/handbook/COMP/3.html",
        "raw_text": (
            "COMP 3 — The Compensation Scheme\n\n"
            "3.2.1R A firm must pay FSCS levies in accordance with FEES 6. The compensation scheme "
            "covers claims against firms that are unable or likely to be unable to pay claims "
            "against them.\n\n"
            "3.2.2R A claim against a firm is eligible for compensation if: (a) the firm is in "
            "default; (b) the claimant is an eligible claimant; and (c) the claim is in respect "
            "of a protected activity.\n\n"
            "3.3.1R Firms must inform eligible claimants about the compensation scheme and its "
            "coverage limits. The current maximum compensation is GBP 85,000 per eligible person "
            "per firm for deposits, and GBP 85,000 for investments."
        ),
    },
    # =========================================================================
    # CONC — Consumer Credit Sourcebook
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "CONC",
        "series_title": "Consumer Credit Sourcebook",
        "rule_number": "CONC-5",
        "rule_title": "Responsible Lending",
        "source_url": "https://www.handbook.fca.org.uk/handbook/CONC/5.html",
        "raw_text": (
            "CONC 5 — Responsible Lending\n\n"
            "5.2A.1R Before making a regulated credit agreement, a firm must undertake a "
            "creditworthiness assessment. The assessment must: (a) consider the risk that the "
            "borrower will not make repayments under the agreement by their due date; and "
            "(b) consider the risk of the commitments under the agreement adversely impacting "
            "the borrower's financial situation.\n\n"
            "5.2A.4R The creditworthiness assessment must be based on sufficient information "
            "obtained from the borrower and, where appropriate, from a credit reference agency.\n\n"
            "5.2A.10R A firm must not enter into a regulated credit agreement if the firm "
            "does not consider the agreement to be affordable for the borrower.\n\n"
            "5.3.1R A firm must explain the key features of a regulated credit agreement to "
            "enable the borrower to make an informed decision."
        ),
    },
    # =========================================================================
    # FEES — Fees Manual
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "FEES",
        "series_title": "Fees Manual",
        "rule_number": "FEES-4",
        "rule_title": "Periodic Fees",
        "source_url": "https://www.handbook.fca.org.uk/handbook/FEES/4.html",
        "raw_text": (
            "FEES 4 — Periodic Fees\n\n"
            "4.2.1R A firm must pay each periodic fee applicable to it in full and by the "
            "date specified. Failure to pay fees by the due date may result in enforcement action.\n\n"
            "4.2.7R A firm must pay annual fees based on its fee-block classification. Fee rates "
            "are set annually by the FCA and reflect the cost of regulation.\n\n"
            "4.3.1R Additional fees may be payable for specific permissions, applications, or "
            "variations. Late payment of fees may result in an administrative fee."
        ),
    },
    # =========================================================================
    # TC — Training and Competence
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "TC",
        "series_title": "Training and Competence",
        "rule_number": "TC-2",
        "rule_title": "Competence Requirements",
        "source_url": "https://www.handbook.fca.org.uk/handbook/TC/2.html",
        "raw_text": (
            "TC 2 — Competence\n\n"
            "2.1.1R A firm must ensure that its employees who carry on an activity listed in "
            "the TC Appendix are competent to do so.\n\n"
            "2.1.2R A firm must ensure that an employee who has not yet been assessed as competent "
            "is supervised by a person who has been assessed as competent.\n\n"
            "2.1.5R A firm must not assess an employee as competent to carry out an activity "
            "listed in TC Appendix 1 until the employee has: (a) passed an appropriate examination; "
            "(b) demonstrated competence through an assessment of their ability to apply their "
            "knowledge in practice.\n\n"
            "2.1.6R A firm must regularly review the competence of its employees and take "
            "appropriate action where an employee is no longer competent."
        ),
    },
    # =========================================================================
    # PROD — Product Intervention and Product Governance
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "PROD",
        "series_title": "Product Intervention and Product Governance Sourcebook",
        "rule_number": "PROD-3",
        "rule_title": "Product Governance — MiFID",
        "source_url": "https://www.handbook.fca.org.uk/handbook/PROD/3.html",
        "raw_text": (
            "PROD 3 — Product Governance: MiFID\n\n"
            "3.2.1R A manufacturer must maintain, operate and review a process for the approval "
            "of each financial instrument and significant adaptations of existing financial "
            "instruments before it is marketed or distributed to clients (product approval process).\n\n"
            "3.2.4R The product approval process must identify the target market of end clients "
            "within the relevant category of clients for each financial instrument and must ensure "
            "that the intended distribution strategy is consistent with the identified target market.\n\n"
            "3.2.16R A manufacturer must regularly review financial instruments it has issued, "
            "taking into account any event that could materially affect the potential risk to the "
            "identified target market. The manufacturer must assess whether the financial instrument "
            "remains consistent with the needs of the identified target market.\n\n"
            "3.3.1R A distributor must have in place adequate product governance arrangements to "
            "ensure that products and services it intends to offer or recommend are compatible "
            "with the needs, characteristics and objectives of an identified target market."
        ),
    },
    # =========================================================================
    # FIT — Fit and Proper Test for Employees and Senior Personnel
    # =========================================================================
    {
        "regulator": "FCA",
        "series": "FIT",
        "series_title": "Fit and Proper Test for Employees and Senior Personnel",
        "rule_number": "FIT-2",
        "rule_title": "Main Assessment Criteria",
        "source_url": "https://www.handbook.fca.org.uk/handbook/FIT/2.html",
        "raw_text": (
            "FIT 2 — Main Assessment Criteria\n\n"
            "2.1.1G The FCA will assess the fitness and propriety of persons performing "
            "controlled functions having regard to: (a) honesty, integrity and reputation; "
            "(b) competence and capability; and (c) financial soundness.\n\n"
            "2.1.3G The criteria are not exhaustive and the FCA may have regard to any other "
            "relevant matters.\n\n"
            "2.2.1G In assessing honesty, integrity and reputation, the FCA will have regard to "
            "matters including: (a) whether the person has been convicted of any criminal offence; "
            "(b) whether the person has been the subject of any adverse finding or settlement in "
            "civil proceedings; (c) whether the person has been involved in the management of a "
            "firm that has failed; (d) whether the person has been sanctioned by any regulatory body.\n\n"
            "2.3.1G In assessing competence and capability, the FCA will consider whether the person "
            "has the qualifications, training and competence appropriate to the controlled function."
        ),
    },
]
