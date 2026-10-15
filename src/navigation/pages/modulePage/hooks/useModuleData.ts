import type { ModuleContent } from '@/learning'
import { type ModuleId, getModulePresentation, getAvailableTableKeys, moduleTree } from '@/curriculum'
import { hasModuleExercises } from '@/modules'

// Load in general data about the given module.
export function useModuleData(moduleId: ModuleId, content: ModuleContent) {
	// Access the module tree, defined components, presentation files, etcetera.
	const moduleType = moduleTree[moduleId].type
	const presentation = getModulePresentation(moduleId)

	// Set up some derived properties.
	const isSkill = moduleType === 'skill'
	const Practice = isSkill ? content?.Practice : undefined
	const tables = isSkill ? getAvailableTableKeys(moduleId) : []

	// Check whether this module offers separately loaded interactive exercises.
	const hasInteractivePractice = isSkill && !Practice && hasModuleExercises(moduleId)

	// Run a final check and return the result.
	if (!presentation) throw new Error(`Missing presentation for module "${moduleId}".`)
	return { moduleId, moduleType, isSkill, content, presentation, Practice, tables, hasInteractivePractice }
}
