-- ============================================================
-- TERMINAL: Transition 02 Force Fix Data
-- 1. terminal-01 텍스트의 slug 컬럼 강제 업데이트
-- 2. terminal-01 기반으로 terminal-02 텍스트 강제 생성 (event_id 기준)
-- ============================================================

-- 0. terminal-01 데이터에 slug 채우기
UPDATE terminal_texts 
SET slug = 'terminal-01' 
WHERE event_id = '00000000-0000-0000-0000-000000000001';

-- 1. 기존 02 텍스트 삭제
DELETE FROM terminal_texts WHERE slug = 'terminal-02';
DELETE FROM terminal_texts WHERE event_id = (SELECT id FROM events WHERE slug = 'terminal-02');

-- 2. 01 기반으로 02 데이터 복제 (event_id 매칭 방식)
INSERT INTO terminal_texts (event_id, slug, category, sub_key, description, content_ko, content_en, sort_order)
SELECT 
    (SELECT id FROM events WHERE slug = 'terminal-02'),
    'terminal-02',
    category,
    sub_key,
    description,
    REPLACE(REPLACE(content_ko::text, '[01]', '[02]'), '[02] ]', '[02]')::jsonb,
    REPLACE(REPLACE(content_en::text, '[01]', '[02]'), '[02] ]', '[02]')::jsonb,
    sort_order
FROM terminal_texts
WHERE event_id = '00000000-0000-0000-0000-000000000001';

-- 3. 정적 텍스트(NULL) 에도 slug 채우기 (필요 시)
UPDATE terminal_texts SET slug = 'static' WHERE event_id IS NULL AND slug IS NULL;

-- 4. 무결성 확인: 02 이벤트 상태 활성화
UPDATE events SET status = 'active' WHERE slug = 'terminal-02';
UPDATE events SET status = 'archived' WHERE slug = 'terminal-01';
