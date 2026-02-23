-- guestbook 테이블 생성
CREATE TABLE IF NOT EXISTS guestbook (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  message text NOT NULL,
  device_id text,
  user_agent text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 빠른 조회를 위한 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook (created_at DESC);

-- RLS 활성화
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 조회 허용 정책
CREATE POLICY "Enable read access for all users" ON guestbook FOR
SELECT USING (true);

-- 모든 사용자 작성 허용 정책 (인증 불필요 - System 통신망 컨셉)
CREATE POLICY "Enable insert access for all users" ON guestbook FOR
INSERT
WITH
    CHECK (true);