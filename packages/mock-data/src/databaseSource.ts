import { type TableKey, allTableKeys, datasetSizes, defaultDatasetSize } from './tables'
import { buildDatasetSql, buildCompletionSchema } from './buildSql'

export const databaseSource = {
	allTables: allTableKeys,
	defaultSize: defaultDatasetSize,
	buildSql: ({ tables, size }: { tables: string[]; size: string }) => {
		const datasetSize = datasetSizes.find(datasetSize => datasetSize === size)
		if (datasetSize === undefined) throw new Error(`Unknown dataset size "${size}".`)
		return buildDatasetSql({ tables: resolveTableKeys(tables), size: datasetSize })
	},
	buildCompletionSchema: (tables: string[]) => buildCompletionSchema(resolveTableKeys(tables)),
}

function resolveTableKeys(tables: string[]): TableKey[] {
	return tables.map(table => {
		const key = allTableKeys.find(key => key === table)
		if (key === undefined) throw new Error(`Unknown table "${table}".`)
		return key
	})
}
