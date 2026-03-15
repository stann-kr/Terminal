import type { LanguageType, TerminalLine } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { parseContent, line, btn } from "../utils";

export function settingsView(lang: LanguageType): TerminalLine[] {
  return [
    ...parseContent(COMMAND_TEXTS.settingsHelp, lang),
    line("", "divider"),
    line(lang === "ko" ? "[ 언어 ]" : "[ LANGUAGE ]", "system"),
    btn("> ENGLISH (EN)", "settings lang en"),
    btn("> 한국어 (KO)", "settings lang ko"),
    line("", "divider"),
    line(lang === "ko" ? "[ 테마 ]" : "[ THEME ]", "system"),
    btn("> DARK", "settings theme dark"),
    btn("> LIGHT", "settings theme light"),
    line("", "divider"),
    line(lang === "ko" ? "[ 시스템 ]" : "[ SYSTEM ]", "system"),
    btn("> RESET SETTINGS", "settings reset"),
    line("", "divider"),
    btn("> HOME", "home"),
  ];
}
