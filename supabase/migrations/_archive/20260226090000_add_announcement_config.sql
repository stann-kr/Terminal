-- app_config에 announcement 행 추가
INSERT INTO app_config (key, value)
VALUES ('announcement', '')
ON CONFLICT (key) DO NOTHING;

-- app_config에 Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE app_config;
