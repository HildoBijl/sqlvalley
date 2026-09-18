import { StrictMode, useEffect, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { databaseSource } from '@sqlvalley/mock-data'
import { SQLJSProvider } from '@sqlvalley/sqljs'
import { DatabaseProvider } from '@sqlvalley/sql/databaseProvider'
import { getTheme, ColorModeContext, ErrorBoundary } from '@sqlvalley/ui'

import { router } from '@/navigation'
import { useSettingsStore, useStoresHydrated } from './store'

export function App() {
	const mode = useSettingsStore((s) => s.themeMode);
	const setThemeMode = useSettingsStore((s) => s.setThemeMode);
	const isStoreReady = useStoresHydrated();

	const muiTheme = useMemo(() => getTheme(mode), [mode]);

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', mode);
	}, [mode]);

	const toggleColorMode = () => setThemeMode(mode === 'light' ? 'dark' : 'light');

	if (!isStoreReady) {
		return null;
	}

	return (
		<StrictMode>
			<ErrorBoundary>
				<ColorModeContext.Provider value={{ mode, toggleColorMode }}>
					<ThemeProvider theme={muiTheme}>
						<CssBaseline />
						<SQLJSProvider>
							<DatabaseProvider source={databaseSource}>
								<RouterProvider router={router} />
							</DatabaseProvider>
						</SQLJSProvider>
					</ThemeProvider>
				</ColorModeContext.Provider>
			</ErrorBoundary>
		</StrictMode>
	);
}
