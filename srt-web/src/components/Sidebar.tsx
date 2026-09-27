"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Wrench, Settings2, ArrowRightLeft, 
  Key, Unlock, Activity, Settings, LogOut 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Build Bios", icon: Wrench, path: "/tools/build-bios" },
    { name: "Clean CSME", icon: Settings2, path: "/tools/clean-csme" },
    { name: "DMI Transfer", icon: ArrowRightLeft, path: "/tools/dmi-transfer" },
    { name: "Win Key Inject", icon: Key, path: "/tools/win-key" },
    { name: "Unlock Bios", icon: Unlock, path: "/tools/unlock" },
    { name: "ME Analyzer", icon: Activity, path: "/tools/me-analyzer" },
  ];

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-srt-hover h-screen flex flex-col hidden md:flex sticky top-0">
      
      {/* LOGO SECTION */}
      <div className="h-20 flex items-center px-6 border-b border-srt-hover">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-srt-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,191,166,0.5)]">
            <Cpu size={20} className="text-[#0a0a0a]" />
          </div>
          <h1 className="font-bold text-xl tracking-wider text-srt-text uppercase">SRT <span className="text-srt-accent">Tools</span></h1>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="text-[10px] text-srt-muted font-bold tracking-widest uppercase mb-4 px-2">Main Menu</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all ${
                isActive 
                  ? "bg-srt-accent/10 text-srt-accent border border-srt-accent/30 shadow-[inset_0_0_15px_rgba(0,191,166,0.05)]" 
                  : "text-srt-muted hover:text-srt-text hover:bg-srt-hover/50 border border-transparent"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-srt-accent" : "opacity-70"} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-4 border-t border-srt-hover space-y-1">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-srt-muted hover:text-srt-text hover:bg-srt-hover/50 transition-all">
          <Settings size={18} className="opacity-70" /> Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition-all">
          <LogOut size={18} className="opacity-70" /> Logout
        </button>
      </div>
    </div>
  );
}

// CPU Icon import just for the logo (chhota sa hack taaki upar import lambi na ho)
import { Cpu } from "lucide-react";