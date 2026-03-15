import { useCallback, useRef } from "react";
import type { TerminalLine } from "@/lib/types";

/**
 * Alien terminal 스타일 View 전환 훅
 * - 기존 콘텐츠 즉시 제거 → 짧은 딜레이 → 라인 단위 순차 렌더링
 */
export function useViewTransition(
  setHistory: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
  scrollToBottom: () => void,
) {
  const isTransitioningRef = useRef(false);

  const transitionTo = useCallback(
    async (lines: TerminalLine[]) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      // Step 1: 화면 즉시 클리어 (에일리언 터미널)
      setHistory([]);

      // Step 2: 짧은 딜레이 (~100ms)
      await new Promise<void>((r) => setTimeout(r, 100));

      // Step 3: use typeOutLines to type out the lines
      // We'll call typeOutLines but since we can't easily await the internal state of useTypingEngine if it's passed as a dependency,
      // it's easier to implement the typing effect here directly or accept typeOutLines as an argument.
      // Easiest is to accept `typeOutLines` as an argument to `useViewTransition`
      // For now, let's implement the typing logic here directly since it's meant to transition view.
      
      for (const termLine of lines) {
        if (!termLine.text || termLine.type === 'button') {
          // Buttons and empty lines appear instantly or quickly
          setHistory((prev) => [...prev, termLine]);
          scrollToBottom();
          await new Promise<void>((r) => setTimeout(r, 40));
          continue;
        }

        // Add empty line first
        const emptyLine = { ...termLine, text: "" };
        setHistory((prev) => [...prev, emptyLine]);

        const textLen = termLine.text.length;
        // Fast typing speed (e.g. 5ms per char)
        for (let i = 1; i <= textLen; i++) {
          setHistory((prev) => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = {
              ...termLine,
              text: termLine.text.slice(0, i),
            };
            return newHistory;
          });
          scrollToBottom();
          await new Promise<void>((r) => setTimeout(r, 5)); // 5ms typing speed
        }
        await new Promise<void>((r) => setTimeout(r, 10)); // tiny pause between lines
      }

      isTransitioningRef.current = false;
    },
    [setHistory, scrollToBottom],
  );

  return { transitionTo, isTransitioningRef };
}
