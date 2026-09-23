import {
	createMonoSQLExercise,
	SQLExerciseSolution,
	type MonoSQLExerciseSpec,
} from '@sqlvalley/sql-exercises';
import type { ExerciseRegistration } from '@sqlvalley/exercise-manager';

type Parameters = Record<string, never>;

const EXERCISES: MonoSQLExerciseSpec<Parameters>[] = [
	{
		exerciseId: 'choose-columns-contacts',
		version: 1,
		generateParameters: () => ({}),
		Problem: () => <>{'List the first name, last name, email, and phone number of all employees. Ensure that the phone number is called "number" as column name.'}</>,
		Solution: SQLExerciseSolution,
		solution: `
SELECT
  first_name,
  last_name,
  email,
  phone AS number
FROM employees;
    `,
		comparisonOptions: {
			requireEqualColumnNames: true,
			requireEqualColumnOrder: false,
		},
	},
	{
		exerciseId: 'choose-columns-department-budgets',
		version: 1,
		generateParameters: () => ({}),
		Problem: () => <>{'Retrieve the department ID, department name and budget of all departments. Ensure that the budget is called "available_money" as column name.'}</>,
		Solution: SQLExerciseSolution,
		solution: `
SELECT
  d_id,
  d_name,
  budget AS available_money
FROM departments;
    `,
		comparisonOptions: {
			requireEqualColumnNames: true,
			requireEqualColumnOrder: false,
		},
	},
	{
		exerciseId: 'choose-columns-cities',
		version: 1,
		generateParameters: () => ({}),
		Problem: () => <>{'Find the list of all cities in which the employees of the company live, without duplicates.'}</>,
		Solution: SQLExerciseSolution,
		solution: `
SELECT DISTINCT city
FROM employees;
    `,
	},
];

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return EXERCISES.map((exercise) => createMonoSQLExercise({ ...exercise, skill: skillId }));
}
