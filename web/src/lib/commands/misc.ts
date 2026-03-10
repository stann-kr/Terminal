import { COMMAND_TEXTS } from "../texts";
import type { CommandHandler } from "../types";
import { parseContent, getTimestamp } from "../utils";
import { textService } from "../services/text-service";

export const status: CommandHandler = (_, lang) => {
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
  return parseContent(COMMAND_TEXTS.status(timestamp, dDay), lang);
};

export const date: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.dateTime(getTimestamp(lang)), lang);

export const time: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.dateTime(getTimestamp(lang)), lang);

export const ping: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.ping, lang);

export const scan: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.weather, lang);

export const weather: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.weather, lang);

export const matrix: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.matrix, lang);

export const history: CommandHandler = (_, lang) => {
  const isAdmin =
    typeof window !== "undefined" &&
    localStorage.getItem("terminal_admin") === "true";
  return parseContent(
    isAdmin ? COMMAND_TEXTS.historyAdmin : COMMAND_TEXTS.history,
    lang,
  );
};
