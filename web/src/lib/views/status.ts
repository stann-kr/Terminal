import type { LanguageType, TerminalLine } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { textService } from "../services/text-service";
import { parseContent, getTimestamp, line, btn } from "../utils";

export function statusView(lang: LanguageType): TerminalLine[] {
  const now = new Date();
  const timestamp = getTimestamp(lang);
  const activeEvent = textService.getActiveEvent();
  const eventDate = activeEvent
    ? new Date(activeEvent.date)
    : new Date("2026-03-07T14:00:00Z");
  const diffMs = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const dDay =
    diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? "D-DAY" : "LAUNCHED";

  return [
    ...parseContent(COMMAND_TEXTS.status(timestamp, dDay), lang),
    line("", "divider"),
    line(lang === "ko" ? "[ 탐색 ]" : "[ NAVIGATE ]", "system"),
    btn("> HOME", "home"),
    btn("> GATE", "gate"),
  ];
}
