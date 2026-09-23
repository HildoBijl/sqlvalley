import { Chip, Typography } from '@mui/material'

interface CellValueProps {
	value: unknown
}

// Render a Cell in a DataTable for a given unknown value type.
export function CellValue({ value }: CellValueProps) {
	// Undefined values.
	if (value === null || value === undefined) return <Chip label="NULL" size="small" variant="outlined" />

	// Booleans.
	if (typeof value === 'boolean') return <Chip label={value ? 'TRUE' : 'FALSE'} size="small" color={value ? 'success' : 'default'} variant="outlined" />

	// Numbers.
	if (typeof value === 'number') return <Typography component="span" sx={{ fontFamily: 'monospace', color: 'info.main' }}>{String(value)}</Typography>

	// Truncate text only when it exceeds the available width.
	const text = String(value)
	return <Typography component="span" title={text} sx={{
		display: 'block',
		maxWidth: 200,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	}}>
		{text}
	</Typography>
}
