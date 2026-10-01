import { Suspense } from 'react'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'

import { LoadingScreen } from '@/ui'
import { type ModuleId, isModuleId } from '@/curriculum'
import { useModule } from '@/modules'

import { NotFoundPage } from '../NotFoundPage'

import { ModulePageContent } from './ModulePageContent'

export function ModulePage() {
	const { moduleId } = useParams()
	if (!moduleId || !isModuleId(moduleId)) return <NotFoundPage message="Module not found" />

	return <Suspense fallback={<LoadingScreen message="Loading module..." />}>
		<LoadedModulePage moduleId={moduleId} />
	</Suspense>
}

function LoadedModulePage({ moduleId }: { moduleId: ModuleId }) {
	const { ModuleProvider, ...content } = useModule(moduleId)

	// Keep the module's state and resources scoped to its ID.
	return <ModuleProvider key={moduleId} moduleId={moduleId}>
		<Container maxWidth="lg" sx={{ py: 3 }}>
			<ModulePageContent moduleId={moduleId} content={content} />
		</Container>
	</ModuleProvider>
}
