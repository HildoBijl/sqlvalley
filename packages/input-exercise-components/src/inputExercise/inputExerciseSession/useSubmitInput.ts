import { useCallback, useRef } from 'react'

import type { PlainDataObject } from '@step-wise/js-utils'
import { isExerciseDone } from '@step-wise/exercise-definition'
import type { InputValueMap } from '@step-wise/input-interpretation'
import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

interface SubmitInputOptions {
	input: PlainDataObject | undefined
	normalizeInput: (input: PlainDataObject) => InputValueMap
	isSubmitButtonEnabled: boolean
	canSubmitCurrentInput: (input: PlainDataObject) => boolean
}

export function useSubmitInput({ input, normalizeInput, isSubmitButtonEnabled, canSubmitCurrentInput }: SubmitInputOptions) {
	const { currentExercise: { instance }, controls } = useExerciseSessionContext()
	const submitInProgress = useRef(false)

	return useCallback(async () => {
		if (isExerciseDone(instance) || !isSubmitButtonEnabled || submitInProgress.current || !input || !canSubmitCurrentInput(input)) return
		submitInProgress.current = true
		try {
			await controls.submitAction({ type: 'input', input: normalizeInput(input) })
		} finally {
			submitInProgress.current = false
		}
	}, [instance, controls, input, normalizeInput, isSubmitButtonEnabled, canSubmitCurrentInput])
}
