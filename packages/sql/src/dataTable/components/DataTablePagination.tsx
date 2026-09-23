import { TablePagination, Box, Typography } from '@mui/material'

interface DataTablePaginationProps {
	showPagination: boolean
	displayCount: number
	totalCount: number
	maxRows: number
	page: number
	rowsPerPage: number
	changePage: (page: number) => void
	changeRowsPerPage: (rowsPerPage: number) => void
}

type PaginationControlsProps = Omit<DataTablePaginationProps, 'totalCount' | 'maxRows'>
type RowLimitNoticeProps = Pick<DataTablePaginationProps, 'totalCount' | 'maxRows'>

export function DataTablePagination({ totalCount, maxRows, ...controls }: DataTablePaginationProps) {
	return <>
		<PaginationControls {...controls} />
		<RowLimitNotice totalCount={totalCount} maxRows={maxRows} />
	</>
}

function PaginationControls({ showPagination, displayCount, page, rowsPerPage, changePage, changeRowsPerPage }: PaginationControlsProps) {
	if (!showPagination || displayCount <= 0) return null
	return <TablePagination
		component="div"
		count={displayCount}
		page={page}
		onPageChange={(_event, page) => changePage(page)}
		rowsPerPage={rowsPerPage}
		onRowsPerPageChange={event => changeRowsPerPage(Number(event.target.value))}
		rowsPerPageOptions={[5, 10, 25, 50]}
		sx={{
			'.MuiTablePagination-toolbar': {
				alignItems: 'center',
				gap: 1,
				flexWrap: 'wrap',
			},
			'.MuiTablePagination-selectLabel': {
				m: 0,
				display: 'flex',
				alignItems: 'center',
			},
			'.MuiTablePagination-displayedRows': {
				m: 0,
				display: 'flex',
				alignItems: 'center',
			},
			'.MuiTablePagination-actions': {
				alignItems: 'center',
			},
		}}
	/>
}

function RowLimitNotice({ totalCount, maxRows }: RowLimitNoticeProps) {
	if (totalCount <= maxRows) return null
	return <Box sx={{ p: 1, bgcolor: 'warning.main', color: 'warning.contrastText' }}>
		<Typography variant="caption">
			Showing first {maxRows} of {totalCount} rows
		</Typography>
	</Box>
}
