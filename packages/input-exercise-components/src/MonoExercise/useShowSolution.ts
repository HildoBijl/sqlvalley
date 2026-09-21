import { useCallback } from 'react'

import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

import type { MonoExerciseRenderSpec } from './specifications'

// Showing a solution updates the draft through the same conversion as editor input.
export function useShowSolution<Parameters extends Record<string, unknown>, Input>(
	spec: Pick<MonoExerciseRenderSpec<Parameters, Input>, 'getSolutionInput' | 'toRawInput'>,
	parameters: Parameters,
): (() => void) | undefined {
	const { submitting, controls: { setDraftInput } } = useExerciseSessionContext()
	const { getSolutionInput, toRawInput } = spec
	const showSolution = useCallback(() => {
		if (submitting || !getSolutionInput) return
		setDraftInput(toRawInput(getSolutionInput(parameters)))
	}, [submitting, getSolutionInput, toRawInput, parameters, setDraftInput])
	return getSolutionInput ? showSolution : undefined
}
