import { createContext } from 'react'

import type { ExerciseSessionContextValue } from './types'

export const ExerciseSessionContext = createContext<ExerciseSessionContextValue | undefined>(undefined)
