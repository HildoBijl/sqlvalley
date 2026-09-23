import { useDatabaseContext } from './context'

export function useDatasetSize() {
	const { datasetSize, setDatasetSize } = useDatabaseContext()
	return [datasetSize, setDatasetSize] as const
}
