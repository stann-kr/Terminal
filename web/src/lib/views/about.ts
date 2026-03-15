import type { LanguageType, TerminalLine } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { parseContent, btn, line } from "../utils";

export function aboutView(lang: LanguageType): TerminalLine[] {
  return [
    ...parseContent(COMMAND_TEXTS.about, lang),
    line("", "divider"),
    btn("> HOME", "home"),
  ];
}
