import type { HTMLAttributes, ReactNode } from 'react'

import { ExplorerContext } from './context'
import { ExplorerInternalContext } from './internalContext'
import type { ExplorerOptions } from './types'
import { useExplorerState } from './useExplorerState'

export interface ExplorerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, ExplorerOptions {
	children: ReactNode
}

// Set up a viewport that fills its parent and will function as Explorer container. It also provides a context.
export function Explorer({
	bounds,
	children,
	initialFocus,
	initialScale = 1,
	minScale = 0,
	maxScale = 1.5,
	dragOverflow = 50,
	allowZoom = true,
	style,
	...props
}: ExplorerProps) {
	const explorer = useExplorerState({ bounds, initialFocus, initialScale, minScale, maxScale, dragOverflow, allowZoom })
	const { bind, handleClickCapture, handlePointerDownCapture, rootRef, state } = explorer
	return <ExplorerContext value={state}>
		<ExplorerInternalContext value={{ bind, handleClickCapture, handlePointerDownCapture }}>
			<div {...props} ref={rootRef} style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', ...style }}>
				{children}
			</div>
		</ExplorerInternalContext>
	</ExplorerContext>
}
