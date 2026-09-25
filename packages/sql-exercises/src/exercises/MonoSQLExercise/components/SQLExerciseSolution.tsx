import { SQLDisplay } from '@sqlvalley/sql'
import { useSolution } from '@sqlvalley/input-exercise-components'

export function SQLExerciseSolution() {
	const solution = useSolution()
	if (!solution || typeof solution.query !== 'string') throw new Error('A SQL solution must contain a query string.')
	return <SQLDisplay>{solution.query}</SQLDisplay>
}
