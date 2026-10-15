# Skill tree

Renders module trees with progress highlighting, learning goals, tooltips, and zoom/pan controls. The caller supplies the module definitions, presentation, layout, and optional progress/settings integration.


## Module links

Pass `getModuleHref` to define the URL belonging to each module. Module cards and planning links render as native anchors, so normal clicks, modifier clicks, middle clicks, keyboard activation, and browser context-menu actions retain their standard behavior.

```tsx
<SkillTreeVisualization
	getModuleHref={moduleId => `/module/${moduleId}`}
	moduleTree={moduleTree}
	modulePresentation={modulePresentation}
	modulePositioning={modulePositioning}
/>
```

On touchscreens, the first tap highlights a module and its prerequisites. Tapping the highlighted module again follows its link.


## Optional state handles

`SkillTreeVisualization` works without external state: planning, intro, and legend state then remain local to the mounted component. Pass `stateHandles` to control and persist these values externally. The handles are grouped by feature and use standard React `[value, setValue]` tuples.

When externally persisted state hydrates asynchronously, set `stateHandles.isReady` to `false` until it is available. This prevents the introduction from appearing before its persisted `hasSeenIntro` value has loaded.


## Drawing

`SkillTreeDrawing` uses the fixed-size `Drawing` from `@step-wise/drawing`, with bounds derived from the positioned module cards and a downward y-axis. `SkillTreeVisualization` places it in the context-backed explorer, which owns zooming, panning, viewport information, and focus actions. The drawing does not add responsive scaling. Empty layouts do not render a drawing.

Connectors and card backgrounds are SVG shapes. `ModuleCard` places an interactive `HtmlElement` above the backgrounds and handles module mouse and pointer events there. Goal pins stop pointer propagation so selecting a goal does not navigate to the module.

The explorer derives its effective minimum scale from the viewport, drawing bounds, and configured tree padding. Configure `minScale`, `maxScale`, and `treePadding` through `settings` when needed. To choose the initial and reset focus, provide either `initialModuleId` or `initialGridPosition`; providing both is an error. Without either setting, the explorer focuses on the drawing midpoint.
