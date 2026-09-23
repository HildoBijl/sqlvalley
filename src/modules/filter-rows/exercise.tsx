import {
	createMonoSQLExercise,
	SQLExerciseSolution,
	type MonoSQLExerciseSpec,
} from '@sqlvalley/sql-exercises';
import type { ExerciseRegistration } from '@sqlvalley/exercise-manager';

type Parameters = Record<string, never>;

const EXERCISES: MonoSQLExerciseSpec<Parameters>[] = [
	{
		exerciseId: 'filter-rows-lt-amount',
		version: 1,
		generateParameters: () => ({}),
		Problem: () => <>{'Retrieve all contracts with performance score under 80.'}</>,
		Solution: SQLExerciseSolution,
		solution: `
SELECT *
FROM contracts
WHERE perf_score < 80;
    `,
	},
	{
		exerciseId: 'filter-rows-equal-date',
		version: 1,
		generateParameters: () => ({}),
		Problem: () => <>{'Retrieve all contracts where the start date and end date are the same.'}</>,
		Solution: SQLExerciseSolution,
		solution: `
SELECT *
FROM contracts
WHERE start_date = end_date;
    `,
	},
	{
		exerciseId: 'filter-rows-string-like',
		version: 1,
		generateParameters: () => ({}),
		Problem: () => <>{'Retrieve all contracts that have the word "sick" anywhere in the status.'}</>,
		Solution: SQLExerciseSolution,
		solution: `
SELECT *
FROM contracts
WHERE status LIKE '%sick%';
    `,
	},
	{
		exerciseId: 'filter-rows-gt-date',
		version: 1,
		generateParameters: () => ({}),
		Problem: () => <>{'Find all contracts for employees that started after 2023.'}</>,
		Solution: SQLExerciseSolution,
		solution: `
SELECT *
FROM contracts
WHERE start_date > '2023-12-31';
    `,
	},
];

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return EXERCISES.map((exercise) => createMonoSQLExercise({ ...exercise, skill: skillId }));
}
