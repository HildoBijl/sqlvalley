import { Suspense } from 'react'
import { Typography } from '@mui/material'

import { LoadingScreen } from '@/ui'
import type { ModuleContentComponent, StoryProps } from '@/learning'

interface ModuleStoryProps {
	completed: boolean
	Story: ModuleContentComponent<StoryProps> | undefined
}

// Pass the module's completion status to its Story and handle loading or missing content.
export function ModuleStory({ completed, Story }: ModuleStoryProps) {
	if (!Story) return <Typography color="text.secondary">Story coming soon.</Typography>
	return <Suspense fallback={<LoadingScreen message="Loading story..." />}>
		<Story completed={completed} />
	</Suspense>
}
