import type { LanguageType, TerminalLine, ContentItem } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { parseContent, line, btn } from "../utils";

export function homeView(lang: LanguageType): TerminalLine[] {
  // ContentItem에서 텍스트 추출 (string | [string, type] | [string, "link", url])
  const getText = (item: ContentItem): string =>
    typeof item === "string" ? item : item[0];

  // help 텍스트에서 각 명령어의 설명 파싱 (string / tuple 양쪽 대응)
  const getDesc = (cmd: string) => {
    const items = COMMAND_TEXTS.help[lang];
    const matchLine = items.find((item) => {
      const text = getText(item);
      return text.trim().toLowerCase().startsWith(cmd);
    });
    if (!matchLine) return "";
    const text = getText(matchLine);
    if (text.includes("—")) return text.split("—")[1].trim();
    return "";
  };

  return [
    line(
      lang === "ko" ? "[ 터미널 코어 인덱스 ]" : "[ TERMINAL CORE INDEX ]",
      "header",
    ),
    line("", "divider"),
    line(
      lang === "ko"
        ? "[ 시스템 아카이브 & 디렉토리 ]"
        : "[ System Archive & Directory ]",
      "system",
    ),
    btn("> ABOUT", "about", getDesc("about")),
    btn("> LINEUP", "lineup", getDesc("lineup")),
    btn("> GATE", "gate", getDesc("gate")),
    btn("> WHOIS", "whois", getDesc("whois")),
    btn("> TRANSMIT", "transmit", getDesc("transmit")),
    btn("> LIVE", "live", getDesc("live")),
    btn("> LINK", "link", getDesc("link")),
    btn("> STATUS", "status", getDesc("status")),
    btn("> SETTINGS", "settings", getDesc("settings")),
    btn("> ADMIN", "admin", getDesc("admin")),
  ];
}
