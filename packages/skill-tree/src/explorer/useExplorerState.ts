import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGesture } from '@use-gesture/react'

import { type Rectangle, type VectorLike, ensureVector, Rectangle as RectangleClass } from '@step-wise/geometry'
import { useElementSize } from '@step-wise/react-utils'

import type { ExplorerState, ExplorerTransform, FocusPositionOptions } from './types'

const minScale = 0.5
const maxScale = 2
const dragOverflow = 250

interface UseExplorerStateOptions {
	bounds: Rectangle
	initialScale: number
	allowZoom: boolean
}

export function useExplorerState({ bounds, initialScale, allowZoom }: UseExplorerStateOptions) {
	const rootRef = useRef<HTMLDivElement>(null)
	const viewportSize = useElementSize(rootRef)
	const [transform, setTransform] = useState<ExplorerTransform>({ x: 0, y: 0, scale: initialScale })
	const transformRef = useRef(transform)
	const allowZoomRef = useRef(allowZoom)
	allowZoomRef.current = allowZoom

	const updateTransform = useCallback((getTransform: (current: ExplorerTransform) => ExplorerTransform) => {
		setTransform(current => {
			const next = getTransform(current)
			transformRef.current = next
			return next
		})
	}, [])

	// Apply mouse-wheel zooming to the complete explorer viewport.
	useEffect(() => {
		const element = rootRef.current
		if (!element) return
		const handleWheel = (event: WheelEvent) => {
			if (!allowZoomRef.current) return
			event.preventDefault()
			const factor = event.deltaY > 0 ? 0.95 : 1.05
			updateTransform(current => ({ ...current, scale: clampScale(current.scale * factor) }))
		}
		element.addEventListener('wheel', handleWheel, { passive: false })
		return () => element.removeEventListener('wheel', handleWheel)
	}, [updateTransform])

	// Set up dragging and pinch zooming for the explorer content.
	const bind = useGesture(
		{
			onDrag: ({ offset: [x, y] }) => updateTransform(current => ({ ...current, x, y })),
			onPinch: ({ offset: [scale] }) => {
				if (!allowZoomRef.current) return
				updateTransform(current => ({ ...current, scale: clampScale(scale) }))
			},
		},
		{
			drag: {
				from: () => [transformRef.current.x, transformRef.current.y],
				filterTaps: true,
				pointer: { touch: true },
				bounds: () => {
					const width = viewportSize?.width ?? 0
					const height = viewportSize?.height ?? 0
					const scale = transformRef.current.scale
					return {
						left: Math.min(0, width - bounds.width * scale) - dragOverflow,
						right: dragOverflow,
						top: Math.min(0, height - bounds.height * scale) - dragOverflow,
						bottom: dragOverflow,
					}
				},
				rubberband: true,
			},
			pinch: {
				scaleBounds: { min: minScale, max: maxScale },
				from: () => [transformRef.current.scale, 0],
				pointer: { touch: true },
				pinchOnWheel: false,
			},
		},
	)

	const zoomBy = useCallback((factor: number) => {
		updateTransform(current => ({ ...current, scale: clampScale(current.scale * factor) }))
	}, [updateTransform])

	const reset = useCallback(() => {
		updateTransform(() => ({ x: 0, y: 0, scale: initialScale }))
	}, [initialScale, updateTransform])

	const focusPosition = useCallback((positionInput: VectorLike, options: FocusPositionOptions = {}) => {
		const position = ensureVector(positionInput, { dimension: 2 })
		const width = viewportSize?.width ?? 0
		const height = viewportSize?.height ?? 0
		updateTransform(current => {
			const scale = clampScale(options.scale ?? current.scale)
			return {
				x: width / 2 - (position.x - bounds.min.x) * scale,
				y: height / 2 - (position.y - bounds.min.y) * scale,
				scale,
			}
		})
	}, [bounds, updateTransform, viewportSize])

	// Express the visible viewport rectangle in drawing coordinates.
	const viewportBounds = useMemo(() => {
		if (!viewportSize) return bounds
		const { x, y, scale } = transform
		return new RectangleClass(
			[bounds.min.x - x / scale, bounds.min.y - y / scale],
			[bounds.min.x + (viewportSize.width - x) / scale, bounds.min.y + (viewportSize.height - y) / scale],
		)
	}, [bounds, transform, viewportSize])

	const state = useMemo<ExplorerState>(() => ({ allowZoom, transform, viewportBounds, zoomBy, reset, focusPosition }), [allowZoom, focusPosition, reset, transform, viewportBounds, zoomBy])
	return { bind, rootRef, state }
}

function clampScale(scale: number) {
	return Math.min(maxScale, Math.max(minScale, scale))
}
