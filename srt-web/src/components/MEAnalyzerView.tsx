"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // <--- Router import
import { useFileContext } from "@/context/FileContext"; // <--- Context import
import { Activity, Terminal, AlertCircle, CheckCircle2, ShieldAlert, Settings2 } from "lucide-react";
import FileUploader from "./FileUploader";
import ToolWorkspace from "./ToolWorkspace";

export default function MEAnalyzerView({ onBack }: { onBack: () => void }) {
  const [biosFile, setBiosFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [meaData, setMeaData] = useState<any[]>([]);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);
  const [backendData, setBackendData] = useState<any>(null);

  const router = useRouter();
  const { setSharedFile } = useFileContext(); // <--- Global state me file save karne ke liye

  const startAnalysis = async () => {
    if (!biosFile) return;

    setIsAnalyzing(true);
    setBackendData(null);
    setMeaData([]);
    setErrorLogs([]);

    const formData = new FormData();
    formData.append("file", biosFile);

    try {
      const response = await fetch("http://localhost:8000/api/tools/analyze-me/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setBackendData(data.file_info);
        setMeaData(data.mea_data || []);
        setErrorLogs(data.errors || []);
      } else {
        setErrorLogs([`Error: ${data.error || "Failed to analyze"}`]);
      }
    } catch (error) {
      console.error("API Error:", error);
      setErrorLogs([
        "CRITICAL ERROR: Could not connect to SRT Backend.", 
        "Make sure Django server is running on port 8000."
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getValueColor = (val: string) => {
    const v = val.toLowerCase();
    if (v === "yes" || v === "production" || v === "configured" || v.includes("valid")) return "text-[#00bfa6] bg-[#00bfa6]/10 px-2 py-0.5 rounded"; 
    if (v === "no" || v === "impossible" || v.includes("error") || v === "unconfigured") return "text-[#ff5f56] bg-[#ff5f56]/10 px-2 py-0.5 rounded"; 
    if (v.includes("pre-production") || v === "extracted" || v === "update" || v === "initialized") return "text-[#ffbd2e] bg-[#ffbd2e]/10 px-2 py-0.5 rounded"; 
    if (val.startsWith("11.") || val.startsWith("12.") || val.startsWith("13.") || val.startsWith("14.") || val.startsWith("15.") || val.startsWith("300.")) return "text-[#00d2ff] font-bold"; 
    return "text-white";
  };

  const groupedData = meaData.reduce((acc, curr) => {
    let secName = curr.section.includes(".bin") || curr.section.includes(".rom") || curr.section === "General" ? "Main Engine Firmware" : curr.section;
    if (!acc[secName]) acc[secName] = [];
    acc[secName].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  // ==========================================
  // LOGIC: Check if ME is Initialized
  // ==========================================
  const isInitialized = meaData.some(item => 
    item.key === "File System State" && item.value.toLowerCase() === "initialized"
  );

  const handleCleanRedirect = () => {
    setSharedFile(biosFile); // Global state me file save ki
    router.push("/tools/clean-csme"); // CSME tool par bhej diya
  };

  return (
    <ToolWorkspace
      title="ME Analyzer"
      description="Deep scan Intel Management Engine (ME/TXE) regions to check versions and health via SRT Backend."
      icon={Activity}
      onBack={onBack}
      
      leftInputs={
        <div className="w-full space-y-4">
          <div className="bg-srt-card/30 border border-srt-hover rounded-xl p-5 w-full">
            <h3 className="text-sm font-bold text-srt-text mb-4 border-b border-srt-hover pb-3">Target BIOS/ME Dump</h3>
            
            {!biosFile ? (
              <FileUploader onUpload={setBiosFile} accept=".bin,.rom" title="Upload BIOS Dump" />
            ) : (
              <div className="animate-fade-in flex flex-col gap-4">
                <div className="bg-srt-bg border border-srt-accent/50 rounded-lg p-4 shadow-[0_0_15px_rgba(0,191,166,0.1)]">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-mono text-sm font-bold text-srt-accent truncate pr-4">{biosFile.name}</p>
                    <button onClick={() => {setBiosFile(null); setMeaData([]); setBackendData(null); setErrorLogs([]); setSharedFile(null);}} className="text-xs text-[#ff6b6b] hover:underline bg-[#ff6b6b]/10 px-3 py-1 rounded transition-colors shrink-0">Remove</button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="bg-srt-card border border-srt-hover rounded p-2 flex flex-col justify-center">
                      <p className="text-[10px] text-srt-muted uppercase tracking-wider mb-1">Size (KB)</p>
                      <p className="text-sm text-srt-text font-bold">{(biosFile.size / 1024).toFixed(2)}</p>
                    </div>
                    <div className="bg-srt-card border border-srt-hover rounded p-2 flex flex-col justify-center">
                      <p className="text-[10px] text-srt-muted uppercase tracking-wider mb-1">Size (MB)</p>
                      <p className="text-sm text-srt-text font-bold">{(biosFile.size / (1024 * 1024)).toFixed(2)}</p>
                    </div>
                    <div className="bg-[#00bfa6]/10 border border-[#00bfa6]/30 rounded p-2 flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-srt-accent/5 animate-pulse"></div>
                      <p className="text-[10px] text-[#00bfa6] uppercase font-bold tracking-wider mb-1 relative z-10">Size (Bytes)</p>
                      <p className="text-sm text-[#00bfa6] font-bold relative z-10">{biosFile.size.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* WARNING POPUP: Agar ME Initialized hai     */}
          {/* ========================================== */}
          {isInitialized && (
            <div className="p-1 rounded-xl bg-gradient-to-r from-[#ffbd2e] to-[#ff5f56] shadow-[0_0_20px_rgba(255,189,46,0.3)] animate-fade-in">
              <div className="bg-[#0a0a0a] rounded-lg p-5 flex flex-col items-center text-center">
                <ShieldAlert size={32} className="text-[#ffbd2e] mb-3" />
                <h4 className="font-bold text-white mb-2 text-lg">CSME Region is Dirty (Initialized)</h4>
                <p className="text-xs text-srt-muted mb-5">This firmware has been booted. It is highly recommended to clean the ME region before flashing it to a new motherboard.</p>
                <button 
                  onClick={handleCleanRedirect} 
                  className="w-full py-3 bg-[#ffbd2e] hover:bg-[#e0a626] text-black font-extrabold rounded-lg transition-all flex justify-center items-center gap-2 transform hover:scale-[1.02]"
                >
                  <Settings2 size={18} /> Clean CSME Now
                </button>
              </div>
            </div>
          )}
        </div>
      }

      actionButton={
        <button 
          onClick={startAnalysis}
          disabled={!biosFile || isAnalyzing}
          className="w-full bg-srt-accent text-srt-bg px-6 py-3.5 rounded-xl font-bold hover:bg-[#009e89] transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(0,191,166,0.3)] hover:shadow-[0_6px_20px_rgba(0,191,166,0.5)]"
        >
          {isAnalyzing ? <span className="animate-pulse flex items-center gap-2"><Terminal size={18}/> Processing via Backend...</span> : "Analyze ME Region"}
        </button>
      }

      rightOutput={
        <div className="flex-1 flex flex-col bg-[#0a0a0a] border border-[#333] rounded-xl shadow-[0_0_20px_rgba(0,191,166,0.1)] overflow-hidden h-80">
          <div className="flex items-center gap-2 text-srt-muted border-b border-[#333] p-4 bg-[#111]">
            <Activity size={16} className="text-srt-accent" /> 
            <span className="font-bold text-sm tracking-wide text-white uppercase">Firmware Intelligence</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
            {isAnalyzing ? (
               <div className="flex flex-col items-center justify-center h-full text-srt-accent animate-pulse space-y-3">
                 <Terminal size={32} />
                 <p className="font-mono text-sm tracking-widest">EXTRACTING METADATA...</p>
               </div>
            ) : meaData.length > 0 ? (
               <div className="w-full">
                 <table className="w-full text-left border-collapse">
                   <tbody>
                     {(Object.entries(groupedData) as [string, any[]][]).map(([sectionName, items], sectionIndex) => (
                       <React.Fragment key={sectionIndex}>
                         <tr className="bg-[#1a1a1a] border-y border-[#333]">
                           <td colSpan={2} className="py-2.5 px-4 font-bold text-srt-accent uppercase tracking-widest text-[11px] shadow-[inset_4px_0_0_#00bfa6]">
                             {sectionName}
                           </td>
                         </tr>
                         {items.map((item, i) => (
                           <tr key={`${sectionIndex}-${i}`} className={`border-b border-[#222] font-mono text-sm hover:bg-srt-hover/20 transition-colors ${i % 2 === 0 ? 'bg-[#0a0a0a]' : 'bg-[#0f0f0f]'}`}>
                             <td className="py-2.5 px-4 text-srt-muted w-1/3 border-r border-[#222]">{item.key}</td>
                             <td className="py-2.5 px-4">
                               <span className={`${getValueColor(item.value)}`}>
                                 {item.value}
                               </span>
                             </td>
                           </tr>
                         ))}
                       </React.Fragment>
                     ))}
                   </tbody>
                 </table>
                 {errorLogs.length > 0 && (
                   <div className="p-4 bg-[#ff5f56]/10 border-t border-[#ff5f56]/30">
                     <div className="flex items-center gap-2 text-[#ff5f56] font-bold mb-2 text-sm"><ShieldAlert size={16}/> Warning / Errors</div>
                     {errorLogs.map((err, i) => <p key={i} className="text-[#ff5f56] text-xs font-mono">- {err}</p>)}
                   </div>
                 )}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-srt-muted opacity-30">
                  <AlertCircle size={40} className="mb-4" />
                  <p className="font-medium text-sm">Awaiting Binary Input</p>
               </div>
            )}
          </div>
        </div>
      }
    />
  );
}