import { mkdtemp, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { build } from 'esbuild'

const directory = await mkdtemp(path.resolve('node_modules/.sqlvalley-tests-'))
try {
	const files = (await readdir('tests')).filter(file => file.endsWith('.test.ts'))
	await build({
		entryPoints: files.map(file => `tests/${file}`),
		outdir: directory,
		outExtension: { '.js': '.mjs' },
		bundle: true,
		platform: 'node',
		format: 'esm',
		packages: 'external',
		alias: {
			'@sqlvalley/sql': path.resolve('packages/sql/src/databaseProvider/executeQuery.ts'),
			'@sqlvalley/sql-grading': path.resolve('packages/sql-grading/src/index.ts'),
		},
		loader: { '.csv': 'text' },
	})
	const child = spawn(process.execPath, ['--test', ...files.map(file => path.join(directory, file.replace(/\.ts$/, '.mjs')))], { stdio: 'inherit' })
	process.exitCode = await new Promise(resolve => child.on('exit', code => resolve(code ?? 1)))
} finally {
	await rm(directory, { recursive: true, force: true })
}
