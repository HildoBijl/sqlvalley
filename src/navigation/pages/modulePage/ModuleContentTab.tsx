import { Suspense } from 'react'
import { Typography } from '@mui/material'

import { LoadingScreen } from '@/ui'
import type { ModuleContent } from '@/learning'

const emptyMessages: Record<keyof ModuleContent, string> = {
	Theory: 'Theory content coming soon.',
	Summary: 'Summary coming soon.',
	Story: 'Story coming soon.',
	Video: 'Video coming soon.',
}

interface ModuleContentTabProps {
	content: ModuleContent | undefined
	contentKey: keyof ModuleContent
}

export function ModuleContentTab({ content, contentKey }: ModuleContentTabProps) {
	const Content = content?.[contentKey]
	if (!Content) return <Typography color="text.secondary">{emptyMessages[contentKey]}</Typography>
	return <Suspense fallback={<LoadingScreen message="Loading module..." />}>
		<Content />
	</Suspense>
}
