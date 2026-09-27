import { LucideIcon } from "lucide-react";

// TypeScript props define kar rahe hain taaki error na aaye
interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
}

export default function StatCard({ title, value, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="relative group bg-srt-card border border-srt-hover hover:border-srt-accent rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,191,166,0.15)] hover:-translate-y-1 overflow-hidden">
      
      {/* Top Gradient Accent Line (Sirf hover par dikhegi) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-srt-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="flex justify-between items-start mb-4">
        {/* Title Tag */}
        <div className="border border-srt-hover bg-srt-bg/50 rounded-md px-3 py-1.5 w-max shadow-inner">
          <span className="text-srt-muted text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        
        {/* Icon with Glow */}
        <div className="p-2.5 bg-srt-bg border border-srt-hover rounded-lg text-srt-muted group-hover:text-srt-accent group-hover:border-srt-accent/50 group-hover:drop-shadow-[0_0_8px_rgba(0,191,166,0.8)] transition-all duration-300">
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex items-end gap-3 mt-4">
        {/* Main Value Number */}
        <span className="text-4xl font-bold text-srt-text group-hover:text-srt-accent transition-colors duration-300 drop-shadow-[0_0_2px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_12px_rgba(0,191,166,0.6)]">
          {value}
        </span>
        
        {/* Growth/Trend Indicator (Agar data me diya ho) */}
        {trend && (
          <span className="text-xs font-bold text-srt-accent mb-1.5 bg-srt-accent/10 px-2 py-1 rounded-md border border-srt-accent/20 tracking-wide">
            {trend}
          </span>
        )}
      </div>
      
    </div>
  );
}