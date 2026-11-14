import { saleCases } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-single-table-query',
	key: 'sale-shortlists',
	person: 'caesar',
	purpose: 'Inspect a concise, reproducible deal shortlist.',
	goal: 'Combine a reporting window, status, ordering and a limit.',
	variants: saleCases.map(item => ({
		problem: `Retrieve transaction ID, product ID and price for up to five COMPLETED transactions dated on ${item.date}, ordered by price ascending with unknowns last, then transaction ID ascending.`,
		query: `SELECT t_id, prod_id, price FROM transactions WHERE status = 'COMPLETED' AND date_time >= '${item.date}' AND date_time < DATE('${item.date}', '+1 day') ORDER BY price ASC NULLS LAST, t_id ASC LIMIT 5`,
		evidence: `The report concerns the day of questioned transaction ${item.id}; timestamps include hours, so include the whole day.`,
		payoff: 'This shortlist shows the stored results in the requested window. A selected day is not evidence that the whole business is failing.',
	})),
	explanation: 'Use a half-open timestamp interval to include the whole day, then order before limiting.',
	comparisonOptions: { requireEqualRowOrder: true },
})
