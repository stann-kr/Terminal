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

      // Step 3: 라인 단위 순차 렌더링 (40ms 간격)
      for (const termLine of lines) {
        setHistory((prev) => [...prev, termLine]);
        scrollToBottom();
        await new Promise<void>((r) => setTimeout(r, 40));
      }

      isTransitioningRef.current = false;
    },
    [setHistory, scrollToBottom],
  );

  return { transitionTo, isTransitioningRef };
}
