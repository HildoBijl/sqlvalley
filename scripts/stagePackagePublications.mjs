import { access, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'

const packageRoot = 'packages'
const publicationRoot = '.release'
const dependencyFields = ['dependencies', 'optionalDependencies', 'peerDependencies']

const packageDirectories = (await readdir(packageRoot, { withFileTypes: true }))
	.filter(entry => entry.isDirectory())
	.map(entry => entry.name)
	.sort()
const packages = await Promise.all(packageDirectories.map(async directory => ({
	directory,
	manifest: JSON.parse(await readFile(`${packageRoot}/${directory}/package.json`, 'utf8')),
})))
const packagesByName = new Map(packages.map(packageData => [packageData.manifest.name, packageData]))
const publicPackages = packages.filter(packageData => packageData.manifest.private !== true)

if (publicPackages.length === 0) throw new Error('No public packages were found.')

for (const { directory, manifest } of publicPackages) {
	for (const field of dependencyFields) {
		for (const dependencyName of Object.keys(manifest[field] ?? {})) {
			if (!dependencyName.startsWith('@sqlvalley/')) continue
			const dependency = packagesByName.get(dependencyName)
			if (!dependency) throw new Error(`${manifest.name} refers to unknown internal dependency ${dependencyName}.`)
			if (dependency.manifest.private === true) {
				throw new Error(`${manifest.name} cannot be published because its ${field} include private package ${dependencyName}.`)
			}
		}
	}

	await Promise.all([
		access(`${packageRoot}/${directory}/dist`),
		access(`${packageRoot}/${directory}/README.md`),
	])
}

await rm(publicationRoot, { recursive: true, force: true })
await mkdir(publicationRoot)

for (const { directory, manifest } of publicPackages) {
	const sourceDirectory = `${packageRoot}/${directory}`
	const publicationDirectory = `${publicationRoot}/${directory}`
	const publicationManifest = {
		...manifest,
		exports: removeDevelopmentConditions(manifest.exports),
		files: ['dist', 'README.md', 'LICENSE'],
	}

	await mkdir(publicationDirectory)
	await Promise.all([
		cp(`${sourceDirectory}/dist`, `${publicationDirectory}/dist`, { recursive: true }),
		cp(`${sourceDirectory}/README.md`, `${publicationDirectory}/README.md`),
		cp('LICENSE', `${publicationDirectory}/LICENSE`),
		writeFile(`${publicationDirectory}/package.json`, `${JSON.stringify(publicationManifest, null, '\t')}\n`),
	])
}

console.log(`Staged ${publicPackages.length} public package${publicPackages.length === 1 ? '' : 's'} in ${publicationRoot}.`)

function removeDevelopmentConditions(value) {
	if (Array.isArray(value)) return value.map(removeDevelopmentConditions)
	if (value === null || typeof value !== 'object') return value
	return Object.fromEntries(Object.entries(value)
		.filter(([key]) => key !== 'development')
		.map(([key, child]) => [key, removeDevelopmentConditions(child)]))
}
