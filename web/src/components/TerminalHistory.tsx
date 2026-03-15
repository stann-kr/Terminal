import React from "react";
import type { TerminalLine } from "@/lib/types";
import Logo from "./Logo";
import { LINE_COLOR } from "@/lib/constants";

interface TerminalHistoryProps {
  historyContainerRef: React.RefObject<HTMLDivElement>;
  history: TerminalLine[];
  bottomRef: React.RefObject<HTMLDivElement>;
  onButtonClick?: (cmd: string) => void;
}

export default function TerminalHistory({
  historyContainerRef,
  history,
  bottomRef,
  onButtonClick,
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
        {history.map((termLine) => {
          if (termLine.type === "link" && termLine.url) {
            return (
              <p
                key={termLine.id}
                className="line-enter font-mono text-sm leading-relaxed break-all pl-4"
              >
                <a
                  href={termLine.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINE_COLOR[termLine.type as keyof typeof LINE_COLOR]}
                >
                  {termLine.text}
                </a>
              </p>
            );
          }

          if (termLine.type === "button") {
            return null; // 버튼은 TerminalShell 하단에 분리 렌더링
          }

          if (termLine.type === "header") {
            return (
              <div
                key={termLine.id}
                data-line-type="header"
                className="line-enter terminal-header"
              >
                {termLine.text}
              </div>
            );
          }

          if (termLine.type === "divider") {
            return (
              <div
                key={termLine.id}
                className="border-t border-[var(--grey-border)] my-2 opacity-50 w-[95%]"
              />
            );
          }

          const isInput = termLine.type === "input";
          const hasAnim = termLine.type !== "output";

          return (
            <div
              key={termLine.id}
              data-line-type={termLine.type}
              className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${LINE_COLOR[termLine.type as keyof typeof LINE_COLOR]} ${hasAnim ? "line-enter" : ""} ${isInput ? "mt-6 mb-1" : "pl-4"}`}
            >
              {termLine.text}
            </div>
          );
        })}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </>
  );
}
