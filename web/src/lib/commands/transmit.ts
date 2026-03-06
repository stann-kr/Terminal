import { COMMAND_TEXTS } from "../texts";
import type { CommandHandler, TerminalLine } from "../types";
import {
  parseContent,
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
      return parseContent({ [lang]: texts.invalidMsg } as any, lang);
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

      return [
        ...notice,
        ...parseContent({ [lang]: texts.success } as any, lang),
      ];
    } catch (err) {
      console.error(err);
      return [...notice, ...parseContent({ [lang]: texts.error } as any, lang)];
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

    const headerLines = parseContent(
      { [lang]: texts.header(page) } as any,
      lang,
    );

    if (!data || data.length === 0) {
      return [
        ...headerLines,
        ...parseContent({ [lang]: texts.empty } as any, lang),
        ...parseContent({ [lang]: texts.usagePrompt } as any, lang),
      ];
    }

    const listLines = data.map((entry: any) =>
      line(
        `[${fmtKstFull(new Date(entry.created_at))}] ${entry.name}: ${entry.message}`,
        "output",
      ),
    );

    return [
      ...headerLines,
      ...listLines,
      ...parseContent({ [lang]: texts.usagePrompt } as any, lang),
    ];
  } catch (err) {
    console.error(err);
    return parseContent({ [lang]: texts.error } as any, lang);
  }
};
