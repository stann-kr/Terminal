import type { LanguageType, TerminalLine, CommandAction } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { supabase } from "../supabase";
import { parseContent, line, btn, fmtKstHm } from "../utils";

export interface LiveViewResult {
  lines: TerminalLine[];
  action?: CommandAction;
}

export async function liveView(
  lang: LanguageType,
  args?: string[],
): Promise<LiveViewResult> {
  const forceNode = args?.includes("--node") ?? false;

  let activeSession: { id: string; name: string } | null = null;

  try {
    const { data: sessions } = await supabase
      .from("live_sessions")
      .select("id, name, is_force_open, starts_at, ends_at")
      .is("closed_at", null)
      .order("is_force_open", { ascending: false })
      .order("created_at", { ascending: false });

    const now = new Date();
    activeSession =
      sessions?.find((s) => {
        if (s.is_force_open) return true;
        return (
          new Date(s.starts_at) <= now &&
          (!s.ends_at || new Date(s.ends_at) > now)
        );
      }) ?? null;
  } catch {
    // 세션 조회 실패
  }

  if (!activeSession) {
    let upcoming: Array<{
      name: string;
      starts_at: string;
      ends_at: string | null;
    }> = [];
    try {
      const { data } = await supabase
        .from("live_sessions")
        .select("name, starts_at, ends_at")
        .is("closed_at", null)
        .eq("is_force_open", false)
        .gt("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(3);
      upcoming = data ?? [];
    } catch {
      // ignore
    }

    return {
      lines: [
        ...parseContent(COMMAND_TEXTS.liveOffline(upcoming), lang),
        line("", "divider"),
        btn("> HOME", "home"),
        btn("> TRANSMIT", "transmit"),
      ],
    };
  }

  // 이름 미설정 처리
  if (!forceNode && typeof window !== "undefined") {
    const name = localStorage.getItem("terminal_name");
    if (!name) {
      const nodeId =
        localStorage.getItem("terminal_node_id") || "NODE-?????";
      return {
        lines: [
          ...parseContent(COMMAND_TEXTS.liveNoName(nodeId), lang),
          line("", "divider"),
          btn("> HOME", "home"),
        ],
      };
    }
  }

  // 최근 메시지 조회
  let recentLines: TerminalLine[] = [];
  try {
    const { data: recent } = await supabase
      .from("live_messages")
      .select("nick, message, created_at")
      .eq("session_id", activeSession.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (recent && recent.length > 0) {
      recentLines = [
        line(
          lang === "ko" ? "[ 최근 메시지 ]" : "[ RECENT MESSAGES ]",
          "system",
        ),
        ...recent
          .reverse()
          .map((msg) =>
            line(
              `[${fmtKstHm(new Date(msg.created_at))}] ${msg.nick}: ${msg.message}`,
              "live",
            ),
          ),
        line("", "divider"),
      ];
    }
  } catch {
    // ignore
  }

  return {
    lines: [
      ...parseContent(COMMAND_TEXTS.liveHeader(activeSession.name), lang),
      ...recentLines,
    ],
    action: {
      type: "ENTER_LIVE",
      sessionId: activeSession.id,
      sessionName: activeSession.name,
    },
  };
}
