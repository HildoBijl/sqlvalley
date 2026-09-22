import { getCurrentState } from '@step-wise/exercise-definition'
import { isInputExercise } from '@step-wise/input-exercises'
import { useExerciseSessionContext, useModuleContext } from '@sqlvalley/exercise-manager'

import type { InputExerciseContextValue } from '../types'
import { useExerciseInput } from './useExerciseInput'
import { useInputFields } from './useInputFields'
import { useInputExerciseButtonAvailability as useButtonAvailability } from './useButtonAvailability'
import { type SolutionDefinition, useSolution } from './useSolution'
import { useInsertSolution } from './useInsertSolution'
import { useInputValidation } from './useInputValidation'
import { useSubmitInput } from './useSubmitInput'

export function useInputExercise() {
	// Gather all data for the exercise and ensure it's indeed an InputExercise.
	const { currentExercise: { definition, instance }, controls, submitting, admin: { showControls } } = useExerciseSessionContext()
	const moduleContext = useModuleContext()
	if (!isInputExercise(definition)) throw new Error('InputExerciseProvider requires an input-exercise definition.')

	// Set up input setters and field registration.
	const { input, setInput, mergeInput } = useExerciseInput({ input: instance.draftInput, setDraftInput: controls.setDraftInput })
	const { fields, registerField, setFieldValue } = useInputFields({ valueOperations: definition.valueOperations, mergeInput })

	// Set up input field validation, determine its effect on buttons and build a submit function from it.
	const { getFieldValidation, allInputsValid, validationPending, canSubmitCurrentInput, getInputKey } = useInputValidation(input, moduleContext, fields)
	const { canGiveUp, isSubmitButtonEnabled } = useButtonAvailability({ allInputsValid, validationPending, submitting, moduleContext })
	const submitInput = useSubmitInput({ input, isSubmitButtonEnabled, canSubmitCurrentInput })

	// Determine the solution for the exercise and allow its insertion.
	const state = getCurrentState(instance)
	const { solution, solutionLoading, solutionError } = useSolution({ definition: definition as SolutionDefinition, parameters: instance.parameters, state, context: moduleContext, enabled: !moduleContext?.loading && !moduleContext?.error })
	const insertSolution = useInsertSolution({ solution, valueOperations: definition.valueOperations, fields, mergeInput, showControls, submitting })

	// Determine the loading status and any potential errors.
	const loading = !!moduleContext?.loading || solutionLoading
	const error = moduleContext?.error ?? solutionError ?? (!loading && definition.getSolution && !solution ? new Error('No solution is available for this exercise.') : undefined)

	// Bundle relevant context values into a context.
	const contextValue: InputExerciseContextValue = {
		// Input system.
		input, setInput,
		registerField, setFieldValue,

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
