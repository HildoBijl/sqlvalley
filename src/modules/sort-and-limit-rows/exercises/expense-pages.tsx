import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'sort-and-limit-rows',
	key: 'expense-pages',
	person: 'wheatley',
	purpose: 'Extract a page of an ordered spending report.',
	goal: 'Apply sorting, limits and offsets consistently.',
	variants: [{ limit: 3, offset: 0 }, { limit: 5, offset: 2 }, { limit: 4, offset: 1 }].map(item => ({
		problem: `Retrieve ${item.limit} expenses after skipping the first ${item.offset}, ordered by amount descending with unknowns last, then expense ID ascending.`,
		query: `SELECT * FROM expenses ORDER BY amount DESC NULLS LAST, exp_id ASC LIMIT ${item.limit} OFFSET ${item.offset}`,
		evidence: 'This is a page request, not a claim that a particular expense is suspicious. Preview and full-data rankings may differ.',
		payoff: 'That is the page I asked for. The ranking gives me the selected internal records.',
	})),
	explanation: 'ORDER BY defines the order before OFFSET skips rows and LIMIT keeps the requested page.',
	comparisonOptions: { requireEqualRowOrder: true },
})
