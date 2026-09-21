import { useCallback } from 'react'

import { useExerciseManager } from '@sqlvalley/exercise-manager'

import type { MonoExerciseRenderSpec } from './specifications'

// Showing a solution updates the draft through the same conversion as editor input.
export function useShowSolution<Parameters extends Record<string, unknown>, Input>(
	spec: Pick<MonoExerciseRenderSpec<Parameters, Input>, 'getSolutionInput' | 'toRawInput'>,
	parameters: Parameters,
): (() => void) | undefined {
	const { pending, controls: { setDraftInput } } = useExerciseManager()
	const { getSolutionInput, toRawInput } = spec
	const showSolution = useCallback(() => {
		if (pending || !getSolutionInput) return
		setDraftInput(toRawInput(getSolutionInput(parameters)))
	}, [pending, getSolutionInput, toRawInput, parameters, setDraftInput])
	return getSolutionInput ? showSolution : undefined
}
