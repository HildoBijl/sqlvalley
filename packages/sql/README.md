# SQL learning components

SQL module context, editors, results, and solo mono exercise integration.


## Exercise authoring

The specification version is optional; Step-Wise defaults it to `1`. Pass a `MonoSQLExerciseDefinitionSpec` to `buildMonoSQLExercise` to build a logical solo definition using @step-wise/input-exercises. Add `Problem` and `Solution` components to form a `MonoSQLExerciseSpec`, then pass it to `createMonoSQLExercise` to pair that definition with the MonoExercise renderer and return an ExerciseRegistration for the exercise manager.

`createMonoSQLExercise` supplies SQL content for the generic `Problem`, `InputArea`, `InputVisualization`, and `Solution` slots. MonoExercise owns shared section styling and solution visibility. The SQL solution view reads the resolved solution from `useSolution()`, so display and insertion use the same value.

Exercise authors supply content components; the adapter supplies the SQL editor, preview, and available-table information. Use the exported `SQLExerciseSolution` for the standard query display, or supply a custom Solution component reading `useSolution()` from `@sqlvalley/input-exercise-components`. The lowercase `solution` remains the grading query (or a parameter-dependent function); uppercase `Solution` is its presentation.

```tsx
import { type MonoSQLExerciseSpec, SQLExerciseSolution } from '@sqlvalley/sql'

const exercise: MonoSQLExerciseSpec<Record<string, never>> = {
	exerciseId: 'employee-names',
	generateParameters: () => ({}),
	Problem: () => <p>List every employee's first name.</p>,
	Solution: SQLExerciseSolution,
	solution: 'SELECT first_name FROM employees',
}
```

SQL specifications accept optional `skill` and `setup` metadata, forwarded to the upstream reducer for skill updates. Module exercise builders supply their skill ID.

`buildMonoSQLExercise` preserves the complete upstream input-exercise definition, including solution callbacks and `valueOperations`. These remain available on the definition paired with a renderer by `createMonoSQLExercise`.

SQL submissions and saved drafts use a query field containing { type: 'SQL', value: query }. Editor values remain strings and are converted at the renderer boundary. SQL validation and grading produce persisted feedback reports. The upstream reducer owns attempted, solved, givenUp, and done state transitions.

The application learning-store v8 to v9 migration converts existing SQL submissions, string drafts, and give-up actions, preserving reports, draft contents, progress, and timestamps.


## Module table access

Call `buildModuleAccess({ moduleTree, tableIntroductions, tableKeys })` once when defining application configuration. `tableIntroductions` maps each table key to its introduction module ID or a list of alternative introduction modules. The function validates these definitions and returns a `ModuleAccess` map from module IDs to introduced table keys.

`getModuleTableKeys({ moduleId, moduleTree, moduleAccess })` trusts the prepared mapping and returns accessible table keys for a module and its prerequisites, without duplicates. Unknown module IDs throw errors; invalid introduction IDs and missing access definitions throw when building the mapping. Valid modules with no accessible tables return `[]`. `TableIntroductions` supports application-specific table keys and module IDs; curriculum data stays in the application.


## SQL module environment

The provider, context types, and hooks live in `src/sqlModuleProvider/` and are exported from `@sqlvalley/sql`.

`SqlModuleProvider` receives `moduleId`, `moduleTree`, and `moduleAccess` below a `DatabaseProvider`. It resolves accessible tables and acquires separate user and grading databases for each source dataset size, or one of each when the source has no selectable sizes. Cache keys identify the module and purpose, so returning to a module reuses its databases and preserves user changes. Databases remain in memory until the app-level `DatabaseProvider` unmounts or its source changes; they do not survive a page reload. The module page keys the provider subtree by module ID to reset local UI state on navigation.

Its general module-context value contains `moduleId`, `tableKeys`, `loading`, `error`, `getUserDatabase(size)`, and `getGradingDatabase(size)`. `loading` indicates whether any database is loading, and `error` holds the first initialization error or `undefined`. The provider always renders its children; contents can read `useSqlModuleContext()` to display loading and error states. Exercise generation waits until loading finishes without an error. React components use `useUserModuleDatabase('small')`, which only retrieves user databases. Exercise generators and action processors can use `ensureSqlModuleContext(context).getGradingDatabase('full')` or explicitly select another size. Both return a `DatabaseHandle`. Omit the size only for sources without selectable sizes. Read-only theory components may use `useGradingModuleDatabase('small')`; interactive previews and editors must use user databases.

`SqlPracticeProvider` belongs inside the module provider and receives `datasetSize`, `setDatasetSize`, and `completionSchema` from the application. It owns live-query previews and small-dataset warnings. Previews use user databases exclusively. Grading uses the full grading database independently of the selected preview size and resets it after each grading attempt, including failures. User databases are unaffected by this reset. Query errors are reported by the exercise checker. Practice settings and query results are not part of the module context.

Each application module index exports its configured `ModuleProvider`. `SkillPage` and `ConceptPage` load this independently of exercise definitions and wrap their page content in it, keyed by module ID. The practice provider remains inside the interactive practice tab. Theory and summary examples use the curriculum hook `useTheoryPageDatabase()`, which selects the small grading database. Data-explorer integration can migrate separately.


## Database provider

`DatabaseContext` and `useDatabaseContext()` are exported through the database-provider barrel. The hook requires an enclosing `DatabaseProvider` and exposes its source, cache, and initialization error.

Import the provider and hooks from `@sqlvalley/sql/databaseProvider`. Place `DatabaseProvider` inside a `SQLJSProvider` and supply a stable `source` with `tableKeys`, optional `datasetSizes`, and `buildSql({ tables, size })`. The source validates table identifiers; the provider validates sizes and does not depend on mock-data.

```tsx
const handle = useDatabase({ tables: ['employees'], size: 'small' })
const { results, loading, error } = useQuery(handle, 'SELECT * FROM employees')
```

`useDatabase({ key?, tables?, size? })` returns a `DatabaseHandle` containing `database`, `loading`, `error`, and `reset()`. Missing tables loads all keys listed in `source.tableKeys`; `tables: []` creates an empty database. Loading ends on success or failure, and unavailable values are `undefined`.

`useDatabases({ key?, tables?, sizes? })` returns a read-only map of size names to `DatabaseHandle`. Omit `sizes` to select all source dataset sizes, or supply a nonempty subset such as `sizes: ['small']`. Unknown sizes produce errors on their handles. The hook throws if the source has no selectable sizes or declares an empty size list; use `useDatabase()` for a source without selectable sizes. Without a key, these databases close on unmount or configuration changes. With a key, callers share retained databases by group key and size, including overlapping subsets. Group keys have a separate namespace from `useDatabase` keys, so the same string can safely identify both. Conflicting table selections return errors on the affected handles. `SqlModuleProvider` uses separate persistent keys for user and grading databases per module and shares its handles through module context.

If the source provides `datasetSizes`, the list must be nonempty and every request must specify one of those sizes, even for a single-entry list. Without `datasetSizes`, requests must omit `size`, and `buildSql` receives `size: undefined`. There is no default size. These rules are enforced at runtime and validation failures appear in the handle's `error` before SQL is built. The mock-data source provides its existing `datasetSizes` list.

Without a key, each hook owns a database that closes on unmount or configuration change. With a key, matching callers share a database retained until the provider unmounts. Reusing a key with different tables or size returns an error. Persistence is in memory, across navigation, not across page reloads. Replacing the source also closes its databases.

`reset()` recreates the initial data from the cached SQL and updates all callers sharing that database. If SQL generation failed, reset retries it; once generation succeeds, the SQL is reused. Failed database initialization can also be retried. Do not close a managed database yourself.

`useQuery(handle, query)` runs when the database or query changes and returns `{ results, loading, error }`. Pass `undefined` as the query to skip execution. `useQueryResults` and `useQueryResult` return only the results or first result.

For event handlers, `useQueryExecution(handle)` provides `{ execute, clear, results, error }`; `execute(query)` returns a promise and rejects on SQL errors. SQL.js execution itself is synchronous. Query results belong to the calling component and clear when its database changes. Direct `handle.database.exec(query)` is also available once loading completes. Mutations do not automatically refresh other queries.

SQL editors obtain completion schemas separately from their dataset, for example through mock-data's `buildCompletionSchema`.
