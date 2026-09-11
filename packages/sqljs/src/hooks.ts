import { useContext } from 'react'
import { SQLJSContext } from './context'

export function useSQLJSContext() {
	return useContext(SQLJSContext)
}

export function useSQLJS() {
	return useSQLJSContext().SQLJS
}

export function useSQLJSLoading() {
	return useSQLJSContext().isLoading
}

export function useSQLJSReady() {
	return useSQLJSContext().isReady
}

export function useSQLJSError() {
	return useSQLJSContext().error
}
