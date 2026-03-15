"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { processCommand } from "@/lib/commands";
import { line } from "@/lib/utils";
import type { TerminalLine } from "@/lib/types";
import { LINE_COLOR } from "@/lib/constants";
import { textService } from "@/lib/services/text-service";

export default function AdminPage() {
  const [history, setHistory] = useState<TerminalLine[]>([
    line("TERMINAL — ADMIN CONSOLE", "success"),
    line("", "divider"),
    line(
      "Use: admin login <password> | admin live open <name> | admin ann <msg>",
      "system",
    ),
    line("Type 'admin help' for full command list.", "system"),
    line("", "divider"),
  ]);
  const [input, setInput] = useState("");
  const [isReady, setIsReady] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      if (!textService.isLoaded()) {
        await textService.initialize();
      }
      setIsReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || !isReady) return;
      setInput("");

      setHistory((prev) => [...prev, line(`> ${trimmed}`, "input")]);

      try {
        const result = await processCommand(trimmed, "en");
        if (result.shouldClear) {
          setHistory([line("[ CLEARED ]", "system")]);
        } else if (result.lines.length > 0) {
          setHistory((prev) => [...prev, ...result.lines]);
        }
      } catch (err) {
        setHistory((prev) => [
          ...prev,
          line(`[ ERR ] ${String(err)}`, "error"),
        ]);
      }
    },
    [input, isReady],
  );

  return (
    <div className="terminal-center">
      <div className="terminal-box">
        <div
          className="flex-1 overflow-y-auto space-y-1 mb-2 mt-2"
          role="log"
          aria-live="polite"
        >
          {history.map((l) => {
            if (l.type === "divider") {
              return (
                <div
                  key={l.id}
                  className="border-t border-[var(--grey-border)] my-2 opacity-50 w-[95%]"
                />
              );
            }
            const isInput = l.type === "input";
            return (
              <div
                key={l.id}
                className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${LINE_COLOR[l.type as keyof typeof LINE_COLOR]} ${isInput ? "mt-4 mb-1" : "pl-4"}`}
              >
                {l.text}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t border-[#3a3a3a] flex items-center gap-2">
          <span className="text-[var(--orange)] font-bold text-sm select-none">
            &gt;
          </span>
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder={isReady ? "admin command..." : "initializing..."}
              disabled={!isReady}
              className="w-full bg-transparent border-none outline-none font-mono text-sm text-[var(--grey-text)] placeholder:text-[var(--grey-border)] py-2"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
