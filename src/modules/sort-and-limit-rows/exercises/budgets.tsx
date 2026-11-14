import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'sort-and-limit-rows',
	key: 'budgets',
	person: 'wheatley',
	purpose: 'Prepare a ranked department report.',
	goal: 'Return the requested order with deterministic ties.',
	variants: ['ASC', 'DESC'].map(direction => ({
		problem: `Retrieve all departments ordered by budget ${direction}, with unknown budgets last, then department ID ascending.`,
		query: `SELECT * FROM departments ORDER BY budget ${direction} NULLS LAST, d_id ASC`,
		evidence: `The requested internal report uses ${direction === 'ASC' ? 'smallest' : 'largest'} budgets first.`,
		payoff: 'That is the ordering I needed for the internal brief. I’ll take the report from here.',
	})),
	explanation: 'Specify direction and null placement. The unique department ID resolves equal budgets.',
	comparisonOptions: { requireEqualRowOrder: true },
})
