import type { InputExerciseAction, MonoExerciseState } from '@step-wise/input-exercises'

import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'
import { MonoExercise } from '@sqlvalley/input-exercise-components'

import { ensureSqlModuleContext } from '../../sqlModuleProvider'
import type { MonoSQLExerciseSpec } from './types'
import { fromRawInput, resolveValue, toRawInput } from './input'
import { buildMonoSQLExercise } from './buildMonoSQLExercise'
import { createSQLProblem, createSQLSolution, SQLExerciseInput, SQLExerciseOutput } from './views'

export function createMonoSQLExercise<Parameters extends Record<string, unknown>>(spec: MonoSQLExerciseSpec<Parameters>): ExerciseRegistration {
	const definition = buildMonoSQLExercise(spec)
	const renderSpec = {
		initialInput: '',
		getSolutionInput: (parameters: Parameters) => resolveValue(spec.solution, parameters).trim(),
		toRawInput,
		fromRawInput,
		isInputEmpty: (input: string) => !input.trim(),
		canSubmit: ({ moduleContext }: { moduleContext: unknown }) => ensureSqlModuleContext(moduleContext).ready,
		canGiveUp: ({ moduleContext }: { moduleContext: unknown }) => ensureSqlModuleContext(moduleContext).ready,
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
		Component: () => <MonoExercise spec={renderSpec} />,
	}
}
