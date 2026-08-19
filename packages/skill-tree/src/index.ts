export { SkillTreeCanvas, type SkillTreeCanvasProps } from './components/SkillTreeCanvas';
export { useTreeBounds } from './hooks/useTreeBounds';
export { computeConnectorPath } from './utils/graphics/pathCalculations';
export {
  processModulePositions,
  type ModuleConnector,
  type ModulePositionMeta,
  type ModulePositionMetaRaw,
  type ProcessModulePositionsOptions,
  type ProcessedModulePositions,
} from './utils/positionProcessing';
export {
  cardHeight,
  cardWidth,
  initialPathSpacing,
  maxPathSpace,
  maxVerticalOffset,
  minVerticalOffset,
} from './utils/settings';
