import { createContext } from 'react'

import type { useExplorerState } from './useExplorerState'

export type ExplorerInternals = Pick<ReturnType<typeof useExplorerState>, 'bind'>

export const ExplorerInternalContext = createContext<ExplorerInternals | undefined>(undefined)
