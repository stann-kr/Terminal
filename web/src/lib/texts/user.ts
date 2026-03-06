import { I18nContentItem, ContentItem } from "../types";

export const status = (timestamp: string, dDay: string): I18nContentItem => ({
  ko: [
    ["시스템 가동 상태 보고", "header"],
    ["TERMINAL [01] : BOOT SEQUENCE", "system"],
    ["", "divider"],
    [`카운트다운        [ ${dDay} ]`, "success"],
    ["터미널 코어       [ 가동 중 ]", "success"],
    ["라인업            [ 확정 ]", "success"],
    ["게이트 좌표       [ 확인됨 : Faust, Seoul ]", "success"],
    "오디오 버퍼       [ 충전 중... ]",
    `기록 시간         [ ${timestamp} KST ]`,
    "",
  ],
  en: [
    ["SYSTEM STATUS REPORT", "header"],
    ["TERMINAL [01] : BOOT SEQUENCE", "system"],
    ["", "divider"],
    [`COUNTDOWN         [ ${dDay} ]`, "success"],
    ["TERMINAL CORE     [ OPERATIONAL ]", "success"],
    ["LINEUP            [ CONFIRMED   ]", "success"],
    ["GATE COORDINATES  [ VERIFIED : Faust, Seoul ]", "success"],
    "AUDIO BUFFER      [ CHARGING... ]",
    `TIMESTAMP         [ ${timestamp} KST ]`,
    "",
  ],
});

export const dateTime = (dateStr: string): I18nContentItem => ({
  ko: [
    ["터미널 타이머 동기화", "header"],
    `[ 접속 시간 ] ${dateStr}`,
    ["시스템 시간선 동기화 완료.", "success"],
    "",
  ],
  en: [
    ["TERMINAL UPTIME", "header"],
    `[ LOCAL TIME ] ${dateStr}`,
    ["Timeline synchronization complete.", "success"],
    "",
  ],
});

export const swearWord = (word: string): I18nContentItem => ({
  ko: [
    ["[ 시스템 치명적 경고: 위반 프로토콜 스캔됨 ]", "header"],
    [`감지된 텍스트 '${word}'는 시스템에서 허용되지 않는 구문입니다.`, "error"],
    [
      "기록: 비속어 필터를 우회하는 무허가 행동이 감지되었습니다. 행동을 교정하십시오.",
      "system",
    ],
    ["이 행동이 지속될 경우 해당 세션은 영구 추방됩니다.", "error"],
    "",
  ],
  en: [
    ["[ CRITICAL SYSTEM WARNING: PROTOCOL VIOLATION ]", "header"],
    [`The detected text '${word}' is an illegal syntax.`, "error"],
    [
      "Log: Attempts to bypass the profanity filter detected. Correct your behavior immediately.",
      "system",
    ],
    ["If continued, this session will be permanently banned.", "error"],
    "",
  ],
});

export const whoami = (
  nodeId: string,
  name?: string,
  isAdmin?: boolean,
): I18nContentItem => ({
  ko: [
    ["접속 세션 식별 정보", "header"],
    `고유 ID : ${nodeId}`,
    ...((name ? [`이 름   : ${name}`] : []) as ContentItem[]),
    [
      "[INFO] 해당 세션은 TERMINAL [01] 메인 시스템에 접속되었습니다.",
      "system",
    ],
    ...(isAdmin
      ? [
          [
            "역 할   : 마스터 노드 (Master Node) / 관리자",
            "success",
          ] as ContentItem,
          ["권 한   : LEVEL 5 (관리자 접근 허용됨)", "success"] as ContentItem,
        ]
      : [
          "역 할   : 관측자 (Observer) / 서브 노드" as ContentItem,
          ["권 한   : LEVEL 1 (코어 시스템 잠김)", "error"] as ContentItem,
        ]),
    "",
  ],
  en: [
    ["SESSION IDENTIFICATION", "header"],
    `NODE ID : ${nodeId}`,
    ...((name ? [`NAME    : ${name}`] : []) as ContentItem[]),
    [
      "[INFO] This session is connected to TERMINAL [01] main system.",
      "system",
    ],
    ...(isAdmin
      ? [
          ["ROLE    : Master Node / Admin", "success"] as ContentItem,
          [
            "ACCESS  : LEVEL 5 (ADMIN ACCESS GRANTED)",
            "success",
          ] as ContentItem,
        ]
      : [
          "ROLE    : Observer / Node" as ContentItem,
          ["ACCESS  : LEVEL 1 (CORE SYSTEM LOCKED)", "error"] as ContentItem,
        ]),
    "",
  ],
});

export const whoisStann: () => I18nContentItem = () => ({
  ko: [
    ["아카이브 검색: STANN", "header"],
    ["[DB 검색 중...]", "progress"],
    " ",
    ["엔티티 식별: STANN LUMO", "success"],
    ["역할: 시스템 아키텍트 / 최면 코어(Hypnotic Core)", "success"],
    "상태: [활성화 (ACTIVE)]",
    ["데이터 로그:", "system"],
    "- 베이스 좌표: 서울. 원초적인 사운드와 고강도 에너지(High-Intensity)를 출력함.",
    "- 본능적인 리듬과 딥 믹싱으로 이질적인(Otherworldly) 대기 상태를 렌더링함.",
    "- 전통적 테크노의 파라미터를 확장하여 압도적인 몰입감(Immersion)을 생성.",
    "- 현재 소속 노드: 클럽 파우스트(Faust, Seoul) 레지던트 오퍼레이터.",
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
    "- Base Coordinates: Seoul. Outputs primal sound and high-intensity energy.",
    "- Renders otherworldly atmospheres via instinctive rhythm and deep mixing.",
    "- Expands traditional techno parameters to generate powerful immersion.",
    "- Current Assigned Node: Resident Operator at Faust (Seoul).",
    [
      "- Soundcloud: https://soundcloud.com/stannlumo",
      "link",
      "https://soundcloud.com/stannlumo",
    ],
    "",
  ],
});

export const whoisMarcus: () => I18nContentItem = () => ({
  ko: [
    ["아카이브 검색: MARCUS L", "header"],
    ["[DB 검색 중...]", "progress"],
    " ",
    ["엔티티 식별: MARCUS L", "success"],
    ["역할: 섹터 네비게이터 / 로컬 네트워크 코어", "success"],
    "상태: [활성화 (ACTIVE)]",
    ["데이터 로그:", "system"],
    "- 베이스 좌표: 서울. 과거(Legacy)와 미래(Futuristic)의 프로토콜을 교차하는 고출력 에너지를 발산함.",
    "- 로컬 씬의 아키텍처를 확장하고 문화를 주도하는 핵심 인프라.",
    "- 출력 주파수 대역: 딥 테크노, 인더스트리얼, 트랜스, 90s 클래식.",
    "- 글로벌 라우팅 이력: 영국(UK), 베를린(Berlin).",
    "- 2014년 서브 네트워크 '@Ameniia' 및 'Kammer Radio & Records' 구축.",
    "- 아시아 주요 거점 노드 '클럽 파우스트(Faust)'의 소유자(Superuser)로, 댄스 뮤직의 미래 비전을 전 세계로 전송 중.",
    "",
  ],
  en: [
    ["ARCHIVE SEARCH: MARCUS L", "header"],
    ["[SEARCHING DB...]", "progress"],
    " ",
    ["ENTITY: MARCUS L", "success"],
    ["ROLE: Sector Navigator / Local Network Core", "success"],
    "STATUS: [ACTIVE]",
    ["DATA_LOG:", "system"],
    "- Base Coordinates: Seoul. Outputs high-yield energy bridging legacy protocols and futuristic concepts.",
    "- Core infrastructure expanding the local network architecture and cultural topology.",
    "- Frequency Output Spectrum: Deep Techno, Industrial, Trance, 90s Classics.",
    "- Global Routing History: UK, Berlin.",
    "- Initialized sub-networks '@Ameniia' and 'Kammer Radio & Records' in 2014.",
    "- Superuser and proprietor of Node 'FAUST', providing a crucial platform for worldwide data transfer.",
    "",
  ],
});

export const whoisNusnoom: () => I18nContentItem = () => ({
  ko: [
    ["아카이브 검색: NUSNOOM", "header"],
    ["[DB 검색 중...]", "progress"],
    " ",
    ["엔티티 식별: NUSNOOM", "success"],
    ["역할: 주파수 및 대기 상태 제어 (Atmosphere Control)", "success"],
    "상태: [활성화 (ACTIVE)]",
    ["데이터 로그:", "system"],
    "- 베이스 좌표: 서울. 현재 소속 노드: 클럽 파우스트(Faust) 레지던트 오퍼레이터.",
    "- 고속 연산 비트(Fast-paced beats)에 자연의 파형(Organic Waveforms)과 아프리칸 타악기 데이터를 병합하여 최면적인 루프 생성.",
    "- 접속된 노드(관객)들을 소리가 유기체(Living matter)로 변환되는 시뮬레이션 환경으로 동기화시킴.",
    "- 타이베이 폰샵(Pawnshop) 노드 4주년 프로토콜에서 독자적인 사운드 시그니처를 성공적으로 전송함.",
    "- 베를린의 전설적인 메인프레임 'Tresor'에 Faust 시스템과 함께 접속하여 글로벌 네트워크 평판을 확립.",
    "",
  ],
  en: [
    ["ARCHIVE SEARCH: NUSNOOM", "header"],
    ["[SEARCHING DB...]", "progress"],
    " ",
    ["ENTITY: NUSNOOM", "success"],
    ["ROLE: Frequency & Atmosphere Control", "success"],
    "STATUS: [ACTIVE]",
    ["DATA_LOG:", "system"],
    "- Base Coordinates: Seoul. Current Assigned Node: Resident Operator at Faust.",
    "- Merges high-velocity processing with organic waveforms and percussive data to generate hypnotic loops.",
    "- Renders an untamed, simulated terrain where sound transforms into living matter.",
    "- Executed cross-server protocol at Pawnshop (Taipei) 4th Anniversary, expanding network reach.",
    "- Logged a major milestone at legacy mainframe 'Tresor' (Berlin) alongside the FAUST system, solidifying global status.",
    "",
  ],
});

export const whoisUnknown = (target: string): I18nContentItem => ({
  ko: [
    [
      `검색 실패: '${target}' 엔티티를 공개 레지스트리에서 찾을 수 없습니다.`,
      "error",
    ],
    ["Hint: 'whois stann'을 시도해 보십시오.", "system"],
    "",
  ],
  en: [
    [`Query failed: Entity '${target}' not found in public registry.`, "error"],
    ["Hint: Try 'whois stann'", "system"],
    "",
  ],
});

export const sudoStann: () => I18nContentItem = () => ({
  ko: [
    ["시스템 오버라이드 경고", "header"],
    ["  [인증 진행 중...]", "progress"],
    ["  승인됨 (ACCESS GRANTED). 환영합니다, 마스터 노드.", "success"],
    [
      "  [SYSTEM MESSAGE] 모든 권한 통제 보안 프로토콜이 성공적으로 해제되었습니다.",
      "system",
    ],
    ["  터미널 통제권을 수동으로 전환합니다.", "system"],
    "",
  ],
  en: [
    ["SYSTEM OVERRIDE", "header"],
    ["  [AUTHENTICATING...]", "progress"],
    ["  ACCESS GRANTED. Welcome back, ROOT.", "success"],
    ["  [SYSTEM MESSAGE] All security protocols have been disabled.", "system"],
    ["  Transferring terminal control.", "system"],
    "",
  ],
});

export const sudoError: () => I18nContentItem = () => ({
  ko: [
    ["[ ERROR ] 접근이 거부되었습니다.", "header"],
    [
      "  비인가 권한의 불법 접근 시도가 데이터베이스에 기록되었습니다.",
      "error",
    ],
    "",
  ],
  en: [
    ["[ ERROR ] ACCESS DENIED.", "header"],
    ["  Unauthorized access attempt logged.", "error"],
    "",
  ],
});

export const echoError: () => I18nContentItem = () => ({
  ko: [["  사용법: echo <텍스트>", "error"], ""],
  en: [["  usage: echo <text>", "error"], ""],
});

export const echoOutput = (text: string): I18nContentItem => ({
  ko: [`  ${text}`, ""],
  en: [`  ${text}`, ""],
});

export const commandSuggestion = (suggestion: string): I18nContentItem => ({
  ko: [["  혹시 '" + suggestion + "' 을(를) 찾으셨나요?", "system"]],
  en: [["  Did you mean '" + suggestion + "'?", "system"]],
});

export const commandNotFound = (cmd: string): I18nContentItem => ({
  ko: [
    [
      `명령어를 찾을 수 없음: '${cmd}' — 사용 가능한 명령어를 보려면 'help'를 입력하세요.`,
      "error",
    ],
  ],
  en: [
    [
      `command not found: '${cmd}' — type 'help' for available commands.`,
      "error",
    ],
  ],
});

export const settingsApply: I18nContentItem = {
  ko: [["세팅값 변경 중...", "progress"]],
  en: [["Applying settings...", "progress"]],
};

export const nameSet = (name: string): I18nContentItem => ({
  ko: [["이름이 설정되었습니다 : " + name, "success"], ""],
  en: [["Name set: " + name, "success"], ""],
});

export const nameCurrent = (name: string): I18nContentItem => ({
  ko: [
    ["현재 이름 설정", "header"],
    `이 름 : ${name}`,
    ["변경하려면 'name <새 이름>'을 입력하세요.", "system"],
    ["제거하려면 'name clear'를 입력하세요.", "system"],
    "",
  ],
  en: [
    ["CURRENT NAME", "header"],
    `NAME : ${name}`,
    ["To change, type 'name <new name>'.", "system"],
    ["To remove, type 'name clear'.", "system"],
    "",
  ],
});

export const nameCleared = (nodeId: string): I18nContentItem => ({
  ko: [["이름이 제거되었습니다. 기본 ID로 복원: " + nodeId, "system"], ""],
  en: [["Name removed. Reverted to node ID: " + nodeId, "system"], ""],
});

export const nameEmpty: I18nContentItem = {
  ko: [
    ["이름이 설정되지 않았습니다.", "system"],
    ["설정하려면 'name <이름>'을 입력하세요.", "system"],
    "",
  ],
  en: [
    ["No name configured.", "system"],
    ["Type 'name <your name>' to set one.", "system"],
    "",
  ],
};

export const nameInvalid: I18nContentItem = {
  ko: [["[ ERROR ] 이름은 1~20자 이내로 입력하세요.", "error"], ""],
  en: [["[ ERROR ] Name must be between 1 and 20 characters.", "error"], ""],
};

export const systems = (isAdmin: boolean): I18nContentItem => ({
  ko: [
    ["시스템 하드웨어 진단", "header"],
    ["코어 연산:           [ 온라인 / 안정적 ]", "success"],
    "대상 라우팅:         [ 경로 탐색 중 -> FAUST_SEOUL ]",
    ["오디오 엔진:         [ 138.00 BPM으로 고정됨 ]", "success"],
    ["음향 어레이:         [ 정상 가동 (NOMINAL) ]", "success"],
    ...(isAdmin
      ? [
          [
            "관리자 세션:         [ 오버라이드 활성화 ]",
            "success",
          ] as ContentItem,
        ]
      : []),
    "",
  ],
  en: [
    ["HARDWARE DIAGNOSTICS", "header"],
    ["Core Logic:      [ONLINE / STABLE]", "success"],
    "Routing:         [CALCULATING -> FAUST_SEOUL]",
    ["Audio Engine:    [LOCKED ON 138.00 BPM]", "success"],
    ["Acoustic Array:  [NOMINAL]", "success"],
    ...(isAdmin
      ? [["Admin Session:   [OVERRIDE ACTIVE]", "success"] as ContentItem]
      : []),
    "",
  ],
});
