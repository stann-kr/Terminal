import { I18nContentItem, LineType } from "../types";

export const adminDenied: I18nContentItem = {
  ko: [
    ["[ 보안 프로토콜 — 접근 거부 ]", "header"],
    ["경고: 인가되지 않은 접근 시도가 감지되었습니다.", "error"],
    "이 구역은 LEVEL 5 인가 노드 전용입니다.",
    ["해당 행동이 시스템 로그에 기록되었습니다.", "system"],
    "",
  ],
  en: [
    ["[ SECURITY PROTOCOL — ACCESS DENIED ]", "header"],
    ["WARNING: Unauthorized access attempt detected.", "error"],
    "This sector is restricted to LEVEL 5 authorized nodes only.",
    ["Action has been logged to the system.", "system"],
    "",
  ],
};

export const adminHelp: I18nContentItem = {
  ko: [
    ["[ ADMIN ] 관리자 커맨드 인덱스", "header"],
    ["admin login <password>              — 관리자 세션 로그인", "success"],
    ["admin logout                        — 관리자 세션 로그아웃", "system"],
    ["admin live open <이름>              — 즉시 개방 세션 생성", "success"],
    "admin live add <이름> <시작> <종료>  — 예약 세션 등록 (시간: 26-03-07T22:00)",
    "admin live close                    — 현재 활성 세션 종료",
    "admin live close <이름>             — 특정 세션 즉시 종료",
    "admin live delete <이름>            — 예약 세션 삭제",
    "admin live status                   — 세션 목록 및 상태",
    "admin live clear                    — 활성 세션 메시지 삭제",
    "admin ann <메시지>                  — 전체 공지 브로드캐스트",
    "admin ann clear                     — 공지 해제",
    "admin event list                    — 전체 이벤트 목록",
    "admin event activate <slug>         — 특정 이벤트 활성화",
    "admin event clone <old> <new> [명]  — 이벤트 및 텍스트 복제",
    "admin text list [all]               — 텍스트 목록 (all: 전체)",
    "admin text preview <cat> [sub]      — 텍스트 미리보기",
    "admin cache reload                  — 내부 DB 캐시 갱신",
    "",
  ],
  en: [
    ["[ ADMIN ] ADMIN COMMAND INDEX", "header"],
    ["admin login <password>              — Admin session login", "success"],
    ["admin logout                       — Admin session logout", "system"],
    [
      "admin live open <name>              — Create immediate session",
      "success",
    ],
    "admin live add <name> <start> <end>  — Schedule session (26-03-07T22:00)",
    "admin live close                     — Close current active session",
    "admin live close <name>              — Close specific session",
    "admin live delete <name>             — Delete scheduled session",
    "admin live status                    — List sessions & status",
    "admin live clear                     — Clear active session messages",
    "admin ann <message>                  — Broadcast announcement",
    "admin ann clear                      — Clear announcement",
    "admin event list                     — List all events",
    "admin event activate <slug>          — Activate specific event",
    "admin event clone <old> <new> [명]   — Clone event and texts",
    "admin text list [all]                — List texts (all: include static)",
    "admin text preview <cat> [sub]       — Preview text content",
    "admin cache reload                   — Reload internal DB cache",
    "",
  ],
};

export const adminLiveOpened: I18nContentItem = {
  ko: [["[ ADMIN ] 즉시 개방 세션을 생성했습니다.", "success"], ""],
  en: [["[ ADMIN ] Immediate session created.", "success"], ""],
};

export const adminLiveScheduled: I18nContentItem = {
  ko: [["[ ADMIN ] 예약 세션이 등록되었습니다.", "success"], ""],
  en: [["[ ADMIN ] Scheduled session registered.", "success"], ""],
};

export const adminLiveClosed: I18nContentItem = {
  ko: [["[ ADMIN ] 세션을 종료했습니다.", "system"], ""],
  en: [["[ ADMIN ] Session closed.", "system"], ""],
};

export const adminLiveNotFound: I18nContentItem = {
  ko: [["[ ADMIN ] 해당 이름의 세션을 찾을 수 없습니다.", "error"], ""],
  en: [["[ ADMIN ] No session found with that name.", "error"], ""],
};

export const adminLiveDeleted: I18nContentItem = {
  ko: [["[ ADMIN ] 세션이 삭제되었습니다.", "system"], ""],
  en: [["[ ADMIN ] Session deleted.", "system"], ""],
};

export const adminLiveCleared: I18nContentItem = {
  ko: [["[ ADMIN ] 세션 메시지가 삭제되었습니다.", "success"], ""],
  en: [["[ ADMIN ] Session messages cleared.", "success"], ""],
};

export const adminSessionStatus = (
  sessions: Array<{
    id: string;
    name: string;
    is_force_open: boolean;
    starts_at: string;
    ends_at: string | null;
    closed_at: string | null;
  }>,
): I18nContentItem => {
  const now = new Date();
  const fmtKst = (iso: string | null) => {
    if (!iso) return "—";
    const f = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date(iso));
    const g = (t: string) => f.find((p) => p.type === t)?.value ?? "00";
    return `${g("month")}-${g("day")} ${g("hour")}:${g("minute")}`;
  };
  const getStatus = (s: (typeof sessions)[0]) => {
    if (s.closed_at) return "CLOSED";
    if (s.is_force_open) return "ACTIVE";
    if (new Date(s.starts_at) > now) return "UPCOMING";
    if (!s.ends_at || new Date(s.ends_at) > now) return "ACTIVE";
    return "ENDED";
  };
  const rows = sessions.map((s) => {
    const status = getStatus(s);
    const type = s.is_force_open ? "FORCE" : "SCHED";
    const start = fmtKst(s.starts_at);
    const end = fmtKst(s.ends_at);
    return [
      `  ${status.padEnd(8)} ${type}  ${s.name.padEnd(16)} ${start} ~ ${end}`,
      status === "ACTIVE" ? "success" : "system",
    ] as [string, LineType];
  });
  return {
    ko: [["[ ADMIN ] 세션 목록", "header"], ...rows, ""],
    en: [["[ ADMIN ] SESSION LIST", "header"], ...rows, ""],
  };
};

export const adminError: I18nContentItem = {
  ko: [["[ ADMIN ] 오류가 발생했습니다.", "error"], ""],
  en: [["[ ADMIN ] An error occurred.", "error"], ""],
};

export const adminLoginSuccess: I18nContentItem = {
  ko: [["[ ADMIN ] 인증 성공. 세션이 활성화되었습니다.", "success"], ""],
  en: [["[ ADMIN ] Login successful. Session activated.", "success"], ""],
};

export const adminLoginFail: I18nContentItem = {
  ko: [["[ ADMIN ] 인증 실패. 자격 증명을 확인하세요.", "error"], ""],
  en: [["[ ADMIN ] Login failed. Check your credentials.", "error"], ""],
};

export const adminLogoutSuccess: I18nContentItem = {
  ko: [["[ ADMIN ] 로그아웃 완료. 세션이 종료되었습니다.", "system"], ""],
  en: [["[ ADMIN ] Logout successful. Session terminated.", "system"], ""],
};

export const adminAnnSent: I18nContentItem = {
  ko: [["[ OK ] 공지가 전송되었습니다.", "success"], ""],
  en: [["[ OK ] Announcement broadcast.", "success"], ""],
};

export const adminAnnCleared: I18nContentItem = {
  ko: [["[ OK ] 공지가 해제되었습니다.", "success"], ""],
  en: [["[ OK ] Announcement cleared.", "success"], ""],
};

export const announcementBanner = (msg: string): I18nContentItem => ({
  ko: [
    ["[ 공지사항 ]  " + msg, "error"],
    ["", "divider"],
  ],
  en: [
    ["[ NOTICE ]  " + msg, "error"],
    ["", "divider"],
  ],
});

export const adminEventList = (
  events: Array<{
    id: string;
    slug: string;
    title: string;
    status: string;
    date: string;
  }>,
): I18nContentItem => {
  const rows = events.map((e) => {
    return [
      `  ${e.status.toUpperCase().padEnd(10)} ${e.slug.padEnd(15)} ${e.title} (${e.date})`,
      e.status === "active" ? "success" : "output",
    ] as [string, LineType];
  });
  return {
    ko: [["[ ADMIN ] 이벤트 목록", "header"], ...rows, ""],
    en: [["[ ADMIN ] EVENT LIST", "header"], ...rows, ""],
  };
};

export const adminEventActivated: I18nContentItem = {
  ko: [
    [
      "[ OK ] 이벤트가 활성화되었습니다. (적용하려면 cache reload 필요할 수 있음)",
      "success",
    ],
    "",
  ],
  en: [
    ["[ OK ] Event activated. (May require cache reload to apply)", "success"],
    "",
  ],
};

export const adminEventCloned: I18nContentItem = {
  ko: [["[ OK ] 이벤트 및 텍스트 복제가 완료되었습니다.", "success"], ""],
  en: [["[ OK ] Event and texts cloned.", "success"], ""],
};

export const adminTextList = (
  texts: Array<{
    category: string;
    description: string | null;
    sub_key: string | null;
  }>,
): I18nContentItem => {
  const rows = texts.map((t) => {
    const key = t.sub_key ? `${t.category} [${t.sub_key}]` : t.category;
    return [`  ${key.padEnd(20)} ${t.description || ""}`, "output"] as [
      string,
      LineType,
    ];
  });
  return {
    ko: [["[ ADMIN ] 텍스트 카테고리 목록", "header"], ...rows, ""],
    en: [["[ ADMIN ] TEXT CATEGORIES", "header"], ...rows, ""],
  };
};

export const adminCacheReloaded: I18nContentItem = {
  ko: [
    ["[ OK ] 로컬 DB 캐시를 갱신했습니다.", "success"],
    "⚠️ (주의) 현재 접속한 관리자의 터미널에만 즉시 반영되며, 방문자들은 재부팅/새로고침해야 변경사항이 나타납니다.",
    "",
  ],
  en: [
    ["[ OK ] Local DB cache reloaded.", "success"],
    "⚠️ (Note) Changes are reflected immediately only on this admin terminal. Visitors must reload/reboot to see updates.",
    "",
  ],
};
