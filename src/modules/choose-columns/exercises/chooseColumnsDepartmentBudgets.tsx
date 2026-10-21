import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { SpeechBox } from '@/learning'
import { Par } from '@/ui'

const solution = `
SELECT
  d_id AS department_id,
  d_name AS department_name,
  manager_id AS responsible_manager,
  nr_employees AS recorded_staff
FROM departments;`

export default defineSQLMonoExercise({
	exerciseId: 'choose-columns-department-report-aliases',
	definition: {
		solution,
		comparisonOptions: { requireEqualColumnNames: true },
	},
	component: {
		Problem: () => <>Create a department extract containing the department ID, department name, manager ID, and recorded number of employees. Rename the output columns to "department_id", "department_name", "responsible_manager", and "recorded_staff" respectively.</>,
		Prompt: () => <SpeechBox person="paris">
			<Par>My planning report claims Strategy and Corporate Affairs has thirty employees. It has three. Before I challenge the report, I want an extract from the departments table with headings the executive team will understand.</Par>
			<Par>Select the identifying and staffing fields, and rename them to department_id, department_name, responsible_manager, and recorded_staff.</Par>
		</SpeechBox>,
		Payoff: () => <SpeechBox person="paris">
			<Par>The source row really does record thirty staff for Strategy and Corporate Affairs. The report copied it faithfully; the malformed value is in the departments table.</Par>
			<Par>That is not a harmless label mismatch. One extra zero can distort staffing plans, access reviews, and every summary built from this table.</Par>
		</SpeechBox>,
	},
})
