import { type DataTableProps, DataTable } from './DataTable'

export type DrawingTableProps = Omit<DataTableProps, 'showPagination' | 'maxRows' | 'controls'>

export function DrawingTable({ compact = true, ...props }: DrawingTableProps) {
	return <DataTable {...props} compact={compact} showPagination={false} maxRows={Infinity} controls={false} />
}
