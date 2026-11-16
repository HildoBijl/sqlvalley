import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const variants = [
	{
		problem: 'For employees recorded in New York, NY, retrieve employee ID, first name, last name, directory salary as directory_salary and contract salary as contract_salary. Include only ACTIVE contracts with no end date.',
		query: 'SELECT e.e_id, e.first_name, e.last_name, e.current_salary AS directory_salary, c.salary AS contract_salary FROM employees AS e JOIN contracts AS c ON c.e_id = e.e_id WHERE e.city = \'New York, NY\' AND c.status = \'ACTIVE\' AND c.end_date IS NULL',
		evidence: 'Noah Chen queried a salary communication. Their signed base agreement states $165,000.00. Leave rows can overlap employment; select the active employment agreement.',
		payoff: 'The directory salary for Noah Chen is $149,000.00, while the active agreement records $165,000.00. The disagreement explains the complaint but does not identify its author.',
	},
	{
		problem: 'For employees recorded in Boston, MA, retrieve employee ID, first name, last name, directory salary as directory_salary and contract salary as contract_salary. Include only ACTIVE contracts with no end date.',
		query: 'SELECT e.e_id, e.first_name, e.last_name, e.current_salary AS directory_salary, c.salary AS contract_salary FROM employees AS e JOIN contracts AS c ON c.e_id = e.e_id WHERE e.city = \'Boston, MA\' AND c.status = \'ACTIVE\' AND c.end_date IS NULL',
		evidence: 'Priya Desai queried a salary communication. Their signed base agreement states $108,000.00. Leave rows can overlap employment; select the active employment agreement.',
		payoff: 'The directory salary for Priya Desai is $99,000.00, while the active agreement records $108,000.00. The disagreement explains the complaint but does not identify its author.',
	},
	{
		problem: 'For employees recorded in Miami, FL, retrieve employee ID, first name, last name, directory salary as directory_salary and contract salary as contract_salary. Include only ACTIVE contracts with no end date.',
		query: 'SELECT e.e_id, e.first_name, e.last_name, e.current_salary AS directory_salary, c.salary AS contract_salary FROM employees AS e JOIN contracts AS c ON c.e_id = e.e_id WHERE e.city = \'Miami, FL\' AND c.status = \'ACTIVE\' AND c.end_date IS NULL',
		evidence: 'Aisha Patel queried a salary communication. Their signed base agreement states $160,000.00. Leave rows can overlap employment; select the active employment agreement.',
		payoff: 'The directory salary for Aisha Patel is $144,000.00, while the active agreement records $160,000.00. The disagreement explains the complaint but does not identify its author.',
	},
] as const

export default defineSQLMonoExercise({
	exerciseId: 'story-join-tables-salary-comparison',
	definition: {
		metadata: { version: 1 },
		generateParameters: () => ({ variant: Math.floor(Math.random() * variants.length) }),
		getSolution: ({ parameters }) => ({ query: variants[parameters.variant].query }),
		comparisonOptions: {requireEqualColumnNames:true},
	},
	component: {
		Problem: ({ parameters }) => <>
			<Par>{variants[parameters.variant].problem}</Par>
			<Par>{variants[parameters.variant].evidence}</Par>
		</>,
		Prompt: ({ parameters }) => <>
			<Par>Purpose: Reconcile a payroll communication with the active agreement.</Par>
			<Par>Goal: Compare linked salary values without attributing the discrepancy.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].evidence}</Par></SpeechBox>
		</>,
		Payoff: ({ parameters }) => <>
			<Par>Purpose: Interpret the investigation’s result.</Par>
			<Par>Goal: Compare linked salary values without attributing the discrepancy.</Par>
			<SpeechBox person="paris"><Par>{variants[parameters.variant].payoff}</Par></SpeechBox>
		</>,
		Solution: ({ parameters }) => <>
			<Par>Join by employee ID and distinguish the active employment agreement from overlapping leave rows.</Par>
			<SQLDisplay>{variants[parameters.variant].query}</SQLDisplay>
		</>,
	},
})
