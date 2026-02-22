"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type TerminalLine, processCommand } from "@/lib/commands";
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
  >> MAIDEN VOYAGE — 2026.03.07 / CLUB FAUST, SEOUL <<
  >> You have discovered the hidden layer. Good job, traveler. <<
`;

/** 초기 환영 메시지 */
const WELCOME_LINES: TerminalLine[] = [
  {
    id: "w-0",
    text: "─────────────────────────────────────────",
    type: "system",
  },
  {
    id: "w-1",
    text: "  TERMINAL [01] — ACCESS GRANTED",
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
  {
    id: "w-4",
    text: "  TERMINAL [01] / COMMAND INDEX",
    type: "system",
  },
  {
    id: "w-5",
    text: "─────────────────────────────────────────",
    type: "system",
  },
  {
    id: "w-6",
    text: "  lineup   — 아티스트 라인업 조회",
    type: "output",
  },
  {
    id: "w-7",
    text: "  gate     — 게이트(장소/일시) 정보",
    type: "output",
  },
  {
    id: "w-8",
    text: "  status   — 시스템 가동 상태 확인",
    type: "output",
  },
  {
    id: "w-9",
    text: "  link     — 외부 연결 링크 제공",
    type: "output",
  },
  {
    id: "w-10",
    text: "  clear    — 터미널 출력 초기화",
    type: "output",
  },
  {
    id: "w-11",
    text: "─────────────────────────────────────────",
    type: "system",
  },
];

const LINE_COLOR: Record<TerminalLine["type"], string> = {
  system: "text-[#3a3a3a]",
  output: "text-[#c8c8c8]",
  success: "text-[#ff4500]",
  error: "text-[#ff6b6b]",
  input: "text-[#8a8a8a]",
  link: "text-[#c8c8c8] hover:text-[#ff4500] hover:underline cursor-pointer transition-colors",
};

/**
 * 터미널 셸 컴포넌트.
 * 부팅 완료 후 렌더링되며, 로고 + 출력 히스토리 + 입력창으로 구성됩니다.
 */
export default function TerminalShell() {
  const [history, setHistory] = useState<TerminalLine[]>(WELCOME_LINES);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 이스터 에그 콘솔 출력
  useEffect(() => {
    console.log(EASTER_EGG, "color: #ff4500; font-weight: bold;");
  }, []);

  // 새 라인 추가 시 스크롤 하단 이동
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // iOS Safari 가상 키보드 높이 동적 대응 (100dvh 버그 방지)
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        // visualViewport 높이에 맞춰 body 높이를 강제 고정하여 키보드가 뷰포트를 가리는 것을 밀어냄
        document.body.style.height = `${window.visualViewport.height}px`;
        window.scrollTo(0, 0);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", handleResize);
      handleResize(); // 초기화
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleResize);
      }
      document.body.style.height = ""; // 클린업
    };
  }, []);

  // 화면 클릭 시 입력창 포커스
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  /**
   * 명령어 제출 처리
   * @param e - 폼 제출 이벤트
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input.trim();
      if (!cmd) return;

      // 입력 히스토리 저장
      setCmdHistory((prev) => [cmd, ...prev]);
      setHistoryIndex(-1);

      // 입력창에 표시될 라인
      const inputLine: TerminalLine = {
        id: `in-${Date.now()}`,
        text: `> ${cmd}`,
        type: "input",
      };

      const { lines, shouldClear } = processCommand(cmd);

      setHistory((prev) => (shouldClear ? [] : [...prev, inputLine, ...lines]));
      setInput("");
    },
    [input],
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
      <div className="terminal-box">
        {/* 로고 */}
        <div className="mb-6 shrink-0">
          <div className="glitch-container fade-in" data-text="">
            <Logo />
          </div>
          <p className="text-[#6a6a6a] text-xs mt-3 tracking-widest">
            THE UNIVERSAL JOURNEY OF STANN LUMO
          </p>
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
            return (
              <p
                key={line.id}
                className={`font-mono text-sm leading-relaxed break-all ${LINE_COLOR[line.type]}`}
              >
                {line.text}
              </p>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* 입력창 */}
        <div className="mt-4 shrink-0 pb-2">
          <div className="border-t border-[#3a3a3a] pt-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-[#ff4500] font-bold text-sm select-none">
                &gt;
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  // 키보드가 닫혔을 때 빈 공간이 남는 iOS 버그 복구
                  setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                  }, 10);
                }}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="enter command..."
                className="
                  flex-1 bg-transparent border-none outline-none
                  font-mono text-sm text-[#c8c8c8]
                  placeholder:text-[#3a3a3a]
                  caret-[#ff4500]
                "
              />
              <span className="cursor-blink" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
