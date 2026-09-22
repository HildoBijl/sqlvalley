import { useCallback, useRef } from 'react'

import { isExerciseDone } from '@step-wise/exercise-definition'
import type { InputExerciseRawInput } from '@step-wise/input-exercises'
import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

interface SubmitInputOptions {
	input: InputExerciseRawInput | undefined
	isSubmitButtonEnabled: boolean
	canSubmitCurrentInput: (input: InputExerciseRawInput) => boolean
}

export function useSubmitInput({ input, isSubmitButtonEnabled, canSubmitCurrentInput }: SubmitInputOptions) {
	const { currentExercise: { instance }, controls } = useExerciseSessionContext()
	const submitInProgress = useRef(false)

	return useCallback(async () => {
		if (isExerciseDone(instance) || !isSubmitButtonEnabled || submitInProgress.current || !input || !canSubmitCurrentInput(input)) return
		submitInProgress.current = true
		try {
			await controls.submitAction({ type: 'input', input })
		} finally {
			submitInProgress.current = false
		}
	}, [instance, controls, input, isSubmitButtonEnabled, canSubmitCurrentInput])
}
