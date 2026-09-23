import { deduplicate } from '@step-wise/js-utils'
import { type ModuleId, type ModuleTree, ensureModuleId, getRequiredModuleIds } from '@step-wise/module-tree-definition'

// For each table, define the introduction module/modules.
export type TableIntroductions<TableKey extends string = string, Id extends ModuleId = ModuleId> = Readonly<Record<TableKey, Id | readonly Id[]>>

// Per module, define the tables it can access.
export type ModuleAccess<TableKey extends string = string> = ReadonlyMap<ModuleId, readonly TableKey[]>

/*
 * Turn TableIntroductions into ModuleAccess.
 */

interface BuildModuleAccessOptions<TableKey extends string> {
	moduleTree: ModuleTree
	tableIntroductions: TableIntroductions<TableKey>
	tableKeys: readonly TableKey[]
}

export function buildModuleAccess<TableKey extends string>({ moduleTree, tableIntroductions, tableKeys }: BuildModuleAccessOptions<TableKey>): ModuleAccess<TableKey> {
	const tablesByModule = new Map<ModuleId, TableKey[]>()
	for (const tableKey of tableKeys) {
		const introduction = tableIntroductions[tableKey]
		if (introduction === undefined) throw new Error(`Missing module access definition for table "${tableKey}".`)
		const moduleIds = typeof introduction === 'string' ? [introduction] : introduction
		for (const introductionId of moduleIds) {
			ensureModuleId(moduleTree, introductionId)
			const tables = tablesByModule.get(introductionId) ?? []
			tables.push(tableKey)
			tablesByModule.set(introductionId, tables)
		}
	}
	return tablesByModule
}

/*
 * Given ModuleAccess, determine all tables a module has access to.
 */

interface ModuleTableKeysOptions<TableKey extends string> {
	moduleId: ModuleId
	moduleTree: ModuleTree
	moduleAccess: ModuleAccess<TableKey>
}

export function getModuleTableKeys<TableKey extends string>({ moduleId, moduleTree, moduleAccess }: ModuleTableKeysOptions<TableKey>): TableKey[] {
	const accessibleModuleIds = getRequiredModuleIds(moduleTree, [moduleId])
	const accessibleTables = accessibleModuleIds.flatMap(id => moduleAccess.get(id) ?? [])
	return deduplicate(accessibleTables)
}
