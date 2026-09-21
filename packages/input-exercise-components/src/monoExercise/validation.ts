import type { ExerciseAction, ExerciseState, SoloExerciseInstance } from '@step-wise/exercise-definition'
import type { InputExerciseAction, MonoExerciseState } from '@step-wise/input-exercises'

// Narrow the general manager data before using mono-specific history helpers.
export function isMonoExerciseHistory(instance: SoloExerciseInstance): instance is SoloExerciseInstance<InputExerciseAction, MonoExerciseState> {
	return isMonoState(instance.initialState) && instance.history.every(event => isInputAction(event.action) && isMonoState(event.state))
}

function isMonoState(state: ExerciseState): state is MonoExerciseState {
	if (state.attemptedBy !== undefined && (!Array.isArray(state.attemptedBy) || !state.attemptedBy.every(userId => typeof userId === 'string'))) return false
	if (state.inputDependencies !== undefined && (!state.inputDependencies || typeof state.inputDependencies !== 'object' || Array.isArray(state.inputDependencies))) return false
	return ['attempted', 'solved', 'givenUp', 'done'].every(key => state[key] === undefined || state[key] === true)
}

function isInputAction(action: ExerciseAction): action is InputExerciseAction {
	if (action.type === 'giveUp') return true
	if (action.type !== 'input' || !action.input || typeof action.input !== 'object' || Array.isArray(action.input)) return false
	if (action.adoptUserHistory !== undefined && typeof action.adoptUserHistory !== 'string') return false
	return Object.values(action.input).every(field =>
		field !== null && typeof field === 'object' && !Array.isArray(field) && typeof field.type === 'string' && field.value !== undefined)
}
