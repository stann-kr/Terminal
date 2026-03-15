import type { LanguageType, TerminalLine } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { parseContent, line, btn } from "../utils";

export function homeView(lang: LanguageType): TerminalLine[] {
  return [
    ...parseContent(COMMAND_TEXTS.help, lang),
    line("", "divider"),
    line(lang === "ko" ? "[ 탐색 ]" : "[ NAVIGATE ]", "system"),
    btn("> LINEUP", "lineup"),
    btn("> GATE", "gate"),
    btn("> WHOIS", "whois"),
    btn("> TRANSMIT", "transmit"),
    btn("> LIVE", "live"),
    btn("> LINK", "link"),
    btn("> STATUS", "status"),
    btn("> SETTINGS", "settings"),
  ];
}
