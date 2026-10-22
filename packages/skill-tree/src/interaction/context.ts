import { createContext } from 'react'

import type { SkillTreeInteraction } from './types.ts'

export const SkillTreeInteractionContext = createContext<SkillTreeInteraction | undefined>(undefined)
