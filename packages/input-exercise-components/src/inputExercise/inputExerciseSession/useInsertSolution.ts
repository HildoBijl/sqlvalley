import { useCallback } from 'react'

import type { InputExerciseRawInput, InputExerciseSolution, InputExerciseValueOperations } from '@step-wise/input-exercises'

import type { InputFieldOptions } from './fieldTypes'

// The data needed to build the insertSolution function.
interface InsertSolutionOptions {
	solution: InputExerciseSolution | undefined
	valueOperations: InputExerciseValueOperations
	fields: ReadonlyMap<string, InputFieldOptions>
	mergeInput: (values: InputExerciseRawInput) => void
	showControls: boolean
	submitting: boolean
}

// The hook that builds the insertSolution function.
export function useInsertSolution({ solution, valueOperations, fields, mergeInput, showControls, submitting }: InsertSolutionOptions) {
	const insertSolution = useCallback(() => {
		if (!showControls || submitting || !solution) return
		const entries = [...fields.entries()]
			.filter(([name]) => Object.prototype.hasOwnProperty.call(solution, name))
			.map(([name, field]) => [name, valueOperations.toInputValue(solution[name], field.type)] as const)
		if (entries.length === 0) return
		mergeInput(Object.fromEntries(entries))
	}, [showControls, submitting, solution, fields, valueOperations, mergeInput])

	return showControls && solution ? insertSolution : undefined
}
