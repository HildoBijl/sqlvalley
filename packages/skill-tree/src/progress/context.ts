import { createContext } from 'react'

import type { SkillTreeProgress } from './types.ts'

export const SkillTreeProgressContext = createContext<SkillTreeProgress | undefined>(undefined)
