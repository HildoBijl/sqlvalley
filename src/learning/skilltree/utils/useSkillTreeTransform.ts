import { useState, useRef } from "react";
import { useGesture } from "@use-gesture/react";

interface TreeBounds {
  width: number;
  height: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

export function useSkillTreeTransform(treeBounds: TreeBounds) {
  const outerRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const transformRef = useRef(transform);

  const bind = useGesture(
    {
      onDrag: ({ offset: [x, y] }) => {
        event?.preventDefault();
        const next = { ...transformRef.current, x, y };
        setTransform(next);
        transformRef.current = next;
      },
      onPinch: ({ offset: [d], event }) => {
        event.preventDefault();
        const next = {
          ...transformRef.current,
          scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, d)),
        };
        setTransform(next);
        transformRef.current = next;
      },
      onWheel: ({ delta: [, dy], event }) => {
        event.preventDefault();
        const factor = dy > 0 ? 0.95 : 1.05;
        const next = {
          ...transformRef.current,
          scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, transformRef.current.scale * factor)),
        };
        setTransform(next);
        transformRef.current = next;
      },
    },
    {
      drag: {
        from: () => [transformRef.current.x, transformRef.current.y],
        filterTaps: true,
        pointer: { touch: true },
        bounds: () => {
          const viewport = outerRef.current?.getBoundingClientRect();
          const viewW = viewport?.width ?? 0;
          const viewH = viewport?.height ?? 0;
          const scale = transformRef.current.scale;
          const extra = 500;
          return {
            left: Math.min(0, viewW - treeBounds.width * scale) - extra,
            right: extra,
            top: Math.min(0, viewH - treeBounds.height * scale) - extra,
            bottom: extra,
          };
        },
        rubberband: true,
      },
      pinch: {
        scaleBounds: { min: MIN_SCALE, max: MAX_SCALE },
        from: () => [transformRef.current.scale, 0],
        pointer: { touch: true },
      },
      wheel: {
        eventOptions: { passive: false },
      },
    },
  );

  const zoomBy = (factor: number) => {
    setTransform((prev) => {
      const next = {
        ...prev,
        scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * factor)),
      };
      transformRef.current = next;
      return next;
    });
  };

  const reset = () => {
    const next = { x: 0, y: 0, scale: 1 };
    setTransform(next);
    transformRef.current = next;
  };

  return { outerRef, transform, bind, zoomBy, reset };
}
