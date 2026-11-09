import { ISQL } from '@sqlvalley/sql'

import { Page, Section, Par, List, Warning, Info, Em } from '@/ui'
import { SQLQueryFigure } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par>Aggregation can be combined with filtering.</Par>
			<List items={[
				<>To filter rows <Em>before</Em> aggregation is applied, use a <ISQL>WHERE</ISQL> clause <Em>before</Em> <ISQL>GROUP BY</ISQL>. It operates on the original table.</>,
				<>To filter rows <Em>after</Em> aggregation is applied, use a <ISQL>HAVING</ISQL> clause <Em>after</Em> <ISQL>GROUP BY</ISQL>. It operates on the aggregated table.</>,
			]} />
			<Info>You may <Em>not</Em> use columns from the original table in the <ISQL>HAVING</ISQL> filter, other than those given at <ISQL>GROUP BY</ISQL>. You <Em>can</Em> use additional aggregation functions.</Info>
			<SQLQueryFigure query={`
SELECT fiscal_year, SUM(total_transactions) AS yearly_transactions
FROM quarterly_performance
WHERE category = 'PAINTING'
GROUP BY fiscal_year
HAVING SUM(total_transactions) > 1000;`} tableScale={0.8} tableWidth={220} />
			<Warning>In most DBMSs you <Em>cannot</Em> use the aliases defined in the <ISQL>SELECT</ISQL> clause within the <ISQL>HAVING</ISQL> clause. This means you may have to repeat calculations.</Warning>
			<Par>When using aggregation, it is common to process values. This processing can happen both before and after aggregation.</Par>
			<SQLQueryFigure query={`
SELECT fiscal_year, AVG(revenue - operating_expenses) AS average_quarterly_profit
FROM quarterly_performance
WHERE category = 'PAINTING'
GROUP BY fiscal_year;`} tableScale={0.8} tableWidth={240} />
			<SQLQueryFigure query={`
SELECT
	category,
	COUNT(*) AS num_entries,
	ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM quarterly_performance), 2) AS percentage
FROM quarterly_performance
GROUP BY category;`} tableScale={0.8} tableWidth={320} />
		</Section>
	</Page>
}
