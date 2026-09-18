import type { InputExerciseAction, MonoExerciseState } from '@step-wise/input-exercises'

import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'
import { MonoExercise } from '@sqlvalley/input-exercise-components'

import type { SqlModuleContext } from '../SqlModule'
import type { MonoSQLExerciseSpec } from './types'
import { fromRawInput, resolveValue, toRawInput } from './input'
import { buildMonoSQLExercise } from './buildMonoSQLExercise'
import { createSQLProblem, createSQLSolution, SQLExerciseInput, SQLExerciseOutput } from './views'

export function createMonoSQLExercise<Parameters extends Record<string, unknown>>(spec: MonoSQLExerciseSpec<Parameters>): ExerciseRegistration {
	const definition = buildMonoSQLExercise(spec)
	const renderSpec = {
		initialInput: '',
		toRawInput,
		fromRawInput,
		isInputEmpty: (input: string) => !input.trim(),
		canSubmit: ({ moduleContext }: { moduleContext: unknown }) => {
			const context = moduleContext as SqlModuleContext
			return context.ready && !context.isExecuting && !context.queryError
		},
		canGiveUp: ({ moduleContext }: { moduleContext: unknown }) => !(moduleContext as SqlModuleContext).isExecuting,
		Problem: createSQLProblem(spec.title ?? 'Exercise', (parameters: Parameters) => resolveValue(spec.problem, parameters)),
		Input: SQLExerciseInput,
		Solution: createSQLSolution((parameters: Parameters) => resolveValue(spec.solution, parameters)),
		Output: SQLExerciseOutput,
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
		isSolved: state => state.solved === true,
		getSolutionInput: parameters => toRawInput(resolveValue(spec.solution, parameters as Parameters).trim()),
		Component: () => <MonoExercise spec={renderSpec} />,
	}
}
