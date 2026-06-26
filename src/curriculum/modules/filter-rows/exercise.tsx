import {
  SimpleSQLExercise,
  type SimpleSQLExerciseComponent,
  type SimpleSQLExerciseDefinition,
} from '@/learning/sqlExercises';
import { getModuleTables } from '@/curriculum/utils/moduleAccess';

type Parameters = Record<string, never>;

const EXERCISES: SimpleSQLExerciseDefinition<Parameters>[] = [
  {
    exerciseId: 'filter-rows-lt-amount',
    version: 1,
    generateParameters: () => ({}),
    problem: 'Retrieve all contracts with performance score under 80.',
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
    problem: 'Retrieve all contracts where the start date and end date are the same.',
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
    problem: 'Retrieve all contracts that have the word "sick" anywhere in the status.',
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
    problem: 'Find all contracts for employees that started after 2023.',
    solution: `
SELECT *
FROM contracts
WHERE start_date > '2023-12-31';
    `,
  },
];

const Exercise: SimpleSQLExerciseComponent = ({ skillId, title }) => (
  <SimpleSQLExercise
    skillId={skillId}
    tables={getModuleTables(skillId)}
    definitions={EXERCISES}
    title={title}
  />
);

export default Exercise;
