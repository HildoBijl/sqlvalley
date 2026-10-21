## Table interpretation

The current repository table is the baseline canon. The original generation timeline tracked 14 operational departments. During the post-pivot recovery, the same organization was represented more precisely by adding parent groups and specialist sub-departments, producing the finalized 28-row hierarchy. These structural rows do not represent 28 disjoint teams and must not be added together to calculate company headcount.

The `departments` table stores operational departments and sub-departments. Department families are encoded directly in `d_id`.

|ID range|Department group|
|--:|---|
|`1xxx`|Executive and Governance|
|`2xxx`|Technology|
|`3xxx`|Marketplace|
|`4xxx`|Asset Operations|
|`5xxx`|Legal, Compliance and Risk|
|`6xxx`|Finance and Corporate Services|
|`7xxx`|Client Services and Communications|

The finalized table stores group rows such as `2000` as well as department and sub-department rows. Consequently, `nr_employees` must not be summed across hierarchy levels as though all 28 rows were disjoint teams.

Example:
```text
2000 = Technology group
2100 = Product and Software Engineering
2200 = Data and Systems
2300 = Infrastructure and Security
```

Executive leadership follows the same pattern in the current table: `1000` is the group row, while `1100` Executive Office and `1200` Strategy & Corporate Affairs describe its specialist functions.

Field interpretation:

- `d_id`: permanent department identifier.
- `d_name`: current department name.
- `manager_id`: current manager.
- `budget`: current annual department budget, including payroll and department-controlled spending.
- `nr_employees`: current active headcount associated with that organizational row. Parent and child counts overlap.
- `allocations`: links employees to one or more departments.

Department IDs remain unchanged when a department is renamed or repurposed. Closed departments remain in the table with zero employees or budget rather than being deleted.

# Phase 2 — The Accelerator
## Event 8 — 23 June 2023: Seed Funding and Formal Organisation
Formal payroll and company administration begin after seed funding.

### Departments created

|`d_id`|Department|Initial purpose|
|--:|---|---|
|`1000`|Executive and Governance|Strategy, fundraising, partnerships and company administration|
|`2100`|Product and Software Engineering|Platform, database, product development and technical operations|

Caesar manages `1000`. Bob manages `2100`.

At this stage, both departments contain only one founder. Finance, operations, client relations and partnerships are still handled informally.

**New department rows:** 2  
**Total department rows:** 2  
**Active organisational units:** 2

## Event 10 — 3 July 2023: First Non-Founder Employee

Paris joins as HeriShare’s first non-founder employee.

### Department created

|`d_id`|Department|Purpose|
|--:|---|---|
|`7100`|Client Services|User support, onboarding assistance, community communication and partner questions|

Paris becomes manager of `7100`.

**New department rows:** 1  
**Total department rows:** 3  
**Active organisational units:** 3

## Event 12 — 25 August 2023: Partnership Expansion

The growing number of museums, estates and cultural organisations requires dedicated commercial and operational functions.

### Departments created

|`d_id`|Department|Purpose|
|--:|---|---|
|`3100`|Institutional Partnerships|Museum, NGO, estate and cultural-sector relationships|
|`4100`|Asset Operations|Asset documentation, assessment, restoration, insurance and transport coordination|

Caesar initially remains heavily involved in `3100`, but operational managers are appointed as the company grows.

**New department rows:** 2  
**Total department rows:** 5  
**Active organisational units:** 5

## Event 14 — 5 October 2023: Internal Marketplace Launch

Secondary trading increases the platform’s technical, financial and operational complexity.

### Existing departments renamed

|`d_id`|Earlier name|New name|
|--:|---|---|
|`2100`|Product and Software Engineering|Product and Software Engineering|
|`4100`|Asset Operations|Asset Research and Onboarding|

The IDs remain unchanged because these are continuing organisational units.

### Departments created

|`d_id`|Department|Purpose|
|--:|---|---|
|`2300`|Infrastructure and Security|Hosting, production systems, monitoring, access control and cybersecurity|
|`4200`|Logistics and Custody|Transport, storage, insurance, restoration providers and physical access|
|`6100`|Finance and Transaction Operations|Accounting, payments, reconciliations, investor funds and partner disbursements|

`4100` now focuses on evaluating and onboarding assets. `4200` manages their physical handling.

**New department rows:** 3  
**Total department rows:** 8  
**Active organisational units:** 8

## Event 15 — 19 November 2023: Viral Growth and Formal Reorganisation

National attention and rapid account growth force HeriShare to create specialised teams.

### Technology

|`d_id`|Department|Purpose|
|--:|---|---|
|`2200`|Data and Systems|Databases, integrations, reporting and internal business systems|

Bob continues to oversee the Technology group, while operational managers begin handling its individual teams.

### Marketplace

`3100` is renamed from **Institutional Partnerships** to:

- **Marketplace — Institutional Partnerships**
    

A second marketplace department is created:

|`d_id`|Department|Purpose|
|--:|---|---|
|`3200`|Investor and Buyer Relations|Retail investors, traders, larger buyers and marketplace participation|

### Legal, compliance and risk

|`d_id`|Department|Purpose|
|--:|---|---|
|`5100`|Legal|Contracts, title, ownership questions, corporate work and transaction documents|
|`5200`|Compliance and Trust|Identity checks, platform rules, suspicious activity and fraud concerns|

### Corporate services

`6100` becomes part of the Finance and Corporate Services group.

A second department is created:

|`d_id`|Department|Purpose|
|--:|---|---|
|`6200`|People and Administration|Recruitment, employment administration, payroll support and office operations|

### Client services and communications

`7100` becomes part of the Client Services and Communications group.

A communications team is created:

|`d_id`|Department|Purpose|
|--:|---|---|
|`7200`|Communications|Press, public statements, marketing communication and reputation|

By the end of Event 15, HeriShare has the 14 operational departments used by the original generation plan. Their IDs remain meaningful, but the database representation is expanded during the later recovery.

**New department rows:** 6  
**Total department rows:** 14  
**Active organisational units:** 14

## Events 15–18 — November 2023 to 10 May 2024: Continued Growth

No new departments are created. Existing departments expand and receive formal managers.

The strongest hiring occurs in:

- `2100` Product and Software Engineering
    
- `3100` Institutional Partnerships
    
- `3200` Investor and Buyer Relations
    
- `4100` Asset Research and Onboarding
    
- `6100` Finance and Transaction Operations

As the company stabilizes, the database is normalized into the finalized 28-row hierarchy. Seven top-level group rows make the reporting structure explicit: `1000`, `2000`, `3000`, `4000`, `5000`, `6000` and `7000`. Specialist work is represented through `1100`, `1200`, `2110`, `2120`, `4110`, `4120`, `6110` and `6120`, alongside the existing operational departments. This is an organizational reporting refinement, not a sudden creation of 14 independent staffed teams.
- `7100` Client Services
    

Paris transfers from `7100` to `1000` and becomes **Chief of Staff and Director of Corporate Affairs**. At the pivot she later becomes **Chief Strategy and Corporate Affairs Officer**.

Her responsibilities include:

- executive coordination;
    
- board preparation;
    
- confidential escalations;
    
- crisis planning;
    
- communication between department managers;
    
- sensitive internal investigations.
    

### Peak pre-crisis structure

|`d_id`|Department|Headcount|
|--:|---|--:|
|`1000`|Executive and Governance|4|
|`2100`|Product and Software Engineering|9|
|`2200`|Data and Systems|4|
|`2300`|Infrastructure and Security|3|
|`3100`|Institutional Partnerships|6|
|`3200`|Investor and Buyer Relations|4|
|`4100`|Asset Research and Onboarding|5|
|`4200`|Logistics and Custody|4|
|`5100`|Legal|3|
|`5200`|Compliance and Trust|3|
|`6100`|Finance and Transaction Operations|5|
|`6200`|People and Administration|3|
|`7100`|Client Services|4|
|`7200`|Communications|3|
||**Total**|**60**|

# Phase 3 — The Loophole

## Event 19 — 11 May 2024: Media Leak and Emergency Budget Shift

No departments are created or removed.

Budgets are immediately reallocated:

- `5100` Legal receives emergency outside-counsel funding.
    
- `5200` Compliance and Trust receives investigation funding.
    
- `7100` Client Services receives temporary complaint-handling resources.
    
- `7200` Communications receives crisis-management funding.
    
- `3100` Institutional Partnerships loses discretionary partnership spending.
    
- `6200` People and Administration freezes recruitment.
    
- `2100`, `2200` and `2300` are restricted to stability, security and legal remediation work.
    

`nr_employees` initially remains unchanged because layoffs occur later.

**New department rows:** 0  
**Total department rows:** 14  
**Active organisational units:** 14

## Event 21 — 9 June 2024: Platform Shutdown and Workforce Reduction

HeriShare takes the platform offline and loses 15 employees through layoffs and resignations.

No department rows are deleted.

Changes are represented through:

- reduced `nr_employees`;
    
- lower budgets;
    
- new managers;
    
- temporary `manager_id = NULL` values where leaders leave;
    
- ended contracts and removed allocations.
    

The largest reductions affect:

- `2100` Product and Software Engineering
    
- `3100` Institutional Partnerships
    
- `3200` Investor and Buyer Relations
    
- `4100` Asset Research and Onboarding
    
- `6200` People and Administration
    
- `7100` Client Services
    
- `7200` Communications
    

Compliance staffing is protected because investigations and remediation continue during the shutdown.

### Post-crisis structure

|`d_id`|Department|Headcount|
|--:|---|--:|
|`1000`|Executive and Governance|4|
|`2100`|Product and Software Engineering|6|
|`2200`|Data and Systems|3|
|`2300`|Infrastructure and Security|3|
|`3100`|Institutional Partnerships|2|
|`3200`|Investor and Buyer Relations|3|
|`4100`|Asset Research and Onboarding|3|
|`4200`|Logistics and Custody|3|
|`5100`|Legal|3|
|`5200`|Compliance and Trust|4|
|`6100`|Finance and Transaction Operations|4|
|`6200`|People and Administration|2|
|`7100`|Client Services|3|
|`7200`|Communications|2|
||**Total**|**45**|

# Phase 4 — The Pivot

## Event 22 — 25 August 2024: Board Intervention and Strategic Pivot

The board approves the transformation of HeriShare into a private cultural-asset marketplace.

Caesar strongly and enthusiastically supports the new business model.

Bob voluntarily steps down as CTO but remains employed as **Founder and Principal Systems Architect**. Caesar and the board acknowledge his role in the platform failure but do not explicitly blame him.

### Executive and Governance — `1000`

- Paris becomes the department’s operational manager.
    
- Paris is not on the board; she wants the planned inside-director seat for which Marcelle is the likelier candidate.
    
- The department gains responsibility for confidential investigations and board coordination.
    
- Caesar continues to lead company strategy and promotes the private-market model.
    

### Technology — `2xxx`

- A new CTO becomes manager of `2100`.
    
- Bob remains allocated to `2100` but no longer manages it.
    
- `2200` receives a temporary transformation budget.
    
- `2300` receives additional security and access-control funding.
    

### Marketplace — `3xxx`

`3100` is renamed:

|`d_id`|Previous name|Current name|
|--:|---|---|
|`3100`|Institutional Partnerships|Seller Partnerships|

Its focus changes from museums and NGOs to:

- estates;
    
- private collectors;
    
- dealers;
    
- auction houses;
    
- distressed cultural organisations.
    

`3200` is renamed:

|`d_id`|Previous name|Current name|
|--:|---|---|
|`3200`|Investor and Buyer Relations|Private Sales and Buyer Relations|

Its focus changes from retail investors to:

- wealthy collectors;
    
- family offices;
    
- private museums;
    
- specialist buyers;
    
- negotiated transactions.
    

### Legal, Compliance and Risk — `5xxx`

`5200` is renamed:

|`d_id`|Previous name|Current name|
|--:|---|---|
|`5200`|Compliance and Trust|Compliance and Investigations|

The department now handles both marketplace compliance and internal misconduct investigations.

**New department rows:** 0  
**Renamed department rows:** 3  
**Total department rows:** 14

## Event 23 — 3 September 2024: Marcelle Joins

Marcelle Johnson joins as **Chief Data and Systems Transformation Officer**.

She becomes manager of:

|`d_id`|Department|
|--:|---|
|`2200`|Data and Systems|

The department receives a significant budget increase and temporarily operates as a company-wide transformation function.

Marcelle also receives allocations to:

- `2100` Product and Software Engineering;
    
- `4100` Asset Research and Onboarding;
    
- `5200` Compliance and Investigations;
    
- `6100` Finance and Transaction Operations.
    

Her work includes:

- merging clients into accounts;
    
- repairing ownership references;
    
- preserving historical transactions;
    
- standardising product and account data;
    
- creating compatibility logic;
    
- preparing a future database redesign.
    

The broad scope of `2200` increases Marcelle’s influence and contributes to Paris viewing her as a threat.

**New department rows:** 0  
**Manager change:** `2200`  
**Total department rows:** 14  
**Active headcount:** 46

## Event 24 — 29 September 2024: Quiet Rebranding

The existing departments begin operating under the private marketplace model.

Budgets increase for:

- `2200` Data and Systems
    
- `2300` Infrastructure and Security
    
- `3100` Seller Partnerships
    
- `3200` Private Sales and Buyer Relations
    
- `5100` Legal
    
- `5200` Compliance and Investigations
    
- `6100` Finance and Transaction Operations
    

Budgets decrease for:

- `7100` Client Services;
    
- `7200` Communications;
    
- museum-focused partnership work;
    
- restoration-focused operational activities.
    

No new department rows are needed because the existing structure is repurposed.

**New department rows:** 0  
**Total department rows:** 14  
**Active organisational units:** 14

## Event 25 — October 2024 to April 2025: Recovery and Selective Hiring

HeriShare hires 18 employees during recovery.

Hiring concentrates in:

- `2100` Product and Software Engineering
    
- `2200` Data and Systems
    
- `3100` Seller Partnerships
    
- `3200` Private Sales and Buyer Relations
    
- `4100` Asset Research and Onboarding
    
- `5200` Compliance and Investigations
    
- `6100` Finance and Transaction Operations
    

Elvis becomes **Acting CFO and Head of Finance Operations** and manager of `6100` after the previous finance leader leaves.

Marcelle remains manager of `2200` during her sabbatical because temporary leave does not change the department record.

Wheatley does not appear in `departments`, `employees` or legitimate `allocations`. His access to the internal company chat implies a high-ranking employee identity, but whether he is an outsider, an omitted employee or using a compromised identity remains unclear.

The player is a data engineering intern who does not appear in the company data because Marcelle's sabbatical interrupted their onboarding.

**New structural rows:** 14  
**Total department rows:** 28

# Historical 14-Department Snapshot

This snapshot predates the finalized 28-row repository hierarchy and is retained only as historical design material. Do not use its names, counts, manager roles or budgets as current database facts.

|`d_id`|Department|Current manager role|Headcount|Approx. annual budget|
|--:|---|---|--:|--:|
|`1000`|Executive and Governance|Chief Strategy and Corporate Affairs Officer|5|$1.35M|
|`2100`|Product and Software Engineering|Chief Technology Officer|10|$2.45M|
|`2200`|Data and Systems|Chief Data and Systems Transformation Officer|5|$1.35M|
|`2300`|Infrastructure and Security|Infrastructure and Security Manager|3|$1.05M|
|`3100`|Seller Partnerships|Head of Seller Partnerships|5|$1.20M|
|`3200`|Private Sales and Buyer Relations|Director of Private Sales|6|$1.65M|
|`4100`|Asset Research and Onboarding|Head of Asset Operations|5|$1.05M|
|`4200`|Logistics and Custody|Logistics and Custody Manager|4|$1.15M|
|`5100`|Legal|General Counsel|3|$1.10M|
|`5200`|Compliance and Investigations|Head of Compliance|4|$1.05M|
|`6100`|Finance and Transaction Operations|Acting CFO and Head of Finance Operations|5|$1.05M|
|`6200`|People and Administration|People Operations Manager|3|$650K|
|`7100`|Client Services|Client Services Manager|4|$650K|
|`7200`|Communications|Communications Manager|2|$450K|
||**Total**||**64**|**$16.20M**|

# Department Row Development

|Milestone|New rows|Renamed rows|Total rows|
|---|--:|--:|--:|
|Event 8 — Formal organisation|2|0|2|
|Event 10 — First employee|1|0|3|
|Event 12 — Partnership expansion|2|0|5|
|Event 14 — Marketplace launch|3|0|8|
|Event 15 — Viral growth|6|0|14|
|Events 15–18 — Continued growth|0|0|14|
|Event 19 — Media leak|0|0|14|
|Event 21 — Platform shutdown|0|0|14|
|Event 22 — Strategic pivot|0|3|14|
|Event 23 — Marcelle joins|0|0|14|
|Event 24 — Relaunch|0|0|14|
|Event 25 — Recovery and hierarchy normalization|14|3|28|

# Historical Department IDs

|`d_id`|Current `d_name`|
|--:|---|
|`1000`|Executive and Governance|
|`2100`|Product and Software Engineering|
|`2200`|Data and Systems|
|`2300`|Infrastructure and Security|
|`3100`|Seller Partnerships|
|`3200`|Private Sales and Buyer Relations|
|`4100`|Asset Research and Onboarding|
|`4200`|Logistics and Custody|
|`5100`|Legal|
|`5200`|Compliance and Investigations|
|`6100`|Finance and Transaction Operations|
|`6200`|People and Administration|
|`7100`|Client Services|
|`7200`|Communications|

# Current 28-Row Department Snapshot

This table matches the finalized repository data. Budgets on zero-budget specialist rows are carried by their parent department. Parent and child headcounts overlap.

|`d_id`|Current `d_name`|`manager_id`|`nr_employees`|Budget|
|--:|---|--:|--:|--:|
|`1000`|Executive Leadership|`23070303`|6|$1,450,000|
|`1100`|Executive Office|`23070303`|3|$850,000|
|`1200`|Strategy & Corporate Affairs|`23070303`|3|$600,000|
|`2000`|Technology|`14338498`|18|$5,100,000|
|`2100`|Product & Engineering|`14338498`|15|$3,100,000|
|`2110`|Product Management|`14338498`|1|$0|
|`2120`|Software Engineering|`14338498`|11|$0|
|`2200`|Data & Business Systems|`24090361`|8|$1,100,000|
|`2300`|IT & Security|`26887263`|3|$900,000|
|`3000`|Sales & Partnerships|`64166280`|14|$2,750,000|
|`3100`|Seller Partnerships|`64166280`|7|$1,200,000|
|`3200`|Private Sales|`72880343`|8|$1,550,000|
|`4000`|Art Operations|`60706330`|9|$2,100,000|
|`4100`|Art Research & Due Diligence|`60706330`|5|$1,050,000|
|`4110`|Provenance & Cataloguing|`60706330`|3|$0|
|`4120`|Valuation & Condition|`60706330`|1|$0|
|`4200`|Logistics & Collections|`63336966`|5|$1,050,000|
|`5000`|Legal & Risk|`59497116`|7|$2,150,000|
|`5100`|Legal|`59497116`|4|$1,150,000|
|`5200`|Compliance & Investigations|`35242525`|5|$1,000,000|
|`6000`|Finance & Corporate Services|`23121126`|9|$1,700,000|
|`6100`|Finance & Deal Operations|`23121126`|6|$1,100,000|
|`6110`|Accounting & Treasury|`23121126`|3|$0|
|`6120`|Transaction Operations|`23121126`|4|$0|
|`6200`|People & Workplace|`21097316`|3|$600,000|
|`7000`|Client Experience & Communications|`11194139`|8|$950,000|
|`7100`|Client Services|`11194139`|5|$600,000|
|`7200`|Communications|`32845340`|4|$350,000|
