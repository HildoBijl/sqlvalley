# Skill tree

Renders module trees with progress highlighting, learning goals, tooltips, and zoom/pan controls. The caller supplies the module definitions, presentation, layout, and optional progress/settings integration.


## Drawing

`SkillTree` uses the fixed-size `Drawing` from `@step-wise/drawing`, with identity coordinates and a downward y-axis. `SkillTreeCanvas` owns zoom and pan through an ancestor CSS transform; the drawing does not add responsive scaling. Empty layouts do not render a drawing.

Connectors and card backgrounds are SVG shapes. `NodeCard` places an interactive `HtmlElement` above the backgrounds and handles node mouse and pointer events there. Goal pins stop pointer propagation so selecting a goal does not navigate to the module.
