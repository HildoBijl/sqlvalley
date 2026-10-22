import { readFile, readdir } from 'node:fs/promises'

const packageDirectories = (await readdir('packages', { withFileTypes: true }))
	.filter(entry => entry.isDirectory())
	.map(entry => entry.name)
	.sort()

const publicPackageNames = (await Promise.all(packageDirectories.map(async directory => {
	const manifest = JSON.parse(await readFile(`packages/${directory}/package.json`, 'utf8'))
	if (manifest.private === true) return undefined
	if (manifest.type !== 'module') throw new Error(`${manifest.name} is not declared as an ES module.`)
	if (!manifest.exports?.['.']?.import) throw new Error(`${manifest.name} has no public import entry point.`)
	return manifest.name
}))).filter(Boolean)

if (publicPackageNames.length === 0) throw new Error('No public package entry points were found.')
await Promise.all(publicPackageNames.map(packageName => import(packageName)))

console.log(`Imported ${publicPackageNames.length} public package entry point${publicPackageNames.length === 1 ? '' : 's'} using native Node ESM.`)
