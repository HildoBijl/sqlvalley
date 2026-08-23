## 1. Table semantics
```sql
contracts(
  e_id INTEGER NOT NULL,
  position TEXT,
  salary REAL,
  start_date TEXT,
  end_date TEXT,
  perf_score INTEGER,
  status TEXT,
  PRIMARY KEY (e_id, start_date),
  FOREIGN KEY (e_id) REFERENCES employees(e_id)
)
````
- `e_id`: eight-digit identifier from `employees`.
- `position`: formal contractual job title during the period.
- `salary`: gross annual base salary in USD. It excludes bonuses, commissions, equity, benefits, expenses, severance, and actual salary paid during leave.
- `start_date`: first day of the period, formatted `YYYY-MM-DD`.
- `end_date`: inclusive final day. `NULL` means the period is still open.
- `perf_score`: review score from `0` to `100`; `NULL` when the row was not created by a performance review.
- `status`: `PROBATION`, `ACTIVE`, `PTO`, `SICK_LEAVE`, `PARENTAL_LEAVE`, `SABBATICAL`, `SUSPENDED`, `RESIGNED`, `LAID_OFF`, or `TERMINATED`.

Two row types exist:
1. **Employment-state rows:** `PROBATION`, `ACTIVE`, `SUSPENDED`, `RESIGNED`, `LAID_OFF`, `TERMINATED`.
2. **Time-off rows:** `PTO`, `SICK_LEAVE`, `PARENTAL_LEAVE`, `SABBATICAL`.

Employment-state rows for one employee do not overlap. Time-off rows overlap the underlying `ACTIVE` or `PROBATION` row. Suspension replaces active employment for its duration and therefore does not overlap it.

## 2. Standard HR rules
### Probation
Most non-executive employees begin with a 90-day `PROBATION` row. Completion always creates a new `ACTIVE` row, even when title and salary remain unchanged.

Founders and external C-level hires begin directly as `ACTIVE`:
- Caesar Vallelonga — `23062301`
- Bob Andrews — `23062302`
- Marcelle Johnson — `24090361`
- Graham Cole
- Adrian Bishop

Marcelle, Graham, and Adrian still receive 90-day executive reviews.

### Annual reviews
Annual reviews normally occur on the anniversary of the employee’s hire date. Every completed review creates a new row, including unchanged reviews.

Performance scale:

|Score|Meaning|
|--:|---|
|90–100|Exceptional|
|80–89|Strong|
|70–79|Meets expectations|
|60–69|Partially meets expectations|
|50–59|Serious improvement required|
|0–49|Unsatisfactory|

Normal compensation rule when the company is stable:
- `90–100`: 5–8% raise or promotion when justified.
- `85–89`: 3–5% raise.
- `80–84`: 1–3% raise.
- `70–79`: no raise or small cost-of-living adjustment.
- `60–69`: no raise; development plan.
- Below `60`: no raise; possible discipline or termination.

Company finances override this rule. A strong score may produce no raise during a freeze.

### Position naming
Most titles remain generic and realistic. Only a minority discreetly reveal HeriShare’s counterparties or operating model.

Common generic titles:
- Product Manager
- Backend Engineer
- Data Engineer
- Account Manager
- Partnerships Manager
- Client Services Specialist
- Operations Coordinator
- Compliance Analyst
- Finance Operations Manager
- Communications Specialist

Discreet business-model clues may appear in a few roles:

- Museum Partnerships Manager
- Estate Partnerships Manager
- Restoration Projects Coordinator
- Archives and Library Partnerships Associate
- Family Office Relations Manager
- Auction House Account Manager
- Provenance Specialis    

## 3. Phase 1 — Informal startup

### Events 2–7: February–June 2023
**New hires:** none.  
**Promotions or salary changes:** none.  
**Departures:** none.  
**Leave:** none recorded.  
**Contract effect:** Caesar and Bob work informally before payroll; no rows exist before Event 8.

## 4. Event 8 — Formal payroll begins, 23 June 2023
### New hires

|Employee|Position|Annual salary|Status|
|---|---|--:|---|
|Caesar Vallelonga|Founder and Chief Executive Officer|$150,000|ACTIVE|
|Bob Andrews|Founder and Chief Technology Officer|$145,000|ACTIVE|

Both accept below-market salaries to preserve seed funding.
Promotions or salary changes- None
Departures - None.
Leave- None.
### Contract effect
Create two initial `ACTIVE` rows with `perf_score = NULL`.
## 5. Event 10 — Paris joins, 3 July 2023
### New hires

|Employee|Position|Annual salary|Status|
|---|---|--:|---|
|Paris Morgan|Customer Support and Community Associate|$78,000|PROBATION|

### Probation completion — 1 October 2023

|Employee|Position|Old salary|New salary|Score|
|---|---|--:|--:|--:|
|Paris Morgan|Customer Support and Community Associate|$78,000|$82,000|94|

The raise reflects unusually broad responsibilities and exceptional early performance.
### Leave
- Paris Morgan: `PTO`, 2023-09-18 to 2023-09-20. This overlaps her probation row.

## 6. Event 12 — First major partnership expansion, August–September 2023

### New hires

|Employee|Initial position|Initial salary|
|---|---|--:|
|Lauren Kim|Strategy and Governance Manager|$150,000|
|Daniel Mercer|Corporate Secretary|$150,000|
|Evelyn Hart|Head of Asset Operations|$160,000|
|Marcus Lee|Logistics Manager|$145,000|
|Sofia Ramirez|Partnerships Director|$155,000|
|Priya Desai|Provenance Specialist|$105,000|

Most titles are generic. Sofia’s and Priya’s titles provide only a subtle indication of the company’s work.
### Probation completions

| Employee      | Score | Salary after probation | Motivation                                |
| ------------- | ----: | ---------------------: | ----------------------------------------- |
| Lauren Kim    |    86 |               $155,000 | Strong governance work                    |
| Daniel Mercer |    76 |               $150,000 | Meets expectations                        |
| Evelyn Hart   |    92 |               $165,000 | Builds intake and review procedures       |
| Marcus Lee    |    84 |               $150,000 | Establishes transport and storage vendors |
| Sofia Ramirez |    93 |               $160,000 | Builds the initial partner pipeline       |
| Priya Desai   |    75 |               $105,000 | Meets expectations                        |

### Leave
- Daniel Mercer: `SICK_LEAVE`, 2023-11-06 to 2023-11-10.
- Priya Desai: `PTO`, 2023-12-11 to 2023-12-15    

## 7. Event 14 — Marketplace launch, October–November 2023
### New hires

|Employee|Initial position|Initial salary|
|---|---|--:|
|Noah Chen|Backend Engineer|$155,000|
|Mia Thompson|Frontend Engineer|$145,000|
|Ethan Park|Payments Engineer|$160,000|
|Aisha Patel|Data Engineer|$150,000|
|Julian Ross|Reconciliation Analyst|$108,000|
|Owen Brooks|Infrastructure and Security Manager|$175,000|
|Chloe Nguyen|Client Services Specialist|$75,000|
|Gabriel Silva|Office Administrator|$68,000|

The titles remain mostly generic. The nature of the platform is inferred from the combination of payments, reconciliation, provenance, logistics, and partnerships roles rather than from explicit labels.

### Probation completions

|Employee|Score|Salary after probation|
|---|--:|--:|
|Noah Chen|84|$160,000|
|Mia Thompson|80|$150,000|
|Ethan Park|89|$165,000|
|Aisha Patel|86|$155,000|
|Julian Ross|74|$108,000|
|Owen Brooks|91|$180,000|
|Chloe Nguyen|76|$75,000|
|Gabriel Silva|73|$68,000|

### Leave
- Gabriel Silva: `PTO`, 2023-12-27 to 2023-12-29.
- Noah Chen: `SICK_LEAVE`, 2024-01-22 to 2024-01-26.
- Chloe Nguyen: `PTO`, 2024-02-05 to 2024-02-09.

## 8. Event 15 — Viral growth, 19 November 2023

### Event summary

**New hires:** 18 employees between November 2023 and January 2024.  
**Promotions:** Paris and Elvis begin rapid progression.  
**Salary changes:** founders and selected early managers receive market corrections.  
**Leave:** ordinary holiday and sick leave continues.
### Founder salary adjustments

| Employee          | Old salary | New salary | Motivation                                  |
| ----------------- | ---------: | ---------: | ------------------------------------------- |
| Caesar Vallelonga |   $150,000 |   $180,000 | Fundraising and national expansion          |
| Bob Andrews       |   $145,000 |   $170,000 | Platform scale and technical responsibility |

### Paris promotion

|Old position|New position|Old salary|New salary|
|---|---|--:|--:|
|Customer Support and Community Associate|Community Operations Manager|$82,000|$110,000|

The title is intentionally generic. It reflects broader operational work without directly identifying the marketplace model.
### Early-manager adjustments

|Employee|Old salary|New salary|
|---|--:|--:|
|Lauren Kim|$155,000|$160,000|
|Evelyn Hart|$165,000|$172,000|
|Marcus Lee|$150,000|$152,000|
|Sofia Ramirez|$160,000|$168,000|
|Owen Brooks|$180,000|$184,000|

Daniel Mercer and Priya Desai receive no off-cycle adjustment.
### New hires

|Employee|Initial position|
|---|---|
|Henry Miller|Product Manager|
|Zoe Kim|UX Designer|
|Leo Martinez|Backend Engineer|
|Maya Singh|Database Engineer|
|Adrian Wilson|Analytics Engineer|
|Elena Garcia|Site Reliability Engineer|
|Rebecca Stone|General Counsel|
|Martin Caldwell|Chief Financial Officer|
|Elvis Romero|Finance Operations Manager|
|Hana Ito|Compliance Analyst|
|Rachel Walker|Client Services Manager|
|Malik Jefferson|Support Specialist|
|Clara Foster|Communications Specialist|
|Luca Bennett|Communications Specialist|
|Irene Alvarez|Institutional Partnerships Manager|
|Natalie Price|Communications Lead|
|Cameron Ellis|People Operations Manager|
|Grace Howard|Recruiter and HR Generalist|

Only Irene’s title discreetly suggests the original partnership-heavy business.
### Elvis probation completion — 10 March 2024

|Old position|New position|Old salary|New salary|Score|
|---|---|--:|--:|--:|
|Finance Operations Manager|Senior Finance Operations Manager|$135,000|$150,000|87|

### Leave
- Elena Garcia: `SICK_LEAVE`, 2024-02-12 to 2024-02-23.
- Cameron Ellis: `PARENTAL_LEAVE`, 2024-03-11 to 2024-04-05.
- Rachel Walker: `PTO`, 2024-03-25 to 2024-03-29.
- Martin Caldwell: `PTO`, 2024-04-15 to 2024-04-19.

## 9. Paris promotion — 1 February 2024

### Promotion

|Old position|New position|Old salary|New salary|
|---|---|--:|--:|
|Community Operations Manager|Chief of Staff and Director of Corporate Affairs|$110,000|$165,000|

The title is broad and realistic. It explains Paris’s access to confidential matters and board materials without making her a board member.

## 10. Continued growth before the crisis — February to early May 2024

### Event summary

**New hires:** 25 employees.  
**Promotions:** limited; most employees are still completing probation.  
**Salary changes:** selective probation raises; no company-wide adjustment.  
**Departures:** none before late May.  
**Leave:** normal PTO and sick leave continue.

### New hires, February–March

|Employee|Initial position|
|---|---|
|Victor Zhang|Software Engineer|
|Maya Patel|Quality Assurance Engineer|
|Daniel Nguyen|Business Systems Analyst|
|Jason Reed|Security Engineer|
|Nadia Hassan|Compliance Manager|
|Samuel Ortiz|Risk Analyst|
|Olivia Turner|Partnerships Manager|

### New hires, late March–April

|Employee|Initial position|
|---|---|
|Thomas Green|Museum Partnerships Manager|
|Julia Santos|Archives and Library Partnerships Associate|
|Caleb Morgan|Community Partnerships Coordinator|
|Amelia Scott|Client Relations Manager|
|David Shah|Institutional Accounts Manager|
|Eva Jensen|Investor Relations Associate|
|Benjamin Lopez|Account Manager|
|Isabella Rossi|Collections Cataloguing Specialist|

These roles provide discreet clues through a small number of references to museums, archives, collections, and institutional accounts.

### New hires, late April–May

|Employee|Initial position|
|---|---|
|Nathan Kaur|Valuation Coordinator|
|Audrey White|Restoration Projects Coordinator|
|Mateo Rivera|Custody Coordinator|
|Leila Adams|Insurance Coordinator|
|Felix Novak|Heritage Projects Coordinator|
|Carmen Diaz|Transactions Counsel|
|Isaac Klein|Corporate Counsel|
|Miriam Hall|Treasury Manager|
|Aaron Young|Accounts Payable Specialist|
|Selene Parker|Client Escalations Specialist|

### Probation outcomes
Most employees complete probation with scores between `72` and `88`.

Named exceptions:
- Maya Patel: `62`; no raise and a development plan.
- Nadia Hassan: `90`; promoted from Compliance Manager to Head of Compliance after probation.
- Jason Reed: `87`; receives a 4% raise.
- Olivia Turner: `85`; receives a 3% raise.
- Amelia Scott: `84`; receives a 3% raise.
- David Shah: `86`; receives a 4% raise.

Employees hired from late March onward who are later laid off may not complete probation.
### Leave
- Priya Desai: `PTO`, 2024-04-08 to 2024-04-12.
- Aisha Patel: `SICK_LEAVE`, 2024-04-22 to 2024-04-26.
- Clara Foster: `PTO`, 2024-05-20 to 2024-05-24.
- Malik Jefferson: `SICK_LEAVE`, 2024-05-06 to 2024-05-10.

## 11. Event 16 — First majority accumulation, 21 April 2024
### New hires
- Nathan Kaur — Valuation Coordinator.
- Audrey White — Restoration Projects Coordinator.

Both hires were approved before the ownership issue became clear.
### Leave
- Aisha Patel begins `SICK_LEAVE` on 22 April, continuing through 26 April.
### Contract effect
Create initial probation rows for Nathan and Audrey. No immediate company-wide response occurs because the event is not yet understood as a systemic problem.

## 12. Event 17 — Pattern spreads, 23 April 2024
### New hires
- Mateo Rivera — Custody Coordinator.
- Leila Adams — Insurance Coordinator.
- Felix Novak — Heritage Projects Coordinator.
These hires continue because outstanding offers have already been accepted.
### Contract effect
Create probation rows for the three hires. No salary freeze or layoffs yet.

## 13. Event 18 — Relocation request, 2 May 2024

### New hires
- Miriam Hall — Treasury Manager.
- Aaron Young — Accounts Payable Specialist.
- Selene Parker — Client Escalations Specialist.
- Carmen Diaz and Isaac Klein have recently joined Legal.

### Promotions or salary changes
None immediately.
### Leave
- Malik Jefferson remains on sick leave from 6 to 10 May.
### Contract effect

Hiring continues because management still treats the issue as a difficult transaction rather than an existential platform failure.

## 14. Event 19 — Media leak, 11 May 2024

### Event summary
**New hires:** none after the leak.  
**Promotions:** frozen.  
**Salary changes:** none immediately.  
**Departures:** resignations begin over the following weeks.  
**Leave:** normal approved leave continues unless operationally impossible.

### Immediate response
- Hiring freeze.
- Open vacancies cancelled.
- Discretionary bonuses suspended.
- Salary reviews postponed.
- Non-essential promotions paused.
- Legal, Compliance, and Communications workload increases.
No row is created solely because of the freeze, as position, salary, and employment status remain unchanged.

### Leave
- Clara Foster’s previously approved PTO from 20 to 24 May remains in place.
- No broad cancellation of leave occurs.

## 15. Event 20 — Operational consequences, 28 May 2024

### Resignations

|Employee|Notice begins|Final day|Motivation|
|---|---|---|---|
|Mia Thompson|2024-05-20|2024-06-07|Accepts a more stable role|
|Zoe Kim|2024-05-24|2024-06-07|Disagrees with expected strategic direction|
|Adrian Wilson|2024-05-28|2024-06-14|Data-integrity and reputation concerns|
|Luca Bennett|2024-05-31|2024-06-14|Communications pressure|
|Martin Caldwell|2024-05-28|2024-06-21|Disagreement over finances and strategy|

Each employee’s active row ends before the `RESIGNED` row begins.

### Suspension and termination
Maya Patel:
- `SUSPENDED`, 2024-05-28 to 2024-05-30.
- `TERMINATED`, 2024-05-31.
- Previous performance score: `62`.
- Motivation: repeated release-control violations during the unstable shutdown period.

### Promotions or salary changes
None yet. Finance is still assessing the cash impact.

### Leave
No new ordinary leave begins during the final week of May.

## 16. Event 21 — Shutdown and layoffs, 9–10 June 2024
### Layoffs effective 10 June

|Employee|Position at departure|Reason|
|---|---|---|
|Irene Alvarez|Institutional Partnerships Manager|Partner-acquisition function reduced|
|Grace Howard|Recruiter and HR Generalist|Hiring frozen|
|Thomas Green|Museum Partnerships Manager|Role no longer required at current scale|
|Julia Santos|Archives and Library Partnerships Associate|Specialist outreach reduced|
|Caleb Morgan|Community Partnerships Coordinator|Public-community work reduced|
|Eva Jensen|Investor Relations Associate|Retail-facing investor work discontinued|
|Isabella Rossi|Collections Cataloguing Specialist|Public catalogue work reduced|
|Audrey White|Restoration Projects Coordinator|Restoration programme reduced|
|Felix Novak|Heritage Projects Coordinator|Public-facing heritage projects reduced|

Most titles remain plausible in a normal company. Their collective pattern reveals the abandoned model more clearly than any single title.
### Salary changes
None on 10 June. The company has not yet completed the cash-runway analysis.
### Leave
- Rachel Walker: `SICK_LEAVE`, 2024-06-17 to 2024-06-21.
- Marcus Lee: previously approved `PTO`, 2024-07-15 to 2024-07-19.
## 17. Delayed financial response — 24 June 2024

The pay response occurs two weeks after the shutdown, once Finance confirms the severity of the cash shortage.

### Executive salary cuts

|Employee|Old salary|Temporary salary|Reduction|
|---|--:|--:|--:|
|Caesar Vallelonga|$180,000|$153,000|15%|
|Bob Andrews|$170,000|$144,500|15%|
|Paris Morgan|$165,000|$140,250|15%|

### Senior-leadership cuts
The following receive temporary 10% reductions:
- Rebecca Stone
- Elvis Romero
- Evelyn Hart
- Sofia Ramirez
- Owen Brooks
- Nadia Hassan

### Department-manager cuts

The following receive temporary 5% reductions:
- Marcus Lee
- Rachel Walker
- Natalie Price
- Cameron Ellis

Ordinary employees retain their base salaries, but:
- raises remain frozen;
- bonuses remain cancelled;
- promotions remain paused.

### Elvis promotion

|Old position|New position|Normal salary|Crisis salary|
|---|---|--:|--:|
|Senior Finance Operations Manager|Acting CFO and Head of Finance Operations|$185,000|$166,500|

The promotion follows Martin Caldwell’s handover and board approval.
### Crisis-driven role changes

|Employee|Old position|New position|Salary effect|
|---|---|---|---|
|Selene Parker|Client Escalations Specialist|Trust and Safety Investigator|None|
|Julian Ross|Reconciliation Analyst|Transaction Reconciliation Analyst|None|
|Hana Ito|Compliance Analyst|AML and KYC Analyst|None|

The titles remain realistic and only subtly reveal the company’s shift toward higher-risk transactions.
### Leave
- Rachel Walker’s sick leave ends before the new salary row begins.
- Marcus Lee’s July PTO overlaps his reduced-salary active row.

## 18. Event 22 — Pivot approved, 25 August 2024
### Event summary
**New hires:** none on the decision date.  
**Promotions:** Paris receives a broader executive title; Bob steps down.  
**Salary changes:** temporary cuts end, but Bob receives a permanent reduction.  
**Position changes:** selected roles are redesigned for the new business.  
**Leave:** normal leave resumes more freely after the shutdown period.
### Caesar

|Position|Old salary|New salary|
|---|--:|--:|
|Founder and Chief Executive Officer|$153,000 crisis salary|$225,000|

Motivation: rescue funding, strategic leadership, and broader commercial responsibility.
### Bob

|Old position|New position|Pre-crisis salary|New salary|
|---|---|--:|--:|
|Founder and Chief Technology Officer|Founder and Principal Systems Architect|$170,000|$150,000|

The permanent pay cut reflects:
- perceived responsibility for the platform failure;
- removal of management authority;
- reduced board confidence;
- continued need for his legacy-system knowledge.
### Paris

|Old position|New position|New salary|Score|
|---|---|--:|--:|
|Chief of Staff and Director of Corporate Affairs|Chief Strategy and Corporate Affairs Officer|$200,000|96|

Paris is not on the board. The role makes her a credible candidate for a future inside-director seat.
### Pivot role redesigns effective 2 September 2024

|Employee|Pre-pivot title|Post-pivot title|Motivation|
|---|---|---|---|
|Evelyn Hart|Head of Asset Operations|Head of Asset Operations|Responsibilities broaden, title remains suitable|
|Marcus Lee|Logistics Manager|Logistics and Custody Manager|Greater focus on private storage and transfer|
|Sofia Ramirez|Partnerships Director|Head of Seller Partnerships|Counterparties expand beyond institutions|
|Olivia Turner|Partnerships Manager|Estate and Dealer Partnerships Manager|New commercial sourcing focus|
|Amelia Scott|Client Relations Manager|Buyer Relations Manager|Shift toward private buyers|
|David Shah|Institutional Accounts Manager|Family Office Relations Manager|Focus on private capital|
|Benjamin Lopez|Account Manager|Marketplace Account Manager|Broader transaction support|
|Priya Desai|Provenance Specialist|Senior Provenance Specialist|Greater due-diligence responsibility|
|Nathan Kaur|Valuation Coordinator|Valuation Coordinator|Title remains suitable|
|Chloe Nguyen|Client Services Specialist|Client Services Specialist|Client base changes, title remains suitable|
|Rachel Walker|Client Services Manager|Client Services Manager|Title remains suitable|
|Clara Foster|Communications Specialist|Public Relations Specialist|Reduced community-marketing focus|
|Natalie Price|Communications Lead|Communications Manager|More controlled corporate communications|
|Selene Parker|Trust and Safety Investigator|Trust and Safety Investigator|Crisis role becomes permanent|
|Julian Ross|Transaction Reconciliation Analyst|Transaction Reconciliation Analyst|Crisis role becomes permanent|
|Hana Ito|AML and KYC Analyst|AML and KYC Analyst|Crisis role becomes permanent|

Not every employee receives a new title. The pivot should be visible through a limited cluster of realistic changes rather than a complete company-wide renaming.
### Leave
- Sofia Ramirez: `PTO`, 2024-09-16 to 2024-09-20.
- Daniel Nguyen: `SICK_LEAVE`, 2024-10-14 to 2024-10-18.

## 19. Event 23 — Marcelle joins, 3 September 2024

### New hire

|Employee|Position|Salary|Status|
|---|---|--:|---|
|Marcelle Johnson|Chief Data and Systems Transformation Officer|$215,000|ACTIVE|

The high salary reflects the difficulty of recruiting a senior specialist into a distressed company.
### Executive review — 2 December 2024

|Position|Salary|Score|
|---|--:|--:|
|Chief Data and Systems Transformation Officer|$215,000|96|

The unchanged review still creates a row.

Marcelle is not on the board but becomes the favoured candidate for the planned inside-director seat.
### Promotions or other changes

None on the hire date.
### Leave
- Marcelle Johnson: `PTO`, 2025-01-27 to 2025-01-31.
- Her later sabbatical is recorded separately under Event 25.

## 20. Event 24 — Relaunch preparation and reopening, September 2024
### New hires

|Employee|Position|Initial salary|
|---|---|--:|
|Graham Cole|Chief Technology Officer|$235,000|
|Tessa Williams|Platform Engineer|$172,000|
|Helena Avery|Director of Private Sales|$185,000|
|Omar Davis|Transaction Operations Specialist|$112,000|
|Rohan Kapoor|Senior Data Engineer|$178,000|

### Probation and executive reviews

|Employee|Result|New salary|Score|
|---|---|--:|--:|
|Graham Cole|Executive review|$245,000|88|
|Tessa Williams|Probation completed|$180,000|85|
|Helena Avery|Probation completed|$195,000|93|
|Omar Davis|Probation completed|$118,000|84|
|Rohan Kapoor|Probation completed|$185,000|87|

### Promotions or changes

Graham replaces Bob as CTO. Bob remains Principal Systems Architect.
### Leave
- Chloe Nguyen: `PTO`, 2024-11-25 to 2024-11-29.
- Owen Brooks: `SICK_LEAVE`, 2024-12-09 to 2024-12-13.

## 21. Event 25 — Recovery hiring, October 2024–April 2025

### New hires

|Employee|Position|Initial salary|
|---|---|--:|
|Adrian Bishop|Chief Operating Officer|$220,000|
|Serena Liu|Senior Backend Engineer|$180,000|
|Theo Grant|QA Automation Engineer|$140,000|
|Beatrice Franklin|Estate Partnerships Manager|$150,000|
|Xavier Carter|Auction House Account Manager|$142,000|
|Ruby Singh|Partnerships Associate|$95,000|
|Jordan Hayes|Family Office Relationship Manager|$158,000|
|Camila Reyes|Private Sales Associate|$106,000|
|Arjun Mehta|Provenance Researcher|$115,000|
|Noelle Baker|Cataloguing Specialist|$102,000|
|Hugo Thompson|Insurance Coordinator|$118,000|
|Daphne Morris|HR Generalist|$95,000|
|Andre Coleman|VIP Client Liaison|$105,000|

Most titles remain generic. The estate, auction-house, and family-office titles provide selective clues about the post-pivot market.

### Completed probation and executive reviews

|Employee|New salary|Score|
|---|--:|--:|
|Adrian Bishop|$230,000|86|
|Serena Liu|$190,000|92|
|Theo Grant|$145,000|84|
|Beatrice Franklin|$155,000|86|
|Xavier Carter|$148,000|87|
|Ruby Singh|$98,000|78|
|Jordan Hayes|$165,000|88|
|Camila Reyes|$110,000|79|

Arjun, Noelle, Hugo, Daphne, and Andre remain on probation at the 30 April 2025 snapshot.

### Targeted recovery increases

No company-wide raise occurs.
- Caesar: $225,000 → $250,000 on 1 January 2025.
- Paris: $200,000 → $220,000 on 1 January 2025.
- Elvis: $185,000 → $205,000 at his 11 December 2024 annual review; score `93`.
- Bob: $150,000 → $195,000 on 1 March 2025 as a retention adjustment.

Bob’s increase does not reverse his demotion. It reflects the company’s continued dependence on undocumented legacy-system knowledge.

### Ordinary annual reviews
Every completed annual review creates a row.
Strong performers generally receiving targeted raises:
- Lauren Kim
- Evelyn Hart
- Marcus Lee
- Sofia Ramirez
- Noah Chen
- Ethan Park
- Aisha Patel
- Owen Brooks
- Henry Miller
- Leo Martinez
- Maya Singh
- Elena Garcia
- Rebecca Stone
- Rachel Walker
- Natalie Price
- Victor Zhang
- Jason Reed
- Nadia Hassan
- Olivia Turner
- Amelia Scott
- David Shah

Unchanged reviews:

|Employee|Score|
|---|--:|
|Daniel Mercer|76|
|Priya Desai|75|
|Julian Ross|74|
|Chloe Nguyen|75|
|Gabriel Silva|73|
|Hana Ito|77|
|Malik Jefferson|74|
|Clara Foster|76|
|Cameron Ellis|78|
|Daniel Nguyen|75|
|Samuel Ortiz|64|
|Benjamin Lopez|76|
|Nathan Kaur|74|
|Mateo Rivera|75|
|Leila Adams|77|
|Carmen Diaz|83|
|Isaac Klein|78|

Samuel Ortiz receives no raise and enters a development plan.

### Normal leave traffic during recovery

- Hana Ito: `SICK_LEAVE`, 2025-01-13 to 2025-01-17.
- Beatrice Franklin: `PTO`, 2025-02-10 to 2025-02-14.
- Jordan Hayes: `SICK_LEAVE`, 2025-03-03 to 2025-03-07.
- Noelle Baker: `PTO`, 2025-03-24 to 2025-03-28; overlaps probation.
- Adrian Bishop: `PTO`, 2025-04-07 to 2025-04-11.
- Marcelle Johnson: `SABBATICAL`, beginning 2025-04-14 with `end_date = NULL`.

Marcelle’s sabbatical row overlaps her open `ACTIVE` row and repeats her annual contractual salary of $215,000.

## 22. Departure summary

|Status|Employees|
|---|--:|
|RESIGNED|5|
|LAID_OFF|9|
|TERMINATED|1|
|Total former employees|15|

Eight layoffs reflect positions that became unnecessary or sharply reduced after the business-model change. The titles are not individually conclusive, but together they reveal the former emphasis on institutions, communities, investor relations, cataloguing, restoration, and heritage projects.

## 23. Current-state generation rules at 30 April 2025
- 64 employees remain employed.
- Each current employee has one open employment-state row.
- Five current employees have open `PROBATION` rows.
- All other current employees have open `ACTIVE` rows.
- Marcelle additionally has an overlapping open `SABBATICAL` row.
- Former employees have no open employment-state rows.
- Latest employment-state salary equals `employees.current_salary`.
- Time-off rows repeat the title and annual salary from the overlapping employment-state row.
- Time-off rows may overlap `ACTIVE` or `PROBATION`.
- `SUSPENDED` may not overlap `ACTIVE` or `PROBATION`.
- `(e_id, start_date)` must be unique.
- Every completed probation creates a row.
- Every completed annual review creates a row.
- Unchanged reviews still create rows.
- All `perf_score` values are `NULL` or between `0` and `100`.