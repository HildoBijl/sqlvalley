import { Suspense } from 'react'

import { LoadingScreen } from '@/ui'
import type { ModuleContentComponent, StaticPracticeComponentProps } from '../types'

interface StaticPracticeProps extends StaticPracticeComponentProps {
	component: ModuleContentComponent<StaticPracticeComponentProps>
}

export function StaticPractice({ component: Component, onComplete, isCompleted }: StaticPracticeProps) {
	return <Suspense fallback={<LoadingScreen message="Loading exercises..." />}>
		<Component onComplete={onComplete} isCompleted={isCompleted} />
	</Suspense>
}
