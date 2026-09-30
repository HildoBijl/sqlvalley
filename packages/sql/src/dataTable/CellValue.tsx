import { Chip, Typography } from '@mui/material'

interface CellValueProps {
	value: unknown
}

// Render a Cell in a DataTable for a given unknown value type.
export function CellValue({ value }: CellValueProps) {
	// Undefined values.
	if (value === null || value === undefined) return <Chip label="NULL" size="small" variant="outlined" sx={{ '& .MuiChip-label': { fontSize: '0.75rem' } }} />

	// Booleans.
	if (typeof value === 'boolean') return <Chip label={value ? 'TRUE' : 'FALSE'} size="small" color={value ? 'success' : 'default'} variant="outlined" sx={{ '& .MuiChip-label': { fontSize: '0.75rem' } }} />

	// Numbers.
	if (typeof value === 'number') return <Typography component="span" variant="body2" sx={{ fontFamily: 'monospace', color: 'info.main' }}>{String(value)}</Typography>

	// Wrap long values so the entire contents remain visible.
	const text = String(value)
	return <Typography component="span" variant="body2" title={text} sx={{
		display: 'block',
		fontSize: '0.8125rem',
		overflowWrap: 'normal',
		whiteSpace: 'normal',
		wordBreak: 'normal',
	}}>
		{text}
	</Typography>
}
