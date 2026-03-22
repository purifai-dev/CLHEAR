"""
CLHEAR - FINRA Regulatory Source Texts
Complete FINRA Rule Series for loading into regulatory_sources table.

Each entry represents a FINRA rule with its full regulatory text.
Source: FINRA Manual (https://www.finra.org/rules-guidance/rulebook/finra-rules)

This module is designed to be extended — when adding ESMA, FCA, MAS, etc.,
create parallel files (esma_sources.py, fca_sources.py) with the same structure.
"""

FINRA_SOURCES = [
    # =========================================================================
    # 1000 Series — Member Application and Associated Person Registration
    # =========================================================================
    {
        "regulator": "FINRA",
        "series": "1000",
        "series_title": "Member Application and Associated Person Registration",
        "rule_number": "1010",
        "rule_title": "Membership Application",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/1010",
        "raw_text": (
            "Rule 1010. Membership Application\n\n"
            "(a) Membership Application Required. No broker or dealer shall be admitted to membership in FINRA "
            "unless and until an application for membership has been filed with and approved by FINRA, or an "
            "application for membership has been approved pursuant to the FINRA Rule 1012 review process.\n\n"
            "(b) Filing of Application. Each applicant for membership shall file an application on such form or "
            "forms as FINRA may prescribe. The application shall include such information, financial statements, "
            "and other documentation as FINRA deems necessary.\n\n"
            "(c) Standards for Admission. In reviewing an application for membership, FINRA shall determine "
            "whether the applicant and its associated persons meet the standards set forth in Rule 1014, including: "
            "(1) the applicant's business plan, (2) the financial condition and capital structure, (3) the "
            "qualifications, experience, and disciplinary history of associated persons, (4) supervisory and "
            "compliance infrastructure, and (5) communications and operational systems.\n\n"
            "(d) Membership Continuance. Each member shall promptly update its membership application to "
            "reflect any material change in the information previously submitted."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "1000",
        "series_title": "Member Application and Associated Person Registration",
        "rule_number": "1010.10",
        "rule_title": "Filing Requirements and Associated Person Registration",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/1010",
        "raw_text": (
            "Rule 1010.10. Filing Requirements\n\n"
            "(a) Each applicant shall submit a complete application, including all required schedules and "
            "supporting documents, within the timeframe established by FINRA.\n\n"
            "(b) Applications shall be accompanied by all required fees as set forth in Section 4 of "
            "Schedule A to the FINRA By-Laws.\n\n"
            "(c) Incomplete applications may be returned to the applicant, and the application period "
            "may be tolled until such time as a complete application is filed."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "1000",
        "series_title": "Member Application and Associated Person Registration",
        "rule_number": "1014",
        "rule_title": "Standards for Admission",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/1014",
        "raw_text": (
            "Rule 1014. Department Decision\n\n"
            "(a) Standards for Admission. FINRA shall consider the following factors in reviewing an application "
            "for membership:\n\n"
            "(1) The applicant and its associated persons are capable of complying with applicable federal "
            "securities laws, the rules and regulations thereunder, and FINRA rules.\n\n"
            "(2) The applicant and its associated persons have established all contractual and regulatory "
            "requirements necessary for the conduct of business, including but not limited to clearing "
            "arrangements, required registrations, and licenses.\n\n"
            "(3) The applicant has a supervisory system, including written supervisory procedures and a system "
            "of follow-up and review, reasonably designed to achieve compliance with applicable securities laws "
            "and FINRA rules.\n\n"
            "(4) The applicant has adequate financial resources to meet its obligations to customers and "
            "counterparties.\n\n"
            "(5) The applicant has or will have operational capability, including books, records, and accounts, "
            "to meet its obligations.\n\n"
            "(6) No principal or registered representative of the applicant is subject to a statutory "
            "disqualification, unless the applicant has been granted relief.\n\n"
            "(7) All associated persons engaged in the securities business are or will be registered with FINRA."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "1000",
        "series_title": "Member Application and Associated Person Registration",
        "rule_number": "1122",
        "rule_title": "Filing of Misleading Information as to Membership or Registration",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/1122",
        "raw_text": (
            "Rule 1122. Filing of Misleading Information as to Membership or Registration\n\n"
            "No member or person associated with a member shall file with FINRA information with respect to "
            "membership or registration which is incomplete or inaccurate so as to be misleading, or which "
            "could in any way tend to mislead, or fail to correct such filing after notice thereof."
        ),
    },

    # =========================================================================
    # 2000 Series — Duties and Conflicts
    # =========================================================================
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2010",
        "rule_title": "Standards of Commercial Honor and Principles of Trade",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2010",
        "raw_text": (
            "Rule 2010. Standards of Commercial Honor and Principles of Trade\n\n"
            "A member, in the conduct of its business, shall observe high standards of commercial honor "
            "and just and equitable principles of trade."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2020",
        "rule_title": "Use of Manipulative, Deceptive or Other Fraudulent Devices",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2020",
        "raw_text": (
            "Rule 2020. Use of Manipulative, Deceptive or Other Fraudulent Devices\n\n"
            "No member shall effect any transaction in, or induce the purchase or sale of, any security "
            "by means of any manipulative, deceptive or other fraudulent device or contrivance."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2040",
        "rule_title": "Payments to Unregistered Persons",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2040",
        "raw_text": (
            "Rule 2040. Payments to Unregistered Persons\n\n"
            "(a) No member or person associated with a member shall, directly or indirectly, pay any "
            "compensation, fees, or concessions to any person that is not registered as a broker-dealer "
            "under Section 15 of the Exchange Act but is required to be registered, or to any associated "
            "person of a broker-dealer that is required to be registered with FINRA but is not.\n\n"
            "(b) This section shall not preclude payments to: (1) the estate or legal representative of "
            "a deceased registered representative; (2) retiring registered representatives who have "
            "terminated their registration with FINRA; or (3) domestic or foreign finders subject to "
            "applicable regulatory requirements."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2060",
        "rule_title": "Use of Information Obtained in Fiduciary Capacity",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2060",
        "raw_text": (
            "Rule 2060. Use of Information Obtained in Fiduciary Capacity\n\n"
            "A member or person associated with a member who, in the capacity of paying agent, transfer "
            "agent, trustee, or in any other similar capacity, has received information as to the ownership "
            "of securities, shall not make use of such information for the purpose of soliciting purchases, "
            "sales, or exchanges, except at the request, or with the consent, of the persons on whose behalf "
            "such information is held."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2070",
        "rule_title": "Transactions Involving FINRA Employees",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2070",
        "raw_text": (
            "Rule 2070. Transactions Involving FINRA Employees\n\n"
            "(a) No member shall open or maintain an account in which a FINRA employee or the "
            "spouse, child, or other relative of a FINRA employee has a financial interest "
            "without prior written consent of FINRA.\n\n"
            "(b) Each member shall identify and report to FINRA any account of a FINRA employee "
            "maintained by the member.\n\n"
            "(c) Members shall comply with such limitations, conditions, or restrictions as FINRA "
            "may impose on the opening or maintenance of such accounts."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2081",
        "rule_title": "Prohibited Conditions Relating to Expungement of Customer Dispute Information",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2081",
        "raw_text": (
            "Rule 2081. Prohibited Conditions Relating to Expungement of Customer Dispute Information\n\n"
            "No member or associated person shall condition or seek to condition settlement of a dispute "
            "with a customer, or any offer of compromise, on the customer's agreement to consent to, or "
            "not to oppose, the expungement of any information from the Central Registration Depository "
            "(CRD) system maintained by FINRA."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2090",
        "rule_title": "Know Your Customer",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2090",
        "raw_text": (
            "Rule 2090. Know Your Customer\n\n"
            "Every member shall use reasonable diligence, in regard to the opening and maintenance of "
            "every account, to know (and retain) the essential facts concerning every customer and "
            "concerning the authority of each person acting on behalf of such customer.\n\n"
            "Supplementary Material:\n"
            ".01 Essential Facts. Essential facts include those required to (a) effectively service the "
            "customer's account, (b) act in accordance with any special handling instructions for the "
            "account, (c) understand the authority of each person acting on behalf of the customer, "
            "and (d) comply with applicable laws, regulations, and rules."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2111",
        "rule_title": "Suitability",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2111",
        "raw_text": (
            "Rule 2111. Suitability\n\n"
            "(a) A member or an associated person must have a reasonable basis to believe that a recommended "
            "transaction or investment strategy involving a security or securities is suitable for the customer, "
            "based on the information obtained through the reasonable diligence of the member or associated person "
            "to ascertain the customer's investment profile. A customer's investment profile includes, but is not "
            "limited to, the customer's age, other investments, financial situation and needs, tax status, "
            "investment objectives, investment experience, investment time horizon, liquidity needs, risk "
            "tolerance, and any other information the customer may disclose to the member or associated person "
            "in connection with such recommendation.\n\n"
            "(b) A member or associated person fulfills the customer-specific suitability obligation for an "
            "institutional account, as defined in Rule 4512(c), if (1) the member or associated person has "
            "a reasonable basis to believe that the institutional customer is capable of evaluating investment "
            "risks independently, both in general and with regard to particular transactions and investment "
            "strategies involving a security or securities, and (2) the institutional customer affirmatively "
            "indicates that it is exercising independent judgment.\n\n"
            "Supplementary Material:\n"
            ".01 General Principles. Implicit in all member and associated person relationships with "
            "customers is the fundamental responsibility for fair dealing. Sales efforts must be undertaken "
            "only on a basis that can be judged as being within the ethical standards of FINRA rules.\n\n"
            ".02 Suitability Obligations. The three main suitability obligations are:\n"
            "  (a) Reasonable-basis suitability requires a member to have a reasonable basis to believe, "
            "based on reasonable diligence, that the recommendation is suitable for at least some investors.\n"
            "  (b) Customer-specific suitability requires that a member have a reasonable basis to believe "
            "that the recommendation is suitable for a particular customer.\n"
            "  (c) Quantitative suitability requires a member who has actual or de facto control over a "
            "customer account to have a reasonable basis for believing that a series of recommended "
            "transactions is not excessive.\n\n"
            ".03 Recommended Strategies. The term 'investment strategy involving a security or securities' "
            "is interpreted broadly and includes a recommendation to hold a security as well as explicit "
            "recommendations to purchase, sell, or exchange securities.\n\n"
            ".04 Customer's Investment Profile. A member or associated person shall make reasonable efforts "
            "to obtain and analyze all relevant customer information.\n\n"
            ".05 Components of Customer's Investment Profile. The factors listed in paragraph (a) are not "
            "exhaustive. A member or associated person may consider additional factors that are relevant "
            "to the customer's financial situation."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2121",
        "rule_title": "Fair Prices and Commissions",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2121",
        "raw_text": (
            "Rule 2121. Fair Prices and Commissions\n\n"
            "In securities transactions, whether in 'listed' or 'unlisted' securities, if a member buys for "
            "his own account from his customer, or sells for his own account to his customer, he shall buy "
            "or sell at a price which is fair, taking into consideration all relevant circumstances, including "
            "market conditions with respect to such security at the time of the transaction, the expense "
            "involved, and the fact that he is entitled to a profit.\n\n"
            "If the member is acting as agent for his customer in any such transaction, he shall not charge "
            "his customer more than a fair commission or service charge, taking into consideration all "
            "relevant circumstances, including market conditions, the expense of executing the order, "
            "the value of any service he may have rendered, and the amount of any risk assumed."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2122",
        "rule_title": "Charges for Services Performed",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2122",
        "raw_text": (
            "Rule 2122. Charges for Services Performed\n\n"
            "Charges, if any, for services performed, including miscellaneous services such as collection "
            "of moneys due for principal, dividends, or interest; exchange or transfer of securities; "
            "appraisals, safekeeping or custody of securities, and other services, shall be reasonable "
            "and not unfairly discriminatory between customers."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2124",
        "rule_title": "Net Transactions with Customers",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2124",
        "raw_text": (
            "Rule 2124. Net Transactions with Customers\n\n"
            "A member acting as agent for a customer shall not effect a net transaction unless the "
            "member has disclosed to the customer the difference between the price to the customer "
            "and the prevailing market price."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2150",
        "rule_title": "Improper Use of Customers' Securities or Funds; Prohibition Against Guarantees and Sharing in Accounts",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2150",
        "raw_text": (
            "Rule 2150. Improper Use of Customers' Securities or Funds; Prohibition Against Guarantees "
            "and Sharing in Accounts\n\n"
            "(a) Improper Use. No member or person associated with a member shall make improper use of a "
            "customer's securities or funds.\n\n"
            "(b) Prohibition Against Guarantees. No member or person associated with a member shall "
            "guarantee a customer against loss in any securities account of such customer carried by "
            "the member or in any securities transaction effected by the member with or for such customer.\n\n"
            "(c) Sharing in Accounts. Except as provided in paragraph (d), no member or person associated "
            "with a member shall share directly or indirectly in the profits or losses in any account of "
            "a customer carried by the member.\n\n"
            "(d) Exceptions. A person associated with a member may share in the profits or losses in an "
            "account of a customer if: (1) such person obtains prior written authorization from the member, "
            "(2) such person obtains prior written authorization from the customer, and (3) the member and "
            "person share in the profits and losses in the account in direct proportion to their respective "
            "financial contributions to the account."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2165",
        "rule_title": "Financial Exploitation of Specified Adults",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2165",
        "raw_text": (
            "Rule 2165. Financial Exploitation of Specified Adults\n\n"
            "(a) Definitions. (1) 'Specified Adult' means a natural person age 65 and older, or a natural "
            "person age 18 and older who the member reasonably believes has a mental or physical impairment "
            "that renders the individual unable to protect his or her own interests.\n"
            "(2) 'Trusted Contact Person' means a person authorized by the customer to be contacted by the "
            "member in specified circumstances.\n"
            "(3) 'Account' includes all of a Specified Adult's accounts at the member.\n\n"
            "(b) A member is permitted to place a temporary hold on the disbursement of funds or securities "
            "from the account of a Specified Adult if the member reasonably believes that financial "
            "exploitation of the Specified Adult has occurred, is occurring, has been attempted, or will "
            "be attempted.\n\n"
            "(c) Duration. The temporary hold authorized by paragraph (b) shall expire not later than 15 "
            "business days after the date that the member first placed the temporary hold on the "
            "disbursement of funds or securities, unless extended by a state regulator or agency or "
            "court of competent jurisdiction, or extended by FINRA for an additional 10 business days.\n\n"
            "(d) Notification. If a member places a temporary hold pursuant to paragraph (b), the member "
            "shall immediately initiate an internal review of the facts and circumstances and shall provide "
            "notification of the hold and the reason for the hold to the trusted contact person and all "
            "parties authorized to transact business on the account, unless a party is reasonably believed "
            "to be involved in the suspected financial exploitation."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2210",
        "rule_title": "Communications with the Public",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2210",
        "raw_text": (
            "Rule 2210. Communications with the Public\n\n"
            "(a) Definitions. For purposes of this rule:\n"
            "(1) 'Institutional communication' means any written (including electronic) communication that is "
            "distributed or made available only to institutional investors.\n"
            "(2) 'Retail communication' means any written (including electronic) communication that is "
            "distributed or made available to more than 25 retail investors within any 30-calendar-day period.\n"
            "(3) 'Correspondence' means any written (including electronic) communication that is distributed "
            "or made available to 25 or fewer retail investors within any 30-calendar-day period.\n\n"
            "(b) Approval, Review and Recordkeeping. (1) A registered principal must approve each retail "
            "communication before the earlier of its use or filing with FINRA.\n"
            "(2) Each member must establish written procedures appropriate to its business for review of "
            "correspondence and institutional communications.\n\n"
            "(d) Content Standards. (1) All member communications must be based on principles of fair dealing "
            "and good faith, must be fair and balanced, and must provide a sound basis for evaluating the facts.\n"
            "(2) No member may make any false, exaggerated, unwarranted, promissory, or misleading statement "
            "or claim in any communication. No member may publish, circulate, or distribute any communication "
            "that the member knows or has reason to know contains any untrue statement of a material fact or "
            "is otherwise false or misleading.\n\n"
            "(e) Specific Standards. (1) Projections. Any projection of performance must be clearly labeled "
            "and must include a reasonable basis. (2) Comparisons between investments must disclose all "
            "material differences. (3) Testimonials must disclose (A) the fact that the testimonial may not "
            "be representative of others, (B) any compensation paid for the testimonial, and (C) any "
            "material conflicts of interest."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2232",
        "rule_title": "Customer Confirmations",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2232",
        "raw_text": (
            "Rule 2232. Customer Confirmations\n\n"
            "(a) Disclosure of Pricing Information. A member that executes a transaction in a debt security "
            "on a principal basis for or with a customer (other than in a transaction in a list offering "
            "price security) shall disclose on the customer confirmation for the transaction the following "
            "pricing information:\n"
            "(1) The member's price of execution.\n"
            "(2) The prevailing market price of the security at the time of the transaction.\n"
            "(3) The differential between the price to the customer and the prevailing market price.\n\n"
            "(b) A member that acts as agent for a customer in a transaction in a debt security shall "
            "disclose on the confirmation the total amount of any remuneration received by the member.\n\n"
            "(c) Prevailing Market Price Determination. A member must use reasonable diligence to determine "
            "the prevailing market price for a debt security at the time of the transaction. The prevailing "
            "market price of a debt security shall be established by reference to the member's contemporaneous "
            "cost or contemporaneous proceeds, where applicable."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2241",
        "rule_title": "Research Analysts and Research Reports — Debt",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2241",
        "raw_text": (
            "Rule 2241. Research Analysts and Research Reports\n\n"
            "(a) Purpose. This rule governs research analysts, the content of research reports, and the "
            "interaction between the research department and other departments.\n\n"
            "(b) Definitions. (1) 'Research analyst' means a member's employee or contractor who is "
            "primarily responsible for, and any member employee who reports directly or indirectly to "
            "such person and who is primarily responsible for, preparation of the substance of a research "
            "report. (2) 'Research report' means any analysis of equity securities of individual companies "
            "or industries that provides information reasonably sufficient upon which to base an investment "
            "decision.\n\n"
            "(c) Restrictions on Activities. (1) No research analyst may be subject to the supervision or "
            "control of any employee of the member's investment banking department. (2) No investment banking "
            "personnel may review or approve a research report before publication. (3) No member shall "
            "directly or indirectly retaliate against or threaten to retaliate against any research analyst "
            "as a consequence of an unfavorable research report.\n\n"
            "(d) Disclosure Requirements. (1) Each research report must disclose any material conflict of "
            "interest of the research analyst or the member that the research analyst knows or has reason "
            "to know at the time of the publication. (2) Each research report must disclose whether the "
            "member or its affiliates received compensation from the subject company in the past twelve months."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2266",
        "rule_title": "SIPC Information",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2266",
        "raw_text": (
            "Rule 2266. SIPC Information\n\n"
            "(a) Members shall provide each new customer, at the time of opening an account, a copy of the "
            "explanatory brochure prepared by the Securities Investor Protection Corporation (SIPC), or a "
            "hyperlink to SIPC's website.\n\n"
            "(b) Members shall provide customers with information about SIPC coverage in a timely manner "
            "and shall not make misleading statements regarding SIPC coverage.\n\n"
            "(c) Members shall advise customers that SIPC coverage does not protect against market losses "
            "and shall provide information about the limitations of SIPC coverage."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2267",
        "rule_title": "Investor Education and Protection",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2267",
        "raw_text": (
            "Rule 2267. Investor Education and Protection\n\n"
            "(a) BrokerCheck Disclosure. Each member shall include on its website a readily apparent "
            "reference and hyperlink to FINRA's BrokerCheck system.\n\n"
            "(b) Each member shall promptly provide to each customer, upon request, the FINRA BrokerCheck "
            "Hotline Number and BrokerCheck website address.\n\n"
            "(c) Each member shall include the BrokerCheck information in all new account documentation "
            "and in correspondence sent to customers that includes account information."
        ),
    },

    # =========================================================================
    # 3000 Series — Supervision and Responsibilities
    # =========================================================================
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3110",
        "rule_title": "Supervision",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3110",
        "raw_text": (
            "Rule 3110. Supervision\n\n"
            "(a) Supervisory System. Each member shall establish and maintain a system to supervise the "
            "activities of each associated person that is reasonably designed to achieve compliance with "
            "applicable securities laws and regulations, and with applicable FINRA rules. Final "
            "responsibility for proper supervision shall rest with the member.\n\n"
            "(b) Written Procedures. (1) Each member shall establish, maintain, and enforce written "
            "procedures to supervise the types of business in which it engages and the activities of its "
            "associated persons that are reasonably designed to achieve compliance with applicable securities "
            "laws and regulations, and with applicable FINRA rules.\n"
            "(2) Such written supervisory procedures shall set forth the supervisory system established by "
            "the member, including the titles, registration status, and locations of the required supervisory "
            "personnel and the responsibilities of each supervisory person.\n\n"
            "(c) Internal Inspections. (1) Each member shall conduct a review, at least annually, of the "
            "businesses in which it engages, which review shall be reasonably designed to assist in detecting "
            "and preventing violations of and achieving compliance with applicable securities laws and "
            "regulations, and with applicable FINRA rules.\n"
            "(2) Each member shall inspect at least annually every office of supervisory jurisdiction (OSJ) "
            "and every branch office.\n"
            "(3) Each member shall inspect at least every three years every non-branch location.\n\n"
            "(d) Review of Correspondence and Internal Communications. (1) Each member shall develop and "
            "implement written procedures for review of incoming and outgoing written (including electronic) "
            "correspondence and internal communications.\n"
            "(2) Such procedures shall include review of incoming and outgoing written and electronic "
            "correspondence of the member with the public relating to the member's investment banking or "
            "securities business.\n\n"
            "(e) Designation of Supervisory Personnel. Each member shall designate appropriately registered "
            "principal(s) with authority to carry out the supervisory responsibilities of the member.\n\n"
            "(f) Transaction Review and Investigation. A member's supervisory procedures shall include "
            "procedures for the review of transactions to detect and prevent insider trading, market "
            "manipulation, front-running, and excessive trading.\n\n"
            "Supplementary Material:\n"
            ".05 Risk-Based Review. A member may apply a risk-based approach in establishing its supervisory "
            "system, including the written supervisory procedures and processes by which such procedures are "
            "implemented, to tailor its supervisory review of certain activities and risks."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3120",
        "rule_title": "Supervisory Control System",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3120",
        "raw_text": (
            "Rule 3120. Supervisory Control System\n\n"
            "(a) Each member shall designate and specifically identify to FINRA one or more principals who "
            "shall establish, maintain, and enforce a system of supervisory control policies and procedures "
            "that: (1) test and verify that the member's supervisory procedures are reasonably designed with "
            "respect to the activities of the member and its associated persons to achieve compliance with "
            "applicable securities laws and regulations, and with applicable FINRA rules; and (2) create "
            "additional or amend supervisory procedures where the need is identified by such testing and "
            "verification.\n\n"
            "(b) Such policies and procedures shall include procedures that are reasonably designed to: "
            "(1) Review the member's supervisory personnel to ensure that the supervisory personnel are "
            "appropriately registered and qualified. (2) Review customer account activity for the "
            "appropriateness of transactions. (3) Review the handling and resolution of customer "
            "complaints. (4) Review the member's written supervisory procedures."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3130",
        "rule_title": "Annual Certification of Compliance and Supervisory Processes",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3130",
        "raw_text": (
            "Rule 3130. Annual Certification of Compliance and Supervisory Processes\n\n"
            "(a) Annual Report. Each member shall designate a chief compliance officer (CCO). The CCO "
            "shall submit to the member's senior management a report, at least annually, that: "
            "(1) summarizes the member's existing supervisory system and procedures, including any "
            "material changes made during the preceding year; (2) includes a discussion of applicable "
            "amendments to rules and regulations, including but not limited to FINRA rules; and "
            "(3) identifies any significant compliance issues.\n\n"
            "(b) Annual Certification. The CEO (or equivalent officer) of each member shall certify "
            "annually that the member has in place processes to: (1) establish, maintain, review, test, "
            "and modify written compliance policies and written supervisory procedures; (2) modify such "
            "policies and procedures as business, regulatory, and legislative changes dictate; and "
            "(3) that the CEO has conducted one or more meetings with the CCO during the preceding "
            "12 months."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3150",
        "rule_title": "Holding of Customer Mail",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3150",
        "raw_text": (
            "Rule 3150. Holding of Customer Mail\n\n"
            "(a) A member may hold a customer's mail in accordance with the customer's written "
            "instructions, provided the member meets the following conditions:\n"
            "(1) The customer's written instructions include a time period for the hold, which shall "
            "not exceed three consecutive months unless the customer is traveling and provides written "
            "instructions specifying the duration and, if the period exceeds three months, specifying "
            "an alternative address for mail delivery.\n"
            "(2) The member verifies at reasonable intervals that the customer's instructions are "
            "still valid.\n"
            "(3) The member ensures that the customer's mail is not tampered with and is forwarded "
            "to the customer upon request.\n"
            "(4) The member provides the customer's mail to the customer promptly at the end of the "
            "hold period."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3170",
        "rule_title": "Tape Recording of Registered Persons by Certain Firms",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3170",
        "raw_text": (
            "Rule 3170. Tape Recording of Registered Persons by Certain Firms\n\n"
            "(a) Definition. A 'taping firm' is a member that has, or had at any time during the "
            "preceding three years, at least a specified percentage of its registered persons who "
            "were previously associated with a firm that was expelled or had its registration revoked.\n\n"
            "(b) Requirements. A taping firm shall establish, maintain, and enforce special written "
            "procedures for supervising the telemarketing activities of all of its registered persons. "
            "Such procedures shall include tape recording all telephone conversations between the "
            "firm's registered persons and both existing and potential customers.\n\n"
            "(c) The tape recordings shall be maintained for a period of not less than three years."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3210",
        "rule_title": "Accounts At Other Broker-Dealers and Financial Institutions",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3210",
        "raw_text": (
            "Rule 3210. Accounts At Other Broker-Dealers and Financial Institutions\n\n"
            "(a) Accounts of Associated Persons at Other Members. Every person associated with a member "
            "shall report to the member, in writing, prior to opening an account or placing an initial "
            "order for the purchase or sale of securities with another member, and shall notify the "
            "member in writing of the existence of any account established prior to the person's "
            "association with the member.\n\n"
            "(b) Account Notification. The member shall, upon receiving written notice from an associated "
            "person of the opening of such an account, notify in writing the other member or financial "
            "institution carrying the account, and request that duplicate copies of all confirmations "
            "and statements for such account be sent to the member.\n\n"
            "(c) Compliance by Other Member. The member carrying the account shall, upon notification, "
            "transmit duplicate copies of confirmations and statements, or such alternative documentation "
            "as the member that employs the person may agree to in writing."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3220",
        "rule_title": "Influencing or Rewarding Employees of Others",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3220",
        "raw_text": (
            "Rule 3220. Influencing or Rewarding Employees of Others\n\n"
            "(a) No member or person associated with a member shall, directly or indirectly, give or "
            "permit to be given anything of value, including gratuities, in excess of one hundred "
            "dollars per individual per year to any person, principal, proprietor, employee, agent, or "
            "representative of another person where such payment or gratuity is in relation to the "
            "business of the employer of the recipient of the payment or gratuity.\n\n"
            "(b) A separate record of all such payments or gratuities in any amount shall be maintained "
            "by the member."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3230",
        "rule_title": "Outside Business Activities of Registered Persons",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3230",
        "raw_text": (
            "Rule 3230 (formerly 3270). Outside Business Activities of Registered Persons\n\n"
            "(a) No registered person may be an employee, independent contractor, sole proprietor, "
            "officer, director or partner of another person, or be compensated, or have the reasonable "
            "expectation of compensation, from any other person as a result of any business activity "
            "outside the scope of the relationship with his or her member firm, unless he or she has "
            "provided prior written notice to the member.\n\n"
            "(b) Upon receipt of such notice, the member shall consider whether the proposed activity "
            "will: (1) interfere with or otherwise compromise the registered person's responsibilities "
            "to the member and/or the member's customers, or (2) be viewed by customers or the public "
            "as part of the member's business.\n\n"
            "(c) The member shall evaluate the proposed outside business activity to determine whether "
            "it should be treated as an activity for which the registered person should be registered "
            "with the member."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3240",
        "rule_title": "Private Securities Transactions of Associated Persons",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3240",
        "raw_text": (
            "Rule 3240 (formerly 3280). Private Securities Transactions of Associated Persons\n\n"
            "(a) No person associated with a member shall participate in any manner in a private securities "
            "transaction except in accordance with the requirements of this rule.\n\n"
            "(b) Written Notice Required. Prior to participating in any private securities transaction, "
            "an associated person shall provide written notice to the member with which he is associated "
            "describing in detail the proposed transaction and the person's proposed role therein, and "
            "stating whether he has received or may receive selling compensation in connection with the "
            "transaction.\n\n"
            "(c) If the member, after review, approves the associated person's participation in a "
            "private securities transaction for compensation, the transaction shall be recorded on the "
            "books and records of the member, and the member shall supervise the person's participation "
            "in the transaction as if the transaction were executed on behalf of the member.\n\n"
            "(d) If the transaction is not for compensation, the member shall acknowledge receipt of "
            "the written notice in writing and may impose conditions on the person's participation."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3260",
        "rule_title": "Political Contributions — Limitations",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3260",
        "raw_text": (
            "Rule 3260 (formerly 2030). Participation in Political Contributions\n\n"
            "No member, and no person associated with a member, shall participate in any arrangement "
            "or agreement to circumvent the intent of Rule G-37 of the MSRB. "
            "Members engaged in municipal securities business shall comply with MSRB rules relating "
            "to political contributions and prohibitions on municipal securities business."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3310",
        "rule_title": "Anti-Money Laundering Compliance Program",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3310",
        "raw_text": (
            "Rule 3310. Anti-Money Laundering Compliance Program\n\n"
            "(a) AML Compliance Program. Each member shall develop and implement a written "
            "anti-money laundering program reasonably designed to achieve and monitor the member's "
            "compliance with the requirements of the Bank Secrecy Act (31 U.S.C. 5311, et seq.) and "
            "the implementing regulations promulgated thereunder by the Department of the Treasury.\n\n"
            "(b) At a minimum, the AML compliance program shall:\n"
            "(1) Establish and implement policies and procedures that can be reasonably expected to "
            "detect and cause the reporting of transactions required under 31 U.S.C. 5318(g) and the "
            "implementing regulations thereunder.\n"
            "(2) Establish and implement policies, procedures, and internal controls reasonably designed "
            "to achieve compliance with the Bank Secrecy Act and the implementing regulations.\n"
            "(3) Provide for annual (on a calendar-year basis) independent testing for compliance to be "
            "conducted by member personnel or by a qualified outside party.\n"
            "(4) Designate and identify to FINRA (by name, title, mailing address, e-mail address, "
            "telephone number, and facsimile) an individual or individuals responsible for implementing "
            "and monitoring the day-to-day operations and internal controls of the program.\n"
            "(5) Provide ongoing training for appropriate personnel."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities Relating to Associated Persons",
        "rule_number": "3320",
        "rule_title": "Forwarding of Customer Funds and Securities (MSP)",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3320",
        "raw_text": (
            "Rule 3320. Forwarding of Customer Funds and Securities\n\n"
            "Members operating pursuant to the exemptive provisions of SEA Rule 15c3-3(k)(2)(i) "
            "(the so-called 'MSP exemption') shall promptly forward customer funds and securities "
            "to the carrying or clearing firm."
        ),
    },

    # =========================================================================
    # 4000 Series — Financial and Operational Rules
    # =========================================================================
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4110",
        "rule_title": "Capital Compliance",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4110",
        "raw_text": (
            "Rule 4110. Capital Compliance\n\n"
            "(a) Minimum Net Capital. Each member shall maintain net capital in compliance with "
            "the requirements of SEA Rule 15c3-1.\n\n"
            "(b) Notification. A member shall immediately notify FINRA if at any time its net capital "
            "falls below the minimum required under SEA Rule 15c3-1, or if the member's books and "
            "records are not current.\n\n"
            "(c) A member shall not permit any withdrawal of equity capital, or make any unsecured "
            "advance or loan to a stockholder, partner, sole proprietor, or employee if, after giving "
            "effect thereto and to any other such withdrawals, advances, or loans, the member's net "
            "capital would be less than 120 percent of the minimum required."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4210",
        "rule_title": "Margin Requirements",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210",
        "raw_text": (
            "Rule 4210. Margin Requirements\n\n"
            "(a) Definitions. (1) 'Margin' means the amount of equity that a customer must deposit "
            "and maintain in a margin account. (2) 'Margin call' means a demand by the member to "
            "the customer to deposit additional funds or securities.\n\n"
            "(b) Initial Margin. The margin which must be deposited by a customer before a member "
            "may extend credit shall not be less than the greater of: (1) the amount specified by "
            "Regulation T of the Board of Governors of the Federal Reserve System, or (2) the amount "
            "specified in this Rule.\n\n"
            "(c) Maintenance Margin. (1) The margin maintained in each customer's margin account shall "
            "be not less than 25 percent of the current market value of all securities long in the "
            "account. (2) For short positions, the maintenance margin requirement shall be 30 percent "
            "of the current market value of the securities held short.\n\n"
            "(d) Day-Trading. A pattern day trader shall maintain minimum equity of $25,000 in any "
            "day on which the customer day trades. If the account falls below the $25,000 requirement, "
            "the customer shall not be permitted to day trade until the account is restored to the "
            "$25,000 minimum equity level.\n\n"
            "(f) Concentrated Accounts. A member shall have procedures to identify and monitor accounts "
            "that hold concentrated positions and may impose higher margin requirements on such accounts."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4311",
        "rule_title": "Carrying Agreements",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4311",
        "raw_text": (
            "Rule 4311. Carrying Agreements\n\n"
            "(a) Required Terms. Each carrying agreement entered into by a member shall set forth "
            "the respective functions and responsibilities of each party, and shall, at a minimum, "
            "specify: (1) the books and records to be maintained by each party; (2) the reports and "
            "documents to be furnished to FINRA by each party; (3) the regulatory reports and notices "
            "to be filed by each party; and (4) the procedures for handling and safeguarding funds and "
            "securities.\n\n"
            "(b) Each carrying agreement shall require the clearing or carrying firm to carry and "
            "maintain all customer accounts in compliance with applicable securities laws and "
            "regulations, including SEA Rule 15c3-3 (Customer Protection Rule).\n\n"
            "(c) Notice to FINRA. Members shall provide prompt notice to FINRA when entering into, "
            "modifying, or terminating a carrying agreement."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4370",
        "rule_title": "Business Continuity Plans and Emergency Contact Information",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4370",
        "raw_text": (
            "Rule 4370. Business Continuity Plans and Emergency Contact Information\n\n"
            "(a) Business Continuity Plan. Each member shall create and maintain a written business "
            "continuity plan identifying procedures relating to an emergency or significant business "
            "disruption. Such procedures shall be reasonably designed to enable the member to meet "
            "its existing obligations to customers. The plan shall address, at a minimum:\n"
            "(1) Data back-up and recovery (hard copy and electronic).\n"
            "(2) All mission critical systems.\n"
            "(3) Financial and operational assessments.\n"
            "(4) Alternate communications between customers and the member.\n"
            "(5) Alternate communications between the member and its employees.\n"
            "(6) Alternate physical location of employees.\n"
            "(7) Critical business constituent, bank, and counterparty impact.\n"
            "(8) Regulatory reporting.\n"
            "(9) Communications with regulators.\n"
            "(10) How the member will assure customers' prompt access to their funds and securities.\n\n"
            "(b) Emergency Contact Information. Each member shall report to FINRA emergency contact "
            "information of two executive representatives. This information shall be updated promptly "
            "in the event of any material change.\n\n"
            "(c) Annual Review. Each member shall review its business continuity plan at least "
            "annually, and update the plan as necessary."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4512",
        "rule_title": "Customer Account Information",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4512",
        "raw_text": (
            "Rule 4512. Customer Account Information\n\n"
            "(a) Each member shall maintain a record for each customer account. Each such record shall "
            "include, at a minimum:\n"
            "(1) Customer's name and residence.\n"
            "(2) Whether the customer is of legal age.\n"
            "(3) The name of the associated person, if any, responsible for the account.\n"
            "(4) The signature of the partner, officer, or manager denoting that the account has been "
            "accepted in accordance with the member's policies and procedures for acceptance of accounts.\n"
            "(5) If the customer is a corporation, partnership, or other legal entity, the names of "
            "persons authorized to transact business for the entity.\n"
            "(6) For each account in which transactions in securities are effected for the customer, "
            "the customer's tax identification number, investment objectives, employment status, annual "
            "income, and net worth.\n\n"
            "(b) Trusted Contact Person. For each non-institutional customer account opened after the "
            "effective date of this paragraph, a member shall make reasonable efforts to obtain the "
            "name of and contact information for a trusted contact person upon the opening of the "
            "customer's account. The member shall disclose to the customer that the member or an "
            "associated person of the member is authorized to contact the trusted contact person and "
            "disclose information about the customer's account to address possible financial "
            "exploitation, to confirm the specifics of the customer's current contact information, "
            "health status, or the identity of any legal guardian, executor, trustee, or holder of a "
            "power of attorney.\n\n"
            "(c) Definition of 'Institutional Account.' An institutional account is an account of: "
            "(1) a bank, savings and loan, insurance company, or registered investment company, "
            "(2) an investment adviser registered with the SEC or under state law, or (3) any other "
            "person (natural person or entity) with total assets of at least $50 million."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4530",
        "rule_title": "Reporting Requirements",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4530",
        "raw_text": (
            "Rule 4530. Reporting Requirements\n\n"
            "(a) Each member shall promptly report to FINRA, but in any event not later than 30 "
            "calendar days after the member knows or should have known of the existence of any of "
            "the following:\n"
            "(1) The member or an associated person of the member has been found to have violated any "
            "securities, insurance, commodities, financial, or investment-related laws, rules, "
            "regulations, or standards of conduct.\n"
            "(2) The member or an associated person of the member is the subject of any written "
            "customer complaint involving allegations of theft or misappropriation of funds or "
            "securities, or forgery.\n"
            "(3) The member or an associated person has been named as a defendant or respondent in "
            "any proceeding brought by a domestic or foreign regulatory body.\n"
            "(4) The member or associated person has been denied registration or had a registration "
            "revoked or suspended by any domestic or foreign regulatory body.\n"
            "(5) The member has been notified in writing that it is the subject of a formal "
            "investigation by a domestic or foreign regulatory body.\n\n"
            "(b) Statistical and Summary Information. Each member shall report to FINRA such "
            "statistical and summary information as FINRA shall specify regarding written customer "
            "complaints."
        ),
    },

    # =========================================================================
    # 5000 Series — Securities Trading Activities
    # =========================================================================
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5110",
        "rule_title": "New Issue Rule (Corporate Financing/Underwriting Terms)",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5110",
        "raw_text": (
            "Rule 5110. Corporate Financing Rule — Underwriting Terms and Arrangements\n\n"
            "(a) Filing Requirements. (1) No member shall participate in any way in a public offering "
            "of securities unless specified documents have been filed with and, if required, reviewed by "
            "FINRA. Documents that must be filed include the registration statement, underwriting "
            "agreement, selected dealers agreement, and all related documents.\n\n"
            "(b) Underwriting Compensation and Arrangements. (1) No member or person associated with "
            "a member shall receive or arrange for compensation from an issuer for underwriting that is "
            "unfair or unreasonable. (2) Total underwriting compensation shall include all items of "
            "value received by the underwriter, including discounts, commissions, fees, rights of first "
            "refusal, and any other compensation received in connection with the offering.\n\n"
            "(c) Lock-Up Restrictions. Securities acquired by participating members and their associated "
            "persons in the offering are subject to lock-up restrictions of 180 days from the date of the "
            "offering.\n\n"
            "(d) Non-Cash Compensation. (1) No member or person associated with a member shall accept "
            "any non-cash compensation from an issuer in connection with a public offering, except as "
            "permitted by this rule."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5130",
        "rule_title": "Restrictions on the Purchase and Sale of Initial Equity Public Offerings",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5130",
        "raw_text": (
            "Rule 5130. Restrictions on the Purchase and Sale of Initial Equity Public Offerings\n\n"
            "(a) General Prohibition. A member or person associated with a member may not sell, or "
            "cause to be sold, a new issue to any account in which a restricted person has a "
            "beneficial interest.\n\n"
            "(b) Definitions. (1) 'New issue' means any initial public offering of an equity security. "
            "(2) 'Restricted person' includes: (A) FINRA members or persons associated with a member; "
            "(B) broker-dealers or persons associated with a broker-dealer; (C) an owner of a "
            "broker-dealer; (D) portfolio managers; (E) persons with authority over the account of an "
            "institutional investor; and (F) a member of the immediate family of any of the foregoing.\n\n"
            "(c) General Exemptions. The following accounts are exempt from the general prohibition: "
            "(1) Investment companies registered with the SEC; (2) common trust funds and similar "
            "banking products; (3) insurance company general accounts; (4) publicly traded entities.\n\n"
            "(d) De Minimis Exemption. An account in which a restricted person has a beneficial "
            "interest that does not exceed 10% may purchase a new issue."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5131",
        "rule_title": "New Issue Allocations and Distributions",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5131",
        "raw_text": (
            "Rule 5131. New Issue Allocations and Distributions\n\n"
            "(a) Quid Pro Quo Allocations. No member or person associated with a member may allocate "
            "shares of a new issue to any account in which an executive officer or director of a public "
            "company, or a covered non-public company, has a beneficial interest as consideration for "
            "the direction of securities business to the member.\n\n"
            "(b) Spinning. No member or person associated with a member may allocate securities of a "
            "new issue to any account in which an executive officer or director of a company has a "
            "beneficial interest if the member has received compensation from the company for investment "
            "banking services in the past 12 months, or expects to receive such compensation in the "
            "next 3 months.\n\n"
            "(c) IPO Pricing and Trading. (1) The book-running lead manager of an IPO must provide to "
            "the issuer's pricing committee a regular report of indications of interest, including the "
            "names of interested investors. (2) Members must make bona fide allocations for each "
            "customer order."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5150",
        "rule_title": "Fairness Opinions",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5150",
        "raw_text": (
            "Rule 5150. Fairness Opinions\n\n"
            "(a) Disclosure Requirements. A member that provides a fairness opinion to a company that "
            "is a party to a transaction shall disclose in the fairness opinion (or a written document "
            "accompanying the opinion):\n"
            "(1) Whether the member has had a material relationship with any party to the transaction "
            "during the past two years, or if there is a mutually understood future relationship.\n"
            "(2) Any compensation received or to be received by the member as a result of such "
            "relationship or any compensation that is contingent upon the conclusion of the transaction.\n"
            "(3) Whether any information used in the preparation of the opinion has been independently "
            "verified by the member.\n"
            "(4) Whether the opinion was approved by a fairness committee."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5190",
        "rule_title": "Notification Requirements for Offering Participants",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5190",
        "raw_text": (
            "Rule 5190. Notification Requirements for Offering Participants\n\n"
            "(a) A member that is the book-running lead manager of a public offering of securities "
            "shall provide notification to FINRA regarding: (1) penalty bids; (2) syndicate covering "
            "transactions; (3) the exercise of any overallotment option; and (4) any other information "
            "that FINRA may require.\n\n"
            "(b) Such notification shall be provided within one business day after the relevant event."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5210",
        "rule_title": "Publication of Transactions and Quotations",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5210",
        "raw_text": (
            "Rule 5210. Publication of Transactions and Quotations\n\n"
            "No member shall publish or circulate, or cause to be published or circulated, any notice, "
            "circular, advertisement, newspaper article, investment service, or communication of any "
            "kind which purports to report any transaction as a purchase or sale of any security unless "
            "such member believes such transaction was a bona fide purchase or sale of such security; "
            "or which purports to quote the bid price or asked price for any security, unless such member "
            "believes such quotation represents a bona fide bid for, or offer of, such security."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5230",
        "rule_title": "Payments Involving Publications that Influence the Market Price of a Security",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5230",
        "raw_text": (
            "Rule 5230. Payments Involving Publications that Influence the Market Price of a Security\n\n"
            "No member shall, directly or indirectly, give or permit to be given anything of value for "
            "the purpose of influencing or rewarding the action of any person in connection with the "
            "publication or circulation of any information, article, or communication that recommends "
            "the purchase or sale of, or may tend to affect the market price of, any security, unless "
            "such payment is disclosed in the publication."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5250",
        "rule_title": "Payments for Market Making",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5250",
        "raw_text": (
            "Rule 5250. Payments for Market Making\n\n"
            "No member or person associated with a member shall accept any payment or other "
            "consideration, directly or indirectly, from an issuer of a security, or any affiliate "
            "or promoter thereof, for publishing a quotation, acting as market maker in a security, "
            "or submitting an application in connection therewith."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5260",
        "rule_title": "Prohibition on Purchase of IPO at a Price Below the Public Offering Price",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5260",
        "raw_text": (
            "Rule 5260. Prohibition on Purchase of IPO at a Price Below the Public Offering Price\n\n"
            "During the period from the effective date of the registration statement to the closing "
            "of the distribution, no member that is an underwriter or a member of the selling group "
            "shall purchase for its own account any securities that are the subject of the distribution "
            "at a price below the fixed public offering price, except as part of the ordinary course "
            "of market making."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5270",
        "rule_title": "Front Running of Block Transactions",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5270",
        "raw_text": (
            "Rule 5270. Front Running of Block Transactions\n\n"
            "No member or person associated with a member shall cause to be executed an order to "
            "buy or sell a security or a related financial instrument when such member or person "
            "associated with a member has material, non-public market information concerning an "
            "imminent block transaction in that security or a related financial instrument prior "
            "to the time information concerning the block transaction has been made publicly available "
            "or has otherwise become stale or obsolete.\n\n"
            "Supplementary Material:\n"
            ".01 'Block transaction' is a transaction of 10,000 shares or more, or an order having "
            "a market value of $200,000 or more.\n"
            ".02 A member may trade for its own account for legitimate purposes such as fulfilling "
            "a customer order or legitimate hedging activities."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5280",
        "rule_title": "Trading Ahead of Research Reports",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5280",
        "raw_text": (
            "Rule 5280. Trading Ahead of Research Reports\n\n"
            "No member shall establish, increase, decrease, or liquidate an inventory position in any "
            "security or related financial instrument based on non-public advance knowledge of the "
            "content or timing of a research report in that security."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5310",
        "rule_title": "Best Execution and Interpositioning",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5310",
        "raw_text": (
            "Rule 5310. Best Execution and Interpositioning\n\n"
            "(a)(1) In any transaction for or with a customer or a customer of another broker-dealer, "
            "a member and persons associated with a member shall use reasonable diligence to ascertain "
            "the best market for the subject security and buy or sell in such market so that the "
            "resultant price to the customer is as favorable as possible under prevailing market "
            "conditions.\n\n"
            "(a)(2) Among the factors that will be considered in determining whether a member has used "
            "reasonable diligence are:\n"
            "(A) the character of the market for the security (e.g., price, volatility, relative "
            "liquidity, and pressure on available communications);\n"
            "(B) the size and type of transaction;\n"
            "(C) the number of markets checked;\n"
            "(D) accessibility of the quotation;\n"
            "(E) the terms and conditions of the order which result in the transaction.\n\n"
            "(b) Interpositioning. In any transaction for or with a customer, no member or associated "
            "person shall interject a third party between the member and the best market for the "
            "security in a manner inconsistent with the member's obligations under paragraph (a) "
            "unless the member can demonstrate that the total cost or proceeds of the transaction "
            "to the customer is equal to or better than the cost or proceeds that could have been "
            "obtained without such interposition.\n\n"
            "Supplementary Material:\n"
            ".06 Regular and Rigorous Review. A member must regularly and rigorously evaluate the "
            "execution quality of customer orders to determine whether its order routing practices "
            "are achieving best execution. Such reviews shall consider, at a minimum: (1) execution "
            "price, (2) execution speed, (3) order size, (4) the character of the market, and (5) "
            "the likelihood of execution."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5320",
        "rule_title": "Prohibition Against Trading Ahead of Customer Orders",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5320",
        "raw_text": (
            "Rule 5320. Prohibition Against Trading Ahead of Customer Orders\n\n"
            "(a) Except as provided herein, a member that accepts and holds an order in an equity "
            "security from its own customer or a customer of another broker-dealer without "
            "immediately executing the order is prohibited from trading that security on the same "
            "side of the market for its own account at a price that would satisfy the customer order, "
            "unless it immediately thereafter executes the customer order up to the size and at the "
            "same or better price at which it traded for its own account.\n\n"
            "(b) The requirements of paragraph (a) shall not apply if: (1) the member's proprietary "
            "trade is for the purposes of fulfilling the market-making obligations of the member; "
            "(2) the customer has provided informed consent to the member's trading ahead of the "
            "order; or (3) the transaction involves a no-knowledge exemption where effective "
            "information barriers exist."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Trading Activities",
        "rule_number": "5330",
        "rule_title": "Adjustment of Orders",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5330",
        "raw_text": (
            "Rule 5330. Adjustment of Orders\n\n"
            "(a) Open orders shall be adjusted for dividends, payments, or distributions on the "
            "ex-date, on the terms set forth in this rule, unless the terms of the order specify "
            "otherwise or the customer has given contrary instructions.\n\n"
            "(b) Sell orders shall be reduced by the amount of the distribution. Buy limit orders "
            "shall be reduced by the amount of the distribution. Sell stop orders shall be reduced "
            "by the amount of the distribution."
        ),
    },

    # =========================================================================
    # 6000 Series — Quotation, Order, and Transaction Reporting Facilities
    # =========================================================================
    {
        "regulator": "FINRA",
        "series": "6000",
        "series_title": "Quotation, Order, and Transaction Reporting Facilities",
        "rule_number": "6110",
        "rule_title": "Transactions in Listed Securities",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/6110",
        "raw_text": (
            "Rule 6110. OTC Transactions in Listed Securities\n\n"
            "Members may effect OTC transactions in listed securities subject to applicable rules "
            "and regulations, including trade reporting requirements to the applicable FINRA facility."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "6000",
        "series_title": "Quotation, Order, and Transaction Reporting Facilities",
        "rule_number": "6250",
        "rule_title": "OTC Bulletin Board Service",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/6250",
        "raw_text": (
            "Rule 6250. OTC Bulletin Board Service\n\n"
            "(a) The OTCBB service is an electronic inter-dealer quotation system that displays "
            "real-time quotes, last-sale prices, and volume information for many over-the-counter "
            "(OTC) equity securities.\n\n"
            "(b) Eligible Securities. Only securities that are reported to an applicable FINRA "
            "facility and for which current information is available (either SEC reports or "
            "Alternative Reporting Standard documents) are eligible for quotation on the OTCBB.\n\n"
            "(c) Quotation Requirements. A market maker seeking to enter quotations in a non-exchange "
            "listed security on the OTCBB shall have in its records specified information regarding "
            "the issuer."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "6000",
        "series_title": "Quotation, Order, and Transaction Reporting Facilities",
        "rule_number": "6420",
        "rule_title": "OTC Equity Transaction Reporting",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/6420",
        "raw_text": (
            "Rule 6420. OTC Equity Transaction Reporting\n\n"
            "(a) Members shall report transactions in OTC Equity Securities to FINRA in accordance "
            "with applicable FINRA rules.\n\n"
            "(b) Trade Reporting. (1) The executing party in an OTC transaction shall report the "
            "transaction to FINRA within 10 seconds of execution during market hours. "
            "(2) Transactions executed outside normal market hours shall be reported within the "
            "timeframe specified by FINRA.\n\n"
            "(c) Each trade report shall include: (1) the security identification number; "
            "(2) the transaction price; (3) the number of shares or bonds; (4) the time of execution; "
            "(5) whether the transaction is a buy, sell, or cross; and (6) the capacity in which the "
            "member acted (agent or principal)."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "6000",
        "series_title": "Quotation, Order, and Transaction Reporting Facilities",
        "rule_number": "6433",
        "rule_title": "Minimum Quotation Size Requirements for OTC Equity Securities",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/6433",
        "raw_text": (
            "Rule 6433. Minimum Quotation Size Requirements for OTC Equity Securities\n\n"
            "Each member that is a registered market maker in an OTC equity security shall maintain "
            "quotations that meet minimum size requirements as specified by FINRA. The minimum quotation "
            "size shall be determined based on the bid price of the security."
        ),
    },

    # =========================================================================
    # 7000 Series — Clearing, Transaction and Order Data Requirements
    # =========================================================================
    {
        "regulator": "FINRA",
        "series": "7000",
        "series_title": "Clearing, Transaction and Order Data Requirements",
        "rule_number": "7140",
        "rule_title": "Trade Reporting — Transactions in Equity Securities",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/7140",
        "raw_text": (
            "Rule 7140. Trade Reporting\n\n"
            "(a) Members shall report OTC transactions in NMS stocks and OTC equity securities within "
            "the time periods specified by applicable FINRA rules.\n\n"
            "(b) Each member shall report to the applicable FINRA facility: (1) last sale data, "
            "(2) transaction type, (3) time of execution, (4) number of shares, (5) price, and "
            "(6) other information as required.\n\n"
            "(c) Members shall ensure accuracy of trade reports and promptly correct any errors."
        ),
    },

    # =========================================================================
    # 8000 Series — Investigations and Sanctions
    # =========================================================================
    {
        "regulator": "FINRA",
        "series": "8000",
        "series_title": "Investigations and Sanctions",
        "rule_number": "8210",
        "rule_title": "Provision of Information and Testimony and Inspection and Copying of Books",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/8210",
        "raw_text": (
            "Rule 8210. Provision of Information and Testimony and Inspection and Copying of Books\n\n"
            "(a) For the purpose of an investigation, complaint, examination, or proceeding, FINRA "
            "may require any member, associated person, or any other person subject to FINRA's "
            "jurisdiction to:\n"
            "(1) provide information orally, in writing, or electronically with respect to any matter "
            "involved in the investigation, complaint, examination, or proceeding;\n"
            "(2) testify at a location designated by FINRA staff, under oath or affirmation;\n"
            "(3) produce documents and records for inspection and copying, or provide electronic "
            "copies of such records.\n\n"
            "(b) No member or person shall fail to provide information or testimony or to permit an "
            "inspection or copying of books, records, or accounts pursuant to this Rule.\n\n"
            "(c) FINRA shall maintain the confidentiality of all information received under this Rule, "
            "subject to applicable exceptions for regulatory and law enforcement purposes."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "8000",
        "series_title": "Investigations and Sanctions",
        "rule_number": "8310",
        "rule_title": "Sanctions for Violation of the Rules",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/8310",
        "raw_text": (
            "Rule 8310. Sanctions for Violation of the Rules\n\n"
            "(a) After compliance with the applicable procedures, FINRA may impose one or more of the "
            "following sanctions on a member or associated person:\n"
            "(1) Censure.\n"
            "(2) Fine.\n"
            "(3) Suspension of membership or association with any member for a definite period.\n"
            "(4) Expulsion from FINRA membership.\n"
            "(5) Bar from being associated with any member.\n"
            "(6) Limitation of activities, functions, or operations of a member or associated person.\n"
            "(7) Any other fitting sanction.\n\n"
            "(b) Sanctions may be imposed for violation of any FINRA rule, provision of the FINRA "
            "By-Laws, or provision of the federal securities laws and SEC rules and regulations."
        ),
    },

    # =========================================================================
    # 9000 Series — Code of Procedure
    # =========================================================================
    {
        "regulator": "FINRA",
        "series": "9000",
        "series_title": "Code of Procedure",
        "rule_number": "9211",
        "rule_title": "Service of Complaint and Answer",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/9211",
        "raw_text": (
            "Rule 9211. Service of Complaint and Answer\n\n"
            "(a) The Department of Enforcement or Department of Market Regulation may initiate a "
            "disciplinary proceeding by issuing a complaint.\n\n"
            "(b) A respondent shall file an answer within 25 days after service of the complaint.\n\n"
            "(c) The answer shall specifically admit, deny, or state that the respondent does not "
            "have sufficient information to admit or deny each allegation.\n\n"
            "(d) A respondent may request an extension of time to file an answer."
        ),
    },

    # =========================================================================
    # 11000 / 12000 / 13000 Series — Dispute Resolution
    # =========================================================================
    {
        "regulator": "FINRA",
        "series": "12000",
        "series_title": "Code of Arbitration Procedure for Customer Disputes",
        "rule_number": "12200",
        "rule_title": "Arbitration Under an Arbitration Agreement or the Rules of FINRA",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/12200",
        "raw_text": (
            "Rule 12200. Arbitration Under an Arbitration Agreement or the Rules of FINRA\n\n"
            "Parties must arbitrate a dispute under the Code if: (1) Arbitration under the Code is "
            "either required by a written agreement, or is requested by the customer; (2) the dispute "
            "is between a customer and a member or associated person of a member; and (3) the dispute "
            "arises in connection with the business activities of the member or the associated person."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "13000",
        "series_title": "Code of Arbitration Procedure for Industry Disputes",
        "rule_number": "13200",
        "rule_title": "Required Arbitration",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/13200",
        "raw_text": (
            "Rule 13200. Required Arbitration\n\n"
            "(a) A dispute must be arbitrated under the Industry Code if the dispute arises out of "
            "the business activities of a member or an associated person and is between or among: "
            "(1) members; (2) members and associated persons; or (3) associated persons.\n\n"
            "(b) Any dispute arising out of the employment or termination of an associated person "
            "shall be subject to arbitration under the Industry Code."
        ),
    },
    # =========================================================================
    # ADDITIONAL RULES — Gap Fill (compliance-critical rules missing from v1)
    # =========================================================================
    # --- 1000 Series additions ---
    {
        "regulator": "FINRA",
        "series": "1000",
        "series_title": "Member Application and Associated Person Registration",
        "rule_number": "1017",
        "rule_title": "Application for Approval of Change in Ownership, Control, or Business Operations",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/1017",
        "raw_text": (
            "Rule 1017. Application for Approval of Change in Ownership, Control, or Business Operations\n\n"
            "(a) Events Requiring Application. A member shall file an application for approval of a "
            "change in ownership, control, or business operations if the member proposes to: (1) merge "
            "with another member or acquire another member; (2) directly or indirectly acquire 25 percent "
            "or more of a member's assets or a member's customer accounts; (3) change its broker-dealer "
            "or government securities broker or government securities dealer registration status; "
            "(4) remove or modify a membership agreement restriction; (5) materially change its business "
            "operations as defined in Rule 1011(k); or (6) transfer its membership to a reorganized entity.\n\n"
            "(b) Filing of Application. The applicant shall file the application on such form or forms "
            "as FINRA may prescribe together with such supporting documentation as FINRA deems necessary.\n\n"
            "(c) Standards for Approval. In reviewing an application, FINRA shall apply the standards "
            "set forth in Rule 1014, considering the nature and extent of the proposed change, its impact "
            "on the supervision, compliance, financial condition, and operations of the firm."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "1000",
        "series_title": "Member Application and Associated Person Registration",
        "rule_number": "1210",
        "rule_title": "Registration Requirements",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/1210",
        "raw_text": (
            "Rule 1210. Registration Requirements\n\n"
            "(a) Persons Required to Register. Each person associated with a member who is engaged in "
            "the investment banking or securities business of a member, including the functions of "
            "supervision, solicitation, or conduct of business in securities, shall register with FINRA "
            "as a representative or principal in each category of registration appropriate to the "
            "functions to be performed.\n\n"
            "(b) Additional Requirements. No member shall permit any person associated with the member "
            "to engage in any functions or activities requiring registration unless such person is "
            "registered with FINRA in the category appropriate to such functions or activities.\n\n"
            "(c) Qualification Examinations. Each person seeking registration shall pass the qualification "
            "examination appropriate to the category of registration requested.\n\n"
            "(d) Registration and Qualification Requirements for Associated Persons. Each associated person "
            "required to be registered must meet and maintain standards of character, competence, and "
            "training as established by FINRA."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "1000",
        "series_title": "Member Application and Associated Person Registration",
        "rule_number": "1240",
        "rule_title": "Continuing Education Requirements",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/1240",
        "raw_text": (
            "Rule 1240. Continuing Education Requirements\n\n"
            "(a) Regulatory Element. Each registered person shall complete the Regulatory Element of "
            "continuing education on the occurrence of their second registration anniversary date and "
            "every three years thereafter, or as otherwise prescribed by FINRA. The content of the "
            "Regulatory Element shall be determined by FINRA and shall be appropriate to each person's "
            "registration category.\n\n"
            "(b) Firm Element. Each member shall maintain a continuing education program for its "
            "registered persons. The program shall include: (1) a written training plan identifying "
            "training needs and delivery methods; (2) content covering regulatory developments, "
            "compliance issues, sales practices, product knowledge, and firm policies; (3) maintenance "
            "of records documenting the content and completion of the training.\n\n"
            "(c) Inactive Status. A person whose registration has been deemed inactive for failure to "
            "complete the Regulatory Element shall not be permitted to engage in, or be compensated "
            "for, activities requiring registration."
        ),
    },
    # --- 2000 Series additions ---
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2030",
        "rule_title": "Engaging in Distribution and Solicitation Activities with Government Entities",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2030",
        "raw_text": (
            "Rule 2030. Engaging in Distribution and Solicitation Activities with Government Entities\n\n"
            "(a) Limitation on Distribution and Solicitation Activities. No member or associated person "
            "shall engage in distribution or solicitation activities for compensation with a government "
            "entity on behalf of any investment adviser that provides or is seeking to provide investment "
            "advisory services to such government entity within two years after a contribution to an "
            "official of such government entity is made by the member, any associated person, or any "
            "covered associate of the member (the 'two-year timeout').\n\n"
            "(b) Exceptions. The two-year timeout shall not apply to contributions of $350 or less per "
            "election to officials for whom the contributor was entitled to vote, or $150 per election "
            "to officials for whom the contributor was not entitled to vote.\n\n"
            "(c) Prohibition on Soliciting Contributions. No member or covered associate shall solicit "
            "or coordinate contributions to an official of a government entity or to a political party "
            "of a state or locality where the member is engaged in distribution or solicitation activities."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2114",
        "rule_title": "Recommendations to Customers in OTC Equity Securities",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2114",
        "raw_text": (
            "Rule 2114. Recommendations to Customers in OTC Equity Securities\n\n"
            "No member shall recommend to a customer the purchase, sale, or exchange of any OTC Equity "
            "Security as defined in Rule 6420 unless the member has reviewed current financial statements "
            "and material business information about the issuer, or has a reasonable basis for believing "
            "that such information is available. Members must consider the information available about the "
            "issuer, the security, and the customer's needs and objectives before making any recommendation.\n\n"
            "The member must maintain records of the basis for each recommendation and ensure that the "
            "recommendation is suitable for the customer."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2268",
        "rule_title": "Requirements When Using Predispute Arbitration Agreements for Customer Accounts",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2268",
        "raw_text": (
            "Rule 2268. Requirements When Using Predispute Arbitration Agreements for Customer Accounts\n\n"
            "(a) Any predispute arbitration clause included in a customer agreement shall be highlighted "
            "and shall be immediately preceded by specific disclosure language prescribed by FINRA.\n\n"
            "(b) Required Disclosures. The predispute arbitration agreement shall include the following "
            "disclosures: (1) arbitration is final and binding on the parties; (2) the parties are waiving "
            "their right to seek remedies in court, including the right to a jury trial; (3) pre-arbitration "
            "discovery is generally more limited than in court proceedings; (4) an arbitration award is "
            "not required to include factual findings or legal reasoning; (5) the panel of arbitrators may "
            "include a minority of arbitrators who were or are affiliated with the securities industry; "
            "(6) the rules of some arbitration forums may impose time limits for bringing a claim.\n\n"
            "(c) No predispute arbitration agreement shall include any condition that limits or contradicts "
            "the rules of any self-regulatory organization or limits the ability of a party to file any "
            "claim in arbitration."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2310",
        "rule_title": "Direct Participation Programs",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2310",
        "raw_text": (
            "Rule 2310. Direct Participation Programs\n\n"
            "(a) Applicability. This rule applies to public offerings of direct participation programs. "
            "No member or associated person shall participate in a public offering of a direct participation "
            "program unless the member has reasonable grounds to believe that all material facts are "
            "adequately and accurately disclosed.\n\n"
            "(b) Suitability. No member or associated person shall recommend a direct participation program "
            "to a customer unless the member has reasonable grounds to believe, based on information obtained "
            "from the customer, that the customer can reasonably benefit from the program, taking into "
            "account the customer's overall portfolio and financial circumstances.\n\n"
            "(c) Due Diligence. Before participating in a public offering, each member shall conduct a "
            "reasonable investigation of the program, including the general partner, the program assets, "
            "and the terms of the offering.\n\n"
            "(d) Compensation Limits. Total organization and offering expenses, including underwriting "
            "compensation, shall not exceed limits established by FINRA."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "2000",
        "series_title": "Duties and Conflicts",
        "rule_number": "2330",
        "rule_title": "Members' Responsibilities Regarding Deferred Variable Annuities",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2330",
        "raw_text": (
            "Rule 2330. Members' Responsibilities Regarding Deferred Variable Annuities\n\n"
            "(a) This rule applies to the purchase or exchange of a deferred variable annuity and the "
            "subaccount allocations made at the time of purchase or exchange. No member or associated "
            "person shall recommend a deferred variable annuity unless the member has a reasonable basis "
            "to believe the transaction is suitable.\n\n"
            "(b) Suitability Determination. Prior to recommending a deferred variable annuity, a member "
            "or associated person must make reasonable efforts to obtain information about the customer's "
            "age, annual income, financial situation and needs, investment experience, investment objectives, "
            "intended use of the annuity, investment time horizon, existing assets, liquidity needs, "
            "liquid net worth, risk tolerance, and tax status.\n\n"
            "(c) Principal Review. A member must implement surveillance procedures to determine whether "
            "a principal has reviewed each deferred variable annuity transaction within seven business days "
            "of the date the completed application is received."
        ),
    },
    # --- 3000 Series additions ---
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities",
        "rule_number": "3241",
        "rule_title": "Registered Person Being Named a Customer's Beneficiary or Holding a Position of Trust",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3241",
        "raw_text": (
            "Rule 3241. Registered Person Being Named a Customer's Beneficiary or Holding a Position "
            "of Trust for a Customer\n\n"
            "(a) Limitation on Serving as Customer's Beneficiary, Executor, Trustee, or Power of Attorney. "
            "A registered person shall decline being named a beneficiary, executor, or trustee, or being "
            "granted a power of attorney or similar position of trust for or on behalf of a customer who "
            "is not a member of the registered person's immediate family, unless the member firm provides "
            "written approval.\n\n"
            "(b) Member Obligations. A member that receives notification from an associated person regarding "
            "being named as a beneficiary or position of trust must evaluate whether the position creates "
            "a conflict of interest and must approve or disapprove the arrangement.\n\n"
            "(c) Recordkeeping. Members must maintain records of all notifications, approvals, and "
            "disapprovals under this rule."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities",
        "rule_number": "3270",
        "rule_title": "Outside Business Activities of Registered Persons",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3270",
        "raw_text": (
            "Rule 3270. Outside Business Activities of Registered Persons\n\n"
            "No registered person may be an employee, independent contractor, sole proprietor, officer, "
            "director or partner of another person, or be compensated, or have the reasonable expectation "
            "of compensation, from any other person as a result of any business activity outside the scope "
            "of the relationship with his or her member firm, unless he or she has provided prior written "
            "notice to the member.\n\n"
            "The member shall consider whether the proposed activity will: (1) interfere with or compromise "
            "the registered person's responsibilities to the member and its customers; (2) be viewed by "
            "customers or the public as part of the member's business; or (3) involve customers of the "
            "member. The member shall evaluate the proposed activity and may impose conditions, limitations, "
            "or prohibitions as it deems appropriate."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "3000",
        "series_title": "Supervision and Responsibilities",
        "rule_number": "3280",
        "rule_title": "Private Securities Transactions of an Associated Person",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/3280",
        "raw_text": (
            "Rule 3280. Private Securities Transactions of an Associated Person\n\n"
            "(a) No associated person shall participate in any manner in a private securities transaction "
            "without prior written notice to the member with which he is associated.\n\n"
            "(b) Transactions for Compensation. If the associated person has received or may receive "
            "selling compensation in connection with a private securities transaction, the member shall: "
            "(1) advise the associated person in writing whether or not the transaction is approved; and "
            "(2) if the transaction is approved, record the transaction on the books and records of the "
            "member, and supervise the associated person's participation as if the transaction were "
            "executed on behalf of the member.\n\n"
            "(c) Transactions Not for Compensation. If the associated person has not and will not receive "
            "selling compensation, the member must acknowledge the written notice in writing."
        ),
    },
    # --- 4000 Series additions ---
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4111",
        "rule_title": "Restricted Firm Obligations",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4111",
        "raw_text": (
            "Rule 4111. Restricted Firm Obligations\n\n"
            "(a) FINRA shall designate a member firm as a 'Restricted Firm' if the member exceeds "
            "a specified numeric threshold based on the total number and percentage of registered persons "
            "associated with the firm who have one or more disclosure events in the BrokerCheck system.\n\n"
            "(b) Obligations of Restricted Firms. A Restricted Firm must: (1) maintain a deposit with "
            "FINRA or in an escrow account in an amount determined by FINRA; (2) comply with conditions "
            "or restrictions on business activities imposed by FINRA; and (3) provide additional "
            "information regarding its business operations.\n\n"
            "(c) Restricted Deposit Requirement. The restricted deposit shall be maintained in cash "
            "or qualified securities and may not be withdrawn without FINRA's prior written approval.\n\n"
            "(d) Annual Review. FINRA shall annually review each Restricted Firm's designation to "
            "determine whether the firm continues to exceed the numeric threshold."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4120",
        "rule_title": "Regulatory Notification and Business Curtailment",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4120",
        "raw_text": (
            "Rule 4120. Regulatory Notification and Business Curtailment\n\n"
            "(a) Notification Requirements. Each member shall promptly notify FINRA if: (1) the member's "
            "net capital falls below the minimum required; (2) the member fails to maintain books and "
            "records as required; (3) a material change occurs in the member's financial condition; or "
            "(4) any event occurs which FINRA designates as requiring notification.\n\n"
            "(b) Business Curtailment. FINRA may require a member to curtail or cease business activities "
            "if the member's financial or operational condition poses a risk to investors or the market.\n\n"
            "(c) Prohibition on Expansion. A member that is subject to notification requirements under "
            "this rule may not expand its business without FINRA approval."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4330",
        "rule_title": "Customer Protection — Permissible Use of Customers' Securities",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4330",
        "raw_text": (
            "Rule 4330. Customer Protection — Permissible Use of Customers' Securities\n\n"
            "(a) A member shall not lend securities carried for the account of any customer unless "
            "the member has first obtained a written authorization from the customer permitting the "
            "lending of securities.\n\n"
            "(b) Collateral Requirements. A member that borrows securities from a customer must: "
            "(1) maintain adequate collateral equal to at least 100% of the current market value of "
            "the securities borrowed; and (2) mark the collateral to market daily.\n\n"
            "(c) Notification. The member must notify customers in writing of the terms and conditions "
            "under which their securities may be lent, including the risks involved."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4360",
        "rule_title": "Fidelity Bonds",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4360",
        "raw_text": (
            "Rule 4360. Fidelity Bonds\n\n"
            "(a) Each member required to join SIPC shall maintain a blanket fidelity bond covering "
            "officers and employees. The bond shall provide for coverage against loss resulting from "
            "dishonest or fraudulent acts by employees, including larceny, theft, embezzlement, forgery, "
            "misplacement, and mysterious unexplainable disappearance.\n\n"
            "(b) Minimum Coverage. The minimum required coverage shall be based on the member's net "
            "capital requirement as follows: members with a net capital requirement of $250,000 or less "
            "shall maintain coverage of at least $25,000; members with higher requirements shall maintain "
            "proportionally higher coverage amounts.\n\n"
            "(c) Notification. Members shall promptly notify FINRA in writing if: (1) the bond is "
            "cancelled, terminated, or substantially modified; or (2) a claim is made under the bond."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4513",
        "rule_title": "Records of Written Customer Complaints",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4513",
        "raw_text": (
            "Rule 4513. Records of Written Customer Complaints\n\n"
            "(a) Each member shall keep and preserve a separate file of all written customer complaints "
            "received by the member. Written customer complaints include any written statement from a "
            "customer or any person acting on behalf of a customer that alleges a grievance involving the "
            "activities of the member or its associated persons.\n\n"
            "(b) The complaint file shall be maintained in a manner that makes it readily accessible for "
            "inspection by FINRA and shall include: (1) the complainant's name and account number; "
            "(2) the date the complaint was received; (3) the name of the associated person identified; "
            "(4) a description of the nature of the complaint; and (5) the action taken by the member "
            "in response to the complaint.\n\n"
            "(c) Members must report specified customer complaints to FINRA through such electronic "
            "process as FINRA may prescribe."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4560",
        "rule_title": "Short-Interest Reporting",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4560",
        "raw_text": (
            "Rule 4560. Short-Interest Reporting\n\n"
            "(a) Each member shall maintain a record of total short positions in all customer and "
            "proprietary firm accounts in each equity security. Such record shall be compiled and "
            "reported to FINRA as of the settlement date designated by FINRA.\n\n"
            "(b) Reporting Requirements. Members shall report short-interest positions in the format "
            "and manner prescribed by FINRA, including: (1) security identification; (2) total shares "
            "sold short; and (3) whether the position is a proprietary or customer position.\n\n"
            "(c) Timing. Short-interest reports shall be submitted to FINRA within the timeframe "
            "specified by FINRA."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "4000",
        "series_title": "Financial and Operational Rules",
        "rule_number": "4590",
        "rule_title": "Synchronization of Member Business Clocks",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4590",
        "raw_text": (
            "Rule 4590. Synchronization of Member Business Clocks\n\n"
            "(a) Each member shall synchronize its business clocks, including computer system clocks and "
            "mechanical clocks, that are used to record the date and time of any event that must be "
            "recorded pursuant to the FINRA rules or the federal securities laws.\n\n"
            "(b) Clock Synchronization Standard. Clocks must be synchronized to a source that is "
            "synchronized to within one second of the National Institute of Standards and Technology "
            "(NIST) atomic clock.\n\n"
            "(c) Compliance. Members must establish written procedures for clock synchronization and "
            "maintain records of their compliance with this rule."
        ),
    },
    # --- 5000 Series additions ---
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Offering and Trading Standards",
        "rule_number": "5121",
        "rule_title": "Public Offerings of Securities With Conflicts of Interest",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5121",
        "raw_text": (
            "Rule 5121. Public Offerings of Securities With Conflicts of Interest\n\n"
            "(a) Applicability. This rule applies to a public offering of securities in which a member "
            "with a conflict of interest participates. A conflict of interest exists when: (1) the member "
            "or its affiliates will receive 5% or more of the net offering proceeds; (2) the member is "
            "the issuer or an affiliate of the issuer; or (3) the member has a similar financial interest.\n\n"
            "(b) Qualified Independent Underwriter (QIU). When a conflict of interest exists, the offering "
            "must be conducted with the participation of a qualified independent underwriter that performs "
            "due diligence and provides a pricing opinion.\n\n"
            "(c) Disclosure. Members must disclose the nature of the conflict of interest in the prospectus "
            "or offering document.\n\n"
            "(d) Restrictions on Sales. Members with conflicts shall not sell securities to discretionary "
            "accounts without the prior written approval of the customer."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Offering and Trading Standards",
        "rule_number": "5123",
        "rule_title": "Private Placements of Securities",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5123",
        "raw_text": (
            "Rule 5123. Private Placements of Securities\n\n"
            "(a) Filing Requirements. Each member that sells an unregistered security in a non-public "
            "offering shall file with FINRA a copy of any private placement memorandum, term sheet, or "
            "other offering document, or, if none was used, a notice within 15 calendar days of the "
            "date of first sale.\n\n"
            "(b) Due Diligence. Each member shall conduct a reasonable investigation of the issuer, "
            "its management, its business prospects, the assets held or to be acquired, and the intended "
            "use of proceeds. The scope of investigation shall be based on all relevant factors.\n\n"
            "(c) Exemptions. This rule does not apply to: (1) offerings sold solely to institutional "
            "accounts; (2) offerings of securities exempt under Section 4(a)(2) of the Securities Act "
            "that are sold to qualified purchasers; or (3) certain other exempt categories."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Offering and Trading Standards",
        "rule_number": "5240",
        "rule_title": "Anti-Intimidation/Coordination",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5240",
        "raw_text": (
            "Rule 5240. Anti-Intimidation/Coordination\n\n"
            "(a) No member shall: (1) coordinate the display of, or changes in, its quotations with "
            "another member to the detriment of customers; (2) intimidate, threaten, or take any action "
            "against another member for displaying or updating its quotations in any manner; or "
            "(3) engage in any conduct that has the effect of intimidating or coercing another member "
            "into changing its quotations.\n\n"
            "(b) Each member shall have written supervisory procedures reasonably designed to ensure "
            "compliance with this rule."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "5000",
        "series_title": "Securities Offering and Trading Standards",
        "rule_number": "5290",
        "rule_title": "Order Entry and Execution Practices",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/5290",
        "raw_text": (
            "Rule 5290. Order Entry and Execution Practices\n\n"
            "(a) Members and associated persons shall not employ any practice, device, or scheme to "
            "evade compliance with applicable best execution, trade reporting, or order handling rules.\n\n"
            "(b) Each member shall establish and maintain written procedures reasonably designed to "
            "ensure that customer orders are handled fairly and in accordance with FINRA rules.\n\n"
            "(c) Members shall not accept or execute orders to buy or sell securities in any manner "
            "that is designed to circumvent applicable FINRA rules or federal securities laws."
        ),
    },
    # --- 6000 Series additions ---
    {
        "regulator": "FINRA",
        "series": "6000",
        "series_title": "Quotation and Transaction Reporting Facilities",
        "rule_number": "6121",
        "rule_title": "Trading Halts Due to Extraordinary Market Volatility",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/6121",
        "raw_text": (
            "Rule 6121. Trading Halts Due to Extraordinary Market Volatility\n\n"
            "(a) FINRA may halt trading in any NMS stock when a market-wide trading halt is triggered "
            "under the market-wide circuit breaker provisions of the listing exchange's rules or "
            "Regulation SHO.\n\n"
            "(b) Single-Stock Circuit Breakers. FINRA shall halt trading in an NMS stock when the "
            "listing exchange declares a limit up-limit down (LULD) trading pause under the National "
            "Market System Plan.\n\n"
            "(c) Members shall not execute trades during a trading halt and shall maintain procedures "
            "to ensure prompt compliance with halt notifications."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "6000",
        "series_title": "Quotation and Transaction Reporting Facilities",
        "rule_number": "6190",
        "rule_title": "Compliance with Regulation NMS Plan to Address Extraordinary Market Volatility",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/6190",
        "raw_text": (
            "Rule 6190. Compliance with Regulation NMS Plan to Address Extraordinary Market Volatility\n\n"
            "(a) Members shall comply with the provisions of the Limit Up-Limit Down (LULD) Plan, "
            "including the requirements to: (1) not execute trades in NMS stocks at prices that are "
            "more than the applicable percentage away from the reference price; (2) comply with trading "
            "pause requirements when LULD bands are triggered.\n\n"
            "(b) Members must maintain systems and procedures to monitor and enforce LULD price bands "
            "and respond appropriately to LULD states."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "6000",
        "series_title": "Quotation and Transaction Reporting Facilities",
        "rule_number": "6710",
        "rule_title": "TRACE Definitions",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/6710",
        "raw_text": (
            "Rule 6710. Definitions\n\n"
            "For purposes of the TRACE rules (Rule 6700 Series): 'TRACE-Eligible Security' means "
            "a debt security that is United States dollar-denominated and is: (a) issued by a US or "
            "foreign private issuer, including investment grade and high-yield corporate debt, "
            "convertible debt, capital trust securities, equipment trust securities, and specified "
            "similar types of debt; (b) a US Treasury Security; (c) an Agency Debt Security; (d) an "
            "Agency Pass-Through Mortgage-Backed Security; (e) an Asset-Backed Security; or (f) a "
            "Securitized Product.\n\n"
            "Members are required to participate in TRACE and report transactions in TRACE-Eligible "
            "Securities in accordance with the TRACE rules."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "6000",
        "series_title": "Quotation and Transaction Reporting Facilities",
        "rule_number": "6730",
        "rule_title": "TRACE Transaction Reporting",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/6730",
        "raw_text": (
            "Rule 6730. Transaction Reporting\n\n"
            "(a) When to Report. Each TRACE participant that is a party to a transaction in a "
            "TRACE-Eligible Security shall report the transaction to TRACE within 15 minutes of the "
            "time of execution during TRACE system hours, subject to exceptions for specific security types.\n\n"
            "(b) What to Report. Each report shall contain: (1) CUSIP number or FINRA symbol; "
            "(2) quantity (par value) of the transaction; (3) price; (4) time of execution; "
            "(5) contraparty identifier; (6) whether the transaction is a buy or sell; (7) capacity "
            "(principal or agent); and (8) such other information as FINRA may require.\n\n"
            "(c) As-Of/Reversal Transactions. Members must report corrections and cancellations as "
            "prescribed by FINRA."
        ),
    },
    # --- 8000 Series additions ---
    {
        "regulator": "FINRA",
        "series": "8000",
        "series_title": "Investigations and Sanctions",
        "rule_number": "8110",
        "rule_title": "Availability of Manual to Customers",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/8110",
        "raw_text": (
            "Rule 8110. Availability of Manual to Customers\n\n"
            "Each member shall keep available in each of its offices a current copy of the FINRA Manual "
            "and shall make it available to customers for examination upon request."
        ),
    },
    {
        "regulator": "FINRA",
        "series": "8000",
        "series_title": "Investigations and Sanctions",
        "rule_number": "8311",
        "rule_title": "Effect of a Suspension, Revocation, Cancellation, Bar or Other Disqualification",
        "source_url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/8311",
        "raw_text": (
            "Rule 8311. Effect of a Suspension, Revocation, Cancellation, Bar or Other Disqualification\n\n"
            "(a) A person whose registration has been revoked or cancelled, or who has been suspended, "
            "barred, or otherwise disqualified, shall not be associated with any member in any capacity, "
            "including a clerical or ministerial capacity, during the period of such disqualification "
            "unless specifically permitted by FINRA.\n\n"
            "(b) No member shall allow any person to be associated with it in any capacity if that person "
            "is subject to a statutory disqualification, unless FINRA has approved the association.\n\n"
            "(c) A member shall promptly notify FINRA upon learning that any person associated with it "
            "is subject to a statutory disqualification."
        ),
    },
]
