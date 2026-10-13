import { type ReactNode, useMemo } from 'react'

import type { IsModuleCompleted } from './types'
import { SkillTreeProgressContext } from './context'

interface SkillTreeProgressProviderProps {
	children: ReactNode
	isCompleted?: IsModuleCompleted
}

export function SkillTreeProgressProvider({ children, isCompleted }: SkillTreeProgressProviderProps) {
	const value = useMemo(() => ({
		isCompleted: isCompleted ?? (() => false),
		hasProgress: isCompleted !== undefined,
	}), [isCompleted])
	return <SkillTreeProgressContext value={value}>{children}</SkillTreeProgressContext>
}
