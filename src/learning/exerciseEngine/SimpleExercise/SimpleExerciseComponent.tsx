import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Box } from '@mui/material';

import type { AsyncExerciseReducer, StoredExerciseAction, StoredExerciseState } from '@/store';
import { useExercise } from '../Exercise';
import type { SimpleExerciseFeedback } from './buildSimpleExercise';
import { SimpleExerciseControlsContext } from './controlsContext';
import { ExerciseControls } from './ExerciseControls';
import { GiveUpDialog } from './GiveUpDialog';
import { isSimpleExerciseGivenUp, isSimpleExerciseSolved } from './logic';
import type { SimpleExerciseRenderSpec } from './specifications';
import type { SimpleExerciseFeedbackType, SimpleExerciseStoredState } from './types';

interface SimpleExerciseComponentProps<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult,
> {
  spec: SimpleExerciseRenderSpec<Parameters, Input, CheckResult>;
  reduce: AsyncExerciseReducer;
  isComplete: (state: StoredExerciseState) => boolean;
  isSolved: (state: StoredExerciseState) => boolean;
}

export function SimpleExerciseComponent<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult,
>({ spec, reduce, isComplete, isSolved }: SimpleExerciseComponentProps<Parameters, Input, CheckResult>) {
  const { instance, parameters, state, events, draftInput, pending, processAction, startNewExercise, setDraftInput } =
    useExercise<Record<string, unknown>, StoredExerciseAction, StoredExerciseState>();

  const [feedback, setFeedback] = useState<{ message: string; type: SimpleExerciseFeedbackType } | null>(null);
  const [lastResult, setLastResult] = useState<CheckResult | null>(null);
  const [giveUpOpen, setGiveUpOpen] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const hydratedKeyRef = useRef<string | null>(null);

  const lastSubmittedInput = useMemo(() => {
    for (let i = events.length - 1; i >= 0; i -= 1) {
      if (events[i].action.type === 'input') return events[i].action.input as Input;
    }
    return undefined;
  }, [events]);
  const input = (draftInput !== undefined ? draftInput : lastSubmittedInput ?? spec.initialInput) as Input;

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
    if (!parameters || pending) return;
    const normalized = spec.normalizeInput?.(input) ?? String(input).trim();
    const repeated = events.some(
      (event) => event.action.type === 'input' &&
        (spec.normalizeInput?.(event.action.input as Input) ?? String(event.action.input).trim()) === normalized,
    );
    if (repeated) {
      setFeedback({ message: 'You already tried this exact input before.', type: 'info' });
      return;
    }
    try {
      const result = await processAction({ type: 'input', input }, reduce, { isComplete, isSolved });
      const fb = result.feedback as SimpleExerciseFeedback | undefined;
      if (fb) {
        setFeedback({ message: fb.message, type: fb.type });
        if (fb.result !== undefined) setLastResult(fb.result as CheckResult);
      }
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Unable to check your answer. Please try again.',
        type: 'error',
      });
    }
  }, [events, input, isComplete, isSolved, parameters, pending, processAction, reduce, spec]);

  const handleGiveUp = useCallback(async () => {
    setGiveUpOpen(false);
    setFeedback(null);
    setSolutionRevealed(true);
    await processAction({ type: 'give-up' }, reduce, { isComplete, isSolved });
  }, [isComplete, isSolved, processAction, reduce]);

  if (!parameters) return null;

  const params = parameters as Parameters;
  const storedState = state as SimpleExerciseStoredState;
  const solved = isSimpleExerciseSolved(storedState);
  const givenUp = isSimpleExerciseGivenUp(storedState);
  const complete = solved || givenUp;
  const canSubmit = !complete && !pending && !(spec.isInputEmpty?.(input) ?? false);
  const { Prompt, Problem, Input: InputComponent, Solution, Payoff, Output } = spec;

  return (
    <Box>
      {Prompt ? <Prompt parameters={params} /> : null}
      <Problem parameters={params} />
      <InputComponent
        parameters={params}
        value={input}
        disabled={complete || pending}
        onChange={handleInputChange}
        onSubmit={() => void handleSubmit()}
      />
      {feedback ? <Alert severity={feedback.type} sx={{ mt: 1.5 }}>{feedback.message}</Alert> : null}
      <SimpleExerciseControlsContext.Provider
        value={{
          solved,
          givenUp,
          canSubmit,
          canGiveUp: !complete && !pending,
          onSubmit: () => void handleSubmit(),
          onGiveUp: () => setGiveUpOpen(true),
          onNext: startNewExercise,
          adminControls: null,
        }}
      >
        <ExerciseControls />
      </SimpleExerciseControlsContext.Provider>
      {Output ? (
        <Output parameters={params} input={input} result={lastResult} state={storedState} />
      ) : null}
      {complete || solutionRevealed ? <Solution parameters={params} state={storedState} /> : null}
      {solved && lastResult && Payoff ? <Payoff parameters={params} result={lastResult} /> : null}
      <GiveUpDialog open={giveUpOpen} onConfirm={() => void handleGiveUp()} onCancel={() => setGiveUpOpen(false)} />
    </Box>
  );
}
