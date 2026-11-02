import { createContext } from 'react'

import type { useExplorerState } from './useExplorerState.ts'

export type ExplorerInternals = Pick<ReturnType<typeof useExplorerState>, 'bind' | 'handleClickCapture' | 'handlePointerDownCapture'>

export const ExplorerInternalContext = createContext<ExplorerInternals | undefined>(undefined)
