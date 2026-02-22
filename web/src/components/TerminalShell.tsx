"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  // 터미널 하단 고정 스크롤 (모바일 간헐적 중단 버그 수정 v0.32.1)
  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current) return;

    // 모바일 브라우저(특히 iOS Safari)에서 scrollIntoView와 수동 scrollTop 제어가 충돌하며
    // 큐(Queue)가 꼬이는 간헐적 버그가 발생함. 가장 확실한 scrollTop 방식으로 통일.
    const forceScroll = () => {
      const container = bottomRef.current?.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    // 1차 스크롤: 현재 렌더링 사이클 직후
    requestAnimationFrame(() => {
      forceScroll();

      // 2차 스크롤(Double Check): 비동기로 높이 계산이 늦어지는 모바일 DOM 대응
      setTimeout(forceScroll, 50);
    });
  }, []);

  /**
   * 공용 렌더링 함수: 여러 줄의 문자열을 한 글자씩 타이핑하듯 부드럽게 출력합니다.
   * system, error, success 등 컬러풀 비주얼은 라인 단위로 바로 출력하여 속도를 보장하고,
   * 일반 텍스트(output)는 타이핑 이펙트를 강하게 줍니다.
   */
  const renderLines = useCallback(
    async (linesToRender: TerminalLine[], fastMode = false) => {
      for (const line of linesToRender) {
        if (!isMounted.current) return;

        // [v0.32.0] 라인 시작 시점에 즉각 하단 고정
        scrollToBottom();

        if (line.type !== "output" && line.type !== "input") {
          const delay = fastMode
            ? Math.floor(Math.random() * 20) + 10
            : Math.floor(Math.random() * 50) + 20;
          await new Promise((r) => setTimeout(r, delay));
          if (!isMounted.current) return;
          setHistory((prev) => [...prev, line]);
          // 추가된 직후에도 스크롤 (라인 단위)
          scrollToBottom();
        } else {
          const newLineId = `idx-${Date.now()}-${Math.random()}`;
          setHistory((prev) => [...prev, { ...line, id: newLineId, text: "" }]);

          for (let i = 0; i <= line.text.length; i++) {
            if (!isMounted.current) return;
            setHistory((prev) =>
              prev.map((h) =>
                h.id === newLineId ? { ...h, text: line.text.slice(0, i) } : h,
              ),
            );

            // 긴 라인의 경우 캐릭터 타이핑 중에도 하단 유지 (약간의 여유를 둠)
            if (i % 5 === 0) {
              scrollToBottom();
            }

            const typingSpeed = fastMode
              ? Math.floor(Math.random() * 5) + 2
              : Math.floor(Math.random() * 20) + 10;
            await new Promise((r) => setTimeout(r, typingSpeed));
          }
          // 라인 종료 시 스크롤
          scrollToBottom();
        }
      }
    },
    [scrollToBottom],
  );

  // 브라우저 콘솔 이스터 에그 및 부팅 시퀀스
  useEffect(() => {
    isMounted.current = true;

    const EASTER_EGG_TEXT = `
  >> ACCESS GRANTED. WELCOME TO THE UNKNOWN SECTOR. <<
  >> MAIDEN VOYAGE <<
  >> You have discovered the hidden layer. Good job, traveler. <<
    `;
    console.log(`%c${EASTER_EGG_TEXT}`, "color: #ff4500; font-weight: bold;");

    const runBootSequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 부팅 문구 렌더링
      const bootLinesWithIds: TerminalLine[] = COMMAND_TEXTS.bootSequence.map(
        (item, idx) => ({
          id: `boot-${idx}-${Date.now()}`,
          text: item.text,
          type: item.type,
        }),
      );
      await renderLines(bootLinesWithIds, true);

      // 웰컴 메시지 및 도움말 출력
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (!isMounted.current) return;

      const { lines: helpLines } = processCommand("help");
      const welcomeLines: TerminalLine[] = COMMAND_TEXTS.welcomeMessage.map(
        (item, idx) => {
          if (typeof item === "string")
            return { id: `w-${idx}`, text: item, type: "output" };
          return { id: `w-${idx}`, text: item[0], type: item[1] as LineType };
        },
      );

      const combined = [...welcomeLines, ...helpLines];
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

  // 새 라인 추가 시 스크롤 하단 이동
  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

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

      // [추가] 명령어 실행 즉시 하단 공간 확보
      scrollToBottom();

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
    [isBooting, isProcessing, renderLines, scrollToBottom],
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
        <div
          className="flex-1 overflow-y-auto space-y-1 pb-4"
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
          <div ref={bottomRef} aria-hidden="true" />
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
                onFocus={() => scrollToBottom()}
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
              style={{ paddingLeft: "0.25rem", paddingRight: "0.25rem" }}
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
