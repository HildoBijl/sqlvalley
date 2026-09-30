import { datalogModulePositions } from './datalog'
import { raModulePositions } from './ra'
import { sqlModulePositions } from './sql'

export const skillTreeVisualizationDefinitions = [
	{ id: 'sql', label: 'Learn SQL', path: '/learn', moduleIds: new Set(Object.keys(sqlModulePositions)) },
	{ id: 'ra', label: 'Learn RA', path: '/learn-ra', moduleIds: new Set(Object.keys(raModulePositions)) },
	{ id: 'datalog', label: 'Learn Datalog', path: '/learn-datalog', moduleIds: new Set(Object.keys(datalogModulePositions)) },
] as const

export type SkillTreeVisualizationDefinition = typeof skillTreeVisualizationDefinitions[number]
export type SkillTreeVisualizationId = SkillTreeVisualizationDefinition['id']

export const skillTreeVisualizations = skillTreeVisualizationDefinitions.map(definition => definition.id)
export const defaultSkillTreeVisualization: SkillTreeVisualizationId = 'sql'
export const skillTreeVisualizationById = new Map<SkillTreeVisualizationId, SkillTreeVisualizationDefinition>(skillTreeVisualizationDefinitions.map(definition => [definition.id, definition]))

export function isSkillTreeVisualizationId(value: unknown): value is SkillTreeVisualizationId {
	return skillTreeVisualizationDefinitions.some(definition => definition.id === value)
}
