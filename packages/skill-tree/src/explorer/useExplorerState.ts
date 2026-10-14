import { type MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGesture } from '@use-gesture/react'

import { type Rectangle, type VectorLike, ensureVector, Rectangle as RectangleClass } from '@step-wise/geometry'
import { clamp } from '@step-wise/js-utils'
import { useElementSize } from '@step-wise/react-utils'

import type { ExplorerOptions, ExplorerState, ExplorerTransform, FocusPositionOptions } from './types'

interface ViewportSize {
	width: number
	height: number
}

interface TransformLimits {
	left: number
	right: number
	top: number
	bottom: number
}

interface UseExplorerStateOptions extends Required<Omit<ExplorerOptions, 'initialFocus'>> {
	initialFocus?: VectorLike
}

export function useExplorerState({ bounds, initialFocus, initialScale, minScale, maxScale, dragOverflow, allowZoom }: UseExplorerStateOptions) {
	// Check the given input.
	if (minScale < 0) throw new Error('Explorer minScale cannot be negative.')
	if (maxScale < minScale) throw new Error('Explorer maxScale cannot be smaller than minScale.')
	if (dragOverflow < 0) throw new Error('Explorer dragOverflow cannot be negative.')

	const rootRef = useRef<HTMLDivElement>(null)
	const suppressClickRef = useRef(false)
	const configurationRef = useRef('')
	const viewportSize = useElementSize(rootRef)
	const focus = initialFocus
		? ensureVector(initialFocus, { dimension: 2 })
		: bounds.min.add([bounds.width / 2, bounds.height / 2])
	const [transform, setTransform] = useState<ExplorerTransform>({ x: 0, y: 0, scale: initialScale })
	const transformRef = useRef(transform)
	const optionsRef = useRef({ bounds, focus, initialScale, minScale, maxScale, dragOverflow, viewportSize })
	optionsRef.current = { bounds, focus, initialScale, minScale, maxScale, dragOverflow, viewportSize }
	const allowZoomRef = useRef(allowZoom)
	allowZoomRef.current = allowZoom

	const updateTransform = useCallback((getTransform: (current: ExplorerTransform) => ExplorerTransform) => {
		setTransform(current => {
			const next = getTransform(current)
			transformRef.current = next
			return next
		})
	}, [])

	const constrainTransform = useCallback((next: ExplorerTransform) => {
		const options = optionsRef.current
		if (!options.viewportSize) return next
		const scaleLimits = getScaleLimits(options.bounds, options.viewportSize, options.minScale, options.maxScale, options.dragOverflow)
		const scale = clamp(next.scale, scaleLimits.min, scaleLimits.max)
		const limits = getTransformLimits(options.bounds, options.viewportSize, scale, options.dragOverflow)
		return {
			x: clamp(next.x, limits.left, limits.right),
			y: clamp(next.y, limits.top, limits.bottom),
			scale,
		}
	}, [])

	const getFocusedTransform = useCallback((positionInput: VectorLike, scaleInput: number) => {
		const options = optionsRef.current
		const position = ensureVector(positionInput, { dimension: 2 })
		if (!options.viewportSize) return { x: 0, y: 0, scale: scaleInput }
		return constrainTransform({
			x: options.viewportSize.width / 2 - (position.x - options.bounds.min.x) * scaleInput,
			y: options.viewportSize.height / 2 - (position.y - options.bounds.min.y) * scaleInput,
			scale: scaleInput,
		})
	}, [constrainTransform])

	// Center the configured focus initially and whenever the drawing configuration changes. On viewport resizes, retain and constrain the current transform.
	useEffect(() => {
		if (!viewportSize) return
		const configuration = [bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y, focus.x, focus.y, initialScale, minScale, maxScale, dragOverflow].join(':')
		if (configurationRef.current !== configuration) {
			configurationRef.current = configuration
			updateTransform(() => getFocusedTransform([focus.x, focus.y], initialScale))
			return
		}
		updateTransform(current => constrainTransform(current))
	}, [bounds, constrainTransform, dragOverflow, focus.x, focus.y, getFocusedTransform, initialScale, maxScale, minScale, updateTransform, viewportSize])

	// Apply mouse-wheel zooming to the complete explorer viewport.
	useEffect(() => {
		const element = rootRef.current
		if (!element) return
		const handleWheel = (event: WheelEvent) => {
			if (!allowZoomRef.current) return
			event.preventDefault()
			const factor = event.deltaY > 0 ? 0.95 : 1.05
			updateTransform(current => constrainTransform({ ...current, scale: current.scale * factor }))
		}
		element.addEventListener('wheel', handleWheel, { passive: false })
		return () => element.removeEventListener('wheel', handleWheel)
	}, [constrainTransform, updateTransform])

	// Set up dragging and pinch zooming for the explorer content.
	const bind = useGesture(
		{
			onDrag: ({ offset: [x, y], tap }) => {
				if (!tap) suppressClickRef.current = true
				updateTransform(current => ({ ...current, x, y }))
			},
			onPinch: ({ offset: [scale] }) => {
				if (!allowZoomRef.current) return
				updateTransform(current => constrainTransform({ ...current, scale }))
			},
		},
		{
			drag: {
				from: () => [transformRef.current.x, transformRef.current.y],
				filterTaps: true,
				pointer: { touch: true },
				bounds: () => {
					const options = optionsRef.current
					if (!options.viewportSize) return { left: 0, right: 0, top: 0, bottom: 0 }
					return getTransformLimits(options.bounds, options.viewportSize, transformRef.current.scale, options.dragOverflow)
				},
				rubberband: true,
			},
			pinch: {
				scaleBounds: () => {
					const options = optionsRef.current
					if (!options.viewportSize) return { min: options.minScale, max: options.maxScale }
					return getScaleLimits(options.bounds, options.viewportSize, options.minScale, options.maxScale, options.dragOverflow)
				},
				from: () => [transformRef.current.scale, 0],
				pointer: { touch: true },
				pinchOnWheel: false,
			},
		},
	)

	// Start every pointer interaction without stale click suppression from an earlier drag.
	const handlePointerDownCapture = useCallback(() => { suppressClickRef.current = false }, [])

	// Prevent a drag ending over a link from activating that link.
	const handleClickCapture = useCallback((event: MouseEvent) => {
		if (!suppressClickRef.current) return
		event.preventDefault()
		event.stopPropagation()
		suppressClickRef.current = false
	}, [])

	const zoomBy = useCallback((factor: number) => {
		updateTransform(current => constrainTransform({ ...current, scale: current.scale * factor }))
	}, [constrainTransform, updateTransform])

	const reset = useCallback(() => {
		const options = optionsRef.current
		updateTransform(() => getFocusedTransform(options.focus, options.initialScale))
	}, [getFocusedTransform, updateTransform])

	const focusPosition = useCallback((position: VectorLike, options: FocusPositionOptions = {}) => {
		updateTransform(current => getFocusedTransform(position, options.scale ?? current.scale))
	}, [getFocusedTransform, updateTransform])

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
	return { bind, handleClickCapture, handlePointerDownCapture, rootRef, state }
}

// Determine the real min/max scale settings, given minScale and maxScale settings, content bounds and viewport sizes.
function getScaleLimits(bounds: Rectangle, viewport: ViewportSize, minScale: number, maxScale: number, dragOverflow: number) {
	const fitScale = Math.min(viewport.width / (bounds.width + 2 * dragOverflow), viewport.height / (bounds.height + 2 * dragOverflow))
	return { min: Math.min(maxScale, Math.max(minScale, fitScale)), max: maxScale }
}

// Determine the min/max values for x and y, given a scale, content bounds and viewport sizes.
function getTransformLimits(bounds: Rectangle, viewport: ViewportSize, scale: number, dragOverflow: number): TransformLimits {
	const width = bounds.width * scale
	const height = bounds.height * scale
	const overflow = dragOverflow * scale
	const horizontalEnd = viewport.width - width - overflow
	const verticalEnd = viewport.height - height - overflow
	const [left, right] = [Math.min(overflow, horizontalEnd), Math.max(overflow, horizontalEnd)]
	const [top, bottom] = [Math.min(overflow, verticalEnd), Math.max(overflow, verticalEnd)]
	return { left, right, top, bottom }
}
