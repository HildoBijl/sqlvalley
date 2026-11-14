import { personnelCases, money } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'write-single-criterion-query',
	key: 'salary-extract',
	person: 'paris',
	purpose: 'Inspect a focused salary extract.',
	goal: 'Compare the directory with a signed agreement.',
	variants: personnelCases.map(item => ({
		problem: `Retrieve employee ID, first name, last name and current salary for employees whose current salary is below ${item.recordedSalary + 1000}.`,
		query: `SELECT e_id, first_name, last_name, current_salary FROM employees WHERE current_salary < ${item.recordedSalary + 1000}`,
		evidence: `${item.name} questions a salary communication. Their signed annual base-salary agreement states ${money(item.salary)}. The threshold only locates low recorded salaries.`,
		payoff: `${item.name} appears with ${money(item.recordedSalary)}, unlike the signed agreement. We have a concrete discrepancy, not evidence of who edited it.`,
	})),
	explanation: 'Use a single condition and select only the required fields.',
})
