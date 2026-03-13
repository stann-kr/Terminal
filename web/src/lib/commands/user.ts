import { COMMAND_TEXTS } from "../texts";
import type { CommandHandler } from "../types";
import {
  parseContent,
  stripBrackets,
  hasBrackets,
  bracketNotice,
  line,
} from "../utils";
import { textService } from "../services/text-service";

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

  // DB aliases 맵으로 sub_key 정규화 후 텍스트 조회
  const subKey = textService.resolveWhoisAlias(target);
  const dbText = textService.getText("whois", subKey);
  if (dbText) {
    return [...notice, ...parseContent(dbText, lang)];
  }

  // DB 미등록 또는 로딩 실패 시 하드코딩 폴백 (subKey 기준)
  if (subKey === "stann") {
    return [...notice, ...parseContent(COMMAND_TEXTS.whoisStann(), lang)];
  }
  if (subKey === "marcus") {
    return [...notice, ...parseContent(COMMAND_TEXTS.whoisMarcus(), lang)];
  }
  if (subKey === "nusnoom") {
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
    return parseContent(COMMAND_TEXTS.settingsHelp, lang);
  }

  const subCmd = args[0]?.toLowerCase();
  const val = args[1]?.toLowerCase();

  if (subCmd === "lang") {
    if (val === "ko" || val === "en") {
      return {
        lines: parseContent(COMMAND_TEXTS.settingsLangChanged(val), lang),
        action: { type: "CHANGE_LANG", payload: val as "ko" | "en" },
      };
    }
    return parseContent(COMMAND_TEXTS.settingsLangInvalid(val ?? ""), lang);
  }

  if (subCmd === "theme") {
    if (val === "dark" || val === "light") {
      return {
        lines: parseContent(COMMAND_TEXTS.settingsThemeChanged(val), lang),
        action: { type: "CHANGE_THEME", payload: val as "dark" | "light" },
      };
    }
    return parseContent(COMMAND_TEXTS.settingsThemeInvalid(val ?? ""), lang);
  }

  if (subCmd === "reset") {
    return {
      lines: parseContent(COMMAND_TEXTS.settingsReset, lang),
      action: { type: "RESET" },
      shouldClear: true,
    };
  }

  return parseContent(COMMAND_TEXTS.settingsUnknown(subCmd), lang);
};
