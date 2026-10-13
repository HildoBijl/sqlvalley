import { Rectangle, Vector, ensureVector } from '@step-wise/geometry'
import type { ModuleTree } from '@step-wise/module-tree-definition'

import type { GridPosition, ModuleConnector, ModuleGridPositions, ModulePositionData, ModulePositioning } from './types'
import { cardHeight, cardWidth, columnSpacing, rowSpacing, treeMargin } from './settings'
import { calculateConnectorPoints } from './calculateConnectorPoints'

// Add drawing positions and connector paths to modules assigned to grid cells.
export function defineModulePositioning(moduleTree: ModuleTree, gridPositions: ModuleGridPositions): ModulePositioning {
	// Determine the positions of the modules in pixel coordinates.
	const modulePositions: Record<string, ModulePositionData> = {}
	Object.entries(gridPositions).forEach(([id, gridPositionInput]) => {
		if (!moduleTree[id]) throw new Error(`Invalid module ID "${id}" encountered when defining module positions.`)
		const gridPosition = ensureVector(gridPositionInput, { dimension: 2 })
		modulePositions[id] = {
			id,
			gridPosition,
			pixelPosition: gridToPixels(gridPosition),
			prerequisitesPathOrder: [],
			followUpsPathOrder: [],
		}
	})

	// For each module, determine the prerequisites and follow-ups within the tree and sort them by the angle in which they appear as seen from this module.
	Object.values(modulePositions).forEach(positionData => {
		const module = moduleTree[positionData.id]
		const { pixelPosition } = positionData

		// Determine the prerequisites within the given tree and sort them by line angle.
		const ownPrerequisiteRefPoint = pixelPosition.add([0, -cardHeight / 2])
		positionData.prerequisitesPathOrder = module.prerequisiteIds
			.filter(id => Boolean(gridPositions[id]))
			.map(id => {
				const otherRefPoint = modulePositions[id].pixelPosition.add([0, cardHeight / 2])
				const relativePoint = otherRefPoint.subtract(ownPrerequisiteRefPoint)
				return { id, angle: Math.atan2(relativePoint.x, -relativePoint.y) }
			})
			.sort((a, b) => a.angle - b.angle)
			.map(data => data.id)

		// Determine the follow-ups within the given tree and sort them by line angle.
		const ownFollowUpRefPoint = pixelPosition.add([0, cardHeight / 2])
		positionData.followUpsPathOrder = module.continuationIds
			.filter(id => Boolean(gridPositions[id]))
			.map(id => {
				const otherRefPoint = modulePositions[id].pixelPosition.add([0, -cardHeight / 2])
				const relPoint = otherRefPoint.subtract(ownFollowUpRefPoint)
				return { id, angle: Math.atan2(relPoint.x, relPoint.y) }
			})
			.sort((a, b) => a.angle - b.angle)
			.map(data => data.id)
	})

	// Based on the prerequisites and follow-ups, set up connector lines.
	const connectors: ModuleConnector[] = []
	Object.values(modulePositions).forEach(positionData => {
		positionData.prerequisitesPathOrder.forEach(prerequisiteId => {
			const prerequisitePositionData = modulePositions[prerequisiteId]
			connectors.push({
				from: prerequisiteId,
				to: positionData.id,
				points: calculateConnectorPoints(prerequisitePositionData, positionData),
			})
		})
	})

	// All done. Return the data.
	const bounds = calculateModuleBounds(modulePositions)
	return { modulePositions, connectors, bounds }
}

// Calculate the rectangle containing every module card and the surrounding tree margin.
function calculateModuleBounds(modulePositions: Record<string, ModulePositionData>): Rectangle {
	// On no modules, return an empty rectangle.
	const positions = Object.values(modulePositions)
	if (positions.length === 0) return new Rectangle([0, 0], [0, 0])

	// Find the smallest and largest pixel positions among all modules.
	const pixelPositions = positions.map(position => position.pixelPosition)
	const minX = Math.min(...pixelPositions.map(position => position.x))
	const minY = Math.min(...pixelPositions.map(position => position.y))
	const maxX = Math.max(...pixelPositions.map(position => position.x))
	const maxY = Math.max(...pixelPositions.map(position => position.y))

	// Add padding for card size and margins.
	const horizontalPadding = cardWidth / 2 + treeMargin
	const verticalPadding = cardHeight / 2 + treeMargin
	return new Rectangle([minX - horizontalPadding, minY - verticalPadding], [maxX + horizontalPadding, maxY + verticalPadding])
}

// Convert a grid cell into the drawing position of the card's center.
export function gridToPixels(position: GridPosition): Vector {
	const { x, y } = ensureVector(position, { dimension: 2 })
	return new Vector(x * columnSpacing, y * rowSpacing)
}
