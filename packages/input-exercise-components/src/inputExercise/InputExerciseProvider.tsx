import { Alert, Typography } from '@mui/material'

import { getCurrentState } from '@step-wise/exercise-definition'
import { isInputExercise } from '@step-wise/input-exercises'
import { useExerciseSessionContext, useModuleContext } from '@sqlvalley/exercise-manager'

import type { InputExerciseContextValue, InputExerciseProviderProps } from './types'
import { InputExerciseContext } from './context'
import { useExerciseInput } from './useExerciseInput'
import { useInputFields } from './useInputFields'
import { type SolutionDefinition, useInputExerciseSolution } from './useInputExerciseSolution'

export function InputExerciseProvider({ children }: InputExerciseProviderProps) {
	const { currentExercise: { definition, instance }, controls, submitting, admin: { showControls } } = useExerciseSessionContext()
	if (!isInputExercise(definition)) throw new Error('InputExerciseProvider requires an input-exercise definition.')

	// Set up input setting and field registration.
	const { input, setInput, mergeInput } = useExerciseInput({ input: instance.draftInput, setDraftInput: controls.setDraftInput })
	const { fields, registerField, setFieldValue } = useInputFields({ valueOperations: definition.valueOperations, mergeInput })

	// Determine the solution for the exercise.
	const state = getCurrentState(instance)
	const moduleContext = useModuleContext()
	const { solution, solutionLoading, solutionError, insertSolution } = useInputExerciseSolution({
		definition: definition as SolutionDefinition,
		parameters: instance.parameters,
		state,
		context: moduleContext,
		enabled: !moduleContext?.loading && !moduleContext?.error,
		fields,
		mergeInput,
		showControls,
		submitting,
	})

	// In case not all data is available, show a note with the problem.
	if (moduleContext?.error) return <Alert severity="error">{moduleContext.error.message}</Alert>
	if (solutionError) return <Alert severity="error">{solutionError.message}</Alert>
	if (moduleContext?.loading || solutionLoading) return <Typography color="text.secondary">Loading the solution...</Typography>
	if (definition.getSolution && !solution) return <Alert severity="error">No solution is available for this exercise.</Alert>

	// Bundle relevant context values into a context.
	const contextValue: InputExerciseContextValue = {
		input,
		setInput,
		registerField,
		setFieldValue,
		solution,
		insertSolution,
	}

	// Wrap the provider around the contents.
	return <InputExerciseContext.Provider value={contextValue}>
		{children}
	</InputExerciseContext.Provider>
}
