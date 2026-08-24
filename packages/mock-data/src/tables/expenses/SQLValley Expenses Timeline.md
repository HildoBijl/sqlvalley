## 1. Function of the table
The `expenses` table records non-payroll operating expenditure incurred by HeriShare:
`expenses(exp_id, amount, d_id, description, date, requested_by, approved_by)`
It should function as an indirect financial diary of the company. Changes in spending volume, amount, department, description quality, and approval discipline should reveal HeriShare's progression from improvised student startup → funded company → fast-growing platform → crisis → stripped-down operation → private marketplace.
Salaries belong in `contracts` and should not be duplicated here. Expenses may include software, infrastructure, advertising, professional services, travel, insurance, storage, logistics, asset handling, office costs, recruitment, legal proceedings, consultants, severance-related professional costs, and other non-payroll operating expenditure.
### FK rules
- `d_id` must reference an existing department.
- `requested_by` and `approved_by` reference `employees(e_id)`.
- Employees must exist and be employed on the expense date.
- Where department allocations exist, requesters should normally belong to the charged department.
- Approvers should normally be a manager, Finance employee, senior executive, or another employee with believable authority.
- Avoid routine self-approval once a real approval process exists.
### Historical exception
Caesar and Bob are not formally employees during early Phase 1. Expenses from that period are founder purchases later backfilled into the ledger. `requested_by` and `approved_by` may therefore be `NULL`.
## 2. Description-style progression
Descriptions are part of the storytelling.
**Very early:** `hosting`, `pizza - working late`, `museum stuff shipping`
**Early funded startup:** `AWS July`, `Northbridge transport`, `Legal - marketplace terms`
**Growing company:** `Cloud infrastructure - October 2023`, `Asset custody - Q4 renewal`, `Partnership travel - East Coast`
**Mature company:** `Outside counsel - platform ownership review`, `Q1 storage and custody services`
**Crisis:** descriptions become hurried but not cartoonish: `External counsel - urgent ownership matter`, `PR monitoring May`, `Temporary support coverage`
**Post-pivot:** restrained and commercial: `Private sale insurance review`, `Auction partner onboarding`, `Custody transfer - Q1`
Do not write descriptions such as `company crisis`, `loophole legal fees`, `desperate cost cutting`, or `pivot expenses`. The story should be inferred.
# Phase 1 — The Startup
## 18 January 2023 — Two Friends and a Vision
HeriShare is essentially a university project. Spending is personal, sparse, cheap, and poorly documented.
Typical spending:
- domain registration;
- basic hosting;
- presentation materials;
- printing;
- cheap software subscriptions;
- transport and food around meetings.
Description examples:
- `herishare domain`
- `hosting`
- `slides + printing`
- `figma monthly`
- `pizza - working late`
**Generator target:** 5–10 rows, mostly $5–$100, approximately $150–$400 total.
**Generation guidance:** most `requested_by` and `approved_by` NULL. Dates should cluster around project work rather than create regular monthly accounting patterns.
## 9 February 2023 — First Prototype
Technology becomes the main expense source. Bob builds almost everything himself, keeping costs low.
Likely spending:
- hosting upgrades;
- email/domain services;
- cloud/database usage;
- UI assets;
- development subscriptions;
- adapters or small demo hardware.
Descriptions remain short: `server`, `AWS feb`, `UI icons`, `prototype hosting`.
**Generator target:** 10–15 new rows; mostly $5–$150 with 1–2 purchases up to $400. Cumulative Phase 1 spending roughly $800–$1,500.
## 3 March 2023 — Student Startup Night
Spending begins shifting from coursework toward promotion.
Likely spending:
- flyers/posters;
- presentation improvements;
- transport;
- event-related fees;
- mailing/analytics tools;
- small hosting upgrade after increased traffic.
Examples: `startup night flyers`, `poster print`, `mailing list upgrade`, `Uber - equipment`.
**Generator target:** 8–15 event-linked rows, roughly $800–$1,500, plus ordinary recurring software traffic.
## 11 April 2023 — First Partnership
The Northbridge partnership creates the first meaningful operational costs related to physical cultural assets.
New spending types:
- photography;
- appraisal assistance;
- condition documentation;
- packing;
- transport;
- insurance consultation;
- restoration advice;
- legal review;
- temporary storage/handling.
Description quality improves slightly because expenses now need explanation:
- `Northbridge visit - mileage + parking`
- `photographer for museum objects`
- `lawyer - partnership agreement`
- `boxes for Northbridge`
- `insurance quote consultation`
**Generator target:** 20–30 new rows; common amounts $50–$600, professional services $500–$2,500, isolated logistics/legal entries up to $3,000–$5,000. Partnership-related spending approximately $10k–$18k.
## 12 April–5 May 2023 — Launch Preparation
Non-event traffic becomes substantial. Technology, asset operations, marketing and professional services all generate requests.
Examples:
- `April hosting - production`
- `Northbridge asset photography`
- `launch social ads`
- `payment integration testing`
- `consultation re customer funds`
Some vague descriptions remain.
**Generation guidance:** include recurring SaaS charges on believable intervals; do not tie every expense to a named event.
## 6 May 2023 — V1 Launch
Launch week creates Phase 1's largest burst.
Technology:
- production hosting;
- monitoring;
- transactional email;
- payment services.
Marketing:
- paid campaigns;
- content;
- launch materials.
Operations:
- museum outreach;
- documentation;
- shipping/insurance quotes.
Administrative:
- accounting;
- legal/business-registration preparation.
Examples range from `ads` and `extra server` to `Launch campaign - paid social` and `Customer email platform`.
**Generator target:** 30–45 May rows; common costs $50–$1,000, campaigns $1k–$5k, occasional legal/operations costs $2k–$6k. May total approximately $25k–$40k.
## 2 June 2023 — Incorporation
Formal corporate costs appear:
- incorporation;
- registered agent;
- accounting setup;
- banking;
- bookkeeping software;
- legal/template review;
- business insurance.
Descriptions become incrementally cleaner: `Legal consultation - incorporation`, `Production hosting - June`.
**Phase 1 target:** approximately 90–130 rows and $45k–$70k total. Exact total should look organic rather than engineered.
# Phase 2 — The Accelerator and Growth
## 20 June 2023 — Accelerator Entry
The accelerator provides office space and mentorship, so HeriShare should not suddenly spend heavily on its own headquarters. Spending shifts toward making the prototype commercially credible.
New costs:
- fintech/legal workshops not covered by accelerator;
- travel;
- cloud infrastructure;
- prototype hardening;
- basic professional insurance;
- asset onboarding work.
**Generation guidance:** use moderate traffic. Accelerator support should suppress some office and consulting costs that would otherwise exist.
## 23 June 2023 — Seed Funding
The $150k seed investment changes spending behaviour almost immediately. HeriShare has money but little financial discipline.
Spending rises across:
- development;
- hiring/recruitment;
- legal setup;
- marketing;
- equipment;
- software.
Requests become attributable to employees from this point onward as founders and early staff formally enter the employee system.
Description examples:
- `Engineering tools - annual licenses`
- `Recruiter posting package`
- `MacBook - operations`
- `June paid social`
- `Legal review - investment structure`
**Generator target:** sharp but believable increase. Do not spend the entire funding round immediately. Larger one-off purchases of $1k–$8k become normal.
**Approval guidance:** early employee expenses may still show Caesar/Bob approving each other or senior staff approving informally. Some `approved_by` NULL is still plausible during transition.
## 28 June 2023 — Mentor Review
Weak transaction infrastructure and asset onboarding become explicit priorities.
Spending should react within days/weeks:
- backend/cloud consultants;
- payment integration work;
- monitoring;
- onboarding templates;
- condition-report tooling;
- logistics/vendor consultations.
Descriptions become more task-oriented without explicitly mentioning the mentor review.
## 3 July 2023 — Team Expansion
First employees create regular operating traffic.
New expense patterns:
- laptops;
- peripherals;
- software seats;
- recruitment;
- onboarding;
- travel;
- office supplies;
- team meals.
**Generation guidance:** new hires should produce small expense clusters close to hire dates, but not identical "starter packs" for every employee.
## 18 July 2023 — Second Listing Sells Out
The successful listing boosts confidence. Management becomes willing to spend ahead of growth.
Effects:
- modest marketing increase;
- more asset sourcing travel;
- higher appraisal and insurance traffic;
- platform scaling costs.
There should be no absurd spending spike from a single listing.
## 25 August 2023 — Major Partnership Expansion
Several museums and estates join, producing the first strong operational burst.
Costs:
- appraisal and provenance work;
- photography;
- transport;
- insurance;
- storage;
- restoration consultations;
- partnership travel;
- contract work.
Descriptions are now substantially more professional:
- `Asset condition surveys - August intake`
- `Institutional partner travel - August`
- `Temporary insured storage`
- `Photography services - new listings`
**Generator guidance:** operations/partnership departments should noticeably over-index during this period.
## 1 September 2023 — Accelerator Demo Day
Smaller burst:
- presentation production;
- travel/hospitality;
- event materials;
- follow-up meetings.
Investor-facing spending exists but remains modest.
## September 2023 — Organic Growth
Regular expenses increasingly dominate event-specific ones:
- monthly SaaS;
- infrastructure;
- insurance;
- storage;
- recruitment;
- travel;
- professional services.
**Generation guidance:** by now at least 60–70% of rows should be normal recurring/operational traffic rather than named-story-event expenses.
## 5 October 2023 — Marketplace Upgrade
Launching secondary share trading creates meaningful engineering and finance costs.
Likely:
- cloud scaling;
- payment/reconciliation tooling;
- security review;
- monitoring;
- external technical support;
- legal review of marketplace terms;
- customer-support software.
Examples:
- `Marketplace infrastructure capacity`
- `Payment reconciliation tooling`
- `External security review`
- `Updated platform terms - counsel`
The company is no longer casually run; approvals and descriptions should usually be complete.
## October–18 November 2023 — Team Build-Out
Engineering, operations, reconciliation, client services and administration expand.
Expense volume rises structurally due to:
- equipment;
- software seats;
- recruiters;
- office needs;
- SaaS contracts;
- travel;
- increased asset custody.
**Generator guidance:** use valid current employees and departments. Requesters should diversify; Caesar/Bob should no longer request or approve everything.
## 19 November 2023 — Viral Press Coverage
Traffic explodes from roughly 300 to 1,800 users over ten days. Infrastructure and support spending react quickly.
Immediate expenses:
- emergency cloud capacity;
- monitoring;
- support tools;
- contractors;
- PR/media subscriptions;
- recruitment;
- overtime-related meals/travel where appropriate;
- fraud/verification services.
Examples:
- `Additional cloud capacity - November`
- `Temporary customer support coverage`
- `Media monitoring subscription`
- `Identity verification usage - Nov`
The tone remains professional, but some rushed purchases can use abbreviated descriptions.
**Generator target:** one of the largest month-over-month expense increases in the table so far.
## December 2023–January 2024 — Scaling After Virality
HeriShare hires heavily and professionalizes.
Recurring expense base expands:
- larger office/facilities needs;
- employee software;
- recruitment agencies;
- HR systems;
- security;
- accounting;
- outside legal counsel;
- customer support;
- travel;
- asset storage/logistics.
Descriptions become standardized:
`Cloud infrastructure - Dec 2023`
`Employee equipment - Backend Engineering`
`Outside counsel - platform matters`
`Storage and custody services - December`
**Approval guidance:** almost every expense now has both requester and approver. Larger expenses should skew toward managers/executives/Finance approvers.
## 1 February–20 April 2024 — Mature Growth
The company operates like a real venture-backed marketplace. Expense traffic should be high but routine.
Dominant categories:
- engineering/cloud;
- personnel-related operating costs excluding salaries;
- marketing;
- asset sourcing;
- insurance and custody;
- professional services;
- compliance;
- offices/travel.
Occasional five-figure expenses become believable: annual contracts, campaigns, specialist legal work, bulk storage/custody, consulting.
**Generation guidance:** avoid making all expenses increase monotonically. Monthly totals should fluctuate naturally depending on annual renewals, campaigns, asset batches and recruitment.
**Phase 2 overall target:** approximately 500–700 expense rows from June 2023 through 20 April 2024. Spending should grow from tens of thousands per month into low/mid six figures monthly by early 2024.
# Phase 3 — The Loophole and Crisis
## 21 April 2024 — First Majority Ownership Accumulation
Initially, management does not recognize a systemic issue.
Expense effect should be subtle:
- a few unusual legal consultations;
- transaction/reconciliation investigation;
- valuation/ownership analysis.
Examples:
- `External counsel - ownership interpretation`
- `Transaction reconciliation support`
- `Ownership records review`
**Generator guidance:** do not create an obvious crisis spike yet.
## 23 April 2024 — Pattern Spreads
The internal investigation widens.
Effects:
- additional legal hours;
- data/reconciliation work;
- external advisory support;
- asset ownership reviews.
Normal expansion expenses continue because hiring commitments and projects have not yet stopped.
This overlap is important: the table should show the company still spending like a growth company while strange legal costs begin accumulating.
## 2 May 2024 — Relocation Request
A majority holder requests physical relocation of an asset. Legal and Operations suddenly need answers.
Expenses increase around:
- outside counsel;
- contract interpretation;
- insurance advice;
- custody/transport scenarios;
- emergency provenance/title review;
- executive travel/meetings.
Descriptions:
- `Outside counsel - custody rights`
- `Insurance advice - proposed transfer`
- `Asset relocation assessment`
- `Specialist ownership opinion`
The descriptions should signal something unusual without naming the loophole.
**Generation guidance:** legal/operations expenses should jump before overall company spending falls.
## 11 May 2024 — Media Leak
The issue becomes public. Museums/NGOs freeze collaboration and threaten action. Hiring freezes immediately while Legal, Communications and Compliance workload explodes.
Spending increases in:
- litigation/outside counsel;
- crisis communications;
- media monitoring;
- stakeholder communications;
- specialist compliance reviews;
- transaction/account investigations;
- short-term contractors.
Spending decreases in:
- recruitment;
- ordinary marketing;
- expansion travel;
- new partnership acquisition.
Examples:
- `Outside counsel - platform ownership claims`
- `Communications advisory - May`
- `Press monitoring - expanded coverage`
- `Temporary reconciliation support`
- `Institutional partner response materials`
**Generator guidance:** this should be a departmental redistribution, not simply "all spending goes up." Marketing/acquisition falls while Legal/PR/Compliance rise sharply.
## 12–27 May 2024 — Crisis Traffic
Normal recurring bills continue despite the crisis:
- SaaS;
- office;
- cloud;
- insurance;
- storage;
- existing vendor contracts.
This matters because companies cannot instantly stop their cost base.
At the same time:
- cancelled recruitment invoices;
- legal retainers;
- PR consultants;
- investigation tooling;
- emergency travel
appear more frequently.
Descriptions may become less polished because requests are submitted quickly:
- `Counsel invoice - additional hours`
- `press tracking`
- `urgent storage review`
but should not revert to student-startup sloppiness.
## 28 May 2024 — Platform Destabilized
Attempts to halt trading face legal pushback while transaction revenue is unusually high. Crisis costs accelerate.
Likely major expenses:
- litigation counsel;
- forensic/account review;
- emergency engineering contractors;
- security/monitoring;
- crisis communications;
- transaction reconciliation;
- temporary support capacity.
This period should contain some of the largest professional-service invoices in the dataset.
**Generator target:** individual legal invoices may reach $20k–$100k; multiple related invoices can occur without using identical descriptions.
**Approval guidance:** approval becomes concentrated among executives, Legal and Finance. Some urgent requests may be approved unusually quickly or by atypically senior employees.
## 9 June 2024 — Platform Shutdown
The platform is taken offline. Layoffs follow on 10 June and several employees resign around the same period.
Immediate expenses:
- shutdown-related infrastructure work;
- outside counsel;
- employment/legal advice;
- vendor termination costs;
- severance administration/professional fees;
- secure asset/custody arrangements;
- cancelled campaign/vendor commitments.
At the same time:
- marketing effectively collapses;
- recruitment disappears;
- partnership travel disappears;
- discretionary software/services begin being cancelled.
Descriptions become austere:
- `Employment counsel - restructuring`
- `Vendor termination charge`
- `Infrastructure shutdown support`
- `Custody continuity services`
- `Contract cancellation fee`
## 10–23 June 2024 — Cash Conservation
The company remains responsible for storage, insurance, minimum infrastructure, legal work and essential administration despite reduced operations.
Traffic falls sharply in number of requests but average legal/essential expense can remain high.
**Generation guidance:** do not make expenses disappear. Fixed obligations should create a visible floor.
## 24 June 2024 — Delayed Financial Response
Leadership salary cuts occur after Finance establishes the severity of the cash shortage. Salary changes themselves belong in `contracts`, not `expenses`.
Expense effects:
- tighter approvals;
- discretionary requests rejected before reaching the table;
- fewer meals/travel;
- cheaper vendor choices;
- cancellation credits/termination fees where plausible;
- professional services scrutinized more carefully.
Descriptions become more standardized because Finance is controlling the ledger.
## July–24 August 2024 — Distressed Operation
This should be the quietest sustained period since early startup, but not as cheap.
Essential costs:
- minimum infrastructure;
- legal defence;
- asset insurance;
- custody/storage;
- accounting;
- office obligations;
- data preservation;
- essential vendors.
Almost no:
- paid growth marketing;
- recruiting;
- expansion travel;
- promotional events.
Example descriptions:
- `Core hosting - July`
- `Custody services - July`
- `Outside counsel - ongoing matters`
- `Accounting support - restructuring`
**Phase 3 pattern:** April/early May = growth spending plus emerging legal costs; mid/late May = crisis-spending peak; June onward = sharp volume contraction with persistent expensive legal/custody obligations.
# Phase 4 — The Pivot
## 25 August 2024 — Board Intervention
The board decides to abandon the public-access model and build a private cultural-assets marketplace.
Immediate spending:
- strategic/legal advisory;
- restructuring work;
- system redesign planning;
- contract review;
- market/auction advisory;
- retention/recruiting for crucial roles.
Descriptions should avoid the word `pivot` where possible:
- `Marketplace operating model review`
- `Platform restructuring advisory`
- `Seller agreement redraft`
- `Transaction framework consultation`
Spending begins rising again, but selectively.
## Late August–2 September 2024 — Relaunch Preparation
Cost control remains strict, but investment resumes in areas necessary for the new model:
- engineering;
- database migration;
- due diligence;
- custody;
- legal;
- private-client operations.
Consumer-marketing expenses remain very low.
## 3 September 2024 — Marcelle Johnson Joins
Marcelle begins database/system restructuring.
Expense effects:
- data migration tooling;
- contractor support;
- temporary infrastructure;
- software licenses;
- data-quality services;
- architecture consultancy if needed.
Examples:
- `Data migration tooling`
- `Legacy database support`
- `Infrastructure audit`
- `Data reconciliation services`
**Generation guidance:** Marcelle may request significant technical/system expenses soon after hiring, but should not personally request every migration-related expense.
## September 2024 — Specialist Rebuilding
New hires include technology, private sales and transaction operations staff. The company starts spending to support them:
- employee equipment;
- transaction tooling;
- private-sales CRM;
- identity/KYC services;
- provenance research tools;
- secure communications;
- seller/buyer onboarding.
Compared with Phase 2, there is less public marketing and more transaction/custody/due-diligence expenditure.
## 29 September 2024 — Quiet Rebranding
HeriShare reopens as the `Exclusive Asset Marketplace`. Most former institutional partners leave; private sellers, estates, dealers and auction houses become increasingly important.
Expenses shift visibly:
**Declining:** restoration campaigns, community outreach, retail marketing, museum partnership events.
**Increasing:** provenance, valuation, private-client travel, insurance, secure shipping, custody, auction partnerships, KYC/AML, transaction processing.
Examples:
- `Private client onboarding materials`
- `Seller provenance review`
- `Auction partner travel`
- `High-value shipment insurance`
- `Secure custody transfer`
- `Buyer verification services`
**Generator guidance:** department mix should reveal the business-model change even if descriptions are read without storyline context.
## October 2024 — Controlled Relaunch
Transaction volume is still limited. Spending is higher than the summer trough but remains cautious.
Likely:
- private sales travel;
- KYC/compliance;
- infrastructure;
- custody;
- insurance;
- targeted seller acquisition;
- transaction operations.
Public advertising remains negligible.
Approvals remain strict and senior.
## November–December 2024 — Early Recovery
Successful trading produces confidence.
Expense traffic rises:
- more secure transport;
- appraisal/provenance work;
- insurance;
- account management travel;
- auction/dealer onboarding;
- recruitment for the new model;
- engineering capacity.
The company begins accepting larger vendor contracts again.
Description style is now consistently professional.
## January–February 2025 — Scaling the New Model
HeriShare increasingly resembles a mature specialist marketplace.
Regular traffic:
- CRM/software;
- KYC/AML;
- insurance;
- provenance databases;
- storage/custody;
- private-sales travel;
- secure shipping;
- recruiting;
- cloud/data;
- professional services.
Larger transaction-linked operating costs occur more often because more expensive assets are changing hands.
**Generation guidance:** correlate broad monthly operating volume with the transactions timeline: increasing completed transactions should produce more logistics, validation, insurance and client-service spending, but never one expense per transaction.
## March–April 2025 — Stable Recovery
The company is profitable again and hiring selectively. Spending is no longer distressed but remains more controlled than the pre-crisis growth phase.
Characteristics:
- high recurring operational base;
- fewer impulsive marketing expenses;
- substantial custody/insurance/provenance costs;
- renewed recruitment;
- professional descriptions;
- consistent approval chains;
- occasional high-value specialist invoices.
April should be one of the busier post-pivot months, reflecting the highest transaction traffic.
**Phase 4 target:** expense volume climbs steadily from the summer trough through April 2025. The department mix should be materially different from Phase 2 even when total monthly spending becomes comparable.
# Phase 5 — The Story Period
## Marcelle's Sabbatical
After roughly six months of rebuilding, Marcelle leaves on sabbatical. Before leaving she announces plans for a more comprehensive employee-monitoring system.
Ordinary expense traffic continues. There should not be a dramatic company-wide financial event solely because she leaves.
Possible legitimate expenses:
- monitoring/security tooling evaluation;
- workflow analytics software;
- data governance tooling;
- temporary technical support.
Descriptions should remain mundane: `Workflow analytics pilot`, `Access monitoring license`, `Systems audit tooling`.
## Elvis — Financial Tampering
Elvis becomes convinced the company has no future and begins siphoning money.
This is the expenses table's principal Phase 5 story contribution.
The fraudulent rows must be subtle enough to survive casual inspection.
Possible patterns:
- legitimate-sounding consulting invoices;
- repeated low/mid-value reimbursements;
- duplicated or near-duplicated vendor-style descriptions;
- unusually frequent Finance/Operations charges;
- expenses just below common approval thresholds;
- expenses requested/approved through plausible but suspicious combinations;
- clusters during Marcelle's absence;
- descriptions copied from real historical expenses with minor wording changes.
Examples:
- `External reconciliation support`
- `Vendor settlement adjustment`
- `Operational services - April`
- `Transaction processing consultancy`
Do **not** use descriptions such as `stolen funds`, `fake invoice`, `Elvis transfer`, or anything that directly identifies fraud.
**Generation guidance:** fraudulent/anomalous rows should be a very small minority of the full table. They need to be detectable through joins, aggregation, repeated descriptions, timing, amounts, request/approval patterns, or comparison with normal departmental behaviour.
# Data Generation Guidelines
## Overall scale
Recommended learner-friendly target: approximately **1,200–1,600 expense rows** across January 2023 through the story snapshot.
Suggested broad distribution:
| Period | Approx. rows | Character |
|---|---:|---|
| Phase 1 | 90–130 | tiny, irregular, founder-driven |
| Phase 2 | 550–700 | rapid expansion and professionalization |
| Phase 3 | 180–250 | legal spike followed by severe contraction |
| Phase 4 | 350–450 | disciplined recovery and new business model |
| Phase 5 | 30–70 | normal traffic plus sparse suspicious anomalies |
Do not force perfectly round phase totals in the final generation.
## Amount distribution
Use a strongly right-skewed distribution.
- Many expenses: $10–$500.
- Common professional/company expenses: $500–$5,000.
- Moderate vendor/service invoices: $5,000–$25,000.
- Rare major invoices: $25,000–$100,000+.
Never use a uniform random amount generator.
Amounts should often resemble real invoices (`482.17`, `3,840.00`, `17,625.50`) rather than constantly round numbers.
Early startup expenses may contain more round/casual amounts.
## Recurring expenses
Create recognizable but imperfect recurring series:
- cloud hosting;
- SaaS;
- office;
- accounting;
- storage;
- insurance;
- monitoring.
Amounts may change as usage grows, contracts change, or the company downsizes.
Do not make every recurring charge occur on exactly the same day or with exactly the same amount.
## Department behaviour
Department expense volume should follow actual company activity.
- Engineering: cloud, tooling, hardware, contractors.
- Operations: storage, shipping, handling, custody.
- Partnerships/Sales: travel, events, seller acquisition.
- Marketing/Communications: campaigns, content, PR.
- Legal/Compliance: counsel, due diligence, investigations.
- Finance/Admin: accounting, banking, subscriptions, office.
- HR/People: recruiting, onboarding, training.
Use exact department IDs from `departments`; do not invent IDs.
## Employee behaviour
Use exact employee IDs from `employees`.
Requesters should usually be active and allocated to the charged department.
Approvers should generally be managers or Finance/leadership employees.
Approval sophistication should evolve:
- Phase 1: NULL/backfilled founder records.
- Early Phase 2: inconsistent founder/manager approval.
- Late Phase 2: regular manager/Finance approval.
- Phase 3 crisis: senior approval concentration.
- Phase 4: strict and consistent control.
- Phase 5 anomalies: subtle deviations from established patterns.
## Description generation
Do not use a single description template.
Create pools by:
- phase;
- department;
- expense type;
- professionalism level.
Allow repeated descriptions for genuine recurring expenses.
Allow mild typos, abbreviations and inconsistent capitalization primarily in Phase 1/early Phase 2.
By late Phase 2 almost all records should look professionally entered.
## Story-event density
Most rows must be ordinary business traffic.
Recommended:
- 70–85% routine/non-event expenses.
- 10–20% indirectly influenced by nearby story events.
- <5% directly important for story/exercises.
The table should still look like an accounting ledger, not a screenplay.
## Temporal consistency
- Expense date >= requester's hire date.
- Expense date >= approver's hire date.
- Do not assign departed employees after their final date.
- Hiring bursts should create equipment/recruitment/onboarding costs.
- Layoffs should reduce subsequent department traffic.
- The June 2024 shutdown should strongly reduce discretionary spending.
- September 2024 restructuring should change department/category composition.
- Recovery spending should scale gradually with transactions rather than jump instantly.
## Cross-table consistency
Use the other tables as constraints:
- `employees`/`contracts`: who exists and has authority at each date.
- `allocations`: which departments request what.
- `departments`: valid `d_id`.
- `products`: product/asset growth drives appraisal, storage, insurance and logistics costs.
- `transactions`: post-pivot transaction growth drives validation, custody, shipping and private-client operations.
- `quarterly_performance`: generated expense totals should ultimately reconcile to, or at minimum be directionally compatible with, reported operating costs. 