import { createContext } from 'react'

import type { SkillTreePlanning } from './types'

export const SkillTreePlanningContext = createContext<SkillTreePlanning | undefined>(undefined)
