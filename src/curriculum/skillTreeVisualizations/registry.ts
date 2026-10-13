import { datalogModulePositioning } from './datalog'
import { raModulePositioning } from './ra'
import { sqlModulePositioning } from './sql'

// All defined skill trees.
export const skillTreeVisualizationDefinitions = [
	{ id: 'sql', modulePositioning: sqlModulePositioning, moduleIds: new Set(Object.keys(sqlModulePositioning.modulePositions)) },
	{ id: 'ra', modulePositioning: raModulePositioning, moduleIds: new Set(Object.keys(raModulePositioning.modulePositions)) },
	{ id: 'datalog', modulePositioning: datalogModulePositioning, moduleIds: new Set(Object.keys(datalogModulePositioning.modulePositions)) },
] as const

// The IDs of the existing skill trees.
export type SkillTreeVisualizationDefinition = typeof skillTreeVisualizationDefinitions[number]
export type SkillTreeVisualizationId = SkillTreeVisualizationDefinition['id']
export const skillTreeVisualizations = skillTreeVisualizationDefinitions.map(definition => definition.id)

// The skill trees in a map.
export const skillTreeVisualizationById = new Map<SkillTreeVisualizationId, SkillTreeVisualizationDefinition>(skillTreeVisualizationDefinitions.map(definition => [definition.id, definition]))

// A type checker for skill tree IDs.
export function isSkillTreeVisualizationId(value: unknown): value is SkillTreeVisualizationId {
	return skillTreeVisualizationDefinitions.some(definition => definition.id === value)
}

// The default skill tree for the site.
export const defaultSkillTreeVisualization: SkillTreeVisualizationId = 'sql'
