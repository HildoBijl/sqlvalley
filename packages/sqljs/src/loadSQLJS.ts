import initSqlJs, { type SqlJsStatic } from 'sql.js'

declare const SQLJS_WASM_BASE64: string

let sqlJsPromise: Promise<SqlJsStatic> | undefined

// Load SQL.js once and share the initialization between all consumers.
export function loadSQLJS(): Promise<SqlJsStatic> {
	if (!sqlJsPromise) {
		sqlJsPromise = initSqlJs({ wasmBinary: decodeWasmBinary(SQLJS_WASM_BASE64) }).catch(error => {
			sqlJsPromise = undefined
			throw error
		})
	}
	return sqlJsPromise
}

function decodeWasmBinary(encodedBinary: string): ArrayBuffer {
	const binary = atob(encodedBinary)
	const bytes = new Uint8Array(binary.length)
	for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
	return bytes.buffer
}
