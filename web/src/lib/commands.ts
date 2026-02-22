/**
 * TERMINAL [01] — CLI 명령어 처리기
 *
 * 각 명령어는 TerminalLine 배열을 반환합니다.
 * 명령어 출력 텍스트의 실제 데이터는 './command-text' 파일에서 관리됩니다.
 */

import { COMMAND_TEXTS, ContentItem, LineType } from "./command-text";

export { type LineType } from "./command-text";

export interface TerminalLine {
  id: string;
  text: string;
  type: LineType;
  url?: string;
}

/** 고유 ID 생성 유틸리티 */
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** 단일 라인 생성 헬퍼 */
const line = (
  text: string,
  type: LineType = "output",
  url?: string,
): TerminalLine => ({
  id: uid(),
  text,
  type,
  url,
});

/**
 * 선언적 콘텐츠(ContentItem) 배열을 TerminalLine 객체 배열로 변환하는 유틸리티
 */
const parseContent = (items: ContentItem[]): TerminalLine[] => {
  return items.map((item) => {
    // 문자열인 경우 기본 output 타입
    if (typeof item === "string") return line(item, "output");
    // 배열인 경우 [text, type, url?] 매핑
    return line(item[0], item[1] as LineType, item[2]);
  });
};

/** 명령어 → 응답 라인 매핑 (비즈니스 로직 및 텍스트 데이터 파싱) */
const COMMAND_MAP: Record<string, (args?: string[]) => TerminalLine[]> = {
  // 정적 콘텐츠 매핑
  help: () => parseContent(COMMAND_TEXTS.help),
  about: () => parseContent(COMMAND_TEXTS.about),
  lineup: () => parseContent(COMMAND_TEXTS.lineup),
  link: () => parseContent(COMMAND_TEXTS.link),
  voyage: () => parseContent(COMMAND_TEXTS.voyage),
  systems: () => parseContent(COMMAND_TEXTS.systems),
  gate: () => parseContent(COMMAND_TEXTS.gate),

  // 동적 콘텐츠 매핑
  status: () => {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    return parseContent(COMMAND_TEXTS.status(timestamp));
  },

  whois: (args?: string[]) => {
    const target = args?.[0]?.toLowerCase() || "";
    if (target === "stann" || target === "stannlumo") {
      return parseContent(COMMAND_TEXTS.whoisStann());
    }
    return parseContent(COMMAND_TEXTS.whoisUnknown(target));
  },

  whoami: () => {
    const guestId = Math.floor(Math.random() * 9000 + 1000);
    return parseContent(COMMAND_TEXTS.whoami(guestId));
  },

  sudo: (args?: string[]) => {
    if (
      args &&
      args[0]?.toLowerCase() === "login" &&
      args[1]?.toLowerCase() === "stann"
    ) {
      return parseContent(COMMAND_TEXTS.sudoStann());
    }
    return parseContent(COMMAND_TEXTS.sudoError());
  },

  echo: (args?: string[]) => {
    if (!args || args.length === 0) {
      return parseContent(COMMAND_TEXTS.echoError());
    }
    return parseContent(COMMAND_TEXTS.echoOutput(args.join(" ")));
  },
};

/**
 * 사용자 입력 명령어를 처리하고 응답 라인을 반환합니다.
 * @param raw - 사용자가 입력한 원시 문자열
 * @returns TerminalLine 배열
 */
export function processCommand(raw: string): {
  lines: TerminalLine[];
  shouldClear: boolean;
} {
  const trimmed = raw.trim();

  if (!trimmed) return { lines: [], shouldClear: false };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (cmd === "clear") {
    return { lines: [], shouldClear: true };
  }

  const handlerKey = cmd === "su" ? "sudo" : cmd;
  const handler = COMMAND_MAP[handlerKey as keyof typeof COMMAND_MAP];

  if (handler) {
    return { lines: handler(args), shouldClear: false };
  }

  return {
    lines: parseContent(COMMAND_TEXTS.commandNotFound(cmd)),
    shouldClear: false,
  };
}
