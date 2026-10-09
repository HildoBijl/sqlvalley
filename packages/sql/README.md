# SQL tools

This package has three components: `sqlEditor` for editing and displaying SQL, `dataTable` for displaying results, and `databaseProvider` for managing databases. Their public APIs are exported from `@sqlvalley/sql`.


## sqlEditor

`SQLEditor` is a controlled editor with SQL highlighting and autocomplete. Supply `value` and `onChange`; optionally supply `completionSchema` (table names mapped to column names). `onExecute` handles Ctrl+Enter or Cmd+Enter. The consumer decides how and when to execute queries.

`SQLDisplay` displays read-only SQL, and `ISQL` displays it inline.

```tsx
import { SQLEditor, SQLDisplay, ISQL } from '@sqlvalley/sql'

<SQLEditor value={query} onChange={setQuery} onExecute={runQuery} />
<SQLDisplay>{'SELECT * FROM employees'}</SQLDisplay>
<ISQL>SELECT</ISQL>
```


## dataTable

`DataTable` accepts `TableData`: `{ columns, values }` with readonly column names and rows of `unknown` cells. SQL.js query results fit directly. Cells format nulls, booleans, and numbers, while other text wraps when necessary to keep the full value visible.

Pagination is enabled by default, with a maximum of 100 displayed rows. Use `maxRows`, `showPagination`, `compact`, and `highlightHeader` to adjust the display. Set `maxRows={Infinity}` to allow all rows. Both paginated and unpaginated tables grow with their contents and scroll horizontally when necessary.

The shared MUI DataGrid renderer preserves query order by default. Set `controls` to enable sorting, filtering, and per-column menus, as used in Data Explorer. It does not display a toolbar or column-hiding controls.

Tables fill their container by default. Supply `width` to set an explicit width, using a number in pixels (for example, `width={800}`) or a CSS width string. This also applies to the no-data placeholder.

```tsx
import { DataTable } from '@sqlvalley/sql'

<DataTable data={result} compact />
<DataTable data={result} maxRows={Infinity} controls />
<DataTable data={{ columns: ['name'], values: [['Alice'], ['Bob']] }} showPagination={false} />
```


## databaseProvider

Place `DatabaseProvider` inside `SQLJSProvider` and pass a stable `source` containing `tableKeys`, `buildSql({ tables, size })`, and optionally `datasetSizes` and `buildCompletionSchema(tableKeys)`. The application supplies the data source.

```tsx
import { SQLJSProvider } from '@sqlvalley/sqljs'
import { DatabaseProvider } from '@sqlvalley/sql'

<SQLJSProvider>
	<DatabaseProvider source={source}>
		<Application />
	</DatabaseProvider>
</SQLJSProvider>
```

Within the provider, acquire a database and query it:

```tsx
import { useDatabase, useDatasetSize, useQuery } from '@sqlvalley/sql'

const [size, setSize] = useDatasetSize()
const handle = useDatabase({ tables: ['employees'], size })
const { results, loading, error } = useQuery(handle, 'SELECT * FROM employees')
```

A handle exposes `database`, `loading`, `error`, and `reset()`. Omit `tables` to load all tables. Specify `size` when the source declares dataset sizes, and omit it otherwise. `useDatabases({ tables, sizes })` returns handles for several sizes; omitting `sizes` selects all declared sizes.

Without a `key`, databases close when their consumer unmounts. An optional `key` shares and retains matching databases until the provider unmounts or its source changes; this does not persist across page reloads.

`useQuery` reruns when its database or query changes; an undefined query skips execution. `useQueryResult` returns only the first result. For explicit execution, call the exported `executeQuery(handle.database, query)` once available. It executes all statements and preserves column metadata for empty result sets, unlike SQL.js `exec()`. Mutations do not automatically refresh other queries.

Dataset selection uses local state by default, starting at `defaultDatasetSize` or the first source size. Supply `datasetSizeHandle={[datasetSize, setDatasetSize]}` to `DatabaseProvider` to control it externally, for example through an application store. Its setter must support both values and functional updates, like a React state setter. The provider uses `useControllableState`; controlled/uncontrolled mode must stay fixed while mounted. Dataset sizes are validated before being exposed or updated, and `defaultDatasetSize` is only supported in uncontrolled mode.
