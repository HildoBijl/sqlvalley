import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMousePosition } from "@/utils/dom";
import { useTheme } from "@mui/material/";

interface TooltipProps {
  children?: ReactNode;
}

export function Tooltip({ children }: TooltipProps) {
  const mousePosition = useMousePosition();
  const theme = useTheme();

  if (!children || !mousePosition) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        left: mousePosition.x,
        top: mousePosition.y,
        transform: "translate(12px, 12px)",
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: "8px 12px",
        borderRadius: "4px",
        fontSize: "14px",
        maxWidth: "300px",
        zIndex: 1000,
        boxShadow: theme.shadows[4],
        pointerEvents: "none",
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
