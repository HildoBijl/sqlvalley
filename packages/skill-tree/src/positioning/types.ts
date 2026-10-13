import type { Rectangle, VectorLike as VectorInput, Vector } from '@step-wise/geometry'
import type { ModuleId } from '@step-wise/module-tree-definition'

// Input for the module positioning.
export type GridPosition = VectorInput
export type ModuleGridPositions = Record<ModuleId, GridPosition>

// Output for the module positioning.
export interface ModulePositioning {
	modulePositions: Record<ModuleId, ModulePositionData>
	connectors: ModuleConnector[]
	bounds: Rectangle
}

export interface ModulePositionData {
	id: ModuleId
	gridPosition: Vector
	pixelPosition: Vector
	prerequisitesPathOrder: ModuleId[]
	followUpsPathOrder: ModuleId[]
}

export interface ModuleConnector {
	from: ModuleId
	to: ModuleId
	points: Vector[]
}
