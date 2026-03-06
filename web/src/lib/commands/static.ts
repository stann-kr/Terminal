import { COMMAND_TEXTS } from "../texts";
import type { CommandHandler } from "../types";
import { parseContent } from "../utils";

export const help: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.help, lang);

export const commands: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.commands, lang);

export const about: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.about, lang);

export const lineup: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.lineup, lang);

export const link: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.link, lang);

export const voyage: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.voyage, lang);

export const systems: CommandHandler = (_, lang) => {
  const isAdmin =
    typeof window !== "undefined" &&
    localStorage.getItem("terminal_admin") === "true";
  return parseContent(COMMAND_TEXTS.systems(isAdmin), lang);
};

export const gate: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.gate, lang);

export const event: CommandHandler = (_, lang) =>
  parseContent(COMMAND_TEXTS.event, lang);
