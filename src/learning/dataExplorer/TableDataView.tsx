import { Alert, Box, Chip, Typography } from '@mui/material'

import { type QueryResult, DataTable } from '@sqlvalley/sql'

interface TableDataViewProps {
	tableNames: string[]
	selectedTable: string
	onTableSelect: (name: string) => void
	result?: QueryResult
	loading: boolean
	error?: Error
}

export function TableDataView({ tableNames, selectedTable, onTableSelect, ...preview }: TableDataViewProps) {
	return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
		<Typography variant="subtitle2">Tables</Typography>
		<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
			{tableNames.map(name => <Chip key={name} label={name} onClick={() => onTableSelect(name)} color={selectedTable === name ? 'primary' : 'default'} variant={selectedTable === name ? 'filled' : 'outlined'} clickable />)}
			{!tableNames.length && <Typography color="text.secondary">No tables available.</Typography>}
		</Box>
		<Typography variant="subtitle2">Preview (up to 100 rows)</Typography>
		<TablePreview selectedTable={selectedTable} {...preview} />
	</Box>
}

function TablePreview({ selectedTable, result, loading, error }: Pick<TableDataViewProps, 'selectedTable' | 'result' | 'loading' | 'error'>) {
	if (error) return <Alert severity="error">{error.message}</Alert>
	if (loading) return <Typography>Loading table data...</Typography>
	if (!selectedTable) return <Typography>Select a table to load its rows.</Typography>
	if (!result) return <Typography>No rows returned.</Typography>
	return <DataTable data={result} />
}
