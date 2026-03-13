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

/** transmit 텍스트 구조 — 언어별 다중 블록을 포함하는 비표준 구조 */
export interface TransmitTextBlock {
  usage: ContentItem[];
  usagePrompt: ContentItem[];
  empty: ContentItem[];
  loading: ContentItem[];
  saving: ContentItem[];
  success: ContentItem[];
  invalidMsg: ContentItem[];
  error: ContentItem[];
  header: (page: number) => ContentItem[];
}

export interface TransmitTexts {
  ko: TransmitTextBlock;
  en: TransmitTextBlock;
}

export type CommandHandler = (
  args: string[],
  lang: LanguageType,
) => TerminalLine[] | CommandResult | Promise<TerminalLine[] | CommandResult>;
