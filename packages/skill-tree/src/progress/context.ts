import { createContext } from 'react'

import type { SkillTreeProgress } from './types'

export const SkillTreeProgressContext = createContext<SkillTreeProgress | undefined>(undefined)
