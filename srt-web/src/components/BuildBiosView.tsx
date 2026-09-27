"use client";

import { useState, useEffect } from "react";
import { 
  Cpu, Terminal, Wrench, Laptop, Monitor, HardDrive, Box, Server, LayoutGrid, AlertCircle, Loader2 
} from "lucide-react";

import FileUploader from "./FileUploader";
import OldBackupSection from "./OldBackupSection";
import SelectBiosSection, { BiosFileOption } from "./SelectBiosSection";

export default function BuildBiosView() {
  // Ab default brand "Dell" hoga, alag se screen ki zaroorat nahi!
  const [selectedBrand, setSelectedBrand] = useState<string>("Dell");
  const [isMounted, setIsMounted] = useState(false);
  
  // File States
  const [oldBackupFile, setOldBackupFile] = useState<File | null>(null);
  const [updateFile, setUpdateFile] = useState<File | null>(null);
  
  // Extraction States
  const [isExtracting, setIsExtracting] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedBinary, setSelectedBinary] = useState<string | null>(null);

  // ==========================================
  // MEMORY LOGIC (Refresh hone par Brand yaad rakhega)
  // ==========================================
  useEffect(() => {
    setIsMounted(true);
    const savedBrand = localStorage.getItem("srt_build_brand");
    if (savedBrand) {
      setSelectedBrand(savedBrand);
    }
  }, []);

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId);
    // Jab brand change ho toh purana data clear kar do taaki mix na ho
    setOldBackupFile(null);
    setUpdateFile(null);
    setIsExtracting(false);
    setIsExtracted(false);
    setLogs([]);
    setSelectedBinary(null);
    localStorage.setItem("srt_build_brand", brandId); 
  };

  const brands = [
    { id: "Dell", title: "Dell", icon: Laptop },
    { id: "HP", title: "HP", icon: Monitor },
    { id: "Lenovo", title: "Lenovo", icon: Box },
    { id: "Asus", title: "Asus", icon: Server },
    { id: "Acer", title: "Acer", icon: HardDrive }
  ];

  const extractedFiles: BiosFileOption[] = [
    { name: `${selectedBrand}_main_8MB.bin`, bytes: 8388608, type: "Main BIOS" },
    { name: `${selectedBrand}_ec_1MB.bin`, bytes: 1048576, type: "EC Region" },
    { name: `${selectedBrand}_csme_4MB.bin`, bytes: 4194304, type: "CSME Region" },
  ];

  const handleStartExtraction = () => {
    setIsExtracting(true);
    setIsExtracted(false);
    setSelectedBinary(null);
    simulateExtraction();
  };

  const simulateExtraction = () => {
    const steps = [
      `Initializing SRT ${selectedBrand} Engine...`,
      oldBackupFile ? `Parsing Old Dump: ${oldBackupFile.name}` : `Skipping Old Dump (Standalone Mode)...`,
      oldBackupFile ? `Extracting DMI Data [OK]` : `No DMI transfer required.`,
      `Parsing Update File: ${updateFile?.name}`,
      "Decrypting PFS/Capsule...",
      "Extraction Complete."
    ];

    setLogs([]);
    steps.forEach((text, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, text]);
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsExtracting(false);
            setIsExtracted(true);
          }, 800);
        }
      }, index * 500); 
    });
  };

  if (!isMounted) {
    return (
      <div className="bg-srt-bg border border-srt-hover rounded-xl shadow-lg p-6 min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-srt-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-srt-bg border border-srt-hover rounded-xl shadow-lg p-6 animate-fade-in w-full max-w-6xl mx-auto">
      
      {/* GLOBAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-srt-hover gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-srt-card rounded-lg text-srt-accent border border-srt-hover">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-srt-text drop-shadow-[0_0_5px_rgba(0,191,166,0.3)]">
              Build The Bios
            </h2>
            <p className="text-sm text-srt-muted">Advanced L3 firmware extraction and DMI injection.</p>
          </div>
        </div>
      </div>

      {/* HORIZONTAL BRAND SELECTOR (TABS) */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-srt-muted uppercase tracking-widest mb-3 px-1">Target Manufacturer</h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {brands.map((brand) => {
            const isSelected = selectedBrand === brand.id;
            return (
              <button
                key={brand.id}
                onClick={() => handleBrandSelect(brand.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-semibold transition-all whitespace-nowrap ${
                  isSelected 
                    ? "bg-srt-accent/10 border-srt-accent text-srt-accent shadow-[0_0_15px_rgba(0,191,166,0.2)]" 
                    : "bg-srt-card/50 border-srt-hover text-srt-muted hover:border-srt-accent/50 hover:text-srt-text hover:bg-srt-hover/50"
                }`}
              >
                <brand.icon size={16} />
                {brand.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* WORKSPACE GRID VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        
        {/* LEFT COLUMN: UPLOADERS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-srt-text font-bold mb-2">
            <LayoutGrid size={18} className="text-srt-accent"/> Input Files ({selectedBrand})
          </div>
          
          <OldBackupSection 
            onBackupSelect={setOldBackupFile} 
            title="Old Backup Dump (Optional)"
            description={`Corrupted ${selectedBrand} motherboard dump.`}
          />

          <div className="bg-srt-card/30 border border-srt-hover rounded-xl p-5 w-full">
            <h3 className="text-sm font-bold text-srt-text mb-4 border-b border-srt-hover pb-3 flex items-center gap-2">
              <Wrench size={18} className="text-srt-muted"/>
              Official Update File
            </h3>
            {!updateFile ? (
              <FileUploader 
                onUpload={setUpdateFile} 
                accept=".exe,.fd,.cap,.bin" 
                title={`Upload ${selectedBrand} Update`} 
              />
            ) : (
              <div className="flex items-center justify-between bg-srt-bg border border-srt-accent/50 rounded-lg p-4 shadow-[0_0_15px_rgba(0,191,166,0.1)]">
                <div>
                  <p className="font-mono text-sm font-semibold text-srt-accent mb-1">{updateFile.name}</p>
                  <div className="flex items-center gap-2 text-[11px] font-mono mt-2">
                    <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">
                      {(updateFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <span className="text-srt-muted">•</span>
                    <span className="bg-[#00bfa6]/10 text-[#00bfa6] border border-[#00bfa6]/30 px-1.5 py-0.5 rounded font-bold">
                      Hex: 0x{updateFile.size.toString(16).toUpperCase()}
                    </span>
                  </div>
                </div>
                <button onClick={() => setUpdateFile(null)} className="text-xs text-[#ff6b6b] hover:underline bg-[#ff6b6b]/10 px-3 py-1.5 rounded transition-all">Remove</button>
              </div>
            )}
          </div>

          <button 
            onClick={handleStartExtraction}
            disabled={!updateFile || isExtracting}
            className="w-full bg-srt-accent text-srt-bg px-6 py-3.5 rounded-xl font-bold hover:bg-[#009e89] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,191,166,0.5)] flex justify-center items-center gap-2"
          >
            {isExtracting ? (
              <span className="animate-pulse flex items-center gap-2"><Terminal size={18}/> Processing...</span>
            ) : (
              <>{oldBackupFile ? `Extract & Transfer DMI` : `Extract ${selectedBrand} Files`}</>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: RESULTS & TERMINAL */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-srt-text font-bold mb-2">
            <Server size={18} className="text-srt-accent"/> Processing & Output
          </div>

          {(isExtracting || isExtracted) && (
            <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-4 font-mono text-sm shadow-[0_0_20px_rgba(0,191,166,0.1)] h-40 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2 text-srt-muted border-b border-[#333] pb-2">
                <Terminal size={14} /> Console Logs
              </div>
              <div className="space-y-1 text-[#00bfa6]">
                {logs.map((log, i) => (
                  <div key={i}><span className="text-srt-muted mr-2">{`>`}</span>{log}</div>
                ))}
                {isExtracting && <div className="animate-pulse">_</div>}
              </div>
            </div>
          )}

          {isExtracted ? (
            <div className="flex-1 flex flex-col gap-4 animate-fade-in">
              <SelectBiosSection 
                files={extractedFiles}
                selectedFile={selectedBinary}
                onSelect={setSelectedBinary}
                title={`Extracted ${selectedBrand} Binaries`}
              />
              
              <div className="flex justify-end mt-2">
                <button 
                  disabled={!selectedBinary}
                  className="flex items-center gap-2 bg-srt-accent text-srt-bg px-8 py-3 rounded-lg font-bold hover:bg-[#009e89] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,191,166,0.5)]"
                >
                  <Wrench size={18} /> Build Final Bios
                </button>
              </div>
            </div>
          ) : (
            !isExtracting && (
              <div className="flex-1 border-2 border-dashed border-srt-hover rounded-xl flex flex-col items-center justify-center text-srt-muted bg-srt-card/20 p-10">
                <AlertCircle size={40} className="mb-4 opacity-20" />
                <p className="text-center font-medium">No files processed yet.</p>
                <p className="text-center text-sm mt-1">Select <strong className="text-srt-accent">{selectedBrand}</strong> files on the left,<br/>then click the button to start processing.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}