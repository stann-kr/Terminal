"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type TerminalLine,
  type LineType,
  processCommand,
} from "@/lib/commands";
import Logo from "./Logo";

/** 이스터 에그: 브라우저 콘솔에 출력될 ASCII 메시지 */
const EASTER_EGG = `
%c
████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝

  >> ACCESS GRANTED. WELCOME TO THE UNKNOWN SECTOR. <<
  >> MAIDEN VOYAGE <<
  >> You have discovered the hidden layer. Good job, traveler. <<
`;

/** 초기 환영 메시지 */
const WELCOME_MESSAGES: TerminalLine[] = [
  {
    id: "w-0",
    text: "─────────────────────────────────────────",
    type: "system",
  },
  {
    id: "w-1",
    text: "  TERMINAL CORE SYSTEM — ACCESS GRANTED",
    type: "success",
  },
  {
    id: "w-2",
    text: "  Type 'help' to view available commands.",
    type: "output",
  },
  {
    id: "w-3",
    text: "─────────────────────────────────────────",
    type: "system",
  },
];

/** 부팅 시퀀스 타이밍 데이터 */
const BOOT_LINES: { text: string; delay: number; type: LineType }[] = [
  { text: "TERMINAL CORE — SYSTEM BOOT INITIATED", delay: 0, type: "system" },
  { text: "...", delay: 150, type: "system" },
  { text: "[ OK ] Loading kernel modules...", delay: 350, type: "output" },
  { text: "[ OK ] Mounting hyperdrive array...", delay: 600, type: "output" },
  {
    text: "[ OK ] Initializing navigation matrix...",
    delay: 900,
    type: "output",
  },
  {
    text: "[ OK ] Calibrating frequency bands...",
    delay: 1200,
    type: "output",
  },
  { text: "[ -- ] Scanning for crew manifest...", delay: 1500, type: "system" },
  {
    text: "[ OK ] Crew loaded: 3 personnel confirmed.",
    delay: 1800,
    type: "output",
  },
  { text: "[ -- ] Verifying gate coordinates...", delay: 2100, type: "system" },
  {
    text: "[ OK ] Gate: Club Faust, Seoul / 2026.03.07",
    delay: 2450,
    type: "output",
  },
  { text: "...", delay: 2800, type: "system" },
  {
    text: "─────────────────────────────────────────",
    delay: 3000,
    type: "system",
  },
  { text: "  STATUS: OPERATIONAL", delay: 3200, type: "success" },
  {
    text: "  Maiden Voyage to the Unknown Sector.",
    delay: 3450,
    type: "success",
  },
  {
    text: "─────────────────────────────────────────",
    delay: 3650,
    type: "system",
  },
];

const LINE_COLOR: Record<TerminalLine["type"], string> = {
  system: "text-[var(--grey-muted)]",
  output: "text-[var(--grey-text)]",
  success: "text-[var(--orange)]",
  error: "text-[var(--error)]",
  input: "text-[var(--orange)] font-bold",
  link: "text-[var(--grey-text)] hover:text-[var(--orange)] hover:underline cursor-pointer transition-colors",
};

const QUICK_COMMANDS = ["about", "lineup", "gate", "link"];

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

  // 브라우저 콘솔 이스터 에그 및 부팅 시퀀스
  useEffect(() => {
    isMounted.current = true;
    console.log(EASTER_EGG, "color: #ff4500; font-weight: bold;");

    const timers: ReturnType<typeof setTimeout>[] = [];

    // 부팅 시퀀스 라인 하나씩 추가
    BOOT_LINES.forEach((item, index) => {
      const t = setTimeout(() => {
        if (!isMounted.current) return;
        setHistory((prev) => [
          ...prev,
          { id: `boot-${index}`, text: item.text, type: item.type },
        ]);
      }, item.delay);
      timers.push(t);
    });

    // 부팅 종료 후 환영메시지와 도움말 출력, 입력창 활성화
    const completeTimer = setTimeout(
      () => {
        if (!isMounted.current) return;
        const { lines } = processCommand("help");
        setHistory((prev) => [...prev, ...WELCOME_MESSAGES, ...lines]);
        setIsBooting(false);
      },
      BOOT_LINES[BOOT_LINES.length - 1].delay + 1000,
    );
    timers.push(completeTimer);

    return () => {
      isMounted.current = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  // 터미널 하단 고정 스크롤 (키보드 등장 대비)
  const scrollToBottom = useCallback(() => {
    // 키보드 애니메이션 시간을 고려한 지연 호출
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }, []);

  // 새 라인 추가 시 스크롤 하단 이동
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // 화면 클릭 시 입력창 포커스
  const handleContainerClick = (e: React.MouseEvent) => {
    // 입력창 자체를 직접 터치한 경우에는 네이티브 동작에 맡김
    if (e.target !== inputRef.current && !isBooting && !isProcessing) {
      inputRef.current?.focus();
    }
  };

  /**
   * 명령어 실행 로직 (공통)
   */
  const executeCommand = useCallback(
    async (cmdStr: string) => {
      const cmd = cmdStr.trim();
      if (!cmd || isBooting || isProcessing) return;

      // 입력 히스토리 저장
      setCmdHistory((prev) => [cmd, ...prev]);
      setHistoryIndex(-1);
      setInput("");
      setIsProcessing(true);
      inputRef.current?.blur(); // iOS 타이핑 종료 직후 명시적으로 키보드 가리기

      const { lines, shouldClear } = processCommand(cmd);

      if (shouldClear) {
        setHistory([]);
        setIsProcessing(false);
        return;
      }

      // 입력창에 표시될 라인 먼저 추가
      const inputLine: TerminalLine = {
        id: `in-${Date.now()}`,
        text: `> ${cmd}`,
        type: "input",
      };
      setHistory((prev) => [...prev, inputLine]);

      // 결과 라인들을 순차적으로 렌더링
      for (const line of lines) {
        // 100ms ~ 300ms 사이의 랜덤 지연으로 기계적인 느낌 부여
        const delay = Math.floor(Math.random() * 200) + 100;
        await new Promise((resolve) => setTimeout(resolve, delay));
        if (!isMounted.current) return;
        setHistory((prev) => [...prev, line]);
      }

      if (!isMounted.current) return;
      setIsProcessing(false);
    },
    [isBooting, isProcessing],
  );

  /**
   * 명령어 제출 처리
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      executeCommand(input);
    },
    [input, executeCommand],
  );

  /**
   * 키보드 이벤트 처리 (방향키로 히스토리 탐색)
   */
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

  return (
    <div
      className="terminal-center cursor-text screen-flicker"
      onClick={handleContainerClick}
    >
      <div className="terminal-box gap-y-5">
        <div className="shrink-0">
          <div className="fade-in">
            <Logo />
          </div>
        </div>

        {/* 출력 히스토리 (터미널 내부에서만 스크롤) */}
        <div className="flex-1 overflow-y-auto space-y-1 pb-4">
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
                    className={LINE_COLOR[line.type]}
                  >
                    {line.text}
                  </a>
                </p>
              );
            }
            const isInput = line.type === "input";
            return (
              <div
                key={line.id}
                className={`font-mono text-sm leading-relaxed whitespace-pre-wrap break-words ${LINE_COLOR[line.type]} ${isInput ? "mt-6 mb-1" : ""}`}
              >
                {line.text}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* 입력창 (부팅 중엔 막기) */}
        <div className="mt-4 shrink-0 pb-2 h-4">
          <div className="border-t border-[#3a3a3a] pt-4 flex items-center gap-2">
            <span className="text-[var(--orange)] font-bold text-sm select-none">
              &gt;
            </span>
            {isBooting || isProcessing ? (
              <span className="cursor-blink w-2 h-4 bg-[var(--orange)] inline-block" />
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={scrollToBottom}
                  onBlur={() => {
                    setTimeout(() => {
                      window.scrollTo(0, 0);
                      document.body.scrollTop = 0;
                    }, 10);
                  }}
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="enter command..."
                  className="
                    flex-1 bg-transparent border-none outline-none
                    font-mono text-sm text-[var(--grey-text)]
                    placeholder:text-[var(--grey-border)]
                    caret-[var(--orange)]
                  "
                />
              </form>
            )}
          </div>
        </div>

        {/* 퀵 커맨드 네비게이션 */}
        <div className="mt-3 pb-6 flex flex-wrap gap-3 px-1">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              disabled={isBooting || isProcessing}
              style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
              className="
                py-1.5 border border-[var(--grey-border)] text-[var(--grey-text)] text-xs font-mono uppercase tracking-widest
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
