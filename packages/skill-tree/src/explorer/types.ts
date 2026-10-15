import type { Rectangle, VectorLike } from '@step-wise/geometry'

/*
 * Input: Explorer options.
 */

export interface ExplorerOptions {
	bounds: Rectangle
	initialFocus?: VectorLike
	initialScale?: number
	minScale?: number
	maxScale?: number
	contentPadding?: number
	allowZoom?: boolean
}

/*
 * Output: State of the Explorer context.
 */

export interface ExplorerState {
	allowZoom: boolean
	transform: ExplorerTransform
	viewportBounds: Rectangle
	zoomBy: (factor: number) => void
	reset: () => void
	focusPosition: (position: VectorLike, options?: FocusPositionOptions) => void
}

export interface ExplorerTransform {
	x: number
	y: number
	scale: number
}

export interface FocusPositionOptions {
	scale?: number
}
