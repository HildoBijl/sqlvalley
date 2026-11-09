import { ISQL } from '@sqlvalley/sql'

import { Page, Par, List, Section, Info, Warning, Term, Em, Link } from '@/ui'
import { TableQueryFigure, SQLQueryFigure } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know how to select columns with SQL. But how can we <Term>aggregate</Term> columns using SQL? Let's study that, first for full tables and then for groups within tables.</Par>
		</Section>

		<Section title="Aggregate columns using an aggregation function">
			<Par>Let's consider the financial performance of the company per quarter. How can we extract the total number of transactions throughout the years from this table?</Par>
			<TableQueryFigure query={`SELECT * FROM quarterly_performance`} tableWidth={900} tableScale={0.8} />
			<Par>To get the total number of transactions, we have to add up all the values from the <Em>total_transactions</Em> column. We can do this through the <Term>aggregation function</Term> <ISQL>SUM</ISQL>.</Par>
			<SQLQueryFigure query={`
SELECT SUM(total_transactions)
FROM quarterly_performance;`} tableWidth={160} />
			<Par>When SQL finds an aggregation function in the <ISQL>SELECT</ISQL> part, it realizes the query is an <Term>aggregation query</Term>. This means multiple rows will be squashed together into a single value.</Par>
			<Warning>
				<Par sx={{ mb: 1 }}>Whenever we set up an aggregated query (a query that uses an aggregation function), SQL <Em>will</Em> squash rows together. In this case, <Em>do not</Em> select regular columns in the query too. Most DBMSs would throw an error, while some more forgiving DBMSs just pick <Em>any</Em> row they can find, without any guarantees on which one.</Par>
				<SQLQueryFigure query={`
SELECT
	quarter,
	fiscal_year,
	total_transactions,
	SUM(total_transactions)
FROM quarterly_performance;`} tableWidth={380} /></Warning>
		</Section>

		<Section title="Use multiple aggregation functions">
			<Par>SQL has a variety of aggregation functions. The most commonly used ones are the following.</Par>
			<List items={[
				<><ISQL>SUM</ISQL>: finds the <Term>total (sum)</Term> of all the given values in the column.</>,
				<><ISQL>MAX</ISQL>: finds the <Term>highest</Term> value of the column.</>,
				<><ISQL>MIN</ISQL>: finds the <Term>lowest</Term> value of the column.</>,
				<><ISQL>COUNT</ISQL>: finds the <Term>number</Term> of entries (rows) within the column.</>,
				<><ISQL>AVG</ISQL>: finds the <Term>average</Term> value of the column. (So this is the <ISQL>SUM</ISQL> divided by the <ISQL>COUNT</ISQL>.)</>,
			]} />
			<Par>We can use multiple aggregation functions at the same time. When doing so, it is recommended to give them descriptive names that match their meaning. For our example, we can find the largest number of transactions and the average number of transactions per quarter and per product category.</Par>
			<SQLQueryFigure query={`
SELECT
	MAX(total_transactions) AS max_cat_transactions,
	AVG(total_transactions) AS av_cat_transactions,
	COUNT(total_transactions) AS num_entries
FROM quarterly_performance;`} tableWidth={350} />
			<Info>
				<Par>Whenever aggregation functions encounter <ISQL>NULL</ISQL> values, they generally <Em>ignore</Em> them. Any <ISQL>NULL</ISQL> values are first removed, and <Em>only then</Em> will aggregation be applied. As a result:</Par>
				<List sx={{ my: 0.5 }} items={[
					<><ISQL>SUM(total_transactions)</ISQL> gives the sum of all non-<ISQL>NULL</ISQL> <ISQL>total_transactions</ISQL> values.</>,
					<><ISQL>COUNT(total_transactions)</ISQL> counts the number of entries in the <ISQL>total_transactions</ISQL> column that are not <ISQL>NULL</ISQL>.</>,
				]} />
				<Par>To count the number of rows in the table, irrespective of <ISQL>NULL</ISQL> values, use <ISQL>COUNT(*)</ISQL> instead.</Par>
			</Info>
			<Warning>Aggregation functions don't check for duplicates. When using <ISQL>COUNT</ISQL> on some column, it simply counts the number of values that are not <ISQL>NULL</ISQL>, regardless of any duplicate values being present. So <ISQL>COUNT(fiscal_year)</ISQL> results in <ISQL>17</ISQL> too. If you want the number of <Em>unique</Em> values, apply <ISQL>DISTINCT</ISQL> to the column <Em>before</Em> aggregating. So <ISQL>COUNT(DISTINCT fiscal_year)</ISQL> will result in <ISQL>3</ISQL>.</Warning>
		</Section>

		<Section title="Group rows before aggregating">
			<Par>Aggregation becomes a lot more powerful when grouping is introduced. To set up <Term>grouped aggregation</Term> in SQL, add a <ISQL>GROUP BY</ISQL> statement right after <ISQL>FROM</ISQL> (or <ISQL>WHERE</ISQL> if it's present) and specify what column(s) to group by. This causes the rows to first be grouped by equal grouping columns. Aggregation is then performed <Em>separately</Em> within each group.</Par>
			<Par>We could group by only the year.</Par>
			<SQLQueryFigure query={`
SELECT
	fiscal_year,
	MAX(total_transactions) AS max_cat_transactions,
	AVG(total_transactions) AS av_cat_transactions,
	COUNT(total_transactions) AS num_entries
FROM quarterly_performance
GROUP BY fiscal_year;`} tableWidth={500} />
			<Par>Or we could group by quarter and year together.</Par>
			<SQLQueryFigure query={`
SELECT
	quarter,
	fiscal_year,
	MAX(total_transactions) AS max_cat_transactions,
	AVG(total_transactions) AS av_cat_transactions,
	COUNT(total_transactions) AS num_entries
FROM quarterly_performance
GROUP BY fiscal_year, quarter;`} tableWidth={500} />
<Par>We may want to <Link to="/module/sort-and-limit-rows">sort this table</Link> in a more useful order, but that's a different topic.</Par>
			<Info>Earlier we saw that we should not add regular columns to a <ISQL>SELECT</ISQL> statement when using aggregation. Grouping is an exception: when we group by certain columns, then we <Em>can</Em> add these grouping columns to our <ISQL>SELECT</ISQL> statement. In fact, it's very helpful to do so, to get sensible data! After all, the above tables would be very hard to interpret without the <ISQL>fiscal_year</ISQL> column.</Info>
		</Section>
	</Page>
}
