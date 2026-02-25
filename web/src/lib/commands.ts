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
  | { type: "RESET" };

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
  systems: (_, lang) => parseContent(COMMAND_TEXTS.systems, lang),
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
    const timestamp = now.toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      hour12: false,
    });
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
    if (typeof window !== "undefined") {
      nodeId = localStorage.getItem("terminal_node_id") || "unknown";
    }
    return parseContent(COMMAND_TEXTS.whoami(nodeId), lang);
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

  date: (_, lang) => {
    const ts = new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      hour12: false,
    });
    return parseContent(COMMAND_TEXTS.dateTime(ts), lang);
  },
  time: (_, lang) => {
    const ts = new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      hour12: false,
    });
    return parseContent(COMMAND_TEXTS.dateTime(ts), lang);
  },
  ping: (_, lang) => parseContent(COMMAND_TEXTS.ping, lang),
  scan: (_, lang) => parseContent(COMMAND_TEXTS.weather, lang),
  weather: (_, lang) => parseContent(COMMAND_TEXTS.weather, lang),
  matrix: (_, lang) => parseContent(COMMAND_TEXTS.matrix, lang),
  history: (_, lang) => parseContent(COMMAND_TEXTS.history, lang),

  transmit: async (args, lang) => {
    const texts = COMMAND_TEXTS.transmit[lang];
    const PAGE_SIZE = 10;

    // 페이지 조회 모드 (히든): transmit <숫자>
    const isPageArg = args.length === 1 && /^\d+$/.test(args[0]);

    // 작성 모드: transmit <이름> <메시지>
    if (args.length >= 1 && !isPageArg) {
      const rawName = args[0];
      const name = stripBrackets(rawName);
      const message = args.slice(1).join(" ").trim();
      const notice = hasBrackets(rawName) ? [bracketNotice(lang)] : [];

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
          .insert([{ name, message, device_id, user_agent }]);

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

      const listLines = data.map((entry: any) => {
        const d = new Date(entry.created_at);
        const yy = String(d.getFullYear()).slice(2);
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        const date = `${yy}-${mm}-${dd} ${hh}:${min}`;
        return line(`[${date}] ${entry.name}: ${entry.message}`, "output");
      });

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
