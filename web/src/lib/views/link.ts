import type { LanguageType, TerminalLine } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { parseContent, line, btn } from "../utils";

export function linkView(lang: LanguageType): TerminalLine[] {
  return [
    ...parseContent(COMMAND_TEXTS.link, lang),
    line("", "divider"),
    btn("> HOME", "home"),
  ];
}
