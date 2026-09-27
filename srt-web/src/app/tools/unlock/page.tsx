"use client";

import UnlockBiosView from "@/components/UnlockBiosView";
import { useRouter } from "next/navigation";

export default function UnlockPage() {
  const router = useRouter();
  return <UnlockBiosView onBack={() => router.push("/")} />;
}