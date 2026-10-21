> **Historical generation support.** The current repository data and finalized 28-row department hierarchy are canon. Early expense rows use the current hierarchy as normalized reporting codes, even where those specialist teams were not yet operated independently at the time.

## 1. Table purpose
`expenses(exp_id, amount, d_id, description, date, requested_by, approved_by)`
The table records non-payroll operating expenditure. It should indirectly show HeriShare's development through spending volume, department mix, amounts, description quality and approval discipline.
Salaries remain in `contracts`. Expenses include software, infrastructure, travel, asset handling, storage, insurance, professional services, marketing, recruitment, office costs and other operating purchases.
## 2. Historical FK rules
- `d_id` references `departments(d_id)`.
- `requested_by` and `approved_by` reference `employees(e_id)`.
- Never use an employee before `hire_date` or after their employment ends.
- Requesters should normally belong to the charged department at that date.
- Approvers should normally be managers, Finance, executives or another employee with credible authority.
- Avoid self-approval in baseline filler data.
### Before 23 June 2023
No formal departments or employees exist.
Therefore:
- `d_id = NULL`
- `requested_by = NULL`
- `approved_by = NULL`
These are founder expenses later entered into the ledger.
Do not assign early expenses retrospectively to `1000`, `2100` or another later department. Doing so would falsely imply that the department existed at the time.
## 3. Description progression
Descriptions should gradually professionalize.
Very early:
- `hosting`
- `figma`
- `slides + printing`
- `pizza working late`
Early company:
- `AWS July`
- `Northbridge transport`
- `Legal consultation - incorporation`
Growth:
- `Cloud infrastructure - November`
- `Asset condition surveys - August intake`
- `Partnership travel - East Coast`
Mature:
- `Outside counsel - platform ownership review`
- `Q1 storage and custody services`
Crisis:
- `External counsel - ownership matter`
- `Temporary complaint handling support`
- `Infrastructure shutdown support`
Post-pivot:
- `Seller provenance review`
- `Private client onboarding`
- `Secure custody transfer`
Do not explicitly write storyline states such as `crisis`, `pivot`, `cash shortage`, `loophole` or similar explanations.
# Phase 1 — Informal Startup
## January–March 2023 — Prototype
HeriShare is a two-person university project. Caesar and Bob are not employees and no department structure exists.
Likely expenses:
- domain;
- hosting;
- development tools;
- presentation materials;
- printing;
- transport;
- inexpensive meals during work sessions.
Typical descriptions:
- `hosting`
- `herishare domain`
- `figma monthly`
- `slides + printing`
- `train to campus event`
Typical amount: **$5–$150**, with rare purchases up to a few hundred dollars.
**Generator rules:**
- all three FK fields (`d_id`, `requested_by`, `approved_by`) NULL;
- sparse and irregular dates;
- casual descriptions;
- no artificial monthly accounting pattern.
## April–22 June 2023 — First Real Operations
Northbridge becomes the first supplier, V1 launches and HeriShare incorporates, but formal employment and departments still do not begin until seed funding on 23 June.
Spending expands into:
- photography;
- appraisal;
- condition documentation;
- packing;
- transport;
- insurance advice;
- legal consultation;
- marketing;
- production hosting;
- payment services;
- incorporation/accounting.
Descriptions become somewhat clearer:
- `Northbridge photography`
- `boxes for Northbridge`
- `launch social ads`
- `production hosting - May`
- `legal consultation - incorporation`
Typical costs:
- software/transport: $20–$500;
- marketing/professional services: $500–$5,000;
- occasional logistics/legal charges above this range.
**Generator rules:**
- `d_id`, `requested_by`, `approved_by` remain NULL through 22 June;
- no formal Finance, Legal, Marketing or Asset Operations department should be implied yet;
- records still look founder-entered even when vendors are professional.
# Phase 2 — Formal Organisation and Growth
## 23 June–2 July 2023 — Seed Funding and Formal Payroll
Only two departments exist:
- `1000` Executive and Governance — Caesar
- `2100` Product and Software Engineering — Bob
Only Caesar and Bob are formal employees.
Costs now include:
`1000`
- company administration;
- legal/accounting;
- fundraising;
- partnerships;
- recruitment;
- marketing/business development;
- general operating purchases.
`2100`
- hosting;
- development tools;
- software;
- technical hardware;
- infrastructure.
Descriptions begin to resemble company records:
- `Engineering tools - annual licenses`
- `Legal review - investment documents`
- `Production hosting - June`
- `Recruitment listing`
**Generator rules:**
- only `1000` and `2100` are valid historical cost centres;
- only Caesar and Bob may appear as requester/approver;
- use cross-approval rather than self-approval where approval exists;
- some NULL approvals remain plausible while bookkeeping is still informal.
## 3 July–24 August 2023 — First Non-Founder Employee
Paris joins and `7100 Client Services` is created.
Valid departments:
- `1000`
- `2100`
- `7100`
Client/user/community expenditure moves to `7100`:
- support tools;
- user communications;
- onboarding materials;
- community/event expenses.
Paris may request `7100` expenses, normally approved by Caesar rather than Paris.
Finance, partnerships, asset operations, logistics, HR, communications and legal remain informal functions under existing departments rather than separate cost centres.
## 25 August–4 October 2023 — Partnership Expansion
New departments:
- `3100 Institutional Partnerships`
- `4100 Asset Operations`
Six employees join across partnership and asset-operation roles.
Spending shifts:
`3100`
- institutional travel;
- museum/estate meetings;
- partnership materials;
- partner onboarding.
`4100`
- appraisal;
- provenance/cataloguing;
- photography;
- restoration assessments;
- transport coordination;
- insurance;
- storage/handling.
Important: `4200 Logistics and Custody` does **not** exist yet. Logistics, transport, storage and insurance expenses stay under `4100`.
Typical descriptions:
- `Institutional partner travel - August`
- `Photography services - new listings`
- `Temporary storage - September`
- `Condition survey services`
Approval becomes more distributed because department managers now exist.
## 5 October–18 November 2023 — Internal Marketplace Launch
New departments:
- `2300 Infrastructure and Security`
- `4200 Logistics and Custody`
- `6100 Finance and Transaction Operations`
Eight additional employees join.
Spending is redistributed:
`2100`
- application/product engineering;
- frontend/backend development;
- product tooling.
`2300`
- hosting;
- monitoring;
- access control;
- cybersecurity;
- production infrastructure.
`4100`
- asset research;
- appraisal;
- provenance;
- onboarding.
`4200`
- shipping;
- storage;
- custody;
- insurance;
- restoration vendors.
`6100`
- accounting;
- payments;
- reconciliation;
- banking/payment-provider charges;
- transaction operations.
Important functions still without dedicated departments:
- Data and Systems → continue under `2100`;
- Legal → normally `1000`;
- Compliance → `1000` or transaction-related work under `6100`;
- People/HR → `1000`;
- Communications/marketing → `7100` or `1000`;
- investor/buyer relations → `7100`.
Do not use `2200`, `3200`, `5100`, `5200`, `6200` or `7200` before 19 November.
## 19 November 2023 — Viral Growth and Full Department Structure
Six departments are created:
- `2200 Data and Systems`
- `3200 Investor and Buyer Relations`
- `5100 Legal`
- `5200 Compliance and Trust`
- `6200 People and Administration`
- `7200 Communications`
All 14 operational department IDs used by the original generation plan now exist. The finalized repository later expands this representation to the current 28-row hierarchy.
From this point, spending should migrate to the specialist department rather than continuing under earlier temporary cost centres.
Examples:
`2200`
- databases;
- reporting;
- integrations;
- internal systems.
`3200`
- investor onboarding;
- buyer events;
- marketplace participation support.
`5100`
- contracts;
- title/ownership advice;
- corporate work;
- outside counsel.
`5200`
- identity checks;
- platform-rule monitoring;
- fraud/trust services.
`6200`
- recruitment;
- HR systems;
- office operations;
- employee onboarding.
`7200`
- press;
- marketing communication;
- public materials;
- media monitoring.
Viral traffic creates immediate spending pressure:
- emergency cloud capacity;
- customer support tooling;
- contractors;
- verification services;
- recruitment;
- communications.
Descriptions are mostly professional, though rushed November purchases can remain abbreviated.
## December 2023–10 May 2024 — Mature Growth
Headcount rises from 35 to 60.
No additional departments are created. Existing departments expand and gain formal managers.
The highest expense activity should broadly occur in:
- `2100` Product and Software Engineering;
- `3100` Institutional Partnerships;
- `4100` Asset Research and Onboarding;
- `4200` Logistics and Custody;
- `6100` Finance and Transaction Operations;
- `6200` People and Administration;
- `7100` Client Services.
Recurring company traffic now dominates:
- SaaS;
- cloud;
- recruitment;
- professional services;
- storage/custody;
- travel;
- insurance;
- office;
- transaction support.
**Generator rules:**
- most rows now have requester and approver;
- requesters diversify across actual employees;
- managers approve department spending;
- Caesar/Bob no longer appear on routine requests;
- new hires create realistic equipment/onboarding clusters around hire dates;
- description format is mostly standardized.
# Phase 3 — Crisis and Shutdown
## 11 May–8 June 2024 — Emergency Budget Shift
The media leak triggers a hiring freeze but no immediate workforce reduction.
All 60 employees remain active until the shutdown.
Expense mix changes sharply.
Spending increases in:
`5100 Legal`
- outside counsel;
- ownership/title interpretation;
- legal responses;
- dispute work.
`5200 Compliance and Trust`
- investigation support;
- account reviews;
- verification;
- platform-control analysis.
`7100 Client Services`
- temporary complaint handling;
- customer communications;
- support tools.
`7200 Communications`
- crisis advisers;
- media monitoring;
- public-response materials.
Spending decreases in:
`3100 Institutional Partnerships`
- new partnership travel;
- promotional activity;
- expansion.
`6200 People and Administration`
- recruitment stops.
Technology (`2100`, `2200`, `2300`) shifts from growth work toward stability, investigation support and remediation.
Normal fixed costs continue.
**Generator rules:**
- this is primarily a change in departmental mix, not simply a uniform spending spike;
- legal/compliance invoices can become large;
- ordinary SaaS/storage/insurance still continue;
- no new ordinary employee requesters appear after the 11 May hiring freeze.
## 9 June 2024 — Platform Shutdown and Workforce Reduction
Fifteen employees leave through layoffs/resignations, reducing active headcount from 60 to 45.
Major expenses:
- employment counsel;
- restructuring support;
- vendor termination charges;
- infrastructure shutdown work;
- custody continuity;
- storage;
- insurance;
- outside counsel;
- accounting.
Spending collapses in:
- `3100`;
- `3200`;
- `6200`;
- `7100`;
- `7200`;
- discretionary work in `2100` and `4100`.
Compliance is relatively protected.
**Critical generator rule:** after each employee's actual contract end date, that employee must never appear as `requested_by` or `approved_by`.
Do not simply use the current employee register without checking historical employment status.
## 10 June–24 August 2024 — Distressed Operation
No ordinary hiring occurs.
The company retains 45 employees and all 14 operational department IDs tracked by this historical generation plan, but several teams operate at reduced capacity. The current repository represents the organization with 28 hierarchical rows.
Essential spending:
- core hosting/security;
- storage/custody;
- insurance;
- legal;
- compliance;
- accounting;
- data preservation;
- essential office/vendor commitments.
Little or no:
- recruitment;
- growth marketing;
- partnership events;
- expansion travel.
Descriptions become controlled and functional:
- `Core hosting - July`
- `Custody services - July`
- `Outside counsel - ongoing matters`
- `Accounting support - restructuring`
Approval becomes concentrated among surviving managers, Finance and executives.
Salary cuts on 24 June belong in `contracts`, not `expenses`.
# Phase 4 — Pivot and Recovery
## 25 August–2 September 2024 — Board Intervention
The company approves the private marketplace model.
Department IDs remain unchanged, but three departments are repurposed:
- `3100 Institutional Partnerships` → `Seller Partnerships`
- `3200 Investor and Buyer Relations` → `Private Sales and Buyer Relations`
- `5200 Compliance and Trust` → `Compliance and Investigations`
Spending starts rising selectively:
- operating-model legal advice;
- seller/buyer agreement work;
- platform restructuring;
- marketplace design;
- transaction-control planning.
Public-growth marketing remains minimal.
### CTO timing rule
Bob steps down as CTO on 25 August but remains employed.
The employee timeline places the replacement CTO's hire on 29 September.
Therefore the new CTO must **not** request or approve expenses between 25 August and 28 September.
Use existing authorized technical managers, Caesar/Paris or another historically valid approver during this interim period.
## 3–28 September 2024 — Marcelle and Systems Transformation
Marcelle joins on 3 September and becomes manager of `2200 Data and Systems`.
She is also allocated across:
- `2100`
- `4100`
- `5200`
- `6100`
Relevant spending increases:
- migration tooling;
- data reconciliation;
- database/infrastructure support;
- ownership-record repair;
- temporary technical services;
- compliance/data-quality tooling.
Examples:
- `Data migration tooling`
- `Legacy database support`
- `Ownership data reconciliation`
- `Infrastructure audit`
**Generator rules:**
- Marcelle can only appear from her hire date onward;
- she may legitimately request expenses across her allocated departments;
- do not route every transformation expense through her personally.
## 29 September 2024 — Quiet Rebranding
Five specialist employees join, including:
- new CTO;
- Director of Private Sales;
- compliance/investigation specialist;
- transaction operations specialist;
- technical specialist.
These employees become valid requesters/approvers only from their actual hire dates.
Department activity changes:
Increasing:
- `2200 Data and Systems`
- `2300 Infrastructure and Security`
- `3100 Seller Partnerships`
- `3200 Private Sales and Buyer Relations`
- `5100 Legal`
- `5200 Compliance and Investigations`
- `6100 Finance and Transaction Operations`
Decreasing:
- `7100 Client Services`
- `7200 Communications`
- museum-focused partnership work;
- restoration-heavy work.
New expense types:
- private seller onboarding;
- buyer verification;
- provenance;
- secure shipping;
- custody transfer;
- appraisal;
- private-sales travel;
- auction/dealer partnerships.
Examples:
- `Seller provenance review`
- `Private client onboarding`
- `Auction partner travel`
- `High-value shipment insurance`
- `Secure custody transfer`
## October–December 2024 — Early Recovery
Selective hiring resumes.
Expenses rise with marketplace activity:
- secure transport;
- appraisal;
- provenance;
- insurance;
- KYC;
- private-sales travel;
- seller acquisition;
- engineering;
- transaction operations.
Public advertising remains much smaller than during the fractional marketplace period.
Descriptions are consistently professional and approvals remain strict.
## January–April 2025 — Stable Recovery
Recovery hiring continues until the company reaches 64 active employees.
Hiring is concentrated in:
- `2100`
- `2200`
- `3100`
- `3200`
- `4100`
- `4200`
- `5200`
- `6100`
Expense volume increases alongside the new transaction model.
Strong recurring categories:
- private-sales software;
- provenance databases;
- KYC/compliance services;
- insurance;
- storage/custody;
- secure shipping;
- cloud/data;
- recruiting;
- professional services.
The company is again willing to enter larger contracts, but spending remains more controlled than during early 2024.
**Generator rules:**
- new employees appear only after actual hire dates;
- department allocations determine normal request patterns;
- current department names may be stored in helper fields, but historical interpretation must respect the August 2024 renames;
- no tampering/fraud/anomalous exercise rows belong in the baseline data.
# Global Data-Generation Rules
## Department availability
Valid historical departments:
- before 23 Jun 2023: none
- 23 Jun: `1000`, `2100`
- 3 Jul: + `7100`
- 25 Aug: + `3100`, `4100`
- 5 Oct: + `2300`, `4200`, `6100`
- 19 Nov: + `2200`, `3200`, `5100`, `5200`, `6200`, `7200`
After 19 Nov 2023 all 14 operational IDs in this historical generation plan exist permanently. They are only part of the finalized 28-row hierarchy.
## Historical department names
- `3100`: Institutional Partnerships → Seller Partnerships on 25 Aug 2024
- `3200`: Investor and Buyer Relations → Private Sales and Buyer Relations on 25 Aug 2024
- `4100`: Asset Operations → Asset Research and Onboarding on 5 Oct 2023
- `5200`: Compliance and Trust → Compliance and Investigations on 25 Aug 2024
The underlying `d_id` never changes.
## Employee availability
- before 23 Jun 2023: 0 employees
- 23 Jun: 2
- 3 Jul: 3
- 25 Aug: 9
- 5 Oct: 17
- 19 Nov: 35
- 10 May 2024: 60
- after 9 Jun layoffs: 45
- 3 Sep: 46
- 29 Sep: 51
- 30 Apr 2025: 64
Use the actual employee and contract tables, not these aggregate counts, when assigning IDs.
## Approval maturity
- pre-23 Jun: no internal approval fields
- Jun–Aug 2023: founder approval
- Aug–Nov 2023: founder + first managers
- late 2023–Apr 2024: normal departmental approval
- May–Aug 2024: approval concentrated among surviving senior staff
- post-pivot: strict manager/Finance/executive approval
## Exercise neutrality
Baseline filler data should contain:
- no fraud;
- no fabricated approvals;
- no deliberately suspicious duplicate invoices;
- no planted threshold avoidance;
- no exercise-answer rows.
Exercise-specific entries should be layered onto this clean historical baseline later.
