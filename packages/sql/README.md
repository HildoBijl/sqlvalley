# SQL learning components

SQL module context, editors, results, and solo mono exercise integration.


## Exercise authoring

The specification version is optional; Step-Wise defaults it to `1`. Pass a MonoSQLExerciseSpec to buildMonoSQLExercise to build a logical solo definition using @step-wise/input-exercises. Pass the specification to createMonoSQLExercise to pair that definition with the MonoExercise renderer and return an ExerciseRegistration for the exercise manager.

SQL submissions and saved drafts use a query field containing { type: 'SQL', value: query }. Editor values remain strings and are converted at the renderer boundary. SQL validation and grading produce persisted feedback reports. The upstream reducer owns attempted, solved, givenUp, and done state transitions.

The application learning-store v8 to v9 migration converts existing SQL submissions, string drafts, and give-up actions, preserving reports, draft contents, progress, and timestamps.


## Module table access

`getModuleTableKeys({ moduleId, moduleTree, moduleAccess, tableKeys })` returns the accessible table keys for a module and its prerequisites, without duplicates. `moduleAccess` maps each table key to its introduction module ID or a list of alternative introduction modules. `tableKeys` specifies which tables to resolve.

Unknown module IDs, invalid introduction IDs, and missing access definitions throw errors. Valid modules with no accessible tables return `[]`. The `ModuleAccess` type supports application-specific table keys and module IDs; curriculum data stays in the application.


## Database provider

Import the provider and hooks from `@sqlvalley/sql/databaseProvider`. Place `DatabaseProvider` inside a `SQLJSProvider` and supply a stable `source` with `tableKeys`, optional `sizes`, and `buildSql({ tables, size })`. The source validates table identifiers; the provider validates sizes and does not depend on mock-data.

```tsx
const handle = useDatabase({ tables: ['employees'], size: 'small' })
const { results, loading, error } = useQuery(handle, 'SELECT * FROM employees')
```

`useDatabase({ key?, tables?, size? })` returns a `DatabaseHandle` containing `database`, `loading`, `error`, and `reset()`. Missing tables loads all keys listed in `source.tableKeys`; `tables: []` creates an empty database. Loading ends on success or failure, and unavailable values are `undefined`.

If the source provides `sizes`, the list must be nonempty and every request must specify one of those sizes, even for a single-entry list. Without `sizes`, requests must omit `size`, and `buildSql` receives `size: undefined`. There is no default size. These rules are enforced at runtime and validation failures appear in the handle's `error` before SQL is built. The mock-data source provides its existing `datasetSizes` list.

Without a key, each hook owns a database that closes on unmount or configuration change. With a key, matching callers share a database retained until the provider unmounts. Reusing a key with different tables or size returns an error. Persistence is in memory, across navigation, not across page reloads. Replacing the source also closes its databases.

`reset()` recreates the initial data from the cached SQL and updates all callers sharing that database. If SQL generation failed, reset retries it; once generation succeeds, the SQL is reused. Failed database initialization can also be retried. Do not close a managed database yourself.

`useQuery(handle, query)` runs when the database or query changes and returns `{ results, loading, error }`. Pass `undefined` as the query to skip execution. `useQueryResults` and `useQueryResult` return only the results or first result.

For event handlers, `useQueryExecution(handle)` provides `{ execute, clear, results, error }`; `execute(query)` returns a promise and rejects on SQL errors. SQL.js execution itself is synchronous. Query results belong to the calling component and clear when its database changes. Direct `handle.database.exec(query)` is also available once loading completes. Mutations do not automatically refresh other queries.

`useTheorySampleDatabase()` creates a temporary database of size `small`; its source must support that size name. SQL editors obtain completion schemas separately from their dataset, for example through mock-data's `buildCompletionSchema`.
