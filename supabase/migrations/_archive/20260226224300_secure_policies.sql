-- 1. live_messages 테이블: 모든 유저의 삭제 권한 제거 및 인증된 세션(어드민) 전용으로 변경
DROP POLICY IF EXISTS "Enable delete for all" ON live_messages;

CREATE POLICY "Enable delete for admin" ON live_messages FOR DELETE USING (
    auth.role () = 'authenticated'
);

-- 2. app_config 테이블: 누구나 수정할 수 있던 버그 수정 (true -> authenticated)
DROP POLICY IF EXISTS "Enable update for admin" ON app_config;

CREATE POLICY "Enable update for admin" ON app_config FOR
UPDATE USING (
    auth.role () = 'authenticated'
);

-- 3. live_sessions 테이블: 모든 유저의 생성/수정/삭제 권한 제거 및 인증된 세션 전용으로 변경
DROP POLICY IF EXISTS "Enable insert for all users" ON live_sessions;

DROP POLICY IF EXISTS "Enable update for all users" ON live_sessions;

DROP POLICY IF EXISTS "Enable delete for all users" ON live_sessions;

CREATE POLICY "Enable insert for admin" ON live_sessions FOR
INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
    );

CREATE POLICY "Enable update for admin" ON live_sessions FOR
UPDATE USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Enable delete for admin" ON live_sessions FOR DELETE USING (
    auth.role () = 'authenticated'
);