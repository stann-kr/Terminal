-- ============================================================
-- TERMINAL: Squashed Baseline Schema (v0.22.2)
-- 기존 17개 마이그레이션을 단일 파일로 통합
-- 생성일: 2026-03-14
-- ============================================================

-- ── 0. 확장 (Extensions) ──────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- ── 1. guestbook (방명록 / transmit 명령어) ──────────────────
CREATE TABLE IF NOT EXISTS guestbook (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  message    text NOT NULL,
  device_id  text,
  user_agent text,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook (created_at DESC);

ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users"   ON guestbook FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON guestbook FOR INSERT WITH CHECK (true);

-- ── 2. app_config (전역 설정) ────────────────────────────────
CREATE TABLE IF NOT EXISTS app_config (
  key   text PRIMARY KEY,
  value text NOT NULL
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON app_config FOR SELECT USING (true);
CREATE POLICY "Enable update for admin"          ON app_config FOR UPDATE USING (auth.role() = 'authenticated');

ALTER PUBLICATION supabase_realtime ADD TABLE app_config;

-- ── 3. live_sessions (라이브 채팅 세션) ─────────────────────
CREATE TABLE IF NOT EXISTS live_sessions (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name         text NOT NULL,
  is_force_open boolean DEFAULT false NOT NULL,
  starts_at    timestamptz DEFAULT now() NOT NULL,
  ends_at      timestamptz,
  closed_at    timestamptz,
  created_at   timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON live_sessions FOR SELECT USING (true);
CREATE POLICY "Enable insert for admin"          ON live_sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for admin"          ON live_sessions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for admin"          ON live_sessions FOR DELETE USING (auth.role() = 'authenticated');

ALTER PUBLICATION supabase_realtime ADD TABLE live_sessions;

-- ── 4. live_messages (실시간 채팅 메시지) ────────────────────
CREATE TABLE IF NOT EXISTS live_messages (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nick       text NOT NULL,
  message    text NOT NULL,
  device_id  text,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
  session_id uuid REFERENCES live_sessions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_live_messages_created_at ON live_messages (created_at DESC);

ALTER TABLE live_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users"   ON live_messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON live_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete for admin"            ON live_messages FOR DELETE USING (auth.role() = 'authenticated');

ALTER PUBLICATION supabase_realtime ADD TABLE live_messages;

-- ── 5. events (이벤트 메타데이터) ────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug       text NOT NULL UNIQUE,
  title      text NOT NULL,
  date       timestamptz NOT NULL,
  venue      text NOT NULL,
  status     text NOT NULL DEFAULT 'archived'
               CHECK (status IN ('active', 'upcoming', 'archived')),
  metadata   jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events: public read"   ON events FOR SELECT USING (true);
CREATE POLICY "events: auth write"    ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "events: auth update"   ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "events: auth delete"   ON events FOR DELETE USING (auth.role() = 'authenticated');

-- ── 6. terminal_texts (이중언어 텍스트 콘텐츠) ────────────────
CREATE TABLE IF NOT EXISTS terminal_texts (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id    uuid REFERENCES events(id) ON DELETE CASCADE,
  category    text NOT NULL,
  sub_key     text,
  aliases     text[],
  description text,
  content_ko  jsonb NOT NULL DEFAULT '[]'::jsonb,
  content_en  jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order  int DEFAULT 0,
  updated_at  timestamptz DEFAULT now() NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- event_id, sub_key 중 NULL이 포함될 수 있으므로 COALESCE 기반 부분 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS idx_terminal_texts_unique
  ON terminal_texts (
    COALESCE(event_id, '00000000-0000-0000-0000-000000000000'::uuid),
    category,
    COALESCE(sub_key, '')
  );

CREATE INDEX IF NOT EXISTS idx_terminal_texts_event_category
  ON terminal_texts(event_id, category);

CREATE INDEX IF NOT EXISTS idx_terminal_texts_static_category
  ON terminal_texts(category)
  WHERE event_id IS NULL;

ALTER TABLE terminal_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ttexts: public read"  ON terminal_texts FOR SELECT USING (true);
CREATE POLICY "ttexts: auth insert"  ON terminal_texts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ttexts: auth update"  ON terminal_texts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "ttexts: auth delete"  ON terminal_texts FOR DELETE USING (auth.role() = 'authenticated');

-- updated_at 자동 갱신 트리거 (moddatetime)
CREATE TRIGGER set_terminal_texts_updated_at
  BEFORE UPDATE ON terminal_texts
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);
