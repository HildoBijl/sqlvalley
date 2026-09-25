import type { SQLMonoExerciseSpec } from '@sqlvalley/sql-exercises'

function Problem() {
	return <>The employee count in the departments table seems to be inflated. Create an overview containing the department name, the number of employees as mentioned in the departments table, the total number of employees allocated to the department, the total number of employees that are ONLY allocated to this department, and the first and last name of the department manager. Only show those rows for departments where the difference between the estimated number of employees and the number of employees only allocated to this department is larger than 3.</>
}

const solution = `
WITH emp_alloc_count AS (
	SELECT e_id, COUNT(d_id) AS alloc_count
	FROM allocations
	GROUP BY e_id
),
single_allocations AS (
	SELECT a.e_id, a.d_id
	FROM allocations a
	JOIN emp_alloc_count c ON a.e_id = c.e_id
	WHERE c.alloc_count = 1
),
total_allocations AS (
	SELECT d_id, COUNT(e_id) AS total_allocated
	FROM allocations
	GROUP BY d_id
),
single_alloc_per_dept AS (
	SELECT d_id, COUNT(e_id) AS only_allocated
	FROM single_allocations
	GROUP BY d_id
)
SELECT 
    d.d_name,
    d.nr_employees AS estimated_employees,
    ta.total_allocated,
    COALESCE(sa.only_allocated, 0) AS only_in_this_department,
    m.first_name,
    m.last_name
FROM departments d
JOIN total_allocations ta ON d.d_id = ta.d_id
JOIN single_alloc_per_dept sa ON d.d_id = sa.d_id
JOIN employees m ON d.manager_id = m.e_id
WHERE d.nr_employees - COALESCE(sa.only_allocated, 0) > 3;`

export default {
	exerciseId: 'multilayered-wrong-employee-counts',
	definition: {
		solution,
	},
	component: {
		Problem,
	},
} satisfies SQLMonoExerciseSpec
