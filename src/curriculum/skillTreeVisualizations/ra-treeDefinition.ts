import { skillTree } from '@/curriculum/skillTree';
import {
  defineSkillTree,
  type GridPosition,
  type ModulePositionMeta,
  type ModulePositionMetaRaw,
} from '@sqlvalley/skill-tree';

// Where each module sits on the grid. Cells are 1-indexed, and fractional
// values place a module between two cells. See the README in this folder.
const nodes: Record<string, GridPosition> = {
  // Fundamental database concepts (shared with SQL tree)
  'database': { col: 1.5, row: 1 },
  'query-language': { col: 1, row: 2 },
  'database-table': { col: 2, row: 2 },
  'database-keys': { col: 3, row: 3 },

  // Database table manipulation concepts.
  'projection-and-filtering': { col: 2, row: 3 },
  'foreign-key': { col: 3, row: 4 },
  'join-and-decomposition': { col: 3, row: 5 },

  // RA fundamentals.
  'relational-algebra': { col: 1, row: 3 },

  // RA-specific skills
  'ra-choose-columns': { col: 1, row: 4.5 },
  'ra-filter-rows': { col: 2, row: 4.5 },
  'ra-set-up-single-relation-query': { col: 1, row: 6 },
  'ra-join-relations': { col: 2, row: 6 },
  'ra-set-up-multi-condition-query': { col: 1, row: 7 },
  'ra-set-up-multi-relation-query': { col: 2, row: 7 },
  'ra-set-up-universal-condition-query': { col: 1.5, row: 9 },
  'ra-set-up-multi-step-query': { col: 1.5, row: 8 },
};

const processedModulePositions = defineSkillTree({
  name: 'RA Skill Tree',
  skillTree,
  nodes,
});

export const raModulePositions: Record<string, ModulePositionMeta> =
  processedModulePositions.modulePositions;
export const raModulePositionList: ModulePositionMeta[] =
  processedModulePositions.modulePositionList;
export const raConnectors = processedModulePositions.connectors;

export type { ModulePositionMeta, ModulePositionMetaRaw };
