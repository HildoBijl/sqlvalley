# Data store

The SQL Valley data store keeps user-specific application data in local storage through independent Zustand stores. Application code should import the public stores, hooks, and learning types from `@/store`.


## Using a store

Select only the state or action a component needs. Zustand will then rerender the component only when that selected value changes.

```tsx
import { useSettingsStore } from '@/store'

export function StoryToggle() {
	const hideStories = useSettingsStore(state => state.hideStories)
	const toggleHideStories = useSettingsStore(state => state.toggleHideStories)

	return <button onClick={toggleHideStories}>{hideStories ? 'Show stories' : 'Hide stories'}</button>
}
```

Code outside React can use the same store directly:

```ts
import { useLearningStore } from '@/store'

useLearningStore.getState().completeSkill(skillId)
```


## Available stores

[`settings/`](./settings/) owns application-wide preferences:

- Admin mode
- Theme mode
- Story visibility
- Practice dataset size

[`learning/`](./learning/) owns learning progress for concepts and skills:

- The active content tab and last access time
- Whether a module has been understood
- Solved exercise counts
- Exercise parameters, events, reports, and draft input

Every persisted learning module has an explicit `moduleType` discriminator. Callers provide the module type when creating or updating module state; persisted-state normalization does not infer it from the module's shape.

[`skillTreeSettings/`](./skillTreeSettings/) owns skill-tree interface state:

- Recently visited skill trees
- Intro and planning-mode visibility
- Legend visibility
- Planning mode and goal nodes per skill tree


## Hydration

Persisted stores hydrate from local storage during application startup. Use `useStoresHydrated` when rendering something that requires all stores to be ready:

```tsx
import { useStoresHydrated } from '@/store'

const storesHydrated = useStoresHydrated()
if (!storesHydrated) return null
```

Individual stores expose `hasHydrated` when only one store matters.


## Admin mode

The settings store persists admin mode. On localhost it can be toggled from the settings menu. In production, teachers can enable it from the browser console:

```js
enableAdminMode()
```

Components should read admin mode through the semantic hook:

```ts
const adminModeEnabled = useAdminMode()
```

Admin mode controls interface tools only. It is not a security or authorization boundary.


## Architecture

The store consists of two layers:

- [`infrastructure/`](./infrastructure/) contains the shared persisted-store factory, safe storage adapter, migration runner, and validation helpers.
- [`settings/`](./settings/), [`learning/`](./learning/), and [`skillTreeSettings/`](./skillTreeSettings/) contain independent stores with separate storage keys.

Each store uses responsibility-based filenames:

- `state.ts` defines state types, initial state, and state construction functions.
- `actions.ts` defines state updates.
- `persistence.ts` selects persisted fields and validates data read from storage.
- `migrations.ts` upgrades older persisted representations.
- `store.ts` assembles the store and owns its private storage key.
- `index.ts` exposes the intended public API.

Focused files can be added where a responsibility warrants one. For example, settings has `hooks.ts` and `adminMode.ts`.


## Persistence and validation

Local-storage contents are untrusted runtime data. Each store therefore normalizes hydrated values before merging them with its initial state. Invalid optional fields are omitted so they cannot overwrite valid defaults.

`safeStorage` falls back to in-memory storage when browser local storage is unavailable. This keeps the application usable for the current session, but the fallback data does not survive a reload.


## Changing persisted state

For a non-persisted implementation change, update the state, actions, and consumers without changing the storage version.

For a persisted schema change:

1. Update the current state and persisted-state definitions.
2. Increment the store's `*_STORAGE_VERSION`.
3. Append one migration for the previous version to `migrations.ts`.
4. Keep historical migrations unchanged.
5. Update current normalization so it accepts only the new representation.
6. Update all consumers and the public API where applicable.

Migration index `i` must transform storage version `i` into version `i + 1`. Historical field names and shape detection belong only in migrations, never in current normalization.


## Adding a store

Create a sibling folder using the structure above and assemble it with `createPersistedStore`. Export only the intended application API from its `index.ts`, add that barrel to the root [`index.ts`](./index.ts), and include its hydration state in [`hooks.ts`](./hooks.ts).

Choose a unique storage key and keep it unchanged after release. Add runtime validation for every persisted field rather than relying on TypeScript types, which do not validate local-storage data.
