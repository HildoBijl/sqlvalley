import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { Alert, Box } from '@mui/material';

import { useExercise } from '../Exercise';
import { SimpleExerciseControlsContext } from './controlsContext';
import { ExerciseControls } from './ExerciseControls';
import { GiveUpDialog } from './GiveUpDialog';
import { isSimpleExerciseGivenUp, isSimpleExerciseSolved } from './logic';
import type {
  SimpleExerciseAction,
  SimpleExerciseCheckResult,
  SimpleExerciseControlSlotProps,
  SimpleExerciseDefinition,
  SimpleExerciseFeedbackType,
  SimpleExerciseStoredState,
} from './types';

interface SimpleExerciseViewProps<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult,
> {
  definition: SimpleExerciseDefinition<Parameters, Input, CheckResult>;
  definitions: ReadonlyArray<SimpleExerciseDefinition<Parameters, Input, CheckResult>>;
  initialInput: Input;
  Controls?: ComponentType<SimpleExerciseControlSlotProps<Parameters>>;
  canSubmit?: boolean;
  canGiveUp?: boolean;
  onNext: () => void;
  startExercise: (exerciseId: string) => void;
}

/**
 * Renders the active exercise and handles submit/give-up. Knows nothing about
 * exercise generation, that is the ExerciseManager's job.
 */
export function SimpleExerciseView<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult,
>({
  definition,
  definitions,
  initialInput,
  Controls,
  canSubmit: externallyCanSubmit = true,
  canGiveUp: externallyCanGiveUp = true,
  onNext,
  startExercise,
}: SimpleExerciseViewProps<Parameters, Input, CheckResult>) {
  const { instance, state, events, parameters, draftInput, submitAction, setDraftInput } =
    useExercise<Parameters, SimpleExerciseAction<Input>, SimpleExerciseStoredState>();

  const [feedback, setFeedback] = useState<{
    message: string;
    type: SimpleExerciseFeedbackType;
  } | null>(null);
  const [lastResult, setLastResult] = useState<CheckResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [giveUpOpen, setGiveUpOpen] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const hydratedKeyRef = useRef<string | null>(null);

  // Live draft drives the input; when it is cleared (e.g. on completion), fall
  // back to the last submitted input so a solved exercise still shows the query.
  const lastSubmittedInput = useMemo(() => {
    for (let i = events.length - 1; i >= 0; i -= 1) {
      if (events[i].action.type === 'input') return events[i].action.input as Input;
    }
    return undefined;
  }, [events]);
  const input = (draftInput !== undefined ? draftInput : lastSubmittedInput ?? initialInput) as Input;

  // Clear transient UI state whenever a new exercise instance loads.
  useEffect(() => {
    const key = instance
      ? `${instance.exerciseId}:${instance.version}:${instance.createdAt}`
      : null;
    if (hydratedKeyRef.current === key) return;
    hydratedKeyRef.current = key;
    setFeedback(null);
    setLastResult(null);
    setSolutionRevealed(false);
  }, [instance]);

  const handleInputChange = useCallback(
    (value: Input) => {
      setDraftInput(value);
      setFeedback(null);
    },
    [setDraftInput],
  );

  const handleSubmit = useCallback(async () => {
    if (!parameters || isSubmitting) return;
    const normalizedInput = definition.normalizeInput?.(input) ?? String(input).trim();
    const repeated = events.some(
      (event) => event.action.type === 'input' &&
        (definition.normalizeInput?.(event.action.input as Input) ?? String(event.action.input).trim()) === normalizedInput,
    );
    if (repeated) {
      submitAction({ type: 'input', input, correct: false });
      setFeedback({ message: 'You already tried this exact input before.', type: 'info' });
      return;
    }

    setIsSubmitting(true);
    try {
      const validation = await definition.validateInput({ parameters, input });
      if (!validation.valid) {
        submitAction({ type: 'input', input, correct: false });
        setFeedback({
          message: validation.feedback ?? 'Please double-check your input before submitting.',
          type: validation.feedbackType ?? 'warning',
        });
        return;
      }
      const result = await definition.checkInput({ parameters, input });
      const correct = definition.isCorrect
        ? definition.isCorrect(result)
        : Boolean((result as SimpleExerciseCheckResult).correct);
      submitAction({ type: 'input', input, correct });
      setLastResult(result);
      const checkResult = result as SimpleExerciseCheckResult;
      setFeedback({
        message: definition.getFeedback?.(result) ??
          checkResult.feedback ??
          (correct ? 'Correct!' : 'Not quite right. Try again.'),
        type: checkResult.feedbackType ?? (correct ? 'success' : 'error'),
      });
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Unable to check your answer. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [definition, events, input, isSubmitting, parameters, submitAction]);

  const handleGiveUp = useCallback(() => {
    submitAction({ type: 'give-up' });
    setGiveUpOpen(false);
    setFeedback(null);
    setSolutionRevealed(true);
  }, [submitAction]);

  if (!parameters) return null;

  const solved = isSimpleExerciseSolved(state);
  const givenUp = isSimpleExerciseGivenUp(state);
  const complete = solved || givenUp;
  const canSubmit = externallyCanSubmit && !complete && !isSubmitting &&
    !(definition.isInputEmpty?.(input) ?? false);
  const { Prompt, Problem, Input: InputComponent, Solution, Payoff, Output } = definition;

  return (
    <Box>
      {Prompt ? <Prompt parameters={parameters} /> : null}
      <Problem parameters={parameters} />
      <InputComponent
        parameters={parameters}
        value={input}
        disabled={complete || isSubmitting}
        onChange={handleInputChange}
        onSubmit={() => void handleSubmit()}
      />
      {feedback ? <Alert severity={feedback.type} sx={{ mt: 1.5 }}>{feedback.message}</Alert> : null}
      <SimpleExerciseControlsContext.Provider
        value={{
          solved,
          givenUp,
          canSubmit,
          canGiveUp: externallyCanGiveUp && !complete && !isSubmitting,
          onSubmit: () => void handleSubmit(),
          onGiveUp: () => setGiveUpOpen(true),
          onNext,
          adminControls: Controls ? (
            <Controls
              definitions={definitions as ReadonlyArray<SimpleExerciseDefinition<Parameters, unknown, unknown>>}
              currentExerciseId={definition.exerciseId}
              startExercise={startExercise}
              showSolution={() => setSolutionRevealed(true)}
              disabled={isSubmitting}
            />
          ) : null,
        }}
      >
        <ExerciseControls />
      </SimpleExerciseControlsContext.Provider>
      {Output ? (
        <Output parameters={parameters} input={input} result={lastResult} state={state} />
      ) : null}
      {complete || solutionRevealed ? <Solution parameters={parameters} state={state} /> : null}
      {solved && lastResult && Payoff ? <Payoff parameters={parameters} result={lastResult} /> : null}
      <GiveUpDialog open={giveUpOpen} onConfirm={handleGiveUp} onCancel={() => setGiveUpOpen(false)} />
    </Box>
  );
}
