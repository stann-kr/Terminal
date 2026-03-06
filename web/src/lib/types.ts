export type LanguageType = "ko" | "en";

export type LineType =
  | "output"
  | "error"
  | "success"
  | "system"
  | "input"
  | "link"
  | "header"
  | "divider"
  | "progress"
  | "live";

export type ContentItem =
  | string
  | [string, LineType]
  | [string, "link", string];

export type I18nContentItem = Record<LanguageType, ContentItem[]>;

export interface BootLine {
  text: string;
  type: LineType;
}

export type I18nBootLine = Record<LanguageType, BootLine[]>;

export interface TerminalLine {
  id: string;
  text: string;
  type: LineType;
  url?: string;
}

export type CommandAction =
  | { type: "CHANGE_LANG"; payload: "en" | "ko" }
  | { type: "CHANGE_THEME"; payload: "dark" | "light" }
  | { type: "RESET" }
  | { type: "ENTER_LIVE"; sessionId: string; sessionName: string }
  | { type: "EXIT_LIVE" }
  | { type: "LIVE_NO_NAME_CHOICE" };

export interface CommandResult {
  lines: TerminalLine[];
  shouldClear?: boolean;
  action?: CommandAction;
}

export type CommandHandler = (
  args: string[],
  lang: LanguageType,
) => TerminalLine[] | CommandResult | Promise<TerminalLine[] | CommandResult>;
