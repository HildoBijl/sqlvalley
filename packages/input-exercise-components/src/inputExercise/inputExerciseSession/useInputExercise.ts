import { getCurrentState } from '@step-wise/exercise-definition'
import { isInputExercise } from '@step-wise/input-exercises'
import { useExerciseSessionContext, useExerciseContext } from '@sqlvalley/exercise-manager'

import type { InputExerciseContextValue } from '../types'
import { useExerciseInput } from './useExerciseInput'
import { useInputFields } from './useInputFields'
import { useInputConversion } from './useInputConversion'
import { useInputExerciseButtonAvailability as useButtonAvailability } from './useButtonAvailability'
import { type SolutionDefinition, useSolution } from './useSolution'
import { useInsertSolution } from './useInsertSolution'
import { useInputValidation } from './useInputValidation'
import { useSubmitInput } from './useSubmitInput'

export function useInputExercise() {
	// Gather all data for the exercise and ensure it's indeed an InputExercise.
	const { currentExercise: { definition, instance }, controls, submitting, admin: { showControls } } = useExerciseSessionContext()
	const exerciseContext = useExerciseContext()
	if (!isInputExercise(definition)) throw new Error('InputExerciseProvider requires an input-exercise definition.')

	// Set up input setters, field registration, and value conversion.
	const { input, setInput, mergeInput } = useExerciseInput({ input: instance.draftInput, setDraftInput: controls.setDraftInput })
	const { fields, registerField, setFieldValue } = useInputFields({ mergeInput })
	const { normalizeInput, hydrateInput } = useInputConversion({ fields })

	// Set up input field validation, determine its effect on buttons and build a submit function from it.
	const { getFieldValidation, allInputsValid, validationPending, canSubmitCurrentInput, getInputKey } = useInputValidation({ input, context: exerciseContext, fields, normalizeInput })
	const { canGiveUp, isSubmitButtonEnabled } = useButtonAvailability({ allInputsValid, validationPending, submitting })
	const submitInput = useSubmitInput({ input, normalizeInput, isSubmitButtonEnabled, canSubmitCurrentInput })

	// Determine the solution for the exercise and allow its insertion.
	const state = getCurrentState(instance)
	const { solution, solutionLoading, solutionError } = useSolution({ definition: definition as SolutionDefinition, parameters: instance.parameters, state, context: exerciseContext, enabled: true })
	const insertSolution = useInsertSolution({ solution, valueOperations: definition.valueOperations, fields, mergeInput, showControls, submitting })

	// Determine the loading status and any potential errors.
	const loading = solutionLoading
	const error = solutionError ?? (!loading && definition.getSolution && !solution ? new Error('No solution is available for this exercise.') : undefined)

	// Bundle relevant context values into a context.
	const contextValue: InputExerciseContextValue = {
		// Input system.
		input, setInput,
		fields, registerField, setFieldValue,
		normalizeInput, hydrateInput,

		// Validation.
		allInputsValid, validationPending, getInputKey, getFieldValidation,
		canGiveUp, isSubmitButtonEnabled,
		submitInput,

		// Solutions.
		solution,
		insertSolution,
	}
	return { contextValue, loading, error }
}
