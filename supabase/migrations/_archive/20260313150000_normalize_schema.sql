-- ============================================================
-- Phase 1: DB 정규화 및 데이터 무결성 개선
-- ============================================================

-- 1. active_event_id 제거 — events.status='active' 단일 소스로 통일
--    (migration 13이 재추가했으나 앱 코드에서 미참조, 이중 소스 제거)
DELETE FROM app_config WHERE key = 'active_event_id';

-- 2. terminal_texts.slug 컬럼 제거
--    events.slug와 중복 정보 (event_id FK JOIN으로 조회 가능)
--    정적 텍스트에 slug='static' 합성값을 부여하는 비정규화 패턴 해소
ALTER TABLE terminal_texts DROP COLUMN IF EXISTS slug;

-- 3. terminal_texts.created_at 컬럼 추가
--    updated_at만 있어 생성 시점 추적 불가, 다른 테이블과 일관성 확보
ALTER TABLE terminal_texts
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- 4. events.status 인덱스 추가
--    TextService.initialize()에서 status='active' WHERE 절 사용
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- 5. live_messages.session_id FK ON DELETE SET NULL
--    기존 FK는 ON DELETE 동작 미지정 (기본값: RESTRICT)
--    세션 삭제 시 관련 메시지도 함께 제거되지 않아야 하므로 SET NULL 적용
ALTER TABLE live_messages
  DROP CONSTRAINT IF EXISTS live_messages_session_id_fkey;

ALTER TABLE live_messages
  ADD CONSTRAINT live_messages_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES live_sessions(id) ON DELETE SET NULL;
