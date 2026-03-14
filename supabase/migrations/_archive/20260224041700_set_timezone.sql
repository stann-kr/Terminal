-- 데이터베이스 차원의 기본 시간대를 Asia/Seoul로 설정 (UTC+9)
ALTER DATABASE postgres SET timezone TO 'Asia/Seoul';

-- 기존 guestbook 테이블의 created_at 기본값을 UTC 강제 변환 대신 시스템 시간(KST)을 따르도록 수정
ALTER TABLE guestbook ALTER COLUMN created_at SET DEFAULT now();