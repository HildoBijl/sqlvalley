import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'sort-and-limit-rows',
	key: 'contract-endings',
	person: 'wheatley',
	purpose: 'Order employment history explicitly.',
	goal: 'Place unknown end dates and break ties predictably.',
	variants: [{ direction: 'ASC', nulls: 'LAST' }, { direction: 'DESC', nulls: 'FIRST' }, { direction: 'ASC', nulls: 'FIRST' }].map(item => ({
		problem: `Retrieve all contracts ordered by end date ${item.direction} with unknown end dates ${item.nulls}, then employee ID and start date ascending.`,
		query: `SELECT * FROM contracts ORDER BY end_date ${item.direction} NULLS ${item.nulls}, e_id ASC, start_date ASC`,
		evidence: 'An open leave row can overlap an open employment row. The request is for ordering, not a classification of who is currently working.',
		payoff: 'The open-ended and historical rows are arranged as requested. That gives me the internal sequence I needed.',
	})),
	explanation: 'Use the two primary-key fields to resolve otherwise equal end dates.',
	comparisonOptions: { requireEqualRowOrder: true },
})
