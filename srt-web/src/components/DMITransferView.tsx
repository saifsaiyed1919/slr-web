"use client";

import { useState } from "react";
import { 
  ArrowRightLeft, Terminal, LayoutGrid, AlertCircle, Server, Wrench, Fingerprint 
} from "lucide-react";

import FileUploader from "./FileUploader";
import OldBackupSection from "./OldBackupSection";
import SelectBiosSection, { BiosFileOption } from "./SelectBiosSection";

export default function DMITransferView() {
  // Input States
  const [oldDump, setOldDump] = useState<File | null>(null);
  const [cleanDump, setCleanDump] = useState<File | null>(null);
  
  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedBinary, setSelectedBinary] = useState<string | null>(null);

  // Result File (Processing ke baad jo aayega)
  const resultFiles: BiosFileOption[] = [
    { 
      name: cleanDump ? `DMI_INJECTED_${cleanDump.name}` : "DMI_INJECTED_BIOS.bin", 
      bytes: cleanDump ? cleanDump.size : 8388608, 
      type: "BIOS with DMI" 
    },
  ];

  const handleStartTransfer = () => {
    setIsProcessing(true);
    setIsProcessed(false);
    setSelectedBinary(null);
    simulateTransfer();
  };

  const simulateTransfer = () => {
    const steps = [
      "Initializing SRT DMI Transfer Engine...",
      `Scanning Old Dump: ${oldDump?.name}...`,
      "Locating DMI Block (Offsets 0x00...)... [Found]",
      "Extracting System Serial Number, UUID & MAC Address...",
      "Extracting Windows License Key (MSDM Table)...",
      `Analyzing Clean Target BIOS: ${cleanDump?.name}...`,
      "Injecting DMI Data into Target Binary...",
      "Recalculating Checksums...",
      "DMI Transfer Complete! Ready for programming."
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
            <ArrowRightLeft size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-srt-text drop-shadow-[0_0_5px_rgba(0,191,166,0.3)]">
              DMI Data Transfer
            </h2>
            <p className="text-sm text-srt-muted">Copy Serial Number, UUID, MAC, and Windows Key from old dump to clean BIOS.</p>
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
          
          {/* Component 1: Old Dump (Source) */}
          <OldBackupSection 
            onBackupSelect={setOldDump} 
            title="Old Backup Dump (Source)"
            description="Dump containing original DMI data & Win Key."
          />

          {/* Component 2: Clean BIOS (Target) */}
          <div className="bg-srt-card/30 border border-srt-hover rounded-xl p-5 w-full">
            <h3 className="text-sm font-bold text-srt-text mb-4 border-b border-srt-hover pb-3 flex items-center gap-2">
              <Fingerprint size={18} className="text-srt-muted"/>
              Clean Target BIOS (Destination)
            </h3>
            {!cleanDump ? (
              <FileUploader 
                onUpload={setCleanDump} 
                accept=".bin,.rom" 
                title="Upload Clean target .bin" 
              />
            ) : (
              <div className="flex items-center justify-between bg-srt-bg border border-srt-accent/50 rounded-lg p-4 shadow-[0_0_15px_rgba(0,191,166,0.1)]">
                <div>
                  <p className="font-mono text-sm font-semibold text-srt-accent mb-1">{cleanDump.name}</p>
                  
                  {/* Size Calculator */}
                  <div className="flex items-center gap-2 text-[11px] font-mono mt-2">
                    <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">
                      {(cleanDump.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <span className="text-srt-muted">•</span>
                    <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">
                      {(cleanDump.size / 1024).toFixed(2)} KB
                    </span>
                    <span className="text-srt-muted">•</span>
                    <span className="bg-[#00bfa6]/10 text-[#00bfa6] border border-[#00bfa6]/30 px-1.5 py-0.5 rounded font-bold">
                      Hex: 0x{cleanDump.size.toString(16).toUpperCase()}
                    </span>
                  </div>
                </div>
                <button onClick={() => setCleanDump(null)} className="text-xs text-[#ff6b6b] hover:underline bg-[#ff6b6b]/10 px-3 py-1.5 rounded transition-all">Remove</button>
              </div>
            )}
          </div>

          <button 
            onClick={handleStartTransfer}
            disabled={!oldDump || !cleanDump || isProcessing}
            className="w-full bg-srt-accent text-srt-bg px-6 py-3.5 rounded-xl font-bold hover:bg-[#009e89] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,191,166,0.5)] flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <span className="animate-pulse flex items-center gap-2"><Terminal size={18}/> Transferring Data...</span>
            ) : (
              <>Start DMI Transfer</>
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
                <Terminal size={14} /> DMI Extractor Console
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
                title="Final DMI Injected Firmware"
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
                <p className="text-center font-medium">Ready for DMI Transfer.</p>
                <p className="text-center text-sm mt-1">Upload the Old Dump and Clean BIOS on the left,<br/>then start the transfer process.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}