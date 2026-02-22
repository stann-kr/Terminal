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

  /**
   * 공용 렌더링 함수: 여러 줄의 문자열을 한 글자씩 타이핑하듯 부드럽게 출력합니다.
   * system, error, success 등 컬러풀 비주얼은 라인 단위로 바로 출력하여 속도를 보장하고,
   * 일반 텍스트(output)는 타이핑 이펙트를 강하게 줍니다.
   */
  const renderLines = useCallback(
    async (linesToRender: TerminalLine[], fastMode = false) => {
      for (const line of linesToRender) {
        if (!isMounted.current) return;

        // 시스템, 에러 라인은 너무 느리면 답답하므로 통째로 렌더링하거나 아주 빠른 속도로 스킵
        if (line.type !== "output" && line.type !== "input") {
          const delay = fastMode
            ? Math.floor(Math.random() * 20) + 10
            : Math.floor(Math.random() * 50) + 20;
          await new Promise((r) => setTimeout(r, delay));
          if (!isMounted.current) return;
          setHistory((prev) => [...prev, line]);
        } else {
          // Output 라인은 한 글자씩 타이핑 효과
          const newLineId = `idx-${Date.now()}-${Math.random()}`;
          // 일단 빈 라인을 밀어넣음
          setHistory((prev) => [...prev, { ...line, id: newLineId, text: "" }]);

          // 한 글자씩 채워나감
          for (let i = 0; i <= line.text.length; i++) {
            if (!isMounted.current) return;
            setHistory((prev) =>
              prev.map((h) =>
                h.id === newLineId ? { ...h, text: line.text.slice(0, i) } : h,
              ),
            );
            const typingSpeed = fastMode
              ? Math.floor(Math.random() * 5) + 2
              : Math.floor(Math.random() * 20) + 10;
            await new Promise((r) => setTimeout(r, typingSpeed));
          }
        }
      }
    },
    [],
  );

  // 브라우저 콘솔 이스터 에그 및 부팅 시퀀스
  useEffect(() => {
    isMounted.current = true;
    console.log(EASTER_EGG, "color: #ff4500; font-weight: bold;");

    const runBootSequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 부팅 문구 렌더링
      const bootLinesWithIds = BOOT_LINES.map((item) => ({
        id: `boot-${Date.now()}-${Math.random()}`,
        text: item.text,
        type: item.type,
      }));
      await renderLines(bootLinesWithIds, true);

      // 웰컴 메시지 및 도움말 출력
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (!isMounted.current) return;
      const { lines } = processCommand("help");
      const combined = [...WELCOME_MESSAGES, ...lines];
      await renderLines(combined, true);

      if (isMounted.current) {
        setIsBooting(false);
      }
    };

    runBootSequence();

    return () => {
      isMounted.current = false;
    };
  }, [renderLines]);

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
    // 버튼, 링크, 입력창 등 개별 인터랙션이 필요한 요소를 직접 터치한 경우에는 강제 포커스 무시
    const target = e.target as HTMLElement;
    if (!target.closest("button, a, input") && !isBooting && !isProcessing) {
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

      // 결과 라인들을 통합 함수를 사용하여 한 글자씩 타이핑
      await renderLines(lines, false);

      if (!isMounted.current) return;
      setIsProcessing(false);
    },
    [isBooting, isProcessing, renderLines],
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
        <div className="mt-4 shrink-0 pb-2">
          <div className="border-t border-[#3a3a3a] pt-4 flex items-center gap-2 relative">
            <span className="text-[var(--orange)] font-bold text-sm select-none">
              &gt;
            </span>
            {/* 처리 중일 때: 단일 블록 커서 */}
            {(isBooting || isProcessing) && (
              <span className="cursor-blink w-2 h-4 bg-[var(--orange)] inline-block absolute left-[0.5rem]" />
            )}

            {/* 실제 폼과 입력창은 숨기기만 하고 DOM에서 제거하지 않음 */}
            <form
              onSubmit={handleSubmit}
              className={`flex-1 flex items-center transition-opacity duration-200 ${
                isBooting || isProcessing
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={scrollToBottom}
                onBlur={() => {
                  // iOS 15+ 에서는 interactiveWidget 속성이 레이아웃을 잡아주므로,
                  // 강제로 scrollTo(0,0)을 호출하면 오히려 뷰포트가 어긋나 로고 상단 여백이 남는 버그가 발생합니다.
                  // 따라서 별도의 스크롤 개입을 억제합니다.
                }}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="enter command..."
                className="
                    peer flex-1 bg-transparent border-none outline-none
                    font-mono text-sm text-[var(--grey-text)]
                    placeholder:text-[var(--grey-border)]
                    caret-transparent
                  "
              />
              <span
                className={`
                  cursor-blink w-2 h-4 bg-[var(--orange)] 
                  opacity-0 peer-focus:opacity-100 transition-opacity duration-100
                  ${input.length === 0 ? "absolute left-[0.5rem]" : "inline-block"}
                `}
              />
            </form>
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
