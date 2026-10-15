import { type MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGesture } from '@use-gesture/react'

import { type Rectangle, type VectorLike, ensureVector, Rectangle as RectangleClass, Vector } from '@step-wise/geometry'
import { clamp } from '@step-wise/js-utils'
import { useElementSize, useLatestRef } from '@step-wise/react-utils'

import type { ExplorerOptions, ExplorerState, ExplorerTransform } from './types'

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

interface PinchStart {
	transform: ExplorerTransform
	origin: Vector
}

interface UseExplorerStateOptions extends Required<Omit<ExplorerOptions, 'initialFocusPosition'>> {
	initialFocusPosition?: VectorLike
}

export function useExplorerState({ contentBounds, initialFocusPosition, initialScale, minScale, maxScale, contentPadding, allowZoom }: UseExplorerStateOptions) {
	// Check the given input.
	if (initialScale <= 0) throw new Error('Explorer initialScale must be positive.')
	if (minScale < 0) throw new Error('Explorer minScale cannot be negative.')
	if (maxScale <= 0) throw new Error('Explorer maxScale must be positive.')
	if (maxScale < minScale) throw new Error('Explorer maxScale cannot be smaller than minScale.')
	if (contentPadding < 0) throw new Error('Explorer contentPadding cannot be negative.')
	const initialFocusVector = initialFocusPosition ? ensureVector(initialFocusPosition, { dimension: 2 }) : contentBounds.min.add([contentBounds.width / 2, contentBounds.height / 2])

	// Extract the viewport size and focus.
	const rootRef = useRef<HTMLDivElement>(null)
	const viewportSize = useElementSize(rootRef)

	// Set up refs for data storage and passing
	const suppressClickRef = useRef(false)
	const configurationRef = useRef('')
	const optionsRef = useLatestRef({ contentBounds, viewportSize, initialScale, minScale, maxScale, contentPadding, allowZoom, initialFocusVector })

	/*
	* Transform: track and set the transform state.
	*/

	// Use a state to track the transform settings. Also publish them through a ref.
	const [transform, setTransform] = useState<ExplorerTransform>({ translation: new Vector(0, 0), scale: initialScale })
	const transformRef = useRef(transform)

	// Apply new transform settings, based on a function that adjusts it.
	const updateTransform = useCallback((getTransform: (current: ExplorerTransform) => ExplorerTransform) => {
		setTransform(current => {
			const next = getTransform(current)
			transformRef.current = next
			return next
		})
	}, [])

	// Constrain a requested scale to the effective limits of the current viewport.
	const constrainScale = useCallback((scale: number) => {
		const options = optionsRef.current
		if (!options.viewportSize) return clamp(scale, options.minScale, options.maxScale)
		const limits = getScaleLimits(options.contentBounds, options.viewportSize, options.minScale, options.maxScale, options.contentPadding)
		return clamp(scale, limits.min, limits.max)
	}, [optionsRef])

	// Contrain the transform settings to their min/max values.
	const constrainTransform = useCallback((next: ExplorerTransform) => {
		const options = optionsRef.current
		if (!options.viewportSize) return next
		const scaleLimits = getScaleLimits(options.contentBounds, options.viewportSize, options.minScale, options.maxScale, options.contentPadding)
		const scale = clamp(next.scale, scaleLimits.min, scaleLimits.max)
		const coordinateLimits = getCoordinateLimits(options.contentBounds, options.viewportSize, scale, options.contentPadding)
		return {
			translation: new Vector(
				clamp(next.translation.x, coordinateLimits.left, coordinateLimits.right),
				clamp(next.translation.y, coordinateLimits.top, coordinateLimits.bottom),
			),
			scale,
		}
	}, [optionsRef])

	// Apply an additional scaling factor around the viewport center.
	const zoomBy = useCallback((factor: number) => {
		updateTransform(current => {
			const viewport = optionsRef.current.viewportSize
			const scale = constrainScale(current.scale * factor)
			if (!viewport) return { ...current, scale }
			return constrainTransform(scaleAroundPoint(current, scale, new Vector(viewport.width / 2, viewport.height / 2)))
		})
	}, [constrainScale, constrainTransform, optionsRef, updateTransform])

	// Express the visible viewport rectangle in drawing coordinates based on the current transform.
	const visibleBounds = useMemo(() => {
		if (!viewportSize) return contentBounds
		const { translation, scale } = transform
		return new RectangleClass(
			[contentBounds.min.x - translation.x / scale, contentBounds.min.y - translation.y / scale],
			[contentBounds.min.x + (viewportSize.width - translation.x) / scale, contentBounds.min.y + (viewportSize.height - translation.y) / scale],
		)
	}, [contentBounds, transform, viewportSize])

	/*
	 * Focusing: jump to a specific point.
	 */

	// Calculate the transform that focuses the drawing on the given point, given a respective scale.
	const getFocusedTransform = useCallback((positionInput: VectorLike, scaleInput: number) => {
		const options = optionsRef.current
		const position = ensureVector(positionInput, { dimension: 2 })
		const scale = constrainScale(scaleInput)
		if (!options.viewportSize) return { translation: new Vector(0, 0), scale }
		return constrainTransform({
			translation: new Vector(
				options.viewportSize.width / 2 - (position.x - options.contentBounds.min.x) * scale,
				options.viewportSize.height / 2 - (position.y - options.contentBounds.min.y) * scale,
			),
			scale,
		})
	}, [constrainScale, constrainTransform, optionsRef])

	// Focus the drawing on the given location. Optionally, an extra scale may be given.
	const focusPosition = useCallback((position: VectorLike, scale?: number) => {
		updateTransform(current => getFocusedTransform(position, scale ?? current.scale))
	}, [getFocusedTransform, updateTransform])

	// Turn the explorer back to its initial focus and scale.
	const reset = useCallback(() => {
		const options = optionsRef.current
		focusPosition(options.initialFocusVector, options.initialScale)
	}, [optionsRef, focusPosition])

	/*
	 * Explorer event handlers.
	 */

	// Set up dragging and pinch zooming for the explorer content.
	const bind = useGesture(
		{
			onDrag: ({ offset: [x, y], tap }) => {
				if (!tap) suppressClickRef.current = true
				updateTransform(current => ({ ...current, translation: new Vector(x, y) }))
			},
			onPinch: ({ first, offset: [scale], origin: [clientX, clientY], memo }) => {
				if (!optionsRef.current.allowZoom) return
				const rect = rootRef.current?.getBoundingClientRect()
				if (!rect) return
				const origin = new Vector(clientX - rect.left, clientY - rect.top)
				const start: PinchStart = first || !memo ? { transform: transformRef.current, origin } : memo
				updateTransform(() => constrainTransform(scaleAroundPoint(start.transform, constrainScale(scale), start.origin, origin)))
				return start
			},
		},
		{
			drag: {
				from: () => [transformRef.current.translation.x, transformRef.current.translation.y],
				filterTaps: true,
				pointer: { touch: true },
				bounds: () => {
					const options = optionsRef.current
					if (!options.viewportSize) return { left: 0, right: 0, top: 0, bottom: 0 }
					return getCoordinateLimits(options.contentBounds, options.viewportSize, transformRef.current.scale, options.contentPadding)
				},
				rubberband: true,
			},
			pinch: {
				scaleBounds: () => {
					const options = optionsRef.current
					if (!options.viewportSize) return { min: options.minScale, max: options.maxScale }
					return getScaleLimits(options.contentBounds, options.viewportSize, options.minScale, options.maxScale, options.contentPadding)
				},
				from: () => [transformRef.current.scale, 0],
				pointer: { touch: true },
				pinchOnWheel: false,
			},
		},
	)

	// Start every pointer interaction without stale click suppression from an earlier drag.
	const handlePointerDownCapture = useCallback(() => { suppressClickRef.current = false }, [])

	// On a click, check if anything (like a drag) suppressed the click. If so, block it.
	const handleClickCapture = useCallback((event: MouseEvent) => {
		if (!suppressClickRef.current) return
		event.preventDefault()
		event.stopPropagation()
		suppressClickRef.current = false
	}, [])

	/*
	 * Effects for managing events.
	 */

	// Center the configured focus initially and whenever the drawing configuration changes. On viewport resizes, retain and constrain the current transform.
	useEffect(() => {
		if (!viewportSize) return
		const configuration = [contentBounds.min.x, contentBounds.min.y, contentBounds.max.x, contentBounds.max.y, initialFocusVector.x, initialFocusVector.y, initialScale, minScale, maxScale, contentPadding].join(':')
		if (configurationRef.current !== configuration) {
			configurationRef.current = configuration
			updateTransform(() => getFocusedTransform([initialFocusVector.x, initialFocusVector.y], initialScale))
			return
		}
		updateTransform(current => constrainTransform(current))
	}, [contentBounds, constrainTransform, contentPadding, initialFocusVector.x, initialFocusVector.y, getFocusedTransform, initialScale, maxScale, minScale, updateTransform, viewportSize])

	// Listen to mouse-wheel zooming within the complete viewport.
	useEffect(() => {
		const element = rootRef.current
		if (!element) return
		const handleWheel = (event: WheelEvent) => {
			if (!optionsRef.current.allowZoom) return
			event.preventDefault()
			const rect = element.getBoundingClientRect()
			const origin = new Vector(event.clientX - rect.left, event.clientY - rect.top)
			const factor = event.deltaY > 0 ? 0.9 : 1.1
			updateTransform(current => constrainTransform(scaleAroundPoint(current, constrainScale(current.scale * factor), origin)))
		}
		element.addEventListener('wheel', handleWheel, { passive: false })
		return () => element.removeEventListener('wheel', handleWheel)
	}, [constrainScale, constrainTransform, optionsRef, updateTransform])

	/*
	 * Bundling.
	 */

	// Determine the state: everything that child components may need from the explorer.
	const state = useMemo<ExplorerState>(() => ({ allowZoom, transform, visibleBounds, zoomBy, reset, focusPosition }), [allowZoom, focusPosition, reset, transform, visibleBounds, zoomBy])

	// Bundle the state with a ref and event handlers for the explorer root container.
	return { rootRef, bind, handleClickCapture, handlePointerDownCapture, state }
}

// Change scale while keeping the same drawing point underneath a viewport position.
function scaleAroundPoint(transform: ExplorerTransform, scale: number, originalViewportPosition: Vector, newViewportPosition = originalViewportPosition): ExplorerTransform {
	const factor = scale / transform.scale
	return {
		translation: new Vector(
			newViewportPosition.x - (originalViewportPosition.x - transform.translation.x) * factor,
			newViewportPosition.y - (originalViewportPosition.y - transform.translation.y) * factor,
		),
		scale,
	}
}

// Determine the real min/max scale settings, given minScale and maxScale settings, content bounds and viewport sizes.
function getScaleLimits(bounds: Rectangle, viewport: ViewportSize, minScale: number, maxScale: number, contentPadding: number) {
	const fitScale = Math.min(viewport.width / (bounds.width + 2 * contentPadding), viewport.height / (bounds.height + 2 * contentPadding))
	return { min: Math.min(maxScale, Math.max(minScale, fitScale)), max: maxScale }
}

// Determine the min/max values for x and y, given a scale, content bounds and viewport sizes.
function getCoordinateLimits(bounds: Rectangle, viewport: ViewportSize, scale: number, contentPadding: number): TransformLimits {
	const width = bounds.width * scale
	const height = bounds.height * scale
	const padding = contentPadding * scale
	const horizontalEnd = viewport.width - width - padding
	const verticalEnd = viewport.height - height - padding
	const [left, right] = [Math.min(padding, horizontalEnd), Math.max(padding, horizontalEnd)]
	const [top, bottom] = [Math.min(padding, verticalEnd), Math.max(padding, verticalEnd)]
	return { left, right, top, bottom }
}
