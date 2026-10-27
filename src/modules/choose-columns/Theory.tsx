import type { ComponentProps } from 'react'

import { MeasuredDrawingFigure, Curve, useDrawingTextTarget, useDrawingTargetBounds } from '@step-wise/drawing'
import { DrawingTable, ISQL, SQLDisplay, useQueryResult } from '@sqlvalley/sql'

import { useThemeColor, Page, Par, Section, Info, Warning, Term, Em } from '@/ui'
import { FigureHtml, useTheoryPageDatabase } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know how we can retrieve an entire table in <Term>SQL</Term>, but how do we select only a few of the columns? We'll study the commands needed for it and the options that can be added.</Par>
		</Section>

		<Section title="Select columns (projection)">
			<Par>To retrieve <Em>all</Em> columns from a table, we use <ISQL>SELECT *</ISQL> which means "select all". If we only want to select <Em>specific</Em> columns (apply <Term>projection</Term>) then we have to specify the column names, separated by commas.</Par>
			<FigureSelectColumns />
			<Warning>It is strongly recommended to always pick column and table names that have no spaces and are in lower case. Instead of spaces, use underscores "_". If you really want to deviate from this, you need to wrap the names in <Em>double</Em> quotation marks, like <ISQL>SELECT "First Name" FROM "All Employees";</ISQL> or similar. For column and table names without spaces/uppercase, these quotation marks are allowed but unnecessary.</Warning>
		</Section>

		<Section title="Select unique values">
			<Par>Ideally, in a "clean" database, every table row is unique. Having <Term>duplicate rows</Term> (two rows in which every individual attribute has the same value) is theoretically possible in SQL, but it is not a good habit.</Par>
			<Par>When we select columns, it often <Em>does</Em> occur that we get duplicate rows. To filter those out, we can add the keyword <ISQL>DISTINCT</ISQL> right after <ISQL>SELECT</ISQL>. This instructs the DBMS to squash sets of duplicates into single rows before returning the result.</Par>
			<FigureSelectUnique />
		</Section>

		<Section title="Rename columns">
			<Par>In database tables the columns have names. When retrieving a table, we can optionally adjust the names that the columns have in our output. To <Term>rename</Term> a column, we add the keyword <ISQL>AS</ISQL> followed by the new name of the column.</Par>
			<FigureRenameColumns query={`SELECT
  first_name,
  last_name AS family_name,
  phone AS number
FROM employees;`} />
			<Info>The keyword <ISQL>AS</ISQL> is optional, and it works just as well without. For readability, it is still recommended to add it.</Info>
		</Section>

		<Section title="Deal with multiple tables">
			<Par>So far we have run queries that only request a single table. Later on we will encounter queries involving multiple tables. In that case it may be confusing which column comes from which table, especially if the two tables have columns with the same name. We can indicate what specific table to select a column from through the format <ISQL>table_name.column_name</ISQL>.</Par>
			<FigureRenameColumns query={`SELECT
  employees.first_name,
  employees.last_name AS family_name,
  employees.phone AS number
FROM employees;`} />
			<Par>When the two tables don't have duplicate column names, this table specification is generally not needed, but it is still recommended for clarity. When the two tables do have duplicate column names, this notation is obligatory.</Par>
			<Par>In case the table names are long, we can also <Term>alias</Term> our tables: temporarily rename them within this specific query. This creates a shorter query, which may improve readability. Just as with columns, we may remove <ISQL>AS</ISQL>, but its usage is recommended for readability.</Par>
			<FigureRenameColumns query={`SELECT
  e.first_name,
  e.last_name AS family_name,
  e.phone AS number
FROM employees AS e;`} />
		</Section>
	</Page>
}

function FigureSelectColumns() {
	return <MeasuredDrawingFigure
		targets={['table']}
		calculateView={({ table }) => ({ type: 'identity', width: 800, height: 20 + table.height })}
		style={{ fontSize: 16 }}>
		<FigureSelectColumnsContents />
	</MeasuredDrawingFigure>
}

function FigureSelectColumnsContents() {
	const themeColor = useThemeColor()

	// Set up query data.
	const c1 = 'first_name', c2 = 'last_name', c3 = 'city'
	const query = `
SELECT ${c1}, ${c2}, ${c3}
FROM employees;`
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the editor bounds.
	useDrawingTextTarget('c1QueryBounds', 'query', c1)
	const c1QueryBounds = useDrawingTargetBounds('c1QueryBounds')
	useDrawingTextTarget('c2QueryBounds', 'query', c2)
	const c2QueryBounds = useDrawingTargetBounds('c2QueryBounds')
	useDrawingTextTarget('c3QueryBounds', 'query', c3)
	const c3QueryBounds = useDrawingTargetBounds('c3QueryBounds')

	// Find the table column name bounds.
	useDrawingTextTarget('c1NameBounds', 'table', c1)
	const c1NameBounds = useDrawingTargetBounds('c1NameBounds')
	useDrawingTextTarget('c2NameBounds', 'table', c2)
	const c2NameBounds = useDrawingTargetBounds('c2NameBounds')
	useDrawingTextTarget('c3NameBounds', 'table', c3)
	const c3NameBounds = useDrawingTargetBounds('c3NameBounds')

	return <>
		<FigureHtml target="query" position={[0, 20]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query}</SQLDisplay>
		</FigureHtml>

		<FigureHtml target="table" position={[350, 20]} anchor={[-1, -1]} scale={0.8} behind>
			<DrawingTable data={data} width={450 / 0.8} />
		</FigureHtml>

		{c1QueryBounds && c1NameBounds && c2QueryBounds && c2NameBounds && c3QueryBounds && c3NameBounds ? <>
			<Curve positions={[c1QueryBounds.topRight.add([0, 2]), [c1QueryBounds.right + 40, 0], [c1NameBounds.left - 40, 0], c1NameBounds.topLeft.add([-2, 2])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
			<Curve positions={[c2QueryBounds.topRight.add([0, 2]), [c2QueryBounds.right + 40, 0], [c2NameBounds.left - 40, 0], c2NameBounds.topLeft.add([-2, 2])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
			<Curve positions={[c3QueryBounds.topRight.add([0, 2]), [c3QueryBounds.right + 40, 0], [c3NameBounds.left - 40, 0], c3NameBounds.topLeft.add([-2, 2])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
		</> : null}
	</>
}

function FigureSelectUnique() {
	return <MeasuredDrawingFigure
		targets={['query1', 'table1', 'query2', 'table2']}
		calculateView={({ query1, table1, query2, table2 }) => ({ type: 'identity', width: query1.width + table1.width + query2.width + table2.width + 80, height: Math.max(table1.height, table2.height) })}
		style={{ fontSize: 16 }}>
		<FigureSelectUniqueContents />
	</MeasuredDrawingFigure>
}

function FigureSelectUniqueContents() {
	const themeColor = useThemeColor()

	// Set up query data.
	const c = 'city'
	const query1 = `
SELECT ${c}
FROM employees;`
	const query2 = `
SELECT DISTINCT ${c}
FROM employees;`
	const db = useTheoryPageDatabase()
	const data1 = useQueryResult(db, query1)
	const data2 = useQueryResult(db, query2)

	// Find the table column name bounds.
	const e1Bounds = useDrawingTargetBounds('query1')
	const e2Bounds = useDrawingTargetBounds('query2')
	const t1Bounds = useDrawingTargetBounds('table1')
	const t2Bounds = useDrawingTargetBounds('table2')

	// Set up dimensions.
	const w1 = e1Bounds?.width || 100
	const w2 = t1Bounds?.width || 100
	const w3 = e2Bounds?.width || 100
	const delta1 = 20
	const delta2 = 40

	return <>
		<FigureHtml target="query1" position={[0, 0]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query1}</SQLDisplay>
		</FigureHtml>

		<FigureHtml target="query2" position={[w1 + delta1 + w2 + delta2, 0]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query2}</SQLDisplay>
		</FigureHtml>

		<FigureHtml target="table1" position={[w1 + delta1, 0]} anchor={[-1, -1]} scale={0.8} behind>
			<DrawingTable data={data1} width={160 / 0.8} />
		</FigureHtml>
		<FigureHtml target="table2" position={[w1 + delta1 + w2 + delta2 + w3 + delta1, 0]} anchor={[-1, -1]} scale={0.8} behind>
			<DrawingTable data={data2} width={160 / 0.8} />
		</FigureHtml>

		{e1Bounds && t1Bounds ? <>
			<Curve positions={[e1Bounds.bottomMiddle.add([0, 5]), [e1Bounds.midpoint.x, t1Bounds.midpoint.y + e1Bounds.height / 2], t1Bounds.middleLeft.add([-4, e1Bounds.height / 2])]} stroke={themeColor} smoothing={{ distance: 60 }} endArrow strokeWidth={2} />
		</> : null}
		{e2Bounds && t2Bounds ? <>
			<Curve positions={[e2Bounds.bottomMiddle.add([0, 5]), [e2Bounds.midpoint.x, t2Bounds.midpoint.y + e2Bounds.height / 2], t2Bounds.middleLeft.add([-4, e2Bounds.height / 2])]} stroke={themeColor} smoothing={{ distance: 60 }} endArrow strokeWidth={2} />
		</> : null}
	</>
}

export function FigureRenameColumns(props: ComponentProps<typeof FigureRenameColumnsContents>) {
	return <MeasuredDrawingFigure
		targets={['query', 'table']}
		calculateView={({ query, table }) => ({ type: 'identity', width: query.width + table.width + 80, height: table.height })}
		style={{ fontSize: 16 }}>
		<FigureRenameColumnsContents {...props} />
	</MeasuredDrawingFigure>
}

function FigureRenameColumnsContents({ query = '' }) {
	const themeColor = useThemeColor()

	// Set up query data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the element bounds.
	const eBounds = useDrawingTargetBounds('query')
	const tBounds = useDrawingTargetBounds('table')
	const arrowWidth = 80

	return <>
		<FigureHtml target="query" position={[0, 0]} anchor={[-1, -1]} behind>
			<SQLDisplay>{query}</SQLDisplay>
		</FigureHtml>

		<FigureHtml target="table" position={[(eBounds?.width || 200) + arrowWidth, 0]} anchor={[-1, -1]} scale={0.8} behind>
			<DrawingTable data={data} width={350 / 0.8} />
		</FigureHtml>

		{eBounds && tBounds ? <Curve positions={[eBounds.middleRight.add([4, 0]), [tBounds.left - 4, eBounds.midpoint.y]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}
	</>
}
