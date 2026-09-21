import { useCallback } from 'react'
import { Alert, Typography } from '@mui/material'

import { getCurrentState } from '@step-wise/exercise-definition'
import { isInputExercise } from '@step-wise/input-exercises'
import { useExerciseSessionContext, useModuleContext } from '@sqlvalley/exercise-manager'

import type { InputExerciseContextValue, InputExerciseProviderProps } from './types'
import { InputExerciseContext } from './context'
import { type SolutionDefinition, useInputExerciseSolution } from './useInputExerciseSolution'

export function InputExerciseProvider({ children, toRawInput }: InputExerciseProviderProps) {
	const { currentExercise: { definition, instance }, controls, submitting, admin: { showControls } } = useExerciseSessionContext()
	if (!isInputExercise(definition)) throw new Error('InputExerciseProvider requires an input-exercise definition.')

	// Determine the solution for the exercise.
	const state = getCurrentState(instance)
	const moduleContext = useModuleContext()
	const { solution, solutionLoading, solutionError } = useInputExerciseSolution(definition as SolutionDefinition, instance.parameters, state, moduleContext, !moduleContext?.loading && !moduleContext?.error)

	// Set up a control function that can insert the correct solution.
	const insertSolution = useCallback(() => {
		if (!showControls || submitting || !solution || !toRawInput) return
		controls.setDraftInput(toRawInput(solution))
	}, [showControls, submitting, solution, toRawInput, controls])

	// In case not all data is available, show a note with the problem.
	if (moduleContext?.error) return <Alert severity="error">{moduleContext.error.message}</Alert>
	if (solutionError) return <Alert severity="error">{solutionError.message}</Alert>
	if (moduleContext?.loading || solutionLoading) return <Typography color="text.secondary">Loading the solution...</Typography>
	if (definition.getSolution && !solution) return <Alert severity="error">No solution is available for this exercise.</Alert>

	// Set up the value for the InputExerciseContext.
	const contextValue: InputExerciseContextValue = {
		input: instance.draftInput,
		setInput: controls.setDraftInput,
		solution,
		insertSolution: showControls && solution && toRawInput ? insertSolution : undefined,
	}

	// Render the exercise Component, wrapped in the context provider.
	return <InputExerciseContext.Provider value={contextValue}>
		{children}
	</InputExerciseContext.Provider>
}
