import React from "react";
import type { TerminalLine } from "@/lib/types";
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
            return (
              <div key={termLine.id} className="line-enter pl-4 mt-1 mb-1">
                <span className="inline-block min-w-[140px] align-middle">
                  <button
                    type="button"
                    onClick={() =>
                      onButtonClick &&
                      termLine.cmd &&
                      onButtonClick(termLine.cmd)
                    }
                    className="inline-btn text-left"
                  >
                    {termLine.text}
                  </button>
                </span>
                {termLine.desc && (
                  <span className="text-[var(--grey-text)] text-[0.85rem] opacity-70 inline-block align-middle ml-2 sm:ml-4">
                    - {termLine.desc}
                  </span>
                )}
              </div>
            );
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
                className="border-t border-dashed border-[var(--panel-border)] my-2 opacity-70 w-[95%]"
              />
            );
          }

          const isInput = termLine.type === "input";
          const isOutput = termLine.type === "output";
          const hasAnim = !isOutput;

          // output: CSS [data-line-type="output"]가 padding-left: 2rem + >> prefix 처리
          // input: 상단 마진만
          // 나머지: pl-4
          const spacingClass = isInput ? "mt-6 mb-1" : isOutput ? "" : "pl-4";

          return (
            <div
              key={termLine.id}
              data-line-type={termLine.type}
              className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${LINE_COLOR[termLine.type as keyof typeof LINE_COLOR]} ${hasAnim ? "line-enter" : ""} ${spacingClass}`}
            >
              {termLine.text}
            </div>
          );
        })}
        <div ref={bottomRef} className="h-[2rem] w-full shrink-0" aria-hidden="true" />
      </div>
    </>
  );
}
