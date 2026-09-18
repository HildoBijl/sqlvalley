import type { ComponentType } from 'react'

import type { InputExerciseRawInput } from '@step-wise/input-exercises'

import type { MonoExerciseInputProps, MonoExerciseOutputProps, MonoExerciseProblemProps, MonoExerciseSolutionProps } from './types'

export interface MonoExerciseRenderSpec<
	Parameters extends Record<string, unknown>,
	Input,
	CheckResult = unknown,
> {
	initialInput: Input
	toRawInput: (input: Input) => InputExerciseRawInput
	fromRawInput: (input: InputExerciseRawInput) => Input
	isInputEmpty?: (input: Input) => boolean
	canSubmit?: (args: { parameters: Parameters; input: Input; moduleContext: unknown }) => boolean
	canGiveUp?: (args: { parameters: Parameters; input: Input; moduleContext: unknown }) => boolean
	Problem: ComponentType<MonoExerciseProblemProps<Parameters>>
	Input: ComponentType<MonoExerciseInputProps<Parameters, Input>>
	Solution: ComponentType<MonoExerciseSolutionProps<Parameters>>
	Prompt?: ComponentType<MonoExerciseProblemProps<Parameters>>
	Payoff?: ComponentType<{ parameters: Parameters; result: CheckResult }>
	Output?: ComponentType<MonoExerciseOutputProps<Parameters, Input, CheckResult>>
}
