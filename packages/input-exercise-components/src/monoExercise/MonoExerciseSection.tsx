import { type ReactNode, useState } from 'react'
import { Box, Button, Collapse, Paper, Typography } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

interface MonoExerciseSectionProps {
	title: string
	children: ReactNode
	collapsible?: boolean
}

export function MonoExerciseSection({ title, children, collapsible = false }: MonoExerciseSectionProps) {
	const [expanded, setExpanded] = useState(true)
	return <Paper sx={{ p: 2, mb: 3, bgcolor: 'action.hover', borderRadius: 2 }}>
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
			<Typography variant="h6" sx={{ color: 'primary.main' }}>{title}</Typography>
			{collapsible && <Button size="small" onClick={() => setExpanded(value => !value)} endIcon={expanded ? <ExpandLess /> : <ExpandMore />}>
				{expanded ? 'Hide' : 'Show'}
			</Button>}
		</Box>
		{collapsible ? <Collapse in={expanded}>{children}</Collapse> : children}
	</Paper>
}
