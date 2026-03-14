-- DB 세션 타임존을 UTC(표준)로 복원
-- 이전 마이그레이션(20260224041700_set_timezone.sql)에서 Asia/Seoul로 변경된 것을 되돌림
ALTER DATABASE postgres SET timezone TO 'UTC';

-- created_at 기본값을 명시적 UTC 변환으로 복원
ALTER TABLE guestbook ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now());

-- 기존 데이터 참고:
-- `timestamp with time zone`(timestamptz) 타입은 PostgreSQL 내부에서 항상 UTC로 저장됩니다.
-- DB 세션 타임존 설정은 저장된 값이 아닌, API 응답의 오프셋 표기에만 영향을 줍니다.
-- 따라서 기존 레코드의 실제 시각(moment in time)은 이미 정확하며, 별도 데이터 변환이 불필요합니다.
-- 이 마이그레이션 적용 후 API 응답 오프셋이 +09:00 → +00:00(Z)으로 변경됩니다.
