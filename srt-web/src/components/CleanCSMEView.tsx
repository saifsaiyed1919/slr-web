"use client";

import { useState } from "react";
import { 
  Settings2, Terminal, LayoutGrid, AlertCircle, Server, Wrench, ShieldCheck 
} from "lucide-react";

import FileUploader from "./FileUploader";
import OldBackupSection from "./OldBackupSection";
import SelectBiosSection, { BiosFileOption } from "./SelectBiosSection";

export default function CleanCSMEView() {
  // Input States
  const [dirtyDump, setDirtyDump] = useState<File | null>(null);
  const [cleanMeFile, setCleanMeFile] = useState<File | null>(null);
  
  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedBinary, setSelectedBinary] = useState<string | null>(null);

  // Result File (Processing ke baad jo aayega)
  const resultFiles: BiosFileOption[] = [
    { 
      name: dirtyDump ? `CLEANED_${dirtyDump.name}` : "CLEANED_BIOS.bin", 
      bytes: dirtyDump ? dirtyDump.size : 8388608, 
      type: "Clean ME BIOS" 
    },
  ];

  const handleStartCleaning = () => {
    setIsProcessing(true);
    setIsProcessed(false);
    setSelectedBinary(null);
    simulateCleaning();
  };

  const simulateCleaning = () => {
    const steps = [
      "Initializing SRT Intel CSME Cleaner Engine...",
      `Analyzing Dirty Dump: ${dirtyDump?.name}`,
      "Locating ME/TXE/SPS Firmware Region [Found]",
      `Verifying Clean ME File: ${cleanMeFile?.name}`,
      "Extracting OEM specific data (GbE, Flash Image Tool settings)...",
      "Injecting Clean CSME Region...",
      "Fixing Checksums and rebuilding Flash Descriptor...",
      "Cleaning Complete! Image ready for flashing."
    ];

    setLogs([]);
    steps.forEach((text, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, text]);
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsProcessing(false);
            setIsProcessed(true);
          }, 800);
        }
      }, index * 600); 
    });
  };

  return (
    <div className="bg-srt-bg border border-srt-hover rounded-xl shadow-lg p-6 animate-fade-in w-full max-w-6xl mx-auto mt-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-srt-hover">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-srt-card rounded-lg text-srt-accent border border-srt-hover">
            <Settings2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-srt-text drop-shadow-[0_0_5px_rgba(0,191,166,0.3)]">
              Clean CSME Data
            </h2>
            <p className="text-sm text-srt-muted">Clear Intel ME/TXE regions and fix delayed display/fan speed issues.</p>
          </div>
        </div>
      </div>

      {/* WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        
        {/* LEFT COLUMN: UPLOADERS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-srt-text font-bold mb-2">
            <LayoutGrid size={18} className="text-srt-accent"/> Input Files
          </div>
          
          {/* Component 1: Dirty Dump (Reusing OldBackupSection) */}
          <OldBackupSection 
            onBackupSelect={setDirtyDump} 
            title="1. Dirty BIOS Dump"
            description="Upload motherboard dump with corrupted ME."
          />

          {/* Component 2: Clean ME File */}
          <div className="bg-srt-card/30 border border-srt-hover rounded-xl p-5 w-full">
            <h3 className="text-sm font-bold text-srt-text mb-4 border-b border-srt-hover pb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-srt-muted"/>
              2. Clean ME / CSME Region
            </h3>
            {!cleanMeFile ? (
              <FileUploader 
                onUpload={setCleanMeFile} 
                accept=".bin,.rom,.me" 
                title="Upload Clean ME .bin" 
              />
            ) : (
              <div className="flex items-center justify-between bg-srt-bg border border-srt-accent/50 rounded-lg p-4 shadow-[0_0_15px_rgba(0,191,166,0.1)]">
                <div>
                  <p className="font-mono text-sm font-semibold text-srt-accent mb-1">{cleanMeFile.name}</p>
                  
                  {/* Size Calculator */}
                  <div className="flex items-center gap-2 text-[11px] font-mono mt-2">
                    <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">
                      {(cleanMeFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <span className="text-srt-muted">•</span>
                    <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">
                      {(cleanMeFile.size / 1024).toFixed(2)} KB
                    </span>
                    <span className="text-srt-muted">•</span>
                    <span className="bg-[#00bfa6]/10 text-[#00bfa6] border border-[#00bfa6]/30 px-1.5 py-0.5 rounded font-bold">
                      Hex: 0x{cleanMeFile.size.toString(16).toUpperCase()}
                    </span>
                  </div>
                </div>
                <button onClick={() => setCleanMeFile(null)} className="text-xs text-[#ff6b6b] hover:underline bg-[#ff6b6b]/10 px-3 py-1.5 rounded transition-all">Remove</button>
              </div>
            )}
          </div>

          <button 
            onClick={handleStartCleaning}
            disabled={!dirtyDump || !cleanMeFile || isProcessing}
            className="w-full bg-srt-accent text-srt-bg px-6 py-3.5 rounded-xl font-bold hover:bg-[#009e89] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,191,166,0.5)] flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <span className="animate-pulse flex items-center gap-2"><Terminal size={18}/> Cleaning ME Region...</span>
            ) : (
              <>Analyze & Clean CSME</>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: RESULTS & TERMINAL */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-srt-text font-bold mb-2">
            <Server size={18} className="text-srt-accent"/> Processing & Output
          </div>

          {(isProcessing || isProcessed) && (
            <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-4 font-mono text-sm shadow-[0_0_20px_rgba(0,191,166,0.1)] h-48 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2 text-srt-muted border-b border-[#333] pb-2">
                <Terminal size={14} /> ME Analyzer / Console
              </div>
              <div className="space-y-1 text-[#00bfa6]">
                {logs.map((log, i) => (
                  <div key={i}><span className="text-srt-muted mr-2">{`>`}</span>{log}</div>
                ))}
                {isProcessing && <div className="animate-pulse">_</div>}
              </div>
            </div>
          )}

          {isProcessed ? (
            <div className="flex-1 flex flex-col gap-4 animate-fade-in">
              <SelectBiosSection 
                files={resultFiles}
                selectedFile={selectedBinary}
                onSelect={setSelectedBinary}
                title="Final Cleaned Firmware"
              />
              
              <div className="flex justify-end mt-2">
                <button 
                  disabled={!selectedBinary}
                  className="flex items-center gap-2 bg-srt-accent text-srt-bg px-8 py-3 rounded-lg font-bold hover:bg-[#009e89] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,191,166,0.5)]"
                >
                  <Wrench size={18} /> Save Final Bios
                </button>
              </div>
            </div>
          ) : (
            !isProcessing && (
              <div className="flex-1 border-2 border-dashed border-srt-hover rounded-xl flex flex-col items-center justify-center text-srt-muted bg-srt-card/20 p-10">
                <AlertCircle size={40} className="mb-4 opacity-20" />
                <p className="text-center font-medium">Ready to clean CSME.</p>
                <p className="text-center text-sm mt-1">Upload the dirty dump and clean ME file on the left,<br/>then start processing.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}