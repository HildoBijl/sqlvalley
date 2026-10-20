# SQL Valley packages

This folder contains app-independent tools shared by SQL Valley. Packages may understand their own domain, but they must not import application code from `src`.

The packages are roughly ordered from foundational tools to application-facing combinations. First there are educational tools:

- [exercise-instances](./exercise-instances/README.md): generation, selection, restoration, and history types for exercise instances.
- [progress](./progress/README.md): module completion, readiness, planning, and next-module logic.
- [exercise-manager](./exercise-manager/README.md): exercise-session state and registration management.
- [input-exercise-components](./input-exercise-components/README.md): reusable React components for input-based exercises.
- [skill-tree](./skill-tree/README.md): positioning and interactive visualization of module trees.

And then there are SQL-related tools:

- [mock-data](./mock-data/): typed mock datasets and table definitions.
- [sqljs](./sqljs/README.md): the prebuilt SQL.js runtime and embedded WASM binary.
- [sql-grading](./sql-grading/README.md): language-independent comparison of SQL query results.
- [sql](./sql/README.md): SQL editors, result tables, and database providers.
- [sql-exercises](./sql-exercises/README.md): SQL-specific exercise fields, validation, feedback, and assembled exercises.


## Package rules

- Declare cross-package imports as workspace dependencies in the consuming `package.json`.
- Keep dependencies one-way: foundational packages must not import the higher-level packages built on top of them.
- Treat each package's root `index.ts` as its public API. Keep implementation details private unless another package genuinely needs them.
- Import packages by their `@sqlvalley/*` name rather than through relative filesystem paths.
- Put SQL Valley-specific curriculum, storage, styling, and page composition in [`src`](../src/README.md), not in these packages.

Most packages are consumed directly from source during development. `@sqlvalley/sqljs` is the exception: after changing its source, rebuild it with:

```sh
npm run build --workspace=@sqlvalley/sqljs
```

Run workspace commands from the repository root, and read a package's own README before changing its architecture or public API.
