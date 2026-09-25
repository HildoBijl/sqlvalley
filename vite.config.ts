import { type Plugin, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
	plugins: [react(), exerciseHotReload()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 3000,
		open: true,
	},
	build: {
		sourcemap: true,
		rollupOptions: {
			maxParallelFileOps: 20,
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom', 'react-router-dom'],
					mui: ['@mui/material'],
					sql: ['sql.js'],
					editor: ['@codemirror/lang-sql', '@uiw/react-codemirror'],
					zustand: ['zustand'],
				},
			},
		},
	},
});

// Exercise specs are data exports, so explicitly publish updated builders to the loader.
function exerciseHotReload(): Plugin {
	return {
		name: 'exercise-hot-reload',
		apply: 'serve',
		transform(code, id) {
			const match = id.replace(/\\/g, '/').match(/\/src\/modules\/([^/]+)\/exercises\/index\.ts$/)
			if (!match) return
			return {
				code: `${code}
import { updateExerciseModule as __updateExerciseModule } from '/src/curriculum/utils/exerciseHotReload.ts'
if (import.meta.hot) {
	import.meta.hot.accept(module => {
		if (module) __updateExerciseModule(${JSON.stringify(match[1])}, module)
	})
}
`,
				map: null,
			}
		},
	}
}
