HeriShare is a venture-backed cultural-asset platform founded in Silicon Valley in 2023. It begins as a mission-driven fractional-ownership company intended to finance the preservation of culturally important objects. By late 2024, after a legal and governance crisis, it becomes a private marketplace serving collectors, estates, dealers, auction houses, and wealthy buyers.
The company does not become an entirely different organisation after the pivot. It keeps the same legal entity, employees, technology, database, contracts, and many of its existing assets. This continuity explains why the final database contains incompatible assumptions and partially repurposed tables.
The repository's current table schemas and contents are the numerical baseline canon. The organizational descriptions below provide context, but any conflicting names, headcounts, IDs, budgets or totals are older figures and must be reconciled to the repository rather than used to overwrite it.

## 1. Company identity
**Legal name:** HeriShare, Inc.  
**Entity:** Delaware corporation  
**Headquarters:** Santa Clara, California  
**Founded:** June 2023, following the February prototype  
**Founders:**

- Caesar Vallelonga — CEO, partnerships, fundraising, public relations
- Bob Andrews — founding CTO, now Founder and Principal Systems Architect

**Original mission:**
> Allow ordinary people to invest in cultural heritage while helping museums, estates, and nonprofit organisations finance preservation, restoration, storage, and public access.

**Post-pivot positioning:**
> A private marketplace for acquiring, selling, structuring, and transferring high-value cultural assets.

Before the pivot, HeriShare presents itself as a public-interest technology company. After the pivot, it behaves more like a combination of:
- specialist auction platform;
- private asset marketplace;
- collection-management intermediary;
- escrow and transaction coordinator;
- legal-vehicle administrator;
- high-value buyer and seller network.
---
# 2. The original business model

## Asset sourcing
Museums, NGOs, estates, historical societies, foundations, private families, and small cultural institutions provide assets to HeriShare.

Typical reasons include:
- financing restoration;
- paying insurance or storage costs;
- digitising archives;
- preserving inherited collections;
- covering estate taxes;
- preventing liquidation;
- keeping an object publicly accessible.

Each physical asset receives one permanent product record.

The supplying client remains the owner recorded in `products`, even though economic interests in the asset are sold through a separate legal vehicle.

## Legal structure
HeriShare creates or administers a legal vehicle for each asset, likely an LLC, trust, or similar special-purpose entity.

Investors purchase units or shares in that vehicle. These interests are recorded through the transaction and ownership structures, not by changing the product owner.

A simplified arrangement is:

```
Museum or estate
    ↓ supplies asset
Dedicated legal vehicle
    ↓ issues fractional interests
Platform users purchase and trade interests
```

The asset may remain:

- displayed at the museum;
- stored with a specialist custodian;
- undergoing restoration;
- physically held by the estate;
- temporarily loaned to another institution.

Legal ownership, beneficial ownership, control, and physical custody are therefore separate concepts.

## The flaw

The legal documents do not adequately prevent one investor from acquiring a controlling majority of the vehicle.

Once wealthy users begin combining several accounts, they acquire more than 50% of certain vehicles. This gives them sufficient contractual control to demand decisions about:
- relocation;
- sale;
- storage;
- restoration;
- public display;
- future ownership.

The platform was designed around dispersed ownership and never properly anticipated a controlling shareholder.

---
# 3. Revenue model before the pivot
HeriShare earns fees rather than treating the full value of assets or investments as revenue.

## Primary revenue streams
### Structuring and onboarding fee
Charged when an asset is prepared for fractionalisation.
Covers:
- title review;
- provenance research;
- valuation;
- photography;
- condition reporting;
- legal-vehicle formation;
- insurance review;
- listing preparation.
Typical fee: **$5,000–$25,000 per asset**
- often deducted from the funding proceeds rather than paid upfront.

### Primary placement fee
A percentage of the amount raised from initial investors.
Typical fee: **6%–8% of funds raised**

### Secondary transaction fee
Charged when users trade interests in the internal marketplace.
Typical fee: **1%–1.5% per side**

### Annual administration fee
Charged to the legal vehicle for reporting, ownership administration, compliance, and coordination.
Typical fee: **1%–2% of the asset value per year**

### Restoration and project coordination
HeriShare may charge a project-management fee when it arranges conservation or restoration.

Typical fee: **5%–10% of the external project cost**

## Weakness of the model
The original model is operationally expensive.
Small museums may bring valuable objects but cannot pay onboarding costs. HeriShare therefore advances many expenses and recovers them only if the offering succeeds.

The company carries significant upfront risk:
- unsuccessful listings;
- delayed valuations;
- disputed provenance;
- unexpected restoration costs;
- insurance problems;
- legal structuring costs;
- incomplete funding rounds.
The public-interest model generates goodwill but poor margins.

---
# 4. The post-pivot business model

After September 2024, HeriShare largely stops promoting dispersed public ownership.
The platform instead facilitates transactions involving complete assets or controlling interests.

## Typical post-pivot suppliers
- private collectors;
- wealthy families;
- artist and celebrity estates;
- auction houses;
- galleries;
- rare-item dealers;
- distressed owners;
- liquidators;
- private foundations;
- a small number of cash-strapped museums.

## Typical buyers
- high-net-worth individuals;
- family offices;
- private museums;
- investment groups;
- corporate collections;
- dealers;
- specialist funds.

## Post-pivot revenue streams
Seller commission: Typically **8%–12%** of the sale price.
Buyer premium: Typically **5%–10%** of the purchase price.
Listing and due-diligence fee: Typically **$10,000–$50,000**, depending on complexity.

### Private transaction fee
Charged for negotiated off-market sales.
### Custody, transport, and storage coordination
HeriShare adds a margin to third-party services.
### Collection advisory and sourcing
Wealthy clients pay HeriShare to identify suitable assets.
### Vehicle administration
Existing legal vehicles continue to generate administration fees even when the original public-interest model has ended.
## Why the pivot is more profitable
Post-pivot transactions are:
- larger;
- less dependent on thousands of retail investors;
- faster to close;
- supported by upfront deposits;
- subject to higher commissions;
- less expensive to market;
- concentrated among repeat buyers.

The model is commercially stronger but contradicts the original mission.
# 13. Operating process before the pivot
1. Partnerships team identifies a museum, estate, or NGO.
2. Operations collects initial asset documentation.
3. Legal reviews ownership and title.
4. External experts assess provenance and value.
5. A condition report is prepared.
6. Insurance and custody are arranged.
7. A legal vehicle is created.
8. The product is entered in the database.
9. Investors purchase fractional interests.
10. Funds are released for restoration, storage, or the owner’s approved purpose.
11. Interests may later trade in the internal marketplace.
12. HeriShare administers the vehicle and coordinates the asset.

# Operating process after the pivot
1. A private seller, estate, dealer, or auction house submits an asset.
2. HeriShare verifies identity and ownership.
3. Provenance, title, sanctions, and condition checks are performed.
4. The seller pays or deposits onboarding costs.
5. The asset is listed privately or publicly.
6. Buyers submit offers or participate through negotiated bidding.
7. Funds are held in escrow.
8. Title and control are transferred.
9. `products.owner` is updated to the buyer or designated ownership account.
10. Transport, storage, insurance, or display arrangements are coordinated.
11. HeriShare collects commissions and service fees.
# 16. Company culture
## Early culture
- idealistic;
- informal;
- founder-driven;
- technically ambitious;
- mission-oriented;
- comfortable with improvisation;
- weak on documentation and controls.
Employees believe they are helping preserve cultural heritage.
## Growth culture
- aggressive hiring;
- long working hours;
- unclear responsibilities;
- overlapping departments;
- rapid promotions;
- inconsistent salaries;
- decisions made through chat and informal meetings;
- operational processes created only after problems occur.
## Crisis culture
- secrecy;
- blame;
- fear of layoffs;
- legal pressure;
- resentment toward wealthy users;
- conflict between founders;
- distrust of investors;
- emergency access and manual fixes.

## Post-pivot culture
- commercially focused;
- more profitable;
- less mission-driven;
- divided between old and new employees;
- dependent on Marcelle’s undocumented fixes;
- increasingly influenced by Finance, Legal, private sales, and investors.

### Workforce scale
Use **79 rows in `employees`**, of which **64 are currently active** and **15 are former employees**
This keeps employee queries substantial while remaining believable for a specialised, venture-backed marketplace.

Suggested workforce progression:

|Milestone|Employee rows|Active employees|
|---|---|---|
|Formal payroll begins|2|2|
|First operating team|9|9|
|Marketplace launch|17|17|
|Viral-growth hiring|35|35|
|Pre-crisis peak|60|60|
|Post-crisis layoffs/resignations|60|45|
|Marcelle joins|61|46|
|Recovery and post-pivot hiring|79|64|

Former employees remain in `employees`; their ended employment is reflected through `contracts` and `current_salary = NULL`.

---
## HeriShare Department Structure

HeriShare has **79 employee records**, of which **64 are currently active**. The current `departments` table contains a 28-row hierarchy of group, department and sub-department records. Its `nr_employees` values describe the corresponding organizational row and must not be summed across levels as if every row were a disjoint home team. The role descriptions below remain useful context, but their older per-section staffing figures do not override the current table.

## 1. Executive and Governance — 5 employees
Responsible for company strategy, board relations, major decisions, and confidential internal matters.

**No formal sub-departments.**

The team is too small to justify them. Its members work directly across the company.

Example positions:
- Chief Executive Officer — Caesar Vallelonga
- Chief Strategy and Corporate Affairs Officer — Paris
- Chief Operating Officer
- Corporate Secretary
- Strategy and Governance Manager

Paris receives confidential information because she prepares board materials, coordinates executive decisions, and manages sensitive internal escalations. She is not a board member. She wants a planned inside-director seat for which Marcelle is the likelier candidate.

---

## 2. Technology — 18 employees
Builds and maintains the platform, database, internal tools, payment integrations, and technical infrastructure.
Technology needs several sub-departments because software development, data management, and infrastructure require different skills.

### Product and Software Engineering — 10 employees
Builds the customer-facing marketplace and internal business applications.

Example positions:
- Chief Technology Officer
- Product Manager
- Backend Engineer
- Frontend Engineer
- Full-Stack Engineer
- UX Designer
- Quality Assurance Engineer

Bob works here as **Founder and Principal Systems Architect**. He retains deep technical knowledge but no longer manages the department.

### Data and Systems — 5 employees
Maintains databases, reporting systems, integrations, and data models.

Example positions:
- Chief Data and Systems Transformation Officer — Marcelle Johnson
- Data Engineer
- Database Engineer
- Analytics Engineer
- Business Systems Analyst

Marcelle leads this team but works across several departments because her database repairs affect the entire company.

### Infrastructure and Security — 3 employees
Maintains hosting, production systems, access control, monitoring, and cybersecurity.

Example positions
- Infrastructure Manager
- Site Reliability Engineer
- Security Engineer

This is a small specialist team rather than a large separate organisation.

---

## 3. Marketplace — 11 employees
Brings assets and participants onto the platform and closes transactions.
The department is divided between the two sides of HeriShare’s marketplace: sellers and buyers.

### Seller Partnerships — 5 employees

Finds assets and manages relationships with museums, estates, dealers, auction houses, and private sellers.

Example positions:
- Head of Seller Partnerships
- Museum and Estate Partnerships Manager
- Auction-House Account Manager
- Asset Acquisition Manager
- Partnerships Associate

Before the pivot, this team focuses on museums and NGOs. After the pivot, it focuses mainly on estates, dealers, auction houses, and private owners.

### Private Sales and Buyer Relations — 6 employees
Manages wealthy buyers, family offices, negotiations, offers, and private transactions.
Example positions:

- Director of Private Sales
- Family Office Relationship Manager
- Buyer Relations Manager
- Private Sales Associate
- Transaction Negotiator

This team becomes much more important after the pivot.

---

## 4. Asset Operations — 9 employees
Handles the physical and documentary work required before an asset can be traded.
The department has two sub-departments because assessing an asset and physically managing it are distinct processes.

### Asset Research and Onboarding — 5 employees
Checks what the asset is, who owns it, its condition, and whether HeriShare can list it.

Example positions:
- Head of Asset Operations
- Provenance Researcher
- Cataloguing Specialist
- Valuation Coordinator
- Condition Assessment Specialist

This team works with external historians, appraisers, conservators, and technical experts.

### Logistics and Custody — 4 employees
Coordinates transport, storage, insurance, restoration, and physical access.

Example positions:
- Logistics Manager
- Custody and Storage Coordinator
- Insurance Coordinator
- Restoration Project Coordinator

HeriShare outsources most transport and storage, so this team manages vendors rather than performing those services itself.

---

## 5. Legal, Compliance and Risk — 7 employees
Ensures that assets, sellers, buyers, and transactions meet legal and regulatory requirements.
The distinction between legal work and compliance monitoring justifies two sub-departments.

### Legal — 3 employees
Handles contracts, title questions, ownership disputes, corporate matters, and transaction documentation.

Example positions:
- General Counsel
- Asset Transactions Counsel
- Corporate Counsel

### Compliance and Investigations — 4 employees

Checks identities, suspicious transactions, sanctions, fraud risks, and internal misconduct.

Example positions:
- Head of Compliance
- AML/KYC Analyst
- Risk Analyst
- Trust and Safety Investigator

This team grows after the loophole because HeriShare begins dealing with larger private transactions and more questionable sellers.

---

## 6. Finance and Corporate Services — 8 employees
Manages company finances, marketplace money flows, payroll, and internal administration.

### Finance and Transaction Operations — 5 employees
Handles both company accounting and transaction-related payments.

Example positions:
- Acting Chief Financial Officer — Elvis
- Financial Controller
- Treasury Manager
- Transaction Reconciliation Analyst
- Accounts Payable Specialist

Elvis is trusted with sensitive information because he prepares financial reports, manages cash movements, and explains transaction discrepancies to executives and the board.

Combining ordinary finance with transaction operations also gives him the opportunity to conceal fraud.

### People and Administration — 3 employees
Handles employment administration and the daily operation of the company.

Example positions:
- People Operations Manager
- Recruiter and HR Generalist
- Office Administrator

A separate Human Resources department would be excessive for a company of this size.

---

## 7. Client Services and Communications — 6 employees
Handles questions, complaints, high-value clients, and public communication.

These functions share a department because both manage how HeriShare communicates with outsiders, but they remain separate teams because their daily work differs.

### Client Services — 4 employees
Supports buyers, sellers, former retail investors, and institutional partners.
Example positions
- Client Services Manager
- VIP Client Liaison
- Support Specialist
- Seller Support Specialist
### Communications — 2 employees
Manages press, announcements, public statements, and reputation.
Example positions
- Communications Manager
- Public Relations Specialist

This team is smaller after the pivot because HeriShare relies less on mass-market promotion and more on private relationships.

---
# Current Active Workforce

| Department                         | Active employees |
| ---------------------------------- | ---------------: |
| Executive and Governance           |                5 |
| Technology                         |               18 |
| Marketplace                        |               11 |
| Asset Operations                   |                9 |
| Legal, Compliance and Risk         |                7 |
| Finance and Corporate Services     |                8 |
| Client Services and Communications |                6 |
| **Total**                          |           **64** |

The `employees` table may still contain approximately **79 historical employees**, including around 15 people who resigned or were dismissed during the crisis.

# Why This Structure Fits HeriShare
The organisation reflects four central parts of the business:
1. **Technology** operates the marketplace and its damaged database.
2. **Marketplace** finds sellers, buyers, and transactions.
3. **Asset Operations** evaluates and physically manages cultural assets.
4. **Legal, Compliance and Finance** make ownership transfers and payments possible.

Executive, Client Services, Communications, and People Operations support those core activities but are too small to require complex internal hierarchies.
