# Learning - Educational components

Educational tools that do not depend on the module tree. Import public components and types from `@/learning`.

- `FigureHtml.tsx`: wraps the drawing toolbox's `HtmlElement` with pointer events enabled, normal whitespace, and content-sized width. All props, including refs, pass through; explicit styles and `ignoreMouse` override the defaults.
- `notation`: relation names, primary and foreign keys, relational algebra (`RA`/`IRA`), and Datalog (`DL`/`IDL`). These components remain independent so their presentation can evolve separately.
- `ManualExerciseSet.tsx`: arranges manually authored exercises and their solutions using the shared `ExerciseSection` from `@sqlvalley/input-exercise-components`, with closely spaced problem and solution panels and a white solution background.
- `layout`: `LearningHeader` and `LearningTabs`. Tabs receive configuration, including optional `align: 'end'`, without interpreting tab names.
- `types.ts`: defines the shared module-content contract for theory, summary, story, video, and static practice components.
- `completion`: a shared `CompletionDialog` with caller-supplied title/name and optional summary, story, and next-module actions. All actions close the dialog. `CompleteModuleButton` is independent and only invokes its callback.
- `practice`: `StaticPractice` renders a supplied practice component within a local loading boundary; `InteractivePractice` connects the exercise manager to application storage and module resources.
- `dataExplorer`: `DataExplorer` displays all rows using the shared `DataTable` with `controls` enabled for sorting and filtering, without a toolbar and schema information read directly from SQLite. Its small/full dataset selector shares the persisted practice setting.
- `queryFigures`: `TableQueryFigure`, `SQLQueryFigure`, `RAQueryFigure`, and `DLQueryFigure` display supplied queries and their results. They use measured drawings from `@step-wise/drawing` to size figures from named targets. `TableQueryFigure` uses `TargetBoundsDrawingFigure` to encompass its table and optional title, with a 5px outer margin. `useTheoryPageDatabase` reads the original small grading dataset independently of user edits. These tools do not select curriculum modules.

Figures register containers with `FigureHtml target` and descendant text with `useDrawingTextTarget` from `@step-wise/drawing`. Read direction-aware drawing-coordinate bounds with `useDrawingTargetBounds`. Keep each figure's layout in its module.

General document formatting, notices, loading screens, and theme utilities live in `@/ui`.


## Character speech

`story` provides `SpeechBox` and a central `characters` registry with names and placeholder portraits for Anna, Bob, and Carl. Character IDs are inferred from the registry. Import them through `@/learning`.

```tsx
<SpeechBox person="anna">
	<Par>Could you find these contracts for me?</Par>
</SpeechBox>

<SpeechBox person="bob" picturePosition="right">
	<Par>Thanks for finding them!</Par>
</SpeechBox>
```

The portrait defaults to the left. Children can contain multiple paragraphs or other React content. The component can be used in exercise prompts, payoffs, or module stories; the exercise decides when to display it.


## Supplying module content

`ModuleContent` contains optional `Theory`, `Summary`, `Story`, `Video`, and `Practice` components, either ordinary React components or lazy components. Modules select and load these; navigation renders passive sections through its internal `ModuleContentTab`:

```tsx
<ModuleContentTab content={content} contentKey="Theory" />
```

Static practice receives completion state through `StaticPractice`; interactive practice registrations, providers, progress, and module-tree information remain separate from this content contract. URL and persisted tab synchronization lives in navigation's `useModuleTabSelection`. Video rendering remains supported while the navigation entries are commented out.
