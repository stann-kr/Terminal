/**
 * TERMINAL [01] — CLI 명령어 처리기
 *
 * 각 명령어는 TerminalLine 배열을 반환합니다.
 * 명령어 출력 텍스트의 실제 데이터는 './command-text' 파일에서 관리됩니다.
 */

import { COMMAND_TEXTS } from "./command-text";
import type {
  ContentItem,
  LineType,
  LanguageType,
  I18nContentItem,
} from "./command-text";

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
export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

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
  (args: string[], lang: LanguageType) => TerminalLine[] | CommandResult
> = {
  // 정적 콘텐츠 매핑
  help: (_, lang) => parseContent(COMMAND_TEXTS.help, lang),
  about: (_, lang) => parseContent(COMMAND_TEXTS.about, lang),
  lineup: (_, lang) => parseContent(COMMAND_TEXTS.lineup, lang),
  link: (_, lang) => parseContent(COMMAND_TEXTS.link, lang),
  voyage: (_, lang) => parseContent(COMMAND_TEXTS.voyage, lang),
  systems: (_, lang) => parseContent(COMMAND_TEXTS.systems, lang),
  gate: (_, lang) => parseContent(COMMAND_TEXTS.gate, lang),

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
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    return parseContent(COMMAND_TEXTS.status(timestamp), lang);
  },

  whois: (args, lang) => {
    const target = args?.[0]?.toLowerCase() || "";
    if (!target) {
      return [line(lang === "ko" ? "usage: whois <name>" : "usage: whois <name>", "error")];
    }
    if (target === "stann" || target === "stannlumo") {
      return parseContent(COMMAND_TEXTS.whoisStann(), lang);
    }
    return parseContent(COMMAND_TEXTS.whoisUnknown(target), lang);
  },

  whoami: (_, lang) => {
    const guestId = Math.floor(Math.random() * 9000 + 1000);
    return parseContent(COMMAND_TEXTS.whoami(guestId), lang);
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
};

/**
 * 사용자 입력 명령어를 처리하고 응답 라인을 반환합니다.
 * @param raw - 사용자가 입력한 원시 문자열
 * @returns TerminalLine 배열
 */
export function processCommand(
  raw: string,
  currentLang: LanguageType = "en",
): CommandResult {
  const trimmed = raw.trim();

  if (!trimmed) return { lines: [], shouldClear: false };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (cmd === "clear") {
    return { lines: [], shouldClear: true };
  }

  const handlerKey = cmd === "su" ? "sudo" : cmd;
  const handler = COMMAND_MAP[handlerKey as keyof typeof COMMAND_MAP];

  if (handler) {
    const result = handler(args, currentLang);
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
