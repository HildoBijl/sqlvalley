# Implemented SQL exercise review guide

The application contains **39 procedural exercise families across all 13 practical SQL nodes**, including three finale investigations. There are 128 finite variants. Dialogue and portraits are temporary; every dialogue block states its Purpose and Goal.


## Review in the app

1. Run `npm run dev` from the repository root and open the local URL.
2. Enable Admin Mode in the localhost settings menu and leave Story Mode enabled. Story presentation remains behind the existing admin test-phase setting.
3. Open a SQL skill and its Practice tab. Shared opening dialogue appears before the exercise; its own request and case reference explain the task.
4. Use the admin exercise selector to inspect any family. The Solution section is available to admins; inserting its query lets you verify submission, results and payoff.
5. Submit a correct answer to each of the three families. Next exercise prioritizes families not yet solved at their current version. Giving up reveals the solution but does not earn the payoff or count toward story completion.
6. After all three families are solved, the shared completion dialogue appears in Practice and Story. A completed exercise remains available until Next, including after reload.
7. Compare Small and Full datasets. Ordinary output rows and rankings may differ; every authored case needed for the task is available in both.
8. Review `/module/write-multi-step-query?tab=practice` last for the three attributions and closing Glasshouse epilogue. The Data Explorer there also exposes `record_changes`.

The local story conclusion always requires its own three current-version families. Historical generic skill counts, manual mastery, and completion inferred from descendants do not unlock that conclusion. Existing curriculum prerequisite inference and persisted progress remain intact.


## Exercise coverage

Each family has its own file in `src/modules/<moduleId>/exercises/`; the module index registers exactly three.

| Module | Families | Main practice |
|---|---|---|
| `choose-columns` | `contacts`, `leave-fields`, `cities` | Projection, aliases, distinct values |
| `filter-rows` | `department-expenses`, `amounts`, `descriptions` | Equality, numeric comparisons, text/NULL filters |
| `sort-and-limit-rows` | `budgets`, `expense-pages`, `contract-endings` | Direction, ties, pagination, NULL placement |
| `process-columns` | `commissions`, `report-fields`, `price-flags` | Arithmetic/rounding, text/date functions, CASE/COALESCE |
| `write-single-criterion-query` | `salary-extract`, `leave-extract`, `travel-extract` | Projection plus one filtering criterion |
| `filter-rows-on-multiple-criteria` | `expense-periods`, `expense-ranges`, `approval-conditions` | Combined bounds, text/numeric conditions, grouped alternatives and negation |
| `write-single-table-query` | `selected-sales`, `sale-estimates`, `sale-shortlists` | Combined selection, processing, ordering and limits |
| `write-lookup-query` | `requesters`, `cost-centres`, `approvers` | IN, correlated EXISTS, scalar lookup |
| `join-tables` | `salary-comparison`, `leave-comparison`, `allocation-handoffs` | Linked comparisons and a meaningful outer join |
| `write-multi-table-query` | `asset-sales`, `universal-sales`, `client-details` | Cross-table conditions, universal conditions, buyer/account joins |
| `aggregate-columns` | `status-counts`, `quarter-totals`, `expense-statistics` | COUNT variants, grouped sums, AVG/MIN/MAX |
| `write-filtered-aggregation-query` | `category-results`, `shortfalls`, `quarter-comparisons` | WHERE versus HAVING, aggregate expressions, conditional aggregation |
| `write-multi-step-query` | `commercial-attribution`, `personnel-attribution`, `expense-attribution` | Dependent CTEs, joined evidence, repeated-case corroboration |

See the proposal for each node’s available tables and causal story chains. Runtime access is defined in `src/curriculum/database/tableIntroductions.ts`. All SQL, RA and Datalog identifiers in executable source already use the renamed IDs supplied by the designer.


## Editing content and saved parameters

- Individual tasks, answer queries, case references and payoffs: each module’s exercise files.
- Shared openings and conclusions: `src/curriculum/exercises/storyModules.ts`.
- Shared authoring/rendering behavior: `src/curriculum/exercises/defineStoryExercise.tsx`.
- Controlled staff, commercial and expense reference facts: `src/curriculum/database/storyCases.ts`.
- Overlay records, authenticated change history and completion schema: `src/curriculum/database/storyDatabaseSource.ts`.
- Baseline copies needed by the small preview: `src/curriculum/database/storyPreviewRows.json`.
- Character names and temporary portraits: `src/learning/story/characters.ts`.
- Selection and local story completion: `src/curriculum/exercises/storyProgress.ts` and navigation’s module progress hook.

Every new exercise ID has the form `story-<moduleId>-<family>` and version 1. Saved parameters contain **only `{ variant: number }`**. Problem, Prompt, Payoff, Solution and grading resolve the same source variant. No dialogue, SQL query or complete variant object is persisted in parameters.

Text corrections do not require a version bump. Preserve the meaning and ordering of existing variant indices. Reordering/removing variants or changing what an index means requires an exercise version change. If replacing an old exercise under its old ID, increment its version for incompatible parameters. These exercises use new IDs, so old saved history is retained but does not count toward the new story pass; an unregistered current exercise is automatically replaced.

The helper exposes its authoring specification as `story` for verification. This is source metadata, not saved player state. Reference facts are deliberately controlled fixtures, and verification checks them against the neutral full baseline to catch dataset drift. If moving to a changing live dataset, replace those assumptions with queries from the SQL context while retaining stable saved choices.


## Story data and attribution

The neutral `@sqlvalley/mock-data` package is unchanged. The app’s database provider uses an application-owned wrapper:

- Paris’s cases alter ordinary staff contact, salary, city and leave fields, plus one missing departmental handoff. Signed agreements, approvals and verified claims supply the independent comparisons.
- Bob’s cases lower selected recorded transaction prices and Q1 category revenues. Transaction prices and hypothetical commission calculations are never presented as actual company revenue.
- Elvis’s cases add an original and a later duplicate service request per reference. A duplicate carries a different or missing recorded approval. A department’s retained invoice supplies the reason to investigate.
- An unpriced pending transaction makes missing-price processing and COUNT differences observable.
- The small preview includes required baseline staff, contracts, allocations, departments and quarterly rows. It deliberately remains a subset of ordinary commercial activity.

The finale-only table is:

```text
record_changes(
    change_id, table_name, row_key, field_name,
    old_value, new_value, actor_e_id, changed_at,
    change_kind, source
)
```

Before/after values are text or NULL. Numeric comparisons cast them to REAL. Employee and transaction row keys are their IDs as text; contract keys use `employeeId|startDate`; quarterly keys use `fiscal_year|quarter|category`. The story establishes the export as independently retained and signed, with authenticated individual accounts. Requesters and approvers remain distinct from the actor. Legitimate unrelated edits appear in the same export.

The commercial query corroborates selected price reductions with revenue changes that reverse a category’s apparent outcome. The personnel query requires salary agreement mismatches and separate city edits by the same actor across selected staff. The expense query identifies later duplicate requests, matches insertion events, and requires the pattern across the selected invoice references. Finale variants deliberately share an anchor case and vary the additional cases to keep the evidence chain reproducible.

SQL identifies the acts and authenticated actors; motives emerge in the confrontation. **Elvis’s payment destination is independently established in the payoff through settlement confirmations**, then his admission explains his belief that the company was failing. The request table alone is never claimed to prove a transfer.

Wheatley has no tampering events or employee record. Only `client-details` retrieves personal client data. His other families supply internal records or summaries. The closing news and epilogue reveal the separate Glasshouse operation.


## Verification

Run from the repository root:

```sh
npm run verify:story-exercises
npm run type-check
npm run lint
npm run build
```

The exercise verification uses Vite’s SSR transforms and SQL.js without opening a listening server. It covers all 256 variant/dataset combinations, 128 reducer flows, and 54 broken-evidence cases. It also checks baseline reference facts, foreign keys among available tables, relevant nonempty results, required aliases, outer-join preservation, invalid variant rejection, component rendering, compact parameters, duplicate-solve handling, version filtering and unsolved-family selection. Correct results are accepted and empty or unrelated results rejected. Focused near misses also cover numeric boundaries, missing amount filters, COUNT over NULLs, reversed ordering and universal-condition counterexamples.

For browser verification, install Playwright Chromium if needed, start the Vite development server, then run:

```sh
npm exec playwright install chromium
npm run verify:story-browser
```

`SQLVALLEY_TEST_URL` can override the default `http://127.0.0.1:3000`. `PLAYWRIGHT_BROWSERS_PATH` can select an alternate browser installation directory. The browser script uses a fresh isolated context and does not alter the user’s normal browser profile.

The browser script checks all module practice pages, real editor submissions, failure and saved draft reload, three-family completion, retained solved payoff, the finale, and protection against prerequisite-inferred story conclusions.


## Remaining writing and engine boundaries

Dialogue and portraits are explicit placeholders for manual revision. The current result-based SQL grader accepts equivalent result sets; it does not enforce a particular keyword or require CTE syntax. Sort exercises explicitly grade row order and processing/alias tasks grade required headings. The prompts and model solutions carry the intended learning complexity.

The complete source fixtures are authored educational evidence, not a general audit-log ingestion or bank-reconciliation feature. Story repairs do not mutate the player’s dataset. Q2 2025 remains partial; product ownership remains current; allocations have no historical dates. Keep those limits when revising conclusions.


## Verification result

The full variant/reducer/evidence verification, TypeScript check, ESLint check, production build and browser flow verification passed during implementation. The browser pass completed 17 real submissions across all 13 modules, including all three finale families. Vite reports its existing large-chunk advisory; the build succeeds.
