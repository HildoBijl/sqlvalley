import { useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import type { GridColDef } from '@mui/x-data-grid'

import type { TableData } from './DataTable'
import { CellValue } from './CellValue'

// Use content-based calculations to intelligently determine column widths.
export function useTableColumns(data: TableData | null | undefined, controls: boolean, availableWidth: number) {
	const theme = useTheme()

	// Determine column widths.
	const measuredColumns = useMemo<GridColDef[]>(() => {
		// Set up a measuring system to determine how wide text is.
		const context = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d')
		const measure = (text: string, font: string) => {
			if (!context) return text.length * 8
			context.font = font
			return context.measureText(text).width
		}

		// Iterate through columns to determine their widths.
		return (data?.columns ?? []).map((name, index) => {
			const columnValues = (data?.values ?? []).map(row => row[index]).filter(value => value != null)
			const numeric = columnValues.length > 0 && columnValues.every(value => typeof value === 'number')
			const boolean = columnValues.length > 0 && columnValues.every(value => typeof value === 'boolean')
			const padding = 16 + (index === 0 ? 8 : 0) + (index === (data?.columns.length ?? 0) - 1 ? 8 : 0)

			// Intelligently determine the preferred width and minimum width based on dimensions of headers, words, etcetera.
			const headerWidth = measure(name, `bold ${theme.typography.pxToRem(14)} ${theme.typography.fontFamily}`) + (controls ? 28 : 0)
			let wordWidth = 0
			let textWidth = headerWidth
			for (const row of data?.values ?? []) {
				const value = row[index]
				const text = value == null ? 'NULL' : String(value)
				const font = typeof value === 'number' ? `${theme.typography.pxToRem(14)} monospace` : `${theme.typography.pxToRem(13)} ${theme.typography.fontFamily}`
				const chipPadding = value == null || typeof value === 'boolean' ? 20 : 0
				for (const word of text.split(/\s+/)) wordWidth = Math.max(wordWidth, measure(word, font) + chipPadding)
				textWidth = Math.max(textWidth, measure(text, font) + chipPadding)
			}
			const minWidth = Math.ceil(Math.max(headerWidth, wordWidth) + padding)

			// Return all relevant data in an object.
			return {
				field: `column_${index}`,
				headerName: name,
				type: numeric ? 'number' : boolean ? 'boolean' : 'string',
				align: 'left',
				headerAlign: 'left',
				hideable: false,
				minWidth,
				width: Math.ceil(Math.max(minWidth, textWidth + padding)),
				renderCell: ({ value }) => <CellValue value={value} />,
			}
		})
	}, [data, controls, theme])

	// Based on each column's info, and on the available width, divide the space.
	return useMemo(() => {
		// Check the totals for the minimum and preferred widths.
		if (availableWidth <= 0) return measuredColumns
		const minimumTotal = measuredColumns.reduce((sum, column) => sum + (column.minWidth ?? 0), 0)
		const preferredTotal = measuredColumns.reduce((sum, column) => sum + (column.width ?? 0), 0)
		if (preferredTotal === 0) return measuredColumns

		// Shrink only the space between preferred and minimum widths, preserving whole words.
		const shrinkRatio = preferredTotal > minimumTotal ? Math.max(0, (availableWidth - minimumTotal) / (preferredTotal - minimumTotal)) : 0
		return measuredColumns.map(column => {
			const minimum = column.minWidth ?? 0
			const preferred = column.width ?? minimum
			const width = availableWidth >= preferredTotal ? preferred * availableWidth / preferredTotal : minimum + (preferred - minimum) * shrinkRatio
			return { ...column, width: Math.floor(width) }
		})
	}, [measuredColumns, availableWidth])
}
