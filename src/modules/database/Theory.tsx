import { Drawing, HtmlElement, Curve, anchors, TargetBoundsDrawing } from '@step-wise/drawing'
import { useQueryResult } from '@sqlvalley/sql/databaseProvider'
import { DataTable } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, List, Warning, Info, Term, Em, Link, Glyph } from '@/ui'
import { TableQueryFigure, useTheoryPageDatabase } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>Suppose that we are working for a company that's looking to keep track of their internal departments. How would we store this data? Could we just put it in something like an Excel file?</Par>
			<TableQueryFigure query={`SELECT * FROM departments;`} title="List of departments" tableWidth={750} />
		</Section>

		<Section title="Why databases: a list of requirements">
			<Par>For many small-scale use cases, storing data in a single file would work. When scaling up, there are various reasons why this fails.</Par>
			<List items={[
				<>When the number of records gets into the millions, it becomes too big for one file. Computers cannot keep it all in their working memory. We need a solution that can <strong>deal with large amounts of data</strong> that doesn't overload the file system.</>,
				<>Finding any desired records will be a challenge. We need a solution that we can <strong>easily ask questions extracting data</strong>, like "Which departments are going over budget?"</>,
				<>Perhaps we want to build a website where users can add new departments, add employees to those departments, and so forth. This website (basically a computer script) should be able to adjust the data, also when multiple users use it at the same time. We hence need a solution in which <strong>applications can adjust data concurrently</strong>.</>,
			]} />
			<Par>To meet all these requirements, databases and corresponding software tools have been created.</Par>
		</Section>

		<Section title="Database: a collection of tables">
			<Par>A <Term>database</Term> stores data. Most databases do so purely in table form. The easiest way to picture a database is therefore as a collection of tables, each filled with potentially large amounts of entries. A small database consists of a few small tables, but bigger databases can have dozens of enormous tables that are all linked to each other in some way.</Par>
			<FigureTwoTables />
			<Info>Most databases, the so-called <Term>relational databases</Term>, use tables. (A "relation" is, roughly put, a mathematical term for a table.) There are a few databases that deviate from this and don't use tables. They for example store graphs (like <Link to="https://neo4j.com/">Neo4j</Link>), JSON objects (like <Link to="https://www.mongodb.com/">MongoDB</Link>) or key-value pairs (like <Link to="https://redis.io/">Redis</Link>). Since this only involves a small subset of all databases, we focus on relational databases for now.</Info>
		</Section>

		<Section title="The database management system">
			<Par>The "database" is the collection of all the data that's stored somewhere. To get this data stored in the desired way, we use a specialized program called a <Term>Database Management System</Term> (DBMS). Examples of DBMSs that use tables are <Link to="https://www.postgresql.org/">PostgreSQL</Link>, <Link to="https://www.mysql.com/">MySQL</Link>, <Link to="https://www.oracle.com/database/">Oracle</Link>, <Link to="https://sqlite.org/">SQLite</Link> and dozens more. The DBMS handles all functionalities around the database, allowing users to read and write data.</Par>
			<FigureDatabaseUsage />
			<Par>Every DBMS has its own specific way of how exactly it stores its data. As a result, a DBMS and a database are inextricably linked. You cannot just take a database and couple it to a different DBMS. It <Em>is</Em> possible (and common) that a single DBMS has multiple different databases on the same machine, for instance for different applications.</Par>
			<Warning>Because a database and its DBMS are so linked, people often use the word "database" when they actually mean DBMS. "Hey, which database are you using at SQL Valley? Oh, we're using SQLite!"</Warning>
		</Section>
	</Page>
}

export function FigureTwoTables() {
	const db = useTheoryPageDatabase()
	const data1 = useQueryResult(db, 'SELECT * FROM departments;')
	const data2 = useQueryResult(db, 'SELECT * FROM employees;')
	const tableScale = 0.6
	return <TargetBoundsDrawing targets={['table1Title', 'table1', 'table2Title', 'table2']} maxWidth={800} style={{ fontSize: 16 }}>
		<HtmlElement target="table1" position={[0, 25]} anchor={[-1, -1]} scale={tableScale} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<DataTable data={data1} width={800} showPagination={false} compact />
		</HtmlElement>
		<HtmlElement target="table1Title" position={{ target: 'table1', anchor: 'topLeft', pixelOffset: [10, 2] }} anchor="bottomLeft" ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of departments</span></HtmlElement>

		<HtmlElement target="table2" position={[80, 104]} anchor={[-1, -1]} scale={tableScale} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<DataTable data={data2} width={1100} showPagination={false} compact />
		</HtmlElement>
		<HtmlElement target="table2Title" position={{ target: 'table2', anchor: 'topRight', pixelOffset: [-10, 2] }} anchor="bottomRight" ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>List of employees</span></HtmlElement>
	</TargetBoundsDrawing>
}

export function FigureDatabaseUsage() {
	const themeColor = useThemeColor()
	const h = 210
	const w = 800
	const y = h / 2 + 32
	const xUser = 60
	const xServer = w / 2
	const xDatabase = w - 60
	const curveSmoothing = { mode: 'around', ratio: 1 } as const

	return <Drawing view={{ type: 'identity', width: w, height: h }}>
		<Glyph name="User" position={[xUser, y - 25]} width={100} />
		<HtmlElement position={[xUser, y + 38]}><span style={{ fontSize: '1em', fontWeight: 500 }}>User</span></HtmlElement>

		<Glyph name="Server" position={[xServer, y - 25]} width={60} />
		<HtmlElement position={[xServer, y + 50]}><span style={{ fontSize: '1em', fontWeight: 500 }}>DBMS</span></HtmlElement>

		<Glyph name="Database" position={[xDatabase, y - 25]} width={100} />
		<HtmlElement position={[xDatabase, y + 38]}><span style={{ fontSize: '1em', fontWeight: 500 }}>Database</span></HtmlElement>

		<Curve positions={[[xUser + 26, y - 70], [(xUser + xServer) / 2, y - 120], [xServer - 35, y - 70]]} smoothing={curveSmoothing} endArrow stroke={themeColor} strokeWidth={2} />
		<HtmlElement position={[(xUser + xServer) / 2, y - 102]} anchor={anchors.bottom}><p style={{ fontSize: '0.8em', lineHeight: '1.2em', fontWeight: 500, margin: 0, textAlign: 'center' }}>"Get me the departments<br />that are going over budget"</p></HtmlElement>

		<Curve positions={[[xServer + 35, y - 70], [(xServer + xDatabase) / 2, y - 120], [xDatabase - 50, y - 70]]} smoothing={curveSmoothing} endArrow stroke={themeColor} strokeWidth={2} />
		<HtmlElement position={[(xServer + xDatabase) / 2, y - 102]} anchor={anchors.bottom}><p style={{ fontSize: '0.8em', lineHeight: '1.2em', fontWeight: 500, margin: 0, textAlign: 'center' }}>Pull up all relevant records</p></HtmlElement>

		<Curve positions={[[xDatabase - 50, y + 20], [(xServer + xDatabase) / 2, y + 70], [xServer + 35, y + 20]]} smoothing={curveSmoothing} endArrow stroke={themeColor} strokeWidth={2} />
		<HtmlElement position={[(xServer + xDatabase) / 2, y + 52]} anchor={anchors.top}><p style={{ fontSize: '0.8em', lineHeight: '1.2em', fontWeight: 500, margin: 0, textAlign: 'center' }}>Give all requested records</p></HtmlElement>

		<Curve positions={[[xServer - 35, y + 20], [(xUser + xServer) / 2, y + 70], [xUser + 50, y + 20]]} smoothing={curveSmoothing} endArrow stroke={themeColor} strokeWidth={2} />
		<HtmlElement position={[(xUser + xServer) / 2, y + 52]} anchor={anchors.top}><p style={{ fontSize: '0.8em', lineHeight: '1.2em', fontWeight: 500, margin: 0, textAlign: 'center' }}>["Finance & Legal", "Operations"]</p></HtmlElement>
	</Drawing>
}
