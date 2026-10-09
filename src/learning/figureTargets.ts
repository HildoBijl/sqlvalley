import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { type DrawingTextTargetOptions, useDrawingTarget, useDrawingTargetBounds, useDrawingTextTarget } from '@step-wise/drawing'

// Register a figure element, retaining its node for annotations inside its contents.
export function useFigureTarget<T extends HTMLElement = HTMLDivElement>(name: string) {
	const register = useDrawingTarget<T>(name)
	const ref = useRef<T | null>(null)
	const registeredNode = useRef<T | null>(null)
	const [element, setElement] = useState<T | null>(null)
	// Read forwarded refs after child layout effects, without registering transient ref resets.
	// eslint-disable-next-line react-hooks/exhaustive-deps -- Check each commit for a replaced node; the identity guard prevents repeated updates.
	useLayoutEffect(() => {
		if (registeredNode.current === ref.current) return
		register(null)
		register(ref.current)
		registeredNode.current = ref.current
		setElement(ref.current)
	})
	useEffect(() => () => {
		register(null)
		registeredNode.current = null
	}, [register])
	const bounds = useDrawingTargetBounds(name)
	return [ref, bounds, element] as const
}

// Editors and tables can replace text nodes after their containing element mounts.
export function useFigureTextBounds(name: string, element: HTMLElement | null, text: string, options?: DrawingTextTargetOptions) {
	const [revision, setRevision] = useState(0)
	useEffect(() => {
		if (!element) return
		const observer = new MutationObserver(() => setRevision(current => current + 1))
		observer.observe(element, { childList: true, characterData: true, subtree: true })
		return () => observer.disconnect()
	}, [element])
	const container = useMemo(() => ({ current: element, revision }), [element, revision])
	useDrawingTextTarget(text ? name : undefined, container, text, options)
	return useDrawingTargetBounds(name)
}
