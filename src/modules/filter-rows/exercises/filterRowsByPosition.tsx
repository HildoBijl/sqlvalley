import { sample } from '@step-wise/js-utils'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

export default defineSQLMonoExercise({
	exerciseId: 'filter-rows-by-position',
	definition: {
		generateParameters: ({ context }) => {
			const positions = context.getGradingDatabase('full')
				.exec('SELECT DISTINCT position FROM contracts WHERE position IS NOT NULL')[0]
				.values.map(row => row[0] as string)
			return { position: sample(positions) }
		},
		getSolution: ({ parameters }) => ({
			query: `
SELECT *
FROM contracts
WHERE position='${parameters.position.replace(/'/g, "''")}';`,
		}),
	},
	component: {
		Problem: ({ parameters }) => <>Retrieve all contracts for the position of "{parameters.position}".</>,
	},
})
