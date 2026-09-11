# `@sqlvalley/sqljs`

This package loads SQL.js with its WebAssembly binary and makes the initialized SQL.js runtime available through React context.


## Installation

Add the package to the consuming workspace:

```json
{
  "dependencies": {
    "@sqlvalley/sqljs": "*"
  }
}
```

The consuming application must provide React, which is a peer dependency.


## Usage

Wrap the part of the application that needs SQL.js in `SQLJSProvider`:

```tsx
import { SQLJSProvider } from '@sqlvalley/sqljs'

export function App() {
  return <SQLJSProvider>
		<Application />
	</SQLJSProvider>
}
```

Components within the provider can access the initialized SQL.js runtime through `useSQLJS`:

```tsx
import { useSQLJS } from '@sqlvalley/sqljs'

export function Example() {
  const SQLJS = useSQLJS()

  const runExample = () => {
    if (!SQLJS) return
    const database = new SQLJS.Database()
    try {
      database.run('CREATE TABLE example (id INTEGER);')
    } finally {
      database.close()
    }
  }

  return <button disabled={!SQLJS} onClick={runExample}>Run example</button>
}
```

`useSQLJS` returns `null` until initialization has completed. The package also exports these hooks:

- `useSQLJSContext()` returns the complete context value.
- `useSQLJSLoading()` indicates whether initialization is in progress.
- `useSQLJSReady()` indicates whether SQL.js is ready to use.
- `useSQLJSError()` returns an initialization error, if one occurred.

For example:

```tsx
import { useSQLJSError, useSQLJSReady } from '@sqlvalley/sqljs'

export function SQLJSStatus() {
  const isReady = useSQLJSReady()
  const error = useSQLJSError()

  if (error) return <p>SQL.js could not be loaded: {error.message}</p>
  if (!isReady) return <p>Loading SQL.js…</p>
  return <p>SQL.js is ready.</p>
}
```


## Building

The package embeds `sql-wasm.wasm` into its generated JavaScript. Build it before consuming its runtime export:

```sh
npm run build --workspace=@sqlvalley/sqljs
```

The repository's root `dev` and `build` scripts perform this step automatically.

The package is consumed from `dist`, so changes within this package require rebuilding it and restarting an already-running development server. SQL.js initialization is shared between consumers and is only performed once per loaded package instance.
