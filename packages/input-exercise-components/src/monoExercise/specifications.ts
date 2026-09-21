import type { ComponentType } from 'react'

import type { InputExerciseRawInput } from '@step-wise/input-exercises'

import type { MonoExerciseInputAreaProps, MonoExerciseInputVisualizationProps, MonoExerciseProblemProps, MonoExerciseSolutionProps } from './types'

export interface MonoExerciseRenderSpec<
	Parameters extends Record<string, unknown>,
	Input,
	CheckResult = unknown,
> {
	problemTitle?: string
	initialInput: Input
	toRawInput: (input: Input) => InputExerciseRawInput
	fromRawInput: (input: InputExerciseRawInput) => Input
	isInputEmpty?: (input: Input) => boolean
	canSubmit?: (args: { parameters: Parameters; input: Input; moduleContext: unknown }) => boolean
	canGiveUp?: (args: { parameters: Parameters; input: Input; moduleContext: unknown }) => boolean
	Problem: ComponentType<MonoExerciseProblemProps<Parameters>>
	InputArea: ComponentType<MonoExerciseInputAreaProps<Parameters, Input>>
	Solution: ComponentType<MonoExerciseSolutionProps<Parameters>>
	InputVisualization?: ComponentType<MonoExerciseInputVisualizationProps<Parameters, Input, CheckResult>>
}
