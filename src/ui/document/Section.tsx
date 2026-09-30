import type { ReactNode } from 'react'
import { type BoxProps, Box, Typography } from '@mui/material'

export type SectionProps = Omit<BoxProps, 'title'> & {
	title?: ReactNode
}

export function Section({ title, children, ...props }: SectionProps) {
	return <Box display="flex" flexDirection="column" gap={2} {...props}>
		{title ? <Typography variant="h5" component="h2">{title}</Typography> : null}
		{children}
	</Box>
}
