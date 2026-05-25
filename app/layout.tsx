import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tentaövning — Claude & Multi-Agent Systems",
  description: "Övningsprov för Claude Code och multi-agent-system",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="sv">
      <body className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
};

export default RootLayout;
