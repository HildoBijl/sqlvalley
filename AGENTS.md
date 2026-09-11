# SQL Valley agent instructions


## Repository overview

SQL Valley is an npm-workspace monorepo containing a React and Vite learning application.

- `src/` contains the application shell, navigation, curriculum, learning integration, and application state.
- `packages/` contains reusable TypeScript packages arranged in dependency order from foundational utilities to application-facing learning tools.
- `packages/sqljs/` is a special prebuilt package that embeds the SQL.js WASM binary. Most other workspace packages are consumed directly from source during development.

Read the README of an affected package before making architectural or public-API changes. Preserve the intended dependency hierarchy: foundational folders and packages must not import from the higher-level consumers built on top of them.


## Working rules

- Run commands from the repository root unless a command explicitly requires another directory.
- Use npm workspaces. Do not install dependencies separately inside workspace directories.
- Use `npm ci` for a clean installation. Use `npm install` only when intentionally changing dependencies or workspace links.
- Do not edit generated `dist/` files. Change the source and rebuild the owning package instead.
- Do not commit `.env` files, credentials, database dumps, or other secrets.
- Preserve unrelated user changes and work safely in a dirty working tree.
- Keep changes focused on the requested task. Do not perform opportunistic large-scale refactors.
- Reuse existing abstractions and patterns before introducing parallel ones.
- Keep package internals private unless another package genuinely needs them. Treat each root `index.ts` as an intentional public API boundary.


## Code style

Follow the style of the surrounding code and move changed code toward these conventions:

- Use tabs for indentation, except in file formats such as YAML or JSON where spaces are conventional or required.
- Use UTF-8 and LF line endings.
- End text files with a newline. Do not change generated JSON solely to add a final newline.
- Trim trailing whitespace.
- Do not add semicolons unless the syntax requires one.
- Prefer single quotes for strings where the language permits them.
- Prefer compact code when it remains immediately readable. Avoid vertical expansion when a statement naturally fits on one line, but do not compress complex logic merely to reduce line count.
- Write a simple `if` statement containing one short operation on one line without braces.

```ts
if (!value) return
if (items.length === 0) throw new Error('No items were provided.')
```

- Omit parentheses around the sole parameter of an arrow function.

```ts
items.map(item => item.id)
```

- Keep parentheses for zero parameters, multiple parameters, destructured parameters, typed parameters where required, or cases where syntax requires them.
- Use multiple lines when a condition or operation becomes difficult to scan, benefits from explanation, or contains meaningful branches.
- Keep comments focused on intent and non-obvious constraints rather than restating the code.
- Use `//` comments for short function descriptions. Do not use JSDoc syntax merely for ordinary descriptions.
- Do not add file-description comments at the top of source files. Let filenames, exports, and focused symbol comments describe their purpose.


## Imports and exports

Organize imports into blocks separated by one blank line, in this order:

1. External dependencies.
2. `@step-wise/*` and `@sqlvalley/*` workspace packages, ordered from foundational packages to their consumers.
3. Relative imports, grouped by dependency hierarchy and relative-path depth: foundational modules first, then modules that depend on them; for otherwise equivalent imports, use deeper parent paths before shallower paths and local `./` imports last.

Within an import declaration, place types before runtime values:

```ts
import { type DatasetSize, type TableKey, allTableKeys } from '@sqlvalley/mock-data'
```

- Use at most one import declaration from a given module in a file. Combine type and runtime imports from the same source.
- Prefer inline `type` modifiers when importing types and values from the same module.
- Use `import type` when a module provides only types or when the separation is substantially clearer.
- Prefer folder-level barrel imports over deep imports where doing so does not create a dependency cycle.
- Add focused `index.ts` barrels for coherent folders.
- Prefer `export * from './module'` within internal barrels when the whole module belongs to that barrel.
- Use explicit exports at a package root when needed to keep implementation details out of the public API.
- Do not route an internal import through a barrel if that would introduce a circular dependency.


## Markdown and documentation

- Put two blank lines before every level-two (`##`) Markdown heading to visually separate major sections.
- Use one blank line before lower-level headings.
- Keep examples aligned with the current public API and repository code style.
- When changing a package's public API, update its exports, README, and consumers where applicable.
- Remove obsolete documentation instead of preserving instructions that no longer match the code.


## Packages and dependencies

- Declare cross-package imports through workspace dependencies in the consuming package's `package.json`.
- Keep dependency direction one-way. A lower-level package must not import from a package that consumes it.
- Prefer deriving union types and key lists from their runtime source of truth instead of declaring the same options twice.
- Keep package-specific implementation helpers internal until another package needs them.
- Use caret ranges for external packages unless compatibility requires a stricter range. Internal private workspace dependencies use `*`.
- Build `@sqlvalley/sqljs` after changing its source because its runtime export comes from `dist` and embeds the SQL.js WASM binary.
- Changes to source-exported workspace packages should propagate through Vite during development. Changes to `@sqlvalley/sqljs` require rebuilding it and restarting an already-running development server.


## Verification

Verify changes in proportion to their scope:

- Run `npm run type-check` after TypeScript changes.
- Run `npm run lint` or `npm run lint:strict` when style, imports, or a broad set of files changes.
- Run focused tests when relevant tests exist.
- For changes to `packages/sqljs`, run `npm run build --workspace=@sqlvalley/sqljs` to refresh its required runtime artifact.
- Reserve the full `npm run build` for the end of a cleanup sequence, cross-cutting changes, or work that may affect production bundling. Do not repeatedly run the full Vite build after every small cleanup.
- For documentation-only changes, verify commands and links and run `git diff --check` on the affected files.
- Report the checks performed and any checks that could not be run.
