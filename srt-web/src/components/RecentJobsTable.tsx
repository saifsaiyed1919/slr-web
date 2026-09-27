"use client";

import { useState } from "react";
import { Edit, Save, Share2, Trash2, Copy, Check, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";

export default function RecentJobsTable() {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search aur Filter ki states (Database fetch ke time ye states backend ko bheji jayengi)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const recentJobs = [
    { id: 1, brand: "Dell", model: "Latitude 5400", partNo: "EDC50 LA-H181P", status: "CSME Clean" },
    { id: 2, brand: "HP", model: "EliteBook 840 G8", partNo: "6050A3217501-MB-A01", status: "Unlock" },
    { id: 3, brand: "Lenovo", model: "ThinkPad T14", partNo: "NM-C931", status: "Build" },
    { id: 4, brand: "Acer", model: "Nitro 5", partNo: "GH51M LA-K861P", status: "Unlock" },
    { id: 5, brand: "Asus", model: "ROG Strix", partNo: "G513Q-MB", status: "CSME Clean" }
  ];

  const getStatusColor = (status: string) => {
    if (status === "Unlock") return "text-[#ff6b6b]"; 
    if (status === "Build") return "text-srt-accent"; 
    if (status === "CSME Clean") return "text-[#feca57]"; 
    return "text-srt-text";
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalPages = 3; 

  return (
    <div className="flex flex-col animate-fade-in">
      
      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-srt-card/20 border-b border-srt-hover">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-srt-muted">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search by Brand, Model, or Part No..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-srt-bg border border-srt-hover rounded-lg text-srt-text text-sm focus:outline-none focus:border-srt-accent focus:shadow-[0_0_8px_rgba(0,191,166,0.3)] transition-all placeholder:text-srt-muted/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={18} className="text-srt-muted" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-srt-bg border border-srt-hover rounded-lg px-4 py-2 text-sm text-srt-text outline-none focus:border-srt-accent focus:shadow-[0_0_8px_rgba(0,191,166,0.3)] transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Build">Build</option>
            <option value="Unlock">Unlock</option>
            <option value="CSME Clean">CSME Clean</option>
          </select>
        </div>
      </div>

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-srt-card border-b border-srt-hover text-sm text-srt-muted">
              <th className="p-4 font-semibold">Brand</th>
              <th className="p-4 font-semibold">Model</th>
              <th className="p-4 font-semibold">Part No</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-srt-hover">
            {recentJobs.map((job) => (
              <tr key={job.id} className="hover:bg-srt-panel transition-colors group">
                <td className="p-4">{job.brand}</td>
                <td className="p-4">{job.model}</td>
                <td className="p-4 text-srt-muted text-sm group/copy">
                  <div className="flex items-center gap-3">
                    <span className="font-mono">{job.partNo}</span>
                    <button 
                      onClick={() => handleCopy(job.partNo, job.id)}
                      className="opacity-0 group-hover/copy:opacity-100 transition-all text-srt-muted hover:text-srt-accent hover:drop-shadow-[0_0_8px_rgba(0,191,166,0.8)]"
                      title="Copy Part No"
                    >
                      {copiedId === job.id ? <Check size={16} className="text-[#00bfa6]" /> : <Copy size={16} />}
                    </button>
                  </div>
                </td>
                <td className={`p-4 font-semibold ${getStatusColor(job.status)}`}>{job.status}</td>
                <td className="p-4 flex items-center justify-center gap-4">
                  <button className="text-srt-muted hover:text-srt-accent hover:drop-shadow-[0_0_8px_rgba(0,191,166,0.8)] transition-all" title="Edit">
                    <Edit size={18} strokeWidth={2.5} />
                  </button>
                  <button className="text-srt-muted hover:text-[#3498db] hover:drop-shadow-[0_0_8px_rgba(52,152,219,0.8)] transition-all" title="Save">
                    <Save size={18} strokeWidth={2.5} />
                  </button>
                  <button className="text-srt-muted hover:text-[#9b59b6] hover:drop-shadow-[0_0_8px_rgba(155,89,182,0.8)] transition-all" title="Share">
                    <Share2 size={18} strokeWidth={2.5} />
                  </button>
                  <button className="text-srt-muted hover:text-[#ff6b6b] hover:drop-shadow-[0_0_8px_rgba(255,107,107,0.8)] transition-all" title="Delete">
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION SECTION */}
      <div className="flex items-center justify-between px-6 py-4 bg-srt-card/30 border-t border-srt-hover">
        <div className="text-sm text-srt-muted">
          Showing <span className="font-bold text-srt-text">1</span> to <span className="font-bold text-srt-text">5</span> of <span className="font-bold text-srt-text">14</span> jobs
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-srt-hover text-srt-muted hover:bg-srt-hover hover:text-srt-text disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg font-bold text-sm transition-all ${
                currentPage === page
                  ? "bg-srt-accent text-srt-bg drop-shadow-[0_0_8px_rgba(0,191,166,0.6)] border border-srt-accent"
                  : "border border-srt-hover text-srt-muted hover:bg-srt-hover hover:text-srt-text"
              }`}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-srt-hover text-srt-muted hover:bg-srt-hover hover:text-srt-text disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}