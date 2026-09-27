"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Unlock, Database, Wrench, Settings2, ArrowRightLeft, Key, Activity } from "lucide-react";

import StatCard from "@/components/StatCard";
import RecentJobsTable from "@/components/RecentJobsTable";       
import PendingUnlocksTable from "@/components/PendingUnlocksTable"; 
import ActionCard from "@/components/ActionCard";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");
  const router = useRouter(); // NEXT.JS ROUTER INSTEAD OF STATE!

  const stats = [
    { title: "Bios Builds", value: "1,240", trend: "+12% this month", icon: Cpu },
    { title: "Bios Unlocking", value: "14", trend: "+3 today", icon: Unlock },
    { title: "Total Bios", value: "1,254", trend: "All time", icon: Database },
  ];

  const buildOptions = [
    { path: "/tools/build-bios", title: "Build the new Bios", icon: Wrench },
    { path: "/tools/clean-csme", title: "Clean CSME", icon: Settings2 },
    { path: "/tools/dmi-transfer", title: "DMI Transfer", icon: ArrowRightLeft },
    { path: "/tools/win-key", title: "Windows Key Inject", icon: Key },
    { path: "/tools/unlock", title: "Unlock the Bios", icon: Unlock },
    { path: "/tools/me-analyzer", title: "ME Analyzer", icon: Activity },
  ];

  const handleToolSelect = (path: string) => {
    setIsModalOpen(false);
    router.push(path); // Sidha naye URL par bhej dega!
  };

  return (
    <div className="space-y-10 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-srt-text mb-2 drop-shadow-[0_0_8px_rgba(0,191,166,0.3)]">Dashboard</h1>
          <p className="text-srt-muted">SRT Firmware Tool Suite Overview</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-srt-accent text-srt-bg px-5 py-2.5 rounded-lg font-bold hover:bg-[#009e89] transition-all hover:shadow-[0_0_15px_rgba(0,191,166,0.5)] flex items-center gap-2"
        >
          <Wrench size={18} /> Launch Firmware Tool
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} title={stat.title} value={stat.value} trend={stat.trend} icon={stat.icon} />
        ))}
      </div>

      <div className="bg-srt-bg border border-srt-hover rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-srt-hover bg-srt-card/50 overflow-x-auto">
          <button onClick={() => setActiveTab("recent")} className={`px-6 py-4 font-bold text-sm tracking-wide transition-all border-b-2 whitespace-nowrap ${activeTab === "recent" ? "border-srt-accent text-srt-accent bg-srt-hover/30" : "border-transparent text-srt-muted hover:text-srt-text"}`}>Recent Jobs</button>
          <button onClick={() => setActiveTab("pending")} className={`px-6 py-4 font-bold text-sm tracking-wide transition-all border-b-2 whitespace-nowrap ${activeTab === "pending" ? "border-srt-accent text-srt-accent bg-srt-hover/30" : "border-transparent text-srt-muted hover:text-srt-text"}`}>Pending Unlocks</button>
        </div>
        <div className="p-0 overflow-x-auto">
          {activeTab === "recent" && <RecentJobsTable />}
          {activeTab === "pending" && <PendingUnlocksTable />}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-srt-bg border border-srt-accent rounded-xl p-8 shadow-[0_0_40px_rgba(0,191,166,0.2)] max-w-3xl w-full mx-4 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-srt-accent/10 blur-[60px] pointer-events-none"></div>
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-srt-text">Select Operation</h2>
                <p className="text-srt-muted text-sm mt-1">Choose a firmware tool to execute</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-srt-card border border-srt-hover text-srt-muted hover:text-[#ff6b6b] transition-all">✕</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
              {buildOptions.map((opt, idx) => (
                <ActionCard key={idx} title={opt.title} icon={opt.icon} onClick={() => handleToolSelect(opt.path)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}