export type LanguageType = "ko" | "en";

export type ViewType =
  | "boot"
  | "home"
  | "about"
  | "lineup"
  | "gate"
  | "whois"
  | "link"
  | "status"
  | "settings"
  | "transmit"
  | "live";

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
  | "live"
  | "button";

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
  cmd?: string; // 버튼 클릭 시 실행할 명령어 문자열
  desc?: string; // (New) 버튼 부가 설명
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
