import { type ComponentProps, type ReactNode, Suspense } from 'react'
import { Container } from '@mui/material'

import { LearningHeader } from '@/learning'
import { LoadingScreen } from '@/ui'
import { type ModuleId, getModulePresentation, moduleProviders } from '@/curriculum'

type ModulePageLayoutProps = Omit<ComponentProps<typeof LearningHeader>, 'title' | 'description'> & {
	moduleId: ModuleId
	children: ReactNode
}

export function ModulePageLayout({ moduleId, children, ...headerProps }: ModulePageLayoutProps) {
	const presentation = getModulePresentation(moduleId)
	const Provider = moduleProviders[moduleId]
	if (!presentation || !Provider) throw new Error(`Missing presentation or provider for module "${moduleId}".`)
	return <Suspense fallback={<LoadingScreen message="Loading module..." />}>
		<Provider key={moduleId} moduleId={moduleId}>
			<Container maxWidth="lg" sx={{ py: 3 }}>
				<LearningHeader title={presentation.name} description={presentation.description} {...headerProps} />
				{children}
			</Container>
		</Provider>
	</Suspense>
}
