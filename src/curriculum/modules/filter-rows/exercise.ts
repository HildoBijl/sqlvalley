import { buildSimpleSqlExerciseModule, type SimpleSqlExerciseState, type SimpleSqlExercise } from '@/learning/sqlGrading';

const EXERCISES: SimpleSqlExercise[] = [
  {
    id: 'filter-rows-lt-amount',
    version: 1,
    prompt: 'Retrieve all contracts with performance score under 80.',
    solution: `
SELECT *
FROM contracts
WHERE perf_score < 80;
    `,
  },
  {
    id: 'filter-rows-equal-date',
    version: 1,
    prompt: 'Retrieve all contracts where the start date and end date are the same.',
    solution: `
SELECT *
FROM contracts
WHERE start_date = end_date;
    `,
  },
  {
    id: 'filter-rows-string-like',
    version: 1,
    prompt: 'Retrieve all contracts that have the word "sick" anywhere in the status.',
    solution: `
SELECT *
FROM contracts
WHERE status LIKE '%sick%';
    `,
  },
  {
    id: 'filter-rows-gt-date',
    version: 1,
    prompt: 'Find all contracts for employees that started after 2023.',
    solution: `
SELECT *
FROM contracts
WHERE start_date > '2023-12-31';
    `,
  },
];

export type ExerciseState = SimpleSqlExerciseState;

export const {
  generate,
  getDescription,
  validateOutput,
  verifyOutput,
  getSolution,
  listExercises,
  getExerciseById,
} = buildSimpleSqlExerciseModule(EXERCISES);
