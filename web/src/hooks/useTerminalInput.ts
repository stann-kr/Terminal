import { useState, useRef, useCallback } from "react";

export function useTerminalInput() {
  const [input, setInput] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const syncScroll = useCallback(() => {
    if (inputRef.current && overlayRef.current) {
      overlayRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  }, []);

  const clearInput = useCallback(() => {
    setInput("");
    setCursorPosition(0);
  }, []);

  return {
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
  };
}
