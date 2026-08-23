
## Table interpretation

The `employees` table is a permanent register of everyone formally employed by HeriShare.

- One row represents one employee.
    
- Employees remain after resignation or dismissal.
    
- `hire_date` never changes.
    
- `current_salary` stores the employee’s current annual salary.
    
- Former employees have `current_salary = NULL`.
    
- Contract dates, previous salaries, titles, and termination reasons belong in `contracts`.
    
- Department membership belongs in `allocations`.
    
- Promotions and department transfers do not create new employee rows.
    
- Contractors, consultants, vendors, and external agents are not employees.
    

At the beginning of the story:

- **79 employee rows**
    
- **64 active employees**
    
- **15 former employees**
    

The player does not appear in the table. Wheatley also does not appear because he is an outsider pretending to be an employee.

# Phase 1 — Startup

## Events 2–7 — February to June 2023: Informal Founder Work

Caesar Vallelonga and Bob Andrews build and test HeriShare but are not yet formally employed through company payroll.

**Employee-table effect:**

- No rows are created.
    
- Founder work before incorporation is not recorded as employment.
    
- Their later `hire_date` reflects the beginning of formal payroll, not the start of the prototype.
    

**New employees:** 0  
**Employee rows:** 0  
**Active employees:** 0

# Phase 2 — The Accelerator

## Event 8 — 23 June 2023: Seed Funding and Formal Payroll

Seed funding allows HeriShare to establish formal employment.

### Employees added

- **Caesar Vallelonga** — Founder and CEO
    
- **Bob Andrews** — Founder and CTO
    

Caesar handles fundraising, partnerships, operations, and company strategy. Bob handles software development, infrastructure, and database design.

Both founders initially accept moderate salaries to preserve runway.

**New employees:** 2  
**Employee rows:** 2  
**Active employees:** 2

## Event 10 — 3 July 2023: First Non-Founder Employee

Paris joins as HeriShare’s first non-founder employee.

### Employee added

- **Paris** — initially Customer Support and Community Associate
    

Paris handles early users, institutional contacts, complaints, community communication, and operational coordination.

Paris is later promoted, but retains the same employee row.

**New employees:** 1  
**Employee rows:** 3  
**Active employees:** 3

## Event 12 — 25 August 2023: Partnership Expansion

The major institutional partnership creates enough operational work to justify a small professional team.

### Employees added

Suggested roles:

- Head of Asset Operations
    
- Logistics and Custody Manager
    
- Head of Institutional Partnerships
    
- Provenance and Cataloguing Specialist
    
- Restoration and Condition Coordinator
    
- Operations Associate
    

These employees support asset intake, documentation, insurance, transport, restoration, and institutional relationships.

Several become long-serving department managers. Their IDs are later referenced by `departments.manager_id`.

**New employees:** 6  
**Employee rows:** 9  
**Active employees:** 9

## Event 14 — 5 October 2023: Internal Marketplace Launch

Secondary trading creates new technical, financial, and customer-support requirements.

### Employees added

Suggested roles:

- Backend Engineer
    
- Frontend Engineer
    
- Payments Engineer
    
- Infrastructure and Security Manager
    
- Data or Database Engineer
    
- Transaction Reconciliation Analyst
    
- Client Services Specialist
    
- People and Office Administrator
    

Technical employees receive higher salaries than most early operations staff.

Elvis may join Finance during this period or the following growth wave. His final canonical employee ID is reserved as `26`.

**New employees:** 8  
**Employee rows:** 17  
**Active employees:** 17

## Event 15 — 19 November 2023: Viral Press Coverage

HeriShare expands rapidly after national media attention.

The company hires across nearly every function.

### Main hiring areas

- Product and Software Engineering
    
- Data and Systems
    
- Seller and Institutional Partnerships
    
- Investor and Buyer Relations
    
- Asset Research and Onboarding
    
- Legal
    
- Compliance
    
- Finance
    
- Client Services
    
- Communications
    
- People Operations
    

### Important employee development

Elvis joins Finance and gradually gains responsibility for:

- reconciliations;
    
- supplier payments;
    
- transaction funds;
    
- company reporting;
    
- expense approval.
    

Paris moves beyond customer support and begins coordinating confidential cross-department issues.

**New employees:** 18  
**Employee rows:** 35  
**Active employees:** 35

## Events 15–18 — December 2023 to 10 May 2024: Continued Growth

Steady national growth produces HeriShare’s largest hiring period.

Twenty-five additional employees are added over several months rather than in one day.

### Main hiring areas

- Additional software engineers
    
- Product management and design
    
- Data engineering and internal systems
    
- Asset acquisition and institutional partnerships
    
- Buyer relations
    
- Provenance and valuation
    
- Logistics and custody
    
- Legal and compliance
    
- Finance and transaction operations
    
- Client services and communications
    

### Organisational changes

Paris is promoted to:

> **Chief of Staff and Director of Corporate Affairs**

She transfers into Executive and Governance and becomes Caesar’s main coordinator for:

- board materials;
    
- executive meetings;
    
- confidential complaints;
    
- crisis preparation;
    
- sensitive internal investigations;
    
- communication between department managers.
    

Elvis receives increasing authority in Finance.

Bob remains CTO and oversees Technology, although individual technical departments now have operational managers.

### Peak workforce

**New employees:** 25  
**Employee rows:** 60  
**Active employees:** 60

# Phase 3 — The Loophole

## Event 19 — 11 May 2024: Media Leak and Hiring Freeze

The ownership loophole becomes public.

### Employee-table effect

- Recruitment stops.
    
- Pending hires are cancelled.
    
- No ordinary employee rows are added.
    
- Legal, Compliance, Finance, Client Services, and Communications staff take on emergency work.
    
- Employee salaries initially remain unchanged.
    
- Some employees begin seeking other jobs, but departures are recorded later.
    

**New employees:** 0  
**Employee rows:** 60  
**Active employees:** 60

## Event 21 — 9 June 2024: Platform Shutdown and Workforce Reduction

HeriShare takes the platform offline and loses 15 employees through layoffs and resignations.

### Departures

Suggested composition:

- 9 layoffs
    
- 6 voluntary resignations
    

The largest reductions affect:

- Institutional Partnerships
    
- Client Services
    
- Communications
    
- Product Engineering
    
- Asset Onboarding
    
- People Operations
    

Legal, Compliance, Finance, Infrastructure, and core technical staff are largely protected.

### Employee-table effect

- All 15 employee rows remain.
    
- Their `current_salary` becomes `NULL`.
    
- Contract end dates and termination reasons are recorded in `contracts`.
    
- Their department allocations end.
    
- Remaining employees receive salary freezes, temporary cuts, or reduced bonuses.
    

### Important survivors

The retained core includes:

- Caesar
    
- Bob
    
- Paris
    
- Elvis
    
- essential engineering staff
    
- essential finance staff
    
- legal and compliance employees
    
- asset and transaction specialists
    

**Departing employees:** 15  
**Employee rows:** 60  
**Active employees:** 45

# Phase 4 — The Pivot

## Event 22 — 25 August 2024: Board Intervention

The board approves the private-marketplace pivot. Caesar enthusiastically supports it.

### Caesar

Caesar becomes the leading internal advocate for:

- private sales;
    
- wealthy buyers;
    
- auction-house partnerships;
    
- family-office clients;
    
- high-value direct transactions.
    

His employee row remains unchanged apart from his current salary.

### Bob

Bob steps down as CTO after conflict with Caesar and the board.

He remains employed as:

> **Founder and Principal Systems Architect**

This does not create a new employee row.

His title and responsibilities change through contracts and allocations. He retains extensive system knowledge and some legacy access but no longer manages Technology.

### Paris

Paris becomes:

- operational manager of Executive and Governance;
    
- non-voting board observer;
    
- a likely candidate for a future COO role or voting board seat.
    

Marcelle’s expected influence threatens Paris’s ambitions and access to Caesar.

### Elvis

Elvis becomes increasingly important after senior Finance employees leave. He gains access to confidential company and transaction information.

**New employees:** 0  
**Employee rows:** 60  
**Active employees:** 45

## Event 23 — 3 September 2024: Marcelle Johnson Joins

Marcelle Johnson is hired as:

> **Chief Data and Systems Transformation Officer**

Her canonical employee ID is `61`.

She becomes manager of Data and Systems and receives cross-department responsibilities involving:

- Product Engineering;
    
- Asset Operations;
    
- Compliance;
    
- Finance;
    
- ownership records;
    
- client and account migration.
    

Marcelle receives a comparatively high salary because HeriShare urgently needs her expertise.

Her influence creates direct tension with Paris, who fears Marcelle could become COO, board adviser, or Caesar’s primary internal problem-solver.

**New employees:** 1  
**Employee rows:** 61  
**Active employees:** 46

## Event 24 — 29 September 2024: Quiet Rebranding

HeriShare hires a small number of senior specialists required for the relaunch.

### Important hires

- **Chief Technology Officer** — employee ID `62`
    
- Director of Private Sales — employee ID `64`
    
- Senior Compliance or Investigations Specialist
    
- Transaction Operations Specialist
    
- Data or Platform Engineer
    

The new CTO replaces Bob as manager of Product and Software Engineering.

New hires generally receive stronger salaries than employees retained through the crisis. This creates visible salary inconsistencies.

**New employees:** 5  
**Employee rows:** 66  
**Active employees:** 51

## Event 25 — October 2024 to April 2025: Recovery Hiring

HeriShare adds 13 employees as the private marketplace stabilises.

### Main hiring areas

- Private Sales and Buyer Relations
    
- Seller Partnerships
    
- Product and Software Engineering
    
- Data and Systems
    
- Compliance and Investigations
    
- Finance and Transaction Operations
    
- Asset Research and Onboarding
    
- Logistics and Custody
    

### Elvis

Elvis becomes:

> **Acting CFO and Head of Finance Operations**

His employee ID is `26`.

He manages Finance and Transaction Operations and prepares sensitive financial information for Caesar and the board.

His position explains why he can discuss:

- cash shortages;
    
- disputed payments;
    
- reconciliation failures;
    
- legal-vehicle balances;
    
- supplier liabilities;
    
- internal financial controls.
    

It also gives him the access needed to conceal financial misconduct.

### Marcelle

Marcelle remains manager of Data and Systems during her later sabbatical. Temporary leave does not change her employee row or management status.

### Salary effects

- Some crisis-era salary cuts are partially restored.
    
- New commercial and technical hires receive market-rate salaries.
    
- Long-serving employees may earn less than recent hires in similar roles.
    
- Former employees continue to have `current_salary = NULL`.
    

**New employees:** 13  
**Employee rows:** 79  
**Active employees:** 64

# Current Active Workforce

|Department|Active employees|
|---|--:|
|Executive and Governance|5|
|Product and Software Engineering|10|
|Data and Systems|5|
|Infrastructure and Security|3|
|Seller Partnerships|5|
|Private Sales and Buyer Relations|6|
|Asset Research and Onboarding|5|
|Logistics and Custody|4|
|Legal|3|
|Compliance and Investigations|4|
|Finance and Transaction Operations|5|
|People and Administration|3|
|Client Services|4|
|Communications|2|
|**Total**|**64**|

# Important Employee Records

|`e_id`|Employee|Current significance|
|--:|---|---|
|`1`|Caesar Vallelonga|Founder and CEO; enthusiastic supporter of the pivot|
|`2`|Bob Andrews|Founder and Principal Systems Architect; former CTO|
|`3`|Paris|Chief of Staff, Executive manager, board observer|
|`26`|Elvis|Acting CFO and Head of Finance Operations|
|`61`|Marcelle Johnson|Chief Data and Systems Transformation Officer|
|`62`|Current CTO|Manages Product and Software Engineering|
|`64`|Director of Private Sales|Manages Private Sales and Buyer Relations|

Other manager IDs reserved in the departments dataset must correspond to valid employee rows:

|`e_id`|Management role|
|--:|---|
|`6`|Head of Asset Operations|
|`7`|Logistics and Custody Manager|
|`8`|Head of Seller Partnerships|
|`15`|Infrastructure and Security Manager|
|`24`|General Counsel|
|`28`|Client Services Manager|
|`33`|Communications Manager|
|`34`|People Operations Manager|
|`40`|Head of Compliance|

# Excluded Identities

## Wheatley

Wheatley is not an employee.

He must not have:

- an employee row;
    
- a legitimate contract;
    
- a payroll record;
    
- a valid department allocation.
    

He may appear in operational systems under a fabricated or compromised identity. Comparing those systems with `employees` should reveal that no matching employee exists.

## Player

The player is not represented in the database.

The player functions as the narrative investigator rather than a stored employee record.

# Workforce Development Summary

|Milestone|New hires|Departures|Employee rows|Active employees|
|---|--:|--:|--:|--:|
|Event 8 — Formal payroll|2|0|2|2|
|Event 10 — Paris joins|1|0|3|3|
|Event 12 — Partnership team|6|0|9|9|
|Event 14 — Marketplace team|8|0|17|17|
|Event 15 — Viral growth|18|0|35|35|
|Events 15–18 — Continued growth|25|0|60|60|
|Event 19 — Hiring freeze|0|0|60|60|
|Event 21 — Layoffs and resignations|0|15|60|45|
|Event 23 — Marcelle joins|1|0|61|46|
|Event 24 — Relaunch leadership|5|0|66|51|
|Event 25 — Recovery hiring|13|0|79|64|