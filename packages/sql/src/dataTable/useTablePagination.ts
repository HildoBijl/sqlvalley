import { useState } from 'react'

interface TablePaginationOptions {
	values?: readonly (readonly unknown[])[]
	maxRows: number
	showPagination: boolean
}

export function useTablePagination({ values = [], maxRows, showPagination }: TablePaginationOptions) {
	const [selectedPage, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	const displayValues = values.slice(0, maxRows)

	// When a new result contains fewer rows, bound the page.
	const lastPage = Math.max(0, Math.ceil(displayValues.length / rowsPerPage) - 1)
	const page = Math.min(selectedPage, lastPage)
	if (page !== selectedPage) setPage(page)

	// Determine which rows to show.
	const paginatedValues = showPagination ? displayValues.slice(page * rowsPerPage, (page + 1) * rowsPerPage) : displayValues

	// Upon changing the rows per page, reset the page counter.
	const changeRowsPerPage = (value: number) => {
		setRowsPerPage(value)
		setPage(0)
	}

	// Bundle all data together as output.
	return { page, rowsPerPage, displayValues, paginatedValues, changePage: setPage, changeRowsPerPage }
}
