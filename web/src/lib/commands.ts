/**
 * TERMINAL [01] — CLI 명령어 처리기
 *
 * 각 명령어는 TerminalLine 배열을 반환합니다.
 * type: 'output' | 'error' | 'success' | 'system'
 */

export type LineType =
  | "output"
  | "error"
  | "success"
  | "system"
  | "input"
  | "link";

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

/** 명령어 → 응답 라인 매핑 */
const COMMAND_MAP: Record<string, () => TerminalLine[]> = {
  help: () => [
    line("─────────────────────────────────", "system"),
    line("  TERMINAL [01] / COMMAND INDEX", "system"),
    line("─────────────────────────────────", "system"),
    line("  lineup   — 아티스트 라인업 조회", "output"),
    line("  gate     — 게이트(장소/일시) 정보", "output"),
    line("  status   — 시스템 가동 상태 확인", "output"),
    line("  link     — 외부 연결 링크 제공", "output"),
    line("  clear    — 터미널 출력 초기화", "output"),
    line("─────────────────────────────────", "system"),
  ],

  lineup: () => [
    line("─────────────────────────────────", "system"),
    line("  ARTIST MANIFEST / TERMINAL [01]", "system"),
    line("─────────────────────────────────", "system"),
    line("  [01]  MARCUS L", "success"),
    line("  [02]  STANN LUMO", "success"),
    line("  [03]  MOONSUN", "success"),
    line("─────────────────────────────────", "system"),
    line("  Genre: Techno", "output"),
  ],

  gate: () => [
    line("─────────────────────────────────", "system"),
    line("  GATE INFORMATION", "system"),
    line("─────────────────────────────────", "system"),
    line("  DATE     2026.03.07 (SAT)", "output"),
    line("  VENUE    Club Faust, Seoul", "output"),
    line("  SECTOR   Unknown", "output"),
    line("─────────────────────────────────", "system"),
    line("  * Boarding begins at designated time.", "output"),
  ],

  status: () => [
    line("─────────────────────────────────", "system"),
    line("  SYSTEM STATUS REPORT", "system"),
    line("─────────────────────────────────", "system"),
    line("  TERMINAL       : OPERATIONAL", "success"),
    line("  MISSION        : ACTIVE", "success"),
    line("  HYPERDRIVE     : CHARGING", "output"),
    line(
      `  TIMESTAMP      : ${new Date().toISOString().replace("T", " ").slice(0, 19)} UTC`,
      "output",
    ),
    line("─────────────────────────────────", "system"),
  ],

  link: () => [
    line("─────────────────────────────────", "system"),
    line("  EXTERNAL LINKS", "system"),
    line("─────────────────────────────────", "system"),
    line(
      "  * Stann Lumo Instagram",
      "link",
      "https://www.instagram.com/stannlumo/",
    ),
    line(
      "  * Terminal Instagram",
      "link",
      "https://www.instagram.com/terminal_hub/",
    ),
    line("─────────────────────────────────", "system"),
  ],
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
  const cmd = raw.trim().toLowerCase();

  if (!cmd) return { lines: [], shouldClear: false };

  if (cmd === "clear") {
    return { lines: [], shouldClear: true };
  }

  const handler = COMMAND_MAP[cmd];
  if (handler) {
    return { lines: handler(), shouldClear: false };
  }

  return {
    lines: [
      line(
        `command not found: '${cmd}' — type 'help' for available commands.`,
        "error",
      ),
    ],
    shouldClear: false,
  };
}
