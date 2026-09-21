import type { InputExerciseAction, MonoExerciseState } from '@step-wise/input-exercises'

import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'
import { MonoExercise } from '@sqlvalley/input-exercise-components'

import { ensureSqlModuleContext } from '../../sqlModuleProvider'
import type { MonoSQLExerciseSpec } from './types'
import { fromRawInput, toRawInput } from './input'
import { buildMonoSQLExercise } from './buildMonoSQLExercise'
import { createSQLProblem, SQLExerciseInputArea, SQLExerciseInputVisualization } from './views'

export function createMonoSQLExercise<Parameters extends Record<string, unknown>>(spec: MonoSQLExerciseSpec<Parameters>): ExerciseRegistration {
	const definition = buildMonoSQLExercise(spec)
	const renderSpec = {
		problemTitle: spec.title ?? 'Exercise',
		initialInput: '',
		toRawInput,
		fromRawInput,
		isInputEmpty: (input: string) => !input.trim(),
		canSubmit: ({ moduleContext }: { moduleContext: unknown }) => {
			const { loading, error } = ensureSqlModuleContext(moduleContext)
			return !loading && !error
		},
		canGiveUp: ({ moduleContext }: { moduleContext: unknown }) => {
			const { loading, error } = ensureSqlModuleContext(moduleContext)
			return !loading && !error
		},
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
		Component: () => <MonoExercise spec={renderSpec} />,
	}
}
