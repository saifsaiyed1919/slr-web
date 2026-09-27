"use client";

import { ChevronLeft, LayoutGrid, Server } from "lucide-react";
import React from "react";

interface ToolWorkspaceProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onBack: () => void;
  leftInputs: React.ReactNode;
  actionButton: React.ReactNode;
  rightOutput: React.ReactNode;
}

export default function ToolWorkspace({
  title, description, icon: Icon, onBack, leftInputs, actionButton, rightOutput
}: ToolWorkspaceProps) {
  return (
    <div className="bg-srt-bg border border-srt-hover rounded-xl shadow-lg p-6 animate-fade-in w-full max-w-6xl mx-auto mt-6">
      
      {/* GLOBAL HEADER */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-srt-hover">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-srt-card rounded-lg text-srt-accent border border-srt-hover">
            <Icon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-srt-text drop-shadow-[0_0_5px_rgba(0,191,166,0.3)]">
              {title}
            </h2>
            <p className="text-sm text-srt-muted">{description}</p>
          </div>
        </div>
        
        <button 
          onClick={onBack}
          className="text-srt-muted hover:text-[#ff6b6b] text-sm flex items-center gap-1 transition-all bg-srt-card px-3 py-1.5 rounded-lg border border-srt-hover"
        >
          <ChevronLeft size={16}/> Back to Dashboard
        </button>
      </div>

      {/* WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        
        {/* LEFT COLUMN: UPLOADERS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-srt-text font-bold mb-2">
            <LayoutGrid size={18} className="text-srt-accent"/> Input Files
          </div>
          
          {/* Tool specific inputs will be injected here */}
          {leftInputs}
          
          {/* Action Button */}
          {actionButton}
        </div>

        {/* RIGHT COLUMN: RESULTS & TERMINAL */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-srt-text font-bold mb-2">
            <Server size={18} className="text-srt-accent"/> Processing & Output
          </div>

          {/* Tool specific outputs/terminal will be injected here */}
          {rightOutput}
        </div>
      </div>
    </div>
  );
}