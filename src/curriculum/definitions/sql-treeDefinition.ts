import { skillTree } from '@/curriculum';
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
export const treeHeight = y8 + cardHeight / 2 + margin;

const dx = cardWidth * 1.5;
const x1 = margin + cardWidth / 2;
const x2 = x1 + dx;
const x3 = x2 + dx;
const x4 = x3 + dx;
const x5 = x4 + dx;
const x6 = x5 + dx;
// const x7 = x6 + dx;
export const treeWidth = x6 + cardWidth / 2 + margin;

const modulePositionsRaw: Record<string, ModulePositionMetaRaw> = {
  // Fundamental database concepts.
  'database': { position: { x: (x2 + x3) / 2, y: y1 } },
  'query-language': { position: { x: x2, y: y2 } },
  'database-table': { position: { x: x3, y: y2 } },
  'data-types': { position: { x: x3, y: y3 } },
  'database-keys': { position: { x: x5, y: y3 } },

  // Database table manipulation.
  'projection-and-filtering': { position: { x: x4, y: y3 } },
  'foreign-key': { position: { x: x5, y: y4 } },
  'join-and-decomposition': { position: { x: x5, y: y5 } },
  'aggregation': { position: { x: x6, y: y4 } },

  // SQL fundamentals.
  'sql': { position: { x: x2, y: y3 } },
  'choose-columns': { position: { x: (x2 + x3) / 2, y: y4 } },
  'filter-rows': { position: { x: (x3 + x4) / 2, y: y4 } },
  'write-single-criterion-query': { position: { x: x3, y: y5 } },

  // Single-table SQL querying.
  'sort-rows': { position: { x: x1, y: y5 } },
  'process-columns': { position: { x: x2, y: y5 } },
  'filter-rows-on-multiple-criteria': { position: { x: x4, y: y5 } },
  'write-multi-criterion-query': { position: { x: x2, y: y6 } },

  // Aggregation in SQL.
  'aggregate-columns': { position: { x: x6, y: y5 } },
  'use-filtered-aggregation': { position: { x: x5, y: y6 } },
  // 'use-dynamic-aggregation': { position: { x: x6, y: y6 } },

  // Multi-table SQL querying.
  'write-look-up-query': { position: { x: x3, y: y6 } },
  'join-tables': { position: { x: x4, y: y6 } },
  'write-multi-table-query': { position: { x: (x3 + x4) / 2, y: y7 } },
  'write-multi-layered-query': { position: { x: (x3 + x4) / 2, y: y8 } },

  // Pivot tables in SQL.
  // 'pivot-table': { position: { x: x7, y: y5 } },
  // 'create-pivot-table': { position: { x: x7, y: y6 } },
};

const processedModulePositions = processModulePositions({
  rawPositions: modulePositionsRaw,
  skillTree,
  cardHeight,
  computeConnectorPath,
});

export const modulePositions: Record<string, ModulePositionMeta> =
  processedModulePositions.modulePositions;
export const modulePositionList: ModulePositionMeta[] =
  processedModulePositions.modulePositionList;
export const connectors = processedModulePositions.connectors;

export type { ModulePositionMeta, ModulePositionMetaRaw };
