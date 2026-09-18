import type { ExerciseParameters, ExerciseReport } from '@step-wise/exercise-definition'

import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'
import { emptySimpleExerciseState, isSimpleExerciseGivenUp, isSimpleExerciseSolved } from './logic'
import { SimpleExerciseComponent } from './SimpleExerciseComponent'
import type { SimpleExerciseSpecification } from './specifications'
import type { SimpleExerciseCheckResult, SimpleExerciseFeedbackType } from './types'

// The report a SimpleExercise action stores, used to rebuild feedback.
export interface SimpleExerciseReport {
	message: string
	type: SimpleExerciseFeedbackType
	result?: unknown
}

// Pairs the existing SimpleExercise logic with its renderer using the upstream solo contract.
export function buildSimpleExercise<
	Parameters extends Record<string, unknown>,
	Input,
	CheckResult = SimpleExerciseCheckResult,
>(spec: SimpleExerciseSpecification<Parameters, Input, CheckResult>): ExerciseRegistration {
	const processSoloAction: ExerciseRegistration['definition']['processSoloAction'] = async ({ parameters, state: previousState, action, context: moduleContext }) => {
		if (isSimpleExerciseSolved(previousState) || isSimpleExerciseGivenUp(previousState)) {
			return { state: { ...previousState, done: true } }
		}
		if (action.type === 'give-up') {
			return { state: { givenUp: true, done: true } }
		}

		const input = action.input as Input
		const params = parameters as Parameters
		try {
			const validation = await spec.validateInput?.({ parameters: params, input, moduleContext })
			if (validation && !validation.valid) {
				const report: SimpleExerciseReport = {
					message: validation.feedback ?? 'Please double-check your input before submitting.',
					type: validation.feedbackType ?? 'warning',
				}
				return { state: emptySimpleExerciseState, report: report as unknown as ExerciseReport }
			}

			const result = await spec.checkInput({ parameters: params, input, moduleContext })
			const correct = spec.isCorrect
				? spec.isCorrect(result)
				: Boolean((result as SimpleExerciseCheckResult).correct)
			const checkResult = result as SimpleExerciseCheckResult
			const report: SimpleExerciseReport = {
				message: spec.getFeedback?.(result) ??
					checkResult.feedback ??
					(correct ? 'Correct!' : 'Not quite right. Try again.'),
				type: checkResult.feedbackType ?? (correct ? 'success' : 'error'),
				result,
			}
			return { state: correct ? { solved: true, done: true } : emptySimpleExerciseState, report: report as unknown as ExerciseReport }
		} catch (error) {
			const report: SimpleExerciseReport = {
				message: error instanceof Error ? error.message : 'Unable to check your answer. Please try again.',
				type: 'error',
			}
			return { state: emptySimpleExerciseState, report: report as unknown as ExerciseReport }
		}
	}

	return {
		exerciseId: spec.exerciseId,
		definition: {
			metadata: { version: spec.version },
			generateParameters: async ({ context }) => await spec.generateParameters(context) as ExerciseParameters,
			getInitialState: () => ({}),
			processSoloAction,
		},
		isSolved: isSimpleExerciseSolved,
		getSolutionInput: spec.getSolutionInput as ExerciseRegistration['getSolutionInput'],
		Component: () => <SimpleExerciseComponent spec={spec} />,
	}
}
