import { type StateCreator, type StoreApi, type UseBoundStore, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { safeStorage } from './safeStorage'

export interface HydrationState {
	hasHydrated: boolean
	setHasHydrated: (hasHydrated: boolean) => void
}

export type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void
interface CreatePersistedStoreOptions<TState extends object, TActions extends object, TPersistedState extends object> {
	initialState: TState
	createActions: (set: SetState<TState>) => TActions
	storageKey: string
	version: number
	migrate: (persistedState: unknown, fromVersion: number) => TPersistedState
	getPersistedState: (state: TState) => TPersistedState
	normalize: (persistedState: TPersistedState | undefined) => Partial<TState>
}

export function createPersistedStore<TState extends object, TActions extends object, TPersistedState extends object>({
	initialState,
	createActions,
	storageKey,
	version,
	migrate,
	getPersistedState,
	normalize,
}: CreatePersistedStoreOptions<TState, TActions, TPersistedState>): UseBoundStore<StoreApi<TState & TActions & HydrationState>> {
	type StoreState = TState & TActions & HydrationState

	const creator: StateCreator<StoreState> = set => {
		const scopedSet: SetState<TState> = partial => {
			set(state => {
				const scopedState = state as unknown as TState
				const nextState = typeof partial === 'function' ? partial(scopedState) : partial
				return nextState as Partial<StoreState>
			})
		}
		return {
			...initialState,
			...createActions(scopedSet),
			hasHydrated: false,
			setHasHydrated: hasHydrated => set({ hasHydrated } as Partial<StoreState>),
		}
	}

	const useStore = create<StoreState>()(
		persist(creator, {
			name: storageKey,
			storage: createJSONStorage(() => safeStorage),
			version,
			migrate: (persistedState, fromVersion) => migrate(persistedState, fromVersion),
			partialize: state => getPersistedState(state as unknown as TState),
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
				Promise.resolve().then(() => useStore.setState({ hasHydrated: true } as Partial<StoreState>))
			},
		}),
	)

	return useStore
}
