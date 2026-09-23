import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { useSQLJSContext } from '@sqlvalley/sqljs'

import type { DatabaseSource } from './types'
import { DatabaseCache } from './databaseCache'
import { DatabaseContext } from './context'

// Set up a type that infers the DatasetSize type from a DatabaseSource.
type SourceDatasetSize<Source extends DatabaseSource> = Source extends { datasetSizes: readonly (infer Size extends string)[] } ? Size : (string | undefined)

// The properties that can be given to the DatabaseProvider.
interface DatabaseProviderProps<Source extends DatabaseSource> {
	source: Source
	datasetSize?: SourceDatasetSize<Source>
	setDatasetSize?: (size: SourceDatasetSize<Source>) => void
	defaultDatasetSize?: SourceDatasetSize<Source>
	children: ReactNode
}

// Expose handles to databases to all child components.
export function DatabaseProvider<Source extends DatabaseSource>({ source, children, datasetSize: controlledSize, setDatasetSize: controlledSetter, defaultDatasetSize }: DatabaseProviderProps<Source>) {
	// Check if the datasetSize is controlled externally or left uncontrolled, to be registered internally.
	const controlled = controlledSetter !== undefined
	if (!controlled && controlledSize !== undefined) throw new Error('datasetSize requires setDatasetSize.')
	if (controlled && defaultDatasetSize !== undefined) throw new Error('defaultDatasetSize is only supported in uncontrolled mode.')

	// Get the dataset size, either externally or internally.
	const [internalSize, setInternalSize] = useState<string | undefined>(() => defaultDatasetSize ?? source.datasetSizes?.[0])
	const datasetSize = controlled ? controlledSize : internalSize
	validateDatasetSize(source, datasetSize)

	// Set up a custom setDatasetSize which applies the right registration.
	const setDatasetSize = useCallback((size: string | undefined) => {
		validateDatasetSize(source, size)
		if (controlledSetter) controlledSetter(size)
		else setInternalSize(size)
	}, [source, controlledSetter])

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
