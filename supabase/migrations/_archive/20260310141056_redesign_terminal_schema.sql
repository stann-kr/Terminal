-- ============================================================
-- TERMINAL: 스키마 재설계
-- 1. terminal_texts → terminal_lines (줄 1개 = DB 1행)
-- 2. events: bpm/genre/subtitle 칼럼 → metadata jsonb
-- 3. events: status 필드 추가 (active/upcoming/archived)
-- 4. app_config.active_event_id 제거 (events.status로 대체)
-- ============================================================

-- 1. 기존 terminal_texts 테이블 삭제
DROP TABLE IF EXISTS terminal_texts;

-- 2. events 테이블 수정
ALTER TABLE events
  DROP COLUMN IF EXISTS subtitle,
  DROP COLUMN IF EXISTS genre,
  DROP COLUMN IF EXISTS bpm;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'archived'
    CHECK (status IN ('active', 'upcoming', 'archived')),
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

-- [01] 이벤트: archived 상태, metadata에 상세 정보 이전
UPDATE events SET
  status   = 'active',
  metadata = '{"bpm": "138.00 BPM", "genre": "Hypnotic, Futuristic Techno", "subtitle": "Maiden Voyage to the Unknown Sector."}'::jsonb
WHERE id = '00000000-0000-0000-0000-000000000001';

-- 3. app_config에서 active_event_id 제거 (events.status 로 대체)
DELETE FROM app_config WHERE key = 'active_event_id';

-- ============================================================
-- 4. terminal_lines 테이블 생성
--    줄 1개 = 행 1개. 순수 텍스트 + 타입으로 Supabase 대시보드에서 직접 편집 가능.
-- ============================================================
CREATE TABLE IF NOT EXISTS terminal_lines (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   uuid REFERENCES events(id) ON DELETE CASCADE,
  category   text NOT NULL,
  sub_key    text,
  lang       text NOT NULL CHECK (lang IN ('ko', 'en')),
  line_text  text NOT NULL DEFAULT '',
  line_type  text NOT NULL DEFAULT 'output'
    CHECK (line_type IN ('output','error','success','system','input','link','header','divider','progress','live')),
  url        text,
  sort_order int  NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_tlines_event_cat_lang
  ON terminal_lines(event_id, category, lang, sort_order);

CREATE INDEX IF NOT EXISTS idx_tlines_static_cat_lang
  ON terminal_lines(category, lang, sort_order)
  WHERE event_id IS NULL;

ALTER TABLE terminal_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tlines: public read"  ON terminal_lines FOR SELECT USING (true);
CREATE POLICY "tlines: auth insert" ON terminal_lines FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "tlines: auth update" ON terminal_lines FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "tlines: auth delete" ON terminal_lines FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- 5. 시드 데이터 (줄 1개 = 행 1개)
-- ============================================================

-- ── about (정적) ──────────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'about',NULL,'ko','TERMINAL — PLATFORM OVERVIEW','header',NULL,0),
(NULL,'about',NULL,'ko','TERMINAL은 오디오 신호와 데이터가 교차하는 무기질적인 정거장을 설계하는','output',NULL,1),
(NULL,'about',NULL,'ko','서울 기반의 테크노 플랫폼입니다.','output',NULL,2),
(NULL,'about',NULL,'ko',' ','output',NULL,3),
(NULL,'about',NULL,'ko','[ DESIGN PRINCIPLE ]','output',NULL,4),
(NULL,'about',NULL,'ko','불필요한 시각적 장식을 덜어내고, 정교하게 통제된 환경을 구축하는 데 집중합니다.','output',NULL,5),
(NULL,'about',NULL,'ko','오직 텍스트와 필수적인 빛으로만 공간을 렌더링하는','output',NULL,6),
(NULL,'about',NULL,'ko','CLI(Command Line Interface) 시스템처럼, 가장 본질적이고 미니멀한 형태를 지향합니다.','output',NULL,7),
(NULL,'about',NULL,'ko',' ','output',NULL,8),
(NULL,'about',NULL,'ko','[ AUDIO ENGINE ]','output',NULL,9),
(NULL,'about',NULL,'ko','초기 미래주의(Early Futurism)의 원초적 질감을 담은','output',NULL,10),
(NULL,'about',NULL,'ko','최면적이고 미래지향적인(Hypnotic & Futuristic) 테크노.','output',NULL,11),
(NULL,'about',NULL,'ko',' ','output',NULL,12),
(NULL,'about',NULL,'ko','[ OBJECTIVE ]','output',NULL,13),
(NULL,'about',NULL,'ko','TERMINAL은 단순한 관람객을 위한 무대를 구축하지 않습니다.','output',NULL,14),
(NULL,'about',NULL,'ko','이곳에 접속한 모든 객체가 개별 노드(Node)로서 시스템 연산에 참여하고,','output',NULL,15),
(NULL,'about',NULL,'ko','미지의 궤도를 함께 탐색하는 완전한 동기화를 목표로 합니다.','output',NULL,16),
(NULL,'about',NULL,'ko',' ','output',NULL,17),
(NULL,'about',NULL,'ko','터미널 아키텍트 : STANN LUMO','output',NULL,18),
(NULL,'about',NULL,'ko','','output',NULL,19);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'about',NULL,'en','TERMINAL — PLATFORM OVERVIEW','header',NULL,0),
(NULL,'about',NULL,'en','TERMINAL is a Seoul-based techno platform designing an industrial station','output',NULL,1),
(NULL,'about',NULL,'en','where audio signals and data intersect.','output',NULL,2),
(NULL,'about',NULL,'en',' ','output',NULL,3),
(NULL,'about',NULL,'en','[ DESIGN PRINCIPLE ]','output',NULL,4),
(NULL,'about',NULL,'en','Stripping away non-essential visual elements, we focus on constructing','output',NULL,5),
(NULL,'about',NULL,'en','a precisely controlled environment. Much like a CLI (Command Line Interface)','output',NULL,6),
(NULL,'about',NULL,'en','rendered only by essential light and text, we aim for the pure, minimal','output',NULL,7),
(NULL,'about',NULL,'en','essence of the space.','output',NULL,8),
(NULL,'about',NULL,'en',' ','output',NULL,9),
(NULL,'about',NULL,'en','[ AUDIO ENGINE ]','output',NULL,10),
(NULL,'about',NULL,'en','Hypnotic and futuristic techno, heavily influenced by the raw textures','output',NULL,11),
(NULL,'about',NULL,'en','of early futurism.','output',NULL,12),
(NULL,'about',NULL,'en',' ','output',NULL,13),
(NULL,'about',NULL,'en','[ OBJECTIVE ]','output',NULL,14),
(NULL,'about',NULL,'en','TERMINAL does not build stages for mere spectators. Our objective is total','output',NULL,15),
(NULL,'about',NULL,'en','synchronization — where every logged-in entity becomes an active node,','output',NULL,16),
(NULL,'about',NULL,'en','participating in the system''s calculation to explore uncharted','output',NULL,17),
(NULL,'about',NULL,'en','trajectories together.','output',NULL,18),
(NULL,'about',NULL,'en',' ','output',NULL,19),
(NULL,'about',NULL,'en','TERMINAL ARCHITECT : STANN LUMO','output',NULL,20),
(NULL,'about',NULL,'en','','output',NULL,21);

-- ── voyage (정적) ─────────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'voyage',NULL,'ko','VOYAGE LOG — TERMINAL','header',NULL,0),
(NULL,'voyage',NULL,'ko','TERMINAL의 항해는 계속된다.','output',NULL,1),
(NULL,'voyage',NULL,'ko',' ','output',NULL,2),
(NULL,'voyage',NULL,'ko','각 시퀀스는 새로운 좌표를 설정한다.','output',NULL,3),
(NULL,'voyage',NULL,'ko','우리는 접속된 모든 노드와 함께 미지의 궤도를 탐색하며,','output',NULL,4),
(NULL,'voyage',NULL,'ko','매 이터레이션마다 시스템을 확장하고 새로운 섹터를 개척한다.','output',NULL,5),
(NULL,'voyage',NULL,'ko',' ','output',NULL,6),
(NULL,'voyage',NULL,'ko','오디오 신호는 정거장을 이동하고, 데이터는 교차하며,','output',NULL,7),
(NULL,'voyage',NULL,'ko','플랫폼은 멈추지 않는다.','output',NULL,8),
(NULL,'voyage',NULL,'ko',' ','output',NULL,9),
(NULL,'voyage',NULL,'ko','이것이 TERMINAL의 영구적인 디렉티브다.','system',NULL,10),
(NULL,'voyage',NULL,'ko','경고: 장시간 연속되는 루프(Hypnotic Loop)는 인지 감각을 왜곡할 수 있습니다.','error',NULL,11),
(NULL,'voyage',NULL,'ko','','output',NULL,12);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'voyage',NULL,'en','VOYAGE LOG — TERMINAL','header',NULL,0),
(NULL,'voyage',NULL,'en','The voyage of TERMINAL continues.','output',NULL,1),
(NULL,'voyage',NULL,'en',' ','output',NULL,2),
(NULL,'voyage',NULL,'en','Each sequence sets new coordinates.','output',NULL,3),
(NULL,'voyage',NULL,'en','We navigate uncharted trajectories with every connected node,','output',NULL,4),
(NULL,'voyage',NULL,'en','expanding the system and pioneering new sectors with each iteration.','output',NULL,5),
(NULL,'voyage',NULL,'en',' ','output',NULL,6),
(NULL,'voyage',NULL,'en','Audio signals traverse stations, data intersects,','output',NULL,7),
(NULL,'voyage',NULL,'en','and the platform never stops.','output',NULL,8),
(NULL,'voyage',NULL,'en',' ','output',NULL,9),
(NULL,'voyage',NULL,'en','This is the permanent directive of TERMINAL.','system',NULL,10),
(NULL,'voyage',NULL,'en','Warning: Prolonged continuous loops (Hypnotic Loops) may distort cognitive senses.','error',NULL,11),
(NULL,'voyage',NULL,'en','','output',NULL,12);

-- ── help (정적) ───────────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'help',NULL,'ko','터미널 코어 인덱스','header',NULL,0),
(NULL,'help',NULL,'ko','about    — 시스템 개요 및 운영 목적','output',NULL,1),
(NULL,'help',NULL,'ko','lineup   — 참가 객체(아티스트) 라인업 조회','output',NULL,2),
(NULL,'help',NULL,'ko','gate     — 접속 게이트 좌표 및 일정 (일시/장소)','output',NULL,3),
(NULL,'help',NULL,'ko','whois    — 시스템 아카이브 검색 (예: whois stann)','output',NULL,4),
(NULL,'help',NULL,'ko','transmit  — 시스템 통신망(방명록) 조회 및 전송','output',NULL,5),
(NULL,'help',NULL,'ko','live     — 이벤트 실시간 채팅 채널 접속','output',NULL,6),
(NULL,'help',NULL,'ko','link     — 외부 데이터 네트워크 연결','output',NULL,7),
(NULL,'help',NULL,'ko','status   — 현재 세션 가동 로그','output',NULL,8),
(NULL,'help',NULL,'ko','settings — 시스템 언어 및 로컬 환경 설정','output',NULL,9),
(NULL,'help',NULL,'ko','','output',NULL,10),
(NULL,'help',NULL,'ko','전체 명령어 목록을 보려면 ''commands''를 입력하세요.','system',NULL,11),
(NULL,'help',NULL,'ko','','output',NULL,12);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'help',NULL,'en','TERMINAL CORE INDEX','header',NULL,0),
(NULL,'help',NULL,'en','about    — Project overview and purpose','output',NULL,1),
(NULL,'help',NULL,'en','lineup   — Artist lineup inquiry','output',NULL,2),
(NULL,'help',NULL,'en','gate     — Date & Venue','output',NULL,3),
(NULL,'help',NULL,'en','whois    — System archive search (ex. whois stann)','output',NULL,4),
(NULL,'help',NULL,'en','transmit  — View and transmit messages','output',NULL,5),
(NULL,'help',NULL,'en','live     — Live event channel','output',NULL,6),
(NULL,'help',NULL,'en','link     — External directories','output',NULL,7),
(NULL,'help',NULL,'en','status   — System operation logs','output',NULL,8),
(NULL,'help',NULL,'en','settings — Language & environment settings','output',NULL,9),
(NULL,'help',NULL,'en','','output',NULL,10),
(NULL,'help',NULL,'en','Type ''commands'' to see all available system commands.','system',NULL,11),
(NULL,'help',NULL,'en','','output',NULL,12);

-- ── commands (정적) ───────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'commands',NULL,'ko','전체 시스템 명령어 매니페스트','header',NULL,0),
(NULL,'commands',NULL,'ko','[ 시스템 코어 ]','system',NULL,1),
(NULL,'commands',NULL,'ko','about, help, commands, status, settings, systems, voyage, clear','output',NULL,2),
(NULL,'commands',NULL,'ko','[ 데이터 아카이브 ]','system',NULL,3),
(NULL,'commands',NULL,'ko','lineup, gate, event, link, whoami, whois, transmit, live, name','output',NULL,4),
(NULL,'commands',NULL,'ko','[ 유틸리티 & 보안 ]','system',NULL,5),
(NULL,'commands',NULL,'ko','date, time, echo, history, sudo','output',NULL,6),
(NULL,'commands',NULL,'ko','[ 시스템 진단 ]','system',NULL,7),
(NULL,'commands',NULL,'ko','ping, scan, weather, matrix','output',NULL,8),
(NULL,'commands',NULL,'ko','','output',NULL,9);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'commands',NULL,'en','ALL SYSTEM COMMAND MANIFEST','header',NULL,0),
(NULL,'commands',NULL,'en','[ SYSTEM CORE ]','system',NULL,1),
(NULL,'commands',NULL,'en','about, help, commands, status, settings, systems, voyage, clear','output',NULL,2),
(NULL,'commands',NULL,'en','[ DATA ARCHIVE ]','system',NULL,3),
(NULL,'commands',NULL,'en','lineup, gate, event, link, whoami, whois, transmit, live, name','output',NULL,4),
(NULL,'commands',NULL,'en','[ UTILITIES & SECURITY ]','system',NULL,5),
(NULL,'commands',NULL,'en','date, time, echo, history, sudo','output',NULL,6),
(NULL,'commands',NULL,'en','[ DIAGNOSTICS ]','system',NULL,7),
(NULL,'commands',NULL,'en','ping, scan, weather, matrix','output',NULL,8),
(NULL,'commands',NULL,'en','','output',NULL,9);

-- ── ping (정적) ───────────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'ping',NULL,'ko','[ PING ] 메인 오디오 서버 응답 대기 중...','progress',NULL,0),
(NULL,'ping',NULL,'ko','응답 시간: 14ms','output',NULL,1),
(NULL,'ping',NULL,'ko','모든 패킷 스트림 정상 수신 확인 완료.','success',NULL,2),
(NULL,'ping',NULL,'ko','','output',NULL,3);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'ping',NULL,'en','[ PING ] Waiting for main audio server response...','progress',NULL,0),
(NULL,'ping',NULL,'en','Response time: 14ms','output',NULL,1),
(NULL,'ping',NULL,'en','All packet streams received correctly.','success',NULL,2),
(NULL,'ping',NULL,'en','','output',NULL,3);

-- ── weather (정적) ────────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'weather',NULL,'ko','[ 환경 데이터 스캔 중... ]','progress',NULL,0),
(NULL,'weather',NULL,'ko','경고: 미확인 오디오 신호가 감지되었습니다.','error',NULL,1),
(NULL,'weather',NULL,'ko','시스템 출력이 불안정해질 수 있습니다.','output',NULL,2),
(NULL,'weather',NULL,'ko','안전한 수준으로 볼륨 조절하고 시스템 청각 보호 모드를 발동하십시오.','output',NULL,3),
(NULL,'weather',NULL,'ko','','output',NULL,4);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'weather',NULL,'en','[ SCANNING ENVIRONMENT... ]','progress',NULL,0),
(NULL,'weather',NULL,'en','WARNING: Unidentified audio signal detected.','error',NULL,1),
(NULL,'weather',NULL,'en','System output may become unstable.','output',NULL,2),
(NULL,'weather',NULL,'en','Adjust volume to a safe level and activate auditory protection.','output',NULL,3),
(NULL,'weather',NULL,'en','','output',NULL,4);

-- ── matrix (정적) ─────────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'matrix',NULL,'ko','파란 약을 먹으면 여기서 끝난다. 침대에서 깨어나 네가 믿고 싶은 걸 믿게 되겠지.','output',NULL,0),
(NULL,'matrix',NULL,'ko','빨간 약을 먹으면 원더랜드에 남아 토끼굴이 얼마나 깊은지 보여주겠다.','output',NULL,1),
(NULL,'matrix',NULL,'ko','선택은 너의 몫이다.','system',NULL,2),
(NULL,'matrix',NULL,'ko','','output',NULL,3);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'matrix',NULL,'en','You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe.','output',NULL,0),
(NULL,'matrix',NULL,'en','You take the red pill - you stay in Wonderland and I show you how deep the rabbit-hole goes.','output',NULL,1),
(NULL,'matrix',NULL,'en','The choice is yours.','system',NULL,2),
(NULL,'matrix',NULL,'en','','output',NULL,3);

-- ── history (정적) ────────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'history',NULL,'ko','[ ERROR ] 접근 권한이 부족합니다.','header',NULL,0),
(NULL,'history',NULL,'ko','보안 수준 LEVEL 2 이상의 인가된 마스터 노드만 열람할 수 있습니다.','error',NULL,1),
(NULL,'history',NULL,'ko','','output',NULL,2);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'history',NULL,'en','[ ERROR ] INSUFFICIENT CLEARANCE.','header',NULL,0),
(NULL,'history',NULL,'en','Only authorized master nodes with security LEVEL 2 or higher may access.','error',NULL,1),
(NULL,'history',NULL,'en','','output',NULL,2);

-- ── historyAdmin (정적) ───────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'historyAdmin',NULL,'ko','[ 시스템 로그 — 관리자 접근 허용됨 ]','header',NULL,0),
(NULL,'historyAdmin',NULL,'ko','ADMIN CLEARANCE: 세션 기록 열람 권한이 확인되었습니다.','success',NULL,1),
(NULL,'historyAdmin',NULL,'ko','보안 수준 LEVEL 5 — 접근 허가.','success',NULL,2),
(NULL,'historyAdmin',NULL,'ko','세션 기록은 클라이언트 메모리에만 저장됩니다. 브라우저를 닫으면 소멸합니다.','system',NULL,3),
(NULL,'historyAdmin',NULL,'ko','','output',NULL,4);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'historyAdmin',NULL,'en','[ SYSTEM LOG — ADMIN ACCESS GRANTED ]','header',NULL,0),
(NULL,'historyAdmin',NULL,'en','ADMIN CLEARANCE: Session log access confirmed.','success',NULL,1),
(NULL,'historyAdmin',NULL,'en','SECURITY LEVEL 5 — ACCESS PERMITTED.','success',NULL,2),
(NULL,'historyAdmin',NULL,'en','Session history is stored in client memory only. Cleared on browser close.','system',NULL,3),
(NULL,'historyAdmin',NULL,'en','','output',NULL,4);

-- ── welcome (정적) ────────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'welcome',NULL,'ko','TERMINAL CORE SYSTEM — 터미널 접근이 허가되었습니다','success',NULL,0),
(NULL,'welcome',NULL,'ko','''event''로 파티 정보, ''lineup''으로 라인업 조회. ''help''를 입력하면 전체 목록을 확인할 수 있습니다.','system',NULL,1),
(NULL,'welcome',NULL,'ko','','divider',NULL,2);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'welcome',NULL,'en','TERMINAL CORE SYSTEM — ACCESS GRANTED','success',NULL,0),
(NULL,'welcome',NULL,'en','Type ''event'' for party info, ''lineup'' for artists. Type ''help'' to see all commands.','system',NULL,1),
(NULL,'welcome',NULL,'en','','divider',NULL,2);

-- ── resume (정적) ─────────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'resume',NULL,'ko','TERMINAL CORE SYSTEM — 세션이 재개되었습니다','success',NULL,0),
(NULL,'resume',NULL,'ko','''help'' 를 입력하면 사용 가능한 커맨드를 확인할 수 있습니다.','system',NULL,1),
(NULL,'resume',NULL,'ko','','divider',NULL,2);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
(NULL,'resume',NULL,'en','TERMINAL CORE SYSTEM — SESSION RESUMED','success',NULL,0),
(NULL,'resume',NULL,'en','Type ''help'' to see available commands.','system',NULL,1),
(NULL,'resume',NULL,'en','','divider',NULL,2);

-- ── lineup (이벤트 종속) ──────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','lineup',NULL,'ko','AUDIO CONTROLLERS [01]','header',NULL,0),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'ko','[01]  STANN LUMO','success',NULL,1),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'ko','[02]  MARCUS L','success',NULL,2),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'ko','[03]  NUSNOOM','success',NULL,3),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'ko','────────────────────','system',NULL,4),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'ko','Format: Hypnotic, Futuristic Techno','output',NULL,5),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'ko','','output',NULL,6);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','lineup',NULL,'en','AUDIO CONTROLLERS [01]','header',NULL,0),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'en','[01]  STANN LUMO','success',NULL,1),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'en','[02]  MARCUS L','success',NULL,2),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'en','[03]  NUSNOOM','success',NULL,3),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'en','────────────────────','system',NULL,4),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'en','Format: Hypnotic, Futuristic Techno','output',NULL,5),
('00000000-0000-0000-0000-000000000001','lineup',NULL,'en','','output',NULL,6);

-- ── gate (이벤트 종속) ────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','gate',NULL,'ko','접속 게이트 좌표 [01]','header',NULL,0),
('00000000-0000-0000-0000-000000000001','gate',NULL,'ko','TERMINAL [01] : BOOT SEQUENCE','system',NULL,1),
('00000000-0000-0000-0000-000000000001','gate',NULL,'ko','','divider',NULL,2),
('00000000-0000-0000-0000-000000000001','gate',NULL,'ko','일  시 : 26-03-07 (토) 23:00 KST','output',NULL,3),
('00000000-0000-0000-0000-000000000001','gate',NULL,'ko','장  소 : Faust, Seoul','output',NULL,4),
('00000000-0000-0000-0000-000000000001','gate',NULL,'ko','','divider',NULL,5),
('00000000-0000-0000-0000-000000000001','gate',NULL,'ko','* 시스템 동기화 및 메인 오디오 세션에 접속하십시오.','output',NULL,6),
('00000000-0000-0000-0000-000000000001','gate',NULL,'ko','','output',NULL,7);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','gate',NULL,'en','TARGET COORDINATES [01]','header',NULL,0),
('00000000-0000-0000-0000-000000000001','gate',NULL,'en','TERMINAL [01] : BOOT SEQUENCE','system',NULL,1),
('00000000-0000-0000-0000-000000000001','gate',NULL,'en','','divider',NULL,2),
('00000000-0000-0000-0000-000000000001','gate',NULL,'en','DATE  : 26-03-07 (SAT) 23:00 KST','output',NULL,3),
('00000000-0000-0000-0000-000000000001','gate',NULL,'en','VENUE : Faust, Seoul','output',NULL,4),
('00000000-0000-0000-0000-000000000001','gate',NULL,'en','','divider',NULL,5),
('00000000-0000-0000-0000-000000000001','gate',NULL,'en','* Synchronize system and connect to the main audio session.','output',NULL,6),
('00000000-0000-0000-0000-000000000001','gate',NULL,'en','','output',NULL,7);

-- ── event (이벤트 종속) ───────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','TERMINAL [01] : BOOT SEQUENCE','header',NULL,0),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','Maiden Voyage to the Unknown Sector.','system',NULL,1),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','','divider',NULL,2),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','[ LINEUP ]','output',NULL,3),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','  STANN LUMO','success',NULL,4),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','  MARCUS L','success',NULL,5),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','  NUSNOOM','success',NULL,6),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko',' ','output',NULL,7),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','[ INFO ]','output',NULL,8),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','  DATE  : 26-03-07 (토) 23:00 KST','output',NULL,9),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','  VENUE : Faust, Seoul','output',NULL,10),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko',' ','output',NULL,11),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','[ ENGINE ]','output',NULL,12),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','  Hypnotic & Futuristic Techno','success',NULL,13),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','','divider',NULL,14),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','* 시스템 동기화 준비를 완료하십시오.','system',NULL,15),
('00000000-0000-0000-0000-000000000001','event',NULL,'ko','','output',NULL,16);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','event',NULL,'en','TERMINAL [01] : BOOT SEQUENCE','header',NULL,0),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','Maiden Voyage to the Unknown Sector.','system',NULL,1),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','','divider',NULL,2),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','[ LINEUP ]','output',NULL,3),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','  STANN LUMO','success',NULL,4),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','  MARCUS L','success',NULL,5),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','  NUSNOOM','success',NULL,6),
('00000000-0000-0000-0000-000000000001','event',NULL,'en',' ','output',NULL,7),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','[ INFO ]','output',NULL,8),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','  DATE  : 26-03-07 (SAT) 23:00 KST','output',NULL,9),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','  VENUE : Faust, Seoul','output',NULL,10),
('00000000-0000-0000-0000-000000000001','event',NULL,'en',' ','output',NULL,11),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','[ ENGINE ]','output',NULL,12),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','  Hypnotic & Futuristic Techno','success',NULL,13),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','','divider',NULL,14),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','* Complete system synchronization and prepare for departure.','system',NULL,15),
('00000000-0000-0000-0000-000000000001','event',NULL,'en','','output',NULL,16);

-- ── link (이벤트 종속) ────────────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','link',NULL,'ko','외부 네트워크 경로','header',NULL,0),
('00000000-0000-0000-0000-000000000001','link',NULL,'ko','* STANN LUMO 접근 (Instagram)','link','https://www.instagram.com/stannlumo/',1),
('00000000-0000-0000-0000-000000000001','link',NULL,'ko','* TERMINAL HUB (Instagram)','link','https://www.instagram.com/terminal_hub/',2),
('00000000-0000-0000-0000-000000000001','link',NULL,'ko','','output',NULL,3);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','link',NULL,'en','EXTERNAL LINKS','header',NULL,0),
('00000000-0000-0000-0000-000000000001','link',NULL,'en','* Stann Lumo Archive','link','https://www.instagram.com/stannlumo/',1),
('00000000-0000-0000-0000-000000000001','link',NULL,'en','* Terminal Network','link','https://www.instagram.com/terminal_hub/',2),
('00000000-0000-0000-0000-000000000001','link',NULL,'en','','output',NULL,3);

-- ── boot sequence (이벤트 종속) ───────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','TERMINAL CORE — 시스템 초기 부팅 시작','system',NULL,0),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','...','system',NULL,1),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','[ OK ] 커널 코어 모듈 로딩...','output',NULL,2),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','[ OK ] 로컬 스토리지 마운트 중...','output',NULL,3),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','[ OK ] 네트워크 라우팅 매트릭스 초기화...','output',NULL,4),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','[ OK ] 오디오 주파수 대역 보정 중...','output',NULL,5),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','[ -- ] 세션 매니페스트 스캔...','system',NULL,6),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','[ OK ] 데이터 로드 완료: 3명의 메인 노드 확인됨.','output',NULL,7),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','[ -- ] 동기화 게이트 좌표 확인...','system',NULL,8),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','[ OK ] 게이트: Faust, Seoul / 26-03-07 23:00 KST','output',NULL,9),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','...','system',NULL,10),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','','divider',NULL,11),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','시스템 상태: 정상 가동 (OPERATIONAL)','success',NULL,12),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','모든 준비가 완료되었습니다. 터미널 제어권을 이양합니다.','success',NULL,13),
('00000000-0000-0000-0000-000000000001','boot',NULL,'ko','','divider',NULL,14);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','TERMINAL CORE — SYSTEM BOOT INITIATED','system',NULL,0),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','...','system',NULL,1),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','[ OK ] Loading kernel modules...','output',NULL,2),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','[ OK ] Mounting local storage...','output',NULL,3),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','[ OK ] Initializing network routing matrix...','output',NULL,4),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','[ OK ] Calibrating frequency bands...','output',NULL,5),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','[ -- ] Scanning session manifest...','system',NULL,6),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','[ OK ] Nodes loaded: 3 personnel confirmed.','output',NULL,7),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','[ -- ] Verifying gate coordinates...','system',NULL,8),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','[ OK ] Gate: Faust, Seoul / 26-03-07 23:00 KST','output',NULL,9),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','...','system',NULL,10),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','','divider',NULL,11),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','STATUS: OPERATIONAL','success',NULL,12),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','All systems ready. Transferring terminal control.','success',NULL,13),
('00000000-0000-0000-0000-000000000001','boot',NULL,'en','','divider',NULL,14);

-- ── wake sequence (이벤트 종속) ───────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','wake',NULL,'ko','[ -- ] 슬립 모드 해제 중...','system',NULL,0),
('00000000-0000-0000-0000-000000000001','wake',NULL,'ko','[ OK ] 세션 상태 복원됨.','output',NULL,1),
('00000000-0000-0000-0000-000000000001','wake',NULL,'ko','[ OK ] 게이트: Faust, Seoul / 26-03-07 23:00 KST','output',NULL,2),
('00000000-0000-0000-0000-000000000001','wake',NULL,'ko','[ OK ] 시스템 재개.','success',NULL,3),
('00000000-0000-0000-0000-000000000001','wake',NULL,'ko','','divider',NULL,4);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','wake',NULL,'en','[ -- ] Waking from sleep...','system',NULL,0),
('00000000-0000-0000-0000-000000000001','wake',NULL,'en','[ OK ] Session state restored.','output',NULL,1),
('00000000-0000-0000-0000-000000000001','wake',NULL,'en','[ OK ] Gate: Faust, Seoul / 26-03-07 23:00 KST','output',NULL,2),
('00000000-0000-0000-0000-000000000001','wake',NULL,'en','[ OK ] System resumed.','success',NULL,3),
('00000000-0000-0000-0000-000000000001','wake',NULL,'en','','divider',NULL,4);

-- ── whois: stann (이벤트 종속) ────────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','whois','stann','ko','아카이브 검색: STANN','header',NULL,0),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','[DB 검색 중...]','progress',NULL,1),
('00000000-0000-0000-0000-000000000001','whois','stann','ko',' ','output',NULL,2),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','엔티티 식별: STANN LUMO','success',NULL,3),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','역할: 시스템 아키텍트 / 최면 코어(Hypnotic Core)','success',NULL,4),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','상태: [활성화 (ACTIVE)]','output',NULL,5),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','데이터 로그:','system',NULL,6),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','- 베이스 좌표: 서울. 원초적인 사운드와 고강도 에너지(High-Intensity)를 출력함.','output',NULL,7),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','- 본능적인 리듬과 딥 믹싱으로 이질적인(Otherworldly) 대기 상태를 렌더링함.','output',NULL,8),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','- 전통적 테크노의 파라미터를 확장하여 압도적인 몰입감(Immersion)을 생성.','output',NULL,9),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','- 현재 소속 노드: 클럽 파우스트(Faust, Seoul) 레지던트 오퍼레이터.','output',NULL,10),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','- Soundcloud: https://soundcloud.com/stannlumo','link','https://soundcloud.com/stannlumo',11),
('00000000-0000-0000-0000-000000000001','whois','stann','ko','','output',NULL,12);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','whois','stann','en','ARCHIVE SEARCH: STANN','header',NULL,0),
('00000000-0000-0000-0000-000000000001','whois','stann','en','[SEARCHING DB...]','progress',NULL,1),
('00000000-0000-0000-0000-000000000001','whois','stann','en',' ','output',NULL,2),
('00000000-0000-0000-0000-000000000001','whois','stann','en','ENTITY: STANN LUMO','success',NULL,3),
('00000000-0000-0000-0000-000000000001','whois','stann','en','ROLE: System Architect / Hypnotic Core','success',NULL,4),
('00000000-0000-0000-0000-000000000001','whois','stann','en','STATUS: [ACTIVE]','output',NULL,5),
('00000000-0000-0000-0000-000000000001','whois','stann','en','DATA_LOG:','system',NULL,6),
('00000000-0000-0000-0000-000000000001','whois','stann','en','- Base Coordinates: Seoul. Outputs primal sound and high-intensity energy.','output',NULL,7),
('00000000-0000-0000-0000-000000000001','whois','stann','en','- Renders otherworldly atmospheres via instinctive rhythm and deep mixing.','output',NULL,8),
('00000000-0000-0000-0000-000000000001','whois','stann','en','- Expands traditional techno parameters to generate powerful immersion.','output',NULL,9),
('00000000-0000-0000-0000-000000000001','whois','stann','en','- Current Assigned Node: Resident Operator at Faust (Seoul).','output',NULL,10),
('00000000-0000-0000-0000-000000000001','whois','stann','en','- Soundcloud: https://soundcloud.com/stannlumo','link','https://soundcloud.com/stannlumo',11),
('00000000-0000-0000-0000-000000000001','whois','stann','en','','output',NULL,12);

-- ── whois: marcus (이벤트 종속) ───────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','아카이브 검색: MARCUS L','header',NULL,0),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','[DB 검색 중...]','progress',NULL,1),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko',' ','output',NULL,2),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','엔티티 식별: MARCUS L','success',NULL,3),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','역할: 섹터 네비게이터 / 로컬 네트워크 코어','success',NULL,4),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','상태: [활성화 (ACTIVE)]','output',NULL,5),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','데이터 로그:','system',NULL,6),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','- 베이스 좌표: 서울. 과거(Legacy)와 미래(Futuristic)의 프로토콜을 교차하는 고출력 에너지를 발산함.','output',NULL,7),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','- 로컬 씬의 아키텍처를 확장하고 문화를 주도하는 핵심 인프라.','output',NULL,8),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','- 출력 주파수 대역: 딥 테크노, 인더스트리얼, 트랜스, 90s 클래식.','output',NULL,9),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','- 글로벌 라우팅 이력: 영국(UK), 베를린(Berlin).','output',NULL,10),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','- 2014년 서브 네트워크 ''@Ameniia'' 및 ''Kammer Radio & Records'' 구축.','output',NULL,11),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','- 아시아 주요 거점 노드 ''클럽 파우스트(Faust)''의 소유자(Superuser)로, 댄스 뮤직의 미래 비전을 전 세계로 전송 중.','output',NULL,12),
('00000000-0000-0000-0000-000000000001','whois','marcus','ko','','output',NULL,13);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','whois','marcus','en','ARCHIVE SEARCH: MARCUS L','header',NULL,0),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','[SEARCHING DB...]','progress',NULL,1),
('00000000-0000-0000-0000-000000000001','whois','marcus','en',' ','output',NULL,2),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','ENTITY: MARCUS L','success',NULL,3),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','ROLE: Sector Navigator / Local Network Core','success',NULL,4),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','STATUS: [ACTIVE]','output',NULL,5),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','DATA_LOG:','system',NULL,6),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','- Base Coordinates: Seoul. Outputs high-yield energy bridging legacy protocols and futuristic concepts.','output',NULL,7),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','- Core infrastructure expanding the local network architecture and cultural topology.','output',NULL,8),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','- Frequency Output Spectrum: Deep Techno, Industrial, Trance, 90s Classics.','output',NULL,9),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','- Global Routing History: UK, Berlin.','output',NULL,10),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','- Initialized sub-networks ''@Ameniia'' and ''Kammer Radio & Records'' in 2014.','output',NULL,11),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','- Superuser and proprietor of Node ''FAUST'', providing a crucial platform for worldwide data transfer.','output',NULL,12),
('00000000-0000-0000-0000-000000000001','whois','marcus','en','','output',NULL,13);

-- ── whois: nusnoom (이벤트 종속) ──────────────────────────────
INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','아카이브 검색: NUSNOOM','header',NULL,0),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','[DB 검색 중...]','progress',NULL,1),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko',' ','output',NULL,2),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','엔티티 식별: NUSNOOM','success',NULL,3),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','역할: 주파수 및 대기 상태 제어 (Atmosphere Control)','success',NULL,4),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','상태: [활성화 (ACTIVE)]','output',NULL,5),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','데이터 로그:','system',NULL,6),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','- 베이스 좌표: 서울. 현재 소속 노드: 클럽 파우스트(Faust) 레지던트 오퍼레이터.','output',NULL,7),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','- 고속 연산 비트(Fast-paced beats)에 자연의 파형(Organic Waveforms)과 아프리칸 타악기 데이터를 병합하여 최면적인 루프 생성.','output',NULL,8),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','- 접속된 노드(관객)들을 소리가 유기체(Living matter)로 변환되는 시뮬레이션 환경으로 동기화시킴.','output',NULL,9),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','- 타이베이 폰샵(Pawnshop) 노드 4주년 프로토콜에서 독자적인 사운드 시그니처를 성공적으로 전송함.','output',NULL,10),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','- 베를린의 전설적인 메인프레임 ''Tresor''에 Faust 시스템과 함께 접속하여 글로벌 네트워크 평판을 확립.','output',NULL,11),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','ko','','output',NULL,12);

INSERT INTO terminal_lines (event_id,category,sub_key,lang,line_text,line_type,url,sort_order) VALUES
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','ARCHIVE SEARCH: NUSNOOM','header',NULL,0),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','[SEARCHING DB...]','progress',NULL,1),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en',' ','output',NULL,2),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','ENTITY: NUSNOOM','success',NULL,3),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','ROLE: Frequency & Atmosphere Control','success',NULL,4),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','STATUS: [ACTIVE]','output',NULL,5),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','DATA_LOG:','system',NULL,6),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','- Base Coordinates: Seoul. Current Assigned Node: Resident Operator at Faust.','output',NULL,7),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','- Merges high-velocity processing with organic waveforms and percussive data to generate hypnotic loops.','output',NULL,8),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','- Renders an untamed, simulated terrain where sound transforms into living matter.','output',NULL,9),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','- Executed cross-server protocol at Pawnshop (Taipei) 4th Anniversary, expanding network reach.','output',NULL,10),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','- Logged a major milestone at legacy mainframe ''Tresor'' (Berlin) alongside the FAUST system, solidifying global status.','output',NULL,11),
('00000000-0000-0000-0000-000000000001','whois','nusnoom','en','','output',NULL,12);
