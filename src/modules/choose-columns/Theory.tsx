import type { ComponentProps } from 'react'
import { Box } from '@mui/material'

import { MeasuredDrawing, HtmlElement, Curve } from '@step-wise/drawing'
import { useQueryResult } from '@sqlvalley/sql/databaseProvider'
import { DataTable, ISQL, SQLDisplay } from '@sqlvalley/sql'

import { useThemeColor, Page, Par, Section, Info, Warning, Term, Em } from '@/ui'
import { useFigureTarget, useFigureTextBounds, useTheoryPageDatabase } from '@/learning'

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
	return <MeasuredDrawing targets={['table']}
		calculateView={({ table }) => ({
			type: 'identity', width: 800,
			height: 20 + table.height,
		})} style={{ fontSize: 16 }}>
		<FigureSelectColumnsContents />
	</MeasuredDrawing>
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
	const [eRef, , editor] = useFigureTarget('query')
	const c1QueryBounds = useFigureTextBounds('c1QueryBounds', editor, c1)
	const c2QueryBounds = useFigureTextBounds('c2QueryBounds', editor, c2)
	const c3QueryBounds = useFigureTextBounds('c3QueryBounds', editor, c3)

	// Find the table column name bounds.
	const [tRef, , table] = useFigureTarget('table')
	const c1NameBounds = useFigureTextBounds('c1NameBounds', table, c1)
	const c2NameBounds = useFigureTextBounds('c2NameBounds', table, c2)
	const c3NameBounds = useFigureTextBounds('c3NameBounds', table, c3)

	return <>
		<HtmlElement ref={eRef} position={[0, 20]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<SQLDisplay>{query}</SQLDisplay>
		</HtmlElement>

		<HtmlElement position={[350, 20]} anchor={[-1, -1]} scale={0.8} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: 450 / 0.8 }}>
				<DataTable ref={tRef} data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{c1QueryBounds && c1NameBounds && c2QueryBounds && c2NameBounds && c3QueryBounds && c3NameBounds ? <>
			<Curve positions={[c1QueryBounds.bottomRight.add([0, 2]), [c1QueryBounds.right + 40, 0], [c1NameBounds.left - 40, 0], c1NameBounds.bottomLeft.add([-2, 2])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
			<Curve positions={[c2QueryBounds.bottomRight.add([0, 2]), [c2QueryBounds.right + 40, 0], [c2NameBounds.left - 40, 0], c2NameBounds.bottomLeft.add([-2, 2])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
			<Curve positions={[c3QueryBounds.bottomRight.add([0, 2]), [c3QueryBounds.right + 40, 0], [c3NameBounds.left - 40, 0], c3NameBounds.bottomLeft.add([-2, 2])]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} />
		</> : null}
	</>
}

function FigureSelectUnique() {
	return <MeasuredDrawing targets={['query1', 'table1', 'query2', 'table2']}
		calculateView={({ query1, table1, query2, table2 }) => ({
			type: 'identity', width: query1.width + table1.width + query2.width + table2.width + 80,
			height: Math.max(table1.height, table2.height),
		})} style={{ fontSize: 16 }}>
		<FigureSelectUniqueContents />
	</MeasuredDrawing>
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
	const [e1Ref, e1Bounds] = useFigureTarget('query1')
	const [e2Ref, e2Bounds] = useFigureTarget('query2')
	const [t1Ref, t1Bounds] = useFigureTarget('table1')
	const [t2Ref, t2Bounds] = useFigureTarget('table2')

	// Set up dimensions.
	const w1 = e1Bounds?.width || 100
	const w2 = t1Bounds?.width || 100
	const w3 = e2Bounds?.width || 100
	const delta1 = 20
	const delta2 = 40

	return <>
		<HtmlElement ref={e1Ref} position={[0, 0]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<SQLDisplay>{query1}</SQLDisplay>
		</HtmlElement>

		<HtmlElement ref={e2Ref} position={[w1 + delta1 + w2 + delta2, 0]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<SQLDisplay>{query2}</SQLDisplay>
		</HtmlElement>

		<HtmlElement position={[w1 + delta1, 0]} anchor={[-1, -1]} scale={0.8} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: 160 / 0.8 }}>
				<DataTable ref={t1Ref} data={data1} showPagination={false} compact />
			</Box>
		</HtmlElement>
		<HtmlElement position={[w1 + delta1 + w2 + delta2 + w3 + delta1, 0]} anchor={[-1, -1]} scale={0.8} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: 160 / 0.8 }}>
				<DataTable ref={t2Ref} data={data2} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{e1Bounds && t1Bounds ? <>
			<Curve positions={[e1Bounds.topMiddle.add([0, 5]), [e1Bounds.midpoint.x, t1Bounds.midpoint.y + e1Bounds.height / 2], t1Bounds.middleLeft.add([-4, e1Bounds.height / 2])]} stroke={themeColor} smoothing={{ distance: 60 }} endArrow strokeWidth={2} />
		</> : null}
		{e2Bounds && t2Bounds ? <>
			<Curve positions={[e2Bounds.topMiddle.add([0, 5]), [e2Bounds.midpoint.x, t2Bounds.midpoint.y + e2Bounds.height / 2], t2Bounds.middleLeft.add([-4, e2Bounds.height / 2])]} stroke={themeColor} smoothing={{ distance: 60 }} endArrow strokeWidth={2} />
		</> : null}
	</>
}

export function FigureRenameColumns(props: ComponentProps<typeof FigureRenameColumnsContents>) {
	return <MeasuredDrawing targets={['query', 'table']}
		calculateView={({ query, table }) => ({
			type: 'identity', width: query.width + table.width + 80,
			height: table.height,
		})} style={{ fontSize: 16 }}>
		<FigureRenameColumnsContents {...props} />
	</MeasuredDrawing>
}

function FigureRenameColumnsContents({ query = '' }) {
	const themeColor = useThemeColor()

	// Set up query data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, query)

	// Find the element bounds.
	const [eRef, eBounds] = useFigureTarget('query')
	const [tRef, tBounds] = useFigureTarget('table')
	const arrowWidth = 80

	return <>
		<HtmlElement ref={eRef} position={[0, 0]} anchor={[-1, -1]} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<SQLDisplay>{query}</SQLDisplay>
		</HtmlElement>

		<HtmlElement position={[(eBounds?.width || 200) + arrowWidth, 0]} anchor={[-1, -1]} scale={0.8} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: 350 / 0.8 }}>
				<DataTable ref={tRef} data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{eBounds && tBounds ? <Curve positions={[eBounds.middleRight.add([4, 0]), [tBounds.left - 4, eBounds.midpoint.y]]} stroke={themeColor} endArrow strokeWidth={2} smoothing={{ ratio: 1 }} /> : null}
	</>
}
