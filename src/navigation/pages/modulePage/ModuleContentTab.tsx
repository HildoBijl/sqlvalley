import { Suspense } from 'react'
import { Typography } from '@mui/material'

import { LoadingScreen } from '@/ui'
import type { ModuleContent, ModuleContentSection } from '@/learning'

const emptyMessages: Record<ModuleContentSection, string> = {
	Theory: 'Theory content coming soon.',
	Summary: 'Summary coming soon.',
	Story: 'Story coming soon.',
	Video: 'Video coming soon.',
}

interface ModuleContentTabProps {
	content: ModuleContent | undefined
	contentKey: ModuleContentSection
}

export function ModuleContentTab({ content, contentKey }: ModuleContentTabProps) {
	const Content = content?.[contentKey]
	if (!Content) return <Typography color="text.secondary">{emptyMessages[contentKey]}</Typography>
	return <Suspense fallback={<LoadingScreen message="Loading module..." />}>
		<Content />
	</Suspense>
}
