"use client";
import React, { useState, useEffect, useRef } from "react";

export const ResizableSidebar = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [width, setWidth] = useState(300);
  const isResizingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      setWidth((prev) => Math.max(300, prev + e.movementX));
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      setIsResizing(false);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className={`relative border-r h-full flex flex-col group/sidebar transition-colors duration-200 ${
        isResizing ? "border-zinc-500" : "border-white/10"
      }`}
      style={{ width: width }}
    >
      <div className="flex-1 w-full overflow-hidden">{children}</div>

      {/* Resizer Handle */}
      <div
        className="absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize z-50 flex items-center justify-center group/resizer"
        onMouseDown={() => {
          isResizingRef.current = true;
          setIsResizing(true);
          document.body.style.cursor = "col-resize";
        }}
      >
        {/* Visual Pill Handle - Visible on hover or resizing */}
        <div
          className={`h-8 w-1 rounded-full bg-zinc-600 transition-all ${
            isResizing
              ? "opacity-100 h-12 w-1.5"
              : "opacity-0 group-hover/resizer:opacity-100 group-active/resizer:opacity-100 group-active/resizer:h-12 group-active/resizer:w-1.5"
          }`}
        />
      </div>
    </div>
  );
};

export default ResizableSidebar;
