import type { Rectangle, VectorLike as VectorInput, Vector } from '@step-wise/geometry'

// Input for the module positioning.
export type GridPosition = VectorInput
export type ModuleGridPositions = Record<string, GridPosition>

// Output for the module positioning.
export interface ModulePositioning {
	modulePositions: Record<string, ModulePositionData>
	connectors: ModuleConnector[]
	bounds: Rectangle
}

export interface ModulePositionData {
	id: string
	gridPosition: Vector
	pixelPosition: Vector
	prerequisitesPathOrder: string[]
	followUpsPathOrder: string[]
}

export interface ModuleConnector {
	from: string
	to: string
	points: Vector[]
}
