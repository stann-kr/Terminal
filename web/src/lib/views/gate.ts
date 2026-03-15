import type { LanguageType, TerminalLine } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { parseContent, line, btn } from "../utils";

export function gateView(lang: LanguageType): TerminalLine[] {
  return [
    ...parseContent(COMMAND_TEXTS.gate, lang),
    line("", "divider"),
    line(lang === "ko" ? "[ 탐색 ]" : "[ NAVIGATE ]", "system"),
    btn("> HOME", "home"),
    btn("> LINEUP", "lineup"),
    btn("> STATUS", "status"),
  ];
}
