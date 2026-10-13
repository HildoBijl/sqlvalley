import { useContext } from 'react'

import { SkillTreeProgressContext } from './context'

export function useSkillTreeProgress() {
	const progress = useContext(SkillTreeProgressContext)
	if (!progress) throw new Error('useSkillTreeProgress must be used within a SkillTreeProgressProvider.')
	return progress
}
