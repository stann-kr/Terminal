import { useState, useRef, useCallback, useEffect } from "react";
import type { TerminalLine } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { uid } from "@/lib/commands/index";

export function useLiveChat(
  setHistory: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
  scrollToBottom: () => void,
) {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const liveChannelRef = useRef<any>(null);

  const enterLiveMode = useCallback(
    (sessionId: string) => {
      setIsLiveMode(true);
      setActiveSessionId(sessionId);
      const channel = supabase
        .channel(`live_session_${sessionId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "live_messages",
            filter: `session_id=eq.${sessionId}`,
          },
          (payload) => {
            const msg = payload.new as {
              nick: string;
              message: string;
              created_at: string;
            };
            const d = new Date(msg.created_at);
            const hh = String(d.getHours()).padStart(2, "0");
            const mm = String(d.getMinutes()).padStart(2, "0");
            setHistory((prev) => [
              ...prev,
              {
                id: `live-${uid()}`,
                text: `[${hh}:${mm}] ${msg.nick}: ${msg.message}`,
                type: "live" as TerminalLine["type"],
              },
            ]);
            scrollToBottom();
          },
        )
        .subscribe();
      liveChannelRef.current = channel;
    },
    [setHistory, scrollToBottom],
  );

  const leaveLiveMode = useCallback(() => {
    if (liveChannelRef.current) {
      supabase.removeChannel(liveChannelRef.current);
      liveChannelRef.current = null;
    }
    setIsLiveMode(false);
    setActiveSessionId(null);
  }, []);

  useEffect(() => {
    return () => {
      if (liveChannelRef.current) {
        supabase.removeChannel(liveChannelRef.current);
      }
    };
  }, []);

  return { isLiveMode, activeSessionId, enterLiveMode, leaveLiveMode };
}
