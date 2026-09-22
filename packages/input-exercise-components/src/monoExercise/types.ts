import type { ExerciseParameters } from '@step-wise/exercise-definition'
import type { InputExerciseRawInput, InputExerciseReport, MonoExerciseState } from '@step-wise/input-exercises'

export interface MonoExerciseProblemProps {
	parameters: ExerciseParameters
}

export interface MonoExerciseInputAreaProps {
	parameters: ExerciseParameters
	disabled: boolean
	onSubmit: () => void
}

export interface MonoExerciseInputVisualizationProps {
	parameters: ExerciseParameters
	state: MonoExerciseState
	input: InputExerciseRawInput | undefined
	report: InputExerciseReport | undefined
}

export interface MonoExerciseSolutionProps {
	parameters: ExerciseParameters
	state: MonoExerciseState
}

/*
 * Feedback types: ToDo: move these to a sensible place after fixing the validation/feedback system.
 */

export type MonoExerciseFeedbackType = 'success' | 'info' | 'warning' | 'error'

export interface MonoExerciseReport {
	message: string
	type: MonoExerciseFeedbackType
	result?: unknown
}
