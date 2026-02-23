/**
 * TERMINAL [01] — 명령어 출력 텍스트 관리
 *
 * 텍스트만 작성 시 기본적으로 'output' 타입이 적용됩니다.
 * 하이라이트(success/error/system)나 링크가 필요할 경우,
 * [텍스트, 타입] 또는 [텍스트, "link", 링크URL] 형태의 배열로 작성하세요.
 */

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
  | "progress";

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

export const COMMAND_TEXTS = {
  help: {
    ko: [
      ["TERMINAL CORE INDEX", "header"],
      ["[ INFORMATION ]", "system"],
      "about    — 프로젝트 개요 및 목적",
      "lineup   — 아티스트 라인업 조회",
      "gate     — 일시/장소",
      "link     — 외부 디렉토리",
      "voyage   — 현재 궤도 및 섹터 브리핑",
      "systems  — 하드웨어 및 렌더링 상태 점검",
      "status   — 시스템 가동 로그",
      ["[ SYSTEM ARCHIVE ]", "system"],
      "settings — 언어 및 환경 설정",
      "whoami   — 현재 접속 세션 확인",
      "whois    — 시스템 아카이브 검색 (ex. whois stann)",
      "clear    — 디스플레이 초기화",
      "",
    ],
    en: [
      ["TERMINAL CORE INDEX", "header"],
      ["[ INFORMATION ]", "system"],
      "about    — Project overview and purpose",
      "lineup   — Artist lineup inquiry",
      "gate     — Date & Venue",
      "link     — External directories",
      "voyage   — Current orbit & sector briefing",
      "systems  — Hardware & rendering status check",
      "status   — System operation logs",
      ["[ SYSTEM ARCHIVE ]", "system"],
      "settings — Language & environment settings",
      "whoami   — Check current session",
      "whois    — System archive search (ex. whois stann)",
      "clear    — Clear display",
      "",
    ],
  } as I18nContentItem,

  about: {
    ko: [
      ["THE UNIVERSAL JOURNEY", "header"],
      "TERMINAL은 미지의 구역으로 향하는 항해의 기점이자, ",
      "오디오 신호와 데이터가 교차하는 무기질적인 정거장입니다.",
      " ",
      "[ DESIGN PRINCIPLE ]",
      "화려한 시각적 수사를 배제하고, 오직 텍스트와 명령어로만 시스템을 제어하는",
      "CLI(Command Line Interface)처럼 가장 본질적이고 미니멀한 형태의 이벤트를 지향합니다.",
      " ",
      "이 터미널을 가동하는 핵심 엔진은 SF 미학의 질감을 담은",
      "최면적이고 미래지향적인(Hypnotic & Futuristic) 테크노입니다.",
      "이곳에 접속한 모든 객체(User)는 단순한 관람객이 아닌,",
      "새로운 궤도를 함께 연산하는 개별적인 노드(Node)로 기능합니다.",
      " ",
      "TERMINAL MASTER : STANN LUMO",
      "",
    ],
    en: [
      ["THE UNIVERSAL JOURNEY", "header"],
      "TERMINAL is the starting point for a voyage into unknown sectors,",
      "an inorganic station where audio signals and data intersect.",
      " ",
      "[ DESIGN PRINCIPLE ]",
      "Excluding flashy visual rhetoric, it aims for the most essential and minimal",
      "event format, controlling the system solely through text and commands like a CLI.",
      " ",
      "The core engine powering this terminal is Hypnotic & Futuristic Techno",
      "infused with the texture of Sci-Fi aesthetics.",
      "Every object (User) accessing here functions not just as an audience,",
      "but as an individual Node computing new orbits together.",
      " ",
      "TERMINAL MASTER : STANN LUMO",
      "",
    ],
  } as I18nContentItem,

  lineup: {
    ko: [
      ["AUDIO CONTROLLERS [01]", "header"],
      ["[01]  STANN LUMO", "success"],
      ["[02]  MARCUS L", "success"],
      ["[03]  MOONSUN", "success"],
      ["────────────────────", "system"],
      "Format: Hypnotic, Futuristic Techno",
      "",
    ],
    en: [
      ["AUDIO CONTROLLERS [01]", "header"],
      ["[01]  STANN LUMO", "success"],
      ["[02]  MARCUS L", "success"],
      ["[03]  MOONSUN", "success"],
      ["────────────────────", "system"],
      "Format: Hypnotic, Futuristic Techno",
      "",
    ],
  } as I18nContentItem,

  voyage: {
    ko: [
      ["VOYAGE DIRECTIVE 01", "header"],
      "[ MAIDEN VOYAGE TO THE UNKNOWN SECTOR ]",
      "Objective: 미관측 시공간 진입 및 주파수 동기화.",
      ["Status: 궤도 진입 중 (IN PROGRESS)", "success"],
      [
        "Warning: 장시간 연속되는 루프(Hypnotic Loop)는 인지 감각을 왜곡할 수 있습니다.",
        "error",
      ],
      "",
    ],
    en: [
      ["VOYAGE DIRECTIVE 01", "header"],
      "[ MAIDEN VOYAGE TO THE UNKNOWN SECTOR ]",
      "Objective: Enter unobserved spacetime and synchronize frequencies.",
      ["Status: Entering orbit (IN PROGRESS)", "success"],
      [
        "Warning: Prolonged continuous loops (Hypnotic Loops) may distort cognitive senses.",
        "error",
      ],
      "",
    ],
  } as I18nContentItem,

  systems: {
    ko: [
      ["HARDWARE DIAGNOSTICS", "header"],
      ["Core Logic:      [ONLINE / STABLE]", "success"],
      "Routing:         [CALCULATING -> FAUST_SEOUL]",
      ["Audio Engine:    [LOCKED ON 138.00 BPM]", "success"],
      ["Acoustic Array:  [NOMINAL]", "success"],
      "",
    ],
    en: [
      ["HARDWARE DIAGNOSTICS", "header"],
      ["Core Logic:      [ONLINE / STABLE]", "success"],
      "Routing:         [CALCULATING -> FAUST_SEOUL]",
      ["Audio Engine:    [LOCKED ON 138.00 BPM]", "success"],
      ["Acoustic Array:  [NOMINAL]", "success"],
      "",
    ],
  } as I18nContentItem,

  gate: {
    ko: [
      ["TARGET COORDINATES [01]", "header"],
      "DATE  : 2026.03.07 (SAT)",
      "VENUE : Club Faust, Seoul",
      "DESTINATION: The Hidden Layer",
      ["", "divider"],
      "* Maiden Voyage to the Unknown Sector.",
      "",
    ],
    en: [
      ["TARGET COORDINATES [01]", "header"],
      "DATE  : 2026.03.07 (SAT)",
      "VENUE : Club Faust, Seoul",
      "DESTINATION: The Hidden Layer",
      ["", "divider"],
      "* Maiden Voyage to the Unknown Sector.",
      "",
    ],
  } as I18nContentItem,

  link: {
    ko: [
      ["EXTERNAL LINKS", "header"],
      ["* Stann Lumo Archive", "link", "https://www.instagram.com/stannlumo/"],
      ["* Terminal Network", "link", "https://www.instagram.com/terminal_hub/"],
      "",
    ],
    en: [
      ["EXTERNAL LINKS", "header"],
      ["* Stann Lumo Archive", "link", "https://www.instagram.com/stannlumo/"],
      ["* Terminal Network", "link", "https://www.instagram.com/terminal_hub/"],
      "",
    ],
  } as I18nContentItem,

  // ----------------------------------------------------------------------
  // 동적 데이터 주입을 위한 함수형 텍스트 블록
  // ----------------------------------------------------------------------

  status: (timestamp: string): I18nContentItem => ({
    ko: [
      ["SYSTEM STATUS REPORT", "header"],
      ["TERMINAL     [ OPERATIONAL ]", "success"],
      ["SEQUENCE     [ ACTIVE      ]", "success"],
      "AUDIO BUFFER [ CHARGING... ]",
      `TIMESTAMP    [ ${timestamp} UTC ]`,
      "",
    ],
    en: [
      ["SYSTEM STATUS REPORT", "header"],
      ["TERMINAL     [ OPERATIONAL ]", "success"],
      ["SEQUENCE     [ ACTIVE      ]", "success"],
      "AUDIO BUFFER [ CHARGING... ]",
      `TIMESTAMP    [ ${timestamp} UTC ]`,
      "",
    ],
  }),

  whoami: (guestId: number): I18nContentItem => ({
    ko: [
      ["SESSION IDENTIFICATION", "header"],
      `USER_ID : guest_${guestId}`,
      ["[INFO] 해당 세션은 TERMINAL [01] 궤도에 접속되었습니다.", "system"],
      "ROLE    : Observer / Node",
      ["ACCESS  : LEVEL 1 (CORE SYSTEM LOCKED)", "error"],
      "",
    ],
    en: [
      ["SESSION IDENTIFICATION", "header"],
      `USER_ID : guest_${guestId}`,
      ["[INFO] This session is connected to TERMINAL [01] orbit.", "system"],
      "ROLE    : Observer / Node",
      ["ACCESS  : LEVEL 1 (CORE SYSTEM LOCKED)", "error"],
      "",
    ],
  }),

  whoisStann: (): I18nContentItem => ({
    ko: [
      ["ARCHIVE SEARCH: STANN", "header"],
      ["[SEARCHING DB...]", "progress"],
      " ",
      ["ENTITY: STANN LUMO", "success"],
      ["ROLE: System Architect / Hypnotic Core", "success"],
      "STATUS: [ACTIVE]",
      ["DATA_LOG:", "system"],
      "- 깊고 반복적인 오디오 텍스처를 통해 시스템의 인지 체계를 설계함.",
      "- 미지의 구역(Unknown Sector)으로 향하는 첫 항로의 메인 컨트롤러.",
      [
        "- Soundcloud: https://soundcloud.com/stannlumo",
        "link",
        "https://soundcloud.com/stannlumo",
      ],
      "",
    ],
    en: [
      ["ARCHIVE SEARCH: STANN", "header"],
      ["[SEARCHING DB...]", "progress"],
      " ",
      ["ENTITY: STANN LUMO", "success"],
      ["ROLE: System Architect / Hypnotic Core", "success"],
      "STATUS: [ACTIVE]",
      ["DATA_LOG:", "system"],
      "- Designs the system's cognitive framework through deep, repetitive audio textures.",
      "- Main controller of the first voyage heading to the Unknown Sector.",
      [
        "- Soundcloud: https://soundcloud.com/stannlumo",
        "link",
        "https://soundcloud.com/stannlumo",
      ],
      "",
    ],
  }),

  whoisUnknown: (target: string): I18nContentItem => ({
    ko: [
      [
        `Query failed: Entity '${target}' not found in public registry.`,
        "error",
      ],
      ["Hint: Try 'whois stann'", "system"],
      "",
    ],
    en: [
      [
        `Query failed: Entity '${target}' not found in public registry.`,
        "error",
      ],
      ["Hint: Try 'whois stann'", "system"],
      "",
    ],
  }),

  sudoStann: (): I18nContentItem => ({
    ko: [
      ["SYSTEM OVERRIDE", "header"],
      ["  [AUTHENTICATING...]", "progress"],
      ["  ACCESS GRANTED. Welcome back, ROOT.", "success"],
      ["  [SYSTEM MESSAGE] 모든 보안 프로토콜이 해제되었습니다.", "system"],
      ["  터미널 제어권을 전환합니다.", "system"],
      "",
    ],
    en: [
      ["SYSTEM OVERRIDE", "header"],
      ["  [AUTHENTICATING...]", "progress"],
      ["  ACCESS GRANTED. Welcome back, ROOT.", "success"],
      [
        "  [SYSTEM MESSAGE] All security protocols have been disabled.",
        "system",
      ],
      ["  Transferring terminal control.", "system"],
      "",
    ],
  }),

  sudoError: (): I18nContentItem => ({
    ko: [
      ["[ ERROR ] ACCESS DENIED.", "header"],
      ["  Unauthorized access attempt logged.", "error"],
      "",
    ],
    en: [
      ["[ ERROR ] ACCESS DENIED.", "header"],
      ["  Unauthorized access attempt logged.", "error"],
      "",
    ],
  }),

  echoError: (): I18nContentItem => ({
    ko: [["  usage: echo <text>", "error"], ""],
    en: [["  usage: echo <text>", "error"], ""],
  }),

  echoOutput: (text: string): I18nContentItem => ({
    ko: [`  ${text}`, ""],
    en: [`  ${text}`, ""],
  }),

  commandNotFound: (cmd: string): I18nContentItem => ({
    ko: [
      [
        `command not found: '${cmd}' — type 'help' for available commands.`,
        "error",
      ],
    ],
    en: [
      [
        `command not found: '${cmd}' — type 'help' for available commands.`,
        "error",
      ],
    ],
  }),

  // ----------------------------------------------------------------------
  // 초기 로딩 및 환영 메시지 (v0.33.0 이전)
  // ----------------------------------------------------------------------

  bootSequence: {
    ko: [
      { text: "TERMINAL CORE — SYSTEM BOOT INITIATED", type: "system" },
      { text: "...", type: "system" },
      { text: "[ OK ] Loading kernel modules...", type: "output" },
      { text: "[ OK ] Mounting hyperdrive array...", type: "output" },
      { text: "[ OK ] Initializing navigation matrix...", type: "output" },
      { text: "[ OK ] Calibrating frequency bands...", type: "output" },
      { text: "[ -- ] Scanning for explorers manifest...", type: "system" },
      {
        text: "[ OK ] Explorers loaded: 3 personnel confirmed.",
        type: "output",
      },
      { text: "[ -- ] Verifying gate coordinates...", type: "system" },
      { text: "[ OK ] Gate: Club Faust, Seoul / 2026.03.07", type: "output" },
      { text: "...", type: "system" },
      { text: "", type: "divider" },
      { text: "STATUS: OPERATIONAL", type: "success" },
      { text: "Maiden Voyage to the Unknown Sector.", type: "success" },
      { text: "", type: "divider" },
    ],
    en: [
      { text: "TERMINAL CORE — SYSTEM BOOT INITIATED", type: "system" },
      { text: "...", type: "system" },
      { text: "[ OK ] Loading kernel modules...", type: "output" },
      { text: "[ OK ] Mounting hyperdrive array...", type: "output" },
      { text: "[ OK ] Initializing navigation matrix...", type: "output" },
      { text: "[ OK ] Calibrating frequency bands...", type: "output" },
      { text: "[ -- ] Scanning for explorers manifest...", type: "system" },
      {
        text: "[ OK ] Explorers loaded: 3 personnel confirmed.",
        type: "output",
      },
      { text: "[ -- ] Verifying gate coordinates...", type: "system" },
      { text: "[ OK ] Gate: Club Faust, Seoul / 2026.03.07", type: "output" },
      { text: "...", type: "system" },
      { text: "", type: "divider" },
      { text: "STATUS: OPERATIONAL", type: "success" },
      { text: "Maiden Voyage to the Unknown Sector.", type: "success" },
      { text: "", type: "divider" },
    ],
  } as I18nBootLine,

  welcomeMessage: {
    ko: [
      ["TERMINAL CORE SYSTEM — ACCESS GRANTED", "success"],
      ["", "divider"],
    ],
    en: [
      ["TERMINAL CORE SYSTEM — ACCESS GRANTED", "success"],
      ["", "divider"],
    ],
  } as I18nContentItem,
};
