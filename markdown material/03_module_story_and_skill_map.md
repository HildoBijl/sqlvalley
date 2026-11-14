# SQLValley — Practical Module Story Beats and SQL Skill Map

**Purpose:** Working map for the **13 SQL skill modules currently present in the repository**. The legacy node numbers are retained only as labels, with removed Nodes 22 and 24 omitted. The directions below are provisional reference material, not approved dialogue, exercises, SQL solutions or tampered records. The designer supplies the final dialogue, prompts and payoffs for each module.


## Invariants for every module
1. Four suspicious figures have three practical modules each: the insider saboteurs Bob, Elvis and Paris, and Wheatley, whose separate Glasshouse investigation uses the player's access. Wheatley's three appearances are red herrings, not evidence that he altered HeriShare's data.
2. **Three procedural exercises per node**, each using the same named SQL skill; they can be three increasingly meaningful steps in one local business problem (inspect → narrow / compare → establish a provisional finding). Do not make Exercise 2 or 3 depend on concepts not yet taught for that node. The exercises must cover all bases for a given skill, preferably with no overlap in the taught skill. They can make use of any tables available at that point, and do not mandatorily need to use the same table. Exercises can be disjoint in direction but thematically coherent (for example 3 modular exercises in 3 different tables that all showcase Marcelle's "incompetence")
3. **One assigned mole per module** (except Node 25, one revealing exercise for each of Bob, Paris and Elvis). Assigned mole = **actual cause or beneficiary**, not necessarily the dialogue initiator or apparent suspect. **Do not reveal this assignment to the player.**
4. Dialogue prefaces the problem, acknowledges each query result, and closes the module with a **provisional** takeaway. Culprits are named as culprits **only in Node 25**. A correct result and a character's explanation need not be the same thing.
5. **Only use tables reachable through the repository's directed module dependencies.** `allocations` is introduced at `join-and-decomposition` and becomes available to dependent modules. A table being available does not mean all three exercises must use it.
6. The current repository schemas, table access rules and table contents are the finalized baseline canon. Conflicting figures in the material are older drafts. The player only runs read-only queries: any character repairing a problem happens in the story and does not mutate the playable data.
7. Baseline raw data has historical semantics: post-pivot-only `transactions`; `products.owned_by` is the *latest/current* owner; `quarterlyPerformance` contains category-quarter rows and has **no `growth_rate` column**; Q2 2025 is partial through Apr 30; do not compare fractional and whole-asset transaction counts as identical units.


## Table introductions
| Repository module | New table | Relevant primary fields |
|---|---|---|
| `database` | `departments`, `employees` | department and employee identity/current-state fields |
| `data-types` | `expenses` | `exp_id`, `amount`, `d_id`, `description`, `date`, `requested_by`, `approved_by` |
| `database-keys` | `accounts` | `username`, `verified`, identity fields, `created_at`, `last_login_at` |
| `projection-and-filtering` | `transactions` | `t_id`, `vendor`, `buyer`, `prod_id`, `date_time`, `price`, `validated_by`, `status` |
| `foreign-key` | `products` | `p_id`, `name`, `category`, `owned_by`, `est_value`, `status` |
| `aggregation` | `quarterlyPerformance` | `quarter`, `fiscal_year`, `category`, `revenue`, `operating_expenses`, `total_transactions`, `updated_at` |
| `sql` | `contracts` | `e_id`, `position`, `salary`, `start_date`, `end_date`, `perf_score`, `status` |
| `join-and-decomposition` | `allocations` | employee/department membership; the current schema has no allocation dates |

The concept modules contain reading and dialogue rather than the procedural exercise loop. Their story content is outside this exercise-module map.


## Quick assignment index
| Node | Practical skill | Mole at fault / using the player | Narrative phase |
|---|---|---|---|
| 11 | Choose Columns | Paris | First obvious data fault |
| 12 | Filter Rows | Elvis | First financial mismatch |
| 13 | Sort Rows | Wheatley | Unusual private retrieval request |
| 14 | Create Processed Columns | Bob | Weak-looking marketplace metric |
| 15 | Write Single-Criterion Query | Paris | Similar administrative problem recurs |
| 16 | Filter Rows on Multiple Criteria | Elvis | Financial inconsistencies have a pattern |
| 17 | Write Single-Table Query | Bob | Weak-looking transaction report |
| 18 | Write Look-Up Query | Elvis | Financial problem approaches internal controls |
| 19 | Join Tables | Paris | Strong apparent case against Marcelle; doubt begins |
| 20 | Write Multi-Table Query | Wheatley | Confidential client-data request |
| 21 | Aggregate Columns | Wheatley | Internal aggregate information |
| 23 | Use Filtered Aggregation | Bob | Evidence may be too one-sided |
| 25 | Write Multi-Layered Query | Bob / Paris / Elvis | Three separate insider reveals; Wheatley afterword |

---


## Node 11 — Choose Columns
**Assigned mole:** Paris. **Skill folder:** `choose-columns`.

**Available tables:** `departments`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** `SELECT` named columns, multiple fields, `AS` renaming, `DISTINCT`; no required `WHERE`, joins or aggregation.

**Narrative beat:** In an early practical investigation, employee complaints about salary communications, leave or travel administration reach Paris through her executive coordination work. She asks for the recorded fields behind the affected handoffs. Caesar initially expects an ordinary mistake; neither the culprit nor deliberate tampering is established.

**Three exercise directions (not final prompts):**
1. Select employee contact and identity fields relevant to a failed communication.
2. Select contract fields relevant to a leave or salary complaint, optionally using aliases for the handoff.
3. Retrieve distinct employee locations relevant to a travel-compensation complaint, choosing cases whose issue can actually be seen in the output.

**Planted data concept:** Paris makes targeted changes to ordinary staff or organizational records so that a downstream process produces a real complaint she can investigate and potentially blame on Marcelle's data work. Prefer ordinary employees as affected subjects; exact changes require design and a valid `SELECT` alone cannot identify the editor.

**Close:** Routine operational information may be inconsistent. Caesar sees a problem but initially favors an innocent explanation.


## Node 12 — Filter Rows
**Assigned mole:** Elvis. **Skill folder:** `filter-rows`.

**Available tables:** `departments`, `expenses`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** simple `WHERE` comparisons (`=`, `>`, `<`, `IS NULL`, simple text matching as appropriate); favor `SELECT *` to focus on row filtering. **This is filtering, not the separate Sort Rows node.**

**Narrative beat:** A department notices a purchase, budget impact or request it cannot reconcile and raises the problem with Caesar. He asks the player to isolate the relevant expense entries. Elvis may explain the normal Finance process, but does not deliberately expose his own criminal path.

**Three exercise directions:**
1. Retrieve expenses charged to a department that questions a purchase or budget impact.
2. Isolate expenses matching an amount condition raised by the complaint.
3. Find requests with a relevant description pattern or missing approval information.

**Planted data concept:** a realistic entry mixed with valid Finance rows; the anomaly is subtle, not labelled “fraud.”

**Close:** “This isn't only a display issue; money-related entries may be affected.” No proof of theft.


## Node 13 — Sort Rows
**Assigned mole:** Wheatley. **Skill folder:** `sort-and-limit-rows`.

**Available tables:** `departments`, `expenses`, `employees`, `contracts`.

**SQL learning focus:** `ORDER BY`, `ASC`/`DESC`, multi-column ordering, `LIMIT`, `OFFSET`, NULL positioning where the SQL engine supports it; no joins.

**Narrative beat:** Wheatley privately requests ranked internal lists, claiming an unverified business need. **No data is damaged.** His conduct is the problem, though the player cannot yet see why.

**Three exercise directions:**
1. Rank departments by budget.
2. Find highest recorded expenses, with a deterministic tie-breaker.
3. Rank employees or contracts by compensation/hire date, perhaps returning only the first page.

**Close:** The request is oddly specific and sensitive. Wheatley ends this contact; he may appear again in his other assigned modules. Do not force the player to confront him or make him interact with other staff.


## Node 14 — Create Processed Columns
**Assigned mole:** Bob. **Skill folder:** `process-columns`.

**Available tables:** `departments`, `expenses`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** expressions in `SELECT`, arithmetic, `ROUND`, numeric/text/date functions, `AS`; optional filtering only if already taught, but **the actual learning target is calculated columns**.

**Narrative beat:** First result that makes the post-pivot marketplace look disappointing. Bob invites someone to calculate what real transactions imply for proceeds and fees. He **wants the troubling result seen**, but does not overtly pitch the old model.

**Three exercise directions:**
1. Derive a commission or fee from `transactions.price` using a stated rate.
2. Calculate net proceeds or the difference between gross price and a stated deduction.
3. Derive a comparison/rounded report field from prices/dates that reveals weak-looking sale figures.

**Planted data concept:** selected post-pivot transaction amounts made less favorable, with other ownership and validation relationships kept coherent. **`products` is not unlocked here**: do not compare `price` to `products.est_value` in this node.

**Close:** Bob tentatively remarks that some deal outcomes are weaker than expected; the player sees a possible business issue, not its cause.


## Node 15 — Write Single-Criterion Query
**Assigned mole:** Paris. **Skill folder:** `write-single-criterion-query`.

**Available tables:** `departments`, `expenses`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** projection plus **one** `WHERE` condition; optional `DISTINCT` / `AS`. Keep it one criterion, not an accidental multi-clause predicate.

**Narrative beat:** Complaints about salary, leave or travel administration reach Paris through the responsibilities she coordinates. Her earlier changes have created actual downstream problems; she asks the player for focused extracts and begins pointing cautiously toward the migration without making a direct accusation.

**Three exercise directions:**
1. Select relevant employee salary information for a reported group using one condition.
2. Isolate contract fields relevant to a disputed leave request.
3. Extract employee location information relevant to a travel-compensation complaint.

**Planted data concept:** wrong but plausible staff/contract detail that could be blamed on database restoration. **An employee contract need not itself be wrong**; a cross-source mismatch can be established later.

**Close:** “A similar issue has happened more than once.” Marcelle is only a tentative explanation, not an identified culprit.


## Node 16 — Filter Rows on Multiple Criteria
**Assigned mole:** Elvis. **Skill folder:** `filter-rows-on-multiple-criteria`.

**Available tables:** `departments`, `expenses`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** `AND`, `OR`, parentheses, `BETWEEN`, `NOT`, `IS NULL`, `LIKE`; no required subqueries or joins.

**Narrative beat:** A department questions purchases or budget impacts that do not match its own requests and raises the issue with Caesar. He asks for a closer filter. Elvis has plausible normal-process explanations but does not direct the player toward his own misconduct.

**Three exercise directions:**
1. Filter expenses by department **and** date interval.
2. Add amount thresholds, status or requester conditions with correctly grouped boolean logic.
3. Use exclusion / NULL conditions to isolate the most relevant remaining cases.

**Planted data concept:** an illicit-looking row camouflaged among genuine expenses or a carefully chosen set of operational failures. Avoid overly obvious repeated threshold-evasion patterns in baseline data.

**Close:** “There is a repeatable selection pattern in the financial discrepancies.” No culprit identified.


## Node 17 — Write Single-Table Query
**Assigned mole:** Bob. **Skill folder:** `write-single-table-query`.

**Available tables:** `departments`, `expenses`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** combine selected columns, calculated values, compound filters, `ORDER BY` and `LIMIT` in a **single-table** query. Avoid requiring joins or subqueries.

**Narrative beat:** A review of post-pivot transactions produces a shortlist that appears to support the idea that recent deals are weak. Bob is helpful and restrained; he lets someone else draw a conclusion rather than campaigning against the pivot. Node 14 is a prerequisite, so the player may have seen the earlier transaction calculations.

**Three provisional exercise directions:**
1. Select recorded transactions within a defined post-pivot date range and price band.
2. Calculate an explicitly hypothetical fee or price-related field for a filtered transaction subset.
3. Produce a deterministically sorted, limited shortlist of selected recorded deal values.

**Planted data concept:** Bob has adjusted some recorded transaction values. The selected rows and their trustworthy original values still require review. A low price or a hypothetical fee does not by itself prove an unsuccessful deal or sabotage.

**Close:** The selected figures merit a broader check; no one can infer the cause from this report alone.


## Node 18 — Write Look-Up Query
**Assigned mole:** Elvis. **Skill folder:** `write-lookup-query`.

**Available tables:** `departments`, `expenses`, `accounts`, `products`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** **scalar or membership subqueries** (`IN`, a simple correlated lookup, etc.) to retrieve records based on another table. Keep them at the intended skill level; joins are taught at 19.

**Narrative beat:** A department cannot match a charge or approval to the purchase it expected, and Caesar asks the player which people or departments are recorded in the relevant expenses. The issue approaches internal Finance processes naturally; Elvis can explain the workflow without deliberately exposing his own misconduct. Node 16 is not a prerequisite, so this scene cannot assume it has been completed.

**Three exercise directions:**
1. Look up employees recorded as requesters of a relevant group of expenses.
2. Identify departments associated with questioned expense entries.
3. Look up recorded approvers without treating a listed name as proof of wrongdoing.

**Planted data concept:** Finance-supervised chains, approvals and status handling that approach Elvis but leave an innocent explanation open.

**Close:** “These anomalies touch particular controls and people; we still don't know whether the link is causal.”


## Node 19 — Join Tables
**Assigned mole:** Paris. **Skill folder:** `join-tables`.

**Available tables:** `departments`, `expenses`, `accounts`, `transactions`, `products`, `employees`, `contracts`, `allocations`.

**SQL learning focus:** `INNER JOIN`, appropriate `LEFT JOIN`, keys, aliases and multiple joins where appropriate; explain one-to-many joins and avoid false duplicates.

**Narrative beat:** Paris brings Caesar another staff or departmental complaint arising from a changed salary, leave, travel or handoff record. The player compares related records, exposing discrepancies Paris can use to criticize Marcelle's work. Caesar has also encountered Finance concerns on this node's prerequisite path; he becomes more receptive to the possibility of deliberate interference without identifying an actor.

**Three exercise directions:**
1. Compare recorded employee salaries with the appropriate open active contracts.
2. Inspect employee and contract dates relevant to a leave or employment-history complaint.
3. Compare employee, allocation and department records relevant to a misrouted handoff, using an outer join where appropriate.

**Planted data concept:** Paris changes selected ordinary employees' personnel data or valid organizational references so a real downstream failure leads back to apparently unreliable migrated records. Independent source information is needed to establish what should be correct. Avoid targeting main-cast records unless necessary, and do not break enforced foreign keys casually.

**Close:** Paris argues that Marcelle's work is unreliable. Another character can question why the error pattern is so targeted.


## Node 20 — Write Multi-Table Query
**Assigned mole:** Wheatley. **Skill folder:** `write-multi-table-query`.

**Available tables:** `departments`, `expenses`, `accounts`, `transactions`, `products`, `employees`, `contracts`, `allocations`.

**SQL learning focus:** combine joins with filters, calculations, membership subqueries and multi-table conditions. Do not require aggregation or sorting merely because a previous numbered node teaches them; neither is a prerequisite of this skill.

**Narrative beat:** Wheatley privately claims a plausible but unconvincing business need for a targeted client investigation. The requests connect legal HeriShare records to information Glasshouse needs about certain individuals and their networks. He does not manipulate the company data, and the player does not know his affiliation or actual purpose. Nodes 13 and 21 are not prerequisites, so this appearance must work on its own.

**Three provisional exercise directions:**
1. Find transactions matching selected product and transaction conditions, using more than one table.
2. Identify asset or transaction relationships relevant to the same general request, using an alternative multi-table technique.
3. Retrieve the identities and relevant contact details of selected clients connected to specified completed transactions or assets. This is Wheatley's designated personal client-data exercise; its procedural variations must remain consistent with the shared module setup and payoff.

**Data constraints:** `accounts` contains contact details, and `transactions` and `products` provide account-to-asset relationships. High transaction value is a selection criterion, not proof of a person's net worth or criminality. Some accounts represent organizations or representatives; do not treat every account as an individual. `products.owned_by` is current ownership, not necessarily the seller at the time of a historical transaction. Exact targeted clients, records and criminal links remain to be designed and validated; HeriShare's business itself is legal.

**Close:** Wheatley has received the requested confidential information and departs. His need for it is unverified; no culprit or Glasshouse affiliation is revealed.


## Node 21 — Aggregate Columns
**Assigned mole:** Wheatley. **Skill folder:** `aggregate-columns`.

**Available tables:** `departments`, `expenses`, `transactions`, `quarterlyPerformance`, `employees`, `contracts`.

**SQL learning focus:** `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` and `GROUP BY`; basic grouping and NULL behavior. Do not require filtering or joins, which are not prerequisites of this node.

**Narrative beat:** Wheatley privately asks for broad internal summaries under another superficially plausible pretext. The reports support his investigation without identifying a specific client or implying that he caused changes to the figures. This appearance must work without Nodes 13 or 20, which are not prerequisites.

**Three provisional exercise directions:**
1. Sum reported revenue or attributable operating costs by quarter.
2. Count records or summarize transaction activity by status.
3. Calculate an average, minimum or maximum for an appropriate business measure, with meaningful grouping.

**Data constraints:** `accounts` and `products` are not available in this module. Recorded figures may already have been altered by Bob; Wheatley does not alter them. Do not treat pre-pivot fractional transaction counts as whole-asset equivalents, interpret transaction prices as HeriShare revenue, or present partial Q2 2025 as a complete quarter.

**Close:** Wheatley has obtained the requested internal summaries. His claimed purpose remains uncertain; no inference about client identities or criminal activity follows from the aggregates alone.


## Node 23 — Use Filtered Aggregation
**Assigned mole:** Bob. **Skill folder:** `write-filtered-aggregation-query`.

**Available tables:** `departments`, `expenses`, `transactions`, `quarterlyPerformance`, `employees`, `contracts`.

**SQL learning focus:** `GROUP BY`, `WHERE` before grouping, `HAVING` after grouping, aggregate filters and conditional aggregates when appropriate. No requirement for `products` or `accounts` here; they are **not unlocked on this branch**.

**Narrative beat:** Select the weakest sectors or periods from the available aggregates. Bob's case starts to look almost *too* consistent, and another employee questions whether the source figures can be trusted. Although aggregate-columns is a prerequisite, its Wheatley dialogue is private; other characters must not assume they heard his requests.

**Three exercise directions:**
1. Find category-period groupings whose attributable costs exceed revenue.
2. Use `HAVING` to identify groups with low activity or large negative margins.
3. Restrict by period/category and rank the worst qualifying performance summaries.

**Planted data concept:** strategically biased source figures to make unfavorable groups dominate. Beware genuinely costly categories, shutdown Q3 2024 and the partial final quarter; negative operating margins there are not automatically sabotage.

**Close:** A credible independent comparison can persuade Caesar that someone is interfering and make him question whether commercial evidence was shaped to discredit the pivot. This branch must not assume he has completed unrelated branches. Immediately before the finale, after its prerequisite branches, Caesar can also see staff-facing and financial motives and wonder why one supposed mole would pursue such scattered aims. No identity is revealed yet.


## Node 25 — Write Multi-Layered Query
**Assigned moles:** **Bob / Paris / Elvis — one reveal per exercise.** **Skill folder:** `write-multi-step-query`.

**Available tables:** all nine baseline repository tables — `departments`, `expenses`, `accounts`, `transactions`, `products`, `quarterlyPerformance`, `employees`, `contracts`, `allocations` — plus any new finale evidence source once its nature and schema are approved.

**SQL learning focus:** CTEs, nested subqueries, combined joins and aggregation, multi-stage reasoning, accurately scoped historical comparisons and case-specific validation. **Each of the three exercises remains an advanced SQL exercise.**

### Exercise 25A — Bob: fabricated strategic evidence
**Case:** To be developed module by module. It must combine new finale evidence with established evidence from earlier modules.
**Desired discovery:** one successful query returns Bob's name as the single person at fault.
**Motive reveal:** guilt about the Loophole; privately wishes the original public-cultural HeriShare model would return; sabotages data to convince Caesar without arguing openly.
**Evidence caution:** the new evidence source must not identify him by itself. The exact evidence chain remains to be designed and seeded.

### Exercise 25B — Paris: deliberate framing of Marcelle
**Case:** To be developed module by module. It must combine new finale evidence with earlier operational complaints and related record discrepancies, including `allocations` where useful.
**Desired discovery:** one successful query returns Paris's name as the single person at fault.
**Motive reveal:** prevent Marcelle, the likelier candidate, from receiving the planned inside-director board seat Paris wants.
**Evidence caution:** the new evidence source must not identify her by itself. The exact evidence chain remains to be designed and seeded.

### Exercise 25C — Elvis: financial concealment
**Case:** To be developed module by module. It must combine new finale evidence with established evidence from earlier modules.
**Desired discovery:** one successful query returns Elvis's name as the single person at fault.
**Motive reveal:** unfinished. Preserve his likeable, fun and extravagant personality; do not infer a specific financial scheme or motive yet.
**Evidence caution:** the new evidence source must not identify him by itself. Questionable approvals, disproportionate spending or blank `approved_by` values can support the case, but the exact chain remains to be designed and seeded.

### Post-25 dialogue — Wheatley
After the **three insider reveals**, the confrontation is interrupted during the closing payoff by breaking news of exposés, raids, arrests and asset freezes targeting wealthy figures. The characters recognize several names and establish that all those named in the report are HeriShare clients. The player can begin to connect this to Wheatley's confidential requests, but the news alone does not explain his identity or role. In the epilogue, his connection to Glasshouse and its international operation becomes clear: the collective supplied its evidence to journalists and authorities. Wheatley did not take part in the company sabotage. He does not receive a fourth graded reveal exercise. The precise dialogue, his real identity and the means of revealing his affiliation remain to be designed.


## Reveal fairness and implementation guardrails
- **Do not confuse a weak business result with corrupted data.** Actual losses, category-specific costs, shutdown, relisting, poor valuations and missing records may have innocent explanations.
- **Never attribute a row edit to a character based solely on who reported it.** The current schema has no authorship metadata.
- **Distinguish evidence from commentary.** Queries show facts about stored data; characters can lie by omission or interpretation.
- **Preserve lesson progression.** Do not smuggle joins into node 11, product appraisals into node 14, products into node 21/23, or dynamic grouped queries into basic filtering.
- Story progression may assume all parent modules were completed. No alternate narrative is required for players who reach a node without completing every parent.
- **A procedural generator must be deterministic enough to grade.** For randomized placeholders, specify a safe set or a source query with guaranteed relevant nonempty outputs; pin ties deterministically when using `ORDER BY`.
- **If the game uses SQLite**, check syntax/function availability (`NULLS FIRST/LAST`, `CASE` pivoting, date functions). Do not assume SQL-standard or PostgreSQL functions are available.
- **Before implementing a specific exercise**, validate exact table fields and statuses against the imported **playable** database, not helper CSV columns, historical drafts or the neutral filler alone.


## Worker-facing input template for each individual exercise
When the designer supplies the actual exercise, implement it from:

```text
Module folder:
Narrative context / mole (private to authoring):
Player-facing problem text (with {placeholders}):
Model SQL solution (same placeholders):
Randomization source for every placeholder:
Expected result or invariant:
Grading (row order, tie-break, column names/order):
Solution explanation (if any):
Seed/anomaly dependency (if any):
Replace existing or append; module position:
```

**Remember:** These module ideas do not specify exact procedural exercises, seed SQL, grading or dialogue. The designer provides those separately. Do not silently write them into canon.
