import type { ReactNode } from 'react'

import { useExplorer } from './hooks'
import { useExplorerInternals } from './internalHooks'

interface ExplorerContentProps {
	children: ReactNode
}

// Make its contents draggable and apply the explorer transform.
export function ExplorerContent({ children }: ExplorerContentProps) {
	const { transform } = useExplorer()
	const { bind } = useExplorerInternals()
	return <div {...bind()} style={{ position: 'absolute', inset: 0, cursor: 'grab', touchAction: 'none' }}>
		<div style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0', willChange: 'transform' }}>
			{children}
		</div>
	</div>
}
