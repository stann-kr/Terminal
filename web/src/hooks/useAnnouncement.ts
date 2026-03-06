import { useState, useRef, useEffect } from "react";
import type { TerminalLine, LanguageType, ContentItem } from "@/lib/types";
import { COMMAND_TEXTS } from "@/lib/texts";
import { supabase } from "@/lib/supabase";
import { uid } from "@/lib/commands/index";

export function useAnnouncement(
  language: LanguageType | null,
  isBooting: boolean,
  setHistory: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
) {
  const [announcementMsg, setAnnouncementMsg] = useState<string | null>(null);
  const [lastShownAnnouncement, setLastShownAnnouncement] = useState<
    string | null
  >(null);
  const pendingAnnouncementRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fetchAnnouncement = async () => {
      try {
        const { data } = await supabase
          .from("app_config")
          .select("value")
          .eq("key", "announcement")
          .single();
        if (data && data.value) setAnnouncementMsg(data.value);
      } catch (err) {
        console.error("Failed to fetch initial announcement", err);
      }
    };
    fetchAnnouncement();

    const channel = supabase
      .channel("app_config_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "app_config",
          filter: "key=eq.announcement",
        },
        (payload) => {
          const val =
            payload.new && "value" in payload.new ? payload.new.value : null;
          setAnnouncementMsg(val);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (
      announcementMsg &&
      language !== null &&
      !isBooting &&
      announcementMsg !== lastShownAnnouncement
    ) {
      setLastShownAnnouncement(announcementMsg);
      pendingAnnouncementRef.current = announcementMsg;
      const bannerItems = COMMAND_TEXTS.announcementBanner(
        pendingAnnouncementRef.current,
      )[language];
      setHistory((prev) => [
        ...prev,
        ...bannerItems.map((item: ContentItem) => ({
          id: `ann-${uid()}`,
          text: typeof item === "string" ? item : item[0],
          type: (typeof item === "string"
            ? "output"
            : item[1]) as TerminalLine["type"],
        })),
      ]);
      pendingAnnouncementRef.current = null;
    }
  }, [announcementMsg, language, isBooting, lastShownAnnouncement, setHistory]);

  return { announcementMsg };
}
