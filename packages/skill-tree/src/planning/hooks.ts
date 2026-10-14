import { useContext } from 'react'

import { SkillTreePlanningContext } from './context'

export function useSkillTreePlanning() {
	const planning = useContext(SkillTreePlanningContext)
	if (!planning) throw new Error('useSkillTreePlanning must be used within a SkillTreePlanningProvider.')
	return planning
}
