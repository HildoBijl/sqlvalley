import { Alert, Box } from '@mui/material'

import { InputExerciseProvider } from '../inputExercise'

import { useMonoExercise } from './useMonoExercise'
import { ExerciseControls } from './controls'
import { MonoExerciseSection } from './MonoExerciseSection'
import type { MonoExerciseRenderSpec } from './specifications'

interface MonoExerciseProps<
	Parameters extends Record<string, unknown>,
	Input,
	CheckResult,
> {
	spec: MonoExerciseRenderSpec<Parameters, Input, CheckResult>
}

export function MonoExercise<
	Parameters extends Record<string, unknown>,
	Input,
	CheckResult,
>({ spec }: MonoExerciseProps<Parameters, Input, CheckResult>) {
	return <InputExerciseProvider>
		<MonoExerciseContent spec={spec} />
	</InputExerciseProvider>
}

function MonoExerciseContent<Parameters extends Record<string, unknown>, Input, CheckResult>({ spec }: MonoExerciseProps<Parameters, Input, CheckResult>) {
	const { parameters, state, input, feedback, lastResult, complete, submitting, handleInputChange, handleSubmit } = useMonoExercise({ spec })
	const { Problem, InputArea, Solution, InputVisualization } = spec

	return (
		<Box>
			<MonoExerciseSection title={spec.problemTitle ?? 'Problem'}>
				<Problem parameters={parameters} />
			</MonoExerciseSection>
			<InputArea
				parameters={parameters}
				value={input}
				disabled={complete || submitting}
				onChange={handleInputChange}
				onSubmit={handleSubmit}
			/>
			{feedback ? <Alert severity={feedback.type} sx={{ mt: 1.5 }}>{feedback.message}</Alert> : null}
			<ExerciseControls spec={spec} onSubmit={handleSubmit} />
			{InputVisualization ? (
				<InputVisualization parameters={parameters} input={input} result={lastResult} state={state} />
			) : null}
			{complete ? <MonoExerciseSection title="Solution" collapsible>
				<Solution parameters={parameters} state={state} />
			</MonoExerciseSection> : null}
		</Box>
	)
}
