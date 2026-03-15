import type { LanguageType, TerminalLine } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { parseContent, line, btn } from "../utils";

export function lineupView(lang: LanguageType): TerminalLine[] {
  return [
    ...parseContent(COMMAND_TEXTS.lineup, lang),
    line("", "divider"),
    line(lang === "ko" ? "[ 탐색 ]" : "[ NAVIGATE ]", "system"),
    btn("> HOME", "home"),
    btn("> GATE", "gate"),
    btn("> WHOIS", "whois"),
    btn("> LINK", "link"),
  ];
}
