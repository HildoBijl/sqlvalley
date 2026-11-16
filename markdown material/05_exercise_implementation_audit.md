# Exercise implementation audit

The original implementation added custom authoring, selection, completion and story-presentation code. The user requested removing those additions while retaining the exercises, authored story records and finale table.


## Revised implementation

- All 39 exercise families use the existing `defineSQLMonoExercise` API directly, with the existing Problem, Prompt, Payoff and Solution components.
- The original exercise IDs, variant order, model queries and version 1 are preserved. Parameters still contain only a numeric variant index, so existing saved instances retain their meaning.
- Supporting context appears as ordinary exercise text and character speech. The added “Case reference” label and custom dialogue component are removed.
- The original engine selection, progress calculation, navigation and Story-tab presentation are restored. No separate distinct-family story completion is enforced.
- Original introduction dialogue in Choose Columns and Filter Rows is preserved alongside the authored module story content, using the existing Conversation component.
- The approved story records and finale-only `record_changes` table remain integrated through the existing DatabaseSource and table-introduction APIs. Required cast registry entries remain content data, using existing portraits.
- The custom exercise authoring/progress folder and the two added verification scripts/npm commands are removed.


## Retained evidence constraints

The neutral mock-data package remains unchanged. The application-owned story data supplies the authored staff, commercial and expense discrepancies in both dataset sizes. The finale combines matching authenticated change events with business discrepancies. Elvis’s expense records establish duplicate requests and their insertion actor; independent settlement confirmations in the payoff establish payments to his controlled supplier account. His admission establishes his motivation.


## Verification

Temporary verification outside the repository compares every retained exercise ID and variant solution with the committed implementation, executes all 256 variant/dataset combinations and checks 128 correct/incorrect reducer flows through the existing engine. Type checking, strict linting and production bundling are checked before committing the cleanup. No new verification framework is retained in the project.
