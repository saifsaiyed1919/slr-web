"use client";

import { useState } from "react";
import { Key, Terminal, AlertCircle, Search, Copy, CheckCircle2, ArrowDownCircle } from "lucide-react";
import FileUploader from "./FileUploader";
import ToolWorkspace from "./ToolWorkspace";
import SelectBiosSection, { BiosFileOption } from "./SelectBiosSection";

export default function WinKeyInjectView({ onBack }: { onBack: () => void }) {
  // Input States
  const [oldBiosFile, setOldBiosFile] = useState<File | null>(null);
  const [targetBiosFile, setTargetBiosFile] = useState<File | null>(null);
  const [winKey, setWinKey] = useState("");
  
  // Extraction States
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedKey, setExtractedKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Injection States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  
  // Shared Output States
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedBinary, setSelectedBinary] = useState<string | null>(null);

  // Result File Definition
  const resultFiles: BiosFileOption[] = [
    {
      name: targetBiosFile ? `WIN_ACTIVATED_${targetBiosFile.name}` : "WIN_ACTIVATED_BIOS.bin",
      bytes: targetBiosFile ? targetBiosFile.size : 8388608,
      type: "Activated BIOS"
    },
  ];

  // ==========================================
  // FUNCTION 1: FIND / EXTRACT KEY
  // ==========================================
  const handleExtractKey = () => {
    setIsExtracting(true);
    setExtractedKey(null);
    setIsProcessed(false);

    const steps = [
      `Initializing SRT Hex Scanner...`,
      `Reading Backup Dump: ${oldBiosFile?.name}`,
      "Searching for ACPI MSDM Table Header...",
      "Offset 0x006F2A00: MSDM Table Located [OK]",
      "Decrypting 25-digit OEM License Key..."
    ];

    setLogs([]);
    steps.forEach((text, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, text]);
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsExtracting(false);
            const foundKey = "VK7JG-NPHTM-C97JM-9MPGT-3V66T"; // Dummy Extracted Key
            setExtractedKey(foundKey);
            setLogs((prev) => [...prev, `Key Successfully Extracted: ${foundKey}`]);
          }, 800);
        }
      }, index * 500);
    });
  };

  const handleCopyKey = () => {
    if (extractedKey) {
      navigator.clipboard.writeText(extractedKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleUseKey = () => {
    if (extractedKey) {
      setWinKey(extractedKey);
    }
  };

  // ==========================================
  // FUNCTION 2: INJECT KEY
  // ==========================================
  const startInjection = () => {
    setIsProcessing(true);
    setIsProcessed(false);
    setSelectedBinary(null);

    const steps = [
      `Initializing SRT Injection Engine...`,
      `Loading Target Firmware: ${targetBiosFile?.name}`,
      "Scanning for empty/dummy ACPI MSDM block...",
      "MSDM block found and verified.",
      `Validating Key Format: ${winKey.toUpperCase()}`,
      "Writing new OEM License Key to Hex offset...",
      "Recalculating BIOS and ACPI Checksums...",
      "Windows Key Injection Complete!"
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
      }, index * 500);
    });
  };

  return (
    <ToolWorkspace
      title="Windows Key Manager"
      description="Extract OEM Windows keys from old backups and inject them into clean BIOS dumps."
      icon={Key}
      onBack={onBack}

      // ==========================================
      // LEFT SIDE: INPUTS & WORKFLOW
      // ==========================================
      leftInputs={
        <div className="space-y-6">
          
          {/* SECTION 1: EXTRACT KEY */}
          <div className="bg-srt-card/30 border border-srt-hover rounded-xl p-5 w-full">
            <h3 className="text-sm font-bold text-srt-text mb-4 border-b border-srt-hover pb-3 flex items-center gap-2">
              <Search size={16} className="text-srt-muted" />
              1. Find Key from Old Backup (Optional)
            </h3>
            
            {!oldBiosFile ? (
              <FileUploader onUpload={setOldBiosFile} accept=".bin,.rom" title="Upload Old Dump to Find Key" />
            ) : (
              <div className="animate-fade-in space-y-3">
                <div className="flex items-center justify-between bg-srt-bg border border-srt-hover rounded-lg p-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-srt-text">{oldBiosFile.name}</p>
                    <p className="text-[11px] text-srt-muted font-mono mt-1">{(oldBiosFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button onClick={() => {setOldBiosFile(null); setExtractedKey(null);}} className="text-xs text-[#ff6b6b] hover:underline px-2 py-1">Remove</button>
                </div>

                {!extractedKey ? (
                  <button 
                    onClick={handleExtractKey}
                    disabled={isExtracting || isProcessing}
                    className="w-full bg-srt-card border border-srt-accent/50 text-srt-accent px-4 py-2 rounded-lg font-bold hover:bg-srt-accent/10 transition-all disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                  >
                    {isExtracting ? <span className="animate-pulse flex items-center gap-2"><Search size={16}/> Scanning Hex...</span> : "Find Windows Key"}
                  </button>
                ) : (
                  // BEAUTIFUL EXTRACTED KEY BOX
                  <div className="bg-[#0a0a0a] border border-[#00bfa6]/30 rounded-lg p-3 flex flex-col gap-2 shadow-[0_0_15px_rgba(0,191,166,0.1)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-srt-accent font-bold uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 size={12} /> Key Found
                      </span>
                      <div className="flex gap-1.5">
                        <button onClick={handleCopyKey} className="flex items-center gap-1 text-[10px] bg-srt-card border border-srt-hover hover:bg-srt-hover px-2 py-1 rounded text-srt-text transition-all font-semibold">
                          {isCopied ? <CheckCircle2 size={12} className="text-[#00bfa6]"/> : <Copy size={12} />} {isCopied ? "Copied" : "Copy"}
                        </button>
                        <button onClick={handleUseKey} className="flex items-center gap-1 text-[10px] bg-[#00bfa6]/20 border border-[#00bfa6]/40 text-[#00bfa6] hover:bg-[#00bfa6]/30 px-2 py-1 rounded transition-all font-semibold">
                          <ArrowDownCircle size={12} /> Use this Key
                        </button>
                      </div>
                    </div>
                    <p className="font-mono text-center text-srt-text tracking-widest text-sm pt-1">{extractedKey}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 2: TARGET BIOS */}
          <div className="bg-srt-card/30 border border-srt-hover rounded-xl p-5 w-full">
            <h3 className="text-sm font-bold text-srt-text mb-4 border-b border-srt-hover pb-3">2. Target BIOS Dump</h3>
            {!targetBiosFile ? (
              <FileUploader onUpload={setTargetBiosFile} accept=".bin,.rom" title="Upload Clean BIOS" />
            ) : (
              <div className="flex items-center justify-between bg-srt-bg border border-srt-accent/50 rounded-lg p-4 shadow-[0_0_15px_rgba(0,191,166,0.1)]">
                <div>
                  <p className="font-mono text-sm font-semibold text-srt-accent">{targetBiosFile.name}</p>
                  <div className="flex items-center gap-2 text-[11px] font-mono mt-1">
                    <span className="bg-srt-hover px-1.5 py-0.5 rounded text-srt-muted">
                      {(targetBiosFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <span className="text-srt-muted">•</span>
                    <span className="bg-[#00bfa6]/10 text-[#00bfa6] border border-[#00bfa6]/30 px-1.5 py-0.5 rounded font-bold">
                      Hex: 0x{targetBiosFile.size.toString(16).toUpperCase()}
                    </span>
                  </div>
                </div>
                <button onClick={() => {setTargetBiosFile(null); setIsProcessed(false);}} className="text-xs text-[#ff6b6b] hover:underline bg-[#ff6b6b]/10 px-3 py-1.5 rounded">Remove</button>
              </div>
            )}
          </div>

          {/* SECTION 3: KEY INPUT FIELD */}
          <div className="bg-srt-card/30 border border-srt-hover rounded-xl p-5 w-full">
            <h3 className="text-sm font-bold text-srt-text mb-4 border-b border-srt-hover pb-3">3. Key to Inject</h3>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-srt-muted" size={18} />
              <input
                type="text"
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                value={winKey}
                onChange={(e) => setWinKey(e.target.value.toUpperCase())}
                maxLength={29}
                className="w-full bg-[#0a0a0a] border border-srt-hover focus:border-srt-accent text-srt-text font-mono text-sm rounded-lg py-3 pl-11 pr-4 outline-none transition-all shadow-inner uppercase tracking-wider placeholder:text-srt-muted/40"
              />
            </div>
          </div>
        </div>
      }

      // ==========================================
      // LEFT SIDE: INJECT BUTTON
      // ==========================================
      actionButton={
        <button
          onClick={startInjection}
          disabled={!targetBiosFile || winKey.length < 25 || isProcessing || isExtracting} 
          className="w-full bg-srt-accent text-srt-bg px-6 py-3.5 rounded-xl font-bold hover:bg-[#009e89] transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-2 shadow-[0_4px_14px_rgba(0,191,166,0.3)] hover:shadow-[0_6px_20px_rgba(0,191,166,0.5)]"
        >
          {isProcessing ? (
            <span className="animate-pulse flex items-center gap-2"><Terminal size={18}/> Injecting Key...</span>
          ) : (
            "Inject Windows Key"
          )}
        </button>
      }

      // ==========================================
      // RIGHT SIDE: TERMINAL & OUTPUT
      // ==========================================
      rightOutput={
        <div className="flex flex-col gap-6 h-full">
          {/* TERMINAL */}
          {(isProcessing || isProcessed || isExtracting || extractedKey) && (
            <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-4 font-mono text-sm shadow-[0_0_20px_rgba(0,191,166,0.1)] h-48 overflow-y-auto shrink-0">
              <div className="flex items-center gap-2 mb-2 text-srt-muted border-b border-[#333] pb-2">
                <Terminal size={14} /> System Console
              </div>
              <div className="space-y-1 text-[#00bfa6]">
                {logs.map((log, i) => (
                  <div key={i}><span className="text-srt-muted mr-2">{`>`}</span>{log}</div>
                ))}
                {(isProcessing || isExtracting) && <div className="animate-pulse">_</div>}
              </div>
            </div>
          )}

          {/* FINAL RESULT COMPONENT */}
          {isProcessed ? (
            <div className="flex-1 animate-fade-in">
              <SelectBiosSection
                files={resultFiles}
                selectedFile={selectedBinary}
                onSelect={setSelectedBinary}
                title="Activated Firmware Output"
              />
            </div>
          ) : (
            !(isExtracting || extractedKey) && !isProcessing && (
              <div className="flex-1 border-2 border-dashed border-srt-hover rounded-xl flex flex-col items-center justify-center text-srt-muted bg-srt-card/20 p-10 min-h-[200px]">
                <AlertCircle size={40} className="mb-4 opacity-20" />
                <p className="text-center font-medium">Ready to Analyze or Inject.</p>
                <p className="text-center text-sm mt-1">Find a key from an old dump, or directly inject one into a clean BIOS.</p>
              </div>
            )
          )}
        </div>
      }
    />
  );
}