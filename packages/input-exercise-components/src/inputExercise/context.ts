import { createContext } from 'react'

import type { InputExerciseContextValue } from './types'

export const InputExerciseContext = createContext<InputExerciseContextValue | undefined>(undefined)
