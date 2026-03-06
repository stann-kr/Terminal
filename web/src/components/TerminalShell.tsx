"use client";

import React, { useState } from "react";
import type { TerminalLine } from "@/lib/types";
import { AVAILABLE_COMMANDS } from "@/lib/constants";

import { useScrollManager } from "@/hooks/useScrollManager";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useTerminalInput } from "@/hooks/useTerminalInput";
import { useBoot } from "@/hooks/useBoot";
import { useLiveChat } from "@/hooks/useLiveChat";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { useQuickCommands } from "@/hooks/useQuickCommands";
import { useCommandExecution } from "@/hooks/useCommandExecution";
import { useTypeAndExecute } from "@/hooks/useTypeAndExecute";
import TerminalHistory from "./TerminalHistory";
import TerminalInput from "./TerminalInput";
import QuickCommands from "./QuickCommands";

export default function TerminalShell() {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const isAnimatingRef = React.useRef(false);
  const [isAnimatingInput, setIsAnimatingInput] = useState(false);

  const { bottomRef, historyContainerRef, scrollToBottom } = useScrollManager();

  const { isTyping, typeOutLines } = useTypingEngine(
    setHistory,
    scrollToBottom,
  );

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
  } = useTerminalInput();

  const { isLiveMode, activeSessionId, enterLiveMode, leaveLiveMode } =
    useLiveChat(setHistory, scrollToBottom);

  const [quickCmdContext, setQuickCmdContext] = useState<string | null>(null);

  const { isBooting, isInitialized, language, handleLanguageSelection } =
    useBoot(setHistory, typeOutLines, scrollToBottom, setQuickCmdContext);

  useAnnouncement(language, isBooting, setHistory);

  const { displayedCommands, isCmdsFading } = useQuickCommands(
    isLiveMode,
    language,
    input,
    isAnimatingInput,
    quickCmdContext,
  );

  const { handleCommand, pendingFlowRef } = useCommandExecution(
    language,
    isLiveMode,
    activeSessionId,
    setHistory,
    typeOutLines,
    setCommandHistory,
    setHistoryIndex,
    scrollToBottom,
    enterLiveMode,
    leaveLiveMode,
    setQuickCmdContext,
    handleLanguageSelection,
    isAnimatingRef,
  );

  const { typeAndExecute } = useTypeAndExecute(
    setInput,
    setCursorPosition,
    scrollToBottom,
    handleCommand,
    setIsAnimatingInput,
    isAnimatingRef,
    setQuickCmdContext,
    inputRef,
  );

  const isInputVisible =
    isInitialized && (language === null || (!isBooting && !isTyping));
  const isInputActive = isInputVisible && !isAnimatingInput;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
    setCursorPosition(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[commandHistory.length - 1 - nextIndex] ?? "");
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
      const val = (e.target as HTMLInputElement).value
        .trimStart()
        .toLowerCase();
      if (!val) return;
      const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(val));
      if (match && match !== val) {
        setInput(match);
        setCursorPosition(match.length);
      }
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.tagName.toLowerCase() === "input"
    ) {
      return;
    }
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;

    if (
      isInputActive &&
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  const nodeId =
    typeof window !== "undefined"
      ? localStorage.getItem("terminal_node_id") || "unknown"
      : "unknown";

  return (
    <div
      className="terminal-center cursor-text screen-flicker"
      onClick={handleContainerClick}
    >
      <div className="terminal-box gap-y-0">
        <TerminalHistory
          historyContainerRef={historyContainerRef}
          history={history}
          bottomRef={bottomRef}
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
          language={language}
          scrollToBottom={scrollToBottom}
        />

        <QuickCommands
          isInputActive={isInputActive}
          isCmdsFading={isCmdsFading}
          displayedCommands={displayedCommands}
          handleCommand={handleCommand}
          isLiveMode={isLiveMode}
          isAnimatingRef={isAnimatingRef}
          setIsAnimatingInput={setIsAnimatingInput}
          setQuickCmdContext={setQuickCmdContext}
          setInput={setInput}
          inputRef={inputRef}
          typeAndExecute={typeAndExecute}
          quickCmdContext={quickCmdContext}
          pendingFlowRef={pendingFlowRef}
          nodeId={nodeId}
          isInputVisible={isInputVisible}
        />
      </div>
    </div>
  );
}
