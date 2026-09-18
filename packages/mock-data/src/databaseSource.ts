import { type TableKey, tableKeys, datasetSizes } from './tables'
import { buildDatasetSql } from './buildSql'

export const databaseSource = {
	tableKeys,
	datasetSizes,
	buildSql: ({ tables, size }: { tables: string[]; size?: string }) => {
		if (size === undefined) throw new Error('A dataset size is required.')
		const datasetSize = datasetSizes.find(datasetSize => datasetSize === size)
		if (datasetSize === undefined) throw new Error(`Unknown dataset size "${size}".`)
		return buildDatasetSql({ tables: resolveTableKeys(tables), size: datasetSize })
	},
}

function resolveTableKeys(tables: string[]): TableKey[] {
	return tables.map(table => {
		const key = tableKeys.find(key => key === table)
		if (key === undefined) throw new Error(`Unknown table "${table}".`)
		return key
	})
}
