import type { I18nContentItem, I18nBootLine, BootLine, ContentItem, LanguageType, LineType } from "../types";

/** events 테이블 행 타입 */
export interface ActiveEvent {
  id: string;
  slug: string;
  title: string;
  date: string;
  venue: string;
  status: string;
  metadata: Record<string, string>; // bpm, genre, subtitle 등 유연한 키-값
}

/** terminal_lines 테이블 행 타입 */
interface LineRow {
  event_id: string | null;
  category: string;
  sub_key: string | null;
  lang: LanguageType;
  line_text: string;
  line_type: string;
  url: string | null;
  sort_order: number;
}

/** 캐시 키: `category` 또는 `category:sub_key` */
type CacheKey = string;

/** 싱글턴 텍스트 서비스 — 앱 초기화 시 1회 일괄 로딩 후 메모리 캐시 */
class TextService {
  private cache = new Map<CacheKey, I18nContentItem>();
  private activeEvent: ActiveEvent | null = null;
  private loaded = false;

  /**
   * 앱 초기화 시 1회 호출.
   * events(status='active') 조회 → terminal_lines 일괄 로딩 → 메모리 캐시.
   * Supabase 쿼리 2회만 사용.
   */
  async initialize(): Promise<void> {
    // SSR 환경에서는 실행하지 않음 (클라이언트 전용)
    if (typeof window === "undefined") return;

    try {
      // Supabase 클라이언트를 동적으로 로드 (모듈 최상위 import 방지 → SSR 안전)
      const { supabase } = await import("../supabase");

      // 1. 활성 이벤트 조회 (status = 'active')
      const { data: eventRow } = await supabase
        .from("events")
        .select("id, slug, title, date, venue, status, metadata")
        .eq("status", "active")
        .maybeSingle();

      this.activeEvent = eventRow ?? null;
      const activeEventId = this.activeEvent?.id ?? null;

      // 2. terminal_lines 일괄 조회 — 정적(event_id IS NULL) + 활성 이벤트 종속
      const query = supabase
        .from("terminal_lines")
        .select("event_id, category, sub_key, lang, line_text, line_type, url, sort_order")
        .order("sort_order", { ascending: true });

      if (activeEventId) {
        query.or(`event_id.is.null,event_id.eq.${activeEventId}`);
      } else {
        query.is("event_id", null);
      }

      const { data: rows, error } = await query;
      if (error) throw error;

      // 3. 행을 (category, sub_key) 기준으로 그룹핑 → I18nContentItem 조립
      for (const row of (rows ?? []) as LineRow[]) {
        const cacheKey: CacheKey = row.sub_key
          ? `${row.category}:${row.sub_key}`
          : row.category;

        if (!this.cache.has(cacheKey)) {
          this.cache.set(cacheKey, { ko: [], en: [] });
        }

        const entry = this.cache.get(cacheKey)!;
        const lang = row.lang as LanguageType;

        // ContentItem 조립: link 타입이면 url 포함 3-튜플, 나머지는 [text, type] 2-튜플
        let item: ContentItem;
        if (row.url) {
          item = [row.line_text, "link", row.url];
        } else {
          item = [row.line_text, row.line_type as LineType];
        }

        entry[lang].push(item);
      }

      this.loaded = true;
    } catch (err) {
      console.warn("[TextService] DB 로딩 실패, 폴백 텍스트 사용:", err);
      this.loaded = false;
    }
  }

  /** 로딩 성공 여부 */
  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * 캐시에서 텍스트 반환.
   * @param category  카테고리 키 (예: 'lineup', 'whois')
   * @param subKey    서브 키 (예: 'stann') — 없으면 생략
   */
  getText(category: string, subKey?: string): I18nContentItem | null {
    const key = subKey ? `${category}:${subKey}` : category;
    return this.cache.get(key) ?? null;
  }

  /**
   * boot 시퀀스를 I18nBootLine 형태로 반환.
   * terminal_lines는 line_text + line_type으로 저장되어 BootLine과 동일한 구조.
   */
  getBootSequence(): I18nBootLine | null {
    const item = this.cache.get("boot");
    if (!item) return null;
    return {
      ko: item.ko.map(toBootLine),
      en: item.en.map(toBootLine),
    };
  }

  /**
   * wake 시퀀스를 I18nBootLine 형태로 반환.
   */
  getWakeSequence(): I18nBootLine | null {
    const item = this.cache.get("wake");
    if (!item) return null;
    return {
      ko: item.ko.map(toBootLine),
      en: item.en.map(toBootLine),
    };
  }

  /** 활성 이벤트 메타데이터 반환 */
  getActiveEvent(): ActiveEvent | null {
    return this.activeEvent;
  }

  /**
   * DB에 등록된 whois sub_key 목록 반환 (동적 whois 핸들러용).
   * 예: ['stann', 'marcus', 'nusnoom']
   */
  getWhoisTargets(): string[] {
    const targets: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith("whois:")) {
        targets.push(key.slice("whois:".length));
      }
    }
    return targets;
  }
}

/** ContentItem → BootLine 변환 헬퍼 */
function toBootLine(item: ContentItem): BootLine {
  if (typeof item === "string") return { text: item, type: "output" };
  return { text: item[0], type: item[1] as LineType };
}

/** 전역 싱글턴 인스턴스 */
export const textService = new TextService();
