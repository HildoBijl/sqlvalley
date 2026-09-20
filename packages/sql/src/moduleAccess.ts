import { type ModuleId, type ModuleTree, ensureModuleId, getRequiredModuleIds } from '@step-wise/module-tree-definition'

export type ModuleAccess<TableKey extends string = string, Id extends ModuleId = ModuleId> = Readonly<Record<TableKey, Id | readonly Id[]>>

interface ModuleTableKeysOptions<TableKey extends string> {
	moduleId: ModuleId
	moduleTree: ModuleTree
	moduleAccess: ModuleAccess<TableKey>
	tableKeys: readonly TableKey[]
}

// A table is accessible when any of its introduction modules is required.
export function getModuleTableKeys<TableKey extends string>({ moduleId, moduleTree, moduleAccess, tableKeys }: ModuleTableKeysOptions<TableKey>): TableKey[] {
	const accessibleModuleIds = getRequiredModuleIds(moduleTree, [moduleId])
	const tablesByModule = new Map<ModuleId, TableKey[]>()
	for (const tableKey of tableKeys) {
		const introduction = moduleAccess[tableKey]
		if (introduction === undefined) throw new Error(`Missing module access definition for table "${tableKey}".`)
		const moduleIds = typeof introduction === 'string' ? [introduction] : introduction
		for (const introductionId of moduleIds) {
			ensureModuleId(moduleTree, introductionId)
			const tables = tablesByModule.get(introductionId) ?? []
			tables.push(tableKey)
			tablesByModule.set(introductionId, tables)
		}
	}
	const accessibleTables = accessibleModuleIds.flatMap(id => tablesByModule.get(id) ?? [])
	return Array.from(new Set(accessibleTables))
}
