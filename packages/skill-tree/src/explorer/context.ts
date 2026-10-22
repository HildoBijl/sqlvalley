import { createContext } from 'react'

import type { ExplorerState } from './types.ts'

export const ExplorerContext = createContext<ExplorerState | undefined>(undefined)
