-- 01 아카이브 및 02 활성화 전환 마이그레이션

-- 0. terminal_texts 테이블에 slug 컬럼 추가
ALTER TABLE terminal_texts ADD COLUMN IF NOT EXISTS slug text;

-- 기존 데이터에 slug 지정 (terminal-01)
UPDATE terminal_texts
SET
    slug = 'terminal-01'
WHERE
    event_id = (
        SELECT id
        FROM events
        WHERE
            slug = 'terminal-01'
    );

-- 1. 01 이벤트 아카이브
UPDATE events SET status = 'archived' WHERE slug = 'terminal-01';

-- 2. 02 이벤트 생성 및 활성화
INSERT INTO events (slug, title, date, venue, status, metadata)
VALUES (
    'terminal-02', 
    'TERMINAL [02] — COMING SOON', 
    '2026-05-01 22:00:00+09', 
    'TO BE ANNOUNCED', 
    'active', 
    '{"bpm": "???", "genre": "TECHNO", "subtitle": "THE NEXT EVOLUTION"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET status = 'active';

-- 3. 기존 02 텍스트 삭제 후 01 기반으로 예고 텍스트 생성 (slug 포함)
DELETE FROM terminal_texts WHERE slug = 'terminal-02';

INSERT INTO terminal_texts (event_id, slug, category, sub_key, description, content_ko, content_en, sort_order)
SELECT 
    (SELECT id FROM events WHERE slug = 'terminal-02'),
    'terminal-02',
    category,
    sub_key,
    description,
    CASE 
        WHEN category = 'boot' THEN '[{"text": "CORE SYSTEM STATUS: STANDBY", "type": "system"}, {"text": "SESSION 01: COMPLETED", "type": "success"}, {"text": "INITIALIZING SESSION 02 PROTOCOLS...", "type": "output"}, {"text": "", "type": "divider"}]'::jsonb
        WHEN category = 'welcome' THEN '[{"text": "ACCESS GRANTED — STANDBY MODE", "type": "success"}, {"text": "", "divider": true, "type": "divider"}, {"text": "TERMINAL [01] 행사가 성공적으로 종료되었습니다.", "type": "output"}, {"text": "더욱 강력해진 [02] 세션으로 곧 돌아오겠습니다.", "type": "system"}, {"text": "", "divider": true, "type": "divider"}, {"text": "최신 소식은 ''instagram'' 명령어로 확인하세요.", "type": "output"}]'::jsonb
        ELSE content_ko
    END,
    CASE 
        WHEN category = 'boot' THEN '[{"text": "CORE SYSTEM STATUS: STANDBY", "type": "system"}, {"text": "SESSION 01: COMPLETED", "type": "success"}, {"text": "INITIALIZING SESSION 02 PROTOCOLS...", "type": "output"}, {"text": "", "type": "divider"}]'::jsonb
        WHEN category = 'welcome' THEN '[{"text": "ACCESS GRANTED — STANDBY MODE", "type": "success"}, {"text": "", "divider": true, "type": "divider"}, {"text": "TERMINAL [01] has successfully concluded.", "type": "output"}, {"text": "We will return soon with a more powerful [02] session.", "type": "system"}, {"text": "", "divider": true, "type": "divider"}, {"text": "Check ''instagram'' for latest updates.", "type": "output"}]'::jsonb
        ELSE content_en
    END,
    sort_order
FROM terminal_texts
WHERE slug = 'terminal-01';

-- 4. app_config에 active_event_id 업데이트
UPDATE app_config SET value = (SELECT id::text FROM events WHERE slug = 'terminal-02') WHERE key = 'active_event_id';