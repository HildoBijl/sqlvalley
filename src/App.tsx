import { StrictMode, useEffect, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { databaseSource } from '@sqlvalley/mock-data'
import { SQLJSProvider } from '@sqlvalley/sqljs'
import { DatabaseProvider } from '@sqlvalley/sql/databaseProvider'

import { getTheme, ColorModeContext, ErrorBoundary } from '@/ui'
import { router } from '@/navigation'
import { useSettingsStore, useStoresHydrated } from './store'

export function App() {
	// Set up theming/coloring.
	const mode = useSettingsStore((s) => s.themeMode)
	const muiTheme = useMemo(() => getTheme(mode), [mode])
	useEffect(() => { document.documentElement.setAttribute('data-theme', mode) }, [mode])
	const setThemeMode = useSettingsStore((s) => s.setThemeMode)
	const toggleColorMode = () => setThemeMode(mode === 'light' ? 'dark' : 'light')

	// Load in the dataset size for the DatabaseProvider.
	const datasetSize = useSettingsStore(state => state.practiceDatasetSize)
	const setDatasetSize = useSettingsStore(state => state.setPracticeDatasetSize)

	// If the data store is not ready, don't render yet. It would be wrong and may cause flickering.
	const isStoreReady = useStoresHydrated()
	if (!isStoreReady) return null

	// Render the site. If the store is not ready yet, then wait for it first.
	return (
		<StrictMode>
			<ErrorBoundary>
				<ColorModeContext.Provider value={{ mode, toggleColorMode }}>
					<ThemeProvider theme={muiTheme}>
						<CssBaseline />
						<SQLJSProvider>
							<DatabaseProvider source={databaseSource} datasetSize={datasetSize} setDatasetSize={setDatasetSize}>
								<RouterProvider router={router} />
							</DatabaseProvider>
						</SQLJSProvider>
					</ThemeProvider>
				</ColorModeContext.Provider>
			</ErrorBoundary>
		</StrictMode>
	)
}
