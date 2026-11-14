# Procedural SQL exercise directions

**Purpose:** Story and teaching directions for the procedural SQL exercise set. The implementation request authorizes turning these directions into working exercises and temporary character dialogue. The implemented exercises, story fixtures and reference queries now live in the application; see the review guide for verification and editing paths. All perpetrator information is private to the authors. The [implementation audit](./05_exercise_implementation_audit.md) records the accepted decisions and quality checks. See [the implementation review guide](./06_exercise_review_guide.md) for the working set.

Each family below follows the same chain: **who benefits and why → what happens to the data → what prompts the request → what the player investigates → what the characters can reasonably conclude**. The concrete records, affected people, amounts, dates, thresholds and SQL are kept in the implementation and review guide so this document remains a general design reference. Ordinary employees and clients are the default subjects of tampering; use a main-cast member as the affected subject only if an exercise genuinely needs it.

Each skill has three exercise families covering different aspects of the skill. Within a family, vary the particular records, fields, conditions, and other appropriate parameters while preserving the same causal story. The families in a module share a broad opening and closing, but each has its own parameter-dependent setup, query prompt, and payoff. The directions do not prescribe a sequence between the three families or require the same record in all of them.

**Evidence:** Staff complaints, approved requests, agreements, and other business documents can motivate an investigation, but they are not automatically stored in the playable database. Where a conclusion relies on an independent source, the exercise and dialogue establish what that source says. A result shows the data currently recorded; it does not by itself prove an edit, a person's intent, who made the edit, or a payment. Suspected misuse remains a working interpretation until sufficiently supported. The player performs read-only queries and does not repair the database.

**Curriculum:** Apply actual module prerequisites and table availability from the repository, not the numerical order in this document. A shared narrative or conclusion must work for every procedural variant and for valid paths through the skill tree. When sorting and limiting, design deterministic tie-breakers. Wheatley's personal client-data request belongs to node 20, where client accounts are available; he does not alter the company's records.

**Table notation:** Available tables are the SQL table names currently exposed by the curriculum at each node. “Tables used” lists the tables for an exercise direction; executable registrations and the review guide specify the implemented choices. The finale adds the story-only `record_changes` source. `quarterly_performance` is the SQL table name for the `quarterlyPerformance` dataset.

**Progression:** The investigation moves from confused operational complaints, to repeated discrepancies that persuade Caesar someone is interfering, to a clearer picture of the apparent motivations just before the finale. The facts may suggest damage to Marcelle's credibility, financial misuse, and a case against the pivot; no character should conclude before the finale that these must be separate perpetrators. Caesar can notice that the pattern reaches different parts of the company and be puzzled by why a single mole would have such scattered aims. The finale explains that the motives overlap because three insiders acted independently. Wheatley's requests are a separate red herring.

**Scope of design:** All 13 practical SQL nodes, including the finale, are implemented as three procedural families each. The user approved the finale and clarified that Elvis siphons money because he believes the company is failing. New story exercise IDs use version 1 and store only a numeric variant. Initial selection prioritizes unsolved families; local story completion requires all three current-version families independently of inferred curriculum completion.


## Node 11 — Choose Columns

**Available tables:** `departments`, `employees`, `contracts`, `transactions`.

**Private branch:** Paris. **Skill:** projecting columns, renaming, and distinct values, with no required filtering or joins.

**Shared opening:** Paris handles executive coordination and internal escalations. Staff have reported that ordinary handoffs, payroll communications, and travel administration are not working as expected. She asks the player to extract the relevant fields so the issues can be checked. Caesar treats this as irritating but probably ordinary data mishandling.

### Contact information for a failed handoff

**Tables used:** `employees`.

- **Mole and intent:** Paris wants an ordinary administrative failure to be traced back to data Marcelle was responsible for migrating.
- **Action on data:** She alters or removes a contact value for an ordinary employee, leaving the affected record plausible enough to escape immediate attention.
- **Issue and request:** A staff member's payroll or leave notification does not reach them. The complaint reaches Paris through her escalation work; she asks for a staff directory extract.
- **Query direction:** Select employee identity and relevant contact columns. Vary which contact channel is needed.
- **Conclusion:** The extract exposes the recorded contact information for comparison with the complaint or an independently verified contact. Paris has a concrete problem to pass on; neither the cause nor the editor has been established.

### Contract fields behind a leave complaint

**Tables used:** `contracts`.

- **Mole and intent:** Paris wants a routine leave issue to appear connected to Marcelle's data work.
- **Action on data:** She changes a leave-related contract value for an ordinary employee so that it no longer reflects the underlying approved request.
- **Issue and request:** The employee is told their leave or salary treatment does not match what they expected. Paris asks for contract fields relevant to the handoff.
- **Query direction:** Select identifying, status, and date fields from contracts, renaming a field for a handoff report where appropriate. Vary the fields the report needs.
- **Conclusion:** The result states what the contract table records. A comparison with the actual approval is necessary before concluding the entry is wrong; a leave row can legitimately overlap an active contract.

### Locations used for travel administration

**Tables used:** `employees`.

- **Mole and intent:** Paris wants travel-compensation questions to lead back to employee information that appears to have been migrated incorrectly.
- **Action on data:** She changes a city value used by a downstream travel process for selected ordinary employees, producing a recorded value that conflicts with a verified claim or address.
- **Issue and request:** An employee questions why a travel claim was assessed using a different city. Paris has the independently verified claim information and asks what city values the directory contains.
- **Query direction:** Retrieve distinct recorded employee cities. Choose the altered city from verified story cases so it appears in the output; vary the case without requiring filtering, text processing, or a comparison against another table.
- **Conclusion:** The distinct list exposes a recorded city that Paris can compare with the independent claim. It cannot identify the affected employee or editor by itself. Do not treat absence of a city as proof: another employee may legitimately share a city, and preview datasets differ.

**Shared conclusion:** A few routine processes depend on questionable recorded information. Caesar sees an operational problem but still favors mistake or migration confusion over sabotage.


## Node 12 — Filter Rows

**Available tables:** `departments`, `employees`, `contracts`, `expenses`, `transactions`.

**Private branch:** Elvis. **Skill:** simple equality, numeric comparison, text patterns, and null checks; focus on selecting rows rather than projection.

**Shared opening:** A department asks why its available spending or an expected purchase does not match the requests it recognizes. Caesar asks the player to help isolate the relevant entries. Elvis is available to explain the normal Finance workflow; he does not direct the player toward his own wrongdoing.

### An unfamiliar charge against a department

**Tables used:** `expenses`.

- **Mole and intent:** Elvis wants a questionable expense to move through routine Finance processing without drawing attention to himself.
- **Action on data:** He enters or alters an expense request so it is charged to a department in a way that can be concealed among normal activity. He wants to siphon money from a company he believes is failing; duplicate service-expense requests lead to payments to an account he controls.
- **Issue and request:** The department's staff do not recognize the use of their budget and raise it with Caesar, who asks for the department's recorded expense requests.
- **Query direction:** Filter expense rows on one department identifier. Vary the affected department or equivalent single criterion.
- **Conclusion:** The player finds requests recorded against that department. A department assignment alone does not prove an expense is illegitimate or that money was paid.

### An unexpected expense amount

**Tables used:** `expenses`.

- **Mole and intent:** Elvis wants a questionable amount to pass as part of normal spending.
- **Action on data:** He records an expense amount that does not match the underlying business request or supporting document.
- **Issue and request:** A staff member notices that the expected cost and the budget impact do not align. Caesar asks the player to retrieve expenses above or below a stated review threshold.
- **Query direction:** Filter expenses using one numeric comparison, varying the direction or threshold within a meaningful range.
- **Conclusion:** The returned amounts can be checked against the staff member's request. A large or small value is not inherently misconduct; the discrepancy depends on an independent reference.

### A request that cannot be matched

**Tables used:** `expenses`.

- **Mole and intent:** Elvis wants a questionable entry to be difficult to reconcile with the service or approval it purports to describe.
- **Action on data:** He uses an inaccurate description or leaves an approval field incomplete, depending on the exercise variant being designed.
- **Issue and request:** Someone trying to follow up a purchase cannot match the recorded request to the information they have. Caesar asks for entries matching a description pattern or an unknown approval.
- **Query direction:** Use one `LIKE` or `IS NULL` condition on expenses; choose variants whose outputs support the same broad issue.
- **Conclusion:** The result narrows the entries that need checking. A vague description or missing approval may have an innocent explanation and does not identify an actor.

**Shared conclusion:** These requests warrant follow-up, but Caesar can still view them as a mixture of recording and workflow mistakes. The player has not established financial theft.


## Node 13 — Sort and Limit Rows

**Available tables:** `departments`, `employees`, `contracts`, `expenses`.

**Private branch:** Wheatley. **Skill:** ordering, multiple sort keys, limits, offsets, and null placement. These tasks should not depend on filtering or client tables.

**Shared opening:** Wheatley privately presents himself as a senior colleague with a reason to organize internal reports. His cover is imperfect but superficially plausible. His actual aim is to help Glasshouse understand HeriShare's operations; he is not investigating or causing the three insiders' sabotage.

### Budget ordering

**Tables used:** `departments`.

- **Mole and intent:** Wheatley wants a view of organizational resources for his external investigation.
- **Action on data:** None; he requests access to existing data through the player.
- **Issue and request:** He claims he needs an ordered department report to prepare internal material.
- **Query direction:** Sort department rows by a relevant budget field, varying direction and a deterministic tie-breaker.
- **Conclusion:** Wheatley receives the ordered information. The player has reason to find the request odd, but the output does not implicate him in a data change.

### Expense report page

**Tables used:** `expenses`.

- **Mole and intent:** Wheatley wants an overview of internal spending activity.
- **Action on data:** None; other people may have altered some rows, but those changes are not his work.
- **Issue and request:** He asks for a particular page of an ordered expense report under an improvised business pretext.
- **Query direction:** Sort expenses and use `LIMIT` and `OFFSET`, varying the sort field, page size, or offset where it remains meaningful.
- **Conclusion:** The player supplies the requested page. A ranking alone is not evidence of fraud, and the payoff must not promise that a planted row is on the page.

### Employment-record ordering

**Tables used:** `employees` or `contracts`, depending on the chosen direction.

- **Mole and intent:** Wheatley wants a broader understanding of the company's personnel and operations.
- **Action on data:** None.
- **Issue and request:** He asks for an ordered set of employment or contract records, including an explicit treatment of unknown values.
- **Query direction:** Sort the chosen table by a relevant date or other field, include tie-breakers, and vary null placement where meaningful.
- **Conclusion:** He receives the requested list. The data may contain overlapping leave and employment rows; an open contract row is not automatically an active employment relationship.

**Shared conclusion:** Wheatley has obtained internal reports under a questionable pretext. He does not interact with the other staff during this module.


## Node 14 — Process Columns

**Available tables:** `departments`, `employees`, `contracts`, `expenses`, `transactions`.

**Private branch:** Bob. **Skill:** numeric, text/date, and conditional expressions in selected columns. Do not require joins or filters.

**Shared opening:** Bob and Caesar want to understand what the recorded post-pivot deals suggest about the marketplace. Bob has quietly made selected transaction figures appear less favorable, while remaining hesitant and allowing others to interpret the results.

### Illustrative fee or proceeds

**Tables used:** `transactions`.

- **Mole and intent:** Bob wants the commercial outcome to look weak enough that Caesar questions the pivot.
- **Action on data:** He changes selected recorded transaction prices to make reported deals appear less favorable.
- **Issue and request:** A recorded deal looks smaller than expected when staff prepare a commercial summary. Bob suggests calculating an illustrative fee or proceeds field.
- **Query direction:** Select transaction information and calculate a clearly stated hypothetical percentage or deduction, using an alias and rounding if appropriate. Vary the stated calculation.
- **Conclusion:** A low recorded price produces a low calculated estimate. The result is not proof of actual commission, profitability, or manipulation.

### Report values and dates

**Tables used:** `transactions`.

- **Mole and intent:** Bob wants weak-looking deals to appear credible in an ordinary business report.
- **Action on data:** He alters selected recorded deal figures; their exact selection and history remain to be designed.
- **Issue and request:** A colleague preparing a transaction report needs dates or status values in a readable format before examining the figures.
- **Query direction:** Select transaction identifiers and recorded prices alongside a derived text or date field, giving the processed field a clear label. Vary the transformation while remaining within the lesson.
- **Conclusion:** The query prepares a view of the recorded activity; it does not establish a trend or expose an edit. Any later claim about a specific weak deal needs supporting context.

### Conditional deal flag

**Tables used:** `transactions`.

- **Mole and intent:** Bob wants staff to notice the deals that support a pessimistic interpretation.
- **Action on data:** He has made some recorded prices look unfavorable.
- **Issue and request:** A business stakeholder asks for a simple way to flag recorded values for follow-up.
- **Query direction:** Produce a conditional flag from a stated threshold using a processed column; vary the threshold or flag labels without requiring a filter. Include a null-fallback variant using `COALESCE` when a deliberately present missing source value makes it meaningful.
- **Conclusion:** The flags identify recorded values in the requested band, not financial losses. Caesar sees a reason to examine deals more closely, not yet proof of a threat.

**Shared conclusion:** The output makes some reported outcomes worth investigating. Bob's changes must be supported by separately designed data, and he does not openly state his preferred strategic conclusion.


## Node 15 — Write Single-Criterion Query

**Available tables:** `departments`, `employees`, `contracts`, `expenses`, `transactions`.

**Private branch:** Paris. **Skill:** select relevant columns after one filter; optional distinct values or aliases.

**Shared opening:** Further staff escalations reach Paris: salary information, leave administration, and travel records do not agree with what employees were told. She asks for focused extracts before deciding what to report to leadership. This module follows Choose Columns, but it need not assume that any particular variant was seen there.

### Salary information for a reported group

**Tables used:** `employees`.

- **Mole and intent:** Paris wants a payroll complaint to look like another consequence of unreliable migrated data.
- **Action on data:** She changes a recorded salary value for an ordinary employee without changing the authoritative agreement or payroll information used for comparison.
- **Issue and request:** The employee questions a salary communication or calculation. Paris asks for the relevant employee details and recorded salary for a single, appropriately chosen group.
- **Query direction:** Select a small set of employee fields and apply one criterion, such as a suitable salary band boundary or location. Vary the criterion within the single-condition skill.
- **Conclusion:** The extract shows the recorded amount for the affected group. A discrepancy exists only after comparison with the independent agreement or payroll information; the query cannot determine who made the change.

### Contract details for a leave handoff

**Tables used:** `contracts`.

- **Mole and intent:** Paris wants an approved leave request to surface as another apparent systems or migration problem.
- **Action on data:** She changes a status or other leave-related value in an ordinary employee's contract record.
- **Issue and request:** The employee or the staff member handling leave says the recorded status does not match the approved request. Paris asks for the relevant contract fields.
- **Query direction:** Select identifying and leave-related fields using a single condition on a status, a date, or the presence of an end date. Vary the condition and output while preserving one criterion.
- **Conclusion:** The player extracts the records needed for the follow-up. Whether a row is wrong depends on the approval; `NULL` end dates and overlapping leave rows are not automatically errors.

### Location details behind a travel claim

**Tables used:** `employees`.

- **Mole and intent:** Paris wants a travel-compensation complaint to lead back to a suspect employee record.
- **Action on data:** She changes a stored location used by a downstream travel process.
- **Issue and request:** Staff handling a claim report that the employee's recorded location differs from the information supplied with the claim. Paris asks for a focused directory extract.
- **Query direction:** Select employee names and the relevant location fields, filtering on one reported value or other suitable single condition. Vary the affected location or lookup value.
- **Conclusion:** The result shows which records match the chosen condition. An independent claim or verified address is needed to establish the mismatch.

**Shared conclusion:** Multiple operational complaints now point toward data used by different administrative processes. Paris can cautiously raise migration as a possible explanation; Caesar takes the repetition seriously but still does not know whether the records were deliberately changed.


## Node 16 — Filter Rows on Multiple Criteria

**Available tables:** `departments`, `employees`, `contracts`, `expenses`, `transactions`.

**Private branch:** Elvis. **Skill:** combine conditions with `AND`, `OR`, grouping, ranges, and null checks; no required joins or subqueries.

**Shared opening:** A department follows up on purchases or available budget that still do not match its own requests. A department manager raises the issue with Caesar. He asks the player to narrow the relevant expenses; Elvis can explain routine Finance processes without initiating the trail.

### Requests in a cost centre and period

**Tables used:** `expenses`.

- **Mole and intent:** Elvis wants questionable requests to pass through Finance among legitimate departmental activity.
- **Action on data:** He creates or changes expense entries that appear to belong to an ordinary department and period.
- **Issue and request:** The department reports that its budget usage does not match its own records for that period. Caesar asks for the matching expense entries.
- **Query direction:** Filter expenses by department and a date interval using combined conditions. Vary the cost centre and period where suitable data exists.
- **Conclusion:** The rows show what was recorded for that scope. The department's own requests or supporting documents are needed to decide which, if any, are unexplained.

### Descriptions and amounts needing follow-up

**Tables used:** `expenses`.

- **Mole and intent:** Elvis wants a questionable expense to blend into an ordinary service category.
- **Action on data:** He changes or enters descriptive and amount information that makes the request look like normal spending.
- **Issue and request:** Staff recognize the service category but question a specific charge or budget impact. Caesar asks for entries matching both the service and the reported amount condition.
- **Query direction:** Combine a text condition with an amount comparison or range. Vary the service and threshold while ensuring each selected case has meaningful results.
- **Conclusion:** The result narrows the requests to investigate; neither the description nor the amount alone establishes fraud.

### Requests with competing explanations

**Tables used:** `expenses`.

- **Mole and intent:** Elvis wants discrepancies to remain explainable as ordinary workflow gaps.
- **Action on data:** He leaves or changes approval-related information on some questionable requests while other legitimate requests may also be incomplete.
- **Issue and request:** A department cannot tell whether the expenses it is being charged for completed the expected approval process. Caesar asks for cases matching a combination of relevant conditions.
- **Query direction:** Combine a null or non-null check with grouped alternatives or exclusions using `AND`, `OR`, or `NOT`. Vary the relevant department or process condition.
- **Conclusion:** The query identifies records that need an approval check. A missing approval field is a lead, not proof that a request was unauthorized or that an approver committed a crime.

**Shared conclusion:** The complaints are not limited to one accidental-looking entry. Caesar becomes concerned that the pattern deserves a fuller investigation, while accepting that the cause remains unproven.


## Node 17 — Write Single-Table Query

**Available tables:** `departments`, `employees`, `contracts`, `expenses`, `transactions`.

**Private branch:** Bob. **Skill:** combine projection, multiple conditions, processed columns, sorting, and limits in single-table queries.

**Shared opening:** Following earlier transaction calculations from the prerequisite module, Bob helps Caesar examine a more focused post-pivot report. Caesar is starting to question whether apparent weaknesses in different reports are real. Bob remains cautious and lets others reach the unfavorable interpretation.

### Selected completed deals

**Tables used:** `transactions`.

- **Mole and intent:** Bob wants a business report to suggest that the new marketplace produces disappointing deals.
- **Action on data:** He changes selected post-pivot transaction values so that the recorded prices appear less favorable.
- **Issue and request:** A commercial report based on the transactions appears weaker than expected. Caesar asks for the relevant recorded deals in a defined period and range.
- **Query direction:** Select useful transaction fields with multiple single-table conditions. Vary the period or price condition within the story-relevant cases.
- **Conclusion:** The query identifies matching recorded transactions. Low recorded values alone do not establish actual losses, the correct sale prices, or the editor.

### A calculated report field

**Tables used:** `transactions`.

- **Mole and intent:** Bob wants the impact of the altered figures to look like an ordinary consequence of the pivot.
- **Action on data:** He has changed a recorded transaction price used in commercial reporting; the calculation itself is not tampered with.
- **Issue and request:** Caesar asks what the selected deal figures would mean under an explicitly stated reporting assumption.
- **Query direction:** Filter an appropriate transaction subset, select meaningful fields, and compute an illustrative value such as a hypothetical fee or price adjustment. Vary the assumption or qualifying condition.
- **Conclusion:** The output follows from the recorded input and stated assumption. It is not a record of actual fees or proof that an asset was sold at a loss.

### A shortlist for leadership

**Tables used:** `transactions`.

- **Mole and intent:** Bob wants an unfavorable selection to reach decision-makers without openly arguing for his preferred strategy.
- **Action on data:** He has made some relevant transaction records appear weaker than they should.
- **Issue and request:** Caesar wants a manageable list of recorded values for a leadership discussion rather than an entire table.
- **Query direction:** Select and filter transaction fields, then sort and limit the result with a deterministic tie-breaker. Vary the scope and ranking in ways that still support the selected case; each variant must include a relevant affected record or use a payoff appropriate to its actual output.
- **Conclusion:** The list illustrates the requested recorded subset. Caesar may question whether such examples reflect the whole business; the list cannot by itself prove a trend or sabotage.

**Shared conclusion:** The selected transaction reports reinforce doubts about the pivot, but neither a shortlist nor Bob's comments establish the cause. Caesar increasingly wants independently supported answers.


## Node 18 — Write Lookup Query

**Available tables:** `departments`, `employees`, `contracts`, `expenses`, `accounts`, `products`, `transactions`.

**Private branch:** Elvis. **Skill:** retrieve records based on information in another table using membership, existence, or scalar lookups.

**Shared opening:** A department says that an expense charged to it cannot be matched to the purchase or authorization it expected. Caesar asks the player to identify the people and parts of the organization named in the relevant records. The module may follow the earlier single-criterion branch but cannot assume that Node 16 was completed.

### Who is recorded as requester?

**Tables used:** `employees`, `expenses`.

- **Mole and intent:** Elvis wants a questionable expense to look like a routine request from within the business.
- **Action on data:** He records or changes the claimed requester on an expense so the entry appears to have a plausible business origin.
- **Issue and request:** The department disputes having requested a charge. Caesar asks which employees the relevant expense entries name as requesters.
- **Query direction:** Use a membership lookup with `IN` in the model solution to find employees whose identifiers occur as requesters of expenses matching a selected condition. Vary the expense condition and affected group. Equivalent result-producing queries remain valid.
- **Conclusion:** The output gives the people recorded as requesters. It does not establish who actually submitted the request or that a named employee authorized it.

### Which department bears the charge?

**Tables used:** `departments`, `expenses`.

- **Mole and intent:** Elvis wants questionable costs to be absorbed into legitimate departmental spending.
- **Action on data:** He records or changes the department associated with an expense.
- **Issue and request:** A manager says a charge does not belong to their team's work. Caesar asks which departments are associated with the relevant requests.
- **Query direction:** Use a correlated `EXISTS` lookup in the model solution to find departments having a relevant expense. Vary the condition or cost category. Equivalent result-producing queries remain valid.
- **Conclusion:** The query identifies the recorded cost centres. A department's name in the result is a lead to check against its own purchase information, not proof of responsibility.

### Who is recorded as approver?

**Tables used:** `employees`, `expenses`.

- **Mole and intent:** Elvis wants the requests to appear consistent with Finance's approval process.
- **Action on data:** He inserts or alters approval-related values on selected requests; the duplicate request carries a different or missing recorded approval.
- **Issue and request:** The requester and the department cannot reconcile a specific entry with the authorization they expected. Caesar asks which employee is recorded as approving that expense.
- **Query direction:** Use a scalar subquery in the model solution to retrieve the approver identifier for one uniquely identified expense, then look up the employee. Select cases with a non-null recorded approver and vary the expense, including plausible ordinary approval cases. A primary-key lookup must guarantee the scalar result; do not rely on SQLite silently choosing a row from a multirow subquery.
- **Conclusion:** The result identifies the recorded approver of the selected expense. It does not prove that an approval was valid, that money moved, or who created the underlying request; a listed name must not prematurely reveal Elvis.

**Shared conclusion:** The issue touches people and approval responsibilities, not just a display error. Caesar is increasingly convinced that some records warrant deliberate investigation, but the data does not identify the person responsible.


## Node 19 — Join Tables

**Available tables:** `departments`, `employees`, `contracts`, `allocations`, `expenses`, `accounts`, `products`, `transactions`.

**Private branch:** Paris. **Skill:** join related records, including inner and outer joins and understanding one-to-many relationships.

**Shared opening:** Paris brings Caesar a new escalation from an area she coordinates. An employee or department reports an operational problem that cannot be understood from one record alone. Caesar has already encountered the multiple-criteria Finance investigation on this node's prerequisite path, so the new discrepancies strengthen his concern that someone may be interfering. He does not know who or whether the problems have one cause.

### Employee salary and contract

**Tables used:** `employees`, `contracts`.

- **Mole and intent:** Paris wants a payroll discrepancy to undermine confidence in the data Marcelle maintained.
- **Action on data:** She changes a current salary value for an ordinary employee while leaving the corresponding active contract value different.
- **Issue and request:** The employee or payroll staff dispute a salary-related communication or calculation. Paris asks for the employee record and its current contract to be inspected together.
- **Query direction:** Join employees to contracts, selecting the recorded employee salary and the relevant open active-contract salary. Vary the affected employee group or comparable contract conditions; avoid treating leave rows as active contracts.
- **Conclusion:** The query can expose a disagreement between stored values. An independent agreement or payroll source is needed to establish the correct amount, and the result does not identify an editor.

### Employment and leave dates

**Tables used:** `employees`, `contracts`.

- **Mole and intent:** Paris wants a leave or eligibility problem to look like a failure in personnel data maintenance.
- **Action on data:** She changes a relevant date on an ordinary employee's record so that a downstream eligibility or leave calculation receives incorrect information.
- **Issue and request:** A staff member says their leave or service-related treatment conflicts with their actual employment history. Paris asks the player to compare the employee and contract records.
- **Query direction:** Join the employee to relevant contract rows and return identity and dates needed to compare the records. Vary the group or date relationship while ensuring that the proposed contradiction is meaningful and not simply a later contract following an earlier hire.
- **Conclusion:** The output supports a focused comparison. The approved leave or employment record supplies independent context; a normal sequence of contracts or overlapping leave does not by itself demonstrate corruption.

### Department handoff or allocation

**Tables used:** `employees`, `allocations`, `departments`, depending on the chosen relationship.

- **Mole and intent:** Paris wants a complaint from a departmental handoff to point toward an apparently flawed organizational record.
- **Action on data:** She changes a valid department assignment or management reference, or removes an allocation needed by a handoff, for ordinary staff or organizational rows. Missing relationships can be created without inserting a foreign key that points to a nonexistent record.
- **Issue and request:** A department says a staff request or responsibility was routed to the wrong place. Paris asks the player to inspect the relevant employee, allocation, and department information.
- **Query direction:** Use a left join chain from employees through allocations to departments, returning the selected employees even when no allocation matches. Ensure at least one legitimate matching relationship and one deliberately missing relationship in the relevant fixture. Keep conditions on optional right-side data from accidentally removing the unmatched rows. Vary the handoff or affected group.
- **Conclusion:** The joined rows show the recorded relationship. A transfer notice or other independent source is needed to establish what it should be. Parent and child departments can overlap, so headcount arithmetic alone cannot prove an error.

**Shared conclusion:** Complaints from distinct operational processes now connect to discrepancies across related records. Paris can argue that Marcelle's work needs scrutiny; Caesar is increasingly convinced that at least some interference may be deliberate, but an apparent pattern around migration is circumstantial and no identity is established.


## Node 20 — Write Multi-Table Query

**Available tables:** `departments`, `employees`, `contracts`, `allocations`, `expenses`, `accounts`, `products`, `transactions`.

**Private branch:** Wheatley. **Skill:** combine joins, filters, membership or existence conditions, and other multi-table reasoning. Sorting and aggregation are not prerequisites of this skill.

**Shared opening:** Wheatley privately asks for information about client-related assets and transactions, using an unconvincing but superficially plausible business pretext. He is trying to connect people to information Glasshouse has already gathered. He cannot assume the player has completed either of his other modules. The player has completed this node's lookup and join prerequisites, but Wheatley should not refer to conversations he did not witness.

### Assets involved in selected transactions

**Tables used:** `products`, `transactions`.

- **Mole and intent:** Wheatley wants to understand which assets are associated with activity relevant to Glasshouse's outside investigation.
- **Action on data:** None. He uses the player's access to retrieve existing business information.
- **Issue and request:** He claims he needs an asset-and-transaction shortlist for an internal purpose.
- **Query direction:** Combine products and transactions with suitable conditions on product and transaction fields. Vary the asset category or transaction condition without requiring grouping or sorting.
- **Conclusion:** Wheatley obtains the requested relationship. A transaction's status and current product owner must be interpreted correctly; a high-value deal does not prove criminality.

### Relationships between assets and activity

**Tables used:** `products`, `transactions`.

- **Mole and intent:** Wheatley wants to narrow which asset relationships could matter to the outside investigation.
- **Action on data:** None.
- **Issue and request:** He asks for assets whose relevant recorded transactions all satisfy a stated condition, presenting it as a routine internal check.
- **Query direction:** Combine products and transactions to express a universal condition. The model solution uses an existence check for at least one transaction in the stated scope and an anti-existence check for any transaction violating the condition. Define that scope explicitly and include matching and counterexample assets, so an asset with no relevant transactions does not pass accidentally. Vary the qualifying condition; no aggregation or sorting is required.
- **Conclusion:** The result establishes only the requested relationship in HeriShare's records. Current ownership does not prove who owned an asset at every earlier transaction.

### Client identities and contact information

**Tables used:** `accounts` and `transactions` and/or `products`, depending on the qualifying relationship.

- **Mole and intent:** Wheatley needs confidential client details to connect certain individuals and financial relationships to Glasshouse's existing evidence.
- **Action on data:** None; the unauthorized act is obtaining information through a deceptive request to the player.
- **Issue and request:** He claims a business need for the identities and contact details of accounts associated with specified transactions or assets.
- **Query direction:** Combine accounts with the relevant transaction or product relationships and retrieve the appropriate identifying fields. Vary the qualifying relationship and requested client details within a coherent shared scenario.
- **Conclusion:** Wheatley receives the requested confidential information. An account may belong to an organization or representative, and neither wealth nor wrongdoing follows from appearing in the result. Exact individuals and their external criminal links remain to be designed.

**Shared conclusion:** Wheatley has gathered commercially sensitive information and disengages. His role remains a red herring; the employee-mole investigation and Glasshouse's outside investigation are independent.


## Node 21 — Aggregate Columns

**Available tables:** `departments`, `employees`, `contracts`, `expenses`, `quarterly_performance`, `transactions`.

**Private branch:** Wheatley. **Skill:** aggregate functions and grouping without requiring filters or joins.

**Shared opening:** Wheatley contacts the player privately with another loosely justified request, this time for internal summaries. Glasshouse can use a broad view of company activity to orient its external investigation. The player need not have encountered him in either of his other modules.

### Transaction activity by status

**Tables used:** `transactions`.

- **Mole and intent:** Wheatley wants to understand the shape of activity in HeriShare's marketplace.
- **Action on data:** None. Records may include changes by others, but Wheatley does not make them.
- **Issue and request:** He claims he needs an overview of how recorded transaction activity is distributed.
- **Query direction:** Group transaction records by an appropriate status or comparable field and use a count. Vary the useful aggregate or grouping only within the lesson's scope.
- **Conclusion:** The output summarizes the stored records. It does not identify a client, establish criminal activity, or prove that transactions were completed.

### Category-period financial summary

**Tables used:** `quarterly_performance`.

- **Mole and intent:** Wheatley wants a broad commercial overview relevant to his investigation.
- **Action on data:** None. Bob may separately have changed some performance data.
- **Issue and request:** Wheatley asks for a report of recorded category or period performance under an internal-sounding pretext.
- **Query direction:** Group `quarterly_performance` by suitable available period fields and sum a relevant measure such as revenue or attributable costs. Vary the measure or grouping.
- **Conclusion:** The result summarizes recorded values, not their accuracy. Do not equate revenue with total asset-sale value or treat partial and full quarters as equivalent.

### A range or average of recorded activity

**Tables used:** one available table, to be selected when the exercise is designed.

- **Mole and intent:** Wheatley wants another broad indicator of how the business operates.
- **Action on data:** None.
- **Issue and request:** He asks for an average or range within an internal report, without explaining why he needs it.
- **Query direction:** Use an average, minimum, or maximum with meaningful grouping on an available table. Vary the measure or grouping without requiring a filter or a join.
- **Conclusion:** Wheatley receives a statistical summary of the stored rows. An extreme value is not automatically a clue to a specific person's identity or wrongdoing.

**Shared conclusion:** Wheatley has obtained internal summaries, adding to the player's unease about his requests. His connection to Glasshouse and separation from the data tampering remain concealed.


## Node 23 — Write Filtered Aggregation Query

**Available tables:** `departments`, `employees`, `contracts`, `expenses`, `quarterly_performance`, `transactions`.

**Private branch:** Bob. **Skill:** filter rows before aggregation, filter groups with `HAVING`, and calculate aggregate results. `accounts` and `products` are not available on this branch.

**Shared opening:** Caesar asks whether the commercial figures that concern him are isolated or form a broader pattern. Staff have an independent business reference for checking at least some of the figures, although its exact form remains to be designed. Bob remains helpful and measured, aware that the altered performance figures can support his preferred conclusion. Aggregate Columns is a prerequisite, but its Wheatley conversation was private; other characters cannot be assumed to have heard it.

### Performance for a selected period or category

**Tables used:** `quarterly_performance`.

- **Mole and intent:** Bob wants the post-pivot model to appear economically weaker than it is.
- **Action on data:** He alters selected category-period performance figures in a way intended to affect reported results.
- **Issue and request:** A reported category result looks unexpectedly weak in management information. Caesar asks for the relevant period or category to be summarized.
- **Query direction:** Filter appropriate performance rows before grouping and aggregate the relevant recorded values. Vary the period, category, or measure where coherent with the chosen data.
- **Conclusion:** The summary describes what the table reports for that scope. It does not establish whether the values are correct or whether an operating shortfall is suspicious.

### Groups meeting a shortfall condition

**Tables used:** `quarterly_performance`.

- **Mole and intent:** Bob wants a selection of weak-looking results to support doubts about the pivot.
- **Action on data:** He changes selected reported revenue or cost figures so that they contribute to an unfavorable aggregate.
- **Issue and request:** Caesar wants to know which groups meet a stated reporting condition, rather than relying on isolated examples.
- **Query direction:** Group suitable performance rows and use `HAVING` to retain groups meeting an aggregate condition. Vary the meaningful condition or threshold once the data is designed.
- **Conclusion:** The result identifies qualifying recorded groups, but genuine business conditions and data manipulation are both possible explanations. Shutdown periods and partial quarters need care.

### Compare scoped aggregate results

**Tables used:** `quarterly_performance`.

- **Mole and intent:** Bob wants an apparently sustained deterioration to steer Caesar toward doubting the new strategy.
- **Action on data:** He has altered selected performance figures intended to affect comparisons.
- **Issue and request:** Caesar asks whether unfavorable results persist across a comparable set of categories or post-pivot periods.
- **Query direction:** Filter and aggregate suitable rows, using a conditional calculation or comparison of aggregate results as appropriate. Vary the category or periods only when their business definitions are comparable.
- **Conclusion:** The output supports a provisional comparison of the recorded figures. Independent source records are needed before concluding that a real trend exists or that it was fabricated.

**Shared conclusion:** With a credible independent comparison as well as the suspicious reports, Caesar can conclude that someone is interfering and wonder whether the commercial figures were made to weaken the pivot's case. This node does not assume that he has heard complaints from unrelated branches or already knows all apparent motives. His certainty depends on designing the corroborating evidence, not on a weak-looking number alone.


## Node 25 — Write Multi-Step Query: finale

**Available tables:** `departments`, `employees`, `contracts`, `allocations`, `expenses`, `quarterly_performance`, `accounts`, `products`, `transactions`. The story-only `record_changes` evidence table is introduced here, with registry key `recordChanges`.

The last node is reserved for the reveal. Its prerequisites cover the earlier investigation branches, so just before it Caesar can bring together the established concerns: staff-facing administrative failures seem to damage confidence in Marcelle, financial records suggest possible misuse, and commercial reports may have been made to weaken the pivot. Still looking for one mole, he is confused about how those apparently different motives fit together. These are evidence-supported hypotheses, not established identities.

Marcelle supplies an independently retained, signed change-history export. Its actor reference denotes an authenticated individual account, distinct from requesters, approvers or people present at work. It contains routine legitimate activity alongside relevant events. Each final query combines business discrepancies with matching row keys, fields and before/after values, corroborating several selected records before resolving an employee identity. Payment destinations are supplied separately through independent settlement confirmations in the payoff. The neutral mock-data package remains unchanged.

### Bob — Strategic manipulation

**Tables used:** `transactions`, `products`, `quarterly_performance`, `employees`, `record_changes`.

- **Intent and action:** Bob has altered business information to make the pivot appear unsuccessful and prompt a return toward the original mission.
- **Investigation direction:** Starting with the earlier transaction and performance discrepancies, use independently retained evidence to establish which values changed and trace the relevant actions to the responsible insider. A multi-step query should combine the earlier case with the new evidence rather than selecting a culprit from the new source alone.
- **Conclusion:** The characters learn that Bob was responsible and understand his motive through the confrontation; SQL results alone do not reveal his private feelings.

### Paris — Manufactured downstream complaints

**Tables used:** `employees`, `contracts`, `record_changes`.

- **Intent and action:** Paris has caused staff-facing problems in areas she coordinates, then used their apparent connection to migrated data to discredit Marcelle.
- **Investigation direction:** Combine previously identified personnel, leave, salary, travel, or departmental discrepancies with independent evidence of the relevant changes. Trace the changes to the responsible insider without treating a complaint or valid foreign key as proof of authorship.
- **Conclusion:** The characters learn that Paris caused the problems and understand why she wanted Marcelle's credibility damaged.

### Elvis — Financial misconduct

**Tables used:** `expenses`, `employees`, `record_changes`.

- **Intent and action:** Elvis inserts duplicate service-expense requests to siphon funds into a supplier account he controls because he believes the company is failing.
- **Investigation direction:** Connect earlier disputed charges and approval information to independent evidence that establishes the relevant actions and responsible insider. If the story asserts that money was paid or diverted, supply separate evidence of payment or destination; expense requests alone cannot establish it.
- **Conclusion:** The query identifies Elvis as the authenticated insertion actor behind the repeated duplicates. Independent settlement confirmations establish payments to his controlled supplier account, and his admission establishes the motive. Expense rows alone do not prove a transfer.

### Closing payoff and epilogue

The three findings resolve Caesar's confusion over the apparent mole's scattered motives: the issues came from independent insiders. During the confrontation, breaking news reports a coordinated crackdown on wealthy figures. The characters recognize several names and establish that all the people named in the report are HeriShare clients. This partially suggests a connection to Wheatley's requests without explaining his identity or role in full.

In the epilogue, the player learns that Wheatley gathered intelligence for Glasshouse, whose evidence went to journalists and authorities. His actions were independent of the insider sabotage, his aim was to expose powerful criminals rather than enrich himself or harm innocent clients, and HeriShare's business was legal. The identities of the implicated clients, Wheatley's real identity and access method, and the precise dialogue and reveal mechanism remain to be designed.
