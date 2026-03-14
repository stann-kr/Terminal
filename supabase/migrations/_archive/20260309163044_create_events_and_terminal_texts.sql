-- ============================================================
-- TERMINAL: events 테이블 및 terminal_texts 테이블 생성
-- ============================================================

-- 1. events 테이블
CREATE TABLE IF NOT EXISTS events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  date timestamptz NOT NULL,
  venue text NOT NULL,
  genre text,
  bpm text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events: public read" ON events FOR SELECT USING (true);
CREATE POLICY "events: auth write" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "events: auth update" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "events: auth delete" ON events FOR DELETE USING (auth.role() = 'authenticated');

-- 2. terminal_texts 테이블
CREATE TABLE IF NOT EXISTS terminal_texts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  category text NOT NULL,
  sub_key text,
  content_ko jsonb NOT NULL DEFAULT '[]'::jsonb,
  content_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int DEFAULT 0,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(event_id, category, sub_key)
);

CREATE INDEX IF NOT EXISTS idx_terminal_texts_event_category
  ON terminal_texts(event_id, category);

CREATE INDEX IF NOT EXISTS idx_terminal_texts_static_category
  ON terminal_texts(category)
  WHERE event_id IS NULL;

ALTER TABLE terminal_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "terminal_texts: public read" ON terminal_texts FOR SELECT USING (true);
CREATE POLICY "terminal_texts: auth write" ON terminal_texts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "terminal_texts: auth update" ON terminal_texts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "terminal_texts: auth delete" ON terminal_texts FOR DELETE USING (auth.role() = 'authenticated');

-- 3. app_config에 active_event_id 행 추가
INSERT INTO app_config (key, value) VALUES ('active_event_id', '') ON CONFLICT (key) DO NOTHING;
