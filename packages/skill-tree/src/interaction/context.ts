import { createContext } from 'react'

import type { SkillTreeInteraction } from './types'

export const SkillTreeInteractionContext = createContext<SkillTreeInteraction | undefined>(undefined)
