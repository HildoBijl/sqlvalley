import type { ExerciseDefinition } from '../Exercise/definition'
import type { ExerciseId, ExerciseInstance } from './types'

// Generate a complete instance before handing it to application storage.
export async function generateExerciseInstance(exerciseId: ExerciseId, definition: ExerciseDefinition, context: unknown): Promise<ExerciseInstance> {
	const parameters = await definition.generateParameters({ example: false, context })
	const initialState = await definition.getInitialState({ parameters, context })
	return {
		mode: 'solo',
		exerciseId,
		version: definition.metadata.version,
		parameters,
		initialState,
		startedAt: Date.now(),
		history: [],
	}
}
