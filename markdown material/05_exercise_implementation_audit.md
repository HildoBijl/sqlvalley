# Exercise implementation audit

**Status:** Implementation completed for all 39 procedural families across 13 SQL skill nodes, including the finale. The user resolved the two material decisions below. See [the review guide](./06_exercise_review_guide.md) for implementation paths and verification commands.


## Accepted decisions

### Finale scope and attribution

The user approved implementing the finale, with prompts and answers appropriate to `write-multi-step-query`. A story-only `record_changes` table is introduced there. Its independent, signed source records authenticated individual actors, affected row keys, fields and before/after values. Legitimate unrelated events accompany the relevant changes. The three finale queries combine repeated business discrepancies with authenticated events, using dependent CTEs, joins, grouped conditions and existence checks. A work-presence table is unnecessary and would not establish edit attribution.

### Elvis’s misconduct

The user clarified that Elvis’s aim is to siphon funds from a company he believes is failing and authorized choosing the mechanism. The implementation uses duplicate service-expense requests, with different or missing approvals, followed by payments to a supplier account he controls. SQL traces the later duplicated requests and their insertion actor. Independent settlement confirmations introduced explicitly in the payoff establish the payment destination; his admission establishes his motive. The expenses table is not represented as a bank-transfer ledger.



## Quality issues addressed in the proposal

- **Distinct cities did not reliably prove a location discrepancy.** Another employee could legitimately share a city, and absence from the small preview does not establish absence from full data. The direction now makes the suspicious recorded city visible and compares it to an explicitly supplied independent claim or address.
- **Lookup coverage could collapse into three membership queries.** The model-query directions now distinguish `IN`, correlated `EXISTS`, and a scalar lookup guaranteed by a unique expense key. The result grader will continue accepting equivalent SQL.
- **The multi-table families did not explicitly cover universal conditions.** One direction now asks for assets whose relevant transactions all meet a condition. It requires at least one relevant transaction and excludes counterexamples, avoiding accidental qualification of assets with no relevant activity.
- **The outer join could be technically correct but pedagogically empty.** Its direction now requires both a matching relationship and a genuinely unmatched employee/allocation relationship, with valid remaining foreign keys.
- **Conditional processing omitted a useful null case.** The direction now includes a meaningful fallback variant when a missing source value is deliberately present.

These remain general directions. The audit does not fix target identities, amounts, thresholds or exact exercise SQL.


## Implementation requirements and resolutions

### Story fixtures and independent references

The baseline is not an authored set of tampering cases. Create a small, documented, application-owned fixture layer for the approved story cases while preserving the neutral mock-data package. Apply consistent cases to user previews and grading data, including all necessary related records. The small preview currently has only a small subset of employees and leave states, so arbitrary selection from it will not support the proposed leave and handoff cases.

For each case, define the original value, visible altered value, affected ordinary staff or business record, downstream consequence and independent reference. The placeholder request should supply enough legitimate context to justify the query; its payoff must stay within what the query and reference establish. Do not expose the author-only culprit attribution before the final node.

The same case registry should drive generation, query parameters and dialogue. Predefined variants and editable wording belong in source; persisted parameters should contain stable choices, identifiers and necessary data values. Validate any reused exercise ID with a version change when its parameters or interpretation changes.

### Progress, selection and story completion

The original selector could repeat a family before all three had been solved. The story selector now prioritizes unsolved current-version families, returning to repeat practice after completion. The learning store increments a solved counter; the progress package treats the threshold as completion and also includes prerequisites when a later skill is completed. Therefore ordinary curriculum completion cannot serve as evidence that the player has seen and solved the local story cases.

Provide a local story-completion rule based on successfully solved required families, with an explicit compatibility rule for exercise versions. Giving up, inserting a solution or generating a new variant must not count as solving a missing family. Prefer unsolved families during the story pass, permit normal repeatable practice afterwards, and gate each module's story conclusion on its own cases. Preserve established curriculum prerequisite inference rather than using it to reveal unseen local story conclusions. Existing saved progress needs a defined migration or compatibility treatment.

The original story opening/conclusion rendered only in the Story section. Shared openings and gated conclusions now also surround the practice sequence when story mode is enabled. Ensure the shared opening is accessible before the story pass and the conclusion is clearly revealed after the local requirements are met. Do not silently assume an automatic conversation sequence already exists.

### Placeholder dialogue

Every shared opening, individual prompt/payoff and shared conclusion should have a visible, concise **Purpose** and **Goal**, followed by editable temporary character lines. Those visible notes must be safe for the current point in the story. Author-only information such as which insider planted a row belongs in private source metadata or comments; a placeholder label must not reveal a culprit prematurely.

References should flow from the operational complaint to the investigation. Paris handles complaints from processes she coordinates; departments and staff naturally bring Finance issues to Caesar; Wheatley privately requests information without being linked to the insiders' edits. Caesar's changing attitude must depend on evidence available along the relevant curriculum path.

### Procedural and grading requirements

Choose bounded, meaningful cases and parameter ranges with guaranteed relevant results. A generated variant must agree with its prompt, model query and payoff, and remain stable on reload. Do not choose arbitrary thresholds that remove all evidence or produce only trivial answers.

Sorting tasks need an explicit total order when tied values or pagination matter. Alias tasks need matching column-name grading. Identify null behavior, duplicate multiplicities and completed-versus-attempted transactions explicitly. The grader checks results, not use of a particular keyword. Preview data can differ in ordinary rows, but all dialogue-critical facts must hold for the selected case in both dataset sizes, or the presentation must clearly direct the learner to the relevant size.


## Acceptance checks for the working set

- Build each module using only its available tables and prerequisite SQL skills; keep the three-family allocation and Wheatley's scattered appearances.
- Execute every finite variant and the important boundaries of numeric ranges in SQL.js against both small and full story datasets. Check relevant case rows and expected conclusions, not merely whether queries execute.
- Verify reference answers pass grading and representative near-miss answers fail for missing filters, wrong grouping, dropped unmatched rows, incorrect null treatment, duplicate handling and unstable ordering.
- Verify the final case queries return the responsible insider only when the complete evidence conditions are satisfied; removing a required link must not leave an accidental answer.
- Exercise solve, fail, give-up, reload, next exercise, repeat practice, version replacement and admin regeneration. Ensure each story conclusion requires its own successfully solved families and that a later completed skill does not expose it accidentally.
- Run repository type checking, linting, an end-of-sequence production build and appropriate browser verification. Document manual paths and the remaining writing placeholders for review.

The implementation verification script executes every variant on both dataset sizes, renders all variant-dependent components, checks correct and incorrect grading, exercises failure/solve/give-up reducer flows, validates numeric-only persisted parameters and current-version family completion, and breaks required finale evidence links to check that attribution disappears. Repository and browser checks are recorded in the review guide.
