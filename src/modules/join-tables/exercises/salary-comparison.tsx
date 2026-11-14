import { personnelCases, sqlLiteral, money } from '@/curriculum/database'
import { defineStoryExercise } from '@/curriculum/exercises'

export default defineStoryExercise({
	moduleId: 'join-tables',
	key: 'salary-comparison',
	person: 'paris',
	purpose: 'Reconcile a payroll communication with the active agreement.',
	goal: 'Compare linked salary values without attributing the discrepancy.',
	variants: personnelCases.map(item => ({
		problem: `For employees recorded in ${item.recordedCity}, retrieve employee ID, first name, last name, directory salary as directory_salary and contract salary as contract_salary. Include only ACTIVE contracts with no end date.`,
		query: `SELECT e.e_id, e.first_name, e.last_name, e.current_salary AS directory_salary, c.salary AS contract_salary FROM employees AS e JOIN contracts AS c ON c.e_id = e.e_id WHERE e.city = ${sqlLiteral(item.recordedCity)} AND c.status = 'ACTIVE' AND c.end_date IS NULL`,
		evidence: `${item.name} queried a salary communication. Their signed base agreement states ${money(item.salary)}. Leave rows can overlap employment; select the active employment agreement.`,
		payoff: `The directory salary for ${item.name} is ${money(item.recordedSalary)}, while the active agreement records ${money(item.salary)}. The disagreement explains the complaint but does not identify its author.`,
	})),
	explanation: 'Join by employee ID and distinguish the active employment agreement from overlapping leave rows.',
	comparisonOptions: { requireEqualColumnNames: true },
})
