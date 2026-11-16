# SQL exercise review guide

The 39 procedural exercise families and their 128 variants remain under `src/modules/<moduleId>/exercises/`. Each is a standalone `defineSQLMonoExercise` specification using the existing engine. The shared custom authoring helper, selection/completion policy and custom presentation components have been removed.


## Review

Run `npm run dev`, enable Admin Mode and Story Mode using the existing settings, then open a skill’s Practice tab. Use the existing exercise selector, solution insertion and regeneration controls to inspect each family. Module-level dialogue lives in the existing Story tab through Conversation; exercise dialogue uses SpeechBox. Purpose and Goal text remains temporary writing guidance.

The original engine controls selection and completion. It can repeat families and infer prerequisite completion. The cleanup deliberately adds no alternative completion policy or automatic story sequence.


## Editing

Each exercise file contains its variants, model queries, explanatory text and dialogue. Saved parameters contain only `{ variant: number }`. IDs, variant order and meaning remain unchanged from the committed implementation, so version 1 remains compatible. Future incompatible changes to those parameters or index meanings require an exercise version bump; wording corrections alone do not.

Module dialogue is in each module’s Story.tsx. Original introduction dialogue is preserved in Choose Columns and Filter Rows. Existing cast names and placeholder portraits are registered in `src/learning/story/characters.ts`.


## Retained story data

The user approved keeping the authored records and finale table. `src/curriculum/database/storyCases.ts`, `storyDatabaseSource.ts` and `storyPreviewRows.json` provide those records through the existing DatabaseSource API. App provider wiring and the minimal Data Explorer/table-introduction integration remain necessary to expose the approved data. The neutral mock-data package is unchanged.

`record_changes` is introduced only at Write Multi-Step Query. Its signed, independently retained events attribute changes to authenticated individual accounts. The finale queries corroborate multiple current business discrepancies before resolving the actor. Payment destinations are independently confirmed in Elvis’s payoff; the expense table itself records requests rather than bank transfers.


## Checks

Use the repository’s existing commands:

```sh
npm run type-check
npm run lint:strict
npm run build
```

The added story-verification scripts and npm commands have been removed. Temporary verification used during cleanup checks all 256 variant/dataset combinations, 128 reducer flows and exact preservation of the authored exercise IDs and solution queries.
