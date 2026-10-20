import { sample } from '@step-wise/js-utils'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { Par } from '@/ui'
import { SpeechBox } from '@/learning'

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
WHERE position='${parameters.position.replace(/'/g, '\'\'')}';`,
		}),
	},
	component: {
		Problem: ({ parameters }) => <>Retrieve all contracts for the position of "{parameters.position}".</>,
		Prompt: ({ parameters }) => <SpeechBox person="anna">
			<Par>I wonder which contracts we have for the position of "{parameters.position}". Could you find them for me?</Par>
		</SpeechBox>,
		Payoff: ({ parameters }) => <SpeechBox person="bob" picturePosition="right">
			<Par>Thanks! Now we can review all the contracts for the position of "{parameters.position}" together.</Par>
		</SpeechBox>,
	},
})
