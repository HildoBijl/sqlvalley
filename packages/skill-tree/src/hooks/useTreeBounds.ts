import { useMemo } from 'react'

import { type ModulePositionData, cardHeight, cardWidth, treeMargin } from '../positioning'

// Calculate tree bounds while retaining any leading space before the first grid cell.
export function useTreeBounds(modulePositions: Record<string, ModulePositionData>) {
	return useMemo(() => {
		const positions = Object.values(modulePositions)
		if (positions.length === 0) {
			return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 }
		}

		let minX = Infinity
		let minY = Infinity
		let maxX = -Infinity
		let maxY = -Infinity
		for (const { pixelPosition } of positions) {
			minX = Math.min(minX, pixelPosition.x - cardWidth / 2 - treeMargin)
			minY = Math.min(minY, pixelPosition.y - cardHeight / 2 - treeMargin)
			maxX = Math.max(maxX, pixelPosition.x + cardWidth / 2 + treeMargin)
			maxY = Math.max(maxY, pixelPosition.y + cardHeight / 2 + treeMargin)
		}

		return {
			minX,
			minY,
			maxX,
			maxY,
			// The drawing starts at the origin, so the leading space counts towards
			// the size of the tree.
			width: maxX,
			height: maxY,
		}
	}, [modulePositions])
}
