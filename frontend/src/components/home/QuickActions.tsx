"use client";
import { Camera, Figma, Upload, Layout } from "lucide-react";
import { useRef, useState, MouseEvent } from "react";

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const QuickActionButton = ({ icon, label, onClick }: QuickAction) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className="group cursor-pointer relative px-6 py-3 rounded-full bg-card/50 border border-border transition-all duration-200 overflow-hidden whitespace-nowrap"
    >
      {/* Cursor-following border glow - only affects the border */}
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(250px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.5), transparent 40%)`,
          maskImage:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskImage:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      <div className="relative flex items-center gap-2.5 text-muted-foreground group-hover:text-foreground transition-colors">
        {icon}
        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      </div>
    </button>
  );
};

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      icon: <Camera size={18} />,
      label: "Clone a Screenshot",
      onClick: () => console.log("Clone screenshot"),
    },
    {
      icon: <Figma size={18} />,
      label: "Import from Figma",
      onClick: () => console.log("Import from Figma"),
    },
    {
      icon: <Upload size={18} />,
      label: "Upload a Project",
      onClick: () => console.log("Upload project"),
    },
    {
      icon: <Layout size={18} />,
      label: "Landing Page",
      onClick: () => console.log("Landing page"),
    },
    {
      icon: <Layout size={18} />,
      label: "Landing Page",
      onClick: () => console.log("Landing page"),
    },
    {
      icon: <Layout size={18} />,
      label: "Landing Page",
      onClick: () => console.log("Landing page"),
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {actions.map((action, index) => (
        <QuickActionButton key={index} {...action} />
      ))}
    </div>
  );
}
