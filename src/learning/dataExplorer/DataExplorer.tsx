import { useMemo, useState } from 'react'
import { Box, Button } from '@mui/material'
import { AccountTree } from '@mui/icons-material'

import { type TableKey, buildCompletionSchema } from '@sqlvalley/mock-data'
import { useDatabase, useDatasetSize, useQuery } from '@sqlvalley/sql'
import { DatasetSizeSelector } from '@sqlvalley/sql-exercises'

import { SchemaDialog } from './viewSchema'
import { TableDataView } from './TableDataView'

interface DataExplorerProps {
	tables: TableKey[]
}

export function DataExplorer({ tables }: DataExplorerProps) {
	// Track whether the "view schema" dialog is open.
	const [schemaOpen, setSchemaOpen] = useState(false)

	// Set up a state to track the selected table.
	const [selectedTable, setSelectedTable] = useState('')
	const tableNames = useMemo(() => Object.keys(buildCompletionSchema(tables)).sort(), [tables])
	const activeTable = tableNames.includes(selectedTable) ? selectedTable : tableNames[0]

	// Load the table from the right database.
	const [datasetSize] = useDatasetSize()
	const database = useDatabase({ tables, size: datasetSize })
	const { results, error, loading } = useQuery(database, activeTable ? 'SELECT * FROM "' + activeTable.replace(/"/g, '""') + '"' : undefined)

	// Render the Data Explorer.
	return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
			<DatasetSizeSelector />
			<Button variant="outlined" startIcon={<AccountTree />} sx={{ flexShrink: 0 }} onClick={() => setSchemaOpen(true)}>View schema</Button>
		</Box>
		<TableDataView tableNames={tableNames} selectedTable={activeTable ?? ''} onTableSelect={setSelectedTable} result={results?.[0]} loading={loading} error={error} />
		<SchemaDialog open={schemaOpen} onClose={() => setSchemaOpen(false)} database={database} />
	</Box>
}
