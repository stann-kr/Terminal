-- ============================================================
-- TERMINAL: Transition 02 Fix (Text versions & Cache)
-- 1. terminal_texts 테이블의 01 데이터를 02로 재생성 (치환 적용)
-- 2. active_event_id 및 status 강제 재설정
-- ============================================================

-- 0. slug 컬럼 누락 시 추가 (이전 마이그레이션 미적용 대비)
ALTER TABLE terminal_texts ADD COLUMN IF NOT EXISTS slug text;

-- 1. 기존 02 텍스트 완전 삭제 후 재복제 (01 -> 02 문자열 치환 적용)
DELETE FROM terminal_texts WHERE slug = 'terminal-02';

INSERT INTO terminal_texts (event_id, slug, category, sub_key, description, content_ko, content_en, sort_order)
SELECT 
    (SELECT id FROM events WHERE slug = 'terminal-02'),
    'terminal-02',
    category,
    sub_key,
    description,
    -- JSON 내부의 [01] 을 [02] 로 치환 (정규 표현식 또는 단순 치환)
    REPLACE(REPLACE(content_ko::text, '[01]', '[02]'), '[02] ]', '[02]')::jsonb,
    REPLACE(REPLACE(content_en::text, '[01]', '[02]'), '[02] ]', '[02]')::jsonb,
    sort_order
FROM terminal_texts
WHERE slug = 'terminal-01';

-- 2. 이벤트 상태 강제 재설정
UPDATE events SET status = 'archived' WHERE slug = 'terminal-01';
UPDATE events SET status = 'active' WHERE slug = 'terminal-02';

-- 3. 전역 활성 이벤트 ID 업데이트
UPDATE app_config 
SET value = (SELECT id::text FROM events WHERE slug = 'terminal-02') 
WHERE key = 'active_event_id';
