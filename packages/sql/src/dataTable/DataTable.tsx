import { type Ref, useCallback, useMemo, useState } from 'react'
import { Alert, Box, Paper, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'

import { useTableColumns } from './useTableColumns'

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
	controls?: boolean
	ref?: Ref<HTMLDivElement>
}

const getRowHeight = () => 'auto' as const

export function DataTable({ data, maxRows = 100, showPagination = true, highlightHeader = true, compact = false, controls = false, ref }: DataTableProps) {
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

	// Track the table's available width and use it to determine column widths.
	const [availableWidth, setAvailableWidth] = useState(0)
	const onResize = useCallback((size: { width: number }) => setAvailableWidth(size.width), [])
	const columns = useTableColumns(data, controls, availableWidth)

	// Turn the array rows into row objects including column ID.
	const rows = useMemo(() => (data?.values ?? []).slice(0, maxRows).map((values, id) => ({ id, ...Object.fromEntries(values.map((value, index) => [`column_${index}`, value instanceof Uint8Array ? String(value) : value])) })), [data, maxRows])

	// When there is no data, show a not of this.
	if (!data) return <Paper ref={ref} sx={{ p: 3, textAlign: 'center' }}>
		<Typography color="text.secondary">No data to display</Typography>
	</Paper>

	// Render a DataGrid with the data.
	return <Box ref={ref} sx={{ minWidth: 0, maxWidth: '100%' }}>
		<Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0, borderRadius: 2, overflow: 'hidden' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				disableRowSelectionOnClick
				disableColumnSelector
				disableColumnMenu={!controls}
				disableColumnSorting={!controls}
				disableColumnFilter={!controls}
				getRowHeight={getRowHeight}
				onResize={onResize}
				columnHeaderHeight={compact ? 40 : 56}
				getRowClassName={({ indexRelativeToCurrentPage }) => indexRelativeToCurrentPage % 2 === 0 ? 'striped' : ''}
				paginationModel={showPagination ? paginationModel : { page: 0, pageSize: -1 }}
				onPaginationModelChange={setPaginationModel}
				pageSizeOptions={[5, 10, 25, 50]}
				hideFooter={!showPagination || rows.length === 0}
				localeText={{ noRowsLabel: 'No rows returned' }}
				sx={{
					border: 0,
					borderRadius: 2,
					bgcolor: 'background.paper',
					'& .MuiDataGrid-virtualScroller': { overflowY: 'hidden' },
					'&& .MuiDataGrid-columnHeader': { bgcolor: 'background.paper', color: highlightHeader ? 'primary.main' : 'text.primary', borderBottom: '2px solid', borderColor: 'primary.main' },
					'& .MuiDataGrid-columnHeaderTitle': { fontWeight: highlightHeader ? 'bold' : 'medium' },
					'& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': { px: 1 },
					'& [role="columnheader"][aria-colindex="1"], & [role="gridcell"][aria-colindex="1"]': { pl: 2 },
					[`& [role="columnheader"][aria-colindex="${columns.length}"], & [role="gridcell"][aria-colindex="${columns.length}"]`]: { pr: 2 },
					'& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', py: compact ? 0.75 : 2, whiteSpace: 'normal', overflowWrap: 'normal', wordBreak: 'normal' },
					'& .MuiDataGrid-row.striped': { bgcolor: theme => alpha(theme.palette.action.hover, Math.min(1, theme.palette.action.hoverOpacity * 0.75)) },
					'& .MuiDataGrid-row:hover': { bgcolor: theme => alpha(theme.palette.primary.main, Math.min(1, theme.palette.action.hoverOpacity)) },
					'& .MuiDataGrid-row.striped:hover': { bgcolor: theme => alpha(theme.palette.primary.main, Math.min(1, theme.palette.action.hoverOpacity * 1.5)) },
					'& .MuiDataGrid-row': { transition: 'none' },
					'& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
					'& .MuiDataGrid-footerContainer': { justifyContent: 'flex-start' },
					'& .MuiTablePagination-root': { width: '100%' },
					'& .MuiTablePagination-spacer': { display: 'none' },
					'& .MuiTablePagination-toolbar': { alignItems: 'center', gap: 1, flexWrap: 'wrap' },
					'& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { m: 0, display: 'flex', alignItems: 'center' },
					'& .MuiTablePagination-actions': { alignItems: 'center' },
				}} />
		</Paper>

		{data.values.length > maxRows && <Alert severity="warning">Showing first {maxRows} of {data.values.length} rows.</Alert>}
	</Box>
}
