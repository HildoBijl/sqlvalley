import { modules } from '@/curriculum';
import {
	type ModulePositionMeta,
	type ModulePositionMetaRaw,
	processModulePositions,
} from '@/learning/skillTreeDefinition';
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
const y5_5 = y4 + dy / 2;
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

// Placeholder positions for RA skill tree
const modulePositionsRaw: Record<string, ModulePositionMetaRaw> = {
	// Fundamental database concepts (shared with SQL tree)
	'database': { position: { x: (x2+x3)/2, y: y1 } },
	'query-language': { position: { x: x2, y: y2 } },
	'database-table': { position: { x: x3, y: y2 } },
	'database-keys': { position: { x: x4, y: y3 } },

	// Database table manipulation concepts.
	'projection-and-filtering': { position: { x: x3, y: y3 } },
	'foreign-key': { position: { x: x4, y: y4 } },
	'join-and-decomposition': { position: { x: x4, y: y5 } },

	// RA fundamentals.
	'relational-algebra': { position: { x: x2, y: y3 } },

	// RA-specific skills 
	'ra-choose-columns': { position: { x: x2, y: y5_5 } },
	'ra-filter-rows': { position: { x: x3, y: y5_5 } },
	'ra-set-up-single-relation-query': { position: { x: x2, y: y6 } },
	'ra-join-relations': { position: { x: x3, y: y6 } },
	'ra-set-up-multi-condition-query': { position: { x: x2, y: y7 } },
	'ra-set-up-multi-relation-query': { position: { x: x3, y: y7 } },
	'ra-set-up-universal-condition-query': { position: { x: (x2+x3)/2, y: y9 } },
	'ra-set-up-multi-step-query': { position: { x: (x2+x3)/2, y: y8 } },
}

const processedModulePositions = processModulePositions({
	rawPositions: modulePositionsRaw,
	modules,
	cardHeight,
	computeConnectorPath,
	treeName: 'RA Skill Tree',
});

export const raModulePositions: Record<string, ModulePositionMeta> =
	processedModulePositions.modulePositions;
export const raModulePositionList: ModulePositionMeta[] =
	processedModulePositions.modulePositionList;
export const raConnectors = processedModulePositions.connectors;

export type { ModulePositionMeta, ModulePositionMetaRaw };
