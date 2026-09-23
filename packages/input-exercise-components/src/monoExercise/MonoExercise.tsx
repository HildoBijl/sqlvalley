import type { ComponentType } from 'react'
import { Box } from '@mui/material'

import { InputExerciseProvider, useInputExerciseContext } from '../inputExercise'

import { useMonoExercise } from './useMonoExercise'
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
	const { parameters, state, input, complete, submitting } = useMonoExercise()
	const { submitInput } = useInputExerciseContext()

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
