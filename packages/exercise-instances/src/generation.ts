import type { Exercise, ExerciseAction, ExerciseMetadata, ExerciseParameters, ExerciseState, SoloExerciseReport } from '@step-wise/exercise-definition'

import type { ExerciseId, ExerciseInstance } from './types'

// Generate a complete instance before handing it to application storage.
export async function generateExerciseInstance(
	exerciseId: ExerciseId,
	definition: Exercise<ExerciseMetadata, ExerciseAction, ExerciseState, ExerciseParameters, SoloExerciseReport, never, unknown>,
	context: unknown,
): Promise<ExerciseInstance> {
	const parameters = await definition.generateParameters({ example: false, context })
	const initialState = await definition.getInitialState({ parameters, context })
	return {
		mode: 'solo',
		exerciseId,
		version: definition.metadata.version ?? 1,
		parameters,
		initialState,
		startedAt: Date.now(),
		history: [],
	}
}
