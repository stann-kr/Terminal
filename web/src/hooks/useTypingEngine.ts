import { useState, useCallback } from "react";
import type { TerminalLine } from "@/lib/types";

export function useTypingEngine(
  setHistory: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
  scrollToBottom: () => void,
) {
  const [isTyping, setIsTyping] = useState(false);

  const typeOutLines = useCallback(
    async (linesToType: TerminalLine[]) => {
      if (linesToType.length === 0) return;
      setIsTyping(true);

      for (const line of linesToType) {
        if (!line.text) {
          setHistory((prev) => [...prev, line]);
          scrollToBottom();
          await new Promise((r) => setTimeout(r, 20));
          continue;
        }

        const isSystemOrOutput =
          line.type === "system" || line.type === "progress";
        const delayMs = isSystemOrOutput ? 6 : 8;

        const emptyLine = { ...line, text: "" };
        setHistory((prev) => [...prev, emptyLine]);

        for (let i = 0; i <= line.text.length; i++) {
          setHistory((prev) => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = {
              ...line,
              text: line.text.slice(0, i),
            };
            return newHistory;
          });
          scrollToBottom();
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }

      setIsTyping(false);
    },
    [setHistory, scrollToBottom],
  );

  return { isTyping, typeOutLines };
}
