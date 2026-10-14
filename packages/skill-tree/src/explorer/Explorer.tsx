import type { HTMLAttributes, ReactNode } from 'react'

import type { Rectangle } from '@step-wise/geometry'

import { ExplorerContext } from './context'
import { ExplorerInternalContext } from './internalContext'
import { useExplorerState } from './useExplorerState'

interface ExplorerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	bounds: Rectangle
	children: ReactNode
	initialScale?: number
	allowZoom?: boolean
}

// Provide an interactive viewport that fills its parent.
export function Explorer({ bounds, children, initialScale = 1, allowZoom = true, style, ...props }: ExplorerProps) {
	const { bind, handleClickCapture, handlePointerDownCapture, rootRef, state } = useExplorerState({ bounds, initialScale, allowZoom })
	return <ExplorerContext value={state}>
		<ExplorerInternalContext value={{ bind, handleClickCapture, handlePointerDownCapture }}>
			<div {...props} ref={rootRef} style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', ...style }}>
				{children}
			</div>
		</ExplorerInternalContext>
	</ExplorerContext>
}
