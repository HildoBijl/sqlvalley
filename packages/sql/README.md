# SQL learning components

SQL module context, editors, results, and solo mono exercise integration.


## Exercise authoring

The specification version is optional; Step-Wise defaults it to `1`. Pass a MonoSQLExerciseSpec to buildMonoSQLExercise to build a logical solo definition using @step-wise/input-exercises. Pass the specification to createMonoSQLExercise to pair that definition with the MonoExercise renderer and return an ExerciseRegistration for the exercise manager.

SQL submissions and saved drafts use a query field containing { type: 'SQL', value: query }. Editor values remain strings and are converted at the renderer boundary. SQL validation and grading produce persisted feedback reports. The upstream reducer owns attempted, solved, givenUp, and done state transitions.

The application learning-store v8 to v9 migration converts existing SQL submissions, string drafts, and give-up actions, preserving reports, draft contents, progress, and timestamps.


## Database provider

Import `DatabaseProvider`, `DatabaseSource`, and database hooks from `@sqlvalley/sql/databaseProvider`. Supply a stable `source` object with `allTables`, `defaultSize`, `buildSql({ tables, size })`, and `buildCompletionSchema(tables)`. Table identifiers and size names are strings interpreted and validated by the source.

The application imports `databaseSource` from `@sqlvalley/mock-data` and passes it to `<DatabaseProvider source={databaseSource}>`. Compatibility is checked structurally; mock-data does not depend on the provider package. SQL and completion schemas are built on demand; the provider folder does not import mock-data. Other SQL components still use mock-data types, so the SQL package retains that dependency.

`useDatabase` uses the source defaults when tables or size are omitted. The existing `usePlaygroundDatabase` and `useTheorySampleDatabase` convenience hooks request `full` and `small` respectively; a source used with these hooks must support those size names.
