# `@sqlvalley/mock-data`

This package provides the example datasets used by SQL Valley. It turns the bundled CSV files into SQL for creating and populating selected tables, and exposes the same table metadata for SQL autocompletion.


## Using the package

Add the workspace dependency to the consuming package:

```json
{
	"dependencies": {
		"@sqlvalley/mock-data": "*"
	}
}
```

Install workspace dependencies from the repository root after changing a `package.json` file.

### Creating a dataset

Use `buildDatasetSql` to produce the `CREATE TABLE` and `INSERT` statements for one or more tables:

```ts
import { buildDatasetSql } from '@sqlvalley/mock-data'

const sql = buildDatasetSql({
	tables: ['departments', 'employees'],
	size: 'small',
})

database.run(sql)
```

The `size` can be `small` or `full` and defaults to `small`. The small datasets are useful for introductory exercises and readable examples; the full datasets provide more realistic query results.

Available tables can be discovered through `allTableKeys`:

```ts
import { allTableKeys, buildDatasetSql } from '@sqlvalley/mock-data'

const sql = buildDatasetSql({ tables: allTableKeys, size: 'full' })
```

An unknown table or dataset size causes an error. Repeated definitions with the same database table name are included only once.

### Building an autocompletion schema

Use `buildCompletionSchema` to obtain the columns belonging to selected tables:

```ts
import { buildCompletionSchema } from '@sqlvalley/mock-data'

const schema = buildCompletionSchema(['departments', 'employees'])
// {
//   departments: ['id', 'name'],
//   employees: ['id', 'first_name', ...],
// }
```

This schema can be passed to an SQL editor or another completion provider.

### Public API

- `buildDatasetSql({ tables, size? })` builds the SQL needed to create and populate a dataset.
- `buildCompletionSchema(tables)` builds a table-to-column mapping.
- `allTableKeys` contains every available table key.
- `defaultDatasetSize` is the default size used by SQL Valley.
- `TableKey` is the union of valid table keys.
- `DatasetSize` is the union of valid dataset sizes.

CSV parsing, value conversion, table definitions, and the table registry are implementation details and are not exported from the package root.


## Adjusting the tables

Each table has its own folder under [`tables/`](./tables/). A table folder contains:

- `index.ts`, which defines the columns and SQL table structure.
- `<tableName>Small.csv`, containing the smaller dataset.
- `<tableName>Full.csv`, containing the full dataset.

Keep the descriptive table name in both CSV filenames so that similarly sized files remain distinguishable in an editor.

### Changing table data

Edit the small and full CSV files directly. Both files must have headers that exactly match the keys and casing of the `columns` object in the table's `index.ts` file.

The CSV parser is intentionally strict:

- Headers must be present, non-empty, and unique.
- Every record must contain exactly as many cells as the header.
- Quotes are only allowed around complete cells; quotes inside a quoted cell must be escaped as `""`.
- Unexpected or missing columns cause an error.
- Empty cells become `null`.
- Boolean cells accept `true` or `false`, ignoring casing and surrounding whitespace.
- Number cells must contain a finite numeric value.
- String and date cells are trimmed. Dates are currently stored as strings and are not format-validated.

### Changing a table definition

A table definition follows this pattern:

```ts
import type { TableDefinition } from '../types'

import fullCsv from './departmentsFull.csv?raw'
import smallCsv from './departmentsSmall.csv?raw'

const columns = {
	id: 'number',
	name: 'string',
} as const

const table: TableDefinition = {
	name: 'departments',
	columns,
	createTableSql: `
		CREATE TABLE departments (
			id INTEGER PRIMARY KEY,
			name TEXT NOT NULL
		)
	`,
	csvBySize: {
		full: fullCsv,
		small: smallCsv,
	},
}

export default table
```

The order of keys in `columns` determines the order used by generated `INSERT` statements. Keep it aligned with the intended database-column order.

When adding or removing a column, update all three sources together:

1. The `columns` object.
2. The `CREATE TABLE` statement.
3. Both CSV headers and their records.

### Adding a table

To add a new table:

1. Create a folder under [`tables/`](./tables/) with an `index.ts`, a small CSV, and a full CSV.
2. Default-export a `TableDefinition` named `table` from its `index.ts`.
3. Import that definition in [`tables/registry.ts`](./tables/registry.ts).
4. Add it to `tableRegistry` under the key other packages should use.


## Internal structure

The folders follow a one-way dependency structure:

```text
parseCsv -> tables -> buildSql -> public package API
```

- [`parseCsv/`](./parseCsv/) parses CSV input and converts cell values.
- [`tables/`](./tables/) defines and registers the available datasets without parsing their CSV data.
- [`buildSql/`](./buildSql/) parses requested datasets and generates SQL and completion metadata. Generated table SQL is cached by table definition and dataset size.
