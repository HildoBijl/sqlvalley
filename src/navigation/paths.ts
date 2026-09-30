import type { ModuleId, SkillTreeVisualizationId } from '@/curriculum'

export const learningRoutes = [
	{ id: 'sql', path: '/learn', label: 'Learn SQL' },
	{ id: 'ra', path: '/learn-ra', label: 'Learn RA' },
	{ id: 'datalog', path: '/learn-datalog', label: 'Learn Datalog' },
] as const satisfies readonly { id: SkillTreeVisualizationId, path: string, label: string }[]

export function getLearningPath(treeId: SkillTreeVisualizationId) {
	return learningRoutes.find(route => route.id === treeId)!.path
}

export function getModulePath(moduleId: ModuleId) {
	return `/module/${moduleId}`
}
