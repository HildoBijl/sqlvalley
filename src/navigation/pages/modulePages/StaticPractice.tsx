import { type ComponentType, Suspense } from 'react'

import { LoadingScreen } from '@/ui'

interface StaticPracticeProps {
	component: ComponentType<{ onComplete: () => void, isCompleted: boolean }>
	onComplete: () => void
	isCompleted: boolean
}

export function StaticPractice({ component: Component, ...props }: StaticPracticeProps) {
	return <Suspense fallback={<LoadingScreen message="Loading exercises..." />}>
		<Component {...props} />
	</Suspense>
}
