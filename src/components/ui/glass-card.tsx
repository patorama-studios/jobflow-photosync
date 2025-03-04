
import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  style?: CSSProperties;
}

export function GlassCard({ children, className, hoverEffect = false, style }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300", 
        hoverEffect && "hover:shadow-xl hover:translate-y-[-4px]",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
