"use client";

import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function ActionCard({ title, icon: Icon, onClick }: ActionCardProps) {
  return (
    <button 
      onClick={onClick}
      className="group relative bg-srt-card border border-srt-hover hover:border-srt-accent rounded-xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,191,166,0.15)] hover:-translate-y-1 w-full overflow-hidden"
    >
      {/* Top Gradient Accent Line (Sirf hover par dikhegi) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-srt-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Icon Wrapper with Glow */}
      <div className="p-4 bg-srt-bg border border-srt-hover rounded-full text-srt-muted group-hover:text-srt-accent group-hover:border-srt-accent/50 group-hover:drop-shadow-[0_0_12px_rgba(0,191,166,0.8)] transition-all duration-300">
        <Icon size={28} strokeWidth={2} />
      </div>

      {/* Tool Title */}
      <h3 className="text-sm font-bold text-srt-text group-hover:text-srt-accent transition-colors text-center tracking-wide">
        {title}
      </h3>
    </button>
  );
}