"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Cpu, ShieldCheck, ArrowRight, Wrench, Settings2, 
  ArrowRightLeft, Key, Unlock, Activity 
} from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [bootText, setBootText] = useState<string[]>([]);
  const [randomFeatures, setRandomFeatures] = useState<any[]>([]);
  const router = useRouter();

  // Saare 6 tools ka data (Jisme se 3 random uthayenge)
  const allFeatures = [
    { path: "/tools/build-bios", title: "Build the Bios", icon: Wrench, desc: "Advanced L3 firmware extraction and DMI injection." },
    { path: "/tools/clean-csme", title: "Clean CSME", icon: Settings2, desc: "Automated ME/TXE region extraction and clearing." },
    { path: "/tools/dmi-transfer", title: "DMI Transfer", icon: ArrowRightLeft, desc: "Seamless serial, UUID, and MAC address transfers." },
    { path: "/tools/win-key", title: "Windows Key Inject", icon: Key, desc: "Extract and inject OEM Windows MSDM keys." },
    { path: "/tools/unlock", title: "Unlock the Bios", icon: Unlock, desc: "Bypass Dell 8FC8, patch HP G8/G9, and Lenovo passwords." },
    { path: "/tools/me-analyzer", title: "ME Analyzer", icon: Activity, desc: "Deep scan Intel Management Engine firmware health." },
  ];

  useEffect(() => {
    // 1. Random 3 cards select karna
    const shuffled = [...allFeatures].sort(() => 0.5 - Math.random());
    setRandomFeatures(shuffled.slice(0, 3));

    // 2. Fake Terminal Animation (Update kiye gaye logs)
    const sequence = [
      "Loading target firmware dump...",
      "Reading 8MB SPI ROM data... [OK]",
      "Analyzing Hex structures and DMI blocks...",
      "Validating BIOS Checksums... [OK]",
      "System Ready. Awaiting Engineer Input."
    ];
    
    sequence.forEach((text, index) => {
      setTimeout(() => {
        setBootText((prev) => [...prev, text]);
      }, index * 800);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-srt-accent/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-[#005f52]/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* NAVBAR */}
      <header className="w-full px-8 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-srt-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,191,166,0.6)]">
            <Cpu size={24} className="text-[#0a0a0a]" />
          </div>
          <h1 className="font-bold text-2xl tracking-widest text-srt-text uppercase">SRT <span className="text-srt-accent">Tools</span></h1>
        </div>
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold bg-srt-card border border-srt-hover hover:border-srt-accent hover:text-srt-accent transition-all"
        >
          Go to Dashboard <ArrowRight size={18} />
        </Link>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 text-center mt-10 md:mt-0">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-srt-accent/10 border border-srt-accent/30 text-srt-accent text-sm font-semibold mb-8 animate-fade-in">
          <ShieldCheck size={16} /> L3 Engineer Exclusive Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          Master Motherboard <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bfa6] to-[#007f6e] drop-shadow-[0_0_30px_rgba(0,191,166,0.4)]">
            Firmware Engineering
          </span>
        </h1>

        <p className="text-lg md:text-xl text-srt-muted max-w-2xl mb-12">
          The ultimate suite for BIOS building, CSME cleaning, DMI data transfer, and hardware unlocking. Designed specifically for professional chip-level repair technicians.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link 
            href="/dashboard"
            className="px-8 py-4 rounded-xl bg-srt-accent text-[#0a0a0a] font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#009e89] hover:shadow-[0_0_30px_rgba(0,191,166,0.6)] transition-all transform hover:-translate-y-1"
          >
            Launch Workspace <ArrowRight size={20} />
          </Link>
          <a 
            href="#features"
            className="px-8 py-4 rounded-xl bg-srt-card border border-srt-hover text-srt-text font-bold text-lg flex items-center justify-center gap-3 hover:bg-srt-hover transition-all"
          >
            Explore Tools
          </a>
        </div>

        {/* FAKE TERMINAL ANIMATION */}
        <div className="w-full max-w-3xl bg-[#0a0a0a] border border-[#222] rounded-xl shadow-2xl overflow-hidden text-left mb-20 animate-fade-in hidden md:block">
          <div className="bg-[#111] px-4 py-3 flex items-center gap-2 border-b border-[#222]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <span className="ml-2 text-xs font-mono text-srt-muted">srt_firmware_analysis.bin</span>
          </div>
          <div className="p-6 font-mono text-sm text-[#00bfa6] space-y-2 h-48">
            {bootText.map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-srt-muted select-none">{`>`}</span>
                <span>{text}</span>
              </div>
            ))}
            <div className="animate-pulse flex items-center gap-3">
              <span className="text-srt-muted select-none">{`>`}</span>
              <span className="w-2 h-4 bg-[#00bfa6]"></span>
            </div>
          </div>
        </div>

      </main>

      {/* DYNAMIC CLICKABLE FEATURES FOOTER */}
      <div id="features" className="w-full bg-[#0a0a0a] border-t border-srt-hover py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-srt-muted text-sm font-bold tracking-widest uppercase mb-8">Featured Utilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {randomFeatures.length > 0 ? (
              randomFeatures.map((feature, idx) => (
                <div 
                  key={idx}
                  onClick={() => router.push(feature.path)}
                  className="flex flex-col gap-3 p-6 rounded-2xl bg-srt-card/30 border border-srt-hover cursor-pointer group hover:bg-srt-card/50 hover:border-srt-accent/50 hover:shadow-[0_0_30px_rgba(0,191,166,0.1)] transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-12 h-12 bg-srt-accent/10 rounded-lg flex items-center justify-center text-srt-accent mb-2 group-hover:scale-110 group-hover:bg-srt-accent/20 transition-all duration-300">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-srt-accent transition-colors">{feature.title}</h3>
                  <p className="text-sm text-srt-muted">{feature.desc}</p>
                </div>
              ))
            ) : (
              <>
                <div className="h-40 rounded-2xl bg-srt-card/20 border border-srt-hover animate-pulse"></div>
                <div className="h-40 rounded-2xl bg-srt-card/20 border border-srt-hover animate-pulse"></div>
                <div className="h-40 rounded-2xl bg-srt-card/20 border border-srt-hover animate-pulse"></div>
              </>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}