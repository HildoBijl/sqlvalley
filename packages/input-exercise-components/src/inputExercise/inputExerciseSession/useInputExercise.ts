import { getCurrentState } from '@step-wise/exercise-definition'
import { isInputExercise } from '@step-wise/input-exercises'
import { useExerciseSessionContext, useModuleContext } from '@sqlvalley/exercise-manager'

import type { InputExerciseContextValue } from '../types'
import { useExerciseInput } from './useExerciseInput'
import { useInputFields } from './useInputFields'
import { type SolutionDefinition, useSolution } from './useSolution'
import { useInsertSolution } from './useInsertSolution'

export function useInputExercise() {
	const { currentExercise: { definition, instance }, controls, submitting, admin: { showControls } } = useExerciseSessionContext()
	if (!isInputExercise(definition)) throw new Error('InputExerciseProvider requires an input-exercise definition.')

	// Set up input setters and field registration.
	const { input, setInput, mergeInput } = useExerciseInput({ input: instance.draftInput, setDraftInput: controls.setDraftInput })
	const { fields, registerField, setFieldValue } = useInputFields({ valueOperations: definition.valueOperations, mergeInput })

	// Determine the solution for the exercise.
	const state = getCurrentState(instance)
	const moduleContext = useModuleContext()
	const { solution, solutionLoading, solutionError } = useSolution({ definition: definition as SolutionDefinition, parameters: instance.parameters, state, context: moduleContext, enabled: !moduleContext?.loading && !moduleContext?.error })

	// Set up an insertSolution function.
	const insertSolution = useInsertSolution({ solution, valueOperations: definition.valueOperations, fields, mergeInput, showControls, submitting })

	// Determine the loading status and any potential error.
	const loading = !!moduleContext?.loading || solutionLoading
	const error = moduleContext?.error ?? solutionError ?? (!loading && definition.getSolution && !solution ? new Error('No solution is available for this exercise.') : undefined)

	// Bundle relevant context values into a context.
	const contextValue: InputExerciseContextValue = {
		input,
		setInput,
		registerField,
		setFieldValue,
		solution,
		insertSolution,
	}
	return { contextValue, loading, error }
}
