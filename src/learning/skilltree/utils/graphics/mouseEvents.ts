import { useState, useRef } from "react";
import { Module } from "@/curriculum";
import { getPrerequisites } from "../goalPath";
import { useLongPress } from "react-use";

export function useHoverState(
  moduleItems: Record<string, Module>,
  setHoveredId: (id: string | null) => void,
) {
  const [localHoveredId, setLocalHoveredId] = useState<string | null>(null);
  const [prerequisites, setPrerequisites] = useState<Set<string>>(new Set());
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTargetId = useRef<string | null>(null);

  const handleHoverStart = (id: string) => {
    setLocalHoveredId(id);
    setHoveredId(id);
    const chain = getPrerequisites(id, moduleItems);
    setPrerequisites(chain);

    const item = moduleItems[id];
    setTooltip(item.description || "No description available");
  };

  const handleHoverEnd = () => {
    if (isLongPressing) return;
    setLocalHoveredId(null);
    setHoveredId(null);
    setPrerequisites(new Set());
    setTooltip(null);
    longPressTargetId.current = null;
  };

  const handleLongPressEnd = () => {
    if (!isLongPressing) return;
    setIsLongPressing(false);
    setLocalHoveredId(null);
    setHoveredId(null);
    setPrerequisites(new Set());
    setTooltip(null);
    longPressTargetId.current = null;
  };

  const longPressHandlers = useLongPress(
    () => {
      if (longPressTargetId.current !== null) {
        setIsLongPressing(true);
        handleHoverStart(longPressTargetId.current);
      }
    },
    { isPreventDefault: true, delay: 500 },
  );

  const getLongPressProps = (id: string) => ({
    ...longPressHandlers,
    onTouchStart: (e: React.TouchEvent) => {
      longPressTargetId.current = id;
      longPressHandlers.onTouchStart(e);
    },
  });

  const isConnectorInHoveredPath = (connector: {
    from: string;
    to: string;
  }): boolean => {
    if (!localHoveredId) return false;

    const toIsHovered = connector.to === localHoveredId;
    const fromIsInChain = prerequisites.has(connector.from);
    const toIsInChain = prerequisites.has(connector.to) || toIsHovered;

    return toIsInChain && fromIsInChain;
  };

  return {
    localHoveredId,
    prerequisites,
    tooltip,
    isLongPressing,
    handleHoverStart,
    handleHoverEnd,
    handleLongPressEnd,
    getLongPressProps,
    isConnectorInHoveredPath,
  };
}