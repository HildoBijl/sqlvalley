import type { Rectangle, VectorLike } from '@step-wise/geometry'

export interface ExplorerTransform {
	x: number
	y: number
	scale: number
}

export interface FocusPositionOptions {
	scale?: number
}

export interface ExplorerState {
	allowZoom: boolean
	transform: ExplorerTransform
	viewportBounds: Rectangle
	zoomBy: (factor: number) => void
	reset: () => void
	focusPosition: (position: VectorLike, options?: FocusPositionOptions) => void
}
