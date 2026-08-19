import { useCallback, useEffect, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";

interface TreeBounds {
  width: number;
  height: number;
}

interface UseSkillTreeTransformOptions {
  treeBounds: TreeBounds;
  initialScale?: number;
  allowZoom?: boolean;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

export function useSkillTreeTransform({
  treeBounds,
  initialScale = 1,
  allowZoom = true,
}: UseSkillTreeTransformOptions) {
  const outerRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: initialScale });
  const transformRef = useRef(transform);

  // Wheel zoom via listener to avoid double zoom caused by @use-gesture and wheel event both triggering zoom
  const allowZoomRef = useRef(allowZoom);
  allowZoomRef.current = allowZoom;

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (!allowZoomRef.current) return;
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.95 : 1.05;
      setTransform((prev) => {
        const next = {
          ...prev,
          scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * factor)),
        };
        transformRef.current = next;
        return next;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const bind = useGesture(
    {
      onDrag: ({ offset: [x, y] }) => {
        const next = { ...transformRef.current, x, y };
        setTransform(next);
        transformRef.current = next;
      },
      onPinch: ({ offset: [d] }) => {
        if (!allowZoomRef.current) return;
        const next = {
          ...transformRef.current,
          scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, d)),
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
          const extra = 250;
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
        pinchOnWheel: false,
      },
    },
  );

  const zoomBy = useCallback((factor: number) => {
    setTransform((prev) => {
      const next = {
        ...prev,
        scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * factor)),
      };
      transformRef.current = next;
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next = { x: 0, y: 0, scale: initialScale };
    setTransform(next);
    transformRef.current = next;
  }, [initialScale]);

  return { outerRef, transform, bind, zoomBy, reset };
}
