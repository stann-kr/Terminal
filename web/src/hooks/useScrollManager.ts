import { useRef, useCallback } from "react";

export function useScrollManager() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return {
    bottomRef,
    historyContainerRef,
    scrollToBottom,
  };
}
