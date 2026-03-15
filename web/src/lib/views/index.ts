import type { LanguageType, TerminalLine, ViewType, CommandAction } from "../types";
import { homeView } from "./home";
import { lineupView } from "./lineup";
import { gateView } from "./gate";
import { whoisView } from "./whois";
import { linkView } from "./link";
import { statusView } from "./status";
import { settingsView } from "./settings";
import { transmitView } from "./transmit";
import { liveView } from "./live";

export interface ViewResult {
  lines: TerminalLine[];
  action?: CommandAction;
  isTransmitMode?: boolean;
}

/** CLI 명령어 → ViewType 매핑 */
export const COMMAND_TO_VIEW: Record<string, ViewType> = {
  home: "home",
  about: "home",
  help: "home",
  lineup: "lineup",
  gate: "gate",
  event: "gate",
  whois: "whois",
  link: "link",
  status: "status",
  settings: "settings",
  transmit: "transmit",
  live: "live",
};

/** View 콘텐츠 로더 */
export async function loadView(
  view: ViewType,
  lang: LanguageType,
  args?: string[],
): Promise<ViewResult> {
  switch (view) {
    case "home":
      return { lines: homeView(lang) };
    case "lineup":
      return { lines: lineupView(lang) };
    case "gate":
      return { lines: gateView(lang) };
    case "whois":
      return { lines: whoisView(lang, args?.[0]) };
    case "link":
      return { lines: linkView(lang) };
    case "status":
      return { lines: statusView(lang) };
    case "settings":
      return { lines: settingsView(lang) };
    case "transmit":
      return await transmitView(lang);
    case "live":
      return await liveView(lang, args);
    default:
      return { lines: homeView(lang) };
  }
}
