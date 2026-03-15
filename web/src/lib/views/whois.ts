import type { LanguageType, TerminalLine } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { textService } from "../services/text-service";
import { parseContent, line, btn } from "../utils";

const ARTISTS = ["stann", "marcus", "nusnoom"] as const;
type ArtistKey = (typeof ARTISTS)[number];

const ARTIST_LABELS: Record<ArtistKey, string> = {
  stann: "STANN LUMO",
  marcus: "MARCUS L",
  nusnoom: "NUSNOOM",
};

export function whoisView(lang: LanguageType, name?: string): TerminalLine[] {
  // 이름 없으면 아티스트 선택 화면
  if (!name) {
    return [
      line(lang === "ko" ? "[ CREW ] 아티스트 선택" : "[ CREW ] Select artist", "header"),
      line("", "divider"),
      ...ARTISTS.map((key) => btn(`> ${ARTIST_LABELS[key]}`, `whois ${key}`)),
      line("", "divider"),
      btn("> HOME", "home"),
    ];
  }

  const target = name.toLowerCase();
  const subKey = textService.resolveWhoisAlias(target);
  const dbText = textService.getText("whois", subKey);

  let profileLines: TerminalLine[];
  if (dbText) {
    profileLines = parseContent(dbText, lang);
  } else if (subKey === "stann") {
    profileLines = parseContent(COMMAND_TEXTS.whoisStann(), lang);
  } else if (subKey === "marcus") {
    profileLines = parseContent(COMMAND_TEXTS.whoisMarcus(), lang);
  } else if (subKey === "nusnoom") {
    profileLines = parseContent(COMMAND_TEXTS.whoisNusnoom(), lang);
  } else {
    profileLines = parseContent(COMMAND_TEXTS.whoisUnknown(target), lang);
  }

  return [
    ...profileLines,
    line("", "divider"),
    line(lang === "ko" ? "[ 탐색 ]" : "[ NAVIGATE ]", "system"),
    btn("> HOME", "home"),
    btn("> LINEUP", "lineup"),
    btn("> WHOIS", "whois"),
  ];
}
