-- ============================================================
-- TERMINAL: 스키마 재설계 v3 (terminal_lines -> terminal_texts)
-- 1. terminal_texts 구조 복귀 (jsonb 블록 방식)
-- 2. 기존 terminal_lines 데이터 마이그레이션
-- 3. description 필드 추가
-- ============================================================

-- moddatetime 확장 활성화
CREATE SCHEMA IF NOT EXISTS extensions;

CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

CREATE TABLE IF NOT EXISTS terminal_texts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  category text NOT NULL,
  sub_key text,
  description text,
  content_ko jsonb NOT NULL DEFAULT '[]'::jsonb,
  content_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int DEFAULT 0,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- event_id 또는 sub_key가 NULL일 때도 고유성을 보장하기 위한 부분 인덱스 도입
CREATE UNIQUE INDEX idx_terminal_texts_unique 
ON terminal_texts (
  COALESCE(event_id, '00000000-0000-0000-0000-000000000000'::uuid), 
  category, 
  COALESCE(sub_key, '')
);

-- RLS (Row Level Security) 설정
ALTER TABLE terminal_texts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ttexts: public read" ON terminal_texts FOR
SELECT USING (true);

CREATE POLICY "ttexts: auth insert" ON terminal_texts FOR
INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
    );

CREATE POLICY "ttexts: auth update" ON terminal_texts FOR
UPDATE USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "ttexts: auth delete" ON terminal_texts FOR DELETE USING (
    auth.role () = 'authenticated'
);

-- updated_at 트리거
CREATE TRIGGER set_terminal_texts_updated_at
BEFORE UPDATE ON terminal_texts
FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- ============================================================
-- 데이터 마이그레이션 (terminal_lines -> terminal_texts)
-- ============================================================
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en)
SELECT
  g.event_id, 
  g.category, 
  g.sub_key,
  COALESCE(
    (
      SELECT jsonb_agg(
        CASE 
          WHEN url IS NOT NULL THEN jsonb_build_array(line_text, line_type, url)
          ELSE jsonb_build_array(line_text, line_type)
        END
        ORDER BY sort_order
      )
      FROM terminal_lines k
      WHERE k.event_id IS NOT DISTINCT FROM g.event_id 
        AND k.category = g.category 
        AND k.sub_key IS NOT DISTINCT FROM g.sub_key
        AND k.lang = 'ko'
    ), 
    '[]'::jsonb
  ) as content_ko,
  COALESCE(
    (
      SELECT jsonb_agg(
        CASE 
          WHEN url IS NOT NULL THEN jsonb_build_array(line_text, line_type, url)
          ELSE jsonb_build_array(line_text, line_type)
        END
        ORDER BY sort_order
      )
      FROM terminal_lines e
      WHERE e.event_id IS NOT DISTINCT FROM g.event_id 
        AND e.category = g.category 
        AND e.sub_key IS NOT DISTINCT FROM g.sub_key
        AND e.lang = 'en'
    ),
    '[]'::jsonb
  ) as content_en
FROM (
  SELECT DISTINCT event_id, category, sub_key 
  FROM terminal_lines
) g;

-- description 업데이트
UPDATE terminal_texts
SET
    description = '플랫폼 소개'
WHERE
    category = 'about';

UPDATE terminal_texts
SET
    description = '항해 로그'
WHERE
    category = 'voyage';

UPDATE terminal_texts
SET
    description = '도움말'
WHERE
    category = 'help';

UPDATE terminal_texts
SET
    description = '명령어 목록'
WHERE
    category = 'commands';

UPDATE terminal_texts
SET
    description = '이스터에그'
WHERE
    category IN ('ping', 'weather', 'matrix');

UPDATE terminal_texts
SET
    description = '히스토리 (비인가)'
WHERE
    category = 'history';

UPDATE terminal_texts
SET
    description = '히스토리 (관리자)'
WHERE
    category = 'historyAdmin';

UPDATE terminal_texts
SET
    description = '첫 부팅 환영'
WHERE
    category = 'welcome';

UPDATE terminal_texts
SET
    description = '재방문 메시지'
WHERE
    category = 'resume';

UPDATE terminal_texts
SET
    description = '아티스트 라인업'
WHERE
    category = 'lineup';

UPDATE terminal_texts
SET
    description = '게이트 좌표'
WHERE
    category = 'gate';

UPDATE terminal_texts
SET
    description = '이벤트 상세'
WHERE
    category = 'event';

UPDATE terminal_texts
SET
    description = '외부 링크'
WHERE
    category = 'link';

UPDATE terminal_texts
SET
    description = '부팅 시퀀스'
WHERE
    category = 'boot';

UPDATE terminal_texts
SET
    description = '웨이크 시퀀스'
WHERE
    category = 'wake';

UPDATE terminal_texts
SET
    description = 'STANN LUMO 프로필'
WHERE
    category = 'whois'
    AND sub_key = 'stann';

UPDATE terminal_texts
SET
    description = 'MARCUS L 프로필'
WHERE
    category = 'whois'
    AND sub_key = 'marcus';

UPDATE terminal_texts
SET
    description = 'NUSNOOM 프로필'
WHERE
    category = 'whois'
    AND sub_key = 'nusnoom';

-- 기존 테이블 드롭
DROP TABLE IF EXISTS terminal_lines;