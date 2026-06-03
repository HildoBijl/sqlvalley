import { skillTree } from '@/curriculum/skillTree';
import {
  type ModulePositionMeta,
  type ModulePositionMetaRaw,
  processModulePositions,
} from '@/learning/skilltree/utils/positionProcessing';
import { cardWidth, cardHeight } from '@/learning/skilltree/utils/settings';
import { computeConnectorPath } from '@/learning/skilltree/utils/graphics/pathCalculations';

const margin = 20;

const dy = cardHeight * 1.5;
const y1 = margin + cardHeight / 2;
const y2 = y1 + dy;
const y3 = y2 + dy;
const y4 = y3 + dy;
const y5 = y4 + dy;
const y6 = y5 + dy;
const y7 = y6 + dy;
const y8 = y7 + dy;
const y9 = y8 + dy;
const y10 = y9 + dy;
export const treeHeight = y10 + cardHeight / 2 + margin;

const dx = cardWidth * 1.5;
const x1 = margin + cardWidth / 2;
const x2 = x1 + dx;
const x3 = x2 + dx;
const x4 = x3 + dx;
const x5 = x4 + dx;
const x6 = x5 + dx;
// const x7 = x6 + dx;
export const treeWidth = x6 + cardWidth / 2 + margin;

// Placeholder positions for Datalog skill tree
const modulePositionsRaw: Record<string, ModulePositionMetaRaw> = {
  // Fundamental database concepts (shared with SQL and RA tree)
  'database': { position: { x: x3, y: y1 } },
  'database-table': { position: { x: (x2 + x3) / 2, y: y2 } },
  'query-language': { position: { x: (x3 + x4) / 2, y: y2 } },
  'projection-and-filtering': { position: { x: x2, y: y3 } },
  'database-keys': { position: { x: x3, y: y3 } },

  'database-view': { position: { x: x2, y: y4 } },
  'foreign-key': { position: { x: x3, y: y4 } },
  'datalog': { position: { x: x2, y: y5 } },
  'join-and-decomposition': { position: { x: x3, y: y5 } },
  'recursive-query': { position: { x: x4, y: y5 } },

  // Datalog concepts
  'dl-define-projection-rule': { position: { x: x1, y: y6 } },
  'dl-define-filtering-rule': { position: { x: x2, y: y6 } },
  'dl-define-derived-predicate': { position: { x: x1, y: y7 } },
  'dl-define-join-rule': { position: { x: x2, y: y7 } },

  // Datalog with negation
  'dl-literal-types-and-rule-safety': { position: { x: x3, y: y6 } },
  'dl-define-negation-rule': { position: { x: (x2 + x3) / 2, y: y8 } },
  'dl-check-rule-safety': { position: { x: x3, y: y7 } },
  'dl-write-multi-predicate-program': { position: { x: x2, y: y9 } },

  // Recursive Datalog
  'dl-predicate-dependency-graph': { position: { x: (x4 + x5) / 2, y: y6 } },
  'dl-draw-predicate-dependency-graph': { position: { x: x4, y: y7 } },
  'dl-semi-positive-and-stratified-datalog': { position: { x: x5, y: y7 } },
  'dl-check-program-stratification': { position: { x: (x4 + x5) / 2, y: y8 } },
  'dl-define-recursive-predicate': { position: { x: (x3 + x4) / 2, y: y8 } },
  'dl-write-recursive-program': { position: { x: x3, y: y10 } },
};

const processedModulePositions = processModulePositions({
  rawPositions: modulePositionsRaw,
  skillTree,
  cardHeight,
  computeConnectorPath,
  treeName: 'Datalog Skill Tree',
});

export const datalogModulePositions: Record<string, ModulePositionMeta> =
  processedModulePositions.modulePositions;
export const datalogModulePositionList: ModulePositionMeta[] =
  processedModulePositions.modulePositionList;
export const datalogConnectors = processedModulePositions.connectors;

export type { ModulePositionMeta, ModulePositionMetaRaw };
