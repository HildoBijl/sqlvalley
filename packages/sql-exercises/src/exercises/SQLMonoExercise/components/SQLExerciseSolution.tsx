import { Stack, Typography } from '@mui/material'

import { SQLDisplay } from '@sqlvalley/sql'
import { useSolution } from '@sqlvalley/input-exercise-components'

export function SQLExerciseSolution() {
	const solution = useSolution()
	if (!solution || typeof solution.query !== 'string') throw new Error('A SQL solution must contain a query string.')
	return <Stack spacing={2}>
		<Typography component="p">One way of solving the above problem is through the following query.</Typography>
		<SQLDisplay>{solution.query}</SQLDisplay>
		<Typography component="p">As always, there are multiple ways to set this up, so other solutions may be fine too, as long as they give the same output.</Typography>
	</Stack>
}
