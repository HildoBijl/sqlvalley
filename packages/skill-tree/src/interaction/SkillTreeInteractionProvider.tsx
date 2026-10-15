import { type MouseEvent, type ReactNode, type PointerEvent, useCallback, useMemo, useRef, useState } from 'react'

import { type ModuleId, getRequiredModuleIds } from '@step-wise/module-tree-definition'

import { useSkillTreeData } from '../core'

import { SkillTreeInteractionContext } from './context'

export interface SkillTreeInteractionProviderProps {
	children: ReactNode
	getModuleHref: (id: ModuleId) => string
}

export function SkillTreeInteractionProvider({ children, getModuleHref }: SkillTreeInteractionProviderProps) {
	const { moduleTree } = useSkillTreeData()

	// Set up a state to track the highlighted module.
	const [highlightedModuleId, setHighlightedModuleId] = useState<ModuleId | null>(null)
	const touchedModuleIdRef = useRef<ModuleId | null>(null)
	const blockedTouchClickIdRef = useRef<ModuleId | null>(null)
	const highlightModule = useCallback((id: ModuleId) => setHighlightedModuleId(id), [])
	const clearModuleHighlight = useCallback(() => {
		touchedModuleIdRef.current = null
		setHighlightedModuleId(null)
	}, [])

	// Cache the prerequisites of the highlighted module.
	const highlightedPrerequisiteIds = useMemo(() => {
		if (!highlightedModuleId) return new Set<ModuleId>()
		const prerequisiteIds = new Set(getRequiredModuleIds(moduleTree, [highlightedModuleId]))
		prerequisiteIds.delete(highlightedModuleId)
		return prerequisiteIds
	}, [highlightedModuleId, moduleTree])

	// On touchscreens, mark the first tap for suppression and reveal the module dependencies.
	const handleModulePointerDown = useCallback((id: ModuleId, event: PointerEvent) => {
		if (event.pointerType !== 'touch') {
			touchedModuleIdRef.current = null
			blockedTouchClickIdRef.current = null
			return
		}
		if (touchedModuleIdRef.current === id) {
			blockedTouchClickIdRef.current = null
			return
		}
		blockedTouchClickIdRef.current = id
		touchedModuleIdRef.current = id
		highlightModule(id)
	}, [highlightModule])

	// Suppress the link belonging to a first touch tap. A second tap and mouse clicks retain native link behavior.
	const handleModuleClick = useCallback((id: ModuleId, event: MouseEvent) => {
		if (blockedTouchClickIdRef.current !== id) return
		event.preventDefault()
		blockedTouchClickIdRef.current = null
	}, [])

	// Bundle everything in an object and publish it in a context.
	const value = useMemo(() => ({ highlightModule, clearModuleHighlight, highlightedModuleId, highlightedPrerequisiteIds, handleModulePointerDown, handleModuleClick, getModuleHref }), [highlightModule, clearModuleHighlight, highlightedModuleId, highlightedPrerequisiteIds, handleModulePointerDown, handleModuleClick, getModuleHref])
	return <SkillTreeInteractionContext value={value}>{children}</SkillTreeInteractionContext>
}
