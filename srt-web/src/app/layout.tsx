import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./ClientWrapper"; // Sirf ClientWrapper import hoga yahan

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SRT - Saif Refix Tools",
  description: "Next-gen repair tools and resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-srt-bg text-srt-text flex h-screen overflow-hidden`}>
        {/* Baki saara kaam ClientWrapper sambhal lega */}
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}