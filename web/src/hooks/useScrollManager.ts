import { useRef, useCallback, useEffect } from "react";

export function useScrollManager() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((smooth = false) => {
    const container = historyContainerRef.current;
    if (!container) return;

    if (smooth) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      // 즉각적인 스크롤 (타이핑 애니메이션 시 떨림 방지용)
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // 컨테이너의 크기가 변경될 때 스크롤이 하단에 유지되도록 ResizeObserver 사용
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
