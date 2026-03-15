"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  LanguageType,
  TerminalLine,
  ViewType,
  CommandAction,
} from "@/lib/types";
import { useScrollManager } from "@/hooks/useScrollManager";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useViewTransition } from "@/hooks/useViewTransition";
import { useNavigation } from "@/hooks/useNavigation";
import { useBoot } from "@/hooks/useBoot";
import { useLiveChat } from "@/hooks/useLiveChat";
import { useTerminalInput } from "@/hooks/useTerminalInput";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { loadView, COMMAND_TO_VIEW } from "@/lib/views";
import { processCommand } from "@/lib/commands";
import { supabase } from "@/lib/supabase";
import { line } from "@/lib/utils";
import TerminalHistory from "./TerminalHistory";
import TerminalInput from "./TerminalInput";

/** 뷰 전환을 유발하는 명령어 집합 (args 없이 단독 실행 시) */
const VIEW_NAV_CMDS = new Set(Object.keys(COMMAND_TO_VIEW));

export default function TerminalShell() {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [language, setLanguage] = useState<LanguageType | null>(null);
  const [isTransmitMode, setIsTransmitMode] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);

  // 언어 ref — 콜백 내부에서 최신 language 참조용
  const languageRef = useRef<LanguageType | null>(null);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const { currentView, navigateTo } = useNavigation();
  const { bottomRef, historyContainerRef, scrollToBottom } = useScrollManager();
  const { typeOutLines } = useTypingEngine(setHistory, scrollToBottom);
  const { transitionTo } = useViewTransition(setHistory, scrollToBottom);
  const { isLiveMode, activeSessionId, enterLiveMode, leaveLiveMode } =
    useLiveChat(setHistory, scrollToBottom);

  const {
    input,
    setInput,
    cursorPosition,
    setCursorPosition,
    commandHistory,
    setCommandHistory,
    historyIndex,
    setHistoryIndex,
    inputRef,
    overlayRef,
    syncScroll,
    clearInput,
  } = useTerminalInput();

  // ── 테마 초기화 ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("terminal_theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  // ── 액션 처리 ─────────────────────────────────────────────────────────────
  const handleAction = useCallback(
    (action: CommandAction) => {
      switch (action.type) {
        case "ENTER_LIVE":
          enterLiveMode(action.sessionId);
          setIsTransmitMode(false);
          break;
        case "EXIT_LIVE":
          leaveLiveMode();
          break;
        case "CHANGE_LANG":
          setLanguage(action.payload);
          if (typeof window !== "undefined") {
            localStorage.setItem("terminal_lang", action.payload);
            document.documentElement.lang = action.payload;
          }
          break;
        case "CHANGE_THEME":
          if (typeof window !== "undefined") {
            document.documentElement.setAttribute("data-theme", action.payload);
            localStorage.setItem("terminal_theme", action.payload);
          }
          break;
        case "RESET":
          setHistory([]);
          setLanguage(null);
          setIsTransmitMode(false);
          setIsInputVisible(false);
          setIsInputActive(false);
          leaveLiveMode();
          if (typeof window !== "undefined") {
            localStorage.removeItem("terminal_lang");
            localStorage.removeItem("terminal_user_type");
            localStorage.removeItem("terminal_admin");
            localStorage.removeItem("terminal_name");
            localStorage.removeItem("terminal_theme");
            document.documentElement.removeAttribute("data-theme");
          }
          resetBoot();
          break;
      }
    },
    [enterLiveMode, leaveLiveMode],
  );

  // ── 뷰 내비게이션 ─────────────────────────────────────────────────────────
  const navigateToView = useCallback(
    async (view: ViewType, args?: string[]) => {
      const lang = languageRef.current;
      if (!lang) return;
      setIsTransmitMode(false);

      const result = await loadView(view, lang, args);
      await transitionTo(result.lines);
      navigateTo(view);

      if (result.action) handleAction(result.action);
      if (result.isTransmitMode) setIsTransmitMode(true);
    },
    [transitionTo, navigateTo, handleAction],
  );

  // ── 부팅 완료 콜백 ────────────────────────────────────────────────────────
  const onBootComplete = useCallback(
    (lang: LanguageType) => {
      setLanguage(lang);
      setIsInputVisible(true);
      setIsInputActive(true);
      setTimeout(() => {
        navigateToView("home");
      }, 800);
    },
    [navigateToView],
  );

  const {
    isBooting,
    language: bootLanguage,
    handleLanguageSelection,
    resetBoot,
  } = useBoot(setHistory, typeOutLines, scrollToBottom, onBootComplete);

  // boot 언어가 바뀌면 동기화 (RESET 없이 언어 재선택 시)
  useEffect(() => {
    if (bootLanguage !== null && bootLanguage !== languageRef.current) {
      setLanguage(bootLanguage);
    }
  }, [bootLanguage]);

  useAnnouncement(language, isBooting, setHistory);

  // ── Live 메시지 전송 ──────────────────────────────────────────────────────
  const sendLiveMessage = useCallback(
    async (message: string) => {
      if (!activeSessionId || !languageRef.current) return;
      const lang = languageRef.current;
      const nick =
        typeof window !== "undefined"
          ? localStorage.getItem("terminal_name") ||
            localStorage.getItem("terminal_node_id") ||
            "unknown"
          : "unknown";
      try {
        const { error } = await supabase
          .from("live_messages")
          .insert([{ session_id: activeSessionId, nick, message }]);
        if (error) throw error;
      } catch {
        setHistory((prev) => [
          ...prev,
          line(
            lang === "ko"
              ? "[ ERR ] 메시지 전송 실패."
              : "[ ERR ] Failed to send message.",
            "error",
          ),
        ]);
      }
    },
    [activeSessionId],
  );

  // ── Transmit 메시지 전송 ──────────────────────────────────────────────────
  const sendTransmitMessage = useCallback(
    async (message: string) => {
      const lang = languageRef.current ?? "en";
      const name =
        typeof window !== "undefined"
          ? localStorage.getItem("terminal_name") ||
            localStorage.getItem("terminal_node_id") ||
            "unknown"
          : "unknown";
      const device_id =
        typeof window !== "undefined"
          ? localStorage.getItem("terminal_node_id")
          : null;
      const user_agent =
        typeof window !== "undefined" ? navigator.userAgent : null;

      const savingId = `saving-${Date.now()}`;
      setHistory((prev) => [
        ...prev,
        {
          id: savingId,
          text: lang === "ko" ? "[ ... ] 저장 중..." : "[ ... ] Saving...",
          type: "system",
        },
      ]);

      try {
        const { error } = await supabase
          .from("guestbook")
          .insert([{ name, message, device_id, user_agent }]);
        if (error) throw error;
        setHistory((prev) =>
          prev.map((l) =>
            l.id === savingId
              ? {
                  ...l,
                  text:
                    lang === "ko" ? "[ OK ] 전송 완료." : "[ OK ] Message sent.",
                  type: "success" as const,
                }
              : l,
          ),
        );
      } catch {
        setHistory((prev) =>
          prev.map((l) =>
            l.id === savingId
              ? {
                  ...l,
                  text:
                    lang === "ko" ? "[ ERR ] 전송 실패." : "[ ERR ] Failed to save.",
                  type: "error" as const,
                }
              : l,
          ),
        );
      }
      scrollToBottom();
    },
    [scrollToBottom],
  );

  // ── 입력 처리 ─────────────────────────────────────────────────────────────
  const handleInput = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      clearInput();

      const lang = languageRef.current;

      // Live 모드: /leave 또는 메시지 전송
      if (isLiveMode) {
        if (trimmed === "/leave") {
          leaveLiveMode();
          setHistory((prev) => [
            ...prev,
            line(
              lang === "ko"
                ? "[ LIVE ] 세션을 종료했습니다."
                : "[ LIVE ] Session ended.",
              "system",
            ),
          ]);
          setTimeout(() => navigateToView("home"), 400);
        } else {
          await sendLiveMessage(trimmed);
        }
        return;
      }

      // 언어 선택 (첫 부팅)
      if (lang === null) {
        if (trimmed === "1") {
          handleLanguageSelection("en");
        } else if (trimmed === "2") {
          handleLanguageSelection("ko");
        } else {
          setHistory((prev) => [
            ...prev,
            line("↑  Type 1 (EN) or 2 (KO)", "error"),
          ]);
        }
        return;
      }

      // 입력 에코
      setHistory((prev) => [...prev, line(`> ${trimmed}`, "input")]);

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      // transmit 뷰 명령어 (args 있으면 직접 전송, 없으면 뷰 전환)
      if (cmd === "transmit") {
        if (args.length > 0) {
          await sendTransmitMessage(args.join(" "));
        } else {
          await navigateToView("transmit");
        }
        return;
      }

      // transmit 모드: 뷰 명령어가 아니면 메시지로 처리
      if (isTransmitMode && !VIEW_NAV_CMDS.has(cmd)) {
        // 입력 에코 되돌림 — 이미 에코됨
        await sendTransmitMessage(trimmed);
        return;
      }

      // 뷰 탐색 명령어
      if (COMMAND_TO_VIEW[cmd]) {
        await navigateToView(COMMAND_TO_VIEW[cmd], args);
        return;
      }

      // clear
      if (cmd === "clear") {
        setHistory([]);
        return;
      }

      // 유틸리티 명령어 (processCommand)
      const result = await processCommand(trimmed, lang);
      if (result.shouldClear) {
        setHistory([]);
      } else if (result.lines.length > 0) {
        setHistory((prev) => [...prev, ...result.lines]);
      }
      if (result.action) handleAction(result.action);
      scrollToBottom();
    },
    [
      isLiveMode,
      isTransmitMode,
      handleLanguageSelection,
      navigateToView,
      leaveLiveMode,
      sendLiveMessage,
      sendTransmitMessage,
      handleAction,
      scrollToBottom,
      clearInput,
    ],
  );

  // ── 버튼 클릭 ─────────────────────────────────────────────────────────────
  const handleButtonClick = useCallback(
    (cmd: string) => {
      handleInput(cmd);
    },
    [handleInput],
  );

  // ── 폼 제출 ───────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      setCommandHistory((prev) => [...prev, input.trim()]);
      setHistoryIndex(-1);
      handleInput(input);
    },
    [input, handleInput, setCommandHistory, setHistoryIndex],
  );

  // ── 키 다운 (방향키 히스토리) ─────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(
          commandHistory[commandHistory.length - 1 - newIndex] ?? "",
        );
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex <= 0) {
          setHistoryIndex(-1);
          setInput("");
          return;
        }
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(
          commandHistory[commandHistory.length - 1 - newIndex] ?? "",
        );
      }
    },
    [commandHistory, historyIndex, setHistoryIndex, setInput],
  );

  // ── 렌더 ─────────────────────────────────────────────────────────────────
  return (
    <div className="terminal-center">
      <div className="terminal-box">
        <TerminalHistory
          historyContainerRef={historyContainerRef}
          history={history}
          bottomRef={bottomRef}
          onButtonClick={handleButtonClick}
        />
        <TerminalInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          handleKeyDown={handleKeyDown}
          isInputVisible={isInputVisible}
          isInputActive={isInputActive}
          inputRef={inputRef}
          overlayRef={overlayRef}
          cursorPosition={cursorPosition}
          setCursorPosition={setCursorPosition}
          syncScroll={syncScroll}
          isLiveMode={isLiveMode}
          isTransmitMode={isTransmitMode}
          language={language}
          scrollToBottom={scrollToBottom}
        />
      </div>
    </div>
  );
}
