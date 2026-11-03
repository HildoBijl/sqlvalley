import { ISQL } from '@sqlvalley/sql'

import { Page, Section, Par, List, Warning, Term, Em } from '@/ui'
import { FigureFiltering } from './Theory'

export function Summary() {
	return <Page>
		<Section>
			<Par>To <Term>filter rows</Term> using <Term>SQL</Term> we add the <ISQL>WHERE</ISQL> keyword to our query, followed by a condition like <ISQL>column_name = some_value</ISQL>. We can set up a comparison for equals <ISQL>=</ISQL>, unequals <ISQL>{`<>`}</ISQL>, larger than <ISQL>{`>`}</ISQL>, smaller than <ISQL>{`<`}</ISQL>, larger-or-equal <ISQL>{`>=`}</ISQL>, or smaller-or-equal <ISQL>{`<=`}</ISQL>. For larger/smaller than, text is usually compared lexicographically (depending on the DBMS settings) and dates/times are compared time-wise, with earlier being smaller.</Par>
			<FigureFiltering query={`SELECT *
FROM contracts
WHERE position >= 'E';`} columnName="position" />
			<Warning>When entering string values in SQL, always use <Em>single</Em> qoutation marks. Both "no quotation marks" and "double quotation marks" represent column/table names.</Warning>
			<Par>On top of the usual comparisons, there are various special comparison methods. <List items={[
				<>To use <Term>text comparison with wild cards</Term>, use <ISQL>LIKE</ISQL>. For example, use <ISQL>position LIKE '%systems%'</ISQL> to find all employee contracts that have "systems" somewhere in their position title. (The <ISQL>%</ISQL> symbol counts as "any piece of text".)</>,
				<>To check for <Term><ISQL>NULL</ISQL> values</Term>, use the <ISQL>IS</ISQL> comparison rather than <ISQL>=</ISQL>. For instance, use <ISQL>end_date IS NULL</ISQL> to find all contracts without end date.</>,
			]} /></Par>
		</Section>
	</Page>
}
