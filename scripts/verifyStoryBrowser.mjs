import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
await context.addInitScript(() => {
	if (!localStorage.getItem('sqlvalley-settings')) localStorage.setItem('sqlvalley-settings', JSON.stringify({ version: 2, state: { adminModeEnabled: true, storyModeEnabled: true, themeMode: 'light', practiceDatasetSize: 'full' } }))
})
const page = await context.newPage()
page.setDefaultTimeout(30000)
const errors = []
page.on('pageerror', error => errors.push(error.message))
const origin = process.env.SQLVALLEY_TEST_URL ?? 'http://127.0.0.1:3000'
async function current(moduleId) {
	return page.evaluate(async id => {
		const { useLearningStore } = await import('/src/store/learning/store.ts')
		return useLearningStore.getState().modules[id]?.exerciseHistory.at(-1)
	}, moduleId)
}
async function answer(moduleId) {
	await page.locator('.cm-content[contenteditable="true"]').waitFor()
	const instance = await current(moduleId)
	const query = await page.evaluate(async ({ moduleId, instance }) => {
		const key = instance.exerciseId.slice(`story-${moduleId}-`.length)
		const spec = (await import(`/src/modules/${moduleId}/exercises/${key}.tsx`)).default
		return spec.definition.getSolution({ parameters: instance.parameters }).query
	}, { moduleId, instance })
	await page.locator('.cm-content[contenteditable="true"]').fill(query)
	await page.waitForFunction(async ({ moduleId, query }) => {
		const { useLearningStore } = await import('/src/store/learning/store.ts')
		return useLearningStore.getState().modules[moduleId].exerciseHistory.at(-1).draftInput?.query === query
	}, { moduleId, query })
	await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
	await page.getByText('Updating query preview...', { exact: true }).waitFor({ state: 'hidden' })
	await page.getByRole('button', { name: 'Submit Answer', exact: true }).click()
	await page.waitForFunction(async moduleId => {
		const { useLearningStore } = await import('/src/store/learning/store.ts')
		return useLearningStore.getState().modules[moduleId].exerciseHistory.at(-1).history.at(-1)?.state.solved === true
	}, moduleId)
	console.log(`Solved ${instance.exerciseId}`)
	return (await current(moduleId)).exerciseId
}
try {
	await page.goto(`${origin}/module/choose-columns?tab=practice`)
	await page.locator('.cm-content[contenteditable="true"]').waitFor()
	assert.ok(await page.getByText('Placeholder dialogue — Purpose:', { exact: false }).count() >= 2)
	// A saved numeric variant and draft survive reload.
	const before = await current('choose-columns')
	assert.deepEqual(Object.keys(before.parameters), ['variant'])
	await page.locator('.cm-content[contenteditable="true"]').fill('SELECT 1 AS incomplete_answer')
	await page.reload()
	await page.locator('.cm-content[contenteditable="true"]').waitFor()
	assert.deepEqual((await current('choose-columns')).parameters, before.parameters)
	assert.ok((await page.locator('.cm-content[contenteditable="true"]').innerText()).includes('incomplete_answer'))
	await page.getByRole('button', { name: 'Submit Answer', exact: true }).click()
	await page.waitForFunction(async () => {
		const { useLearningStore } = await import('/src/store/learning/store.ts')
		return useLearningStore.getState().modules['choose-columns'].exerciseHistory.at(-1).history.length > 0
	})
	assert.notEqual((await current('choose-columns')).history.at(-1).state.solved, true)
	const seen = new Set()
	for (let index = 0; index < 3; index++) {
		seen.add(await answer('choose-columns'))
		if (index < 2) await page.getByRole('button', { name: 'Next Exercise', exact: true }).click()
	}
	assert.equal(seen.size, 3)
	await page.getByRole('dialog').waitFor()
	await page.keyboard.press('Escape')
	await page.getByText('Connect the three completed investigations.', { exact: false }).waitFor()
	await page.reload()
	await page.getByRole('button', { name: 'Next Exercise', exact: true }).waitFor()
	assert.equal((await current('choose-columns')).history.at(-1).state.solved, true)

	// Repeat practice, giving up and regeneration preserve earned family completion.
	const solvedInstance = await current('choose-columns')
	await page.getByRole('button', { name: 'Next Exercise', exact: true }).click()
	await page.locator('.cm-content[contenteditable="true"]').waitFor()
	assert.notEqual((await current('choose-columns')).startedAt, solvedInstance.startedAt)
	await page.getByRole('button', { name: 'Give Up', exact: true }).click()
	await page.getByRole('dialog').getByRole('button', { name: 'Give Up', exact: true }).click()
	await page.getByRole('button', { name: 'Next Exercise', exact: true }).waitFor()
	assert.equal((await current('choose-columns')).history.at(-1).state.givenUp, true)
	assert.equal(await page.getByText('Interpret the result and distinguish evidence from attribution.', { exact: false }).count(), 0)
	const beforeRegeneration = await current('choose-columns')
	await page.getByRole('button', { name: 'Regenerate', exact: true }).click()
	await page.locator('.cm-content[contenteditable="true"]').waitFor()
	const regenerated = await current('choose-columns')
	assert.equal(regenerated.exerciseId, beforeRegeneration.exerciseId)
	assert.notEqual(regenerated.startedAt, beforeRegeneration.startedAt)
	// An incompatible saved parameter shape is never rendered under a mismatched version.
	await page.evaluate(async () => {
		const { useLearningStore } = await import('/src/store/learning/store.ts')
		useLearningStore.setState(state => {
			const module = state.modules['choose-columns']
			const history = [...module.exerciseHistory]
			history[history.length - 1] = { ...history.at(-1), version: 2, parameters: { legacyText: 'incompatible old content' } }
			return { modules: { ...state.modules, 'choose-columns': { ...module, exerciseHistory: history } } }
		})
	})
	await page.waitForFunction(async () => {
		const { useLearningStore } = await import('/src/store/learning/store.ts')
		const instance = useLearningStore.getState().modules['choose-columns'].exerciseHistory.at(-1)
		return instance.version === 1 && Number.isInteger(instance.parameters.variant)
	})
	assert.equal((await current('choose-columns')).exerciseId, regenerated.exerciseId)
	const solvedFamilyCount = await page.evaluate(async () => {
		const { useLearningStore } = await import('/src/store/learning/store.ts')
		const { getStorySolvedCount } = await import('/src/curriculum/exercises/storyProgress.ts')
		return getStorySolvedCount('choose-columns', useLearningStore.getState().modules['choose-columns'].exerciseHistory)
	})
	assert.equal(solvedFamilyCount, 3)

	// Every module loads, renders a valid generated instance, and grades its real input.
	const modules = await page.evaluate(async () => Object.keys((await import('/src/curriculum/exercises/storyModules.ts')).storyModules))
	for (const moduleId of modules.filter(id => id !== 'choose-columns' && id !== 'write-multi-step-query')) {
		await page.goto(`${origin}/module/${moduleId}?tab=practice`)
		await page.locator('.cm-content[contenteditable="true"]').waitFor()
		await answer(moduleId)
	}
	await page.goto(`${origin}/module/write-multi-step-query?tab=practice`)
	await page.locator('.cm-content[contenteditable="true"]').waitFor()
	const revealed = new Set()
	for (let index = 0; index < 3; index++) {
		revealed.add(await answer('write-multi-step-query'))
		if (index < 2) await page.getByRole('button', { name: 'Next Exercise', exact: true }).click()
	}
	assert.equal(revealed.size, 3)
	await page.getByRole('dialog').waitFor()
	await page.keyboard.press('Escape')
	await page.getByText('Epilogue: Wheatley was an operative for Glasshouse.', { exact: false }).waitFor()
	await page.goto(`${origin}/module/join-tables?tab=story`)
	await page.getByText('Successfully solve each of this module’s three exercise families', { exact: false }).waitFor()
	assert.equal(await page.getByText('Connect the three completed investigations.', { exact: false }).count(), 0)
	await page.goto(`${origin}/module/write-multi-step-query?tab=data`)
	await page.getByRole('button', { name: 'record_changes', exact: true }).click()
	await page.getByRole('columnheader', { name: 'actor_e_id', exact: true }).waitFor()
	await page.evaluate(async () => {
		const { useSettingsStore } = await import('/src/store/settings/store.ts')
		useSettingsStore.getState().setStoryModeEnabled(false)
	})
	await page.goto(`${origin}/module/choose-columns?tab=practice`)
	await page.locator('.cm-content[contenteditable="true"]').waitFor()
	assert.equal(await page.locator('[data-placeholder-dialogue]').count(), 0)
	await page.getByText('Case reference:', { exact: false }).waitFor()
	assert.deepEqual(errors, [])
	console.log('Browser verification passed: 13 modules, 17 successful submissions, failure/give-up, reload/draft restoration, regeneration, version replacement, distinct-family completion, story-off tasks and finale payoff.')
} catch (error) {
	console.error((await page.locator('body').innerText()).slice(-16000))
	console.error('Page errors', errors)
	await page.screenshot({ path: '/tmp/sqlvalley-browser-failure.png', fullPage: true })
	throw error
} finally { await browser.close() }
