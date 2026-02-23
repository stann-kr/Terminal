"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  type TerminalLine,
  type LineType,
  processCommand,
} from "@/lib/commands";
import { COMMAND_TEXTS } from "@/lib/command-text";
import Logo from "./Logo";

const LINE_COLOR: Record<TerminalLine["type"], string> = {
  system: "text-[var(--grey-muted)]",
  output: "text-[var(--grey-text)]",
  success: "text-[var(--orange)]",
  error: "text-[var(--error)]",
  input: "text-[var(--orange)] font-bold",
  link: "text-[var(--grey-text)] hover:text-[var(--orange)] hover:underline cursor-pointer transition-colors",
  header: "", // Uses .terminal-header from globals.css directly
  divider: "",
};

const QUICK_COMMANDS = ["about", "lineup", "gate", "link", "help"];

const EASTER_EGG_TEXT = `
  >> ACCESS GRANTED. WELCOME TO THE UNKNOWN SECTOR. <<
  >> MAIDEN VOYAGE <<
  >> You have discovered the hidden layer. Good job, traveler. <<
`;
if (typeof window !== "undefined") {
  console.log(`%c${EASTER_EGG_TEXT}`, "color: #ff4500; font-weight: bold;");
}

/**
 * 터미널 셸 컴포넌트.
 * 로고 + 출력 히스토리 + 입력창으로 구성됩니다.
 */
export default function TerminalShell() {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 터미널 하단 고정 스크롤 (모바일 간헐적 중단 버그 수정 v0.32.1)
  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current) return;

    const forceScroll = () => {
      const container = bottomRef.current?.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    requestAnimationFrame(() => {
      forceScroll();
      setTimeout(forceScroll, 50);
    });
  }, []);

  /**
   * 공용 렌더링 함수: 여러 줄의 문자열을 한 글자씩 타이핑하듯 부드럽게 출력합니다.
   */
  const renderLines = useCallback(
    async (
      linesToRender: TerminalLine[],
      fastMode = false,
      abortSignal?: { aborted: boolean },
    ) => {
      for (const line of linesToRender) {
        if (!isMounted.current || (abortSignal && abortSignal.aborted)) return;

        scrollToBottom();

        if (line.type !== "output" && line.type !== "input") {
          const delay = fastMode
            ? Math.floor(Math.random() * 20) + 10
            : Math.floor(Math.random() * 50) + 20;
          await new Promise((r) => setTimeout(r, delay));
          if (!isMounted.current || (abortSignal && abortSignal.aborted))
            return;
          setHistory((prev) => [...prev, line]);
          scrollToBottom();
        } else {
          const newLineId = `idx-${Date.now()}-${Math.random()}`;
          setHistory((prev) => [...prev, { ...line, id: newLineId, text: "" }]);

          for (let i = 0; i <= line.text.length; i++) {
            if (!isMounted.current || (abortSignal && abortSignal.aborted))
              return;
            setHistory((prev) =>
              prev.map((h) =>
                h.id === newLineId ? { ...h, text: line.text.slice(0, i) } : h,
              ),
            );

            if (i % 5 === 0) {
              scrollToBottom();
            }

            const typingSpeed = fastMode
              ? Math.floor(Math.random() * 5) + 2
              : Math.floor(Math.random() * 20) + 10;
            await new Promise((r) => setTimeout(r, typingSpeed));
          }
          scrollToBottom();
        }
      }
    },
    [scrollToBottom],
  );

  useEffect(() => {
    isMounted.current = true;
    const abortSignal = { aborted: false };

    const runBootSequence = async () => {
      setHistory([]); // Clean up any partial history from StrictMode remounts
      setIsBooting(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (abortSignal.aborted) return;

      const bootLinesWithIds: TerminalLine[] = COMMAND_TEXTS.bootSequence.map(
        (item, idx) => ({
          id: `boot-${idx}-${Date.now()}`,
          text: item.text,
          type: item.type,
        }),
      );
      await renderLines(bootLinesWithIds, true, abortSignal);
      if (abortSignal.aborted) return;

      await new Promise((resolve) => setTimeout(resolve, 600));
      if (!isMounted.current || abortSignal.aborted) return;

      const { lines: helpLines } = processCommand("help");
      const welcomeLines: TerminalLine[] = COMMAND_TEXTS.welcomeMessage.map(
        (item, idx) => {
          if (typeof item === "string")
            return { id: `w-${idx}`, text: item, type: "output" };
          return { id: `w-${idx}`, text: item[0], type: item[1] as LineType };
        },
      );

      const combined = [...welcomeLines, ...helpLines];
      await renderLines(combined, true, abortSignal);
      if (abortSignal.aborted) return;

      if (isMounted.current) {
        setIsBooting(false);
      }
    };

    runBootSequence();

    return () => {
      abortSignal.aborted = true;
      isMounted.current = false;
    };
  }, [renderLines]);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("button, a, input") && !isBooting && !isProcessing) {
      inputRef.current?.focus();
    }
  };

  const executeCommand = useCallback(
    async (cmdStr: string) => {
      const cmd = cmdStr.trim();
      if (!cmd || isBooting || isProcessing) return;

      setCmdHistory((prev) => [cmd, ...prev]);
      setHistoryIndex(-1);
      setInput("");
      setIsProcessing(true);
      inputRef.current?.blur();

      scrollToBottom();

      const { lines, shouldClear } = processCommand(cmd);

      if (shouldClear) {
        setHistory([]);
        setIsProcessing(false);
        return;
      }

      const inputLine: TerminalLine = {
        id: `in-${Date.now()}`,
        text: `> ${cmd}`,
        type: "input",
      };
      setHistory((prev) => [...prev, inputLine]);

      await renderLines(lines, false);

      if (!isMounted.current) return;
      setIsProcessing(false);
    },
    [isBooting, isProcessing, renderLines, scrollToBottom],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      executeCommand(input);
    },
    [input, executeCommand],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const nextIndex = Math.min(historyIndex + 1, cmdHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[nextIndex] ?? "");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(nextIndex);
        setInput(nextIndex === -1 ? "" : (cmdHistory[nextIndex] ?? ""));
      }
    },
    [historyIndex, cmdHistory],
  );

  const [inputTextWidth, setInputTextWidth] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const mirrorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (mirrorRef.current) {
      setInputTextWidth(mirrorRef.current.offsetWidth);
    }
  }, [input, cursorPosition]);

  return (
    <div
      className="terminal-center cursor-text screen-flicker"
      onClick={handleContainerClick}
    >
      <div className="terminal-box gap-y-0">
        <div className="shrink-0">
          <div className="fade-in">
            <Logo />
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto space-y-1 mb-2 mt-2"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Terminal output history"
        >
          {history.map((line) => {
            if (line.type === "link" && line.url) {
              return (
                <p
                  key={line.id}
                  className="font-mono text-sm leading-relaxed break-all"
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

            return (
              <div
                key={line.id}
                data-line-type={line.type}
                className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${LINE_COLOR[line.type as keyof typeof LINE_COLOR]} ${isInput ? "mt-6 mb-1" : ""}`}
              >
                {line.text}
              </div>
            );
          })}
          <div ref={bottomRef} aria-hidden="true" />
        </div>

        <div className="shrink-0">
          <div className="border-t border-[#3a3a3a] flex items-center gap-2 relative">
            <span className="text-[var(--orange)] font-bold text-sm select-none">
              &gt;
            </span>

            <form
              onSubmit={handleSubmit}
              className={`flex-1 flex items-center relative transition-opacity duration-200 ${
                isBooting || isProcessing
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <span
                ref={mirrorRef}
                className="absolute opacity-0 pointer-events-none whitespace-pre font-mono text-sm"
                aria-hidden="true"
              >
                {input.slice(0, cursorPosition)}
              </span>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setCursorPosition(e.target.selectionStart || 0);
                }}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                  // Update position strictly after the default browser action
                  setTimeout(() => {
                    if (inputRef.current) {
                      setCursorPosition(inputRef.current.selectionStart || 0);
                    }
                  }, 0);
                }}
                onKeyUp={() => {
                  if (inputRef.current) {
                    setCursorPosition(inputRef.current.selectionStart || 0);
                  }
                }}
                onMouseUp={() => {
                  if (inputRef.current) {
                    setCursorPosition(inputRef.current.selectionStart || 0);
                  }
                }}
                onFocus={() => scrollToBottom()}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="enter command..."
                aria-label="Terminal input"
                className="
                    peer flex-1 bg-transparent border-none outline-none
                    font-mono text-sm text-[var(--grey-text)]
                    placeholder:text-[var(--grey-border)]
                    caret-transparent
                  "
              />
              <span
                className={`
                  cursor-blink w-2 h-4 bg-[var(--orange)] absolute pointer-events-none
                  opacity-0 peer-focus:opacity-100 transition-opacity duration-100
                `}
                style={{
                  left: `${inputTextWidth}px`,
                  transition: "left 0.05s ease-out",
                }}
              />
            </form>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 px-1">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              disabled={isBooting || isProcessing}
              className="
                px-1 py-0.5 border border-[var(--grey-border)] text-[var(--grey-text)] text-xs font-mono uppercase tracking-widest
                transition-all duration-200
                hover:border-[var(--orange)] hover:text-[var(--orange)] hover:bg-[rgba(255,155,81,0.05)]
                active:bg-[rgba(255,155,81,0.15)]
                focus:outline-none
                disabled:opacity-30 disabled:cursor-not-allowed
              "
            >
              [ &nbsp;{cmd}&nbsp; ]
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
