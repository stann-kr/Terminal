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
const COMMAND_MAP: Record<string, (args?: string[]) => TerminalLine[]> = {
  help: () => [
    line("┌──────────────────────────┐", "system"),
    line("│ TERMINAL CORE INDEX      │", "system"),
    line("└──────────────────────────┘", "system"),
    line("  [ INFORMATION ]", "system"),
    line("  about    — 프로젝트 개요 및 정보", "output"),
    line("  lineup   — 아티스트 라인업 조회", "output"),
    line("  gate     — 게이트(장소/일시) 정보", "output"),
    line("  status   — 시스템 가동 상태 확인", "output"),
    line("  link     — 외부 연결 링크 제공", "output"),
    line("  [ SYSTEM ]", "system"),
    line("  whoami   — 접속자 권한 확인", "output"),
    line("  echo     — 텍스트 출력 (예: echo hello)", "output"),
    line("  clear    — 터미널 화면 초기화", "output"),
    line(""),
  ],

  about: () => [
    line("┌──────────────────────────┐", "system"),
    line("│ THE UNIVERSAL JOURNEY    │", "system"),
    line("└──────────────────────────┘", "system"),
    line("  TERMINAL은 미지의 구역으로 향하는 항해의 출발점이자, ", "output"),
    line("  기계적 신호와 감각이 교차하는 정거장입니다.", "output"),
    line(
      "  우리는 화려한 시각적 수사를 배제하고, 오직 텍스트와 명령어로만",
      "output",
    ),
    line(
      "  시스템을 제어하는 CLI처럼 가장 본질적이고 미니멀한 파티를 지향합니다.",
      "output",
    ),
    line("  "),
    line(
      "  이 터미널을 가동하는 핵심은 초기 SF 미학의 무기질적인 질감을 담은",
      "output",
    ),
    line(
      "  최면적이고 미래지향적인(Hypnotic & Futuristic) 테크노입니다.",
      "output",
    ),
    line(
      "  차갑고 건조하게 설계된 공간 속에서 끝없이 반복되는 깊은 루프는",
      "output",
    ),
    line(
      "  일상적인 시공간의 경계를 해체합니다. 이곳에 접속한 사람들은 단순한",
      "output",
    ),
    line(
      "  관객이 아니라, 새로운 궤도를 탐색하기 위해 접근 권한을 얻은",
      "output",
    ),
    line("  개별적인 주체가 됩니다.", "output"),
    line("  "),
    line("  DIRECTOR : STANN LUMO", "output"),
    line(""),
  ],

  lineup: () => [
    line("┌──────────────────────────┐", "system"),
    line("│ ARTIST MANIFEST [01]     │", "system"),
    line("└──────────────────────────┘", "system"),
    line("  [01]  STANN LUMO", "success"),
    line("  [02]  MARCUS L", "success"),
    line("  [03]  NUSNOOM", "success"),
    line("────────────────────────────", "system"),
    line("  Genre: Hypnotic, Sci-Fi Techno", "output"),
    line(""),
  ],

  gate: () => [
    line("┌──────────────────────────┐", "system"),
    line("│ TARGET GATE [01]         │", "system"),
    line("└──────────────────────────┘", "system"),
    line("  DATE  : 2026.03.07 (SAT)", "output"),
    line("  VENUE : Club Faust, Seoul", "output"),
    line("  SECTOR: The Hidden Layer", "output"),
    line("────────────────────────────", "system"),
    line("  * Maiden Voyage to the Unknown Sector.", "output"),
    line(""),
  ],

  status: () => [
    line("┌──────────────────────────┐", "system"),
    line("│ SYSTEM STATUS REPORT     │", "system"),
    line("└──────────────────────────┘", "system"),
    line("  TERMINAL     [ OPERATIONAL ]", "success"),
    line("  MISSION      [ ACTIVE      ]", "success"),
    line("  HYPERDRIVE   [ CHARGING... ]", "output"),
    line(
      `  TIMESTAMP    [ ${new Date().toISOString().replace("T", " ").slice(0, 19)} UTC ]`,
      "output",
    ),
    line(""),
  ],

  link: () => [
    line("┌──────────────────────────┐", "system"),
    line("│ EXTERNAL LINKS           │", "system"),
    line("└──────────────────────────┘", "system"),
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
    line(""),
  ],

  whoami: () => [
    line("┌──────────────────────────┐", "system"),
    line("│ USER CREW MANIFEST       │", "system"),
    line("└──────────────────────────┘", "system"),
    line("  USER   : guest", "output"),
    line("  ROLE   : traveler", "output"),
    line("  ACCESS : LEVEL 1 (RESTRICTED)", "output"),
    line(""),
  ],

  sudo: () => [
    line("┌──────────────────────────┐", "system"),
    line("│ [ ERROR ] ACCESS DENIED. │", "system"),
    line("└──────────────────────────┘", "system"),
    line("  This incident has been reported to the central AI.", "error"),
    line(""),
  ],

  echo: (args?: string[]) => {
    if (!args || args.length === 0) {
      return [line("  usage: echo <text>", "error"), line("")];
    }
    return [line(`  ${args.join(" ")}`, "output"), line("")];
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
    lines: [
      line(
        `command not found: '${cmd}' — type 'help' for available commands.`,
        "error",
      ),
    ],
    shouldClear: false,
  };
}
