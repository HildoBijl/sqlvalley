import type { Ref } from 'react'
import { Table, Paper, Typography, Box } from '@mui/material'

import { useTablePagination } from './useTablePagination'
import { DataTableHeader, DataTableBody, DataTablePagination } from './components'

export interface TableData {
	columns: readonly string[]
	values: readonly (readonly unknown[])[]
}

export interface DataTableProps {
	data?: TableData | null
	maxRows?: number
	showPagination?: boolean
	highlightHeader?: boolean
	compact?: boolean
	ref?: Ref<HTMLDivElement>
}

export function DataTable({
	data,
	maxRows = 100,
	showPagination = true,
	highlightHeader = true,
	compact = false,
	ref,
}: DataTableProps) {
	const { page, rowsPerPage, displayValues, paginatedValues, changePage, changeRowsPerPage } = useTablePagination({ values: data?.values, maxRows, showPagination })

	// When there is no data, show a note of this.
	if (!data || !data.columns || !data.values) {
		return <Paper ref={ref} sx={{ p: 3, textAlign: 'center' }}>
			<Typography color="text.secondary">No data to display</Typography>
		</Paper>
	}

	// Render the table display.
	const { columns, values } = data
	return <Box ref={ref}>
		<Paper variant="outlined" sx={{
			borderRadius: 2,
			overflow: 'hidden',
		}}>
			<Table stickyHeader size={compact ? 'small' : 'medium'} sx={{
				tableLayout: 'auto',
				'& .MuiTableHead-root': { backgroundColor: 'background.paper' },
			}}>
				<DataTableHeader columns={columns} highlightHeader={highlightHeader} />
				<DataTableBody values={paginatedValues} columnCount={columns.length} />
			</Table>
		</Paper>

		<DataTablePagination
			showPagination={showPagination}
			displayCount={displayValues.length}
			totalCount={values.length}
			maxRows={maxRows}
			page={page}
			rowsPerPage={rowsPerPage}
			changePage={changePage}
			changeRowsPerPage={changeRowsPerPage}
		/>
	</Box>
}
