import { createContext } from 'react'

import type { SkillTreeData } from './types.ts'

export const SkillTreeDataContext = createContext<SkillTreeData | undefined>(undefined)
