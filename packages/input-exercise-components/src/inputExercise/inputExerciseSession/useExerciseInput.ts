import { type SetStateAction, useCallback } from 'react'

import type { PlainDataObject } from '@step-wise/js-utils'
import { useLatestRef } from '@step-wise/react-utils'

interface ExerciseInputOptions {
	input: PlainDataObject | undefined
	setDraftInput: (input: PlainDataObject | undefined) => void
}

export function useExerciseInput({ input, setDraftInput }: ExerciseInputOptions) {
	const draft = useLatestRef(input)

	// Resolve updates against the latest draft, including writes before a rerender.
	const setInput = useCallback((update: SetStateAction<PlainDataObject | undefined>) => {
		const value = typeof update === 'function' ? update(draft.current) : update
		draft.current = value
		setDraftInput(value)
	}, [draft, setDraftInput])

	// Add input values to the input object.
	const mergeInput = useCallback((values: PlainDataObject) => {
		setInput(current => ({ ...current, ...values }))
	}, [setInput])

	// All done.
	return { input, setInput, mergeInput }
}
