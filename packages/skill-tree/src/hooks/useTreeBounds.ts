import { useMemo } from 'react';

/*
 * Bounding box for a tree layout of the given size.
 */
export function useTreeBounds(width: number, height: number) {
  return useMemo(() => ({
    minX: 0,
    minY: 0,
    maxX: width,
    maxY: height,
    width,
    height,
  }), [width, height]);
}
