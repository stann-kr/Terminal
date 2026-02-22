/**
 * TERMINAL [01] — 명령어 출력 텍스트 관리
 *
 * 텍스트만 작성 시 기본적으로 'output' 타입이 적용됩니다.
 * 하이라이트(success/error/system)나 링크가 필요할 경우,
 * [텍스트, 타입] 또는 [텍스트, "link", 링크URL] 형태의 배열로 작성하세요.
 */

export type LineType =
  | "output"
  | "error"
  | "success"
  | "system"
  | "input"
  | "link";

export type ContentItem =
  | string
  | [string, LineType]
  | [string, "link", string];

export const COMMAND_TEXTS = {
  help: [
    ["┌──────────────────────────┐", "system"],
    ["│ TERMINAL CORE INDEX      │", "system"],
    ["└──────────────────────────┘", "system"],
    ["  [ INFORMATION ]", "system"],
    "  about    — 프로젝트 개요 및 목적",
    "  lineup   — 아티스트 라인업 조회",
    "  gate     — 일시/장소",
    "  link     — 외부 디렉토리",
    "  voyage   — 현재 궤도 및 섹터 브리핑",
    "  systems  — 하드웨어 및 렌더링 상태 점검",
    "  status   — 시스템 가동 로그",
    ["  [ SYSTEM ARCHIVE ]", "system"],
    "  whoami   — 현재 접속 세션 확인",
    "  whois    — 시스템 아카이브 검색 (ex. whois stann)",
    "  clear    — 디스플레이 초기화",
    "",
  ] as ContentItem[],

  about: [
    ["┌──────────────────────────┐", "system"],
    ["│ THE UNIVERSAL JOURNEY    │", "system"],
    ["└──────────────────────────┘", "system"],
    "  TERMINAL은 미지의 구역으로 향하는 항해의 기점이자, ",
    "  오디오 신호와 데이터가 교차하는 무기질적인 정거장입니다.",
    "  ",
    "  [ DESIGN PRINCIPLE ]",
    "  화려한 시각적 수사를 배제하고, 오직 텍스트와 명령어로만 시스템을 제어하는",
    "  CLI(Command Line Interface)처럼 가장 본질적이고 미니멀한 형태의 이벤트를 지향합니다.",
    "  ",
    "  이 터미널을 가동하는 핵심 엔진은 SF 미학의 질감을 담은",
    "  최면적이고 미래지향적인(Hypnotic & Futuristic) 테크노입니다.",
    "  이곳에 접속한 모든 객체(User)는 단순한 관람객이 아닌,",
    "  새로운 궤도를 함께 연산하는 개별적인 노드(Node)로 기능합니다.",
    "  ",
    "  TERMINAL MASTER : STANN LUMO",
    "",
  ] as ContentItem[],

  lineup: [
    ["┌──────────────────────────┐", "system"],
    ["│ AUDIO CONTROLLERS [01]   │", "system"],
    ["└──────────────────────────┘", "system"],
    ["  [01]  STANN LUMO", "success"],
    ["  [02]  MARCUS L", "success"],
    ["  [03]  MOONSUN", "success"],
    ["────────────────────────────", "system"],
    "  Format: Hypnotic, Futuristic Techno",
    "",
  ] as ContentItem[],

  voyage: [
    ["┌──────────────────────────┐", "system"],
    ["│ VOYAGE DIRECTIVE 01      │", "system"],
    ["└──────────────────────────┘", "system"],
    "  [ MAIDEN VOYAGE TO THE UNKNOWN SECTOR ]",
    "  Objective: 미관측 시공간 진입 및 주파수 동기화.",
    ["  Status: 궤도 진입 중 (IN PROGRESS)", "success"],
    [
      "  Warning: 장시간 연속되는 루프(Hypnotic Loop)는 인지 감각을 왜곡할 수 있습니다.",
      "error",
    ],
    "",
  ] as ContentItem[],

  systems: [
    ["┌──────────────────────────┐", "system"],
    ["│ HARDWARE DIAGNOSTICS     │", "system"],
    ["└──────────────────────────┘", "system"],
    ["  Core Logic:      [ONLINE / STABLE]", "success"],
    "  Routing:         [CALCULATING -> FAUST_SEOUL]",
    ["  Audio Engine:    [LOCKED ON 138.00 BPM]", "success"],
    ["  Acoustic Array:  [NOMINAL]", "success"],
    "",
  ] as ContentItem[],

  gate: [
    ["┌──────────────────────────┐", "system"],
    ["│ TARGET COORDINATES [01]  │", "system"],
    ["└──────────────────────────┘", "system"],
    "  DATE  : 2026.03.07 (SAT)",
    "  VENUE : Club Faust, Seoul",
    "  SECTOR: The Hidden Layer",
    ["────────────────────────────", "system"],
    "  * Maiden Voyage to the Unknown Sector.",
    "",
  ] as ContentItem[],

  link: [
    ["┌──────────────────────────┐", "system"],
    ["│ EXTERNAL LINKS           │", "system"],
    ["└──────────────────────────┘", "system"],
    ["  * Stann Lumo Archive", "link", "https://www.instagram.com/stannlumo/"],
    ["  * Terminal Network", "link", "https://www.instagram.com/terminal_hub/"],
    "",
  ] as ContentItem[],

  // ----------------------------------------------------------------------
  // 동적 데이터 주입을 위한 함수형 텍스트 블록
  // ----------------------------------------------------------------------

  status: (timestamp: string): ContentItem[] => [
    ["┌──────────────────────────┐", "system"],
    ["│ SYSTEM STATUS REPORT     │", "system"],
    ["└──────────────────────────┘", "system"],
    ["  TERMINAL     [ OPERATIONAL ]", "success"],
    ["  SEQUENCE     [ ACTIVE      ]", "success"],
    "  AUDIO BUFFER [ CHARGING... ]",
    `  TIMESTAMP    [ ${timestamp} UTC ]`,
    "",
  ],

  whoami: (guestId: number): ContentItem[] => [
    ["┌──────────────────────────┐", "system"],
    ["│ SESSION IDENTIFICATION   │", "system"],
    ["└──────────────────────────┘", "system"],
    `  USER_ID : guest_${guestId}`,
    ["  [INFO] 해당 세션은 TERMINAL [01] 궤도에 접속되었습니다.", "system"],
    "  ROLE    : Observer / Node",
    ["  ACCESS  : LEVEL 1 (CORE SYSTEM LOCKED)", "error"],
    "",
  ],

  whoisStann: (): ContentItem[] => [
    ["┌──────────────────────────┐", "system"],
    ["│ ARCHIVE SEARCH: STANN    │", "system"],
    ["└──────────────────────────┘", "system"],
    "  [SEARCHING DB...] ▒▒▒▒▒░░░░░ ",
    "  ",
    ["  ENTITY: STANN LUMO", "success"],
    ["  ROLE: System Architect / Hypnotic Core", "success"],
    "  STATUS: [ACTIVE]",
    ["  DATA_LOG:", "system"],
    "  - 깊고 반복적인 오디오 텍스처를 통해 시스템의 인지 체계를 설계함.",
    "  - 미지의 구역(Unknown Sector)으로 향하는 첫 항로의 메인 컨트롤러.",
    [
      "  - Soundcloud: https://soundcloud.com/stannlumo",
      "link",
      "https://soundcloud.com/stannlumo",
    ],
    "",
  ],

  whoisUnknown: (target: string): ContentItem[] => [
    [
      `  Query failed: Entity '${target}' not found in public registry.`,
      "error",
    ],
    ["  Hint: Try 'whois stann'", "system"],
    "",
  ],

  sudoStann: (): ContentItem[] => [
    ["┌──────────────────────────┐", "system"],
    ["│ SYSTEM OVERRIDE          │", "system"],
    ["└──────────────────────────┘", "system"],
    "  [AUTHENTICATING...] ▒▒▒▒▒▒▒▒▒▒",
    ["  ACCESS GRANTED. Welcome back, ROOT.", "success"],
    ["  [SYSTEM MESSAGE] 모든 보안 프로토콜이 해제되었습니다.", "system"],
    ["  터미널 제어권을 전환합니다.", "system"],
    "",
  ],

  sudoError: (): ContentItem[] => [
    ["┌──────────────────────────┐", "system"],
    ["│ [ ERROR ] ACCESS DENIED. │", "system"],
    ["└──────────────────────────┘", "system"],
    ["  Unauthorized access attempt logged.", "error"],
    "",
  ],

  echoError: (): ContentItem[] => [["  usage: echo <text>", "error"], ""],

  echoOutput: (text: string): ContentItem[] => [`  ${text}`, ""],

  commandNotFound: (cmd: string): ContentItem[] => [
    [
      `command not found: '${cmd}' — type 'help' for available commands.`,
      "error",
    ],
  ],
};
