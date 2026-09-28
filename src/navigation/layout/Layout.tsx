import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'

import { Header } from './Header'

export function Layout() {
	const location = useLocation()

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
	}, [location.pathname])

	return <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
		<Header />
		<Box component="main" sx={{ flexGrow: 1, minWidth: 0, bgcolor: 'background.default' }}>
			<Outlet />
		</Box>
	</Box>
}
