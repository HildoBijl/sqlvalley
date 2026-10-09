import { Box } from '@mui/material'

import { MeasuredDrawing, HtmlElement, Curve } from '@step-wise/drawing'
import { useQueryResult } from '@sqlvalley/sql/databaseProvider'
import { DataTable } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, List, Term } from '@/ui'
import { useFigureTarget, useTheoryPageDatabase } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par><Term>Aggregation</Term> is a table manipulation operation in which groups of rows in a table are squashed together into one or more statistics.</Par>
			<List items={[
				<>We <Term>group</Term> the rows according to <Term>grouping attribute(s)</Term>: rows with equal grouping attributes are grouped together.</>,
				<>For each group, we combine all rows into one or more <Term>aggregated statistics</Term>.</>,
			]} />
			<FigureAggregation />
			<Par>The <Term>aggregated table</Term> usually has the grouping attributes on the left, and the aggregated statistics on the right. Common aggregation methods are the <Term>total</Term> value, the <Term>highest</Term> value, or the <Term>number</Term> of values, but you could even aggregate text values if desired.</Par>
		</Section>
	</Page>
}

function FigureAggregation() {
	return <MeasuredDrawing targets={['table1', 'table2']}
		calculateView={({ table1, table2 }) => ({
			type: 'identity', width: 900,
			height: table1.height + 20 + table2.height,
		})} maxWidth={720} style={{ fontSize: 16 }}>
		<FigureAggregationContents />
	</MeasuredDrawing>
}

function FigureAggregationContents() {
	const themeColor = useThemeColor()
	const db = useTheoryPageDatabase()
	const dataFull = useQueryResult(db, 'SELECT * FROM quarterly_performance;')
	const dataAggregated = useQueryResult(db, 'SELECT fiscal_year, SUM(revenue) AS total_revenue, AVG(revenue) AS average_revenue, MAX(revenue) as highest_revenue, COUNT(1) AS num_quarters FROM quarterly_performance GROUP BY fiscal_year;')

	const [t1Ref, t1Bounds] = useFigureTarget('table1')
	const [t2Ref, t2Bounds] = useFigureTarget('table2')
	const w1 = 900
	const w2 = 500
	const delta = 20
	const arrowMargin = 5
	const h1 = t1Bounds?.height ?? 200
	const h2 = t2Bounds?.height ?? 200

	return <>
		<HtmlElement position={[0, 0]} anchor={[-1, -1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: w1 }}>
				<DataTable ref={t1Ref} data={dataFull} showPagination={false} compact />
			</Box>
		</HtmlElement>

		<HtmlElement position={[w1, h1 + delta]} anchor={[1, -1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: w2 }}>
				<DataTable ref={t2Ref} data={dataAggregated} showPagination={false} compact />
			</Box>
		</HtmlElement>

		<Curve positions={[[(w1 - w2) / 2, h1 + arrowMargin], [(w1 - w2) / 2, h1 + delta + h2 / 2], [w1 - w2 - arrowMargin, h1 + delta + h2 / 2]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
		<HtmlElement position={[(w1 - w2) / 2 + 80, h1 + delta + h2 / 2 - 2]} anchor={[1, -1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ fontWeight: 500, fontSize: '1em', color: themeColor }}>Aggregate by year</span></HtmlElement>
	</>
}
