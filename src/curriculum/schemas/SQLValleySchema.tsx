import { Fragment } from 'react'

import type { TableKey } from '@sqlvalley/mock-data'

import { List } from '@/ui'
import { RelationName, PrimaryKey } from '@/learning'

export function SQLValleySchema({ tables = [], singular = false }: { tables: TableKey[], singular?: boolean }) {
	const entries = {
		departments: <><RelationName>department{singular ? '' : 's'}</RelationName> (<PrimaryKey>d_id</PrimaryKey>, d_name, manager_id, budget, nr_employees)</>,
		employees: <><RelationName>employee{singular ? '' : 's'}</RelationName> (<PrimaryKey>e_id</PrimaryKey>, first_name, last_name, phone, email, address, city, hire_date, current_salary)</>,
		contracts: <><RelationName>contract{singular ? '' : 's'}</RelationName> (<PrimaryKey>e_id</PrimaryKey>, position, salary, start_date, end_date, perf_score, status)</>,
		allocations: <><RelationName>allocation{singular ? '' : 's'}</RelationName> (<PrimaryKey>e_id</PrimaryKey>, <PrimaryKey>d_id</PrimaryKey>)</>,
		accounts: <><RelationName>account{singular ? '' : 's'}</RelationName> (<PrimaryKey>username</PrimaryKey>, phone, email, verified, first_name, last_name, address, city, created_at, last_login_at)</>,
		products: <><RelationName>product{singular ? '' : 's'}</RelationName> (<PrimaryKey>p_id</PrimaryKey>, name, category, owned_by, est_value, status)</>,
		transactions: <><RelationName>transaction{singular ? '' : 's'}</RelationName> (<PrimaryKey>t_id</PrimaryKey>, vendor, buyer, prod_id, date_time, price, validated_by, status)</>,
		expenses: <><RelationName>expense{singular ? '' : 's'}</RelationName> (<PrimaryKey>exp_id</PrimaryKey>, amount, d_id, description, date, requested_by, approved_by)</>,
		quarterlyPerformance: <><RelationName>quarterly_performance</RelationName> (<PrimaryKey>quarter</PrimaryKey>, <PrimaryKey>fiscal_year</PrimaryKey>, revenue, operating_expenses, total_transactions, growth_rate, updated_at)</>,
	}

	return <List items={tables.map(table => <Fragment key={table}>{entries[table]}</Fragment>)} />
}
