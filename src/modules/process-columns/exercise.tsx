import {
	createMonoSQLExercise,
	type MonoSQLExerciseSpec,
} from '@sqlvalley/sql-exercises';
import type { ExerciseRegistration } from '@sqlvalley/exercise-manager';

type Parameters = Record<string, never>;

const EXERCISES: MonoSQLExerciseSpec<Parameters>[] = [
	{
		exerciseId: 'process-pay-ratio',
		version: 1,
		Problem: () => <>{'For all contracts, retrieve the employee ID, start date, and the ratio of salary to performance score.'}</>,
		solution: `
SELECT e_id, start_date, salary / perf_score AS pay_ratio
FROM contracts;
    `,
	},
	{
		exerciseId: 'process-budget-per-employee',
		version: 1,
		Problem: () => <>{'Retrieve the department ID, budget, number of employees, and the budget per employee for all departments.'}</>,
		solution: `
SELECT d_id, budget, nr_employees,
       budget / nr_employees AS budget_per_employee
FROM departments;
    `,
	},
	{
		exerciseId: 'process-date-flag',
		version: 1,
		Problem: () => <>{'For all contracts, retrieve the employee ID and a flag indicating if the start date is after the end date. (The flag is TRUE or 1 when the start date is after the end date, and FALSE or 0 when this is not the case. When any of the dates is NULL, the flag is also NULL.)'}</>,
		solution: `
SELECT e_id, start_date > end_date AS wrong_info
FROM contracts;
    `,
	},
];

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return EXERCISES.map((exercise) => createMonoSQLExercise({ ...exercise, skill: skillId }));
}
