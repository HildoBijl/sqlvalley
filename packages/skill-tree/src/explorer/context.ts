import { createContext } from 'react'

import type { ExplorerState } from './types'

export const ExplorerContext = createContext<ExplorerState | undefined>(undefined)
