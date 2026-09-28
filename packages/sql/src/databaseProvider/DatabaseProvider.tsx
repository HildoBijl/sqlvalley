import { type ReactNode, useCallback, useEffect, useMemo } from 'react'

import { type StateHandle, useControllableState } from '@step-wise/react-utils'
import { useSQLJSContext } from '@sqlvalley/sqljs'

import type { DatabaseSource } from './types'
import { DatabaseCache } from './databaseCache'
import { DatabaseContext } from './context'

// Set up a type that infers the DatasetSize type from a DatabaseSource.
type SourceDatasetSize<Source extends DatabaseSource> = Source extends { datasetSizes: readonly (infer Size extends string)[] } ? Size : (string | undefined)

// The properties that can be given to the DatabaseProvider.
interface DatabaseProviderProps<Source extends DatabaseSource> {
	source: Source
	datasetSizeHandle?: StateHandle<SourceDatasetSize<Source>>
	defaultDatasetSize?: SourceDatasetSize<Source>
	children: ReactNode
}

// Expose handles to databases to all child components.
export function DatabaseProvider<Source extends DatabaseSource>({ source, children, datasetSizeHandle, defaultDatasetSize }: DatabaseProviderProps<Source>) {
	if (datasetSizeHandle !== undefined && defaultDatasetSize !== undefined) throw new Error('defaultDatasetSize is only supported in uncontrolled mode.')

	// Use an internal state fallback if no datasetSizeHandle is given.
	const [datasetSize, setSize] = useControllableState<SourceDatasetSize<Source>>(
		datasetSizeHandle,
		() => {
			const size = defaultDatasetSize ?? source.datasetSizes?.[0]
			validateDatasetSize(source, size)
			return size
		},
	)
	validateDatasetSize(source, datasetSize)

	// Set up a custom setDatasetSize which applies the right registration.
	const setDatasetSize = useCallback((size: string | undefined) => {
		validateDatasetSize(source, size)
		setSize(size)
	}, [source, setSize])

	// Connect to SQLJS and set up a database cache.
	const { SQLJS, error } = useSQLJSContext()
	const cache = useMemo(() => SQLJS ? new DatabaseCache(SQLJS, source) : undefined, [SQLJS, source])
	useEffect(() => () => cache?.dispose(), [cache])

	// Wrap all values into the provider.
	return <DatabaseContext.Provider value={{ source, cache, error: error ?? undefined, datasetSize, setDatasetSize }}>
		{children}
	</DatabaseContext.Provider>
}

function validateDatasetSize<Source extends DatabaseSource>(source: Source, size: string | undefined): asserts size is SourceDatasetSize<Source> {
	if (source.datasetSizes === undefined) {
		if (size !== undefined) throw new Error('This database source does not have selectable sizes.')
	} else if (size === undefined || !source.datasetSizes.includes(size)) {
		throw new Error(`Unknown dataset size "${size}".`)
	}
}
