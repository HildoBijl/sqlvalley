import {
	createMonoSQLExercise,
	SQLExerciseSolution,
	type MonoSQLExerciseSpec,
} from '@sqlvalley/sql-exercises';
import type { ExerciseRegistration } from '@sqlvalley/exercise-manager';

type Parameters = Record<string, never>;

const EXERCISES: MonoSQLExerciseSpec<Parameters>[] = [
	{
		exerciseId: 'lookup-manager-city',
		version: 1,
		generateParameters: () => ({}),
		Problem: () => <>{'Find the names of the departments whose manager lives in Palo Alto.'}</>,
		Solution: SQLExerciseSolution,
		solution: `
SELECT d_name
FROM departments
WHERE manager_id IN (
    SELECT e_id
    FROM employees
    WHERE city = 'Palo Alto'
);
    `,
	},
	{
		exerciseId: 'lookup-employee-position',
		version: 1,
		generateParameters: () => ({}),
		Problem: () => <>{'Find the first and last name of all employees that have ever worked as a warehouse associate.'}</>,
		Solution: SQLExerciseSolution,
		solution: `
SELECT first_name, last_name
FROM employees
WHERE e_id IN (
    SELECT e_id
    FROM contracts
    WHERE position = 'warehouse associate'
);
    `,
	},
	{
		exerciseId: 'lookup-manager-sick',
		version: 1,
		generateParameters: () => ({}),
		Problem: () => <>{'Find the names of the departments whose manager has at some point been on sick leave.'}</>,
		Solution: SQLExerciseSolution,
		solution: `
SELECT d_name
FROM departments
WHERE manager_id IN (
    SELECT e_id
    FROM contracts
    WHERE status = 'sick leave'
);
    `,
	},
	//   {
	//     id: 'lookup-validator-names',
	//     prompt: 'Retrieve the names of employees who appear as validators in transactions where the customer ID is the same as the vendor ID.',
	//     solution: `
	// SELECT first_name, last_name
	// FROM employees
	// WHERE e_id IN (
	//   SELECT validated_by
	//   FROM transactions
	//   WHERE buyer = vendor
	// );
	//     `,
	//   },
	//   {
	//     id: 'lookup-before-vendor-created',
	//     prompt: 'Retrieve all transactions that occurred before the corresponding vendor’s registration date.',
	//     solution: `
	// SELECT *
	// FROM transactions t
	// WHERE t.date_time < (
	//     SELECT a.created_at
	//     FROM accounts a
	//     WHERE a.username = t.vendor
	// );
	//     `,
	//   },
];

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return EXERCISES.map((exercise) => createMonoSQLExercise({ ...exercise, skill: skillId }));
}
