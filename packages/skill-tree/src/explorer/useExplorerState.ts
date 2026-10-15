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

interface UseExplorerStateOptions extends Required<Omit<ExplorerOptions, 'initialFocus'>> {
	initialFocus?: VectorLike
}

export function useExplorerState({ bounds, initialFocus, initialScale, minScale, maxScale, contentPadding, allowZoom }: UseExplorerStateOptions) {
	// Check the given input.
	if (minScale < 0) throw new Error('Explorer minScale cannot be negative.')
	if (maxScale < minScale) throw new Error('Explorer maxScale cannot be smaller than minScale.')
	if (contentPadding < 0) throw new Error('Explorer contentPadding cannot be negative.')
	const initialFocusVector = initialFocus ? ensureVector(initialFocus, { dimension: 2 }) : bounds.min.add([bounds.width / 2, bounds.height / 2])

	// Extract the viewport size and focus.
	const rootRef = useRef<HTMLDivElement>(null)
	const viewportSize = useElementSize(rootRef)

	// Set up refs for data storage and passing
	const suppressClickRef = useRef(false)
	const configurationRef = useRef('')
	const optionsRef = useLatestRef({ bounds, viewportSize, initialScale, minScale, maxScale, contentPadding, allowZoom, initialFocusVector })

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

	// Contrain the transform settings to their min/max values.
	const constrainTransform = useCallback((next: ExplorerTransform) => {
		const options = optionsRef.current
		if (!options.viewportSize) return next
		const scaleLimits = getScaleLimits(options.bounds, options.viewportSize, options.minScale, options.maxScale, options.contentPadding)
		const scale = clamp(next.scale, scaleLimits.min, scaleLimits.max)
		const coordinateLimits = getCoordinateLimits(options.bounds, options.viewportSize, scale, options.contentPadding)
		return {
			translation: new Vector(
				clamp(next.translation.x, coordinateLimits.left, coordinateLimits.right),
				clamp(next.translation.y, coordinateLimits.top, coordinateLimits.bottom),
			),
			scale,
		}
	}, [optionsRef])

	// Apply an additional scaling factor.
	const zoomBy = useCallback((factor: number) => {
		updateTransform(current => constrainTransform({ ...current, scale: current.scale * factor }))
	}, [constrainTransform, updateTransform])

	// Express the visible viewport rectangle in drawing coordinates based on the current transform.
	const viewportBounds = useMemo(() => {
		if (!viewportSize) return bounds
		const { translation, scale } = transform
		return new RectangleClass(
			[bounds.min.x - translation.x / scale, bounds.min.y - translation.y / scale],
			[bounds.min.x + (viewportSize.width - translation.x) / scale, bounds.min.y + (viewportSize.height - translation.y) / scale],
		)
	}, [bounds, transform, viewportSize])

	/*
	 * Focusing: jump to a specific point.
	 */

	// Calculate the transform that focuses the drawing on the given point, given a respective scale.
	const getFocusedTransform = useCallback((positionInput: VectorLike, scaleInput: number) => {
		const options = optionsRef.current
		const position = ensureVector(positionInput, { dimension: 2 })
		if (!options.viewportSize) return { translation: new Vector(0, 0), scale: scaleInput }
		return constrainTransform({
			translation: new Vector(
				options.viewportSize.width / 2 - (position.x - options.bounds.min.x) * scaleInput,
				options.viewportSize.height / 2 - (position.y - options.bounds.min.y) * scaleInput,
			),
			scale: scaleInput,
		})
	}, [constrainTransform, optionsRef])

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
			onPinch: ({ offset: [scale] }) => {
				if (!optionsRef.current.allowZoom) return
				updateTransform(current => constrainTransform({ ...current, scale }))
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
					return getCoordinateLimits(options.bounds, options.viewportSize, transformRef.current.scale, options.contentPadding)
				},
				rubberband: true,
			},
			pinch: {
				scaleBounds: () => {
					const options = optionsRef.current
					if (!options.viewportSize) return { min: options.minScale, max: options.maxScale }
					return getScaleLimits(options.bounds, options.viewportSize, options.minScale, options.maxScale, options.contentPadding)
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
		const configuration = [bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y, initialFocusVector.x, initialFocusVector.y, initialScale, minScale, maxScale, contentPadding].join(':')
		if (configurationRef.current !== configuration) {
			configurationRef.current = configuration
			updateTransform(() => getFocusedTransform([initialFocusVector.x, initialFocusVector.y], initialScale))
			return
		}
		updateTransform(current => constrainTransform(current))
	}, [bounds, constrainTransform, contentPadding, initialFocusVector.x, initialFocusVector.y, getFocusedTransform, initialScale, maxScale, minScale, updateTransform, viewportSize])

	// Listen to mouse-wheel zooming within the complete viewport.
	useEffect(() => {
		const element = rootRef.current
		if (!element) return
		const handleWheel = (event: WheelEvent) => {
			if (!optionsRef.current.allowZoom) return
			event.preventDefault()
			const factor = event.deltaY > 0 ? 0.95 : 1.05
			updateTransform(current => constrainTransform({ ...current, scale: current.scale * factor }))
		}
		element.addEventListener('wheel', handleWheel, { passive: false })
		return () => element.removeEventListener('wheel', handleWheel)
	}, [constrainTransform, optionsRef, updateTransform])

	/*
	 * Bundling.
	 */

	// Determine the state: everything that child components may need from the explorer.
	const state = useMemo<ExplorerState>(() => ({ allowZoom, transform, viewportBounds, zoomBy, reset, focusPosition }), [allowZoom, focusPosition, reset, transform, viewportBounds, zoomBy])

	// Bundle the state with a ref and event handlers for the explorer root container.
	return { rootRef, bind, handleClickCapture, handlePointerDownCapture, state }
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
