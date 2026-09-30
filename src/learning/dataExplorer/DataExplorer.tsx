import { useMemo, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { AccountTree } from '@mui/icons-material'

import { type TableKey, buildCompletionSchema } from '@sqlvalley/mock-data'
import { useDatabase, useQuery } from '@sqlvalley/sql'

import { SchemaDialog } from './SchemaDialog'
import { TableDataView } from './TableDataView'

interface DataExplorerProps {
	tables: TableKey[]
}

export function DataExplorer({ tables }: DataExplorerProps) {
	const [selectedTable, setSelectedTable] = useState('')
	const [schemaOpen, setSchemaOpen] = useState(false)
	// The explorer intentionally previews the full dataset, independently of practice settings.
	const database = useDatabase({ tables, size: 'full' })
	const tableNames = useMemo(() => Object.keys(buildCompletionSchema(tables)).sort(), [tables])
	const activeTable = tableNames.includes(selectedTable) ? selectedTable : tableNames[0]
	const { results, error, loading } = useQuery(database, activeTable ? 'SELECT * FROM "' + activeTable.replace(/"/g, '""') + '" LIMIT 100' : undefined)

	return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
		<Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: { xs: 'flex-start', sm: 'center' } }}>
			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="h6">Table Data Browser</Typography>
				<Typography color="text.secondary">Inspect table contents and explore sample rows.</Typography>
			</Box>
			<Button variant="outlined" startIcon={<AccountTree />} onClick={() => setSchemaOpen(true)}>View schema</Button>
		</Box>
		<TableDataView tableNames={tableNames} selectedTable={activeTable ?? ''} onTableSelect={setSelectedTable} result={results?.[0]} loading={loading} error={error} />
		<SchemaDialog open={schemaOpen} onClose={() => setSchemaOpen(false)} database={database} />
	</Box>
}
