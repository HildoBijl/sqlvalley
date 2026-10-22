import { execFileSync } from 'node:child_process'
import { access, readFile, readdir } from 'node:fs/promises'

const npmCli = process.env.npm_execpath
if (!npmCli) throw new Error('npm_execpath is unavailable; run this verification through npm.')

const publicationRoot = '.release'
const publicationDirectories = (await readdir(publicationRoot, { withFileTypes: true }))
	.filter(entry => entry.isDirectory())
	.map(entry => entry.name)
	.sort()
if (publicationDirectories.length === 0) throw new Error('No staged package publications were found.')

for (const directory of publicationDirectories) {
	const publicationDirectory = `${publicationRoot}/${directory}`
	const manifest = JSON.parse(await readFile(`${publicationDirectory}/package.json`, 'utf8'))
	if (manifest.private === true) throw new Error(`${manifest.name} is private and must not be staged for publication.`)
	if (hasDevelopmentCondition(manifest.exports)) throw new Error(`${manifest.name} still has a development export condition.`)

	const entryPoints = new Set([manifest.main, manifest.types, ...getExportTargets(manifest.exports)].filter(Boolean))
	for (const entryPoint of entryPoints) {
		if (!entryPoint.startsWith('./')) throw new Error(`${manifest.name} has non-relative entry point ${entryPoint}.`)
		if (entryPoint.includes('*')) throw new Error(`${manifest.name} has an entry-point pattern that cannot be verified: ${entryPoint}.`)
		if (entryPoint.startsWith('./src/')) throw new Error(`${manifest.name} exposes unpublished source entry point ${entryPoint}.`)
		try {
			await access(`${publicationDirectory}/${entryPoint.slice(2)}`)
		} catch {
			throw new Error(`${manifest.name} refers to missing entry point ${entryPoint}.`)
		}
	}

	const output = execFileSync(process.execPath, [npmCli, 'pack', '--dry-run', '--json'], {
		cwd: publicationDirectory,
		encoding: 'utf8',
	})
	const [artifact] = JSON.parse(output)
	if (!artifact) throw new Error(`npm did not describe an artifact for ${manifest.name}.`)
	if (artifact.name !== manifest.name || artifact.version !== manifest.version) {
		throw new Error(`npm described ${artifact.name}@${artifact.version} instead of ${manifest.name}@${manifest.version}.`)
	}

	const paths = artifact.files.map(file => file.path)
	for (const requiredPath of ['package.json', 'README.md', 'LICENSE', 'dist/index.js', 'dist/index.d.ts']) {
		if (!paths.includes(requiredPath)) throw new Error(`${manifest.name} is missing ${requiredPath}.`)
	}
	const rootFiles = new Set(['package.json', 'README.md', 'LICENSE'])
	const unexpectedPaths = paths.filter(path => !rootFiles.has(path) && !path.startsWith('dist/'))
	if (unexpectedPaths.length > 0) {
		throw new Error(`${manifest.name} contains unexpected files: ${unexpectedPaths.join(', ')}.`)
	}
}

console.log(`Validated ${publicationDirectories.length} staged npm package artifact${publicationDirectories.length === 1 ? '' : 's'}.`)

function hasDevelopmentCondition(value) {
	if (Array.isArray(value)) return value.some(hasDevelopmentCondition)
	if (value === null || typeof value !== 'object') return false
	return Object.entries(value).some(([key, child]) => key === 'development' || hasDevelopmentCondition(child))
}

function getExportTargets(value) {
	if (typeof value === 'string') return [value]
	if (Array.isArray(value)) return value.flatMap(getExportTargets)
	if (value === null || typeof value !== 'object') return []
	return Object.values(value).flatMap(getExportTargets)
}
