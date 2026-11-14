import { personnelCases } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'choose-columns',
	key: 'contacts',
	person: 'paris',
	purpose: 'Inspect the contact channel behind a failed notification.',
	goal: 'Compare the recorded channel with staff-confirmed information.',
	variants: personnelCases.map(item => ({
		problem: `Retrieve the employee ID, first name, last name and ${item.contactField} for every employee.`,
		query: `SELECT e_id, first_name, last_name, ${item.contactField} FROM employees`,
		evidence: `${item.name} did not receive a staff notification. Their independently confirmed ${item.contactField} is ${item.contact}.`,
		payoff: `The recorded ${item.contactField} for ${item.name} is missing. That explains the failed handoff, but not who changed the entry.`,
	})),
	explanation: 'Select the required fields without filtering; compare the relevant row with the supplied reference.',
})
