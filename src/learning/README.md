# Learning - Educational components

Educational tools that do not depend on the module tree. Import public components and types from `@/learning`.

- `notation`: relation names, primary and foreign keys, relational algebra (`RA`/`IRA`), and Datalog (`DL`/`IDL`). These components remain independent so their presentation can evolve separately.
- `ManualExerciseSet.tsx`: arranges manually authored exercises and their solutions using the shared `ExerciseSection` from `@sqlvalley/input-exercise-components`, with closely spaced problem and solution panels and a white solution background.
- `layout`: `LearningHeader` and `LearningTabs`. Tabs receive configuration, including optional `align: 'end'`, without interpreting tab names.
- `types.ts`: defines the shared module-content contract for theory, summary, story, and video components.
- `completion`: a shared `CompletionDialog` with caller-supplied title/name and optional summary, story, and next-module actions. All actions close the dialog. `CompleteModuleButton` is independent and only invokes its callback.
- `practice`: `StaticPractice` renders a supplied practice component within a local loading boundary; `InteractivePractice` connects the exercise manager to application storage and module resources.
- `dataExplorer`: `DataExplorer` displays all rows using the shared `DataTable` with `controls` enabled for sorting and filtering, without a toolbar and schema information read directly from SQLite. Its small/full dataset selector shares the persisted practice setting.
- `queryFigures`: `TableQueryFigure`, `SQLQueryFigure`, `RAQueryFigure`, and `DLQueryFigure` display supplied queries and their results. `useTheoryPageDatabase` reads the original small grading dataset independently of user edits. These tools do not select curriculum modules.

General document formatting, notices, loading screens, and theme utilities live in `@/ui`.


## Supplying module content

`ModuleContent` contains optional `Theory`, `Summary`, `Story`, and `Video` components, either ordinary React components or lazy components. Curriculum selects and loads these; navigation renders them through its internal `ModuleContentTab`:

```tsx
<ModuleContentTab content={content} contentKey="Theory" />
```

Practice registrations, providers, progress, and module-tree information remain separate from this presentation contract. URL and persisted tab synchronization lives in navigation's `useModuleTabSelection`. Video rendering remains supported while the navigation entries are commented out.
