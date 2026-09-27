"use client";

import { useState } from "react";
import { Unlock, Laptop, Key, ShieldCheck, Cpu, Terminal, AlertCircle, ChevronLeft } from "lucide-react";
import FileUploader from "./FileUploader";
import ToolWorkspace from "./ToolWorkspace";
import SelectBiosSection, { BiosFileOption } from "./SelectBiosSection";

export default function UnlockBiosView({ onBack }: { onBack: () => void }) {
  // Method Selection State
  const [activeMethod, setActiveMethod] = useState<any>(null);
  
  // File & Processing States
  const [targetBios, setTargetBios] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedBinary, setSelectedBinary] = useState<string | null>(null);

  // Define Unlock Methods (Cards)
  const unlockMethods = [
    { 
      id: "dell_8fc8", 
      title: "Dell 8FC8 Master", 
      desc: "Unlock Dell 8FC8 suffix by generating master password or direct patching.", 
      icon: Key 
    },
    { 
      id: "hp_unlock", 
      title: "HP Generic Unlock", 
      desc: "Standard password remover for older HP ProBook & EliteBook models.", 
      icon: ShieldCheck 
    },
    { 
      id: "hp_g8", 
      title: "HP G8 / G9 / G10", 
      desc: "Advanced 0xFF patcher for latest HP G8, G9, and G10 architectures.", 
      icon: Cpu 
    },
    { 
      id: "lenovo_tp", 
      title: "ThinkPad Patcher", 
      desc: "Bypass Lenovo ThinkPad supervisor password (DXE injection).", 
      icon: Laptop 
    }
  ];

  // Result File
  const resultFiles: BiosFileOption[] = [
    {
      name: targetBios ? `UNLOCKED_${targetBios.name}` : "UNLOCKED_BIOS.bin",
      bytes: targetBios ? targetBios.size : 8388608,
      type: "Unlocked BIOS"
    },
  ];

  const handleMethodSelect = (method: any) => {
    setActiveMethod(method);
    setTargetBios(null);
    setIsProcessed(false);
    setLogs([]);
  };

  const startUnlocking = () => {
    setIsProcessing(true);
    setIsProcessed(false);
    setSelectedBinary(null);

    // Dynamic Logs based on selected method
    let methodSpecificLogs: string[] = [];
    
    if (activeMethod.id === "dell_8fc8") {
      methodSpecificLogs = [
        "Analyzing Dell 8FC8 BIOS structure...",
        "Extracting Service Tag & System Number...",
        "Calculating Master Admin Hash...",
        "Patching security sector in Hex block..."
      ];
    } else if (activeMethod.id === "hp_g8") {
      methodSpecificLogs = [
        "Detecting HP G8/G9/G10 Signature...",
        "Locating EC and Main Password DXE Drivers...",
        "Filling secure offset ranges with 0xFF...",
        "Rebuilding BIOS hierarchy..."
      ];
    } else if (activeMethod.id === "lenovo_tp") {
      methodSpecificLogs = [
        "Scanning for Lenovo ThinkPad DXE modules...",
        "Locating Supervisor Password Jump Logic...",
        "Patching JNE/JE assembly instructions...",
        "Bypassing TPM security checks..."
      ];
    } else {
      methodSpecificLogs = [
        "Scanning standard HP ROM structure...",
        "Locating password hash blocks...",
        "Removing password entries...",
      ];
    }

    const steps = [
      `Initializing SRT ${activeMethod.title} Engine...`,
      `Loading Target Firmware: ${targetBios?.name}`,
      ...methodSpecificLogs,
      "Recalculating BIOS Checksums...",
      "Unlocking Process Complete! Ready to flash."
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

  // ==========================================
  // VIEW 1: METHOD SELECTION (GRID)
  // ==========================================
  if (!activeMethod) {
    return (
      <div className="bg-srt-bg border border-srt-hover rounded-xl shadow-lg p-6 animate-fade-in w-full max-w-6xl mx-auto mt-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-srt-hover">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-srt-card rounded-lg text-srt-accent border border-srt-hover">
              <Unlock size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-srt-text drop-shadow-[0_0_5px_rgba(0,191,166,0.3)]">
                Master BIOS Unlocker
              </h2>
              <p className="text-sm text-srt-muted">Select the manufacturer and unlock method for the target motherboard.</p>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="text-srt-muted hover:text-[#ff6b6b] text-sm flex items-center gap-1 transition-all bg-srt-card px-3 py-1.5 rounded-lg border border-srt-hover"
          >
            <ChevronLeft size={16}/> Back to Dashboard
          </button>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {unlockMethods.map((method) => (
            <div 
              key={method.id} 
              onClick={() => handleMethodSelect(method)}
              className="bg-srt-card/50 border border-srt-hover rounded-xl p-6 cursor-pointer hover:bg-srt-card hover:border-srt-accent hover:shadow-[0_0_20px_rgba(0,191,166,0.15)] transition-all group flex flex-col items-center text-center gap-4"
            >
              <div className="p-4 rounded-full bg-[#0a0a0a] border border-srt-hover group-hover:border-srt-accent group-hover:text-srt-accent transition-all">
                <method.icon size={32} />
              </div>
              <div>
                <h3 className="font-bold text-srt-text mb-2 group-hover:text-srt-accent transition-colors">{method.title}</h3>
                <p className="text-xs text-srt-muted leading-relaxed">{method.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: WORKSPACE (Using Master Component)
  // ==========================================
  return (
    <div className="animate-fade-in">
      <ToolWorkspace
        title={`Unlock: ${activeMethod.title}`}
        description={activeMethod.desc}
        icon={activeMethod.icon}
        onBack={() => setActiveMethod(null)} // Go back to Method Selection
        
        // LEFT SIDE: UPLOADER
        leftInputs={
          <div className="bg-srt-card/30 border border-srt-hover rounded-xl p-5 w-full">
            <h3 className="text-sm font-bold text-srt-text mb-4 border-b border-srt-hover pb-3">Target Locked BIOS</h3>
            {!targetBios ? (
              <FileUploader onUpload={setTargetBios} accept=".bin,.rom" title={`Upload Locked ${activeMethod.title} BIOS`} />
            ) : (
              <div className="flex items-center justify-between bg-srt-bg border border-srt-accent/50 rounded-lg p-4 shadow-[0_0_15px_rgba(0,191,166,0.1)]">
                <div>
                  <p className="font-mono text-sm font-semibold text-srt-accent">{targetBios.name}</p>
                  <div className="flex items-center gap-2 text-[11px] font-mono mt-1">
                    <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">
                      {(targetBios.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <span className="text-srt-muted">•</span>
                    <span className="bg-[#00bfa6]/10 text-[#00bfa6] border border-[#00bfa6]/30 px-1.5 py-0.5 rounded font-bold">
                      Hex: 0x{targetBios.size.toString(16).toUpperCase()}
                    </span>
                  </div>
                </div>
                <button onClick={() => {setTargetBios(null); setIsProcessed(false);}} className="text-xs text-[#ff6b6b] hover:underline bg-[#ff6b6b]/10 px-3 py-1.5 rounded">Remove</button>
              </div>
            )}
          </div>
        }

        // LEFT SIDE: ACTION BUTTON
        actionButton={
          <button
            onClick={startUnlocking}
            disabled={!targetBios || isProcessing}
            className="w-full bg-srt-accent text-srt-bg px-6 py-3.5 rounded-xl font-bold hover:bg-[#009e89] transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-2 shadow-[0_4px_14px_rgba(0,191,166,0.3)] hover:shadow-[0_6px_20px_rgba(0,191,166,0.5)]"
          >
            {isProcessing ? (
              <span className="animate-pulse flex items-center gap-2"><Terminal size={18}/> Unlocking BIOS...</span>
            ) : (
              "Generate Unlocked Dump"
            )}
          </button>
        }

        // RIGHT SIDE: TERMINAL & RESULT
        rightOutput={
          <div className="flex flex-col gap-6 h-full">
            {(isProcessing || isProcessed) && (
              <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-4 font-mono text-sm shadow-[0_0_20px_rgba(0,191,166,0.1)] h-48 overflow-y-auto shrink-0">
                <div className="flex items-center gap-2 mb-2 text-srt-muted border-b border-[#333] pb-2">
                  <Terminal size={14} /> Patcher Console
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
              <div className="flex-1 animate-fade-in">
                <SelectBiosSection
                  files={resultFiles}
                  selectedFile={selectedBinary}
                  onSelect={setSelectedBinary}
                  title="Unlocked Firmware Ready"
                />
              </div>
            ) : (
              !isProcessing && (
                <div className="flex-1 border-2 border-dashed border-srt-hover rounded-xl flex flex-col items-center justify-center text-srt-muted bg-srt-card/20 p-10 min-h-[200px]">
                  <AlertCircle size={40} className="mb-4 opacity-20" />
                  <p className="text-center font-medium">Ready to Patch.</p>
                  <p className="text-center text-sm mt-1">Upload the locked dump and start the process.</p>
                </div>
              )
            )}
          </div>
        }
      />
    </div>
  );
}