import { I18nContentItem, ContentItem, LineType } from "../types";

export const liveHeader = (sessionName: string): I18nContentItem => ({
  ko: [
    ["══════════════════════════════", "system"],
    [`  TERMINAL LIVE — ${sessionName}`, "header"],
    ["  이벤트 실시간 채널이 열렸습니다.", "success"],
    ["  '/leave' 로 세션을 종료합니다.", "system"],
    ["══════════════════════════════", "system"],
    "",
  ],
  en: [
    ["══════════════════════════════", "system"],
    [`  TERMINAL LIVE — ${sessionName}`, "header"],
    ["  Live event channel is now open.", "success"],
    ["  Type '/leave' to end the session.", "system"],
    ["══════════════════════════════", "system"],
    "",
  ],
});

export const liveOffline = (
  upcoming: Array<{
    name: string;
    starts_at: string;
    ends_at: string | null;
  }>,
): I18nContentItem => {
  const fmtKst = (iso: string) => {
    const f = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date(iso));
    const g = (t: string) => f.find((p) => p.type === t)?.value ?? "00";
    return `${g("month")}-${g("day")} ${g("hour")}:${g("minute")} KST`;
  };
  const fmtRow = (s: (typeof upcoming)[0]) => {
    const start = fmtKst(s.starts_at);
    const end = s.ends_at ? ` ~ ${fmtKst(s.ends_at)}` : "";
    return `  ${start}${end}  ${s.name}` as ContentItem;
  };
  const upcomingKo: ContentItem[] =
    upcoming.length > 0
      ? [["[ 예정 세션 ]", "system" as LineType], ...upcoming.map(fmtRow)]
      : [];
  const upcomingEn: ContentItem[] =
    upcoming.length > 0
      ? [
          ["[ UPCOMING SESSIONS ]", "system" as LineType],
          ...upcoming.map(fmtRow),
        ]
      : [];
  return {
    ko: [
      ["[ CHANNEL OFFLINE ]", "header"],
      "현재 활성화된 라이브 세션이 없습니다.",
      ...upcomingKo,
      "",
    ],
    en: [
      ["[ CHANNEL OFFLINE ]", "header"],
      "No active live session at this time.",
      ...upcomingEn,
      "",
    ],
  };
};

export const liveNoName = (nodeId: string): I18nContentItem => ({
  ko: [
    ["[ 이름 미설정 ]", "header"],
    "라이브 채널 참가 방법을 선택하세요.",
    ["", "divider"],
    [`  live --node   →  ${nodeId} 로 바로 접속`, "system"],
    ["  name <이름>   →  이름 설정 후 live 재접속", "system"],
    "",
  ],
  en: [
    ["[ NAME NOT CONFIGURED ]", "header"],
    "Choose how to join the live channel.",
    ["", "divider"],
    [`  live --node   →  Enter as ${nodeId}`, "system"],
    ["  name <name>   →  Set a name, then rejoin with live", "system"],
    "",
  ],
});

export const liveExit: I18nContentItem = {
  ko: [["", "divider"], ["[ LIVE CHANNEL DISCONNECTED ]", "system"], ""],
  en: [["", "divider"], ["[ LIVE CHANNEL DISCONNECTED ]", "system"], ""],
};

export const liveTooFast: I18nContentItem = {
  ko: [["[ SYS ] 너무 빠릅니다. 잠시 후 다시 시도하세요.", "system"], ""],
  en: [["[ SYS ] Too fast. Please wait a moment.", "system"], ""],
};

export const liveError: I18nContentItem = {
  ko: [["[ ERROR ] 메시지 전송에 실패했습니다.", "error"], ""],
  en: [["[ ERROR ] Failed to send message.", "error"], ""],
};
