"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FileContextType {
  sharedFile: File | null;
  setSharedFile: (file: File | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [sharedFile, setSharedFile] = useState<File | null>(null);

  return (
    <FileContext.Provider value={{ sharedFile, setSharedFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}