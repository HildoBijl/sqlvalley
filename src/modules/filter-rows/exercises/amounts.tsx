import { expenseCases, money } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'filter-rows',
	key: 'amounts',
	person: 'caesar',
	purpose: 'Isolate expenses by amount.',
	goal: 'Locate the reported charge among other requests.',
	variants: expenseCases.flatMap(item => ['>', '<='].map(operator => ({
		problem: `Retrieve all expenses whose amount is ${operator === '>' ? 'greater than' : 'at most'} ${money(operator === '>' ? item.amount - 1000 : item.amount)}.`,
		query: `SELECT * FROM expenses WHERE amount ${operator} ${operator === '>' ? item.amount - 1000 : item.amount}`,
		evidence: `A department is querying ${item.description}, recorded at ${money(item.amount)}. The threshold is only a way to locate potentially relevant requests.`,
		payoff: `Both entries for that reference meet the requested amount condition. An amount threshold by itself says nothing about whether a payment was legitimate.`,
	}))),
	explanation: 'Compare the numeric amount with the supplied threshold; return every matching row.',
})
