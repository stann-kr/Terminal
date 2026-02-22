"use client";

import TerminalShell from "@/components/TerminalShell";

/**
 * 루트 페이지
 * BootSequence 완료 후 TerminalShell로 전환합니다.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--grey-bg)]">
      <TerminalShell />
    </main>
  );
}
