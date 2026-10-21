> **Superseded draft.** Use `contracts timeline revised.md` and the current repository data as canon. This file is retained only for comparison and inspiration.

## 1. Table purpose and field meaning
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
```

The table records two types of periods:

1. **Employment-state periods:** probation, active employment, suspension, resignation notice, layoff, or termination.
2. **Time-off periods:** PTO, sick leave, parental leave, or sabbatical.

Time-off rows may overlap employment-state rows. An employee on paid sick leave remains actively employed, so both rows exist for the same dates.

Suspension is different: the normal `ACTIVE` or `PROBATION` row ends before the suspension begins. A suspension row does not overlap an active-employment row.

### `e_id`
Eight-digit employee identifier matching `employees.e_id`.
Important examples:
```text
23062301 = Caesar Vallelonga
23062302 = Bob Andrews
23070303 = Paris Morgan
23121126 = Elvis Romero
24090361 = Marcelle Johnson
```

### `position`
Official contractual job title during the period. It is not the department name.
A new employment-state row is created when the official title changes.

### `salary`
Gross **annual base salary in US dollars**.
```text
78000  = $78,000 per year
215000 = $215,000 per year
```
It excludes bonuses, commissions, equity, severance, benefits, expenses, and actual payroll paid during leave.

A time-off row repeats the contractual annual salary in effect during the absence.

### `start_date` and `end_date`
Dates use `YYYY-MM-DD`.

`end_date` is inclusive. Current rows have `end_date = NULL`.

Employment-state rows for one employee may not overlap each other. Time-off rows may overlap an `ACTIVE` or `PROBATION` row.

### `perf_score`
Integer from `0` to `100`, representing the review that caused the row to begin.

|Score|Meaning|
|--:|---|
|90–100|Exceptional|
|80–89|Strong performance|
|70–79|Meets expectations|
|60–69|Partially meets expectations|
|50–59|Serious improvement required|
|0–49|Unsatisfactory|

`perf_score` is normally `NULL` for hiring, leave, company-wide pay changes, resignation, layoff, suspension, and termination.

### `status`

Allowed values:

```text
PROBATION
ACTIVE
PTO
SICK_LEAVE
PARENTAL_LEAVE
SABBATICAL
SUSPENDED
RESIGNED
LAID_OFF
TERMINATED
```

## 2. Row-generation rules
A new employment-state row is created for:
- hiring;
- probation completion;
- annual review, even when position and salary are unchanged;
- promotion or official job redesign;
- salary increase or reduction;
- suspension;
- resignation notice;
- layoff;
- termination.

A separate overlapping time-off row is created for narratively important multi-day:
- PTO;
- sick leave;
- parental leave;
- sabbatical.

One-day or routine absences are omitted.

If salary and position change on the same date, they are combined into one row because `(e_id, start_date)` is the primary key.

## 3. Review policy
Most non-executive employees begin with a 90-day probation period.
```text
Initial row: PROBATION, perf_score = NULL
Completion row: ACTIVE, perf_score = probation score
```
Every completed probation creates a new row, even when salary and position remain unchanged.

Founders and C-level external hires begin directly as `ACTIVE`:
- Caesar Vallelonga;
- Bob Andrews;
- Marcelle Johnson;
- Graham Cole;
- Adrian Bishop.

Marcelle, Graham, and Adrian still receive 90-day executive reviews.

Annual reviews normally occur on the employee’s hire-date anniversary. Every completed annual review creates a row, including unchanged reviews.

Company finances affect review outcomes:

|Company condition|Compensation approach|
|---|---|
|Seed-stage startup|Below-market salaries; selective probation increases|
|Viral growth|Market corrections, promotions, and retention increases|
|Media leak|Immediate hiring and raise freeze, but no immediate pay cuts|
|Shutdown and cash crisis|Layoffs, delayed leadership cuts, no ordinary raises|
|Pivot|Role redesigns and selective salary restoration|
|Recovery|Targeted raises for scarce or commercially important roles|

## 4. Phase 1: Informal startup
### Events 2–7: February–June 2023
Caesar and Bob build the prototype before formal payroll begins.
No contract rows exist before Event 8. Their later contract start dates represent formal employment, not the beginning of founder activity.

## 5. Event 8: Formal payroll begins — 23 June 2023
Seed funding allows HeriShare to pay its founders.
### Caesar Vallelonga — `23062301`
```text
position: Founder and Chief Executive Officer
salary: 150000
status: ACTIVE
perf_score: NULL
```
### Bob Andrews — `23062302`
```text
position: Founder and Chief Technology Officer
salary: 150000
status: ACTIVE
perf_score: NULL
```
Both accept below-market salaries to preserve runway.
## 6. Event 10: Paris joins — 3 July 2023
### Paris Morgan — `23070303`
Initial row:
```text
position: Customer Support and Community Associate
salary: 78000
status: PROBATION
perf_score: NULL
```
Probation completion on 1 October 2023:
```text
position: Customer Support and Community Associate
salary: 82000
status: ACTIVE
perf_score: 94
```
The increase reflects exceptional performance and responsibilities beyond basic support.
## 7. Event 12: Museum partnership expansion — August–September 2023
Six employees join to support the original museum-and-public-investment model.

| Employee      | Initial position                              | Initial salary |
| ------------- | --------------------------------------------- | -------------: |
| Lauren Kim    | Strategy and Governance Manager               |       $150,000 |
| Daniel Mercer | Corporate Secretary                           |       $150,000 |
| Evelyn Hart   | Head of Asset Operations                      |       $160,000 |
| Marcus Lee    | Shared Asset Logistics Manager                |       $145,000 |
| Sofia Ramirez | Director of Museum and Nonprofit Partnerships |       $155,000 |
| Priya Desai   | Public Catalogue and Provenance Specialist    |       $105,000 |

Their pre-pivot titles reflect:
- museums and nonprofits;
- public catalogues;
- fractional ownership;
- shared physical assets.

Probation outcomes:

|Employee|Score|Salary after probation|Motivation|
|---|--:|--:|---|
|Lauren Kim|86|$155,000|Strong governance work|
|Daniel Mercer|76|$150,000|Meets expectations|
|Evelyn Hart|92|$165,000|Builds the asset-onboarding process|
|Marcus Lee|84|$150,000|Establishes storage and transport vendors|
|Sofia Ramirez|93|$160,000|Builds the museum partnership pipeline|
|Priya Desai|75|$105,000|Meets expectations|

Each probation completion creates a row.
## 8. Event 14: Marketplace launch — October–November 2023
Eight employees join.

|Employee|Initial position|Initial salary|
|---|---|--:|
|Noah Chen|Backend Engineer|$155,000|
|Mia Thompson|Frontend Engineer|$145,000|
|Ethan Park|Retail Marketplace Payments Engineer|$160,000|
|Aisha Patel|Ownership Data Engineer|$150,000|
|Julian Ross|Fractional Share Reconciliation Analyst|$108,000|
|Owen Brooks|Infrastructure and Security Manager|$175,000|
|Chloe Nguyen|Retail Investor Support Specialist|$75,000|
|Gabriel Silva|Office Administrator|$68,000|

Probation outcomes:

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

## 9. Event 15: Viral growth — 19 November 2023
Viral media attention increases funding, users, workloads, and competition for staff.
### Founder adjustments

| Employee | Old salary | New salary | Motivation                                    |
| -------- | ---------: | ---------: | --------------------------------------------- |
| Caesar   |   $150,000 |   $180,000 | Fundraising, partnerships, national expansion |
| Bob      |   $150,000 |   $180,000 | Platform scale and technical responsibility   |

### Paris promotion

```text
old position: Customer Support and Community Associate
new position: Community and Member Operations Manager
salary: 82000 → 110000
status: ACTIVE
perf_score: NULL
```
The title reflects the original public-member business model.
### Early-manager adjustments

| Employee      | Old salary | New salary |
| ------------- | ---------: | ---------: |
| Lauren Kim    |   $155,000 |   $160,000 |
| Evelyn Hart   |   $165,000 |   $172,000 |
| Marcus Lee    |   $150,000 |   $152,000 |
| Sofia Ramirez |   $160,000 |   $168,000 |
| Owen Brooks   |   $180,000 |   $184,000 |

Daniel Mercer and Priya Desai receive no off-cycle increase.
### Growth hiring wave
Employees join across product, engineering, legal, finance, compliance, client services, communications, partnerships, and HR.

Important original-model positions include:
- Retail Investor Relations Associate;
- Institutional Partnerships Manager;
- Museum Partnerships Manager;
- NGO and Cultural Partnerships Associate;
- Retail Investor Community Manager;
- Public-Access Cataloguing Specialist;
- Restoration Funding Coordinator;
- Public Heritage Restoration Project Coordinator.
## 10. Elvis’s early progression
### 11 December 2023: Hiring
```text
position: Finance Operations Manager
salary: 135000
status: PROBATION
perf_score: NULL
```
### 10 March 2024: Probation completion
```text
position: Senior Finance Operations Manager
salary: 150000
status: ACTIVE
perf_score: 87
```
The promotion reflects increasing control over reconciliations, supplier payments, investor funds, and marketplace disbursements.
## 11. Paris’s pre-crisis promotion — 1 February 2024
```text
position: Chief of Staff and Director of Member Affairs
salary: 165000
status: ACTIVE
perf_score: NULL
```
The title still reflects HeriShare’s mass-market member structure.

Her responsibilities include executive coordination, board materials, confidential escalations, and cross-department decisions.

Paris is not on the board.
## 12. Continued growth — February–May 2024
HeriShare reaches 60 active employees.

New roles remain strongly tied to the original model:

| Employee       | Pre-pivot position                             |
| -------------- | ---------------------------------------------- |
| Thomas Green   | Museum Partnerships Manager                    |
| Julia Santos   | NGO and Cultural Partnerships Associate        |
| Caleb Morgan   | Retail Investor Community Manager              |
| Eva Jensen     | Retail Investor Relations Associate            |
| Isabella Rossi | Public-Access Cataloguing Specialist           |
| Audrey White   | Restoration Funding Coordinator                |
| Felix Novak    | Restoration Project Coordinator                |
| Amelia Scott   | Retail Investor Relations Manager              |
| David Shah     | Institutional Investor Relations Manager       |
| Benjamin Lopez | Fractional Ownership Account Manager           |
| Nathan Kaur    | Fractional Share Valuation Coordinator         |
| Selene Parker  | Investor Complaints and Escalations Specialist |

## 13. Significant leave before the crisis
Leave rows overlap the employee’s underlying `ACTIVE` or `PROBATION` row.
### Elena Garcia
```text
status: SICK_LEAVE
start_date: 2024-02-12
end_date: 2024-02-23
salary: contractual annual salary
perf_score: NULL
```
Her active-employment row remains unchanged and overlaps the sick-leave period.
### Cameron Ellis
```text
status: PARENTAL_LEAVE
start_date: 2024-03-11
end_date: 2024-04-05
salary: contractual annual salary
perf_score: NULL
```
### Clara Foster
```text
status: PTO
start_date: 2024-05-20
end_date: 2024-05-24
salary: contractual annual salary
perf_score: NULL
```
Clara’s leave is recorded because it occurs during the developing public crisis and temporarily reduces Communications capacity.
## 14. Event 19: Media leak — 11 May 2024
The leak does not immediately trigger salary cuts or layoffs.
Management initially treats the incident as containable.
Immediate actions:
- hiring freeze;
- cancellation of open vacancies;
- suspension of discretionary bonuses;
- postponement of salary reviews;
- freeze on non-essential promotions;
- emergency Legal, Compliance, and Communications spending.

All 60 employees are affected by the hiring, bonus, and review freeze.

No new contract row is created solely for the freeze because position, salary, and status remain unchanged.

## 15. Event 20: Consequences begin — 28 May 2024

By late May:
- signups are suspended;
- transaction volume falls;
- institutional partners pause cooperation;
- legal costs rise;
- employees begin leaving;
- the board starts planning a shutdown.
### Voluntary resignations

|Employee|Resignation begins|Final day|Motivation|
|---|---|---|---|
|Mia Thompson|20 May|7 June|Accepts a more stable engineering role|
|Zoe Kim|24 May|7 June|Rejects the expected private-market direction|
|Adrian Wilson|28 May|14 June|Concern about data integrity and reputation|
|Luca Bennett|31 May|14 June|Communications pressure and reputational risk|
|Martin Caldwell|28 May|21 June|Disagreement over finances and future strategy|

Each active-employment row ends before the `RESIGNED` notice-period row begins.
### Maya Patel suspension and termination
Maya’s active row ends on 27 May.
```text
status: SUSPENDED
start_date: 2024-05-28
end_date: 2024-05-30
```
The suspension does not overlap an active-employment row.

Termination:
```text
status: TERMINATED
start_date: 2024-05-31
end_date: 2024-05-31
```
She is terminated after repeatedly bypassing release controls. Her previous review score was 62.
## 16. Event 21: Shutdown and layoffs — 9–10 June 2024
The platform goes offline on 9 June. Layoffs become effective on 10 June.

|Employee|Position eliminated|
|---|---|
|Irene Alvarez|Institutional Partnerships Manager|
|Grace Howard|Recruiter and HR Generalist|
|Thomas Green|Museum Partnerships Manager|
|Julia Santos|NGO and Cultural Partnerships Associate|
|Caleb Morgan|Retail Investor Community Manager|
|Eva Jensen|Retail Investor Relations Associate|
|Isabella Rossi|Public-Access Cataloguing Specialist|
|Audrey White|Restoration Funding Coordinator|
|Felix Novak|Public Heritage Restoration Project Coordinator|

Eight positions are directly deprecated by the expected pivot. Grace is laid off because recruitment is frozen.

Each employee receives a one-day `LAID_OFF` row on 10 June.

The layoffs are based primarily on the disappearance of the work, not poor performance.
## 17. Delayed crisis salary response — 24 June 2024

Salary cuts begin two weeks after the shutdown, once the Finance team completes a revised cash-runway forecast and rescue funding remains uncertain.

Ordinary employees do not receive base-salary cuts. Their raises, bonuses, and promotions remain frozen.
### 15% executive reductions

|Employee|Previous salary|Crisis salary|
|---|--:|--:|
|Caesar|$180,000|$153,000|
|Bob|$170,000|$144,500|
|Paris|$165,000|$140,250|

### 10% senior-leadership reductions
Affected employees:
- Rebecca Stone;
- Elvis Romero;
- Evelyn Hart;
- Sofia Ramirez;
- Owen Brooks;
- Nadia Hassan.
### 5% department-manager reductions
Affected employees:
- Marcus Lee;
- Rachel Walker;
- Natalie Price;
- Cameron Ellis.

Each affected employee receives a new `ACTIVE` row beginning 24 June with `perf_score = NULL`.
## 18. Elvis becomes Acting CFO — 24 June 2024
Martin Caldwell’s departure and the cash crisis lead to Elvis’s promotion.
```text
old position: Senior Finance Operations Manager
new position: Acting CFO and Head of Finance Operations
normal role salary: 185000
crisis salary after 10% reduction: 166500
status: ACTIVE
perf_score: NULL
```

The delayed date reflects the time required for Martin’s handover and the board’s formal appointment.
## 19. Crisis-driven transfers — 24 June 2024
Several retained employees begin performing work outside their original model.
### Selene Parker
```text
old position: Investor Complaints and Escalations Specialist
new position: Trust and Safety Investigator
salary unchanged
```
### Julian Ross
```text
old position: Fractional Share Reconciliation Analyst
new position: Transaction Reconciliation Analyst
salary unchanged
```
### Hana Ito
```text
old position: Retail Investor KYC Analyst
new position: AML and KYC Analyst
salary unchanged
```
These changes occur after the shutdown, not immediately after the leak.
## 20. Event 22: Pivot approved — 25 August 2024

The board approves the transition from a retail fractional-ownership platform to a private cultural-asset marketplace.

Temporary leadership cuts end, but not everyone returns to their former salary or position.
### Caesar
```text
position: Founder and Chief Executive Officer
salary: 225000
status: ACTIVE
perf_score: NULL
```
The increase reflects rescue funding and Caesar’s leadership of the new commercial strategy.
### Bob: stepdown and permanent pay cut
```text
old position: Founder and Chief Technology Officer
new position: Founder and Principal Systems Architect
pre-crisis salary: 170000
new salary: 150000
status: ACTIVE
perf_score: NULL
```

Bob’s salary rises slightly from the temporary crisis rate of $144,500 but remains below his former $170,000 salary.

The permanent reduction reflects:
- perceived responsibility for the failed architecture;
- loss of management authority;
- reduced confidence from Caesar and the board;
- continued need for his legacy-system knowledge.

### Paris
```text
old position: Chief of Staff and Director of Member Affairs
new position: Chief Strategy and Corporate Affairs Officer
salary: 200000
status: ACTIVE
perf_score: 96
```
“Member Affairs” disappears because HeriShare no longer operates as a public-member investment platform.

Paris remains outside the board but wants the future inside-director seat.
## 21. Pivot job redesigns
The following retained employees receive new titles because their former work no longer matches the business.

|Employee|Pre-pivot position|Post-pivot position|Motivation|
|---|---|---|---|
|Evelyn Hart|Head of Fractional Asset Operations|Head of Asset Operations|Full assets replace fractional offerings|
|Marcus Lee|Shared Asset Logistics Manager|Logistics and Custody Manager|Focus moves to private custody and transfers|
|Sofia Ramirez|Director of Museum and Nonprofit Partnerships|Head of Seller Partnerships|Sellers now include estates, dealers, auction houses, and collectors|
|Olivia Turner|Museum Network Partnerships Manager|Estate and Dealer Partnerships Manager|Museum-network outreach is reduced|
|Amelia Scott|Retail Investor Relations Manager|Buyer Relations Manager|Retail investors are replaced by private buyers|
|David Shah|Institutional Investor Relations Manager|Family Office Relations Manager|Focus moves to family offices and private capital|
|Benjamin Lopez|Fractional Ownership Account Manager|Marketplace Account Manager|Accounts now support whole-asset transactions|
|Priya Desai|Public Catalogue and Provenance Specialist|Provenance and Cataloguing Specialist|Public catalogue work becomes private due diligence|
|Nathan Kaur|Fractional Share Valuation Coordinator|Valuation Coordinator|Values whole assets and controlling interests|
|Chloe Nguyen|Retail Investor Support Specialist|Client Services Specialist|Supports buyers, sellers, and former clients|
|Rachel Walker|Member Support Manager|Client Services Manager|“Members” are no longer the primary users|
|Clara Foster|Public Campaigns Specialist|Public Relations Specialist|Mass acquisition campaigns are reduced|
|Natalie Price|Community Communications Lead|Communications Manager|Community growth is replaced by controlled corporate communications|
|Selene Parker|Investor Complaints and Escalations Specialist|Trust and Safety Investigator|Investigates fraud, misuse, and internal misconduct|
|Julian Ross|Fractional Share Reconciliation Analyst|Transaction Reconciliation Analyst|Reconciles private sales and asset payments|
|Hana Ito|Retail Investor KYC Analyst|AML and KYC Analyst|Higher-value private transactions require financial-crime checks|

Each official title change creates a row on or shortly after 25 August.
Operationally complex changes may begin on 2 September rather than the exact board-decision date.

## 22. Event 23: Marcelle joins — 3 September 2024
### Marcelle Johnson — `24090361`
```text
position: Chief Data and Systems Transformation Officer
salary: 215000
status: ACTIVE
perf_score: NULL
```
Marcelle receives a high salary because she is recruited into a distressed company to repair critical systems.

### 2 December 2024: Executive review
```text
position unchanged
salary unchanged
status: ACTIVE
perf_score: 96
```
The unchanged review creates a new row.

Marcelle is not on the board but becomes the favoured candidate for the planned inside-director seat.
## 23. Event 24: Relaunch hires — September 2024
### Graham Cole
```text
position: Chief Technology Officer
initial salary: 235000
status: ACTIVE
```
Executive review on 8 December:
```text
salary: 245000
perf_score: 88
```
### Tessa Williams
```text
position: Platform Engineer
initial salary: 172000
status: PROBATION
```
Probation completion:
```text
salary: 180000
perf_score: 85
status: ACTIVE
```
### Helena Avery
```text
position: Director of Private Sales
initial salary: 185000
status: PROBATION
```
Probation completion:
```text
salary: 195000
perf_score: 93
status: ACTIVE
```
### Omar Davis
```text
position: Transaction Operations Specialist
initial salary: 112000
probation salary: 118000
perf_score: 84
```
### Rohan Kapoor
```text
position: Senior Data Engineer
initial salary: 178000
probation salary: 185000
perf_score: 87
```
Post-pivot hires receive competitive salaries because HeriShare must compensate for reputational risk and specialist requirements.
## 24. Event 25: Recovery hiring — October 2024–April 2025
### Adrian Bishop
```text
position: Chief Operating Officer
initial salary: 220000
status: ACTIVE
```
Executive review:
```text
salary: 230000
perf_score: 86
```
Other probation outcomes:

| Employee          | Position                           | Initial salary | Salary after probation | Score |
| ----------------- | ---------------------------------- | -------------: | ---------------------: | ----: |
| Serena Liu        | Senior Backend Engineer            |       $180,000 |               $190,000 |    92 |
| Theo Grant        | QA Automation Engineer             |       $140,000 |               $145,000 |    84 |
| Beatrice Franklin | Estate Partnerships Manager        |       $150,000 |               $155,000 |    86 |
| Xavier Carter     | Auction House Account Manager      |       $142,000 |               $148,000 |    87 |
| Ruby Singh        | Seller Partnerships Associate      |        $95,000 |                $98,000 |    78 |
| Jordan Hayes      | Family Office Relationship Manager |       $158,000 |               $165,000 |    88 |
| Camila Reyes      | Private Sales Associate            |       $106,000 |               $110,000 |    79 |

Arjun Mehta, Noelle Baker, Hugo Thompson, Daphne Morris, and Andre Coleman remain on probation at the 30 April 2025 snapshot.

## 25. Targeted recovery increases — 1 January 2025 onward
HeriShare does not grant a company-wide raise. Profitability remains fragile.
### Caesar
```text
salary: 225000 → 250000
motivation: commercial recovery and fundraising
```
### Paris
```text
salary: 200000 → 220000
motivation: strategic role, board-facing work, retention risk
```
### Elvis
Annual review on 11 December 2024:
```text
position: Acting CFO and Head of Finance Operations
salary: 185000 → 205000
perf_score: 93
```
## 26. Annual reviews after the pivot

Every review creates a row.

Strong performers may receive targeted raises, especially in:

- Engineering;
- Data;
- Security;
- Compliance;
- Private Sales;
- Seller Partnerships;
- Legal;
- Finance.

Employees receiving unchanged reviews include:

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
Carmen Diaz receives a strong score but no raise because her salary is already near the top of the approved range.

## 27. Marcelle’s sabbatical — 14 April 2025
Marcelle’s active-employment row remains open.
A separate overlapping row is created:
```text
e_id: 24090361
position: Chief Data and Systems Transformation Officer
salary: 215000
start_date: 2025-04-14
end_date: NULL
perf_score: NULL
status: SABBATICAL
```
The sabbatical does not end or replace her `ACTIVE` employment row.
She remains employed and remains manager of Data and Business Systems.
## 28. Final departure totals

|Departure type|Employees|
|---|--:|
|Resigned|5|
|Laid off|9|
|Terminated|1|
|Total|15|

Eight laid-off employees held roles directly tied to the abandoned public fractional-ownership model.
## 29. Current-state rules at 30 April 2025
- 64 employees remain employed.
- Every employed person has one open employment-state row.
- Five employees have open `PROBATION` rows.
- The remaining employed people have open `ACTIVE` rows.
- Marcelle additionally has an overlapping open `SABBATICAL` row.
- Former employees have no open rows.
- Latest employment-state salary equals `employees.current_salary`.
- Leave rows do not determine current salary separately.
- No employment-state rows overlap for the same employee.
- Time-off rows may overlap `ACTIVE` or `PROBATION`.
- `SUSPENDED` never overlaps `ACTIVE` or `PROBATION`.
