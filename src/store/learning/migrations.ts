import { asRecord, runMigrations } from '../infrastructure'
import type { PersistedLearning } from './persistence'

export const LEARNING_STORAGE_VERSION = 9

// Migrations: index i transforms payload from version i to i+1.
const MIGRATIONS: Array<(state: PersistedLearning) => PersistedLearning> = [
	// v0 -> v1: no-op (initial versioned payload)
	state => state,

	// v1 -> v2: rename persisted "components" to "modules"
	state => {
		const safeState = asRecord(state) as PersistedLearning & { components?: unknown }
		if (safeState.modules) return state
		const legacyComponents = asRecord(safeState.components)
		if (Object.keys(legacyComponents).length === 0) return { ...state, modules: {} }
		return { ...state, modules: legacyComponents as PersistedLearning['modules'] }
	},

	// v2 -> v3: remove playground modules and migrate skill shape to list-based exercises.
	state => {
		const safeState = asRecord(state) as PersistedLearning
		const modules = asRecord(safeState.modules)
		if (Object.keys(modules).length === 0) return { ...state, modules: {} }

		const migratedModules = Object.fromEntries(
			Object.entries(modules).flatMap(([moduleId, moduleValue]) => {
				const module = asRecord(moduleValue)
				if (module.type === 'playground') return []
				if (module.type === 'skill' || 'instances' in module || 'currentInstanceId' in module || 'numSolved' in module) {
					const { instances: _instances, currentInstanceId: _currentInstanceId, ...moduleWithoutLegacyShape } = module
					const numSolved = typeof module.numSolved === 'number' ? module.numSolved : 0
					return [[
						moduleId,
						{
							...moduleWithoutLegacyShape,
							id: typeof module.id === 'string' ? module.id : moduleId,
							type: 'skill',
							numSolved,
							understood: module.understood === true ? true : undefined,
							exercises: [],
						},
					]]
				}
				return [[moduleId, module]]
			}),
		)
		return { ...state, modules: migratedModules as PersistedLearning['modules'] }
	},

	// v3 -> v4: remove legacy persisted module "type" and normalize understood to true|undefined.
	state => {
		const safeState = asRecord(state) as PersistedLearning
		const modules = asRecord(safeState.modules)
		if (Object.keys(modules).length === 0) return { ...state, modules: {} }

		const migratedModules = Object.fromEntries(
			Object.entries(modules).map(([moduleId, moduleValue]) => {
				const module = asRecord(moduleValue)
				const { type: legacyType, understood: legacyUnderstood, ...withoutLegacyType } = module
				const understood = legacyUnderstood === true ? true : undefined
				const isSkill = legacyType === 'skill' || typeof module.numSolved === 'number' || Array.isArray(module.exercises) || 'instances' in module || 'currentInstanceId' in module

				if (isSkill) {
					const { instances: _instances, currentInstanceId: _currentInstanceId, ...withoutLegacySkillShape } = withoutLegacyType
					const numSolved = typeof module.numSolved === 'number' ? module.numSolved : 0
					const exercises = Array.isArray(module.exercises) ? module.exercises : []
					return [
						moduleId,
						{
							...withoutLegacySkillShape,
							id: typeof module.id === 'string' ? module.id : moduleId,
							numSolved,
							exercises,
							understood,
						},
					]
				}

				return [
					moduleId,
					{
						...withoutLegacyType,
						id: typeof module.id === 'string' ? module.id : moduleId,
						understood,
					},
				]
			}),
		)

		return { ...state, modules: migratedModules as PersistedLearning['modules'] }
	},

	// v4 -> v5: reset persisted skill exercises to the minimal v5 shape.
	state => {
		const safeState = asRecord(state) as PersistedLearning
		const modules = asRecord(safeState.modules)
		if (Object.keys(modules).length === 0) return { ...state, modules: {} }

		const migratedModules = Object.fromEntries(
			Object.entries(modules).map(([moduleId, moduleValue]) => {
				const module = asRecord(moduleValue)
				const {
					type: _legacyType,
					instances: _instances,
					currentInstanceId: _currentInstanceId,
					...withoutLegacyShape
				} = module

				const isSkill = typeof module.numSolved === 'number' || Array.isArray(module.exercises)
				if (isSkill) {
					return [
						moduleId,
						{
							...withoutLegacyShape,
							id: typeof module.id === 'string' ? module.id : moduleId,
							numSolved:
								typeof module.numSolved === 'number' ? module.numSolved : 0,
							understood: module.understood === true ? true : undefined,
							exercises: [],
						},
					]
				}

				return [
					moduleId,
					{
						...withoutLegacyShape,
						id: typeof module.id === 'string' ? module.id : moduleId,
						understood: module.understood === true ? true : undefined,
					},
				]
			}),
		)

		return { ...state, modules: migratedModules as PersistedLearning['modules'] }
	},

	// v5 -> v6: clarify the skill progress and exercise history field names.
	state => {
		const modules = asRecord(asRecord(state).modules)
		const migratedModules = Object.fromEntries(Object.entries(modules).map(([moduleId, moduleValue]) => {
			const module = asRecord(moduleValue)
			if (typeof module.numSolved !== 'number' && !Array.isArray(module.exercises)) return [moduleId, module]
			const { numSolved, exercises, ...rest } = module
			return [moduleId, { ...rest, solvedExerciseCount: numSolved, exerciseHistory: exercises }]
		}))
		return { ...state, modules: migratedModules as PersistedLearning['modules'] }
	},

	// v6 -> v7: add an explicit discriminator to every module.
	state => {
		const modules = asRecord(asRecord(state).modules)
		const migratedModules = Object.fromEntries(Object.entries(modules).map(([moduleId, moduleValue]) => {
			const module = asRecord(moduleValue)
			const moduleType = typeof module.solvedExerciseCount === 'number' || Array.isArray(module.exerciseHistory) ? 'skill' : 'concept'
			return [moduleId, { ...module, moduleType }]
		}))
		return { ...state, modules: migratedModules as PersistedLearning['modules'] }
	},

	// v7 -> v8: adopt solo instances with persisted initial state and upstream history fields.
	state => {
		const timestamp = (value: unknown) => typeof value === 'string' ? new Date(value).getTime() : value
		const modules = asRecord(asRecord(state).modules)
		const migratedModules = Object.fromEntries(Object.entries(modules).map(([moduleId, moduleValue]) => {
			const module = asRecord(moduleValue)
			if (module.moduleType !== 'skill' || !Array.isArray(module.exerciseHistory)) return [moduleId, module]
			const exerciseHistory = module.exerciseHistory.map(value => {
				const { events, createdAt, ...instance } = asRecord(value)
				const history = (Array.isArray(events) ? events : []).map(value => {
					const { resultingState, timestamp: submittedAt, ...event } = asRecord(value)
					const previousState = asRecord(resultingState)
					const done = previousState.solved === true || previousState.givenUp === true
					return { ...event, submittedAt: timestamp(submittedAt), state: { ...previousState, ...(done ? { done: true } : {}) } }
				})
				// All legacy SimpleExercises began with an empty state.
				const version = typeof instance.version === 'number' && Number.isSafeInteger(instance.version) && instance.version > 0 ? instance.version : 1
				return { ...instance, version, startedAt: timestamp(createdAt), mode: 'solo', initialState: {}, history }
			})
			return [moduleId, { ...module, exerciseHistory }]
		}))
		return { ...state, modules: migratedModules as PersistedLearning['modules'] }
	},
	
	// v8 -> v9: adopt structured mono input actions and the upstream attempted flag.
	state => {
		const modules = asRecord(asRecord(state).modules)
		const migratedModules = Object.fromEntries(Object.entries(modules).map(([moduleId, moduleValue]) => {
			const module = asRecord(moduleValue)
			if (module.moduleType !== 'skill' || !Array.isArray(module.exerciseHistory)) return [moduleId, module]
			const exerciseHistory = module.exerciseHistory.map(value => {
				const instance = asRecord(value)
				let attempted = false
				const history = (Array.isArray(instance.history) ? instance.history : []).map(value => {
					const event = asRecord(value)
					const action = asRecord(event.action)
					if (action.type === 'input') attempted = true
					const migratedAction = action.type === 'give-up' ? { ...action, type: 'giveUp' }
						: action.type === 'input' && typeof action.input === 'string' ? { ...action, input: { query: { type: 'SQL', value: action.input } } } : action
					return { ...event, action: migratedAction, state: { ...asRecord(event.state), ...(attempted ? { attempted: true } : {}) } }
				})
				return { ...instance, history }
			})
			return [moduleId, { ...module, exerciseHistory }]
		}))
		return { ...state, modules: migratedModules as PersistedLearning['modules'] }
	},
]

export function migrateLearning(persistedState: unknown, fromVersion: number): PersistedLearning {
	const state = asRecord(persistedState) as PersistedLearning
	return runMigrations(state, fromVersion, LEARNING_STORAGE_VERSION, MIGRATIONS)
}
