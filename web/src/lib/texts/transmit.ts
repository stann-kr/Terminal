import { ContentItem, TransmitTexts } from "../types";

export const transmit: TransmitTexts = {
  ko: {
    usage: [
      ["시스템 통신망(TRANSMISSION) 사용법", "header"],
      "조회: transmit",
      "전송: transmit <name> <message>",
      "",
    ],
    usagePrompt: [
      "",
      ["[안내] 통신 전송: transmit <name> <message>", "system"],
    ],
    empty: [["수신된 통신 기록이 없습니다. 첫 신호를 전송하십시오.", "system"]],
    loading: [["통신망 데이터를 로드 중...", "progress"]],
    saving: [["메시지를 시스템 통신망으로 전송 중...", "progress"]],
    success: [["통신 신호가 전송 확인.", "success"]],
    invalidMsg: [
      ["[ ERROR ] 전송할 메시지가 없습니다. 메시지를 입력해 주세요.", "error"],
    ],
    error: [["[ ERROR ] 전송 실패.", "error"]],
    header: (page: number): ContentItem[] => [
      ["TRANSMISSION RECEPTION LOG", "header"],
      [
        page === 1
          ? "[ 최근 10건 표시 ]"
          : `[ ${(page - 1) * 10 + 1}~${page * 10}번째 메시지 ]`,
        "system",
      ],
      "",
    ],
  },
  en: {
    usage: [
      ["TRANSMISSION NETWORK USAGE", "header"],
      "View: transmit",
      "Transmit: transmit <name> <message>",
      "",
    ],
    usagePrompt: ["", ["[HINT] Transmit: transmit <name> <message>", "system"]],
    empty: [
      ["No transmission logs received. Transmit a signal now.", "system"],
    ],
    loading: [["Loading transmission data...", "progress"]],
    saving: [["Transmitting...", "progress"]],
    success: [["Transmission confirmed.", "success"]],
    invalidMsg: [
      [
        "[ ERROR ] No message provided. Please enter a message to transmit.",
        "error",
      ],
    ],
    error: [["[ ERROR ] Transmission failed.", "error"]],
    header: (page: number): ContentItem[] => [
      ["TRANSMISSION RECEPTION LOG", "header"],
      [
        page === 1
          ? "[ SHOWING LAST 10 ENTRIES ]"
          : `[ ENTRIES ${(page - 1) * 10 + 1}–${page * 10} ]`,
        "system",
      ],
      "",
    ],
  },
};
