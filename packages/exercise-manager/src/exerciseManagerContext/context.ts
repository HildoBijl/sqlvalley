import { createContext } from 'react'

import type { ExerciseManagerContextValue } from './types'

export const ExerciseManagerContext = createContext<ExerciseManagerContextValue | undefined>(undefined)
