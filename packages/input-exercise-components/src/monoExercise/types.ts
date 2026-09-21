import type { MonoExerciseState } from '@step-wise/input-exercises'

export type MonoExerciseFeedbackType = 'success' | 'info' | 'warning' | 'error'

export interface MonoExerciseReport {
	message: string
	type: MonoExerciseFeedbackType
	result?: unknown
}

export interface MonoExerciseProblemProps<Parameters extends Record<string, unknown>> {
	parameters: Parameters
}

export interface MonoExerciseInputProps<Parameters extends Record<string, unknown>, Input> {
	parameters: Parameters
	value: Input
	disabled: boolean
	onChange: (value: Input) => void
	onSubmit: () => void
}

export interface MonoExerciseSolutionProps<Parameters extends Record<string, unknown>> {
	parameters: Parameters
	state: MonoExerciseState
}

export interface MonoExerciseOutputProps<
	Parameters extends Record<string, unknown>,
	Input,
	CheckResult,
> {
	parameters: Parameters
	input: Input
	result: CheckResult | null
	state: MonoExerciseState
}
