"use client";

import { useEffect, useState } from "react";
import { Activity, FileBinary, CheckCircle2, Clock, Database, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      // Django API call to get MongoDB data
      const response = await fetch("http://localhost:8000/api/tools/dashboard-stats/");
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
        setError(""); // Clear any previous errors
      } else {
        setError("Failed to load database stats.");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Could not connect to SRT Backend. Is Django running?");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Jab page pehli baar load ho
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Sync Button Function
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardStats();
  };

  return (
    <div className="animate-fade-in pb-10">
      
      {/* PAGE HEADER & SYNC BUTTON */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">System Dashboard</h1>
          <p className="text-srt-muted">Overview of your firmware analysis history and database logs.</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#00bfa6]/10 text-[#00bfa6] hover:bg-[#00bfa6]/20 border border-[#00bfa6]/30 rounded-lg transition-all text-sm font-bold disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Sync Data
        </button>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#0a0a0a] border border-[#222] p-6 rounded-xl shadow-[0_4px_20px_rgba(0,191,166,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-srt-accent/5 rounded-full blur-3xl group-hover:bg-srt-accent/10 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-srt-muted text-sm font-bold uppercase tracking-wider mb-2">Total Files Processed</p>
              <h2 className="text-4xl font-extrabold text-white">
                {loading ? "..." : stats?.total_scans || 0}
              </h2>
            </div>
            <div className="p-3 bg-[#00bfa6]/10 rounded-lg text-[#00bfa6] border border-[#00bfa6]/20">
              <FileBinary size={24} />
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222] p-6 rounded-xl shadow-[0_4px_20px_rgba(0,191,166,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#27c93f]/5 rounded-full blur-3xl group-hover:bg-[#27c93f]/10 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-srt-muted text-sm font-bold uppercase tracking-wider mb-2">Successful Operations</p>
              <h2 className="text-4xl font-extrabold text-[#27c93f]">
                {loading ? "..." : stats?.success_scans || 0}
              </h2>
            </div>
            <div className="p-3 bg-[#27c93f]/10 rounded-lg text-[#27c93f] border border-[#27c93f]/20">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center border-b border-[#333] p-5 bg-[#111]">
          <div className="flex items-center gap-2 text-srt-muted">
            <Database size={18} className="text-srt-accent" />
            <span className="font-bold text-sm tracking-wide text-white uppercase">Recent ME Analyzer Logs</span>
          </div>
          {stats?.recent_logs && (
            <span className="text-xs font-mono text-srt-muted bg-[#222] px-3 py-1 rounded-full border border-[#333]">
              Showing last {stats.recent_logs.length} records
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-srt-accent animate-pulse space-y-4">
             <Database size={32} />
             <p className="font-mono text-sm tracking-widest uppercase">Fetching Database Records...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-[#ff5f56] flex flex-col items-center gap-3">
             <AlertCircle size={32} />
             <p className="font-bold">{error}</p>
          </div>
        ) : stats?.recent_logs?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#151515] border-b border-[#333] text-xs text-srt-muted uppercase tracking-widest">
                  <th className="py-4 px-6 font-bold">Target File</th>
                  <th className="py-4 px-6 font-bold">Tool Used</th>
                  <th className="py-4 px-6 font-bold">Size</th>
                  <th className="py-4 px-6 font-bold">Timestamp</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_logs.map((log: any, i: number) => (
                  <tr key={log.id} className={`border-b border-[#222] hover:bg-srt-hover/20 transition-colors ${i % 2 === 0 ? 'bg-[#0a0a0a]' : 'bg-[#0f0f0f]'}`}>
                    <td className="py-4 px-6 text-white font-mono text-sm font-semibold text-srt-accent">
                      {log.file_name} 
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-[#222] text-srt-muted px-2.5 py-1 rounded text-xs font-bold border border-[#333]">
                        {log.tool_used}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-srt-muted text-sm font-mono">
                      {log.file_size_mb} MB
                    </td>
                    <td className="py-4 px-6 text-srt-muted text-sm flex items-center gap-2">
                      <Clock size={14} className="text-srt-accent/70" /> {log.created_at}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded text-xs font-bold border ${
                        log.status === 'Success' 
                          ? 'bg-[#00bfa6]/10 text-[#00bfa6] border-[#00bfa6]/30' 
                          : 'bg-[#ffbd2e]/10 text-[#ffbd2e] border-[#ffbd2e]/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-4">
             <Activity size={40} className="text-srt-muted opacity-30" />
             <p className="text-srt-muted text-sm font-medium">No firmware logs found in the database.</p>
             <Link href="/tools/me-analyzer" className="mt-2 text-xs font-bold text-[#0a0a0a] bg-srt-accent hover:bg-[#009e89] px-5 py-2.5 rounded-lg transition-colors">
               Analyze First Dump
             </Link>
          </div>
        )}
      </div>
      
    </div>
  );
}