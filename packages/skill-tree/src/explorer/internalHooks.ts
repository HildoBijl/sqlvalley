import { useContext } from 'react'

import { ExplorerInternalContext } from './internalContext'

export function useExplorerInternals() {
	const explorer = useContext(ExplorerInternalContext)
	if (!explorer) throw new Error('useExplorerInternals must be used within an Explorer.')
	return explorer
}
