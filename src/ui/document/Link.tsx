import type { ReactNode } from 'react'
import { type LinkProps as MuiLinkProps, Link as MuiLink } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export type LinkProps = MuiLinkProps & {
	to: string
	children: ReactNode
}

export function Link({ to, children, ...props }: LinkProps) {
	const external = to[0] !== '/' || to.startsWith('//')
	return <MuiLink
		{...(external ? { href: to, target: '_blank', rel: 'noopener noreferrer' } : { component: RouterLink, to })}
		{...props}
		sx={{
			...(props.sx || {}),
			fontWeight: 500,
			textDecoration: 'none',
			'&:hover': { textDecoration: 'none' },
		}}>
		{children}
	</MuiLink>
}
