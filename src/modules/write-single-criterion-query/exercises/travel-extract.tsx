import { personnelCases, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-single-criterion-query',
	key: 'travel-extract',
	person: 'paris',
	purpose: 'Inspect the location used for a travel claim.',
	goal: 'Locate recorded values that conflict with verified staff information.',
	variants: personnelCases.map(item => ({
		problem: `Retrieve employee ID, first name, last name and city for employees whose city is ${item.recordedCity}.`,
		query: `SELECT e_id, first_name, last_name, city FROM employees WHERE city = ${sqlLiteral(item.recordedCity)}`,
		evidence: `${item.name} supplied a verified claim based in ${item.city}, but the processing notice used ${item.recordedCity}.`,
		payoff: `The directory places ${item.name} in ${item.recordedCity}. That provides an explanation for the processing discrepancy, but not its author.`,
	})),
	explanation: 'Select relevant directory fields after one equality filter.',
})
