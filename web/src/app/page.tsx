"use client";

import { useCallback, useState } from "react";
import BootSequence from "@/components/BootSequence";
import TerminalShell from "@/components/TerminalShell";

/**
 * 루트 페이지
 * BootSequence 완료 후 TerminalShell로 전환합니다.
 */
export default function HomePage() {
  const [booted, setBooted] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#1c1c1c]">
      {!booted ? (
        <BootSequence onComplete={handleBootComplete} />
      ) : (
        <TerminalShell />
      )}
    </main>
  );
}
