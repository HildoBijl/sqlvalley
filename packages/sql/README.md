# SQL tools

Generic SQL editors, tables, and database management. Exercise integration lives in [@sqlvalley/sql-exercises](../sql-exercises/README.md).


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

For event handlers, call `handle.database.exec(query)` once the database is available. Execution is synchronous; keep results and errors in component state and discard them when the database changes. Mutations do not automatically refresh other queries.

SQL editors obtain completion schemas separately from their dataset, for example through mock-data's `buildCompletionSchema`.


## Dataset selection

`DatabaseProvider` accepts `datasetSize` and `setDatasetSize` for controlled selection. The provider infers the size and setter types from `source.datasetSizes`, so a setter accepting only those sizes can be passed directly. Keep the source's literal size types (for example, using `as const`) to retain this inference. Changes are still validated at runtime. The setter determines controlled mode; callers must supply a valid size for sources with configured sizes, handling any loading/default value themselves.

Without those props, selection is local state initialized from `defaultDatasetSize` or the first source size. `defaultDatasetSize` is only supported in uncontrolled mode and is only read on mount. Sources without selectable sizes use `undefined`. Invalid selections throw; changing selection does not clear cached databases.

```tsx
<DatabaseProvider source={source} datasetSize={size} setDatasetSize={setSize}>
	{children}
</DatabaseProvider>

<DatabaseProvider source={source} defaultDatasetSize="small">
	{children}
</DatabaseProvider>
```

`useDatasetSize()` returns `[datasetSize, setDatasetSize]`, following the `useState` convention. Pass the size to `useDatabase`; use a different persistent key per size when retaining multiple datasets.
