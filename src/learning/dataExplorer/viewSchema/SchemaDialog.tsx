import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

import type { DatabaseHandle } from '@sqlvalley/sql'

import { useTableSchema } from './useTableSchema'
import { SchemaOverview } from './SchemaOverview'

interface SchemaDialogProps {
	open: boolean
	onClose: () => void
	database: DatabaseHandle
}

export function SchemaDialog({ open, onClose, database }: SchemaDialogProps) {
	return <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
		<DialogTitle>Schema overview</DialogTitle>
		<DialogContent dividers>{open && <SchemaContent database={database} />}</DialogContent>
		<DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
	</Dialog>
}

function SchemaContent({ database }: { database: DatabaseHandle }) {
	const { tables, loading, error } = useTableSchema(database)
	if (error) return <Alert severity="error">{error.message}</Alert>
	if (loading) return <Typography>Loading schema...</Typography>
	if (!tables.length) return <Typography>No tables available.</Typography>
	return <SchemaOverview tableInfo={tables} />
}
