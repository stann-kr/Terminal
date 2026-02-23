"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  processCommand,
  uid,
  type TerminalLine,
  type LanguageType,
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
  progress: "text-[var(--grey-muted)] font-mono",
};

type QuickCommand = { label: string; cmd: string; stageOnly?: boolean; back?: boolean };

const DEFAULT_QUICK_COMMANDS: QuickCommand[] = [
  { label: "about", cmd: "about" },
  { label: "lineup", cmd: "lineup" },
  { label: "gate", cmd: "gate" },
  { label: "link", cmd: "link" },
  { label: "settings", cmd: "settings" },
  { label: "help", cmd: "help" },
];

const AVAILABLE_COMMANDS = [
  "about", "clear", "echo", "gate", "help", "lineup",
  "link", "settings", "status", "sudo", "systems",
  "voyage", "whois", "whoami",
];

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
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Settings State
  const [language, setLanguage] = useState<LanguageType | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isAnimatingInput, setIsAnimatingInput] = useState(false);
  const [quickCmdContext, setQuickCmdContext] = useState<string | null>(null);
  // localStorage 로드 완료 전 첫 렌더에서 UI가 깜빡이는 것 방지
  const [isInitialized, setIsInitialized] = useState(false);
  const hasBootedRef = useRef(false);
  const isAnimatingRef = useRef(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // boot 시퀀스에서 typeOutLines를 안전하게 호출하기 위한 ref
  const typeOutLinesRef = useRef<((lines: TerminalLine[]) => Promise<void>) | null>(null);

  /** 초기화: localStorage 즉시 읽기 → 테마 적용 → 스캔 애니메이션 → 부팅 또는 언어 선택 */
  useEffect(() => {
    // 1. localStorage를 동기적으로 즉시 읽어 테마/언어 적용 (블로킹 스크립트와 이중 보호)
    const savedLang = localStorage.getItem("terminal_lang") as LanguageType | null;
    const savedTheme = localStorage.getItem("terminal_theme") as "dark" | "light" | null;
    document.documentElement.setAttribute("data-theme", savedTheme ?? "dark");
    if (savedLang) document.documentElement.lang = savedLang;

    // 2. 스캔 애니메이션 (순수 시각 효과 — 데이터는 이미 읽음)
    setHistory([
      { id: `pre-${uid()}`, text: "SCANNING LOCAL MEMORY...", type: "system" },
    ]);

    // 3. 스캔 결과 표시
    let bootTimer: NodeJS.Timeout | undefined;
    const scanTimer = setTimeout(() => {
      if (savedLang) {
        setHistory((prev) => [
          ...prev,
          {
            id: `pre-${uid()}`,
            text: `> LANG: ${savedLang.toUpperCase()}  /  THEME: ${(savedTheme ?? "DARK").toUpperCase()}`,
            type: "success",
          },
          { id: `pre-${uid()}`, text: "READY. INITIALIZING...", type: "system" },
          { id: `pre-${uid()}`, text: "", type: "divider" },
        ]);
        bootTimer = setTimeout(() => {
          setLanguage(savedLang);
          setIsInitialized(true);
        }, 450);
      } else {
        // 저장된 설정 없음 — 스캔 결과 + 언어 선택을 한 번에 추가 (별도 useEffect 없이)
        setHistory((prev) => [
          ...prev,
          { id: `pre-${uid()}`, text: "NO SAVED CONFIGURATION.", type: "system" },
          { id: `lang-${uid()}`, text: "SELECT SYSTEM LANGUAGE", type: "header" },
          { id: `lang-${uid()}`, text: "  [1] English", type: "output" },
          { id: `lang-${uid()}`, text: "  [2] 한국어", type: "output" },
          { id: `lang-${uid()}`, text: "  Type 1 or 2 and press Enter.", type: "system" },
          { id: `lang-${uid()}`, text: "", type: "divider" },
        ]);
        setIsInitialized(true);
      }
    }, 350);

    return () => {
      clearTimeout(scanTimer);
      clearTimeout(bootTimer);
    };
  }, []);

  /** Boot Sequence (runs only once after initial language selection) */
  useEffect(() => {
    if (language === null || hasBootedRef.current) return;
    hasBootedRef.current = true;

    // 헤더는 init 단계에서 이미 출력됨 — 바로 부팅 라인 추가
    const bootLines = COMMAND_TEXTS.bootSequence[language];
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const interval = setInterval(() => {
      if (currentIndex < bootLines.length) {
        const lineToPush = bootLines[currentIndex];
        setHistory((prev) => [
          ...prev,
          {
            id: `boot-${uid()}`,
            text: lineToPush.text,
            type: lineToPush.type,
          },
        ]);
        currentIndex++;
      } else {
        clearInterval(interval);
        timeoutId = setTimeout(() => {
          if (language === null) return;
          setHistory((prev) => [
            ...prev,
            ...COMMAND_TEXTS.welcomeMessage[language].map((item) => {
              const text = typeof item === "string" ? item : item[0];
              const type = typeof item === "string" ? "output" : item[1];
              return {
                id: `welcome-${uid()}`,
                text,
                type: type as TerminalLine["type"],
              };
            }),
          ]);
          setIsBooting(false);
          // 부팅 완료 후 help 자동 출력 (setIsBooting(false)와 배치 → isTyping=true로 이어짐)
          const helpResult = processCommand("help", language);
          typeOutLinesRef.current?.(helpResult.lines);
        }, 500);
      }
    }, 150);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // theme은 boot 시작 시 1회만 캡처되므로 의존성에서 제외

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

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const typeOutLines = useCallback(
    async (linesToType: TerminalLine[]) => {
      setIsTyping(true);
      const fastMode = localStorage.getItem("terminal_fast_mode") === "true";

      for (const line of linesToType) {
        const newLineId = line.id;

        // progress 타입: 빈 바로 시작해 한 칸씩 채워지는 진행 바 애니메이션
        if (line.type === "progress") {
          const barLen = 10;
          const full = "▓";
          const empty = "░";
          setHistory((prev) => [
            ...prev,
            { ...line, text: `${line.text} [${empty.repeat(barLen)}]` },
          ]);
          for (let i = 1; i <= barLen; i++) {
            await new Promise((r) => setTimeout(r, fastMode ? 20 : 65));
            setHistory((prev) =>
              prev.map((h) =>
                h.id === newLineId
                  ? { ...h, text: `${line.text} [${full.repeat(i)}${empty.repeat(barLen - i)}]` }
                  : h,
              ),
            );
          }
          scrollToBottom();
          continue;
        }

        // output 외의 라인은 짧은 스태거 딜레이 후 출력
        if (line.type !== "output") {
          const stagger =
            line.type === "divider" || line.type === "input" ? 0 : fastMode ? 20 : 65;
          if (stagger) await new Promise((r) => setTimeout(r, stagger));
          setHistory((prev) => [...prev, line]);
          scrollToBottom();
          continue;
        }

        // 라인을 빈 텍스트로 미리 생성
        setHistory((prev) => [...prev, { ...line, text: "" }]);

        for (let i = 1; i <= line.text.length; i++) {
          setHistory((prev) =>
            prev.map((h) =>
              h.id === newLineId ? { ...h, text: line.text.slice(0, i) } : h,
            ),
          );

          if (i % 5 === 0) scrollToBottom();

          const typingSpeed = fastMode
            ? Math.floor(Math.random() * 5) + 2
            : Math.floor(Math.random() * 20) + 10;
          await new Promise((r) => setTimeout(r, typingSpeed));
        }
        scrollToBottom();
      }
      setIsTyping(false);
    },
    [scrollToBottom],
  );

  // typeOutLines가 재생성될 때마다 ref 동기화
  useEffect(() => {
    typeOutLinesRef.current = typeOutLines;
  }, [typeOutLines]);

  const isInputActive = isInitialized && (language === null || (!isBooting && !isTyping));
  // 버튼은 입력 애니메이션 중에도 비활성화
  const isButtonsActive = isInputActive && !isAnimatingInput;

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("button, a, input") && isInputActive) {
        inputRef.current?.focus();
      }
    },
    [isInputActive],
  );

  const handleLanguageSelection = useCallback((cmd: string) => {
    if (cmd === "1" || cmd.toLowerCase() === "en") {
      localStorage.setItem("terminal_lang", "en");
      document.documentElement.lang = "en";
      setLanguage("en");
    } else if (cmd === "2" || cmd.toLowerCase() === "ko") {
      localStorage.setItem("terminal_lang", "ko");
      document.documentElement.lang = "ko";
      setLanguage("ko");
    } else {
      setHistory((prev) => [
        ...prev,
        { id: `err-${uid()}`, text: "> " + cmd, type: "input" },
        {
          id: `err-${uid()}`,
          text: "Invalid selection. Type 1 for English, 2 for Korean.",
          type: "error",
        },
      ]);
    }
    setInput("");
  }, []);

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim();
      if (!trimmedCmd) return;

      if (language === null) {
        handleLanguageSelection(trimmedCmd);
        return;
      }

      const inputLine: TerminalLine = {
        id: `in-${uid()}`,
        text: `> ${trimmedCmd}`,
        type: "input",
      };

      setHistory((prev) => [...prev, inputLine]);
      setCommandHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);

      const result = processCommand(trimmedCmd, language);

      if (result.shouldClear) {
        setTimeout(() => setHistory([]), 50);
      } else if (result.lines.length > 0) {
        typeOutLines(result.lines);
      }

      // Handle Actions (Settings)
      if (result.action) {
        if (result.action.type === "CHANGE_LANG") {
          setLanguage(result.action.payload);
          localStorage.setItem("terminal_lang", result.action.payload);
          document.documentElement.lang = result.action.payload;
        } else if (result.action.type === "CHANGE_THEME") {
          localStorage.setItem("terminal_theme", result.action.payload);
          document.documentElement.setAttribute(
            "data-theme",
            result.action.payload,
          );
        } else if (result.action.type === "RESET") {
          localStorage.removeItem("terminal_lang");
          localStorage.removeItem("terminal_theme");
          hasBootedRef.current = false;
          setLanguage(null);
          document.documentElement.setAttribute("data-theme", "dark");
          setIsBooting(true);
          setHistory([
            { id: `reset-${uid()}`, text: "SYSTEM RESET COMPLETE.", type: "system" },
            { id: `lang-${uid()}`, text: "SELECT SYSTEM LANGUAGE", type: "header" },
            { id: `lang-${uid()}`, text: "  [1] English", type: "output" },
            { id: `lang-${uid()}`, text: "  [2] 한국어", type: "output" },
            { id: `lang-${uid()}`, text: "  Type 1 or 2 and press Enter.", type: "system" },
            { id: `lang-${uid()}`, text: "", type: "divider" },
          ]);
        }
      }

      setInput("");
    },
    [language, handleLanguageSelection, typeOutLines],
  );

  /** 퀵 커맨드 클릭 시 입력창에 글자를 한 자씩 타이핑한 뒤 실행 */
  const typeAndExecute = useCallback(
    async (cmd: string, opts?: { stageOnly?: boolean }) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setIsAnimatingInput(true);

      inputRef.current?.focus();
      setInput("");
      setCursorPosition(0);
      await new Promise((r) => setTimeout(r, 60));

      for (let i = 1; i <= cmd.length; i++) {
        setInput(cmd.slice(0, i));
        setCursorPosition(i);
        const delay = Math.floor(Math.random() * 20) + 22;
        await new Promise((r) => setTimeout(r, delay));
      }

      if (!opts?.stageOnly) {
        await new Promise((r) => setTimeout(r, 90));
        // handleCommand가 setIsTyping(true)를 동기적으로 호출하므로
        // 같은 React 배치 안에서 isAnimatingInput=false + isTyping=true가 동시에 처리됨
        // → 버튼이 순간적으로 활성화되는 타이밍 버그 방지
        handleCommand(cmd);
        setIsAnimatingInput(false);
        isAnimatingRef.current = false;
      } else {
        setIsAnimatingInput(false);
        isAnimatingRef.current = false;
      }
    },
    [handleCommand],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleCommand(input);
    },
    [input, handleCommand],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInput(
          commandHistory[commandHistory.length - 1 - nextIndex] ?? "",
        );
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(nextIndex);
        setInput(
          nextIndex === -1
            ? ""
            : (commandHistory[commandHistory.length - 1 - nextIndex] ?? ""),
        );
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (language === null) return;
        const val = (e.target as HTMLInputElement).value.trim().toLowerCase();
        if (!val) return;
        const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(val));
        if (match && match !== val) {
          setInput(match);
          setCursorPosition(match.length);
        }
      }
    },
    [historyIndex, commandHistory, language],
  );

  const [inputTextWidth, setInputTextWidth] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const mirrorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (mirrorRef.current) {
      setInputTextWidth(mirrorRef.current.offsetWidth);
    }
  }, [input, cursorPosition]);

  const BACK_BTN: QuickCommand = { label: "← back", cmd: "__back__", back: true };

  let currentQuickCommands: QuickCommand[] = DEFAULT_QUICK_COMMANDS;
  if (language === null) {
    currentQuickCommands = [
      { label: "1 (EN)", cmd: "1" },
      { label: "2 (KO)", cmd: "2" },
    ];
  } else {
    const trimmedInput = input.trim().toLowerCase();
    const parts = trimmedInput.split(/\s+/);
    // 입력이 있으면 입력 기반, 없으면 context 기반
    const activeCtx = trimmedInput ? parts[0] : quickCmdContext;

    if (activeCtx === "settings") {
      if (!trimmedInput || parts.length === 1) {
        currentQuickCommands = [
          BACK_BTN,
          { label: "lang en", cmd: "settings lang en" },
          { label: "lang ko", cmd: "settings lang ko" },
          { label: "theme dark", cmd: "settings theme dark" },
          { label: "theme light", cmd: "settings theme light" },
          { label: "reset", cmd: "settings reset" },
        ];
      } else if (parts[1] === "lang") {
        currentQuickCommands = [
          BACK_BTN,
          { label: "lang en", cmd: "settings lang en" },
          { label: "lang ko", cmd: "settings lang ko" },
        ];
      } else if (parts[1] === "theme") {
        currentQuickCommands = [
          BACK_BTN,
          { label: "theme dark", cmd: "settings theme dark" },
          { label: "theme light", cmd: "settings theme light" },
        ];
      } else if (parts[1] === "reset") {
        currentQuickCommands = [
          BACK_BTN,
          { label: "reset", cmd: "settings reset" },
        ];
      }
    } else if (activeCtx === "whois") {
      currentQuickCommands = [
        BACK_BTN,
        { label: "stann", cmd: "whois stann" },
      ];
    } else if (activeCtx === "sudo") {
      currentQuickCommands = [
        BACK_BTN,
        { label: "login stann", cmd: "sudo login stann" },
      ];
    }
  }

  return (
    <div
      className="terminal-center cursor-text screen-flicker"
      onClick={handleContainerClick}
    >
      <div className="terminal-box gap-y-0">
        <div className="shrink-0 fade-in">
          <Logo />
        </div>

        <div
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
                style={hasAnim ? { animation: "fadeIn 0.4s ease forwards" } : undefined}
                className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${LINE_COLOR[line.type as keyof typeof LINE_COLOR]} ${isInput ? "mt-6 mb-1" : "pl-4"}`}
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
                !isInputActive ? "opacity-0 pointer-events-none" : "opacity-100"
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

        <div
          className="mt-3 flex flex-wrap gap-3 px-4"
          style={{
            opacity: isInputActive ? 1 : 0,
            transform: isInputActive ? "translateY(0)" : "translateY(8px)",
            pointerEvents: isInputActive ? "auto" : "none",
            // 나타날 때: 부드럽게 / 사라질 때: 즉시
            transition: isInputActive
              ? "opacity 250ms ease-out, transform 250ms ease-out"
              : "opacity 80ms ease-in, transform 80ms ease-in",
          }}
        >
          {currentQuickCommands.map((qcmd) => (
            <button
              key={qcmd.cmd}
              onClick={() => {
                if (qcmd.back) {
                  setQuickCmdContext(null);
                  setInput("");
                  inputRef.current?.focus();
                } else if (qcmd.cmd === "settings") {
                  typeAndExecute(qcmd.cmd).then(() =>
                    setQuickCmdContext("settings"),
                  );
                } else if (quickCmdContext === "settings" || qcmd.cmd.startsWith("settings ")) {
                  typeAndExecute(qcmd.cmd).then(() => setQuickCmdContext(null));
                } else {
                  typeAndExecute(qcmd.cmd, { stageOnly: qcmd.stageOnly });
                }
              }}
              disabled={!isButtonsActive}
              className={`
                px-1 py-0.5 border text-xs font-mono uppercase tracking-widest
                transition-all duration-300 ease-in-out
                focus:outline-none
                disabled:opacity-30 disabled:cursor-not-allowed
                ${qcmd.back
                  ? "border-[var(--grey-border)] text-[var(--grey-muted)] hover:border-[var(--grey-text)] hover:text-[var(--grey-text)]"
                  : "border-[var(--grey-border)] text-[var(--grey-text)] hover:border-[var(--orange)] hover:text-[var(--orange)] hover:bg-[rgba(255,155,81,0.05)] active:bg-[rgba(255,155,81,0.15)] focus:border-[var(--orange)] focus:text-[var(--orange)]"
                }
              `}
            >
              [ &nbsp;{qcmd.label}&nbsp; ]
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
