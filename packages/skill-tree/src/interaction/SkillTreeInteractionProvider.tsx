import { type ReactNode, type PointerEvent, useCallback, useMemo, useState } from 'react'

import { type ModuleId, getRequiredModuleIds } from '@step-wise/module-tree-definition'

import { useSkillTreeData } from '../core'

import { SkillTreeInteractionContext } from './context'

interface SkillTreeInteractionProviderProps {
	onNavigate: (id: ModuleId) => void
	children: ReactNode
}

export function SkillTreeInteractionProvider({ children, onNavigate }: SkillTreeInteractionProviderProps) {
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

	// Set up a handler for a click on a module.
	const handleModulePointerDown = useCallback((id: ModuleId, event: PointerEvent, navigateImmediately = false) => {
		// On a mouse click, go to the module.
		if (event.pointerType === 'mouse' || navigateImmediately) {
			onNavigate(id)
			return
		}

		// On a tap: check if we already 'hovered' over the module. If so, go there too. Otherwise activate a 'hover'.
		if (hoveredModuleId === id) {
			onNavigate(id)
			endModuleHover()
		} else {
			startModuleHover(id)
		}
	}, [endModuleHover, hoveredModuleId, onNavigate, startModuleHover])

	// Bundle everything in an object and publish it in a context.
	const value = useMemo(() => ({ startModuleHover, endModuleHover, hoveredModuleId, hoveredPrerequisiteIds, handleModulePointerDown }), [endModuleHover, handleModulePointerDown, hoveredModuleId, hoveredPrerequisiteIds, startModuleHover])
	return <SkillTreeInteractionContext value={value}>{children}</SkillTreeInteractionContext>
}
