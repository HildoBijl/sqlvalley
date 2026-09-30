import { datalogModulePositions, datalogConnectors } from './datalog'
import { raModulePositions, raConnectors } from './ra'
import { sqlModulePositions, sqlConnectors } from './sql'

export const skillTreeVisualizationDefinitions = [
	{ id: 'sql', modulePositions: sqlModulePositions, visiblePaths: sqlConnectors, moduleIds: new Set(Object.keys(sqlModulePositions)) },
	{ id: 'ra', modulePositions: raModulePositions, visiblePaths: raConnectors, moduleIds: new Set(Object.keys(raModulePositions)) },
	{ id: 'datalog', modulePositions: datalogModulePositions, visiblePaths: datalogConnectors, moduleIds: new Set(Object.keys(datalogModulePositions)) },
] as const

export type SkillTreeVisualizationDefinition = typeof skillTreeVisualizationDefinitions[number]
export type SkillTreeVisualizationId = SkillTreeVisualizationDefinition['id']

export const skillTreeVisualizations = skillTreeVisualizationDefinitions.map(definition => definition.id)
export const defaultSkillTreeVisualization: SkillTreeVisualizationId = 'sql'
export const skillTreeVisualizationById = new Map<SkillTreeVisualizationId, SkillTreeVisualizationDefinition>(skillTreeVisualizationDefinitions.map(definition => [definition.id, definition]))

export function isSkillTreeVisualizationId(value: unknown): value is SkillTreeVisualizationId {
	return skillTreeVisualizationDefinitions.some(definition => definition.id === value)
}
