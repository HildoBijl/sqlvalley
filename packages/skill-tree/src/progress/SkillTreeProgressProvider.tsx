import { type ReactNode, useMemo } from 'react'

import type { IsModuleCompleted } from './types.ts'
import { SkillTreeProgressContext } from './context.ts'

export interface SkillTreeProgressProviderProps {
	children: ReactNode
	isModuleCompleted?: IsModuleCompleted
}

export function SkillTreeProgressProvider({ children, isModuleCompleted }: SkillTreeProgressProviderProps) {
	const value = useMemo(() => ({
		isModuleCompleted: isModuleCompleted ?? (() => false),
		isProgressTracked: isModuleCompleted !== undefined,
	}), [isModuleCompleted])
	return <SkillTreeProgressContext value={value}>{children}</SkillTreeProgressContext>
}
