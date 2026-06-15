import { useMemo } from 'react';
import {
  sqlTreeHeight as treeHeight,
  sqlTreeWidth as treeWidth,
} from '@/curriculum/skillTreeVisualizations';
import type { ModulePositionMeta } from '../utils/positionProcessing';

/*
 * Calculate the bounding box of a set of modules in a tree layout.
 *
 * @param modulePositions - Array of modules with position and type.
 * @returns An object containing minX, minY, maxX, maxY, width, and height of the bounding box.
 */
export function useTreeBounds(modulePositions: Record<string, ModulePositionMeta>) {
  return useMemo(() => {
    return {
      minX: 0,
      minY: 0,
      maxX: treeWidth,
      maxY: treeHeight,
      width: treeWidth,
      height: treeHeight,
    };
  }, [modulePositions]);
}
