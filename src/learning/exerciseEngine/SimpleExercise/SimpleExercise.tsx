import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Box, Typography } from '@mui/material';

import { Exercise, useExercise } from '../Exercise';
import type { ExerciseHelpers } from '../Exercise';
import { ExerciseControls } from './ExerciseControls';
import { GiveUpDialog } from './GiveUpDialog';
import {
  emptySimpleExerciseState,
  isSimpleExerciseGivenUp,
  isSimpleExerciseSolved,
  reduceSimpleExerciseState,
} from './logic';
import type {
  SimpleExerciseAction,
  SimpleExerciseCheckResult,
  SimpleExerciseDefinition,
  SimpleExerciseFeedbackType,
  SimpleExerciseProps,
  SimpleExerciseStoredState,
} from './types';

const helpers: ExerciseHelpers = {
  selectRandomly: <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)],
  randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
};

export function SimpleExercise<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult = SimpleExerciseCheckResult,
>({
  skillId,
  definitions,
  initialInput,
  unavailableMessage,
  Controls,
  canSubmit,
  canGiveUp,
  onSolved,
}: SimpleExerciseProps<Parameters, Input, CheckResult>) {
  return (
    <Exercise<Parameters, SimpleExerciseAction<Input>, SimpleExerciseStoredState>
      skillId={skillId}
      reducer={reduceSimpleExerciseState}
      initialState={emptySimpleExerciseState}
      isComplete={(state) => isSimpleExerciseSolved(state) || isSimpleExerciseGivenUp(state)}
      isSolved={isSimpleExerciseSolved}
    >
      <SimpleExerciseContent
        definitions={definitions}
        initialInput={initialInput}
        unavailableMessage={unavailableMessage}
        Controls={Controls}
        canSubmit={canSubmit}
        canGiveUp={canGiveUp}
        onSolved={onSolved}
      />
    </Exercise>
  );
}

function SimpleExerciseContent<
  Parameters extends Record<string, unknown>,
  Input,
  CheckResult,
>({
  definitions,
  initialInput,
  unavailableMessage,
  Controls,
  canSubmit: externallyCanSubmit = true,
  canGiveUp: externallyCanGiveUp = true,
  onSolved,
}: Omit<SimpleExerciseProps<Parameters, Input, CheckResult>, 'skillId'>) {
  const {
    descriptor,
    instance,
    state,
    events,
    parameters,
    draftInput,
    startExercise,
    ensureExercise,
    submitAction,
    setDraftInput,
  } = useExercise<
    Parameters,
    SimpleExerciseAction<Input>,
    SimpleExerciseStoredState
  >();
  const [input, setInput] = useState(initialInput);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: SimpleExerciseFeedbackType;
  } | null>(null);
  const [lastResult, setLastResult] = useState<CheckResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [giveUpOpen, setGiveUpOpen] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const hydratedExerciseKeyRef = useRef<string | null>(null);

  const definitionById = useMemo(
    () => new Map(definitions.map((definition) => [definition.exerciseId, definition])),
    [definitions],
  );
  const definition = descriptor
    ? definitionById.get(descriptor.exerciseId) ?? null
    : null;

  const createDescriptor = useCallback(
    (nextDefinition: SimpleExerciseDefinition<Parameters, Input, CheckResult>) => ({
      exerciseId: nextDefinition.exerciseId,
      version: nextDefinition.version,
      parameters: nextDefinition.generateParameters(helpers, {
        previousParameters: parameters,
      }),
    }),
    [parameters],
  );

  const chooseNextDefinition = useCallback(() => {
    const available = definition && definitions.length > 1
      ? definitions.filter((candidate) => candidate.exerciseId !== definition.exerciseId)
      : definitions;
    return available.length > 0 ? helpers.selectRandomly(available) : null;
  }, [definition, definitions]);

  const startDefinition = useCallback(
    (exerciseId: string, ensure = false) => {
      const nextDefinition = definitionById.get(exerciseId);
      if (!nextDefinition) return;
      const descriptor = createDescriptor(nextDefinition);
      if (ensure) {
        ensureExercise(descriptor);
      } else {
        startExercise(descriptor);
      }
    },
    [createDescriptor, definitionById, ensureExercise, startExercise],
  );

  useEffect(() => {
    if (definitions.length === 0) return;
    if (!descriptor) {
      const initialDefinition = helpers.selectRandomly(definitions);
      startDefinition(initialDefinition.exerciseId, true);
      return;
    }
    const storedDefinition = definitionById.get(descriptor.exerciseId);
    if (!storedDefinition || storedDefinition.version !== descriptor.version) {
      const replacement = storedDefinition ?? helpers.selectRandomly(definitions);
      startDefinition(replacement.exerciseId);
    }
  }, [definitionById, definitions, descriptor, startDefinition]);

  useEffect(() => {
    const exerciseKey = instance
      ? `${instance.exerciseId}:${instance.version}:${instance.createdAt}`
      : null;
    if (hydratedExerciseKeyRef.current === exerciseKey) return;
    hydratedExerciseKeyRef.current = exerciseKey;
    setInput(draftInput === undefined ? initialInput : draftInput as Input);
    setFeedback(null);
    setLastResult(null);
    setSolutionRevealed(false);
  }, [draftInput, initialInput, instance]);

  const handleInputChange = useCallback(
    (value: Input) => {
      setInput(value);
      setDraftInput(value);
      setFeedback(null);
    },
    [setDraftInput],
  );

  const handleSubmit = useCallback(async () => {
    if (!definition || !parameters || isSubmitting) return;
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
      if (correct && !isSimpleExerciseSolved(state)) {
        onSolved?.();
      }
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Unable to check your answer. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [definition, events, input, isSubmitting, onSolved, parameters, state, submitAction]);

  const handleGiveUp = useCallback(() => {
    submitAction({ type: 'give-up' });
    setGiveUpOpen(false);
    setFeedback(null);
    setSolutionRevealed(true);
  }, [submitAction]);

  const handleNext = useCallback(() => {
    const nextDefinition = chooseNextDefinition();
    if (!nextDefinition) return;
    startDefinition(nextDefinition.exerciseId);
  }, [chooseNextDefinition, startDefinition]);

  if (definitions.length === 0) {
    return <Alert severity="info">{unavailableMessage ?? 'No exercises are available yet.'}</Alert>;
  }
  if (!definition || !parameters) {
    return <Typography color="text.secondary">Generating your next exercise...</Typography>;
  }

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
      <ExerciseControls
        exerciseCompleted={solved}
        hasGivenUp={givenUp}
        canSubmit={canSubmit}
        canGiveUp={externallyCanGiveUp && !complete && !isSubmitting}
        onSubmit={() => void handleSubmit()}
        onGiveUp={() => setGiveUpOpen(true)}
        onNext={handleNext}
        leftActions={Controls ? (
          <Controls
            definitions={definitions as ReadonlyArray<SimpleExerciseDefinition<Parameters, unknown, unknown>>}
            currentExerciseId={definition.exerciseId}
            startExercise={startDefinition}
            showSolution={() => setSolutionRevealed(true)}
            disabled={isSubmitting}
          />
        ) : null}
      />
      {Output ? (
        <Output parameters={parameters} input={input} result={lastResult} state={state} />
      ) : null}
      {complete || solutionRevealed ? <Solution parameters={parameters} state={state} /> : null}
      {solved && lastResult && Payoff ? <Payoff parameters={parameters} result={lastResult} /> : null}
      <GiveUpDialog open={giveUpOpen} onConfirm={handleGiveUp} onCancel={() => setGiveUpOpen(false)} />
    </Box>
  );
}
