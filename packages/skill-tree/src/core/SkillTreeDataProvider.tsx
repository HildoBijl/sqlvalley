import { type ReactNode, useMemo } from 'react'

import { SkillTreeDataContext } from './context.ts'
import type { SkillTreeData } from './types.ts'

export interface SkillTreeDataProviderProps extends SkillTreeData {
	children: ReactNode
}

export function SkillTreeDataProvider({ moduleTree, modulePresentation, modulePositioning, children }: SkillTreeDataProviderProps) {
	const value = useMemo(() => ({ moduleTree, modulePresentation, modulePositioning }), [moduleTree, modulePresentation, modulePositioning])
	return <SkillTreeDataContext value={value}>{children}</SkillTreeDataContext>
}
