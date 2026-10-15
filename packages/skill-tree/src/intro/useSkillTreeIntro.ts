import { useCallback, useEffect, useState } from 'react'

import { type StateHandle, useControllableState } from '@step-wise/react-utils'

export interface SkillTreeIntroStateHandles {
	hasSeenIntro?: StateHandle<boolean>
}

export function useSkillTreeIntro(stateHandles?: SkillTreeIntroStateHandles, isStateReady = true) {
	const [hasSeenIntro, setHasSeenIntro] = useControllableState(stateHandles?.hasSeenIntro, false)
	const [showIntro, setShowIntro] = useState(false)

	// Show the introduction once the external state is ready, unless it was already shown before.
	useEffect(() => {
		if (!isStateReady || hasSeenIntro) return
		setShowIntro(true)
		setHasSeenIntro(true)
	}, [hasSeenIntro, isStateReady, setHasSeenIntro])

	// Return handlers to control the intro modal.
	const openIntro = useCallback(() => setShowIntro(true), [])
	const closeIntro = useCallback(() => setShowIntro(false), [])
	return { showIntro, openIntro, closeIntro }
}
