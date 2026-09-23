import type { InputExerciseAction, MonoExerciseState } from '@step-wise/input-exercises'
import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'
import { MonoExercise } from '@sqlvalley/input-exercise-components'

import type { MonoSQLExerciseSpec } from './types'
import { buildMonoSQLExercise } from './buildMonoSQLExercise'
import { createSQLProblem, SQLExerciseInputArea, SQLExerciseInputVisualization } from './views'

export function createMonoSQLExercise<Parameters extends Record<string, unknown>>(spec: MonoSQLExerciseSpec<Parameters>): ExerciseRegistration {
	const definition = buildMonoSQLExercise(spec)
	const componentSpec = {
		Problem: createSQLProblem(spec.Problem),
		InputArea: SQLExerciseInputArea,
		Solution: spec.Solution,
		InputVisualization: SQLExerciseInputVisualization,
	}
	return {
		exerciseId: spec.exerciseId,
		definition: {
			...definition,
			processSoloAction: data => {
				if (data.action.type !== 'input' && data.action.type !== 'giveUp') throw new Error('Unsupported SQL exercise action.')
				return definition.processSoloAction({ ...data, action: data.action as InputExerciseAction, state: data.state as MonoExerciseState })
			},
		},
		Component: () => <MonoExercise {...componentSpec} />,
	}
}
