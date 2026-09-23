import { TableBody, TableRow, TableCell, Typography } from '@mui/material'

import { CellValue } from './CellValue'

interface DataTableBodyProps {
	values: readonly (readonly unknown[])[]
	columnCount: number
}

export function DataTableBody(props: DataTableBodyProps) {
	return <TableBody>
		<DataTableBodyInternal {...props} />
	</TableBody>
}

function DataTableBodyInternal({ values, columnCount }: DataTableBodyProps) {
	// On no rows, show a note of this.
	if (values.length === 0) {
		return <TableRow>
			<TableCell colSpan={columnCount} align="center">
				<Typography color="text.secondary">No rows returned</Typography>
			</TableCell>
		</TableRow>
	}

	// When there are rows, display them.
	return <>
		{values.map((row, rowIndex) => (
			<TableRow key={rowIndex} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' }, transition: 'none' }}>
				{row.map((cell, cellIndex) => (
					<TableCell key={cellIndex}>
						<CellValue value={cell} />
					</TableCell>
				))}
			</TableRow>
		))}
	</>
}
