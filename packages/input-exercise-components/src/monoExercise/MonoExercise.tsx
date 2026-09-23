import type { ComponentType } from 'react'
import { Box } from '@mui/material'

import { getCurrentState, isStateDone } from '@step-wise/exercise-definition'
import { type MonoExerciseState, isMonoExercise } from '@step-wise/input-exercises'
import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { InputExerciseProvider, useInputExerciseContext } from '../inputExercise'

import { ExerciseControls, MonoExerciseSection } from './components'
import type { MonoExerciseInputAreaProps, MonoExerciseInputVisualizationProps, MonoExerciseProblemProps, MonoExerciseSolutionProps } from './types'

export interface MonoExerciseProps {
	Problem: ComponentType<MonoExerciseProblemProps>
	InputArea: ComponentType<MonoExerciseInputAreaProps>
	Solution: ComponentType<MonoExerciseSolutionProps>
	InputVisualization?: ComponentType<MonoExerciseInputVisualizationProps>
}

export function MonoExercise(props: MonoExerciseProps) {
	return <InputExerciseProvider>
		<MonoExerciseContent {...props} />
	</InputExerciseProvider>
}

function MonoExerciseContent({ Problem, InputArea, Solution, InputVisualization }: MonoExerciseProps) {
	// Extract and verify data from contexts.
	const { currentExercise: { definition, instance: exerciseInstance }, submitting } = useExerciseSessionContext()
	if (!isMonoExercise(definition)) throw new Error('MonoExercise requires a mono-exercise definition.')
	const { input, submitInput } = useInputExerciseContext()

	// Extract exercise status.
	const parameters = exerciseInstance.parameters
	const state = getCurrentState(exerciseInstance) as MonoExerciseState
	const complete = isStateDone(state)

	// Render the exercise.
	return <Box>
		<MonoExerciseSection title="Exercise">
			<Problem parameters={parameters} />
		</MonoExerciseSection>
		<InputArea parameters={parameters} disabled={complete || submitting} onSubmit={submitInput} />
		<ExerciseControls />
		{InputVisualization ? <InputVisualization parameters={parameters} input={input} state={state} /> : null}
		{complete ? <MonoExerciseSection title="Solution" collapsible>
			<Solution parameters={parameters} state={state} />
		</MonoExerciseSection> : null}
	</Box>
}
