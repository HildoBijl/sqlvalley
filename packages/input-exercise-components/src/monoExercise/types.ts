import type { PlainDataObject } from '@step-wise/js-utils'
import type { ExerciseParameters } from '@step-wise/exercise-definition'
import type { MonoExerciseState } from '@step-wise/input-exercises'

export interface MonoExerciseProblemProps {
	parameters: ExerciseParameters
}

export interface MonoExerciseInputAreaProps {
	parameters: ExerciseParameters
	disabled: boolean
	onSubmit: () => void
}

export interface MonoExerciseSolutionProps {
	parameters: ExerciseParameters
}

export interface MonoExerciseInputVisualizationProps {
	parameters: ExerciseParameters
	state: MonoExerciseState
	input: PlainDataObject | undefined
}

export interface MonoExercisePromptProps {
	parameters: ExerciseParameters
}

export interface MonoExercisePayoffProps {
	parameters: ExerciseParameters
}
