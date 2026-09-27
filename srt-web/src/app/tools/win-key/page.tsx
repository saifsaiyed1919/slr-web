"use client";

import WinKeyInjectView from "@/components/WinKeyInjectView";
import { useRouter } from "next/navigation";

export default function WinKeyPage() {
  const router = useRouter();
  return <WinKeyInjectView onBack={() => router.push("/")} />;
}