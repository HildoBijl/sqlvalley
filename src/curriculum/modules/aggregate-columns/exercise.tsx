import {
  buildSimpleSQLExercise,
  type SimpleSQLExerciseDefinition,
} from '@sqlvalley/sql';
import type { AnyExerciseDefinition } from '@sqlvalley/exercise-engine';
import { SqlPracticeProvider } from '@/curriculum/utils/SqlPracticeProvider';

type Parameters = Record<string, never>;

const EXERCISES: SimpleSQLExerciseDefinition<Parameters>[] = [
  {
    exerciseId: 'aggregate-max-min-revenue',
    version: 1,
    generateParameters: () => ({}),
    problem: 'Create an overview of all fiscal years and, for each respective fiscal year, the lowest and highest revenue obtained by any asset category in any of its quarters.',
    solution: `
SELECT fiscal_year, MIN(revenue) AS min_revenue, MAX(revenue) AS max_revenue
FROM quarterly_performance
GROUP BY fiscal_year;
    `,
  },
  {
    exerciseId: 'aggregate-total-expenses',
    version: 1,
    generateParameters: () => ({}),
    problem: 'Create an overview of the IDs of all departments that ever had expenses and, for each respective department, the total expenses incurred.',
    solution: `
SELECT d_id, SUM(amount) AS total_expenses
FROM expenses
GROUP BY d_id;
    `,
  },
  {
    exerciseId: 'aggregate-highest-expenses',
    version: 1,
    generateParameters: () => ({}),
    problem: 'Create an overview of the IDs of all departments that ever had expenses and, for each respective department, the highest expense it ever incurred.',
    solution: `
SELECT d_id, MAX(amount) AS highest_expense
FROM expenses
GROUP BY d_id;
    `,
  },
];

export default function buildExercises(): AnyExerciseDefinition[] {
  return EXERCISES.map((exercise) => buildSimpleSQLExercise(exercise));
}

export const ModuleProvider = SqlPracticeProvider;
