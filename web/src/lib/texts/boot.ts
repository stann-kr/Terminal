import { I18nContentItem, I18nBootLine } from "../types";

export const bootSequence: I18nBootLine = {
  ko: [
    { text: "TERMINAL CORE — 시스템 초기 부팅 시작", type: "system" },
    { text: "...", type: "system" },
    { text: "[ OK ] 커널 코어 모듈 로딩...", type: "output" },
    { text: "[ OK ] 로컬 스토리지 마운트 중...", type: "output" },
    { text: "[ OK ] 네트워크 라우팅 매트릭스 초기화...", type: "output" },
    { text: "[ OK ] 오디오 주파수 대역 보정 중...", type: "output" },
    { text: "[ -- ] 세션 매니페스트 스캔...", type: "system" },
    {
      text: "[ OK ] 데이터 로드 완료: 3명의 메인 노드 확인됨.",
      type: "output",
    },
    { text: "[ -- ] 동기화 게이트 좌표 확인...", type: "system" },
    {
      text: "[ OK ] 게이트: Faust, Seoul / 26-03-07 23:00 KST",
      type: "output",
    },
    { text: "...", type: "system" },
    { text: "", type: "divider" },
    { text: "시스템 상태: 정상 가동 (OPERATIONAL)", type: "success" },
    {
      text: "모든 준비가 완료되었습니다. 터미널 제어권을 이양합니다.",
      type: "success",
    },
    { text: "", type: "divider" },
  ],
  en: [
    { text: "TERMINAL CORE — SYSTEM BOOT INITIATED", type: "system" },
    { text: "...", type: "system" },
    { text: "[ OK ] Loading kernel modules...", type: "output" },
    { text: "[ OK ] Mounting local storage...", type: "output" },
    { text: "[ OK ] Initializing network routing matrix...", type: "output" },
    { text: "[ OK ] Calibrating frequency bands...", type: "output" },
    { text: "[ -- ] Scanning session manifest...", type: "system" },
    {
      text: "[ OK ] Nodes loaded: 3 personnel confirmed.",
      type: "output",
    },
    { text: "[ -- ] Verifying gate coordinates...", type: "system" },
    {
      text: "[ OK ] Gate: Faust, Seoul / 26-03-07 23:00 KST",
      type: "output",
    },
    { text: "...", type: "system" },
    { text: "", type: "divider" },
    { text: "STATUS: OPERATIONAL", type: "success" },
    {
      text: "All systems ready. Transferring terminal control.",
      type: "success",
    },
    { text: "", type: "divider" },
  ],
};

export const wakeSequence: I18nBootLine = {
  ko: [
    { text: "[ -- ] 슬립 모드 해제 중...", type: "system" },
    { text: "[ OK ] 세션 상태 복원됨.", type: "output" },
    {
      text: "[ OK ] 게이트: Faust, Seoul / 26-03-07 23:00 KST",
      type: "output",
    },
    { text: "[ OK ] 시스템 재개.", type: "success" },
    { text: "", type: "divider" },
  ],
  en: [
    { text: "[ -- ] Waking from sleep...", type: "system" },
    { text: "[ OK ] Session state restored.", type: "output" },
    {
      text: "[ OK ] Gate: Faust, Seoul / 26-03-07 23:00 KST",
      type: "output",
    },
    { text: "[ OK ] System resumed.", type: "success" },
    { text: "", type: "divider" },
  ],
};

export const welcomeMessage: I18nContentItem = {
  ko: [
    ["TERMINAL CORE SYSTEM — 터미널 접근이 허가되었습니다", "success"],
    ["'event'로 파티 정보, 'lineup'으로 라인업 조회. 'help'를 입력하면 전체 목록을 확인할 수 있습니다.", "system"],
    ["", "divider"],
  ],
  en: [
    ["TERMINAL CORE SYSTEM — ACCESS GRANTED", "success"],
    ["Type 'event' for party info, 'lineup' for artists. Type 'help' to see all commands.", "system"],
    ["", "divider"],
  ],
};

export const resumeMessage: I18nContentItem = {
  ko: [
    ["TERMINAL CORE SYSTEM — 세션이 재개되었습니다", "success"],
    ["'help' 를 입력하면 사용 가능한 커맨드를 확인할 수 있습니다.", "system"],
    ["", "divider"],
  ],
  en: [
    ["TERMINAL CORE SYSTEM — SESSION RESUMED", "success"],
    ["Type 'help' to see available commands.", "system"],
    ["", "divider"],
  ],
};
