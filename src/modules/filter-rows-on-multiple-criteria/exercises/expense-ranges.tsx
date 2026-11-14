import { expenseCases, sqlLiteral } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'filter-rows-on-multiple-criteria',
	key: 'expense-ranges',
	person: 'caesar',
	purpose: 'Separate a disputed service from unrelated spending.',
	goal: 'Combine text matching with numeric boundaries.',
	variants: expenseCases.flatMap(item => [true, false].map(inclusive => ({
		problem: `Retrieve all expenses whose description contains invoice LS- and whose amount is ${inclusive ? 'at least' : 'greater than'} ${inclusive ? item.amount : item.amount - 1000} but less than ${item.amount + 1000}.`,
		query: `SELECT * FROM expenses WHERE description LIKE ${sqlLiteral('%invoice LS-%')} AND amount ${inclusive ? '>=' : '>'} ${inclusive ? item.amount : item.amount - 1000} AND amount < ${item.amount + 1000}`,
		evidence: `The purchase paperwork lists one service invoice for ${item.description}. Use the reference and this amount window to find the competing requests.`,
		payoff: 'The two requests share the reference and amount window. A repeat service can be legitimate, so the source invoice and authorization still matter.',
	}))),
	explanation: 'All conditions must hold: the reference, the lower boundary and the upper boundary.',
})
