import { Vector } from '@step-wise/geometry'
import { cardHeight, cardWidth, treeMargin } from './settings'

// Grid cells are 1-indexed and may use fractional values to position modules between cells.
export interface GridPosition {
	col: number
	row: number
}

// The distance between the centers of two neighbouring cells. Cells are
// spaced at 1.5x the card size.
export const columnSpacing = cardWidth * 1.5
export const rowSpacing = cardHeight * 1.5

// Convert a grid cell into the drawing position of the card's center.
export function gridToPixels({ col, row }: GridPosition): Vector {
	return new Vector(
		treeMargin + cardWidth / 2 + (col - 1) * columnSpacing,
		treeMargin + cardHeight / 2 + (row - 1) * rowSpacing,
	)
}
