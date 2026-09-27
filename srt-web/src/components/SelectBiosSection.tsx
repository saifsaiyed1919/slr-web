"use client";

import { FileArchive, CheckSquare, Square, FileText } from "lucide-react";

export interface BiosFileOption {
  name: string;
  bytes: number; // Ab yahan raw bytes aayenge
  type: string;
}

interface SelectBiosSectionProps {
  files: BiosFileOption[];
  selectedFile: string | null;
  onSelect: (fileName: string) => void;
  title?: string;
}

export default function SelectBiosSection({ 
  files, 
  selectedFile, 
  onSelect,
  title = "Extracted Bios Files" 
}: SelectBiosSectionProps) {

  if (!files || files.length === 0) {
    return (
      <div className="p-5 border border-[#ff6b6b] bg-[#ff6b6b]/10 text-[#ff6b6b] rounded-xl text-sm font-semibold">
        Error: No extracted files received!
      </div>
    );
  }

  return (
    <div className="w-full border border-srt-hover rounded-xl overflow-hidden shadow-lg animate-fade-in bg-srt-bg relative">
      
      <div className="bg-srt-card/80 border-b border-srt-hover px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-srt-text font-bold text-sm">
          <FileArchive size={18} className="text-srt-accent" />
          {title}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-srt-muted bg-srt-bg px-2 py-1 rounded border border-srt-hover font-mono">
          <FileText size={14} />
          {files.length} Files
        </div>
      </div>

      <div className="p-5 bg-[#0a0a0a]/50 space-y-3">
        {files.map((file, idx) => {
          const isSelected = selectedFile === file.name;
          
          // Size Calculations
          const mbSize = (file.bytes / (1024 * 1024)).toFixed(2);
          const kbSize = (file.bytes / 1024).toFixed(2);
          const hexSize = file.bytes.toString(16).toUpperCase();

          return (
            <div 
              key={idx}
              onClick={() => onSelect(file.name)}
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? "bg-srt-accent/10 border-srt-accent shadow-[0_0_15px_rgba(0,191,166,0.15)]" 
                  : "bg-srt-card border-srt-hover hover:border-srt-accent/50 hover:bg-srt-hover/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`transition-colors ${isSelected ? "text-srt-accent" : "text-srt-muted"}`}>
                  {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                </div>
                <div>
                  <p className={`font-mono text-sm font-semibold tracking-wide ${isSelected ? "text-srt-accent" : "text-srt-text"}`}>
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase text-srt-bg bg-srt-muted px-1.5 py-0.5 rounded font-bold tracking-wider">
                      {file.type}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Premium Size Calculator Tags for Extracted Files */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">{mbSize} MB</span>
                  <span className="text-srt-muted/50">•</span>
                  <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">{kbSize} KB</span>
                </div>
                <span className="bg-[#00bfa6]/10 text-[#00bfa6] border border-[#00bfa6]/30 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                  Hex: 0x{hexSize}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      
    </div>
  );
}