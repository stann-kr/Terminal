/**
 * TERMINAL [01] — CLI 명령어 처리기
 *
 * 각 명령어는 TerminalLine 배열을 반환합니다.
 * 명령어 출력 텍스트의 실제 데이터는 './command-text' 파일에서 관리됩니다.
 */

import { COMMAND_TEXTS } from "./command-text";
import type {
  LineType,
  LanguageType,
  I18nContentItem,
} from "./command-text";
import { supabase } from "./supabase";

export type { LineType, LanguageType } from "./command-text";

export interface TerminalLine {
  id: string;
  text: string;
  type: LineType;
  url?: string;
}

export type CommandAction =
  | { type: "CHANGE_LANG"; payload: "en" | "ko" }
  | { type: "CHANGE_THEME"; payload: "dark" | "light" }
  | { type: "RESET" }
  | { type: "ENTER_LIVE"; sessionId: string; sessionName: string }
  | { type: "EXIT_LIVE" }
  | { type: "LIVE_NO_NAME_CHOICE" };

export interface CommandResult {
  lines: TerminalLine[];
  shouldClear?: boolean;
  action?: CommandAction;
}

/** 고유 ID 생성 유틸리티 */
export const uid = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** 유저가 <name> 형태로 입력했을 때 꺾쇠 자동 제거 */
const stripBrackets = (str: string): string => str.replace(/^<|>$/g, "");

/** 꺾쇠 기호 포함 여부 확인 */
const hasBrackets = (str: string): boolean => /[<>]/.test(str);

/** Intl.DateTimeFormat formatToParts 헬퍼 */
const kstParts = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", ...opts }).formatToParts(d);
const getPart = (parts: Intl.DateTimeFormatPart[], type: string) =>
  parts.find((p) => p.type === type)?.value ?? "00";

/** KST 기준 HH:mm (live 채팅 타임스탬프) */
const fmtKstHm = (d: Date) => {
  const p = kstParts(d, { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${getPart(p, "hour")}:${getPart(p, "minute")}`;
};

/** KST 기준 yy-MM-dd HH:mm (transmit 목록) */
const fmtKstFull = (d: Date) => {
  const p = kstParts(d, { year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  return `${getPart(p, "year")}-${getPart(p, "month")}-${getPart(p, "day")} ${getPart(p, "hour")}:${getPart(p, "minute")}`;
};

/** lang 기반 현재 KST 타임스탬프 (date/time/status 명령어용) */
const getTimestamp = (lang: LanguageType) =>
  new Date().toLocaleString(lang === "ko" ? "ko-KR" : "en-CA", {
    timeZone: "Asia/Seoul",
    hour12: false,
  });

/** 꺾쇠 자동 제거 시스템 로그 라인 생성 */
const bracketNotice = (lang: LanguageType): TerminalLine =>
  line(
    lang === "ko"
      ? "[ SYS ] 꺾쇠 기호(<>)가 감지되어 자동으로 제거 후 처리되었습니다."
      : "[ SYS ] Angle brackets detected and stripped automatically.",
    "system",
  );

/** 단일 라인 생성 헬퍼 */
const line = (
  text: string,
  type: LineType = "output",
  url?: string,
): TerminalLine => ({
  id: uid(),
  text,
  type,
  url,
});

/**
 * 선언적 콘텐츠(ContentItem) 배열을 TerminalLine 객체 배열로 변환하는 유틸리티
 */
const parseContent = (
  items: I18nContentItem,
  lang: LanguageType,
): TerminalLine[] => {
  return items[lang].map((item) => {
    // 문자열인 경우 기본 output 타입
    if (typeof item === "string") return line(item, "output");
    // 배열인 경우 [text, type, url?] 매핑
    return line(item[0], item[1] as LineType, item[2]);
  });
};

/** 명령어 → 응답 라인 매핑 (비즈니스 로직 및 텍스트 데이터 파싱) */
const COMMAND_MAP: Record<
  string,
  (
    args: string[],
    lang: LanguageType,
  ) => TerminalLine[] | CommandResult | Promise<TerminalLine[] | CommandResult>
> = {
  // 정적 콘텐츠 매핑
  help: (_, lang) => parseContent(COMMAND_TEXTS.help, lang),
  commands: (_, lang) => parseContent(COMMAND_TEXTS.commands, lang),
  about: (_, lang) => parseContent(COMMAND_TEXTS.about, lang),
  lineup: (_, lang) => parseContent(COMMAND_TEXTS.lineup, lang),
  link: (_, lang) => parseContent(COMMAND_TEXTS.link, lang),
  voyage: (_, lang) => parseContent(COMMAND_TEXTS.voyage, lang),
  systems: (_, lang) => {
    const isAdmin =
      typeof window !== "undefined" &&
      localStorage.getItem("terminal_admin") === "true";
    return parseContent(COMMAND_TEXTS.systems(isAdmin), lang);
  },
  gate: (_, lang) => parseContent(COMMAND_TEXTS.gate, lang),
  event: (_, lang) => parseContent(COMMAND_TEXTS.event, lang),

  settings: (args, lang) => {
    if (!args || args.length === 0) {
      if (lang === "ko") {
        return [
          line("TERMINAL SETTINGS", "header"),
          line("사용법:", "system"),
          line("  settings lang [ko|en]      - 언어 변경", "output"),
          line("  settings theme [dark|light] - 테마 변경", "output"),
          line("  settings reset              - 모든 설정 초기화", "output"),
          line("", "divider"),
        ];
      }
      return [
        line("TERMINAL SETTINGS", "header"),
        line("Usage:", "system"),
        line("  settings lang [ko|en]      - Change language", "output"),
        line("  settings theme [dark|light] - Change theme", "output"),
        line("  settings reset              - Reset all settings", "output"),
        line("", "divider"),
      ];
    }

    const subCmd = args[0]?.toLowerCase();
    const val = args[1]?.toLowerCase();

    if (subCmd === "lang") {
      if (val === "ko" || val === "en") {
        return {
          lines: [
            line(`Language set to: ${val.toUpperCase()}`, "success"),
            line("", "divider"),
          ],
          action: { type: "CHANGE_LANG", payload: val as "ko" | "en" },
        };
      }
      return [line(`Invalid language: ${val}. Use 'ko' or 'en'.`, "error")];
    }

    if (subCmd === "theme") {
      if (val === "dark" || val === "light") {
        return {
          lines: [
            line(`Theme set to: ${val.toUpperCase()}`, "success"),
            line("", "divider"),
          ],
          action: { type: "CHANGE_THEME", payload: val as "dark" | "light" },
        };
      }
      return [line(`Invalid theme: ${val}. Use 'dark' or 'light'.`, "error")];
    }

    if (subCmd === "reset") {
      return {
        lines: [
          line(
            lang === "ko"
              ? "모든 설정을 초기화하고 리로드합니다..."
              : "Resetting all settings and reloading...",
            "system",
          ),
        ],
        action: { type: "RESET" },
        shouldClear: true,
      };
    }

    return [line(`Unknown settings option: ${subCmd}`, "error")];
  },

  // 동적 콘텐츠 매핑
  status: (_, lang) => {
    const now = new Date();
    const timestamp = getTimestamp(lang);
    const eventDate = new Date("2026-03-07T00:00:00+09:00");
    const diffMs = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const dDay =
      diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? "D-DAY" : "LAUNCHED";
    return parseContent(COMMAND_TEXTS.status(timestamp, dDay), lang);
  },

  whois: (args, lang) => {
    const raw = args?.[0] ?? "";
    const target = stripBrackets(raw).toLowerCase();
    const notice = hasBrackets(raw) ? [bracketNotice(lang)] : [];

    if (!target) {
      return [
        line(
          lang === "ko"
            ? "사용법 : whois <name>"
            : "usage : whois <name>",
          "error",
        ),
      ];
    }
    if (target === "stann" || target === "stannlumo") {
      return [...notice, ...parseContent(COMMAND_TEXTS.whoisStann(), lang)];
    }
    if (target === "marcus" || target === "marcusl") {
      return [...notice, ...parseContent(COMMAND_TEXTS.whoisMarcus(), lang)];
    }
    if (target === "nusnoom") {
      return [...notice, ...parseContent(COMMAND_TEXTS.whoisNusnoom(), lang)];
    }
    return [...notice, ...parseContent(COMMAND_TEXTS.whoisUnknown(target), lang)];
  },

  whoami: (_, lang) => {
    let nodeId = "unknown";
    let name: string | undefined;
    let isAdmin = false;
    if (typeof window !== "undefined") {
      nodeId = localStorage.getItem("terminal_node_id") || "unknown";
      name = localStorage.getItem("terminal_name") ?? undefined;
      isAdmin = localStorage.getItem("terminal_admin") === "true";
    }
    return parseContent(COMMAND_TEXTS.whoami(nodeId, name, isAdmin), lang);
  },

  name: (args, lang) => {
    const value = args.join(" ").trim();
    if (!value) {
      if (typeof window !== "undefined") {
        const current = localStorage.getItem("terminal_name");
        if (current) return parseContent(COMMAND_TEXTS.nameCurrent(current), lang);
      }
      return parseContent(COMMAND_TEXTS.nameEmpty, lang);
    }
    if (value.toLowerCase() === "clear") {
      let nodeId = "unknown";
      if (typeof window !== "undefined") {
        localStorage.removeItem("terminal_name");
        nodeId = localStorage.getItem("terminal_node_id") || "unknown";
      }
      return parseContent(COMMAND_TEXTS.nameCleared(nodeId), lang);
    }
    if (value.length > 20) return parseContent(COMMAND_TEXTS.nameInvalid, lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("terminal_name", value);
    }
    return parseContent(COMMAND_TEXTS.nameSet(value), lang);
  },

  sudo: (args, lang) => {
    if (
      args &&
      args[0]?.toLowerCase() === "login" &&
      args[1]?.toLowerCase() === "stann"
    ) {
      return parseContent(COMMAND_TEXTS.sudoStann(), lang);
    }
    return parseContent(COMMAND_TEXTS.sudoError(), lang);
  },

  echo: (args, lang) => {
    if (!args || args.length === 0) {
      return parseContent(COMMAND_TEXTS.echoError(), lang);
    }
    return parseContent(COMMAND_TEXTS.echoOutput(args.join(" ")), lang);
  },

  date: (_, lang) => parseContent(COMMAND_TEXTS.dateTime(getTimestamp(lang)), lang),
  time: (_, lang) => parseContent(COMMAND_TEXTS.dateTime(getTimestamp(lang)), lang),
  ping: (_, lang) => parseContent(COMMAND_TEXTS.ping, lang),
  scan: (_, lang) => parseContent(COMMAND_TEXTS.weather, lang),
  weather: (_, lang) => parseContent(COMMAND_TEXTS.weather, lang),
  matrix: (_, lang) => parseContent(COMMAND_TEXTS.matrix, lang),
  history: (_, lang) => {
    const isAdmin =
      typeof window !== "undefined" &&
      localStorage.getItem("terminal_admin") === "true";
    return parseContent(
      isAdmin ? COMMAND_TEXTS.historyAdmin : COMMAND_TEXTS.history,
      lang,
    );
  },

  transmit: async (args, lang) => {
    const texts = COMMAND_TEXTS.transmit[lang];
    const PAGE_SIZE = 10;

    // 페이지 조회 모드 (히든): transmit <숫자>
    const isPageArg = args.length === 1 && /^\d+$/.test(args[0]);

    // 작성 모드
    // - transmit <name> <message> : 명시적 name 사용 (기존)
    // - transmit <message>        : terminal_name || nodeId 자동 사용 (닉네임 연동)
    if (args.length >= 1 && !isPageArg) {
      let senderName: string;
      let message: string;
      const notice: TerminalLine[] = [];

      if (args.length === 1) {
        // 1-arg: message, 이름은 자동
        let autoName = "unknown";
        if (typeof window !== "undefined") {
          autoName =
            localStorage.getItem("terminal_name") ||
            localStorage.getItem("terminal_node_id") ||
            "unknown";
        }
        senderName = autoName;
        message = stripBrackets(args[0]);
        if (hasBrackets(args[0])) notice.push(bracketNotice(lang));
      } else {
        // 2-arg 이상: 첫 인자 = name, 나머지 = message (기존)
        const rawName = args[0];
        senderName = stripBrackets(rawName);
        message = args.slice(1).join(" ").trim();
        if (hasBrackets(rawName)) notice.push(bracketNotice(lang));
      }

      if (!message) {
        return parseContent(
          { [lang]: texts.invalidMsg } as I18nContentItem,
          lang,
        );
      }

      let device_id = null;
      let user_agent = null;

      if (typeof window !== "undefined") {
        device_id = localStorage.getItem("terminal_node_id");
        user_agent = navigator.userAgent;
      }

      try {
        const { error } = await supabase
          .from("guestbook")
          .insert([{ name: senderName, message, device_id, user_agent }]);

        if (error) throw error;

        return [
          ...notice,
          ...parseContent({ [lang]: texts.success } as I18nContentItem, lang),
        ];
      } catch (err) {
        console.error(err);
        return [
          ...notice,
          ...parseContent({ [lang]: texts.error } as I18nContentItem, lang),
        ];
      }
    }

    // 목록 조회 모드 (페이지 지원)
    const page = isPageArg ? Math.max(1, parseInt(args[0], 10)) : 1;
    const offset = (page - 1) * PAGE_SIZE;

    try {
      const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;

      const headerLines = parseContent(
        { [lang]: texts.header(page) } as I18nContentItem,
        lang,
      );

      if (!data || data.length === 0) {
        return [
          ...headerLines,
          ...parseContent({ [lang]: texts.empty } as I18nContentItem, lang),
          ...parseContent(
            { [lang]: texts.usagePrompt } as I18nContentItem,
            lang,
          ),
        ];
      }

      const listLines = data.map((entry: any) =>
        line(`[${fmtKstFull(new Date(entry.created_at))}] ${entry.name}: ${entry.message}`, "output"),
      );

      return [
        ...headerLines,
        ...listLines,
        ...parseContent({ [lang]: texts.usagePrompt } as I18nContentItem, lang),
      ];
    } catch (err) {
      console.error(err);
      return parseContent({ [lang]: texts.error } as I18nContentItem, lang);
    }
  },

  live: async (args, lang) => {
    const forceNode = args.includes("--node");

    // 활성 세션 조회 (force-open 우선, 이후 scheduled 순)
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
      // 조회 실패 시 오프라인 처리
    }

    if (!activeSession) {
      // 예정 세션 조회해서 오프라인 메시지에 포함
      let upcoming: Array<{ name: string; starts_at: string; ends_at: string | null }> = [];
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
        // 조회 실패 시 빈 목록
      }
      return parseContent(COMMAND_TEXTS.liveOffline(upcoming), lang);
    }

    // 이름 미설정 시 선택지 제공 (--node 플래그로 우회 가능)
    if (!forceNode && typeof window !== "undefined") {
      const name = localStorage.getItem("terminal_name");
      if (!name) {
        const nodeId = localStorage.getItem("terminal_node_id") || "NODE-?????";
        return {
          lines: parseContent(COMMAND_TEXTS.liveNoName(nodeId), lang),
          action: { type: "LIVE_NO_NAME_CHOICE" as const },
        };
      }
    }

    // 세션의 최근 메시지 5개 조회
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
          line(lang === "ko" ? "[ 최근 메시지 ]" : "[ RECENT MESSAGES ]", "system"),
          ...recent.reverse().map((msg) =>
            line(`[${fmtKstHm(new Date(msg.created_at))}] ${msg.nick}: ${msg.message}`, "live"),
          ),
          line("", "divider"),
        ];
      }
    } catch {
      // 실패 시 무시
    }

    return {
      lines: [
        ...parseContent(COMMAND_TEXTS.liveHeader(activeSession.name), lang),
        ...recentLines,
      ],
      action: {
        type: "ENTER_LIVE" as const,
        sessionId: activeSession.id,
        sessionName: activeSession.name,
      },
    };
  },

  admin: async (args, lang) => {
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY;

    if (typeof window === "undefined") {
      return parseContent(COMMAND_TEXTS.adminDenied, lang);
    }

    const isAuthenticated = localStorage.getItem("terminal_admin") === "true";

    if (!isAuthenticated) {
      // args 없음: 접근 불가 메시지
      if (args.length === 0) {
        return parseContent(COMMAND_TEXTS.adminDenied, lang);
      }
      // args 1개: 패스워드 시도 (맞으면 인증, 틀리면 힌트 없이 commandNotFound)
      if (args.length === 1 && adminKey && args[0] === adminKey) {
        localStorage.setItem("terminal_admin", "true");
        return parseContent(COMMAND_TEXTS.adminUnlocked, lang);
      }
      return parseContent(COMMAND_TEXTS.commandNotFound("admin"), lang);
    }

    // 인증 후 args 없음: 커맨드 목록 표시
    if (args.length === 0) {
      return parseContent(COMMAND_TEXTS.adminHelp, lang);
    }

    // 인증 후 서브 커맨드
    const sub = args[0]?.toLowerCase();
    const sub2 = args[1]?.toLowerCase();

    if (sub === "live") {
      // admin live open <name>  — 즉시 개방 세션 생성
      if (sub2 === "open") {
        const name = args.slice(2).join(" ").trim() || "LIVE SESSION";
        try {
          await supabase.from("live_sessions").insert({ name, is_force_open: true });
          return parseContent(COMMAND_TEXTS.adminLiveOpened, lang);
        } catch {
          return parseContent(COMMAND_TEXTS.adminError, lang);
        }
      }

      // admin live add <name with spaces> <start_kst> [end_kst]  — 예약 세션 등록
      // 시간 형식: "26-03-07T22:00" — 뒤에서부터 시간 패턴을 감지해 이름과 분리
      if (sub2 === "add") {
        const timePattern = /^\d{2}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        const addArgs = args.slice(2);
        let startRaw: string | undefined;
        let endRaw: string | undefined;
        let nameArgs: string[];
        if (
          addArgs.length >= 2 &&
          timePattern.test(addArgs[addArgs.length - 1]) &&
          timePattern.test(addArgs[addArgs.length - 2])
        ) {
          endRaw = addArgs[addArgs.length - 1];
          startRaw = addArgs[addArgs.length - 2];
          nameArgs = addArgs.slice(0, addArgs.length - 2);
        } else if (
          addArgs.length >= 1 &&
          timePattern.test(addArgs[addArgs.length - 1])
        ) {
          startRaw = addArgs[addArgs.length - 1];
          nameArgs = addArgs.slice(0, addArgs.length - 1);
        } else {
          nameArgs = addArgs;
        }
        const name = nameArgs.join(" ").trim();
        if (!name || !startRaw) return parseContent(COMMAND_TEXTS.adminError, lang);
        const toUtc = (kst: string) =>
          new Date("20" + kst + ":00+09:00").toISOString();
        try {
          await supabase.from("live_sessions").insert({
            name,
            is_force_open: false,
            starts_at: toUtc(startRaw),
            ends_at: endRaw ? toUtc(endRaw) : null,
          });
          return parseContent(COMMAND_TEXTS.adminLiveScheduled, lang);
        } catch {
          return parseContent(COMMAND_TEXTS.adminError, lang);
        }
      }

      // admin live close [name]  — 세션 종료
      // 이름 없으면 현재 활성 force-open 세션 종료, 이름 있으면 해당 세션 종료
      if (sub2 === "close") {
        const targetName = args.slice(2).join(" ").trim();
        try {
          const now = new Date().toISOString();
          if (targetName) {
            // 이름으로 ID 조회 후 ID로 업데이트 (URL 인코딩 이슈 회피)
            const { data: found } = await supabase
              .from("live_sessions")
              .select("id")
              .is("closed_at", null)
              .ilike("name", targetName);
            if (!found || found.length === 0)
              return parseContent(COMMAND_TEXTS.adminLiveNotFound, lang);
            await supabase
              .from("live_sessions")
              .update({ closed_at: now })
              .in("id", found.map((s: { id: string }) => s.id));
          } else {
            await supabase
              .from("live_sessions")
              .update({ closed_at: now })
              .is("closed_at", null)
              .eq("is_force_open", true);
          }
          return parseContent(COMMAND_TEXTS.adminLiveClosed, lang);
        } catch {
          return parseContent(COMMAND_TEXTS.adminError, lang);
        }
      }

      // admin live delete <name>  — 예약 세션 DB에서 완전 삭제
      if (sub2 === "delete") {
        const targetName = args.slice(2).join(" ").trim();
        if (!targetName) return parseContent(COMMAND_TEXTS.adminError, lang);
        try {
          // 이름으로 ID 조회 후 ID로 삭제 (URL 인코딩 이슈 회피)
          const { data: found } = await supabase
            .from("live_sessions")
            .select("id")
            .eq("is_force_open", false)
            .ilike("name", targetName);
          if (!found || found.length === 0)
            return parseContent(COMMAND_TEXTS.adminLiveNotFound, lang);
          await supabase
            .from("live_sessions")
            .delete()
            .in("id", found.map((s: { id: string }) => s.id));
          return parseContent(COMMAND_TEXTS.adminLiveDeleted, lang);
        } catch {
          return parseContent(COMMAND_TEXTS.adminError, lang);
        }
      }

      // admin live status  — 세션 목록 출력
      if (sub2 === "status") {
        try {
          const { data } = await supabase
            .from("live_sessions")
            .select("id, name, is_force_open, starts_at, ends_at, closed_at")
            .order("created_at", { ascending: false })
            .limit(10);
          return parseContent(COMMAND_TEXTS.adminSessionStatus(data ?? []), lang);
        } catch {
          return parseContent(COMMAND_TEXTS.adminError, lang);
        }
      }

      // admin live clear  — 현재 활성 세션 메시지 삭제
      if (sub2 === "clear") {
        try {
          const { data: latest } = await supabase
            .from("live_sessions")
            .select("id")
            .is("closed_at", null)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          if (latest) {
            await supabase
              .from("live_messages")
              .delete()
              .eq("session_id", latest.id);
          }
          return parseContent(COMMAND_TEXTS.adminLiveCleared, lang);
        } catch {
          return parseContent(COMMAND_TEXTS.adminError, lang);
        }
      }
    }

    if (sub === "ann") {
      const message = args.slice(1).join(" ").trim();
      if (!message || message === "clear") {
        try {
          await supabase
            .from("app_config")
            .update({ value: "" })
            .eq("key", "announcement");
          return parseContent(COMMAND_TEXTS.adminAnnCleared, lang);
        } catch {
          return parseContent(COMMAND_TEXTS.adminError, lang);
        }
      }
      try {
        await supabase
          .from("app_config")
          .update({ value: message })
          .eq("key", "announcement");
        return parseContent(COMMAND_TEXTS.adminAnnSent, lang);
      } catch {
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }

    return parseContent(COMMAND_TEXTS.commandNotFound("admin"), lang);
  },
};

/**
 * 사용자 입력 명령어를 처리하고 응답 라인을 반환합니다.
 * @param raw - 사용자가 입력한 원시 문자열
 * @returns TerminalLine 배열
 */
export async function processCommand(
  raw: string,
  currentLang: LanguageType = "en",
): Promise<CommandResult> {
  const trimmed = raw.trim();

  if (!trimmed) return { lines: [], shouldClear: false };

  const swearRegex =
    /(씨발|시발|개새끼|지랄|좆|미친|병신|애미|니미|새꺄|씹|썅|호로)/;
  if (swearRegex.test(trimmed)) {
    return {
      lines: parseContent(COMMAND_TEXTS.swearWord(trimmed), currentLang),
      shouldClear: false,
    };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (cmd === "clear") {
    return { lines: [], shouldClear: true };
  }

  const handlerKey = cmd === "su" ? "sudo" : cmd;
  const handler = COMMAND_MAP[handlerKey as keyof typeof COMMAND_MAP];

  if (handler) {
    const result = await handler(args, currentLang);
    if (Array.isArray(result)) {
      return { lines: result, shouldClear: false };
    }
    return { ...result, shouldClear: result.shouldClear || false };
  }

  return {
    lines: parseContent(COMMAND_TEXTS.commandNotFound(cmd), currentLang),
    shouldClear: false,
  };
}
