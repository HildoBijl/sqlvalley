import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'

import { ErrorBoundary, LoadingScreen } from '@/ui'

import { Header } from './Header'

export function Layout() {
	// On a page change, scroll to the top of the page.
	const location = useLocation()
	useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) }, [location.pathname])

	// Render the header with below it the page (outlet) as given by the router.
	return <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
		<Header />
		<Box component="main" sx={{ flexGrow: 1, minWidth: 0, bgcolor: 'background.default' }}>
			<ErrorBoundary key={location.pathname}>
				<Suspense fallback={<LoadingScreen />}>
					<Outlet />
				</Suspense>
			</ErrorBoundary>
		</Box>
	</Box>
}
