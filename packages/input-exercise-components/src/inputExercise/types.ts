import type { Dispatch, ReactNode, SetStateAction } from 'react'

import type { InputExerciseRawInput, InputExerciseSolution } from '@step-wise/input-exercises'

export interface InputExerciseProviderProps {
	children: ReactNode
}

export interface InputExerciseContextValue {
	input: InputExerciseRawInput | undefined
	setInput: Dispatch<SetStateAction<InputExerciseRawInput | undefined>>
	registerField: (name: string, type: string) => () => void
	setFieldValue: (name: string, type: string, value: unknown) => void
	solution: InputExerciseSolution | undefined
	insertSolution: (() => void) | undefined
}
