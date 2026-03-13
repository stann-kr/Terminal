import { COMMAND_TEXTS } from "../texts";
import type { CommandHandler, TerminalLine } from "../types";
import {
  parseLines,
  stripBrackets,
  hasBrackets,
  bracketNotice,
  line,
  fmtKstFull,
} from "../utils";
import { supabase } from "../supabase";

export const transmit: CommandHandler = async (args, lang) => {
  const texts = COMMAND_TEXTS.transmit[lang];
  const PAGE_SIZE = 10;

  const isPageArg = args.length === 1 && /^\d+$/.test(args[0]);

  if (args.length >= 1 && !isPageArg) {
    let senderName: string;
    let message: string;
    const notice: TerminalLine[] = [];

    if (args.length === 1) {
      let autoName = "unknown";
      if (typeof window !== "undefined") {
        autoName =
          localStorage.getItem("terminal_name") ||
          localStorage.getItem("terminal_node_id") ||
          "unknown";
      }
      senderName = autoName;
      message = stripBrackets(args[0]);
      if (hasBrackets(args[0])) notice.push(bracketNotice(lang));
    } else {
      const rawName = args[0];
      senderName = stripBrackets(rawName);
      message = args.slice(1).join(" ").trim();
      if (hasBrackets(rawName)) notice.push(bracketNotice(lang));
    }

    if (!message) {
      return parseLines(texts.invalidMsg);
    }

    let device_id = null;
    let user_agent = null;

    if (typeof window !== "undefined") {
      device_id = localStorage.getItem("terminal_node_id");
      user_agent = navigator.userAgent;
    }

    try {
      const { error } = await supabase
        .from("guestbook")
        .insert([{ name: senderName, message, device_id, user_agent }]);

      if (error) throw error;

      return [...notice, ...parseLines(texts.success)];
    } catch (err) {
      console.error(err);
      return [...notice, ...parseLines(texts.error)];
    }
  }

  const page = isPageArg ? Math.max(1, parseInt(args[0], 10)) : 1;
  const offset = (page - 1) * PAGE_SIZE;

  try {
    const { data, error } = await supabase
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) throw error;

    const headerLines = parseLines(texts.header(page));

    if (!data || data.length === 0) {
      return [
        ...headerLines,
        ...parseLines(texts.empty),
        ...parseLines(texts.usagePrompt),
      ];
    }

    const listLines = data.map((entry: { created_at: string; name: string; message: string }) =>
      line(
        `[${fmtKstFull(new Date(entry.created_at))}] ${entry.name}: ${entry.message}`,
        "output",
      ),
    );

    return [
      ...headerLines,
      ...listLines,
      ...parseLines(texts.usagePrompt),
    ];
  } catch (err) {
    console.error(err);
    return parseLines(texts.error);
  }
};
