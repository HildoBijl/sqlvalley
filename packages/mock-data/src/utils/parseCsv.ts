export interface ParsedCsv {
	headers: string[]
	records: Record<string, string>[]
}

// Parse a raw CSV string into headers and records. Each record maps column headers to string values.
export function parseCsv(raw: string): ParsedCsv {
	const source = raw.replace(/^\uFEFF/, '')
	const rows: string[][] = []
	let currentCell = ''
	let currentRow: string[] = []
	let inQuotes = false
	let quoteClosed = false

	// Walk through the given CSV string character by character, building up rows and cells.
	for (let i = 0; i < source.length; i += 1) {
		const char = source[i]
		const next = source[i + 1]

		// Handle quoted fields, including escaped quotes.
		if (inQuotes) {
			// Handle escaped quotes.
			if (char === '"' && next === '"') {
				currentCell += '"'
				i += 1
				continue
			}

			// Handle closing quotes.
			if (char === '"') {
				inQuotes = false
				quoteClosed = true
				continue
			}

			// Handle regular characters inside quotes.
			currentCell += char
			continue
		}

		// Handle opening quotes.
		if (char === '"') {
			if (currentCell || quoteClosed) throw new SyntaxError(`Unexpected quote at character ${i + 1}.`)
			inQuotes = true
			continue
		}

		// Throw on characters after closing quotes.
		if (quoteClosed && char !== ',' && char !== '\n' && char !== '\r') throw new SyntaxError(`Unexpected character after closing quote at character ${i + 1}.`)

		// Handle cell delimiters.
		if (char === ',' && !inQuotes) {
			currentRow.push(currentCell)
			currentCell = ''
			quoteClosed = false
			continue
		}

		// Handle row delimiters.
		if ((char === '\n' || char === '\r') && !inQuotes) {
			if (char === '\r' && next === '\n') i += 1
			currentRow.push(currentCell)
			rows.push(currentRow)
			currentRow = []
			currentCell = ''
			quoteClosed = false
			continue
		}

		// Handle regular characters.
		currentCell += char
	}

	// Finalize the last entry.
	if (inQuotes) throw new SyntaxError('CSV ends inside a quoted field.')
	if (currentCell || currentRow.length > 0 || quoteClosed) {
		currentRow.push(currentCell)
		rows.push(currentRow)
	}

	// Extract the header.
	if (rows.length === 0) throw new TypeError('CSV contains no rows.')
	const headers = rows[0].map(header => header.trim())
	if (headers.some(header => !header)) throw new SyntaxError('CSV contains an empty header.')
	if (new Set(headers).size !== headers.length) throw new SyntaxError('CSV contains duplicate headers.')

	// Extract rows and map them to objects.
	const records = rows.slice(1).map((cells, index) => {
			if (cells.length !== headers.length) throw new SyntaxError(`CSV row ${index + 2} has ${cells.length} cells expected ${headers.length}.`)
			const entry: Record<string, string> = {}
			headers.forEach((header, index) => { entry[header] = cells[index].trim() })
			return entry
		})
	return { headers, records }
}

// Convert a string value to a boolean, or null if invalid/empty.
export function booleanOrNull(value: string | undefined): boolean | null {
	const normalized = (value ?? '').trim().toLowerCase()
	if (!normalized) return null
	if (normalized === 'true') return true
	if (normalized === 'false') return false
	throw new TypeError(`Expected "true" or "false", received "${value}".`)
}

// Convert a string value to a number, or null if invalid/empty.
export function numberOrNull(value: string | undefined): number | null {
	const trimmed = (value ?? '').trim()
	if (!trimmed) return null
	const parsed = Number(trimmed)
	if (!Number.isFinite(parsed)) throw new TypeError(`Expected a valid finite number, received "${value}".`)
	return parsed
}

// Trim a string value, returning null if empty.
export function stringOrNull(value: string | undefined): string | null {
	const trimmed = (value ?? '').trim()
	return trimmed.length === 0 ? null : trimmed
}
