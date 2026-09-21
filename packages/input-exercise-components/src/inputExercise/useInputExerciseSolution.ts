import { type RefObject, useCallback, useEffect, useMemo, useState } from 'react'

import type { ExerciseState } from '@step-wise/exercise-definition'
import { type InputExerciseRawInput, type InputExerciseMetadata, type InputExerciseSpec, type InputExerciseSolution, type InputExerciseValueOperations, getInputDependency, resolveStaticSolution, resolveSolution } from '@step-wise/input-exercises'

// Only the definition capabilities needed to resolve a solution.
export type SolutionDefinition = Pick<InputExerciseSpec<InputExerciseMetadata, Record<string, unknown>, InputExerciseSolution, unknown, unknown>, 'getStaticSolution' | 'getSolution'> & {
	valueOperations: InputExerciseValueOperations
}

// The result object which we use to save the solution with.
interface SolutionResult {
	request: object
	solution?: InputExerciseSolution
	error?: Error
}

interface InputExerciseSolutionOptions {
	definition: SolutionDefinition
	parameters: Record<string, unknown>
	state: ExerciseState
	context: unknown
	enabled: boolean
	fields: RefObject<Map<string, string>>
	mergeInput: (values: InputExerciseRawInput) => void
	showControls: boolean
	submitting: boolean
}

// Determine the solution of an exercise instance.
export function useInputExerciseSolution({ definition, parameters, state, context, enabled, fields, mergeInput, showControls, submitting }: InputExerciseSolutionOptions) {
	const [result, setResult] = useState<SolutionResult>()
	const available = !!definition.getSolution && enabled

	// Bundle all relevant data into a single request.
	const request = useMemo(() => ({ definition, parameters, inputDependency: state.inputDependency, context, enabled }), [definition, parameters, state.inputDependency, context, enabled])

	// Determine and save the solution when any part of the request changes.
	useEffect(() => {
		if (!available) return
		let cancelled = false
		async function resolve() {
			try {
				const { definition, parameters, inputDependency, context } = request
				const restoredParameters = definition.valueOperations.deserialize(parameters)
				if (!restoredParameters || typeof restoredParameters !== 'object' || Array.isArray(restoredParameters)) throw new Error('Input-exercise parameters must deserialize to an object.')
				const dependency = getInputDependency({ inputDependency }, 'solo', definition.valueOperations)
				const staticSolution = await resolveStaticSolution(definition, restoredParameters as Record<string, unknown>, context)
				const solution = await resolveSolution(definition, restoredParameters as Record<string, unknown>, dependency, staticSolution, context)
				if (!cancelled) setResult({ request, solution })
			} catch (cause) {
				if (!cancelled) setResult({ request, error: cause instanceof Error ? cause : new Error(String(cause)) })
			}
		}
		void resolve()
		return () => { cancelled = true }
	}, [request, available])

	// Ensure that the solution is for the current request.
	const current = available && result?.request === request ? result : undefined
	const solution = current?.solution

	// Set up an insertSolution handler.
	const insertSolution = useCallback(() => {
		if (!showControls || submitting || !solution) return
		const entries = [...fields.current.entries()]
			.filter(([name]) => Object.prototype.hasOwnProperty.call(solution, name))
			.map(([name, type]) => [name, definition.valueOperations.toInputValue(solution[name], type)] as const)
		if (entries.length === 0) return
		mergeInput(Object.fromEntries(entries))
	}, [showControls, submitting, solution, fields, definition, mergeInput])

	// All done. Return the context values.
	return { solution, solutionLoading: available && !current, solutionError: current?.error, insertSolution: showControls && solution ? insertSolution : undefined }
}
