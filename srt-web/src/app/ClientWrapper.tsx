"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { FileProvider } from "@/context/FileContext";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/"; 

  return (
    <FileProvider>
      {!isHomePage && <Sidebar />}

      <main className={`flex-1 h-screen overflow-y-auto relative ${isHomePage ? "p-0" : "p-4 md:p-8"}`}>
        {!isHomePage && (
          <div className="absolute top-0 left-1/4 w-[500px] h-[150px] bg-srt-accent/10 blur-[100px] pointer-events-none rounded-full"></div>
        )}
        <div className={`relative z-10 mx-auto ${isHomePage ? "w-full" : "max-w-7xl"}`}>
          {children}
        </div>
      </main>

    </FileProvider>
  );
}