import { type ReactNode, type PointerEvent, useCallback, useMemo, useState } from 'react'

import { type ModuleId, getRequiredModuleIds } from '@step-wise/module-tree-definition'

import { useSkillTreeData } from '../core'

import { SkillTreeInteractionContext } from './context'

export interface SkillTreeInteractionProviderProps {
	children: ReactNode
	getModuleHref: (id: ModuleId) => string
}

export function SkillTreeInteractionProvider({ children, getModuleHref }: SkillTreeInteractionProviderProps) {
	const { moduleTree } = useSkillTreeData()

	// Set up a state to track the hovered module.
	const [hoveredModuleId, setHoveredModuleId] = useState<ModuleId | null>(null)
	const startModuleHover = useCallback((id: ModuleId) => setHoveredModuleId(id), [])
	const endModuleHover = useCallback(() => setHoveredModuleId(null), [])

	// Cache the prerequisites of the hovered module.
	const hoveredPrerequisiteIds = useMemo(() => {
		if (!hoveredModuleId) return new Set<ModuleId>()
		const prerequisiteIds = new Set(getRequiredModuleIds(moduleTree, [hoveredModuleId]))
		prerequisiteIds.delete(hoveredModuleId)
		return prerequisiteIds
	}, [hoveredModuleId, moduleTree])

	// On touchscreens, use the first tap to reveal dependencies and allow the second tap to follow the link.
	const handleModulePointerDown = useCallback((id: ModuleId, event: PointerEvent) => {
		if (event.pointerType !== 'touch' || hoveredModuleId === id) return
		event.preventDefault()
		startModuleHover(id)
	}, [hoveredModuleId, startModuleHover])

	// Bundle everything in an object and publish it in a context.
	const value = useMemo(() => ({ startModuleHover, endModuleHover, hoveredModuleId, hoveredPrerequisiteIds, handleModulePointerDown, getModuleHref }), [startModuleHover, endModuleHover, hoveredModuleId, hoveredPrerequisiteIds, handleModulePointerDown, getModuleHref])
	return <SkillTreeInteractionContext value={value}>{children}</SkillTreeInteractionContext>
}
