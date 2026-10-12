import type { ComponentProps } from 'react'

import { MeasuredDrawingFigure, DrawingFigure, Curve, useDrawingTextTarget, useDrawingTargetBounds } from '@step-wise/drawing'
import { DataTable, ISQL, SQLDisplay, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Par, List, Section, Info, Warning, Term, Em } from '@/ui'
import { FigureHtml, useTheoryPageDatabase } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know how to set up a filter in SQL with one condition. In practice, there are usually multiple conditions that interact with each other in various ways. Let's take a look at how we can combine multiple conditions in SQL.</Par>
		</Section>

		<Section title={<>Combine conditions using <ISQL>AND</ISQL></>}>
			<Par>Suppose that we have a list of contracts and want to find all active PR directors. We now have two conditions: we want the employee contract to be active <Em>and</Em> we want the position to be "director of pr". To combine these two conditions in SQL, we can use the <ISQL>AND</ISQL> keyword.</Par>
			<FigureCombinedCondition c1="status" v1="active" c2="position" v2="director of pr" combiner="AND" />
		</Section>

		<Section title={<>Understand how conditions are evaluated</>}>
			<Par>The above query with <ISQL>AND</ISQL> makes sense from a language point of view, but if we want to become skillful with SQL, we need to understand what SQL does behind the scenes.</Par>
			<Par>When SQL is filtering rows through <ISQL>WHERE</ISQL>, it walks through all rows. For each row, it evaluates the given condition.
				<List items={[
					<>It <Em>first</Em> evaluates the <Term>comparisons</Term> (here the <ISQL>=</ISQL> symbols) and resolves them to <ISQL>TRUE</ISQL>, <ISQL>FALSE</ISQL> or <ISQL>NULL</ISQL> (representing "unknown").</>,
					<>It <Em>then</Em> resolves any <Term>combining</Term> keywords like <ISQL>AND</ISQL>. This turns the full condition into <ISQL>TRUE</ISQL>/<ISQL>FALSE</ISQL>/<ISQL>NULL</ISQL>.</>,
					<>In the <Em>end</Em>, the <Term>filter</Term> keeps all rows with <ISQL>TRUE</ISQL> and throws out all other rows.</>,
				]} useNumbers={true} />
			</Par>
			<FigureAndExplanation />
			<Info>The keyword <ISQL>AND</ISQL> always needs a <ISQL>TRUE</ISQL>/<ISQL>FALSE</ISQL>/<ISQL>NULL</ISQL> value before and after it. It <Em>only</Em> resolves to <ISQL>TRUE</ISQL> if <Em>both</Em> values are <ISQL>TRUE</ISQL>.</Info>
		</Section>

		<Section title={<>Combine conditions using <ISQL>OR</ISQL></>}>
			<Par>Very similar to the <ISQL>AND</ISQL> keyword is the <ISQL>OR</ISQL> keyword. This keyword also expects one value before it and one value after it. The <ISQL>OR</ISQL> keyword resolves to <ISQL>TRUE</ISQL> when <Em>at least one</Em> of the two given values is <ISQL>TRUE</ISQL>. It is only <ISQL>FALSE</ISQL> when <Em>both</Em> values are <ISQL>FALSE</ISQL>.</Par>
			<FigureCombinedCondition c1="status" v1="sick leave" c2="position" v2="transportation supervisor" combiner="OR" />
			<Par>It is possible (and common) to combine the <ISQL>AND</ISQL> and <ISQL>OR</ISQL> keywords. When you do so, <Em>always</Em> use brackets to separate them. After all, it is very unclear what <ISQL>TRUE OR TRUE AND FALSE</ISQL> resolves to, while both <ISQL>(TRUE OR TRUE) AND FALSE</ISQL> and <ISQL>TRUE OR (TRUE AND FALSE)</ISQL> have a clear result.</Par>
			<Info><ISQL>OR</ISQL> and <ISQL>AND</ISQL> have interesting behavior when it comes to <ISQL>NULL</ISQL>. Keep in mind that <ISQL>NULL</ISQL> means "unknown". For this reason, both <ISQL>TRUE AND NULL</ISQL> as well as <ISQL>FALSE OR NULL</ISQL> resolve to <ISQL>NULL</ISQL>: their outcomes are unknown. However, <ISQL>FALSE AND NULL</ISQL> will certainly be <ISQL>FALSE</ISQL>, and <ISQL>TRUE OR NULL</ISQL> will always be <ISQL>TRUE</ISQL>, because no matter what value this unknown <ISQL>NULL</ISQL> may have, the outcome is already clear.</Info>
		</Section>

		<Section title={<>Negate conditions using <ISQL>NOT</ISQL></>}>
			<Par>Suppose that we want to find all employees that are <Em>not</Em> active transportation supervisors. To do so, we can use the <ISQL>NOT</ISQL> keyword.</Par>
			<FigureCombinedCondition c1="status" v1="active" c2="position" v2="transportation supervisor" combiner="AND" addNot={true} />
			<Par>The <ISQL>NOT</ISQL> keyword expects a <ISQL>TRUE</ISQL>/<ISQL>FALSE</ISQL>/<ISQL>NULL</ISQL> value after it. It then inverts this value: <ISQL>NOT TRUE</ISQL> resolves to <ISQL>FALSE</ISQL> and <ISQL>NOT FALSE</ISQL> resolves as <ISQL>TRUE</ISQL>. <ISQL>NOT NULL</ISQL> reduces to <ISQL>NULL</ISQL>, since the opposite of an unknown result is still unknown.</Par>
		</Section>

		<Section title="Use logic theory to rewrite conditions">
			<Par>Conditions can often be <Term>rewritten</Term>: we adjust them such that they still do the <Em>same</Em> thing. As a simple example, <ISQL>NOT status = 'active'</ISQL> can also be written as <ISQL>{`status <> 'active'`}</ISQL>.</Par>
			<Par>A powerful trick in rewriting conditions is to expand brackes with <ISQL>NOT</ISQL>. Suppose <ISQL>c1</ISQL> and <ISQL>c2</ISQL> are any conditions.
				<List items={[
					<><ISQL>NOT (c1 AND c2)</ISQL> may be written as <ISQL>NOT c1 OR NOT c2</ISQL>.</>,
					<><ISQL>NOT (c1 OR c2)</ISQL> may be written as <ISQL>NOT c1 AND NOT c2</ISQL>.</>,
				]} />
				In other words: pulling a <ISQL>NOT</ISQL> inside brackets will turn <ISQL>AND</ISQL> into <ISQL>OR</ISQL> and vice versa. This could help us recreate the previous table. We can rewrite the condition <ISQL>NOT (status = 'active' AND position = 'transportation supervisor')</ISQL>.</Par>
			<FigureRewrittenQuery query={`
SELECT *
FROM contracts
WHERE NOT status = 'active' OR NOT position = 'transportation supervisor';`} />
			<Info>The <ISQL>NOT</ISQL> keyword is evaluated <Em>after</Em> the comparison, but <Em>before</Em> the <ISQL>OR</ISQL> keyword. The above condition is equivalent to <ISQL>{`(NOT (status = 'active')) OR (NOT (position = 'transportation supervisor'))`}</ISQL>. The brackets here can be added for clarity, but SQL programmers should know the evaluation orders, so usually they are omitted.</Info>
		</Section>

		<Section title="Use common SQL short-cuts to simplify conditions">
			<Par>There are various short-cuts in SQL that allow you to write conditions more succinctly. Let's study a few.</Par>
			<Par>Suppose that we want to find all employees having a performance score between <ISQL>70</ISQL> and <ISQL>80</ISQL> (inclusive). The normal method is to use the condition <ISQL>{`perf_score >= 70 AND perf_score <= 80`}</ISQL>. The short-cut says we can use the <ISQL>BETWEEN</ISQL> keyword.</Par>
			<FigureRewrittenQuery query={`
SELECT *
FROM contracts
WHERE perf_score BETWEEN 70 AND 80;`} />
			<Par>Now suppose that we want to find all employees that are either on sick leave or on paid leave. The normal method is to use the condition <ISQL>status = 'sick leave' OR status = 'paid leave'</ISQL>. The short-cut is to create a list <ISQL>('sick leave', 'paid leave')</ISQL> of statuses we look for, and see if the status is <ISQL>IN</ISQL> this list.</Par>
			<FigureRewrittenQuery query={`
SELECT *
FROM contracts
WHERE status IN ('sick leave', 'paid leave');`} />
			<Par>Given how broad SQL is, there are dozens more short-cuts like this. If you ever see a keyword you don't recognize, simply look up its specifications to see how it works. In this way, you learn more and more commands as you go.</Par>
		</Section>

		<Section title={<>Merge tables using <ISQL>UNION</ISQL>, <ISQL>INTERSECT</ISQL> and <ISQL>EXCEPT</ISQL></>}>
			<Par>A completely different way to combine different conditions is through <Term>merging tables</Term>. If we have two tables with the <Em>same number of columns</Em>, we can merge them together. One way to do so is through the <ISQL>UNION</ISQL> operator. This operator merges two tables, and it keeps a row if it is in <Em>either</Em> (or both) of the given tables. So it kind of functions like an <ISQL>OR</ISQL>.</Par>
			<FigureMergingTables query1={`SELECT *
FROM contracts
WHERE status = 'sick leave'`} query2={`SELECT *
FROM contracts
WHERE position = 'transportation supervisor'`} operator="UNION" />
			<Par>A similar command is the <ISQL>INTERSECT</ISQL> operator. This one also merges two tables, but it only keeps a row if it is in <Em>both</Em> tables. So it more or less acts like an <ISQL>AND</ISQL>.</Par>
			<FigureMergingTables query1={`SELECT *
FROM contracts
WHERE status = 'active'`} query2={`SELECT *
FROM contracts
WHERE position = 'transportation supervisor'`} operator="INTERSECT" />
			<Par>The final merging operator is the <ISQL>EXCEPT</ISQL>. This one functions as a subtraction: it takes the first table, and it then removes all the rows from it that are in the second table.</Par>
			<FigureMergingTables query1={`SELECT *
FROM contracts
WHERE status = 'active'`} query2={`SELECT *
FROM contracts
WHERE position = 'transportation supervisor'`} operator="EXCEPT" />
			<Warning>The <ISQL>UNION</ISQL>, <ISQL>INTERSECT</ISQL> and <ISQL>EXCEPT</ISQL> commands match columns by their <Em>position</Em> and not by their name. When using them, always make sure that both tables have the columns in the same order. In fact, column names don't even have to match. Types do: you cannot merge a number column with a text one.</Warning>
			<Par>Since the <ISQL>UNION</ISQL>, <ISQL>INTERSECT</ISQL> and <ISQL>EXCEPT</ISQL> keywords do very similar things as <ISQL>AND</ISQL>, <ISQL>OR</ISQL> and <ISQL>NOT</ISQL>, their usage is not so common, but there are a few edge cases where they can be really useful.</Par>
			<Info>
				<Par>Contrary to set theory in mathematics, SQL allows duplicate rows. However, whenever you use <ISQL>UNION</ISQL>, <ISQL>INTERSECT</ISQL> or <ISQL>EXCEPT</ISQL>, duplicates are always removed: a single row remains. If you don't want that, you can use <ISQL>UNION ALL</ISQL>, <ISQL>INTERSECT ALL</ISQL> and <ISQL>EXCEPT ALL</ISQL>. These commands cleverly deal with duplicates. Suppose that table A consists of five identical rows, and table B consists of three of the same identical rows. Then <ISQL>A UNION ALL B</ISQL> has eight rows, <ISQL>A INTERSECT ALL B</ISQL> has three rows, and <ISQL>A EXCEPT ALL B</ISQL> has two rows.</Par>
			</Info>
		</Section>
	</Page>
}

function FigureCombinedCondition(props: ComponentProps<typeof FigureCombinedConditionContents>) {
	return <MeasuredDrawingFigure
		targets={['query', 'table']}
		calculateView={({ query, table }) => ({ type: 'identity', width: 800, height: query.height + 30 + table.height })}
		style={{ fontSize: 16 }}>
		<FigureCombinedConditionContents {...props} />
	</MeasuredDrawingFigure>
}

function FigureCombinedConditionContents({ c1 = '', v1 = '', c2 = '', v2 = '', combiner = 'AND', addNot = false }) {
	const themeColor = useThemeColor()

	// Set up query data.
	const query = `
SELECT *
FROM contracts
WHERE ${addNot ? 'NOT (' : ''}${c1} = '${v1}'
  ${combiner} ${c2} = '${v2}'${addNot ? ')' : ''};`
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the editor bounds.
	const eBounds = useDrawingTargetBounds('query')
	useDrawingTextTarget('c1QueryBounds', 'query', v1)
	const c1QueryBounds = useDrawingTargetBounds('c1QueryBounds')
	useDrawingTextTarget('c2QueryBounds', 'query', v2)
	const c2QueryBounds = useDrawingTargetBounds('c2QueryBounds')

	// Find the table column name bounds.

	useDrawingTextTarget('c1NameBounds', 'table', c1)
	const c1NameBounds = useDrawingTargetBounds('c1NameBounds')
	useDrawingTextTarget('c2NameBounds', 'table', c2)
	const c2NameBounds = useDrawingTargetBounds('c2NameBounds')

	const delta = 30

	return <>
		<FigureHtml target="query" position={[0, 0]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query}</SQLDisplay>
		</FigureHtml>

		{eBounds ? <FigureHtml target="table" position={[0, eBounds.height + delta]} anchor={[-1, -1]} scale={0.8} behind>
			<DataTable data={data} showPagination={false} compact width={800 / 0.8} />
		</FigureHtml> : null}

		{eBounds && c1QueryBounds && c1NameBounds && c2QueryBounds && c2NameBounds ? <>
			<Curve positions={[c1QueryBounds.middleRight.add([4, 0]), [c1NameBounds.midpoint.x, c1QueryBounds.midpoint.y], c1NameBounds.topMiddle.add([0, -4])]} stroke={themeColor} smoothing={{ distance: 60 }} endArrow strokeWidth={2} />
			<Curve positions={[[c2NameBounds.midpoint.x, eBounds.bottom - 6], c2NameBounds.topMiddle]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
		</> : null}
	</>
}

function FigureAndExplanation() {
	return <DrawingFigure view={{ type: 'identity', width: 800, height: 175 }} style={{ fontSize: 16 }}>
		<FigureAndExplanationContents />
	</DrawingFigure>
}

function FigureAndExplanationContents() {
	const themeColor = useThemeColor()

	// Set up query data.
	const db = useTheoryPageDatabase()
	const status = 'active'
	const position = 'director of pr'
	const examplePosition = 'CIO'
	const data = useQueryResult(db, `
SELECT position, status
FROM contracts
WHERE status = '${status}'
  AND position = '${examplePosition}'
LIMIT 1;`)

	// Find the editor bounds.
	const aBounds = useDrawingTargetBounds('aBounds')
	const c1Bounds = useDrawingTargetBounds('c1Bounds')
	const c2Bounds = useDrawingTargetBounds('c2Bounds')
	const r1Bounds = useDrawingTargetBounds('r1Bounds')
	const r2Bounds = useDrawingTargetBounds('r2Bounds')
	const rBounds = useDrawingTargetBounds('rBounds')

	// Position data.
	const lineHeight = 50
	const andX = 382
	const exampleY = 60

	return <>
		{/* Example row */}
		<FigureHtml position={[790, exampleY]} anchor={[1, -1]}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>Example row</span></FigureHtml>
		<FigureHtml position={[600, exampleY + 25]} anchor={[-1, -1]} scale={0.8} behind>
			<DataTable data={data} showPagination={false} compact width={200 / 0.8} />
		</FigureHtml>

		{/* Steps */}
		<FigureHtml position={[0, lineHeight * 0]} anchor={[-1, -1]}>
			<span style={{ fontWeight: 600, fontSize: '1em' }}>To evaluate a condition:</span>
		</FigureHtml>
		<FigureHtml position={[0, lineHeight * 1]} anchor={[-1, -1]}>
			<span style={{ fontWeight: 600, fontSize: '1em' }}>1. Evaluate comparisons</span>
		</FigureHtml>
		<FigureHtml position={[0, lineHeight * 2]} anchor={[-1, -1]}>
			<span style={{ fontWeight: 600, fontSize: '1em' }}>2. Combine results</span>
		</FigureHtml>
		<FigureHtml position={[0, lineHeight * 3]} anchor={[-1, -1]}>
			<span style={{ fontWeight: 600, fontSize: '1em' }}>3. Apply in filter</span>
		</FigureHtml>

		{/* Starting condition */}
		<FigureHtml target="aBounds" position={[andX, lineHeight * 0.1]} anchor={[0, -1]} behind>
			<ISQL>AND</ISQL>
		</FigureHtml>
		{aBounds ? <FigureHtml target="c1Bounds" position={aBounds.middleLeft.add([-7, 0])} anchor={[1, 0]} behind>
			<ISQL>{`status = '${status}'`}</ISQL>
		</FigureHtml> : null}
		{aBounds ? <FigureHtml target="c2Bounds" position={aBounds.middleRight.add([7, 0])} anchor={[-1, 0]} behind>
			<ISQL>{`position = '${position}'`}</ISQL>
		</FigureHtml> : null}

		{/* Step 1 */}
		{c1Bounds && c2Bounds ? <>
			<FigureHtml position={[andX, lineHeight * 1.1]} anchor={[0, -1]} behind>
				<ISQL>AND</ISQL>
			</FigureHtml>
			<FigureHtml target="r1Bounds" position={[c1Bounds.midpoint.x, lineHeight * 1.1]} anchor={[0, -1]} behind>
				<ISQL>TRUE</ISQL>
			</FigureHtml>
			<FigureHtml target="r2Bounds" position={[c2Bounds.midpoint.x, lineHeight * 1.1]} anchor={[0, -1]} behind>
				<ISQL>FALSE</ISQL>
			</FigureHtml>
		</> : null}

		{/* Step 2 */}
		<FigureHtml target="rBounds" position={[andX, lineHeight * 2.1]} anchor={[0, -1]} behind>
			<ISQL>FALSE</ISQL>
		</FigureHtml>

		{/* Step 3 */}
		<FigureHtml position={[andX, lineHeight * 3.1]} anchor={[0, -1]} behind>
			<span style={{ fontWeight: 600, fontSize: '1rem', color: themeColor }}>Row removed</span>
		</FigureHtml>

		{/* Lines */}
		{aBounds && c1Bounds && c2Bounds && r1Bounds && r2Bounds && rBounds ? <>
			<Curve positions={[c1Bounds.bottomLeft.add([-4, -4]), c1Bounds.bottomLeft.add([-4, 4]), c1Bounds.bottomRight.add([4, 4]), c1Bounds.bottomRight.add([4, -4])]} smoothing={{ distance: 8 }} stroke={themeColor} strokeWidth={2} />
			<Curve positions={[c1Bounds.bottomMiddle.add([0, 4]), r1Bounds.topMiddle.add([0, -2])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />

			<Curve positions={[c2Bounds.bottomLeft.add([-4, -4]), c2Bounds.bottomLeft.add([-4, 4]), c2Bounds.bottomRight.add([4, 4]), c2Bounds.bottomRight.add([4, -4])]} smoothing={{ distance: 8 }} stroke={themeColor} strokeWidth={2} />
			<Curve positions={[c2Bounds.bottomMiddle.add([0, 4]), r2Bounds.topMiddle.add([0, -2])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />

			<Curve positions={[r1Bounds.bottomLeft.add([-4, -4]), r1Bounds.bottomLeft.add([-4, 4]), r2Bounds.bottomRight.add([4, 4]), r2Bounds.bottomRight.add([4, -4])]} smoothing={{ distance: 8 }} stroke={themeColor} strokeWidth={2} />
			<Curve positions={[[andX, r1Bounds.bottom + 4], [andX, rBounds.top - 2]]} stroke={themeColor} strokeWidth={2} endArrow smoothing={{ ratio: 1 }} />

			<Curve positions={[rBounds.bottomMiddle.add([0, 2]), [andX, 3.2 * lineHeight]]} stroke={themeColor} strokeWidth={2} endArrow smoothing={{ ratio: 1 }} />
		</> : null}
	</>
}

function FigureRewrittenQuery(props: ComponentProps<typeof FigureRewrittenQueryContents>) {
	return <MeasuredDrawingFigure
		targets={['query', 'table']}
		calculateView={({ query, table }) => ({ type: 'identity', width: 800, height: query.height + 10 + table.height })}
		style={{ fontSize: 16 }}>
		<FigureRewrittenQueryContents {...props} />
	</MeasuredDrawingFigure>
}

function FigureRewrittenQueryContents({ query = '' }) {
	const themeColor = useThemeColor()

	// Set up query data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the editor bounds.
	const eBounds = useDrawingTargetBounds('query')

	// Find the table column name bounds.
	const tBounds = useDrawingTargetBounds('table')

	const delta = 10

	return <>
		<FigureHtml target="query" position={[0, 0]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query}</SQLDisplay>
		</FigureHtml>

		{eBounds ? <FigureHtml target="table" position={[0, eBounds.height + delta]} anchor={[-1, -1]} scale={0.8} behind>
			<DataTable data={data} showPagination={false} compact width={800 / 0.8} />
		</FigureHtml> : null}

		{eBounds && tBounds ? <Curve positions={[eBounds.middleRight.add([2, 0]), [tBounds.midpoint.x + eBounds.width / 2, eBounds.midpoint.y], [tBounds.midpoint.x + eBounds.width / 2, tBounds.top - 4]]} stroke={themeColor} smoothing={{ distance: 40 }} endArrow strokeWidth={2} /> : null}
	</>
}

const delta1 = 15 // Vertically between table 1 and table 2.
const delta2 = 55 // Vertically between table 2 and table 3.
const delta3 = 50 // Horizontall between largest query and tables.
const w2 = 850 // Table width.
const tableScale = 0.7
export function FigureMergingTables(props: ComponentProps<typeof FigureMergingTablesContents>) {
	return <MeasuredDrawingFigure
		targets={['query1', 'query2', 'query', 'table1', 'table2', 'table']}
		calculateView={({ query1, query2, query, table1, table2, table }) => ({ type: 'identity', width: Math.max(query1.width, query2.width, query.width) + delta3 + w2 * tableScale, height: Math.max(query1.height, table1.height) + Math.max(query2.height, table2.height) + Math.max(query.height, table.height) + delta1 + delta2 })}
		style={{ fontSize: 16 }}>
		<FigureMergingTablesContents {...props} />
	</MeasuredDrawingFigure>
}

function FigureMergingTablesContents({ query1 = '', query2 = '', operator = 'UNION' }) {
	const themeColor = useThemeColor()

	// Set up query data.
	const db = useTheoryPageDatabase()
	const data1 = useQueryResult(db, query1)
	const data2 = useQueryResult(db, query2)
	const data = useQueryResult(db, `${query1}
${operator}
${query2}`)

	// Find the editor bounds.
	const e1Bounds = useDrawingTargetBounds('query1')
	const e2Bounds = useDrawingTargetBounds('query2')
	const eBounds = useDrawingTargetBounds('query')

	// Find the table column name bounds.
	const t1Bounds = useDrawingTargetBounds('table1')
	const t2Bounds = useDrawingTargetBounds('table2')
	const tBounds = useDrawingTargetBounds('table')

	const h1 = Math.max(e1Bounds?.height || 200, t1Bounds?.height || 200)
	const h2 = Math.max(e2Bounds?.height || 200, t2Bounds?.height || 200)

	const w1 = Math.max(e1Bounds?.width || 200, e2Bounds?.width || 200, eBounds?.width || 200)
	const width = w1 + delta3 + w2 * tableScale

	return <>
		<FigureHtml target="query1" position={[0, 0]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query1}</SQLDisplay>
		</FigureHtml>

		<FigureHtml target="query2" position={[0, h1 + delta1]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query2}</SQLDisplay>
		</FigureHtml>

		<FigureHtml target="query" position={[0, h1 + delta1 + h2 + delta2]} anchor={[-1, -1]} behind>
			<SQLDisplay>{`${query1}
${operator}
${query2}`}</SQLDisplay>
		</FigureHtml>

		<FigureHtml target="table1" position={[width, 0]} anchor={[1, -1]} scale={tableScale} behind>
			<DataTable data={data1} showPagination={false} compact width={w2} />
		</FigureHtml>

		<FigureHtml target="table2" position={[width, h1 + delta1]} anchor={[1, -1]} scale={tableScale} behind>
			<DataTable data={data2} showPagination={false} compact width={w2} />
		</FigureHtml>

		<FigureHtml target="table" position={[width, h1 + delta1 + h2 + delta2]} anchor={[1, -1]} scale={tableScale} behind>
			<DataTable data={data} showPagination={false} compact width={w2} />
		</FigureHtml>

		{/* Horizontal arrows */}
		{e1Bounds && t1Bounds ? <Curve positions={[e1Bounds.middleRight.add([2, 0]), [t1Bounds.left - 2, e1Bounds.midpoint.y]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}
		{e2Bounds && t2Bounds ? <Curve positions={[e2Bounds.middleRight.add([2, 0]), [t2Bounds.left - 2, e2Bounds.midpoint.y]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}
		{eBounds && tBounds ? <Curve positions={[eBounds.middleRight.add([2, 0]), [tBounds.left - 2, eBounds.midpoint.y]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}

		{/* Operator arrow */}
		{t2Bounds && tBounds ? <>
			<Curve positions={[t2Bounds.bottomMiddle.add([0, 2]), tBounds.topMiddle.add([0, -2])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
			<FigureHtml position={[tBounds.midpoint.x + 8, (t2Bounds.bottom + tBounds.top) / 2 - 4]} anchor={[-1, 0]}><ISQL>{operator}</ISQL></FigureHtml>
		</> : null}
	</>
}
