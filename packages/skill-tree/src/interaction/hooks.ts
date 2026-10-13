import { useContext } from 'react'

import { SkillTreeInteractionContext } from './context'

export function useSkillTreeInteraction() {
	const interaction = useContext(SkillTreeInteractionContext)
	if (!interaction) throw new Error('useSkillTreeInteraction must be used within a SkillTreeInteractionProvider.')
	return interaction
}
