import { useMemo } from 'react';
import type { ModulePositionMeta } from '../utils/positionProcessing';
import { cardHeight, cardWidth, treeMargin } from '../utils/settings';

/*
 * Calculate the bounding box of a set of modules in a tree layout.
 *
 * @param modulePositions - Module position data keyed by module ID.
 * @returns An object containing minX, minY, maxX, maxY, width, and height of the bounding box.
 */
export function useTreeBounds(modulePositions: Record<string, ModulePositionMeta>) {
  return useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    for (const { position } of Object.values(modulePositions)) {
      maxX = Math.max(maxX, position.x + cardWidth / 2 + treeMargin);
      maxY = Math.max(maxY, position.y + cardHeight / 2 + treeMargin);
    }

    return {
      minX: 0,
      minY: 0,
      maxX,
      maxY,
      width: maxX,
      height: maxY,
    };
  }, [modulePositions]);
}
