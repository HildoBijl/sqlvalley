import type { ComponentType } from 'react'
import { Typography } from '@mui/material'

import type { MonoExerciseProblemProps } from '@sqlvalley/input-exercise-components'

import { useSqlExerciseContext } from '../../../exerciseContext'

export function createSQLProblem(Problem: ComponentType<MonoExerciseProblemProps>) {
	return function SQLExerciseProblem(props: MonoExerciseProblemProps) {
		const { tableKeys } = useSqlExerciseContext()
		return <>
			<Typography component="div" variant="body1"><Problem {...props} /></Typography>
			{tableKeys.length > 0 ? <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
				Available tables: {[...tableKeys].sort().join(', ')}
			</Typography> : null}
		</>
	}
}
