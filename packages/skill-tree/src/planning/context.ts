import { createContext } from 'react'

import type { SkillTreePlanning } from './types.ts'

export const SkillTreePlanningContext = createContext<SkillTreePlanning | undefined>(undefined)
