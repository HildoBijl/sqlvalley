# SQLValley — Practical Module Story Beats and SQL Skill Map

**Purpose:** Working map for the **13 SQL skill modules currently present in the repository**. The legacy node numbers are retained only as labels, with removed Nodes 22 and 24 omitted. The directions below are provisional reference material, not approved dialogue, exercises, SQL solutions or tampered records. The designer supplies the final dialogue, prompts and payoffs for each module.

## Invariants for every module
1. The story contains **exactly four moles: Bob, Elvis, Paris and Wheatley**. Every practical module should advance the insider investigation, except Wheatley's one remaining module, which secretly advances his sensitive-data collection instead.
2. **Three procedural exercises per node**, each using the same named SQL skill; they can be three increasingly meaningful steps in one local business problem (inspect → narrow / compare → establish a provisional finding). Do not make Exercise 2 or 3 depend on concepts not yet taught for that node. The exercises must cover all bases for a given skill, preferably with no overlap in the taught skill. They can make use of any tables available at that point, and do not mandatorily need to use the same table. Exercises can be disjoint in direction but thematically coherent (for example 3 modular exercises in 3 different tables that all showcase Marcelle's "incompetence")
3. **One assigned mole per module** (except Node 25, one revealing exercise for each of Bob, Paris and Elvis). Assigned mole = **actual cause or beneficiary**, not necessarily the dialogue initiator or apparent suspect. **Do not reveal this assignment to the player.**
4. Dialogue prefaces the problem, acknowledges each query result, and closes the module with a **provisional** takeaway. Culprits are named as culprits **only in Node 25**. A correct result and a character's explanation need not be the same thing.
5. **Only use tables reachable through the repository's directed module dependencies.** `allocations` becomes available at `join-tables` and is available to its descendants. A table being available does not mean all three exercises must use it.
6. The current repository schemas, table access rules and table contents are the finalized baseline canon. Conflicting figures in the material are older drafts. The player only runs read-only queries: any character repairing a problem happens in the story and does not mutate the playable data.
7. Baseline raw data has historical semantics: post-pivot-only `transactions`; `products.owned_by` is the *latest/current* owner; `quarterlyPerformance` contains category-quarter rows and has **no `growth_rate` column**; Q2 2025 is partial through Apr 30; do not compare fractional and whole-asset transaction counts as identical units.

## Table introductions
| Repository module | New table | Relevant primary fields |
|---|---|---|
| `database` | `departments`, `employees` | department and employee identity/current-state fields |
| `data-types` | `expenses` | `exp_id`, `amount`, `d_id`, `description`, `date`, `requested_by`, `approved_by` |
| `database-keys` | `accounts` | `username`, `verified`, identity fields, `created_at`, `last_login_at` |
| `projection-and-filtering` | `transactions` | `t_id`, `vendor`, `buyer`, `prod_id`, `date_time`, `price`, `validated_by`, `status` |
| `join-and-decomposition` | `products` | `p_id`, `name`, `category`, `owned_by`, `est_value`, `status` |
| `aggregation` | `quarterlyPerformance` | `quarter`, `fiscal_year`, `category`, `revenue`, `operating_expenses`, `total_transactions`, `updated_at` |
| `sql` | `contracts` | `e_id`, `position`, `salary`, `start_date`, `end_date`, `perf_score`, `status` |
| `join-tables` | `allocations` | employee/department membership and allocation dates |

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
| 17 | Write Multi-Criterion Query | Paris | “Migration” failures concentrate |
| 18 | Write Look-Up Query | Elvis | Financial problem approaches internal controls |
| 19 | Join Tables | Paris | Strong apparent case against Marcelle; doubt begins |
| 20 | Write Multi-Table Query | Bob | Several trades seem weak |
| 21 | Aggregate Columns | Bob | Apparent systemic business failure |
| 23 | Use Filtered Aggregation | Bob | Evidence may be too one-sided |
| 25 | Write Multi-Layered Query | Bob / Paris / Elvis | Three separate insider reveals; Wheatley afterword |

---

## Node 11 — Choose Columns
**Assigned mole:** Paris. **Skill folder:** `choose-columns`.

**Available tables:** `departments`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** `SELECT` named columns, multiple fields, `AS` renaming, `DISTINCT`; no required `WHERE`, joins or aggregation.

**Narrative beat:** This is the **first practical investigation**. A staff directory or internal handoff extract has mismatched-looking fields. The mole clearly can affect real company data, but nothing points to the actor or motive. Paris can be present as an efficient organizer; **avoid directly blaming Marcelle**.

**Three exercise directions (not final prompts):**
1. Select the few employee contact/identity columns needed to inspect a questionable directory export.
2. Select relevant department fields or contract fields to compare how an internal list is labeled.
3. Retrieve distinct values / renamed columns for a small organizational review. A planted duplicated employee email or wrong display value may be *noticed in output* without requiring SQL duplicate detection.

**Planted data concept:** a low-stakes Paris-made semantic/contact inconsistency. Needs explicit seed; a valid `SELECT` alone does not identify who changed it.

**Close:** “Someone changed ordinary staff information; we do not know why.” No attribution.

## Node 12 — Filter Rows
**Assigned mole:** Elvis. **Skill folder:** `filter-rows`.

**Available tables:** `departments`, `expenses`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** simple `WHERE` comparisons (`=`, `>`, `<`, `IS NULL`, simple text matching as appropriate); favor `SELECT *` to focus on row filtering. **This is filtering, not the separate Sort Rows node.**

**Narrative beat:** A routine review discovers a questionable expense or financial transaction. Someone **other than Elvis** asks the player to isolate it. Elvis may offer help or interpret the figures, but should not deliberately expose his own criminal path.

**Three exercise directions:**
1. Retrieve expenses charged to a particular `d_id`.
2. Isolate an expense date/amount condition associated with an apparent mismatch.
3. Inspect transactions of one `status` or a defined price threshold as a cross-check of normal Finance activity.

**Planted data concept:** a realistic entry mixed with valid Finance rows; the anomaly is subtle, not labelled “fraud.”

**Close:** “This isn't only a display issue; money-related entries may be affected.” No proof of theft.

## Node 13 — Sort Rows
**Assigned mole:** Wheatley. **Skill folder:** `sort-rows`.

**Available tables:** `departments`, `expenses`, `employees`, `contracts`.

**SQL learning focus:** `ORDER BY`, `ASC`/`DESC`, multi-column ordering, `LIMIT`, `OFFSET`, NULL positioning where the SQL engine supports it; no joins.

**Narrative beat:** Wheatley privately requests ranked internal lists, claiming an unverified business need. **No data is damaged.** His conduct is the problem, though the player cannot yet see why.

**Three exercise directions:**
1. Rank departments by budget.
2. Find highest recorded expenses, with a deterministic tie-breaker.
3. Rank employees or contracts by compensation/hire date, perhaps returning only the first page.

**Close:** The request is oddly specific and sensitive. Wheatley disappears. Do not force the player to confront him or make him interact with other staff.

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

**Narrative beat:** Another administrative anomaly appears, now near post-pivot hiring, job changes or systems cleanup. Paris begins pointing vaguely toward “the migration” without making a direct accusation.

**Three exercise directions:**
1. Select employee attributes from an identified recovery-era subset using one condition.
2. Isolate contracts for one position/status or with `end_date IS NULL`.
3. Pull selected expense/transaction fields tied to one employee ID or department.

**Planted data concept:** wrong but plausible staff/contract detail that could be blamed on database restoration. **An employee contract need not itself be wrong**; a cross-source mismatch can be established later.

**Close:** “A similar issue has happened more than once.” Marcelle is only a tentative explanation, not an identified culprit.

## Node 16 — Filter Rows on Multiple Criteria
**Assigned mole:** Elvis. **Skill folder:** `filter-rows-on-multiple-criteria`.

**Available tables:** `departments`, `expenses`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** `AND`, `OR`, parentheses, `BETWEEN`, `NOT`, `IS NULL`, `LIKE`; no required subqueries or joins.

**Narrative beat:** Financial irregularities concentrate in a particular operational period or cost centre rather than appearing random. A reviewer—not Elvis deliberately—asks for a closer filter; Elvis has plausible normal-process explanations.

**Three exercise directions:**
1. Filter expenses by department **and** date interval.
2. Add amount thresholds, status or requester conditions with correctly grouped boolean logic.
3. Use exclusion / NULL conditions to isolate the most relevant remaining cases.

**Planted data concept:** an illicit-looking row camouflaged among genuine expenses or a carefully chosen set of operational failures. Avoid obvious repeated $9,999 threshold-evasion patterns in baseline data.

**Close:** “There is a repeatable selection pattern in the financial discrepancies.” No culprit identified.

## Node 17 — Write Multi-Criterion Query
**Assigned mole:** Paris. **Skill folder:** `write-multi-criterion-query`.

**Available tables:** `departments`, `expenses`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** combine selected columns, calculated values, compound filters, `ORDER BY` and `LIMIT` in a **single-table** query. Avoid requiring joins/subqueries to pass.

**Narrative beat:** The suspected data-quality errors now cluster around the company’s recovery period and the kinds of changes Marcelle oversaw. Paris is more openly impatient about “quality control,” while other staff remain cautious.

**Three exercise directions:**
1. Select a precise employee or contract subset by dates, status and role criteria.
2. Produce a sorted shortlist of suspicious-looking values with renamed/calculated fields.
3. Use compound conditions to identify which records deserve later relational cross-checks.

**Planted data concept:** multiple subtle semantic inconsistencies in data supposedly influenced by the post-pivot restoration. They should not require the player to prove Paris's involvement yet.

**Close:** “The problems seem concentrated, not random.” Marcelle may look responsible, but the evidence is still circumstantial.

## Node 18 — Write Look-Up Query
**Assigned mole:** Elvis. **Skill folder:** `write-look-up-query`.

**Available tables:** `departments`, `expenses`, `accounts`, `transactions`, `employees`, `contracts`.

**SQL learning focus:** **scalar or membership subqueries** (`IN`, a simple correlated lookup, etc.) to retrieve records based on another table. Keep them at the intended skill level; joins are taught at 19.

**Narrative beat:** A legitimate requester wants to understand how expense and transaction irregularities connect to people or accounts. The pattern begins approaching internal Finance processes. Elvis has credibility and can explain the links without being identified.

**Three exercise directions:**
1. Look up employees referenced as validators of a qualifying transaction subset.
2. Retrieve accounts involved in transactions with a chosen financial status or condition.
3. Look up expense requester/approver employees associated with a specific group of expenses.

**Planted data concept:** Finance-supervised chains, approvals and status handling that approach Elvis but leave an innocent explanation open.

**Close:** “These anomalies touch particular controls and people; we still don't know whether the link is causal.”

## Node 19 — Join Tables
**Assigned mole:** Paris. **Skill folder:** `join-tables`.

**Available tables:** `departments`, `expenses`, `accounts`, `transactions`, `products`, `employees`, `contracts`, `allocations`.

**SQL learning focus:** `INNER JOIN`, appropriate `LEFT JOIN`, keys, aliases and multiple joins where appropriate; explain one-to-many joins and avoid false duplicates.

**Narrative beat:** The player compares records across the domains Marcelle migrated. They find convincing apparent cross-table mistakes, strongly damaging Marcelle's reputation. However, the sheer concentration or timing of problems starts to suggest someone **wanted** them discovered.

**Three exercise directions:**
1. Join transactions with accounts to inspect buyer/vendor identity data.
2. Join transactions to products to compare actual deal facts against present catalogue information, carefully respecting current vs historical ownership.
3. Join `employees` to `contracts` on `e_id` for historical employment facts; join `allocations` where employee-to-department membership is needed; optionally join `departments.manager_id` to `employees.e_id` for manager identities.

**Planted data concept:** altered semantic cross-references, management metadata or migrated identities that falsely implicate Marcelle. Avoid breaking an enforced FK constraint unless an exercise intentionally demonstrates invalid references and the loading workflow supports them.

**Close:** Paris argues that Marcelle's work is unreliable. Another character can question why the error pattern is so targeted.

## Node 20 — Write Multi-Table Query
**Assigned mole:** Bob. **Skill folder:** `write-multi-table-query`.

**Available tables:** `departments`, `expenses`, `accounts`, `transactions`, `products`, `employees`, `contracts`, `allocations`.

**SQL learning focus:** combines joins with filters, calculations, membership subqueries and multi-table conditions. More complex than the basic joins in 19, but not yet a general multilayered CTE challenge.

**Narrative beat:** Bob encourages a closer look at the **commercial success of actual whole-asset trades**. Multiple examples look unfavorable; Caesar may be present to hear the results.

**Three exercise directions:**
1. Join `transactions` to `products` to compare sale `price` against `est_value`, with care about appraisal timing.
2. Include buyer/seller accounts and filter for real `COMPLETED` sales or suspicious commercial sequences.
3. Retrieve a shortlist of asset/category/deal relationships with poor apparent performance.

**Planted data concept:** Bob-adjusted transactional/performance data. The report should be plausible enough that the player might accept an economic explanation, but defensible independent cross-checks can undermine it later.

**Close:** “There are multiple weak outcomes. Is this a bad run of deals or a sign the model itself is failing?” Bob does not state his preferred policy.

## Node 21 — Aggregate Columns
**Assigned mole:** Bob. **Skill folder:** `aggregate-columns`.

**Available tables:** `departments`, `expenses`, `transactions`, `quarterlyPerformance`, `employees`, `contracts`.

**SQL learning focus:** `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`; basic grouping and NULL behavior. Do not use `growth_rate` (field removed).

**Narrative beat:** Bob's apparent problem expands from specific trades into category- and quarter-level trends. Caesar, Finance or another listener may start taking the negative strategic claims seriously.

**Three exercise directions:**
1. Sum revenue / attributable operating costs by quarter or category in `quarterlyPerformance`.
2. Count transaction attempts by status/month or compare category-quarter activity using available columns.
3. Calculate averages or extrema that make weak post-pivot performance look systemic.

**Planted data concept:** tampered `quarterlyPerformance` records or correlated source metrics; plan exact consistency carefully. **Do not treat pre-pivot fractional transaction counts as whole-asset equivalents** and do not treat partial Q2 2025 as a full quarter.

**Close:** “The poor outcomes no longer look isolated.” A skeptical comment can question definitions or data quality without identifying Bob.

## Node 23 — Use Filtered Aggregation
**Assigned mole:** Bob. **Skill folder:** `use-filtered-aggregation`.

**Available tables:** `departments`, `expenses`, `transactions`, `quarterlyPerformance`, `employees`, `contracts`.

**SQL learning focus:** `GROUP BY`, `WHERE` before grouping, `HAVING` after grouping, aggregate filters and conditional aggregates when appropriate. No requirement for `products` or `accounts` here; they are **not unlocked on this branch**.

**Narrative beat:** Select only the weakest sectors/periods from the earlier aggregates. Bob's case starts to look almost *too* consistent, and another employee questions whether the source figures can be trusted.

**Three exercise directions:**
1. Find category-period groupings whose attributable costs exceed revenue.
2. Use `HAVING` to identify groups with low activity or large negative margins.
3. Restrict by period/category and rank the worst qualifying performance summaries.

**Planted data concept:** strategically biased source figures to make unfavorable groups dominate. Beware genuinely costly categories, shutdown Q3 2024 and the partial final quarter; negative operating margins there are not automatically sabotage.

**Close:** A dilemma emerges: is the pivot weak, or is someone manufacturing the evidence? No named culprit yet.

## Node 25 — Write Multi-Layered Query
**Assigned moles:** **Bob / Paris / Elvis — one reveal per exercise.** **Skill folder:** `write-multi-layered-query`.

**Available tables:** all nine baseline repository tables — `departments`, `expenses`, `accounts`, `transactions`, `products`, `quarterlyPerformance`, `employees`, `contracts`, `allocations` — plus the new finale work-presence/login table once its name and schema are approved.

**SQL learning focus:** CTEs, nested subqueries, combined joins and aggregation, multi-stage reasoning, accurately scoped historical comparisons and case-specific validation. **Each of the three exercises remains an advanced SQL exercise.**

### Exercise 25A — Bob: fabricated strategic evidence
**Case:** To be supplied by the designer. It must combine the finale table with established evidence from earlier modules.
**Desired discovery:** one successful query returns Bob's name as the single person at fault.
**Motive reveal:** guilt about the Loophole; privately wishes the original public-cultural HeriShare model would return; sabotages data to convince Caesar without arguing openly.
**Evidence caution:** the finale table must not identify him by itself. The exact evidence chain remains to be designed and seeded.

### Exercise 25B — Paris: deliberate framing of Marcelle
**Case:** To be supplied by the designer. It must combine the finale table with established evidence from earlier modules, including `allocations` where useful.
**Desired discovery:** one successful query returns Paris's name as the single person at fault.
**Motive reveal:** prevent Marcelle, the likelier candidate, from receiving the planned inside-director board seat Paris wants.
**Evidence caution:** the finale table must not identify her by itself. The exact evidence chain remains to be designed and seeded.

### Exercise 25C — Elvis: financial concealment
**Case:** To be supplied by the designer. It must combine the finale table with established evidence from earlier modules.
**Desired discovery:** one successful query returns Elvis's name as the single person at fault.
**Motive reveal:** unfinished. Preserve his likeable, fun and extravagant personality; do not infer a specific financial scheme or motive yet.
**Evidence caution:** the finale table must not identify him by itself. Questionable approvals, disproportionate spending or blank `approved_by` values can support the case, but the exact chain remains to be designed and seeded.

### Post-25 dialogue — Wheatley
After the **three insider reveals**, Marcelle's return or restored connection may finally let the player speak. The player's only dialogue option raises Wheatley; the other characters react with surprise and confusion because they do not recognize him. This happens in post-completion dialogue, **not** as a fourth graded exercise. Wheatley's identity and true motive remain unknown. The precise dialogue and return mechanism are still to be supplied by the designer.

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
