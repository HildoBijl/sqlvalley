import { datalogModulePositions } from './datalog-treeDefinitions';
import { raModulePositions } from './ra-treeDefinition';
import { modulePositions } from './sql-treeDefinition';

export {
  connectors,
  modulePositionList,
  modulePositions,
  treeHeight as sqlTreeHeight,
  treeWidth as sqlTreeWidth,
} from './sql-treeDefinition';
export {
  raConnectors,
  raModulePositionList,
  raModulePositions,
  treeHeight as raTreeHeight,
  treeWidth as raTreeWidth,
} from './ra-treeDefinition';
export {
  datalogConnectors,
  datalogModulePositionList,
  datalogModulePositions,
  treeHeight as datalogTreeHeight,
  treeWidth as datalogTreeWidth,
} from './datalog-treeDefinitions';
export type { ModulePositionMeta, ModulePositionMetaRaw } from './sql-treeDefinition';

export const skillTreeVisualizations = ['sql', 'ra', 'datalog'] as const;

export type SkillTreeVisualizationId = typeof skillTreeVisualizations[number];

export interface SkillTreeVisualizationDefinition {
  id: SkillTreeVisualizationId;
  label: string;
  path: string;
  moduleIds: ReadonlySet<string>;
}

export const defaultSkillTreeVisualization: SkillTreeVisualizationId = 'sql';

export const skillTreeVisualizationDefinitions: readonly SkillTreeVisualizationDefinition[] = [
  {
    id: 'sql',
    label: 'Learn SQL',
    path: '/learn',
    moduleIds: new Set(Object.keys(modulePositions)),
  },
  {
    id: 'ra',
    label: 'Learn RA',
    path: '/learn-ra',
    moduleIds: new Set(Object.keys(raModulePositions)),
  },
  {
    id: 'datalog',
    label: 'Learn Datalog',
    path: '/learn-datalog',
    moduleIds: new Set(Object.keys(datalogModulePositions)),
  },
] as const;

export const skillTreeVisualizationById = new Map(
  skillTreeVisualizationDefinitions.map((definition) => [
    definition.id,
    definition,
  ]),
);

export const isSkillTreeVisualizationId = (
  value: unknown,
): value is SkillTreeVisualizationId =>
  typeof value === 'string' &&
  skillTreeVisualizations.includes(value as SkillTreeVisualizationId);
