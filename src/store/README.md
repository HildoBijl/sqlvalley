# Data store

The SQL Valley data store keeps user data in local storage through independent Zustand stores.


## Architecture

The store consists of two layers:

- [`infrastructure/`](./infrastructure/) contains the shared store factory, storage adapter, migration runner, and validation helpers.
- [`settings/`](./settings/), [`learning/`](./learning/), and [`skillTreeSettings/`](./skillTreeSettings/) contain independent stores with separate persisted storage keys.

[`useStoresHydrated.ts`](./useStoresHydrated.ts) provides the cross-store hydration check used while starting the application.


## Store structure

Each store uses responsibility-based filenames:

- `state.ts` defines its state types, initial state, and state construction functions.
- `actions.ts` defines the operations that update the state.
- `persistence.ts` selects persisted fields and validates data read from storage.
- `migrations.ts` upgrades older persisted representations.
- `store.ts` assembles these responsibilities using `createPersistedStore` and owns the private storage key.
- `index.ts` defines the store's public API.

A store may add focused files where needed. For example, the learning store uses `normalization.ts` for validating nested module and exercise data, while the settings store uses `hooks.ts` and `adminMode.ts` for its admin-mode interface.


## Adding a store

Create a sibling folder using the structure above, assemble it with `createPersistedStore`, and export only its intended public API from the folder's `index.ts`. Then add that barrel to the root [`index.ts`](./index.ts) and include its hydration state in [`useStoresHydrated.ts`](./useStoresHydrated.ts).

Keep storage keys unchanged after release. When a persisted representation changes, increment its version and add the corresponding migration before changing application code that reads the new shape.
