"use client";

import { useState } from "react";
import { HardDrive, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import FileUploader from "./FileUploader";

interface OldBackupSectionProps {
  onBackupSelect: (file: File | null) => void;
  title?: string;
  description?: string;
}

export default function OldBackupSection({ 
  onBackupSelect, 
  title = "Old Backup Dump (Optional)", 
  description = "Upload the corrupted motherboard dump." 
}: OldBackupSectionProps) {
  
  const [backupFile, setBackupFile] = useState<File | null>(null);

  const handleUpload = (file: File) => {
    setBackupFile(file);
    onBackupSelect(file);
  };

  const handleRemove = () => {
    setBackupFile(null);
    onBackupSelect(null);
  };

  return (
    <div className="bg-srt-card/30 border border-srt-hover rounded-xl p-5 w-full transition-all">
      <div className="flex items-center gap-3 mb-4 border-b border-srt-hover pb-3">
        <HardDrive size={20} className="text-srt-muted" />
        <div>
          <h3 className="text-sm font-bold text-srt-text">{title}</h3>
          <p className="text-xs text-srt-muted mt-0.5">{description}</p>
        </div>
      </div>

      {!backupFile ? (
        <div className="animate-fade-in">
          <FileUploader 
            onUpload={handleUpload} 
            accept=".bin,.rom" 
            title="Drop Old Backup .bin file here" 
          />
          <div className="flex items-center gap-2 mt-3 text-xs text-[#feca57] bg-[#feca57]/10 p-2 rounded-lg border border-[#feca57]/20">
            <AlertCircle size={14} />
            <span>Keep a safe copy of the original dump before processing.</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-srt-bg border border-srt-accent/50 rounded-lg p-4 shadow-[0_0_15px_rgba(0,191,166,0.1)] animate-fade-in">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="text-srt-accent bg-srt-accent/10 p-2 rounded-full flex-shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="font-mono text-sm font-semibold text-srt-text mb-2 truncate" title={backupFile.name}>
                {backupFile.name}
              </p>
              
              {/* SIZE CALCULATOR FOR OLD BACKUP */}
              <div className="flex items-center gap-2 text-[11px] font-mono flex-wrap">
                <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">
                  {(backupFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <span className="text-srt-muted">•</span>
                <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">
                  {(backupFile.size / 1024).toFixed(2)} KB
                </span>
                <span className="text-srt-muted">•</span>
                <span className="bg-[#00bfa6]/10 text-[#00bfa6] border border-[#00bfa6]/30 px-1.5 py-0.5 rounded font-bold">
                  Hex: 0x{backupFile.size.toString(16).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleRemove}
            className="p-2 text-srt-muted hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 rounded-lg transition-all ml-2 flex-shrink-0"
            title="Remove File"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}