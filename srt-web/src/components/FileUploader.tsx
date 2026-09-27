"use client";

import { useState, useCallback } from "react";
import { UploadCloud, File } from "lucide-react";

interface FileUploaderProps {
  onUpload: (file: File) => void;
  accept?: string;
  title?: string;
}

export default function FileUploader({ 
  onUpload, 
  accept = ".exe,.bin,.rom,.cap", 
  title = "Drag & Drop your file here" 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  }, [onUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative w-full p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
        isDragging 
          ? "border-srt-accent bg-srt-accent/10 scale-[1.02] shadow-[0_0_20px_rgba(0,191,166,0.2)]" 
          : "border-srt-hover bg-srt-card hover:border-srt-accent/50 hover:bg-srt-panel"
      }`}
    >
      <div className={`p-4 rounded-full ${isDragging ? 'bg-srt-accent text-srt-bg' : 'bg-srt-bg text-srt-accent'} transition-colors`}>
        <UploadCloud size={32} strokeWidth={2} />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-srt-text mb-1">{title}</h3>
        <p className="text-sm text-srt-muted">Supports: {accept}</p>
      </div>
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept={accept} 
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        title=""
      />
    </div>
  );
}