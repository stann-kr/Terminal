import { useRef, useCallback, useEffect } from "react";

export function useScrollManager() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // 컨테이너의 크기가 변경될 때(예: QuickCommands 등장으로 높이가 줄어들 때)
  // 스크롤이 하단에 유지되도록 ResizeObserver 사용
  useEffect(() => {
    const container = historyContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      scrollToBottom();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [scrollToBottom]);

  return {
    bottomRef,
    historyContainerRef,
    scrollToBottom,
  };
}
