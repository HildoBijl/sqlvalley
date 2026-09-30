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
					px: 1,
					'&:first-of-type': { pl: 2 },
					'&:last-of-type': { pr: 2 },
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
