import { COMMAND_TEXTS } from "../texts";
import type { CommandHandler } from "../types";
import {
  parseContent,
  stripBrackets,
  hasBrackets,
  bracketNotice,
  line,
} from "../utils";

export const whois: CommandHandler = (args, lang) => {
  const raw = args?.[0] ?? "";
  const target = stripBrackets(raw).toLowerCase();
  const notice = hasBrackets(raw) ? [bracketNotice(lang)] : [];

  if (!target) {
    return [
      line(
        lang === "ko" ? "사용법 : whois <name>" : "usage : whois <name>",
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
};

export const whoami: CommandHandler = (_, lang) => {
  let nodeId = "unknown";
  let name: string | undefined;
  let isAdmin = false;
  if (typeof window !== "undefined") {
    nodeId = localStorage.getItem("terminal_node_id") || "unknown";
    name = localStorage.getItem("terminal_name") ?? undefined;
    isAdmin = localStorage.getItem("terminal_admin") === "true";
  }
  return parseContent(COMMAND_TEXTS.whoami(nodeId, name, isAdmin), lang);
};

export const name: CommandHandler = (args, lang) => {
  const value = args.join(" ").trim();
  if (!value) {
    if (typeof window !== "undefined") {
      const current = localStorage.getItem("terminal_name");
      if (current)
        return parseContent(COMMAND_TEXTS.nameCurrent(current), lang);
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
};

export const sudo: CommandHandler = (args, lang) => {
  if (
    args &&
    args[0]?.toLowerCase() === "login" &&
    args[1]?.toLowerCase() === "stann"
  ) {
    return parseContent(COMMAND_TEXTS.sudoStann(), lang);
  }
  return parseContent(COMMAND_TEXTS.sudoError(), lang);
};

export const echo: CommandHandler = (args, lang) => {
  if (!args || args.length === 0) {
    return parseContent(COMMAND_TEXTS.echoError(), lang);
  }
  return parseContent(COMMAND_TEXTS.echoOutput(args.join(" ")), lang);
};

export const settings: CommandHandler = (args, lang) => {
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
    return [line(lang === "ko" ? `잘못된 언어 설정: ${val}. 'ko' 또는 'en'을 사용하세요.` : `Invalid language: ${val}. Use 'ko' or 'en'.`, "error")];
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
    return [line(lang === "ko" ? `잘못된 테마 설정: ${val}. 'dark' 또는 'light'를 사용하세요.` : `Invalid theme: ${val}. Use 'dark' or 'light'.`, "error")];
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

  return [line(lang === "ko" ? `알 수 없는 설정 옵션: ${subCmd}` : `Unknown settings option: ${subCmd}`, "error")];
};
