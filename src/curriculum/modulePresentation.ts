import { type ModuleId, isModuleId } from './moduleDefinition'

export interface ModulePresentation {
	name: string
	description: string
}

export const modulePresentation = {
	// Database concepts.
	'database': {
		name: 'Databases',
		description: 'What are databases? Why do we need them? And how are they set up?',
	},
	'database-table': {
		name: 'Database Tables',
		description: 'How are database tables built up? And what do we call their parts?',
	},
	'query-language': {
		name: 'Query Languages',
		description: 'How can we "talk" with a database? How do we program their instructions?',
	},
	'data-types': {
		name: 'Data Types',
		description: 'What possible values can database fields have?',
	},
	'database-keys': {
		name: 'Database Keys',
		description: 'How can we uniquely identify a table row?',
	},
	'projection-and-filtering': {
		name: 'Projection and Filtering',
		description: 'How can we manipulate tables, for instance by selecting specific columns/rows?',
	},
	'foreign-key': {
		name: 'Foreign Keys',
		description: 'How do references from one table to another table work?',
	},
	'join-and-decomposition': {
		name: 'Join and Decomposition',
		description: 'How can we split a large table up into multiple smaller tables, and then put them back together?',
	},
	'database-view': {
		name: 'Database Views',
		description: 'How can we represent new derived tables without storing new data?',
	},
	'aggregation': {
		name: 'Aggregation',
		description: 'How can we merge multiple rows together into joint (aggregated) statistics?',
	},
	'recursive-query': {
		name: 'Recursive Queries',
		description: 'How do we request data in an iterative way, jumping through links until we found everything?',
	},

	// SQL.
	'sql': {
		name: 'SQL',
		description: 'What is the SQL query language, and what should I know about it?',
	},
	'choose-columns': {
		name: 'Choose Columns',
		description: 'How do we use SQL to select and possibly rename columns from a table?',
	},
	'filter-rows': {
		name: 'Filter Rows',
		description: 'How do we use SQL to filter table records based on a single condition?',
	},
	'write-single-criterion-query': {
		name: 'Write Single-Criterion Query',
		description: 'How do we write simple SQL queries using basic column selection and row filtering?',
	},
	'filter-rows-on-multiple-criteria': {
		name: 'Filter Rows on Multiple Criteria',
		description: 'How do we set up filters with multiple conditions, combined in various ways?',
	},
	'process-columns': {
		name: 'Process Columns',
		description: 'How do we create new derived columns from existing columns?',
	},
	'sort-and-limit-rows': {
		name: 'Sort and Limit Rows',
		description: 'How can we use SQL to sort the records in a table, and optionally only retrieve the first few?',
	},
	'write-single-table-query': {
		name: 'Write Single-Table Query',
		description: 'How do we set up advanced queries extracting data from a single table in various ways?',
	},
	'aggregate-columns': {
		name: 'Aggregate Columns',
		description: 'How do we use SQL to apply aggregation, merging multiple rows into joint statistics?',
	},
	'write-filtered-aggregation-query': {
		name: 'Write Filtered Aggregation Query',
		description: 'How do we select which rows to aggregate, and/or subsequently filter aggregated results?',
	},
	'write-lookup-query': {
		name: 'Write Lookup Query',
		description: 'How do we select data from one table based on a condition in another table?',
	},
	'join-tables': {
		name: 'Join Tables',
		description: 'How can we use SQL to join tables together through a foreign key?',
	},
	'write-multi-table-query': {
		name: 'Write Multi-Table Query',
		description: 'How can we set up queries combining data from multiple tables in convoluted ways?',
	},
	'write-multi-step-query': {
		name: 'Write Multi-Step Query',
		description: 'How do we write complex queries through a series of clear intermediate steps?',
	},

	// Relational algebra.
	'relational-algebra': {
		name: 'Relational Algebra',
		description: 'What is the relational algebra query language, and what should I know about it?',
	},
	'ra-choose-columns': {
		name: 'Choose Columns',
		description: 'How do we use relational algebra to select attributes from a relation?',
	},
	'ra-filter-rows': {
		name: 'Filter Rows',
		description: 'How do we use relational algebra to filter the tuples within a relation based on some condition?',
	},
	'ra-write-single-relation-query': {
		name: 'Write Single-Relation Query',
		description: 'How do we write basic relational algebra queries for a single relation?',
	},
	'ra-combine-conditions-across-relations': {
		name: 'Combine Conditions Across Relations',
		description: 'How do we write a query that combines conditions defined across different relations?',
	},
	'ra-join-relations': {
		name: 'Join Relations',
		description: 'How do use relational algebra to join two relations together?',
	},
	'ra-write-join-query': {
		name: 'Write Join Query',
		description: 'How do we write complete queries involving multiple joins or repeated use of the same relation?',
	},
	'ra-write-multi-step-query': {
		name: 'Write Multi-Step Query',
		description: 'How do we write complex relational algebra queries involving multiple steps?',
	},
	'ra-write-universal-condition-query': {
		name: 'Write Universal-Condition Query',
		description: 'How do we write relational algebra queries involving "for every" quantifiers and similar?',
	},

	// Datalog.
	'datalog': {
		name: 'Datalog',
		description: 'What is the Datalog query language, and what does a basic Datalog program look like?',
	},
	'dl-define-projection-rule': {
		name: 'Define Projection Rule',
		description: 'How do we use Datalog to apply projection and limit the arguments of a predicate?',
	},
	'dl-define-filtering-rule': {
		name: 'Define Filtering Rule',
		description: 'How do we use Datalog to filter the tuples within a predicate based on some condition?',
	},
	'dl-define-derived-predicate': {
		name: 'Define Derived Predicate',
		description: 'How can we set up a new view-like predicate from a single existing predicate?',
	},
	'dl-define-join-rule': {
		name: 'Define Join Rule',
		description: 'How can we join multiple predicates together to set up new multi-predicate views?',
	},
	'dl-literal-types-and-rule-safety': {
		name: 'Literal Types and Rule Safety',
		description: 'How does negation and/or arithmetic potentially lead to infinite outputs in Datalog?',
	},
	'dl-check-rule-safety': {
		name: 'Check Rule Safety',
		description: 'How can we check whether a Datalog rule is safe or not?',
	},
	'dl-express-non-existence': {
		name: 'Express Non-Existence',
		description: 'How do we use Datalog to express that a matching fact does not exist?',
	},
	'dl-write-multi-step-program': {
		name: 'Write Multi-Step Program',
		description: 'How do we solve multi-step data requests by assembling a Datalog program?',
	},
	'dl-define-recursive-predicate': {
		name: 'Define Recursive Predicate',
		description: 'How can we define a recursive predicate in Datalog?',
	},
	'dl-predicate-dependency-graph': {
		name: 'Predicate Dependency Graph',
		description: 'How can the structure of a Datalog program be visualized through the dependencies between predicates?',
	},
	'dl-draw-predicate-dependency-graph': {
		name: 'Draw Predicate Dependency Graph',
		description: 'How do we draw a Predicate Dependency Graph?',
	},
	'dl-program-classes': {
		name: 'Datalog Program Classes',
		description: 'How do restrictions on negation distinguish positive, semi-positive and stratified Datalog programs?',
	},
	'dl-classify-program': {
		name: 'Classify Datalog Program',
		description: 'How do we determine whether a Datalog program is positive, semi-positive and/or stratified?',
	},
	'dl-write-recursive-program': {
		name: 'Write Recursive Program',
		description: 'How can we safely combine recursion and negation in Datalog programs to guarantee well-defined behavior?',
	},
} satisfies Record<ModuleId, ModulePresentation>

export function getModulePresentation(moduleId: string): ModulePresentation | undefined {
	return isModuleId(moduleId) ? modulePresentation[moduleId] : undefined
}
