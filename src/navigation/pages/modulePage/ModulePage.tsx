import { Suspense } from 'react'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'

import { LoadingScreen } from '@/ui'
import { isModuleId, moduleProviders } from '@/curriculum'

import { NotFoundPage } from '../NotFoundPage'

import { ModulePageContent } from './ModulePageContent'

export function ModulePage() {
	// Load in the module's provider to wrap the page in.
	const { moduleId } = useParams()
	if (!moduleId || !isModuleId(moduleId)) return <NotFoundPage message="Module not found" />
	const Provider = moduleProviders[moduleId]
	if (!Provider) throw new Error(`Missing provider for module "${moduleId}".`)

	// Keep the module's state and resources scoped to its ID.
	return <Suspense fallback={<LoadingScreen message="Loading module..." />}>
		<Provider key={moduleId} moduleId={moduleId}>
			<Container maxWidth="lg" sx={{ py: 3 }}>
				<ModulePageContent moduleId={moduleId} />
			</Container>
		</Provider>
	</Suspense>
}
