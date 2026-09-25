import { useContext } from 'react'

import { ModuleContext } from './context'
import type { ExerciseResources } from '../exerciseSessionContext'

export function useModuleContext(): ExerciseResources | undefined {
	return useContext(ModuleContext)
}
