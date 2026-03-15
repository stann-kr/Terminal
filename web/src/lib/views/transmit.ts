import type { LanguageType, TerminalLine } from "../types";
import { COMMAND_TEXTS } from "../texts";
import { supabase } from "../supabase";
import { parseLines, line, btn, fmtKstFull } from "../utils";

export interface TransmitViewResult {
  lines: TerminalLine[];
  isTransmitMode: true;
}

export async function transmitView(
  lang: LanguageType,
): Promise<TransmitViewResult> {
  const texts = COMMAND_TEXTS.transmit[lang];
  const PAGE_SIZE = 10;

  const headerLines = parseLines(texts.header(1));

  let listLines: TerminalLine[] = [];

  try {
    const { data, error } = await supabase
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, PAGE_SIZE - 1);

    if (error) throw error;

    if (!data || data.length === 0) {
      listLines = parseLines(texts.empty);
    } else {
      listLines = data.map(
        (entry: { created_at: string; name: string; message: string }) =>
          line(
            `[${fmtKstFull(new Date(entry.created_at))}] ${entry.name}: ${entry.message}`,
            "output",
          ),
      );
    }
  } catch {
    listLines = parseLines(texts.error);
  }

  const navLines: TerminalLine[] = [
    line("", "divider"),
    line(
      lang === "ko"
        ? "↓ 메시지를 입력하거나 명령어를 사용하세요."
        : "↓ Type a message below or use a command.",
      "system",
    ),
    line("", "divider"),
    btn("> HOME", "home"),
    btn("> LIVE", "live"),
  ];

  return {
    lines: [...headerLines, ...listLines, ...navLines],
    isTransmitMode: true,
  };
}
