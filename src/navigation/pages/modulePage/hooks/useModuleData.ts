import { type ModuleId, getModulePresentation, getAvailableTableKeys, moduleTree, moduleComponents, useModuleExercises } from '@/curriculum'

// Load in general data about the given module.
export function useModuleData(moduleId: ModuleId) {
	// Access the module tree, defined components, presentation files, etcetera.
	const moduleType = moduleTree[moduleId].type
	const content = moduleComponents[moduleId]
	const presentation = getModulePresentation(moduleId)

	// Set up some derived properties.
	const isSkill = moduleType === 'skill'
	const Practice = isSkill ? content?.Practice : undefined
	const tables = isSkill ? getAvailableTableKeys(moduleId) : []

	// Load in the exercises dynamically.
	const { exercises, loading, error } = useModuleExercises(moduleId, { enabled: isSkill && !Practice })
	const hasInteractivePractice = isSkill && !Practice && exercises.length > 0

	// Run a final check and return the result.
	if (!presentation) throw new Error(`Missing presentation for module "${moduleId}".`)
	return { moduleId, moduleType, isSkill, content, presentation, Practice, tables, exercises, hasInteractivePractice, loading, error }
}
