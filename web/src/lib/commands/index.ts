import {
  help,
  commands,
  about,
  lineup,
  link,
  voyage,
  systems,
  gate,
  event,
} from "./static";
import { whoami, name, echo, sudo, whois, settings } from "./user";
import { transmit } from "./transmit";
import { live } from "./live";
import { admin } from "./admin";
import {
  status,
  date,
  time,
  ping,
  scan,
  weather,
  matrix,
  history,
} from "./misc";

import { COMMAND_TEXTS } from "../texts";
import type { LanguageType, CommandResult, CommandHandler } from "../types";
import { parseContent, findSimilarCommand } from "../utils";
import { AVAILABLE_COMMANDS } from "../constants";

const COMMAND_MAP: Record<string, CommandHandler> = {
  help,
  commands,
  about,
  lineup,
  link,
  voyage,
  systems,
  gate,
  event,
  whoami,
  name,
  echo,
  sudo,
  whois,
  settings,
  transmit,
  live,
  admin,
  status,
  date,
  time,
  ping,
  scan,
  weather,
  matrix,
  history,
};

export async function processCommand(
  raw: string,
  currentLang: LanguageType = "en",
): Promise<CommandResult> {
  const trimmed = raw.trim();

  if (!trimmed) return { lines: [], shouldClear: false };

  const swearRegex =
    /(씨발|시발|개새끼|지랄|좆|미친|병신|애미|니미|새꺄|씹|썅|호로)/;
  if (swearRegex.test(trimmed)) {
    return {
      lines: parseContent(COMMAND_TEXTS.swearWord(trimmed), currentLang),
      shouldClear: false,
    };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (cmd === "clear") {
    return { lines: [], shouldClear: true };
  }

  const handlerKey = cmd === "su" ? "sudo" : cmd;
  const handler = COMMAND_MAP[handlerKey];

  if (handler) {
    const result = await handler(args, currentLang);
    if (Array.isArray(result)) {
      return { lines: result, shouldClear: false };
    }
    return { ...result, shouldClear: result.shouldClear || false };
  }

  const singleWordCommands = AVAILABLE_COMMANDS.filter((c) => !c.includes(" "));
  const suggestion = findSimilarCommand(cmd, singleWordCommands);
  const notFoundLines = parseContent(COMMAND_TEXTS.commandNotFound(cmd), currentLang);
  const suggestionLines = suggestion
    ? parseContent(COMMAND_TEXTS.commandSuggestion(suggestion), currentLang)
    : [];
  return {
    lines: [...notFoundLines, ...suggestionLines],
    shouldClear: false,
  };
}

export { uid } from "../utils";
