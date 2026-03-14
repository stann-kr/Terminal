-- live_sessions 테이블 생성
CREATE TABLE IF NOT EXISTS live_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  is_force_open boolean DEFAULT false NOT NULL,
  starts_at timestamp with time zone NOT NULL DEFAULT timezone('utc', now()),
  ends_at timestamp with time zone,
  closed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON live_sessions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON live_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON live_sessions FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON live_sessions FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE live_sessions;

-- live_messages에 session_id 컬럼 추가
ALTER TABLE live_messages
  ADD COLUMN IF NOT EXISTS session_id uuid REFERENCES live_sessions(id);

-- 기존 live_force_open 플래그는 유지 (하위 호환), 신규 로직은 live_sessions 사용
