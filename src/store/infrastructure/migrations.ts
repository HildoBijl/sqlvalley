export function runMigrations<TState>(persistedState: TState, fromVersion: number, targetVersion: number, migrations: Array<(state: TState) => TState>): TState {
	// Check target version.
	if (!Number.isInteger(targetVersion) || targetVersion < 0) throw new Error(`Invalid target store version "${targetVersion}".`)
	if (migrations.length !== targetVersion) throw new Error(`Store version ${targetVersion} requires ${targetVersion} migrations, but received ${migrations.length}.`)

	// Check source version.
	const sourceVersion = Number.isInteger(fromVersion) && fromVersion >= 0 ? fromVersion : 0
	if (sourceVersion >= targetVersion) return persistedState

	// Run migrations on the state.
	let state = persistedState
	for (const migrate of migrations.slice(sourceVersion, targetVersion)) state = migrate(state)
	return state
}
