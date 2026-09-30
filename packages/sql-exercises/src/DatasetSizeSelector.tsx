import { ToggleButton, ToggleButtonGroup } from '@mui/material'

import { useDatasetSize } from '@sqlvalley/sql'

import { sqlDatasetSizes } from './datasetSizes'

export function DatasetSizeSelector() {
	const [datasetSize, setDatasetSize] = useDatasetSize()
	return <ToggleButtonGroup
		size="small"
		exclusive
		value={datasetSize}
		aria-label="Dataset size"
		onChange={(_event, nextValue) => {
			if (nextValue !== null) setDatasetSize(nextValue)
		}}
		sx={{ flexWrap: 'wrap', '& .MuiToggleButton-root': { px: 1, py: 0.25, textTransform: 'none' } }}>
		<ToggleButton value={sqlDatasetSizes.small}>Use small data set</ToggleButton>
		<ToggleButton value={sqlDatasetSizes.full}>Use full data set</ToggleButton>
	</ToggleButtonGroup>
}
