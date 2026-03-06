import { I18nContentItem } from "../types";

export const help: I18nContentItem = {
  ko: [
    ["터미널 코어 인덱스", "header"],
    "about    — 시스템 개요 및 운영 목적",
    "lineup   — 참가 객체(아티스트) 라인업 조회",
    "gate     — 접속 게이트 좌표 및 일정 (일시/장소)",
    "whois    — 시스템 아카이브 검색 (예: whois stann)",
    "transmit  — 시스템 통신망(방명록) 조회 및 전송",
    "live     — 이벤트 실시간 채팅 채널 접속",
    "link     — 외부 데이터 네트워크 연결",
    "status   — 현재 세션 가동 로그",
    "settings — 시스템 언어 및 로컬 환경 설정",
    "",
    ["전체 명령어 목록을 보려면 'commands'를 입력하세요.", "system"],
    "",
  ],
  en: [
    ["TERMINAL CORE INDEX", "header"],
    "about    — Project overview and purpose",
    "lineup   — Artist lineup inquiry",
    "gate     — Date & Venue",
    "whois    — System archive search (ex. whois stann)",
    "transmit  — View and transmit messages",
    "live     — Live event channel",
    "link     — External directories",
    "status   — System operation logs",
    "settings — Language & environment settings",
    "",
    ["Type 'commands' to see all available system commands.", "system"],
    "",
  ],
};

export const commands: I18nContentItem = {
  ko: [
    ["전체 시스템 명령어 매니페스트", "header"],
    ["[ 시스템 코어 ]", "system"],
    "about, help, commands, status, settings, systems, voyage, clear",
    ["[ 데이터 아카이브 ]", "system"],
    "lineup, gate, event, link, whoami, whois, transmit, live, name",
    ["[ 유틸리티 & 보안 ]", "system"],
    "date, time, echo, history, sudo",
    ["[ 시스템 진단 ]", "system"],
    "ping, scan, weather, matrix",
    "",
  ],
  en: [
    ["ALL SYSTEM COMMAND MANIFEST", "header"],
    ["[ SYSTEM CORE ]", "system"],
    "about, help, commands, status, settings, systems, voyage, clear",
    ["[ DATA ARCHIVE ]", "system"],
    "lineup, gate, event, link, whoami, whois, transmit, live, name",
    ["[ UTILITIES & SECURITY ]", "system"],
    "date, time, echo, history, sudo",
    ["[ DIAGNOSTICS ]", "system"],
    "ping, scan, weather, matrix",
    "",
  ],
};

export const about: I18nContentItem = {
  ko: [
    ["TERMINAL — PLATFORM OVERVIEW", "header"],
    "TERMINAL은 오디오 신호와 데이터가 교차하는 무기질적인 정거장을 설계하는",
    "서울 기반의 테크노 플랫폼입니다.",
    " ",
    "[ DESIGN PRINCIPLE ]",
    "불필요한 시각적 장식을 덜어내고, 정교하게 통제된 환경을 구축하는 데 집중합니다.",
    "오직 텍스트와 필수적인 빛으로만 공간을 렌더링하는",
    "CLI(Command Line Interface) 시스템처럼, 가장 본질적이고 미니멀한 형태를 지향합니다.",
    " ",
    "[ AUDIO ENGINE ]",
    "초기 미래주의(Early Futurism)의 원초적 질감을 담은",
    "최면적이고 미래지향적인(Hypnotic & Futuristic) 테크노.",
    " ",
    "[ OBJECTIVE ]",
    "TERMINAL은 단순한 관람객을 위한 무대를 구축하지 않습니다.",
    "이곳에 접속한 모든 객체가 개별 노드(Node)로서 시스템 연산에 참여하고,",
    "미지의 궤도를 함께 탐색하는 완전한 동기화를 목표로 합니다.",
    " ",
    "터미널 아키텍트 : STANN LUMO",
    "",
  ],
  en: [
    ["TERMINAL — PLATFORM OVERVIEW", "header"],
    "TERMINAL is a Seoul-based techno platform designing an industrial station",
    "where audio signals and data intersect.",
    " ",
    "[ DESIGN PRINCIPLE ]",
    "Stripping away non-essential visual elements, we focus on constructing",
    "a precisely controlled environment. Much like a CLI (Command Line Interface)",
    "rendered only by essential light and text, we aim for the pure, minimal",
    "essence of the space.",
    " ",
    "[ AUDIO ENGINE ]",
    "Hypnotic and futuristic techno, heavily influenced by the raw textures",
    "of early futurism.",
    " ",
    "[ OBJECTIVE ]",
    "TERMINAL does not build stages for mere spectators. Our objective is total",
    "synchronization — where every logged-in entity becomes an active node,",
    "participating in the system's calculation to explore uncharted",
    "trajectories together.",
    " ",
    "TERMINAL ARCHITECT : STANN LUMO",
    "",
  ],
};

export const lineup: I18nContentItem = {
  ko: [
    ["AUDIO CONTROLLERS [01]", "header"],
    ["[01]  STANN LUMO", "success"],
    ["[02]  MARCUS L", "success"],
    ["[03]  NUSNOOM", "success"],
    ["────────────────────", "system"],
    "Format: Hypnotic, Futuristic Techno",
    "",
  ],
  en: [
    ["AUDIO CONTROLLERS [01]", "header"],
    ["[01]  STANN LUMO", "success"],
    ["[02]  MARCUS L", "success"],
    ["[03]  NUSNOOM", "success"],
    ["────────────────────", "system"],
    "Format: Hypnotic, Futuristic Techno",
    "",
  ],
};

export const voyage: I18nContentItem = {
  ko: [
    ["VOYAGE LOG — TERMINAL", "header"],
    "TERMINAL의 항해는 계속된다.",
    " ",
    "각 시퀀스는 새로운 좌표를 설정한다.",
    "우리는 접속된 모든 노드와 함께 미지의 궤도를 탐색하며,",
    "매 이터레이션마다 시스템을 확장하고 새로운 섹터를 개척한다.",
    " ",
    "오디오 신호는 정거장을 이동하고, 데이터는 교차하며,",
    "플랫폼은 멈추지 않는다.",
    " ",
    ["이것이 TERMINAL의 영구적인 디렉티브다.", "system"],
    [
      "경고: 장시간 연속되는 루프(Hypnotic Loop)는 인지 감각을 왜곡할 수 있습니다.",
      "error",
    ],
    "",
  ],
  en: [
    ["VOYAGE LOG — TERMINAL", "header"],
    "The voyage of TERMINAL continues.",
    " ",
    "Each sequence sets new coordinates.",
    "We navigate uncharted trajectories with every connected node,",
    "expanding the system and pioneering new sectors with each iteration.",
    " ",
    "Audio signals traverse stations, data intersects,",
    "and the platform never stops.",
    " ",
    ["This is the permanent directive of TERMINAL.", "system"],
    [
      "Warning: Prolonged continuous loops (Hypnotic Loops) may distort cognitive senses.",
      "error",
    ],
    "",
  ],
};

export const gate: I18nContentItem = {
  ko: [
    ["접속 게이트 좌표 [01]", "header"],
    ["TERMINAL [01] : BOOT SEQUENCE", "system"],
    ["", "divider"],
    "일  시 : 26-03-07 (토) 23:00 KST",
    "장  소 : Faust, Seoul",
    ["", "divider"],
    "* 시스템 동기화 및 메인 오디오 세션에 접속하십시오.",
    "",
  ],
  en: [
    ["TARGET COORDINATES [01]", "header"],
    ["TERMINAL [01] : BOOT SEQUENCE", "system"],
    ["", "divider"],
    "DATE  : 26-03-07 (SAT) 23:00 KST",
    "VENUE : Faust, Seoul",
    ["", "divider"],
    "* Synchronize system and connect to the main audio session.",
    "",
  ],
};

export const event: I18nContentItem = {
  ko: [
    ["TERMINAL [01] : BOOT SEQUENCE", "header"],
    ["Maiden Voyage to the Unknown Sector.", "system"],
    ["", "divider"],
    "[ LINEUP ]",
    ["  STANN LUMO", "success"],
    ["  MARCUS L", "success"],
    ["  NUSNOOM", "success"],
    " ",
    "[ INFO ]",
    "  DATE  : 26-03-07 (토) 23:00 KST",
    "  VENUE : Faust, Seoul",
    " ",
    "[ ENGINE ]",
    ["  Hypnotic & Futuristic Techno", "success"],
    ["", "divider"],
    ["* 시스템 동기화 준비를 완료하십시오.", "system"],
    "",
  ],
  en: [
    ["TERMINAL [01] : BOOT SEQUENCE", "header"],
    ["Maiden Voyage to the Unknown Sector.", "system"],
    ["", "divider"],
    "[ LINEUP ]",
    ["  STANN LUMO", "success"],
    ["  MARCUS L", "success"],
    ["  NUSNOOM", "success"],
    " ",
    "[ INFO ]",
    "  DATE  : 26-03-07 (SAT) 23:00 KST",
    "  VENUE : Faust, Seoul",
    " ",
    "[ ENGINE ]",
    ["  Hypnotic & Futuristic Techno", "success"],
    ["", "divider"],
    ["* Complete system synchronization and prepare for departure.", "system"],
    "",
  ],
};

export const link: I18nContentItem = {
  ko: [
    ["외부 네트워크 경로", "header"],
    [
      "* STANN LUMO 접근 (Instagram)",
      "link",
      "https://www.instagram.com/stannlumo/",
    ],
    [
      "* TERMINAL HUB (Instagram)",
      "link",
      "https://www.instagram.com/terminal_hub/",
    ],
    "",
  ],
  en: [
    ["EXTERNAL LINKS", "header"],
    ["* Stann Lumo Archive", "link", "https://www.instagram.com/stannlumo/"],
    ["* Terminal Network", "link", "https://www.instagram.com/terminal_hub/"],
    "",
  ],
};

export const ping: I18nContentItem = {
  ko: [
    ["[ PING ] 메인 오디오 서버 응답 대기 중...", "progress"],
    "응답 시간: 14ms",
    ["모든 패킷 스트림 정상 수신 확인 완료.", "success"],
    "",
  ],
  en: [
    ["[ PING ] Waiting for main audio server response...", "progress"],
    "Response time: 14ms",
    ["All packet streams received correctly.", "success"],
    "",
  ],
};

export const weather: I18nContentItem = {
  ko: [
    ["[ 환경 데이터 스캔 중... ]", "progress"],
    ["경고: 미확인 오디오 신호가 감지되었습니다.", "error"],
    "시스템 출력이 불안정해질 수 있습니다.",
    "안전한 수준으로 볼륨 조절하고 시스템 청각 보호 모드를 발동하십시오.",
    "",
  ],
  en: [
    ["[ SCANNING ENVIRONMENT... ]", "progress"],
    ["WARNING: Unidentified audio signal detected.", "error"],
    "System output may become unstable.",
    "Adjust volume to a safe level and activate auditory protection.",
    "",
  ],
};

export const matrix: I18nContentItem = {
  ko: [
    "파란 약을 먹으면 여기서 끝난다. 침대에서 깨어나 네가 믿고 싶은 걸 믿게 되겠지.",
    "빨간 약을 먹으면 원더랜드에 남아 토끼굴이 얼마나 깊은지 보여주겠다.",
    ["선택은 너의 몫이다.", "system"],
    "",
  ],
  en: [
    "You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe.",
    "You take the red pill - you stay in Wonderland and I show you how deep the rabbit-hole goes.",
    ["The choice is yours.", "system"],
    "",
  ],
};

export const history: I18nContentItem = {
  ko: [
    ["[ ERROR ] 접근 권한이 부족합니다.", "header"],
    [
      "보안 수준 LEVEL 2 이상의 인가된 마스터 노드만 열람할 수 있습니다.",
      "error",
    ],
    "",
  ],
  en: [
    ["[ ERROR ] INSUFFICIENT CLEARANCE.", "header"],
    [
      "Only authorized master nodes with security LEVEL 2 or higher may access.",
      "error",
    ],
    "",
  ],
};

export const historyAdmin: I18nContentItem = {
  ko: [
    ["[ 시스템 로그 — 관리자 접근 허용됨 ]", "header"],
    ["ADMIN CLEARANCE: 세션 기록 열람 권한이 확인되었습니다.", "success"],
    ["보안 수준 LEVEL 5 — 접근 허가.", "success"],
    [
      "세션 기록은 클라이언트 메모리에만 저장됩니다. 브라우저를 닫으면 소멸합니다.",
      "system",
    ],
    "",
  ],
  en: [
    ["[ SYSTEM LOG — ADMIN ACCESS GRANTED ]", "header"],
    ["ADMIN CLEARANCE: Session log access confirmed.", "success"],
    ["SECURITY LEVEL 5 — ACCESS PERMITTED.", "success"],
    [
      "Session history is stored in client memory only. Cleared on browser close.",
      "system",
    ],
    "",
  ],
};
