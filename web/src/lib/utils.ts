import { TerminalLine, LanguageType, I18nContentItem, LineType, BootLine } from "./types";

export const uid = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const stripBrackets = (str: string): string => str.replace(/^<|>$/g, "");

export const hasBrackets = (str: string): boolean => /[<>]/.test(str);

export const bracketNotice = (lang: LanguageType): TerminalLine =>
  line(
    lang === "ko"
      ? "[ SYS ] 꺾쇠 기호(<>)가 감지되어 자동으로 제거 후 처리되었습니다."
      : "[ SYS ] Angle brackets detected and stripped automatically.",
    "system",
  );

export const line = (
  text: string,
  type: LineType = "output",
  url?: string,
): TerminalLine => ({
  id: uid(),
  text,
  type,
  url,
});

export const parseContent = (
  items: I18nContentItem,
  lang: LanguageType,
): TerminalLine[] => {
  return items[lang].map((item) => {
    if (typeof item === "string") return line(item, "output");
    return line(item[0], item[1] as LineType, item[2]);
  });
};

export const kstParts = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    ...opts,
  }).formatToParts(d);

export const getPart = (parts: Intl.DateTimeFormatPart[], type: string) =>
  parts.find((p) => p.type === type)?.value ?? "00";

export const fmtKstHm = (d: Date) => {
  const p = kstParts(d, { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${getPart(p, "hour")}:${getPart(p, "minute")}`;
};

export const fmtKstFull = (d: Date) => {
  const p = kstParts(d, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${getPart(p, "year")}-${getPart(p, "month")}-${getPart(p, "day")} ${getPart(p, "hour")}:${getPart(p, "minute")}`;
};

export const getTimestamp = (lang: LanguageType) =>
  new Date().toLocaleString(lang === "ko" ? "ko-KR" : "en-CA", {
    timeZone: "Asia/Seoul",
    hour12: false,
  });

export const levenshteinDistance = (a: string, b: string): number => {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
};

/**
 * DB에서 로딩한 BootLine 객체 배열({text, type})을 BootLine[] 타입으로 변환.
 * content_ko/en 필드가 jsonb [{text, type}] 형식으로 저장되어 있으므로 타입 단언으로 처리.
 */
export const contentToBootLine = (items: unknown[]): BootLine[] =>
  items.map((item) => {
    if (typeof item === "object" && item !== null && "text" in item && "type" in item) {
      return { text: String((item as Record<string, unknown>).text), type: (item as Record<string, unknown>).type as LineType };
    }
    return { text: String(item), type: "output" as LineType };
  });

export const findSimilarCommand = (
  input: string,
  commandList: string[],
): string | null => {
  let best: string | null = null;
  let bestDist = Infinity;
  for (const cmd of commandList) {
    const dist = levenshteinDistance(input, cmd);
    if (dist <= 2 && dist < bestDist) {
      bestDist = dist;
      best = cmd;
    }
  }
  return best;
};
