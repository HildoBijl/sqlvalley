import { ISQL } from '@sqlvalley/sql'

import { Page, Par, Section, Warning, Term, Em } from '@/ui'
import { TableQueryFigure, SQLQueryFigure } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know how to aggregate columns using SQL, and we know how to apply filters. It is of course also possible to do both together. However, there's an important distinction between applying a filter <Em>before</Em> and applying a filter <Em>after</Em> aggregation. Let's take a look at how it works.</Par>
		</Section>

		<Section title={<>Filter rows <Em>before</Em> aggregating using <ISQL>WHERE</ISQL></>}>
			<Par>Let's consider the financial performance of the company per quarter.</Par>
			<TableQueryFigure query={`SELECT * FROM quarterly_performance`} tableScale={0.8} tableWidth={900} />
			<Par>Suppose that we want to get the total number of transactions per year, but <Em>only</Em> for paintings. How would we do that?</Par>
			<Par>The key is to first add a <ISQL>WHERE</ISQL> clause to select the rows that we want, throwing out the ones that we don't.</Par>
			<SQLQueryFigure query={`
SELECT *
FROM quarterly_performance
WHERE category = 'PAINTING';`} tableScale={0.8} tableWidth={720} below />
			<Par>Then we apply aggregation to this new table in the usual way. SQL will group the rows, calculate aggregates, and generate the output.</Par>
			<SQLQueryFigure query={`
SELECT fiscal_year, SUM(total_transactions) AS yearly_transactions
FROM quarterly_performance
WHERE category = 'PAINTING'
GROUP BY fiscal_year;`} tableScale={0.8} tableWidth={220} />
			<Par>Note that <ISQL>GROUP BY</ISQL> is written <Em>after</Em> the <ISQL>WHERE</ISQL> clause. This is to signify that the grouping (and subsequently the aggregation) is done <Em>after</Em> running the <ISQL>WHERE</ISQL> clause's filtering.</Par>
		</Section>

		<Section title={<>Filter rows <Em>after</Em> aggregating using <ISQL>HAVING</ISQL></>}>
			<Par>Extending on the previous example, suppose that we only care about the years whose total number of painting transactions exceeds a thousand. In this case, we want to apply a filter to the <Em>aggregated</Em> table. Specifically, we want to filter on the new column <ISQL>yearly_transactions</ISQL>.</Par>
			<Par>The overly long and inconvenient way to do so, would be through a <Term>subquery</Term>.</Par>
			<SQLQueryFigure query={`
SELECT *
FROM (
	SELECT fiscal_year, SUM(total_transactions) AS yearly_transactions
	FROM quarterly_performance
	WHERE category = 'PAINTING'
	GROUP BY fiscal_year
)
WHERE yearly_transactions > 1000;`} tableScale={0.8} tableWidth={220} />
			<Par>Note that we took our aggregated table and treated it as a new table. It works, but it's a bit cumbersome, and since this is a use-case that occurs often in practice, SQL has a cleaner solution. We add a <ISQL>HAVING</ISQL> clause <Em>after</Em> the <ISQL>GROUP BY</ISQL> clause to filter the resulting table.</Par>
			<SQLQueryFigure query={`
SELECT fiscal_year, SUM(total_transactions) AS yearly_transactions
FROM quarterly_performance
WHERE category = 'PAINTING'
GROUP BY fiscal_year
HAVING SUM(total_transactions) > 1000;`} tableScale={0.8} tableWidth={220} />
			<Par>This does the exact same thing, and it looks a lot cleaner!</Par>

			<Par>The <ISQL>HAVING</ISQL> clause works the same as the <ISQL>WHERE</ISQL> clause: you can set up any filter you like. However, keep in mind that the <ISQL>HAVING</ISQL> clause operates on the <Em>aggregated</Em> table. Just as within <ISQL>SELECT</ISQL>, you may only use <Em>grouping columns</Em> and <Em>results of aggregation functions</Em> (or calculations with these values).</Par>
			<Warning>
				<Par sx={{ mb: 1 }}>You may be wondering why we wrote <ISQL>{`HAVING SUM(total_transactions) > 1000`}</ISQL> rather than <ISQL>{`HAVING yearly_transactions > 1000`}</ISQL>. The latter would be clearer!</Par>
				<Par sx={{ mb: 1 }}>The problem here is the evaluation order that SQL uses. The <ISQL>SELECT</ISQL> clause (and with that the creation of the <ISQL>yearly_transactions</ISQL> alias) is only run <Em>after</Em> the <ISQL>HAVING</ISQL> clause. So at the <ISQL>HAVING</ISQL> clause, the name <ISQL>yearly_transactions</ISQL> does not exist yet! Most DBMSs will throw an error if you try to use an alias in your <ISQL>HAVING</ISQL> clause. Some DBMSs, like SQLite, do allow it through a work-around, but it's still not recommended.</Par>
				<Par>The solution is to write the same calculation again. It's a bit double, but it works. If we <Em>really</Em> don't want to repeat our calculations, we can use a subquery after all, as shown at the start.</Par>
			</Warning>
		</Section>

		<Section title="Process numeric values before/after aggregation">
			<Par>Aggregation often goes hand in hand with the further processing of column values. This can be done both before and after aggregation.</Par>
			<Par>First let's check out processing <Em>before</Em> aggregation. Suppose that we want to find the average profit per recorded quarter for each year, for paintings. To do so, we first calculate the profit for each quarter: the revenue minus the expenses. We then find their average.</Par>
			<SQLQueryFigure query={`
SELECT fiscal_year, AVG(revenue - operating_expenses) AS average_quarterly_profit
FROM quarterly_performance
WHERE category = 'PAINTING'
GROUP BY fiscal_year;`} tableScale={0.8} tableWidth={240} />
			<Par>Using basic arithmetic like this is just one example of processing before aggregation. We can use more involved calculations, we can use <ISQL>COALESCE</ISQL> to set up a fallback value in case of <ISQL>NULL</ISQL> values, or we can use <ISQL>CASE WHEN ... THEN ...</ISQL> to deal with even more edge cases.</Par>
			<Par>When we get results from aggregation, we can use these in our calculations too, effectively processing data <Em>after</Em> aggregation. Suppose that, for each category, we want to look at how many entries there are in the table, and also which <Em>percentage</Em> of the total entries this represents.</Par>
			<SQLQueryFigure query={`
SELECT
	category,
	COUNT(*) AS num_entries,
	ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM quarterly_performance), 2) AS percentage
FROM quarterly_performance
GROUP BY category;`} tableScale={0.8} tableWidth={320} />
			<Par>Note that we use <ISQL>COUNT</ISQL> and then start calculating with it, multiplying it by <ISQL>100.0</ISQL> to avoid integer division. Also note that we have casually included a subquery within our calculations for the total number of entries in the table. SQL allows subqueries wherever their values make sense. In this case, the subquery returns a single number, so SQL will treat the subquery as a number and use it in its calculations.</Par>
		</Section>

		<Section title="Use aggregation on text">
			<Par>Though not as common, it is possible to <Term>aggregate text</Term>. Most aggregation functions like <ISQL>SUM</ISQL> and <ISQL>AVG</ISQL> are only intended for numeric values, but a few are still relevant.</Par>
			<SQLQueryFigure query={`
SELECT
	MIN(category) AS first_in_alphabet,
	MAX(category) AS last_in_alphabet
FROM quarterly_performance;`} tableScale={0.8} tableWidth={250} />
			<Par>One particular function that is useful in aggregating text is the <Term>string concatenation</Term> command. It concatenates all the values within a column, adding a separator in-between. It varies per DBMS what it's called: <ISQL>STRING_AGG</ISQL>, <ISQL>GROUP_CONCAT</ISQL>, or <ISQL>LISTAGG</ISQL>. In SQLite, we can for instance make a list of five-letter codes for all product categories, separated by commas (the default separator).</Par>
			<SQLQueryFigure query={`
SELECT GROUP_CONCAT(DISTINCT SUBSTRING(category, 1, 5)) AS category_codes
FROM quarterly_performance;`} tableScale={0.8} tableWidth={120} />
			<Par>Admittedly, it's not the most sensible use-case, but the idea is clear: a <Em>lot</Em> is possible with aggregation.</Par>
		</Section>
	</Page>
}
