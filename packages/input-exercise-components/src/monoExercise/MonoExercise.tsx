import type { ComponentType } from 'react'
import { Alert, Box } from '@mui/material'

import { InputExerciseProvider } from '../inputExercise'

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
	const { parameters, state, input, feedback, report, complete, submitting, handleSubmit } = useMonoExercise()

	return <Box>
		<MonoExerciseSection title="Exercise">
			<Problem parameters={parameters} />
		</MonoExerciseSection>
		<InputArea parameters={parameters} disabled={complete || submitting} onSubmit={handleSubmit} />
		{feedback ? <Alert severity={feedback.type} sx={{ mt: 1.5 }}>{feedback.message}</Alert> : null}
		<ExerciseControls onSubmit={handleSubmit} />
		{InputVisualization ? <InputVisualization parameters={parameters} input={input} report={report} state={state} /> : null}
		{complete ? <MonoExerciseSection title="Solution" collapsible>
			<Solution parameters={parameters} state={state} />
		</MonoExerciseSection> : null}
	</Box>
}
