import { ISQL } from '@sqlvalley/sql'

import { Page, Section, Par, Info, Quote, List, Term } from '@/ui'
import { SQLQueryFigure } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par>To set up a complex multi-criterion query for a single table, there are five steps to follow. At first these steps add data, and then they start removing it, to end up with the data that we need.</Par>
			<List useNumbers items={[
				<>Select all columns and where needed <Term>create extra columns</Term>.</>,
				<>Set up the <Term>filter</Term> to only get the entries required.</>,
				<>If needed, <Term>sort and limit</Term> the entries.</>,
				<><Term>Cut columns</Term> to only get the required output.</>,
				<><Term>Remove duplicates</Term> if required.</>
			]} />
			<Info>We can use processing expressions in the <ISQL>WHERE</ISQL> and <ISQL>ORDER BY</ISQL> clauses too. Newly defined column names from the <ISQL>SELECT</ISQL> clause may be used within the <ISQL>ORDER BY</ISQL> clause as well, but usually not within the <ISQL>WHERE</ISQL> clause, as it's executed before the <ISQL>SELECT</ISQL> clause.</Info>
			<Quote>Find the salary that was actually paid per contract: the yearly salary scaled to the contract's duration, rounded to whole dollars. Only do so for ended contracts that lasted more than four weeks. Show the five contracts with the highest payouts.</Quote>
			<SQLQueryFigure query={`SELECT
	position,
	ROUND((JULIANDAY(end_date) - JULIANDAY(start_date)) / 365.25 * salary) AS payout
FROM contracts
WHERE end_date IS NOT NULL
	AND JULIANDAY(end_date) - JULIANDAY(start_date) > 28
ORDER BY payout DESC
LIMIT 5;`} tableWidth={300} tableScale={0.8} />
		</Section>
	</Page>
}
