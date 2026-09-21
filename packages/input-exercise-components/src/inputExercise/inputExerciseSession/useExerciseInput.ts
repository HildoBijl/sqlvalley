import { type SetStateAction, useCallback } from 'react'

import { useLatestRef } from '@step-wise/react-utils'
import type { InputExerciseRawInput } from '@step-wise/input-exercises'

interface ExerciseInputOptions {
	input: InputExerciseRawInput | undefined
	setDraftInput: (input: InputExerciseRawInput | undefined) => void
}

export function useExerciseInput({ input, setDraftInput }: ExerciseInputOptions) {
	const draft = useLatestRef(input)

	// Resolve updates against the latest draft, including writes before a rerender.
	const setInput = useCallback((update: SetStateAction<InputExerciseRawInput | undefined>) => {
		const value = typeof update === 'function' ? update(draft.current) : update
		draft.current = value
		setDraftInput(value)
	}, [draft, setDraftInput])

	// Add input values to the input object.
	const mergeInput = useCallback((values: InputExerciseRawInput) => {
		setInput(current => ({ ...current, ...values }))
	}, [setInput])

	// All done.
	return { input, setInput, mergeInput }
}
