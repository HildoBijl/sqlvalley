import { createContext } from 'react'

import type { ExerciseResources } from '../exerciseSessionContext'

export const ModuleContext = createContext<ExerciseResources | undefined>(undefined)
