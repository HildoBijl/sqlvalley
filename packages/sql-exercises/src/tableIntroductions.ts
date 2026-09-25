import { deduplicate } from '@step-wise/js-utils'
import { type ModuleId, type ModuleTree, ensureModuleId, getRequiredModuleIds } from '@step-wise/module-tree-definition'

// For each table, define the introduction module/modules.
export type TableIntroductions<TableKey extends string = string, Id extends ModuleId = ModuleId> = Readonly<Record<TableKey, Id | readonly Id[]>>

// For each module, list only the tables introduced directly there.
export type TablesIntroducedByModule<TableKey extends string = string> = ReadonlyMap<ModuleId, readonly TableKey[]>

/*
 * Turn TableIntroductions into TablesIntroducedByModule.
 */

interface BuildTablesIntroducedByModuleOptions<TableKey extends string> {
	moduleTree: ModuleTree
	tableIntroductions: TableIntroductions<TableKey>
	tableKeys: readonly TableKey[]
}

export function buildTablesIntroducedByModule<TableKey extends string>({ moduleTree, tableIntroductions, tableKeys }: BuildTablesIntroducedByModuleOptions<TableKey>): TablesIntroducedByModule<TableKey> {
	// Reject misspelled table keys, including entries with no introduction modules.
	const knownTableKeys = new Set<string>(tableKeys)
	for (const tableKey of Object.keys(tableIntroductions)) {
		if (!knownTableKeys.has(tableKey)) throw new Error(`Unknown table key "${tableKey}" in table introductions.`)
	}

	const tablesByModule = new Map<ModuleId, TableKey[]>()
	for (const tableKey of tableKeys) {
		const introduction = tableIntroductions[tableKey]
		if (introduction === undefined) throw new Error(`Missing table introduction definition for table "${tableKey}".`)
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
 * Given TablesIntroducedByModule, determine all tables a module has access to.
 */

interface AvailableTableKeysOptions<TableKey extends string> {
	moduleId: ModuleId
	moduleTree: ModuleTree
	tablesIntroducedByModule: TablesIntroducedByModule<TableKey>
}

export function getAvailableTableKeys<TableKey extends string>({ moduleId, moduleTree, tablesIntroducedByModule }: AvailableTableKeysOptions<TableKey>): TableKey[] {
	const requiredModuleIds = getRequiredModuleIds(moduleTree, [moduleId])
	const availableTableKeys = requiredModuleIds.flatMap(id => tablesIntroducedByModule.get(id) ?? [])
	return deduplicate(availableTableKeys)
}
