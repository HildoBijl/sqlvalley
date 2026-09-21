import { createContext } from 'react'

import type { ModuleContextStatus } from './types'

export const ModuleContext = createContext<ModuleContextStatus | undefined>(undefined)
