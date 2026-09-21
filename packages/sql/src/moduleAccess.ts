import { type ModuleId, type ModuleTree, ensureModuleId, getRequiredModuleIds } from '@step-wise/module-tree-definition'

// For each table, define the introduction module/modules.
export type ModuleAccess<TableKey extends string = string, Id extends ModuleId = ModuleId> = Readonly<Record<TableKey, Id | readonly Id[]>>

// A list of all options needed to determine, for the given moduleId, which tables may be accessed.
interface ModuleTableKeysOptions<TableKey extends string> {
	moduleId: ModuleId
	moduleTree: ModuleTree
	moduleAccess: ModuleAccess<TableKey>
	tableKeys: readonly TableKey[]
}

// Determine which tables are accessible at the given module. To do this, look at all tables introduced by prerequisites of the given module (and the module itself).
export function getModuleTableKeys<TableKey extends string>({ moduleId, moduleTree, moduleAccess, tableKeys }: ModuleTableKeysOptions<TableKey>): TableKey[] {
	// Invert the moduleAccess list: find for each module which tables are introduced there.
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

	// Get the prerequisites and join together all introduced tables.
	const accessibleModuleIds = getRequiredModuleIds(moduleTree, [moduleId])
	const accessibleTables = accessibleModuleIds.flatMap(id => tablesByModule.get(id) ?? [])
	return Array.from(new Set(accessibleTables))
}
