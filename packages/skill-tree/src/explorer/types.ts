import type { Rectangle, Vector, VectorLike } from '@step-wise/geometry'

/*
 * Input: Explorer options.
 */

export interface ExplorerOptions {
	contentBounds: Rectangle
	initialFocusPosition?: VectorLike
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
	visibleBounds: Rectangle
	zoomBy: (factor: number) => void
	reset: () => void
	focusPosition: (position: VectorLike, scale?: number) => void
}

export interface ExplorerTransform {
	translation: Vector
	scale: number
}
