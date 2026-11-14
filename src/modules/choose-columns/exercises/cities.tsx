import { personnelCases } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'choose-columns',
	key: 'cities',
	person: 'paris',
	purpose: 'Inspect the location values used for travel administration.',
	goal: 'Find the recorded city while keeping attribution open.',
	variants: personnelCases.map(item => ({
		problem: 'Retrieve every distinct city recorded in the employee directory.',
		query: 'SELECT DISTINCT city FROM employees',
		evidence: `${item.name} supplied a verified travel claim based in ${item.city}, but the processing notice used ${item.recordedCity}.`,
		payoff: `${item.recordedCity} appears in the directory. This could explain the travel-processing result; the distinct list alone does not identify an employee or editor.`,
	})),
	explanation: 'DISTINCT removes repeated city values. The separate verified claim supplies context for the unexpected value.',
})
