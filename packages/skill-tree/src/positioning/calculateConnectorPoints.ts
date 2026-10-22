import { Vector } from '@step-wise/geometry'

import type { ModulePositionData } from './types.ts'
import { cardHeight, initialPathSpacing, maxPathSpace, maxVerticalOffset, minVerticalOffset } from './settings.ts'

// Calculate a connector's points directly in drawing coordinates.
export function calculateConnectorPoints(from: ModulePositionData, to: ModulePositionData): Vector[] {
	// Find the indexes which the paths have at their respective nodes.
	const toIndex = to.prerequisitesPathOrder.indexOf(from.id)
	const fromIndex = from.followUpsPathOrder.indexOf(to.id)

	// Find the offsets with respect to the cards' middleTop/middleBottom.
	const startHorizontalOffset = getHorizontalPathOffset(fromIndex, from.followUpsPathOrder.length)
	const startVerticalOffset = getVerticalPathOffset(fromIndex, from.followUpsPathOrder.length)
	const endHorizontalOffset = getHorizontalPathOffset(toIndex, to.prerequisitesPathOrder.length)
	const endVerticalOffset = getVerticalPathOffset(toIndex, to.prerequisitesPathOrder.length)

	// Calculate the offsets with respect to the cards' center.
	const start = from.pixelPosition.add([startHorizontalOffset, cardHeight / 2])
	const end = to.pixelPosition.add([endHorizontalOffset, -cardHeight / 2])

	// Return the four corner points defining the path.
	return [start, start.add([0, startVerticalOffset]), end.add([0, -endVerticalOffset]), end]
}

// For a given path index, find its horizontal offset from the middle.
function getHorizontalPathOffset(index: number, numPaths: number): number {
	if (numPaths === 1) return 0
	const pathSpacing = getPathSpacing(numPaths)
	return (index - (numPaths - 1) / 2) * pathSpacing
}

// Given a number of paths, calculate the space between paths. Logistically move towards the maximum width for all paths.
function getPathSpacing(numPaths: number): number {
	const spaceUsed = (maxPathSpace * numPaths) / (numPaths + maxPathSpace / initialPathSpacing)
	return spaceUsed / (numPaths - 1)
}

// For a given path index, find its vertical offset from the card edge. Position them on a parabola.
function getVerticalPathOffset(index: number, numPaths: number): number {
	if (numPaths === 1 || numPaths === 2) return maxVerticalOffset
	const numGaps = numPaths - 1
	const delta = (index - numGaps / 2) / (numGaps / 2)
	return maxVerticalOffset + (minVerticalOffset - maxVerticalOffset) * delta ** 2
}
