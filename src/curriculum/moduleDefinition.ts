import { type ConceptDefinition, type ModuleTreeDefinition, type SkillDefinition, createModuleTree } from '@step-wise/module-tree-definition'

const concept = (...prerequisites: string[]): ConceptDefinition => ({ type: 'concept', prerequisites })
const skill = (...prerequisites: string[]): SkillDefinition => ({ type: 'skill', prerequisites })

const moduleDefinition = {
	// Database concepts.
	'database': concept(),
	'database-table': concept('database'),
	'query-language': concept('database'),
	'data-types': concept('database-table'),
	'database-keys': concept('database-table'),
	'projection-and-filtering': concept('database-table'),
	'foreign-key': concept('database-keys'),
	'join-and-decomposition': concept('projection-and-filtering', 'foreign-key'),
	'database-view': concept('projection-and-filtering'),
	'aggregation': concept('data-types', 'projection-and-filtering'),
	'recursive-query': concept('query-language', 'projection-and-filtering', 'foreign-key'),

	// SQL.
	'sql': concept('query-language'),
	'choose-columns': skill('sql', 'projection-and-filtering'),
	'filter-rows': skill('sql', 'data-types', 'projection-and-filtering'),
	'write-single-criterion-query': skill('choose-columns', 'filter-rows'),
	'filter-rows-on-multiple-criteria': skill('filter-rows'),
	'process-columns': skill('data-types', 'choose-columns'),
	'sort-rows': skill('sql', 'data-types'),
	'write-multi-criterion-query': skill('sort-rows', 'process-columns', 'filter-rows-on-multiple-criteria'),
	'aggregate-columns': skill('aggregation', 'choose-columns'),
	'use-filtered-aggregation': skill('aggregate-columns', 'filter-rows-on-multiple-criteria', 'process-columns'),
	'use-dynamic-aggregation': skill('aggregate-columns'),
	'write-look-up-query': skill('foreign-key', 'write-single-criterion-query'),
	'join-tables': skill('join-and-decomposition', 'choose-columns', 'filter-rows-on-multiple-criteria'),
	'write-multi-table-query': skill('write-look-up-query', 'join-tables'),
	'write-multi-layered-query': skill('write-multi-criterion-query', 'write-multi-table-query', 'use-filtered-aggregation'),
	'pivot-table': concept('database-table'),
	'create-pivot-table': skill('pivot-table', 'write-single-criterion-query', 'aggregate-columns'),

	// Relational algebra.
	'relational-algebra': concept('query-language'),
	'ra-choose-columns': skill('relational-algebra', 'projection-and-filtering'),
	'ra-filter-rows': skill('relational-algebra', 'projection-and-filtering'),
	'ra-set-up-single-relation-query': skill('ra-choose-columns', 'ra-filter-rows'),
	'ra-set-up-multi-condition-query': skill('ra-set-up-single-relation-query', 'foreign-key'),
	'ra-join-relations': skill('join-and-decomposition', 'ra-filter-rows'),
	'ra-set-up-multi-relation-query': skill('ra-set-up-single-relation-query', 'ra-join-relations'),
	'ra-set-up-multi-step-query': skill('ra-set-up-multi-condition-query', 'ra-set-up-multi-relation-query'),
	'ra-set-up-universal-condition-query': skill('ra-set-up-multi-relation-query', 'ra-set-up-multi-condition-query', 'ra-set-up-multi-step-query'),

	// Datalog.
	'datalog': concept('query-language', 'database-view'),
	'dl-define-projection-rule': skill('datalog'),
	'dl-define-filtering-rule': skill('datalog'),
	'dl-define-derived-predicate': skill('dl-define-projection-rule', 'dl-define-filtering-rule'),
	'dl-define-join-rule': skill('join-and-decomposition', 'dl-define-projection-rule', 'dl-define-filtering-rule'),
	'dl-literal-types-and-rule-safety': concept('datalog'),
	'dl-check-rule-safety': skill('dl-literal-types-and-rule-safety'),
	'dl-define-negation-rule': skill('database-keys', 'dl-check-rule-safety', 'dl-define-derived-predicate'),
	'dl-write-multi-predicate-program': skill('dl-define-derived-predicate', 'dl-define-join-rule', 'dl-define-negation-rule'),
	'dl-define-recursive-predicate': skill('recursive-query', 'dl-define-derived-predicate'),
	'dl-predicate-dependency-graph': concept('datalog', 'recursive-query'),
	'dl-draw-predicate-dependency-graph': skill('dl-predicate-dependency-graph'),
	'dl-semi-positive-and-stratified-datalog': concept('dl-literal-types-and-rule-safety', 'dl-predicate-dependency-graph'),
	'dl-check-program-stratification': skill('dl-draw-predicate-dependency-graph', 'dl-semi-positive-and-stratified-datalog'),
	'dl-write-recursive-program': skill('dl-write-multi-predicate-program', 'dl-define-recursive-predicate', 'dl-check-program-stratification'),
} satisfies ModuleTreeDefinition

export type ModuleId = keyof typeof moduleDefinition

export const moduleTree = createModuleTree(moduleDefinition)
