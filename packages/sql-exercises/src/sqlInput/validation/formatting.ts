// Turn a raw SQL Error message into a neatly format string used for validation feedback.
export function formatSqlErrorMessage(rawMessage: string): string {
	const message = rawMessage.replace(/\s+/g, ' ').trim()
	if (!message) return 'SQL error: Unknown error.'
	for (const { pattern, format } of sqlErrorPatterns) {
		const match = message.match(pattern)
		if (match) return formatSentence(format(match))
	}
	if (/syntax error/i.test(message)) return 'Syntax error.'
	return formatSentence(`SQL error: ${message}`)
}

// Fix capitalization in a sentence for proper display.
function formatSentence(value: string): string {
	const text = value.trim()
	if (!text) return text
	const sentence = text[0] === text[0].toLowerCase() ? text[0].toUpperCase() + text.slice(1) : text
	return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`
}

// Define the patterns in errors to check for.
const sqlErrorPatterns: Array<{
	pattern: RegExp
	format: (match: RegExpMatchArray) => string
}> = [
		{
			pattern: /no such column:\s*("?)([^"\s]+)\1/i,
			format: match => `Did not recognize column "${match[2]}". Check spelling or table schema.`,
		},
		{
			pattern: /no such table:\s*("?)([^"\s]+)\1/i,
			format: match => `Did not recognize table "${match[2]}".`,
		},
		{
			pattern: /no such function:\s*("?)([^"\s]+)\1/i,
			format: match => `Did not recognize function "${match[2]}".`,
		},
		{
			pattern: /ambiguous column name:\s*("?)([^"\s]+)\1/i,
			format: match => `Column name "${match[2]}" is ambiguous (appears in more than one table).`,
		},
		{
			pattern: /table\s+("?)([^"\s]+)\1\s+has no column named\s+("?)([^"\s]+)\3/i,
			format: match => `Table "${match[2]}" has no column named "${match[4]}".`,
		},
		{
			pattern: /misuse of aggregate(?: function)?:\s*([A-Za-z0-9_]+)\s*\(?/i,
			format: match => `Misuse of aggregate function "${match[1]}".`,
		},
		{
			pattern: /near\s+"([^"]+)":\s*syntax error/i,
			format: match => `Syntax error near "${match[1]}".`,
		},
		{
			pattern: /incomplete input/i,
			format: () => 'Syntax error: incomplete input.'
		},
	]
