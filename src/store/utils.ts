import { type StateCreator, type StoreApi, type UseBoundStore, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { safeStorage } from './safeStorage'

export interface HydrationState {
	_hasHydrated: boolean
	setHasHydrated: (hasHydrated: boolean) => void
}

export type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void
export type GetState<T> = () => T

export function asRecord(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
	return value as Record<string, unknown>
}

export function runMigrations<TState>(persistedState: TState, fromVersion: number, targetVersion: number, migrations: Array<(state: TState) => TState>): TState {
	const sourceVersion = Number.isFinite(fromVersion) ? fromVersion : 0
	if (sourceVersion >= targetVersion) return persistedState
	let state = persistedState
	const migrationsToRun = migrations.slice(sourceVersion, targetVersion)
	for (const migrate of migrationsToRun) { state = migrate(state) }
	return state
}

interface CreateStoreOptions<TState extends object, TActions extends object, TPersistedState extends object> {
	initialState: TState
	createActions: (set: SetState<TState>, get: GetState<TState>) => TActions
	storageKey: string
	version: number
	migrate: (persistedState: unknown, fromVersion: number) => TPersistedState
	partialize: (state: TState) => TPersistedState
	normalize: (persistedState: TPersistedState | undefined) => Partial<TState>
}

export function createStore<TState extends object, TActions extends object, TPersistedState extends object>({
	initialState,
	createActions,
	storageKey,
	version,
	migrate,
	partialize,
	normalize,
}: CreateStoreOptions<TState, TActions, TPersistedState>): UseBoundStore<StoreApi<TState & TActions & HydrationState>> {
	type StoreState = TState & TActions & HydrationState

	const creator: StateCreator<StoreState> = (set, get) => {
		const scopedSet: SetState<TState> = partial => {
			set(state => {
				const scopedState = state as unknown as TState
				const nextState = typeof partial === 'function' ? partial(scopedState) : partial
				return nextState as Partial<StoreState>
			})
		}

		const scopedGet: GetState<TState> = () => get() as unknown as TState

		return {
			...initialState,
			...createActions(scopedSet, scopedGet),
			_hasHydrated: false,
			setHasHydrated: hasHydrated => set({ _hasHydrated: hasHydrated } as Partial<StoreState>),
		}
	}

	const useStore = create<StoreState>()(
		persist(creator, {
			name: storageKey,
			storage: createJSONStorage(() => safeStorage),
			version,
			migrate: (persistedState, fromVersion) => migrate(persistedState, fromVersion),
			partialize: state => partialize(state as unknown as TState),
			merge: (persistedState, currentState) => ({
				...currentState,
				...normalize(persistedState as TPersistedState | undefined),
			}),
			onRehydrateStorage: () => (state, error) => {
				if (error) console.error(`Failed to rehydrate store "${storageKey}":`, error)
				if (state) {
					state.setHasHydrated(true)
					return
				}
				Promise.resolve().then(() => useStore.setState({ _hasHydrated: true } as Partial<StoreState>))
			},
		}),
	)
	
	return useStore
}
