export function normalizeSkillTreeIds(raw: unknown): string[] {
	const result: string[] = []
	const seen = new Set<string>()
	if (Array.isArray(raw)) {
		for (const value of raw) {
			if (typeof value !== 'string') continue
			const id = value.trim()
			if (!id || seen.has(id)) continue
			seen.add(id)
			result.push(id)
		}
	}
	return result
}
