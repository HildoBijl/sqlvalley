import { createContext } from 'react'

import type { SkillTreeData } from './types'

export const SkillTreeDataContext = createContext<SkillTreeData | undefined>(undefined)
