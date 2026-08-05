import type { TouchEvent } from 'react';
import { useRef, useState } from 'react';
import { useLongPress } from 'react-use';
import type { Module } from '@/learning/skillTreeDefinition';
import { getPrerequisites } from '@/learning/skillTreeDefinition';

export function useHoverState(
  skillTree: Record<string, Module>,
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
    const chain = getPrerequisites(skillTree, id);
    setPrerequisites(chain);

    const item = skillTree[id];
    setTooltip(item.description || 'No description available');
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
    { isPreventDefault: false, delay: 500 },
  );

  const getLongPressProps = (id: string) => ({
    ...longPressHandlers,
    onTouchStart: (event: TouchEvent) => {
      longPressTargetId.current = id;
      longPressHandlers.onTouchStart(event);
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
