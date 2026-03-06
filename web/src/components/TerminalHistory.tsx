import React from "react";
import type { TerminalLine } from "@/lib/types";
import Logo from "./Logo";
import { LINE_COLOR } from "@/lib/constants";

interface TerminalHistoryProps {
  historyContainerRef: React.RefObject<HTMLDivElement>;
  history: TerminalLine[];
  bottomRef: React.RefObject<HTMLDivElement>;
}

export default function TerminalHistory({
  historyContainerRef,
  history,
  bottomRef,
}: TerminalHistoryProps) {
  return (
    <>
      <div className="shrink-0 fade-in">
        <Logo />
      </div>

      <div
        ref={historyContainerRef}
        className="flex-1 overflow-y-auto space-y-1 mb-2 mt-2"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {history.map((line) => {
          if (line.type === "link" && line.url) {
            return (
              <p
                key={line.id}
                style={{ animation: "fadeIn 0.45s ease forwards" }}
                className="font-mono text-sm leading-relaxed break-all pl-4"
              >
                <a
                  href={line.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINE_COLOR[line.type as keyof typeof LINE_COLOR]}
                >
                  {line.text}
                </a>
              </p>
            );
          }

          if (line.type === "header") {
            return (
              <div
                key={line.id}
                data-line-type="header"
                style={{ animation: "fadeIn 0.45s ease forwards" }}
                className="terminal-header"
              >
                {line.text}
              </div>
            );
          }

          if (line.type === "divider") {
            return (
              <div
                key={line.id}
                className="border-t border-[var(--grey-border)] my-2 opacity-50 w-[95%]"
              />
            );
          }

          const isInput = line.type === "input";
          const hasAnim = line.type !== "output";

          return (
            <div
              key={line.id}
              data-line-type={line.type}
              style={
                hasAnim ? { animation: "fadeIn 0.4s ease forwards" } : undefined
              }
              className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${LINE_COLOR[line.type as keyof typeof LINE_COLOR]} ${isInput ? "mt-6 mb-1" : "pl-4"}`}
            >
              {line.text}
            </div>
          );
        })}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </>
  );
}
