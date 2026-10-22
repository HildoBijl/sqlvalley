import { useContext } from 'react'

import { ExplorerContext } from './context.ts'

export function useExplorer() {
	const explorer = useContext(ExplorerContext)
	if (!explorer) throw new Error('useExplorer must be used within an Explorer.')
	return explorer
}
