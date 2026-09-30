import { type ReactNode, useState } from 'react'
import { Box, Button, Collapse, Paper, Typography } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import type { SxProps, Theme } from '@mui/material/styles'

export interface ExerciseSectionProps {
	title: string
	children: ReactNode
	collapsible?: boolean
	defaultExpanded?: boolean
	sx?: SxProps<Theme>
}

export function ExerciseSection({ title, children, collapsible = false, defaultExpanded = true, sx }: ExerciseSectionProps) {
	const [expanded, setExpanded] = useState(defaultExpanded)
	const content = <Box sx={{ pt: 1 }}>{children}</Box>
	return <Paper sx={[{ p: 2, mb: 3, bgcolor: 'action.hover', borderRadius: 2 }, ...(Array.isArray(sx) ? sx : [sx])]}>
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
			<Typography variant="h6" sx={{ color: 'primary.main' }}>{title}</Typography>
			{collapsible && <Button aria-expanded={expanded} size="small" onClick={() => setExpanded(value => !value)} endIcon={expanded ? <ExpandLess /> : <ExpandMore />}>
				{expanded ? 'Hide' : 'Show'}
			</Button>}
		</Box>
		{collapsible ? <Collapse in={expanded}>{content}</Collapse> : content}
	</Paper>
}
