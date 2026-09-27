"use client";

import MEAnalyzerView from "@/components/MEAnalyzerView";
import { useRouter } from "next/navigation";

export default function MEAnalyzerPage() {
  const router = useRouter();
  
  // onBack press hone par router sidha dashboard ( "/" ) par le jayega
  return <MEAnalyzerView onBack={() => router.push("/")} />;
}