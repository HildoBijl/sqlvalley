import { useCallback, useState } from 'react'

import { useIsMountedRef } from '@step-wise/react-utils'
import { ensureSetup } from '@step-wise/skill-setup'
import { type ExerciseAction, getCurrentState } from '@step-wise/exercise-definition'
import type { ExerciseInstance } from '@sqlvalley/exercise-instances'

import type { ExerciseRegistration } from '../../exerciseSessionContext'
import type { ExerciseSessionOptions, ExerciseSessionDependencies } from './types'

interface SubmissionError {
	message: string
	instance: ExerciseInstance
}

interface SubmissionOptions extends Pick<ExerciseSessionOptions, 'skillId' | 'storage' | 'currentExerciseInstance'>, ExerciseSessionDependencies {
	registration: ExerciseRegistration | undefined
}

export function useExerciseSubmission({ skillId, storage, currentExerciseInstance, registration, context, contextReady, activeOperation }: SubmissionOptions) {
	const mounted = useIsMountedRef()

	// Handler: Set the draft input for the exercise in the data store.
	const setDraftInput = useCallback((draftInput: ExerciseInstance['draftInput']) => {
		if (storage.getCurrentInstance(skillId)) storage.setDraftInput(skillId, draftInput)
	}, [skillId, storage])

	// Handler: Submit an action to the current exercise.
	const [submitting, setSubmitting] = useState(false)
	const [error, setSubmissionError] = useState<SubmissionError>()
	const submitAction = useCallback(async (action: ExerciseAction) => {
		// Ensure that we only do stuff when everything is ready, there's no ongoing operation, and the exercise is the one we expect.
		const instance = storage.getCurrentInstance(skillId)
		if (!contextReady || !registration || !instance || activeOperation.current !== undefined) return
		if (instance.exerciseId !== registration.exerciseId || instance.version !== (registration.definition.metadata.version ?? 1) || instance.startedAt !== currentExerciseInstance?.startedAt || instance.parameters !== currentExerciseInstance?.parameters) return
		activeOperation.current = 'submission'
		setSubmitting(true)
		setSubmissionError(undefined)

		// Start processing the action.
		try {
			if (typeof registration.definition.processSoloAction !== 'function') throw new Error(`Exercise "${registration.exerciseId}" does not support solo actions.`)

			// Determine the outcome of the action.
			const solvedSkillIds: string[] = []
			const previousState = getCurrentState(instance)
			const { state, report } = await registration.definition.processSoloAction({
				parameters: instance.parameters,
				state: previousState,
				action,
				context,
				updateSkills: (setupLike, correct) => {
					const setup = ensureSetup(setupLike)
					if (correct && setup.type === 'Skill') solvedSkillIds.push(...setup.getSkillList())
				},
			})

			// Run a final check: is the exercise still mounted? If so, store the outcome of the action.
			const latestInstance = storage.getCurrentInstance(skillId)
			if (!mounted.current || latestInstance?.parameters !== instance.parameters || latestInstance.history.length !== instance.history.length) return
			storage.submitAction(skillId, action, state, report, solvedSkillIds)

		} catch (cause) {
			// On an error, register it.
			if (mounted.current) setSubmissionError({ instance, message: cause instanceof Error ? cause.message : 'Unable to submit your answer.' })
		} finally {
			activeOperation.current = undefined
			if (mounted.current) setSubmitting(false)
		}
	}, [registration, currentExerciseInstance, context, contextReady, mounted, activeOperation, skillId, storage])

	// Handler: remove a registered error to display the exercise once more.
	const dismissSubmissionError = useCallback(() => setSubmissionError(undefined), [])

	// All done. Gather and return the session flags/handlers.
	const submissionError = error?.instance.parameters === currentExerciseInstance?.parameters && error?.instance.startedAt === currentExerciseInstance?.startedAt ? error : undefined
	return { submitting, submissionError, submitAction, setDraftInput, dismissSubmissionError }
}
