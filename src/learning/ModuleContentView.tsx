import { type ComponentType, type LazyExoticComponent, Suspense } from 'react'
import { Typography } from '@mui/material'

import { LoadingScreen } from '@/ui'

export type ModuleContentComponent = ComponentType | LazyExoticComponent<ComponentType>

export interface ModuleContent {
	Theory?: ModuleContentComponent
	Summary?: ModuleContentComponent
	Story?: ModuleContentComponent
	Video?: ModuleContentComponent
}

const emptyMessages: Record<keyof ModuleContent, string> = {
	Theory: 'Theory content coming soon.',
	Summary: 'Summary coming soon.',
	Story: 'Story coming soon.',
	Video: 'Video coming soon.',
}

interface ModuleContentViewProps {
	content: ModuleContent | undefined
	section: keyof ModuleContent
}

export function ModuleContentView({ content, section }: ModuleContentViewProps) {
	const Content = content?.[section]
	if (!Content) return <Typography color="text.secondary">{emptyMessages[section]}</Typography>
	return <Suspense fallback={<LoadingScreen message="Loading module..." />}>
		<Content />
	</Suspense>
}
