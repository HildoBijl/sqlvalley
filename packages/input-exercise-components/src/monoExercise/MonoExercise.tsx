import type { ComponentType } from 'react'
import { Box } from '@mui/material'

import { getCurrentState, isStateDone } from '@step-wise/exercise-definition'
import { isMonoExercise, isMonoExerciseState } from '@step-wise/input-exercises'
import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import { ExerciseSection } from '../ExerciseSection'
import { InputExerciseProvider, useInputExerciseContext } from '../inputExercise'

import { ExerciseControls } from './components'
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
	const state = getCurrentState(exerciseInstance)
	if (!isMonoExerciseState(state)) throw new Error('MonoExercise requires a mono-exercise state.')
	const complete = isStateDone(state)

	// Render the exercise.
	return <Box>
		<ExerciseSection title="Exercise">
			<Problem parameters={parameters} />
		</ExerciseSection>
		<InputArea parameters={parameters} disabled={complete || submitting} onSubmit={submitInput} />
		<ExerciseControls />
		{InputVisualization ? <InputVisualization parameters={parameters} input={input} state={state} /> : null}
		{complete ? <ExerciseSection title="Solution" collapsible>
			<Solution parameters={parameters} state={state} />
		</ExerciseSection> : null}
	</Box>
}
