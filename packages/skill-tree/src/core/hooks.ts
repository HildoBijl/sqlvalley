import { useContext } from 'react'

import { SkillTreeDataContext } from './context'

export function useSkillTreeData() {
	const data = useContext(SkillTreeDataContext)
	if (!data) throw new Error('useSkillTreeData must be used within a SkillTreeDataProvider.')
	return data
}
