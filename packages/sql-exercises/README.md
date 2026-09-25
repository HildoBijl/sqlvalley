# SQL exercises

SQL module contexts, registered input fields, and mono exercises built on @sqlvalley/sql, exercise-manager, and input-exercise-components. Generic database and editor APIs remain in [@sqlvalley/sql](../sql/README.md).


## Exercise authoring

The specification version is optional; Step-Wise defaults it to `1`. Pass a `MonoSQLExerciseDefinitionSpec` to `buildMonoSQLExercise` to build a logical solo definition using @step-wise/input-exercises. Add a `Problem` and an optional custom `Solution` component to form a `MonoSQLExerciseSpec`, then pass it to `createMonoSQLExercise` to pair that definition with the MonoExercise renderer and return an ExerciseRegistration for the exercise manager.

`createMonoSQLExercise` supplies SQL content for the generic `Problem`, `InputArea`, `InputVisualization`, and `Solution` slots. MonoExercise owns shared section styling and solution visibility. The SQL solution view reads the resolved solution from `useSolution()`, so display and insertion use the same value.

Definition specifications retain their parameter generic for generation and solution logic. Component props use the base `ExerciseParameters` type, with exercise-specific narrowing inside the component.

Exercise authors supply content components; the adapter supplies the SQL editor, preview, and available-table information. The default `SQLExerciseSolution` uses `SQLDisplay` to show the solution query; supply a custom Solution component reading `useSolution()` from `@sqlvalley/input-exercise-components`. The lowercase `solution` remains the grading query (or a parameter-dependent function); uppercase `Solution` is its presentation.

```tsx
import type { MonoSQLExerciseSpec } from '@sqlvalley/sql-exercises'

const exercise: MonoSQLExerciseSpec<Record<string, never>> = {
	exerciseId: 'employee-names',
	Problem: () => <p>List every employee's first name.</p>,
	solution: 'SELECT first_name FROM employees',
}
```

Omitting `generateParameters` uses the upstream empty-object default. Grading computes the expected output before running the submitted query and resets the grading database afterward. Preview and grading both use the first result set.

SQL specifications accept optional `skill` and `setup` metadata, forwarded to the upstream reducer for skill updates. Module exercise builders supply their skill ID.

`buildMonoSQLExercise` preserves the complete upstream input-exercise definition, including solution callbacks and `valueOperations`. These remain available on the definition paired with a renderer by `createMonoSQLExercise`.

SQL submissions use a query field containing { type: 'SQL', value: query }; drafts store the editor string under `query`. Editor values remain strings; registered input fields handle conversion through value operations. Submission normalizes the draft into typed input values. Frontend validation trims outer whitespace, runs the query on the selected user database, shows errors below the editor, and supplies transient results to the visualization. The upstream reducer converts typed input values before calling the SQL checker, which uses the interpreted `input.query` directly. Submission grading independently uses the full grading database and produces a persisted plain-data report. The upstream reducer owns attempted, solved, givenUp, and done state transitions.

The application learning-store v8 to v9 migration converts existing SQL submissions, string drafts, and give-up actions, preserving reports, draft contents, progress, and timestamps.


## Table introductions

Call `buildTablesIntroducedByModule({ moduleTree, tableIntroductions, tableKeys })` once when defining application configuration. `tableIntroductions` maps each table key to its introduction module ID or a list of alternative introduction modules. The function validates these definitions and returns a `TablesIntroducedByModule` map from module IDs to introduced table keys.

`getAvailableTableKeys({ moduleId, moduleTree, tablesIntroducedByModule })` trusts the prepared mapping and returns accessible table keys for a module and its prerequisites, without duplicates. Unknown module IDs throw errors; invalid introduction IDs, unknown table keys, and missing introduction definitions throw when building the mapping. An empty introduction list is valid and keeps that table unavailable in all modules. Valid modules with no accessible tables return `[]`. `TableIntroductions` supports application-specific table keys and module IDs; curriculum data stays in the application.


## SQL module environment

The provider, context types, and hooks live in `src/sqlModuleProvider/` and are exported from `@sqlvalley/sql-exercises`.

`SqlModuleProvider` receives `moduleId`, `moduleTree`, and `tablesIntroducedByModule` below a `DatabaseProvider`. It resolves accessible tables and acquires separate user and grading databases for each source dataset size, or one of each when the source has no selectable sizes. Cache keys identify the module and purpose, so returning to a module reuses its databases and preserves user changes. Databases remain in memory until the app-level `DatabaseProvider` unmounts or its source changes; they do not survive a page reload. The module page keys the provider subtree by module ID to reset local UI state on navigation.

Its module provider exposes `{ loading, error?, context }`. The inner `SqlModuleContext` contains `moduleId`, `tableKeys`, `getUserDatabase(size)`, and `getGradingDatabase(size)`. `loading` indicates whether any database is loading, and `error` holds the first initialization error or `undefined`. The provider always renders its children; contents can read `useModuleContext()` to display loading and error states. Exercise generation waits until loading finishes without an error. React components use `useUserModuleDatabase('small')`, which only retrieves user databases. Exercise generators and action processors can use `ensureSqlModuleContext(context).getGradingDatabase('full')` or explicitly select another size. Both return a `DatabaseHandle`. Omit the size only for sources without selectable sizes. Read-only theory components may use `useGradingModuleDatabase('small')`; interactive previews and editors must use user databases.

Dataset selection is provided by `DatabaseProvider` through `useDatasetSize()`. The application supplies its persisted preference; SQL inputs and visualizations remain independent of the store. Grading continues to use the full grading database regardless of this selection.

Each application module index exports its configured `ModuleProvider`. `SkillPage` and `ConceptPage` load this independently of exercise definitions and wrap their page content in it, keyed by module ID. The interactive practice tab reads module context and passes the resource wrapper explicitly to `ExerciseManager`. Theory and summary examples use the curriculum hook `useTheoryPageDatabase()`, which selects the small grading database. Data-explorer integration can migrate separately.


## Registered SQL input

`SqlInput` wraps `SQLEditor` and registers a named SQL field with `InputExerciseProvider`. It requires a database provider and an exercise session whose supplied context satisfies `SqlModuleContext`, supplies autocomplete, validation feedback, and submission feedback, and leaves query-result layout to the exercise. Distinct names allow multiple independent SQL fields.

```tsx
<SqlInput name="query" disabled={disabled} onSubmit={onSubmit} />
```

`useSqlQueryValidation` returns a validation function bound to the selected user database. `SqlInput` registers `normalizeInput` and `hydrateInput`: drafts retain untrimmed editor strings, while validation and submission use trimmed typed input values. Solution insertion hydrates typed values back into editor strings. Dataset changes rerun validation; obsolete runs are cancelled before executing SQL. Validation reports contain the normalized query and its preview results. The visualization checks empty small-dataset results against the full user database and displays a warning when that same query returns rows there. Comparison failures do not affect validation.

`useModuleCompletionSchema()` calls the database source's optional `buildCompletionSchema(tableKeys)` function with the module's table keys and memoizes the result. The mock-data source supplies its existing schema builder. No database loading or queries are required, and dataset size does not affect the schema. Sources without this function provide no table/column suggestions; SQL keyword completion remains available.


## Submission feedback

SQL grading stores `{ query: { correct, result } }`, where `result` contains a reason code and comparison facts such as column names, counts, or differing rows. Row samples preserve value types; feedback quotes strings and formats nulls and binary values distinctly. Messages are generated by `getSqlFeedback` when displayed, so wording changes also apply to saved reports. `SqlInput` registers this callback and renders feedback beneath its editor. Column-count feedback lists missing and extra names only when equal column names are required; otherwise it gives only the actual and expected counts. A malformed field report throws; absent field reports produce no submission feedback.

`SqlSubmissionReport` pairs a correct result with `correct: true` and comparison or execution failures with `correct: false`. Feedback rejects inconsistent reports. The feedback folder separates report checks, message selection, and value formatting; comparison-report guards belong to `@sqlvalley/sql-grading`.



## SQL values

The SQL value helpers `isSqlInputValue`, `isSqlDomainValue`, `interpretSqlInputValue`, and `toSqlInputValue` are exported individually and bundled in `sqlValueTypes` for exercise definitions. `sqlType` defines the SQL discriminator; `SqlType` is derived from it and used by `SqlInputValue`.

SQL exercise components read resources from the manager through `useExerciseContext()`. The module-page hooks continue to read `useModuleContext()` for use outside exercises. Pass the SQL module context to `ExerciseManager resources={resources}` so generation, grading, previews, and feedback share the same resources.
