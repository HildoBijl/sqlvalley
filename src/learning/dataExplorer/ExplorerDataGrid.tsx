import { useMemo } from 'react'
import { Chip, Paper, Typography } from '@mui/material'
import { type GridColDef, DataGrid } from '@mui/x-data-grid'

import type { QueryResult } from '@sqlvalley/sql'

const getRowHeight = () => 'auto' as const

export function ExplorerDataGrid({ data }: { data: QueryResult }) {
	const columns = useMemo<GridColDef[]>(() => data.columns.map((name, index) => {
		const values = data.values.map(row => row[index]).filter(value => value !== null)
		const numeric = values.length > 0 && values.every(value => typeof value === 'number')
		return {
			field: `column_${index}`,
			headerName: name,
			type: numeric ? 'number' : 'string',
			align: 'left',
			headerAlign: 'left',
			hideable: false,
			minWidth: 70,
			width: 70,
			flex: 1,
			renderCell: ({ value }) => {
				if (value === null) return <Chip label="NULL" size="small" variant="outlined" sx={{ '& .MuiChip-label': { fontSize: '0.75rem' } }} />
				if (typeof value === 'number') return <Typography component="span" variant="body2" sx={{ fontFamily: 'monospace', color: 'info.main' }}>{String(value)}</Typography>
				return <Typography component="span" variant="body2" sx={{ fontSize: '0.8125rem', whiteSpace: 'normal', overflowWrap: 'normal', wordBreak: 'normal', minWidth: 0 }}>{String(value)}</Typography>
			},
		}
	}), [data])
	const rows = useMemo(() => data.values.map((values, id) => ({
		id,
		...Object.fromEntries(values.map((value, index) => [`column_${index}`, value instanceof Uint8Array ? String(value) : value])),
	})), [data])

	return <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', minHeight: 180, width: '100%', minWidth: 0, borderRadius: 2, overflow: 'hidden' }}>
		<DataGrid rows={rows} columns={columns} disableRowSelectionOnClick disableColumnSelector
			getRowHeight={getRowHeight}
			getRowClassName={({ indexRelativeToCurrentPage }) => indexRelativeToCurrentPage % 2 === 0 ? 'striped' : ''}
			initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
			pageSizeOptions={[5, 10, 25, 50]}
			sx={{
				border: 0,
				borderRadius: 2,
				bgcolor: 'background.paper',
				'& .MuiDataGrid-virtualScroller': { overflowY: 'hidden' },
				'&& .MuiDataGrid-columnHeader': { bgcolor: 'background.paper', color: 'primary.main', borderBottom: '2px solid', borderColor: 'primary.main' },
				'& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
				'& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': { px: 1 },
				'& [role="columnheader"][aria-colindex="1"], & [role="gridcell"][aria-colindex="1"]': { pl: 2 },
				[`& [role="columnheader"][aria-colindex="${columns.length}"], & [role="gridcell"][aria-colindex="${columns.length}"]`]: { pr: 2 },
				'& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', py: 2, whiteSpace: 'normal', overflowWrap: 'normal', wordBreak: 'normal' },
				'& .MuiDataGrid-row.striped': { bgcolor: 'action.hover' },
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
}
