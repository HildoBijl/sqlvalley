import type { ReactNode } from 'react'

import type { InputExerciseRawInput, InputExerciseSolution } from '@step-wise/input-exercises'

export interface InputExerciseProviderProps {
	children: ReactNode
	toRawInput?: (solution: InputExerciseSolution) => InputExerciseRawInput
}

export interface InputExerciseContextValue {
	input: InputExerciseRawInput | undefined
	setInput: (input: InputExerciseRawInput | undefined) => void
	solution: InputExerciseSolution | undefined
	insertSolution: (() => void) | undefined
}
