import type { ReactNode } from 'react'

import { useExplorer } from './hooks'
import { useExplorerInternals } from './internalHooks'

interface ExplorerContentProps {
	children: ReactNode
}

// Set up a container that will be scaled by the surrounding Explorer component. Contents are draggable.
export function ExplorerContent({ children }: ExplorerContentProps) {
	const { transform } = useExplorer()
	const { bind, handleClickCapture, handlePointerDownCapture } = useExplorerInternals()
	return <div
		{...bind()}
		onClickCapture={handleClickCapture}
		onPointerDownCapture={handlePointerDownCapture}
		style={{ position: 'absolute', inset: 0, cursor: 'grab', touchAction: 'none' }}>
		<div style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0', willChange: 'transform' }}>
			{children}
		</div>
	</div>
}
