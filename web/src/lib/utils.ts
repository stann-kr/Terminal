import { TerminalLine, LanguageType, I18nContentItem, LineType } from "./types";

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
