import type { ReactNode } from 'react'
import { type TypographyProps, Typography } from '@mui/material'

export type PrimaryKeyProps = TypographyProps & {
	children: ReactNode
}

export function PrimaryKey({ children, sx, ...props }: PrimaryKeyProps) {
	return <Typography
		component="span"
		variant="inherit"
		sx={{ textDecoration: 'underline', ...sx }}
		{...props}
	>
		{children}
	</Typography>
}
