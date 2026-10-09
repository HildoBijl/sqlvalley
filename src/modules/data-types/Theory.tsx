import { Fragment } from 'react'
import { Box } from '@mui/material'

import { type Position, MeasuredDrawing, HtmlElement, Curve } from '@step-wise/drawing'
import { useQueryResult } from '@sqlvalley/sql/databaseProvider'
import { DataTable, ISQL } from '@sqlvalley/sql'

import { useThemeColor, Page, Section, Par, List, Warning, Info, Term, Em } from '@/ui'
import { useFigureTarget, useFigureTextBounds, useTheoryPageDatabase } from '@/learning'

export function Theory() {
	const now = new Date()
	const date = now.toLocaleDateString('en-CA')
	const time = now.toLocaleTimeString('en-GB', { hour12: false })

	return <Page>
		<Section>
			<Par>In database tables, the fields can take a large variety of values, but there are limitations. Let's study them.</Par>
		</Section>

		<Section title="Each column has a data type">
			<Par>In a database table, every column has a specific <Term>data type</Term>. Let's consider for instance an <ISQL>expenses</ISQL> table tracking the various positions of employees as they move through a company.</Par>
			<FigureDataTypeDemo />
			<Par>Note that some columns contain <Term>numbers</Term>, others contain <Term>text</Term>, and others have <Term>date/time</Term> values. Many DBMSs enforce the declared type. SQLite normally uses <Term>type affinity</Term>: it attempts conversions but may store values of different types in one column. SQLite STRICT tables enforce a narrower set of column types.</Par>
			<Par>Optionally, columns may be given further restrictions. For instance, the <ISQL>perf_score</ISQL> column may be set up to only allow numbers between <ISQL>0</ISQL> and <ISQL>100</ISQL>, and the <ISQL>status</ISQL> column may be set up to only take values from a list of possible employee statuses. The set of all possible values that can be put in a column is formally called the <Term>domain</Term> of that column.</Par>
		</Section>

		<Section title={<>The <ISQL>NULL</ISQL> value</>}>
			<Par>The cells in a database table generally <Em>cannot</Em> be empty. However, they often <Em>can</Em> be given the value <ISQL>NULL</ISQL>. This is a special value recognized by most DBMSs. Having <ISQL>NULL</ISQL> in a cell usually means "This value is not known", although it may also mean "This value is not applicable here." Like for instance when a contract has a <ISQL>start_date</ISQL> but is on-going, and hence does not have an <ISQL>end_date</ISQL> yet.</Par>
			<Warning>You can only put <ISQL>NULL</ISQL> in a cell, if the corresponding column allows this. This depends on the domain that is specified for that column when creating the table.</Warning>
		</Section>

		<Section title="Specific data types">
			<Par>If we create a new database table, we need to specify the types (and domains) of each of the columns. When doing so, we need to be a bit more specific than just mentioning "number" or "text". For example for numbers: are they whole numbers or floating point numbers? How large? With how much precision should we store them? The DBMS needs to know this, so it can reserve the right amount of storage space. This is specified through various specific types, each with their own name.</Par>
			<Info>The available types and their names slightly differ per Database Management System. The types described below are common data types supported by most DBMSs. Variations may occur, and the below list is by no means complete. Always check out the specifications for your own DBMS.</Info>
			<List items={[
				<><strong>Numbers</strong>
					<List items={[
						<>The <ISQL>INTEGER</ISQL> type stores whole numbers like <ISQL>842</ISQL>. Its range depends on the DBMS: SQLite supports signed 64-bit integers, while many other DBMSs use 32-bit <ISQL>INTEGER</ISQL> and provide <ISQL>BIGINT</ISQL> for a larger range. Types such as <ISQL>TINYINT</ISQL> and <ISQL>SMALLINT</ISQL> also vary by DBMS.</>,
						<>The <ISQL>FLOAT</ISQL> type stores floating-point numbers like <ISQL>3,141.592,65</ISQL>. Most DBMSs allow for fine-tuning the precision with which the numbers are stored.</>,
					]} /></>,
				<><strong>Text</strong>
					<List items={[
						<>The <ISQL>VARCHAR(n)</ISQL> type stores a small piece of text like <ISQL>'The Netherlands'</ISQL>. The number <ISQL>n</ISQL> indicates the <Em>maximum</Em> number of characters that can be stored. The permitted maximum depends on the DBMS. SQLite does not enforce the length in a <ISQL>VARCHAR(n)</ISQL> declaration.</>,
						<>The <ISQL>TEXT</ISQL> type stores pieces of text. Its maximum size depends on the DBMS and its configuration.</>,
					]} /></>,
				<><strong>Date/time</strong>
					<List items={[
						<>The <ISQL>DATE</ISQL> type stores a date, like <ISQL>{date}</ISQL>.</>,
						<>The <ISQL>TIME</ISQL> type stores a specific time, like <ISQL>{time}</ISQL>. Millisecond or microsecond precision can be added.</>,
						<>The <ISQL>DATETIME</ISQL> type stores both a date and time, like <ISQL>{`${date} ${time}`}</ISQL>, but without a time zone it does not identify a unique instant across time zones.</>,
					]} /></>,
				<><strong>Other</strong>
					<List items={[
						<>The <ISQL>BOOLEAN</ISQL> type stores either <ISQL>TRUE</ISQL> or <ISQL>FALSE</ISQL>.</>,
						<>Depending on which DBMS you are using, you may use the the <ISQL>INTEGER[]</ISQL> or <ISQL>TEXT[]</ISQL> types for lists, the <ISQL>JSON</ISQL> type for JavaScript objects, the <ISQL>XML</ISQL> type for XML data, and various other options.</>,
					]} /></>,
			]} />
			<Par>It's not necessary to remember all these types. The main lesson is that every data type has limitations on exactly what it can store and with what precision. These limitations should be taken into account.</Par>
		</Section>
	</Page>
}

export function FigureDataTypeDemo() {
	return <MeasuredDrawing targets={['table']}
		calculateView={({ table }) => ({
			type: 'identity', width: 800,
			height: table.height + 73,
		})} style={{ fontSize: 16 }}>
		<FigureDataTypeDemoContents />
	</MeasuredDrawing>
}

function FigureDataTypeDemoContents() {
	const themeColor = useThemeColor()

	// Set up query data.
	const db = useTheoryPageDatabase()
	const data = useQueryResult(db, `SELECT * FROM expenses;`)
	console.log(data)

	// Find the bounds of the table.
	const [tableRef, , table] = useFigureTarget('table')

	useFigureTextBounds('numberColumn', table, data?.columns[1] ?? '')
	useFigureTextBounds('textColumn', table, data?.columns[3] ?? '')
	useFigureTextBounds('dateColumn', table, data?.columns[4] ?? '')
	const labels = [
		{ text: 'Number', target: 'numberColumn', offset: 0 },
		{ text: 'Text', target: 'textColumn', offset: 0 },
		{ text: 'Date', target: 'dateColumn', offset: 15 },
	]

	return <>
		<HtmlElement position={[10, 0]} anchor={[-1, -1]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ fontWeight: 500, fontSize: '0.8em' }}>The expenses table</span></HtmlElement>
		<HtmlElement position={[0, 25]} anchor={[-1, -1]} scale={0.8} behind ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}>
			<Box sx={{ width: 800 / 0.8 }}>
				<DataTable ref={tableRef} data={data} showPagination={false} compact />
			</Box>
		</HtmlElement>

		{labels.map(({ text, target, offset }) => {
			// Share the column's horizontal anchor and the table's bottom edge across both layers.
			const position = (x: number, y: number): Position => ({
				positions: [{ target }, { target: 'table', anchor: 'bottom' }],
				calculate: ([column, table]) => [column.x + offset + x, table.y + y],
			})
			return <Fragment key={text}>
				<HtmlElement position={position(-44, 24)} anchor={[1, 0]} ignoreMouse={false} style={{ whiteSpace: 'normal', width: 'max-content' }}><span style={{ fontWeight: 600, color: themeColor, fontSize: '0.8rem' }}>{text}</span></HtmlElement>
				<Curve positions={[position(-40, 25), position(0, 25), position(0, 2)]} stroke={themeColor} smoothing={{ distance: 15 }} endArrow strokeWidth={2} />
			</Fragment>
		})}
	</>
}
