# Learning - Educational components

Educational tools that do not depend on the module tree. Import public components and types from `@/learning`.

- `notation`: relation names, primary and foreign keys, relational algebra (`RA`/`IRA`), and Datalog (`DL`/`IDL`). These components remain independent so their presentation can evolve separately.
- `containers`: `ExerciseSection` and `ManualExerciseSet`, which arrange manually authored exercises and their solutions.
- `layout`: `LearningHeader` and `LearningTabs`. Tabs receive configuration, including optional `align: 'end'`, without interpreting tab names.
- `ModuleContentView.tsx`: defines the module-content contract and renders supplied theory, summary, story, or video components, handling loading and missing content.
- `completion`: skill and concept completion dialogs, sharing private presentation. Callers supply navigation callbacks.
- `InteractivePractice.tsx`: connects the exercise manager to application storage and module resources.
- `dataExplorer`: `DataExplorer` previews up to 100 rows from the full dataset and displays schema information read directly from SQLite. Its dataset size is intentionally independent of the practice setting.
- `queryFigures`: `TableQueryFigure`, `SQLQueryFigure`, `RAQueryFigure`, and `DLQueryFigure` display supplied queries and their results. `useTheoryPageDatabase` reads the original small grading dataset independently of user edits. These tools do not select curriculum modules.

General document formatting, notices, loading screens, and theme utilities live in `@/ui`.


## Supplying module content

`ModuleContent` contains optional `Theory`, `Summary`, `Story`, and `Video` components, either ordinary React components or lazy components. Curriculum selects and loads these; learning only renders them:

```tsx
<ModuleContentView content={content} section="Theory" />
```

Practice registrations, providers, progress, and module-tree information remain separate from this presentation contract. URL and persisted tab synchronization lives in navigation's `useModuleTabs`. Video rendering remains supported while the navigation entries are commented out.
