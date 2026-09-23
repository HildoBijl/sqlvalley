import { TableHead, TableRow, TableCell } from '@mui/material'

interface DataTableHeaderProps {
	columns: readonly string[]
	highlightHeader: boolean
}

export function DataTableHeader({ columns, highlightHeader }: DataTableHeaderProps) {
	return <TableHead>
		<TableRow>
			{columns.map((column, index) => (
				<TableCell key={index} sx={{
					fontWeight: highlightHeader ? 'bold' : 'medium',
					bgcolor: highlightHeader ? 'background.paper' : 'transparent',
					color: highlightHeader ? 'primary.main' : 'text.primary',
					borderBottom: 2,
					borderColor: 'primary.main',
				}}>
					{column}
				</TableCell>
			))}
		</TableRow>
	</TableHead>
}
