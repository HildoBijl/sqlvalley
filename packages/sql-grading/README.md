# SQL grading

Compares SQL query results and returns structured reports. This package does not execute SQL or generate feedback messages.


## Usage

```ts
import { compareQueryResults } from '@sqlvalley/sql-grading'

const comparison = compareQueryResults(input, expected, {
	requireEqualColumnNames: true,
	requireEqualRowOrder: true,
})

if (!comparison.correct) {
	console.log(comparison.report.reason)
}
```

Inputs have the shape `{ columns, values }`; SQL.js results can be passed directly. Two absent results (`undefined`) are considered equal. If only one is absent, the comparison reports that mismatch. Results with zero rows still have their columns compared.


## Comparison options

All options default to `false`:

- `requireEqualColumnNames`: require matching names.
- `requireEqualColumnOrder`: require matching column positions.
- `requireEqualRowOrder`: require matching row positions.
- `caseSensitiveColumnNames`: compare column names case-sensitively.
- `caseSensitiveValues`: compare string values case-sensitively.

When names are ignored, columns are matched by content. Duplicate rows and columns retain their multiplicity. Values are compared without type coercion; binary values are compared byte by byte.


## Reports

`ComparisonResult` pairs `correct: true` with a `correct` report, or `correct: false` with a `ComparisonMismatchReport`. Checks report the first mismatch: column count, row count, columns, then rows. Column-count reports include missing and extra names together only when names are required.

Row reports include the mismatch count and up to three sample input rows. Sample values retain strings, finite numbers, booleans, and nulls. Binary values use `{ type: 'binary', value: number[] }`; non-finite numbers and undefined use explicit tags. These representations survive JSON storage without losing their types. Unsupported objects in sample values throw an error.

Consumers generate messages from these facts. Public exports include `compareQueryResults` and its input, option, result, and report types; comparison helpers remain internal.
