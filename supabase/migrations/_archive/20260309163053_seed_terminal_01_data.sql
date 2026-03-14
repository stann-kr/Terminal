-- ============================================================
-- TERMINAL [01]: 이벤트 및 텍스트 시드 데이터
-- ============================================================

-- 1. events 테이블 — TERMINAL [01] 이벤트 삽입
INSERT INTO events (id, slug, title, subtitle, date, venue, genre, bpm)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'terminal-01',
  'TERMINAL [01] : BOOT SEQUENCE',
  'Maiden Voyage to the Unknown Sector.',
  '2026-03-07T14:00:00Z',  -- 23:00 KST = 14:00 UTC
  'Faust, Seoul',
  'Hypnotic, Futuristic Techno',
  '138.00 BPM'
);

-- 2. app_config — 활성 이벤트 ID 등록
UPDATE app_config SET value = '00000000-0000-0000-0000-000000000001' WHERE key = 'active_event_id';

-- ============================================================
-- 정적 텍스트 (event_id IS NULL)
-- ============================================================

-- about
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'about', NULL,
  '[
    ["TERMINAL — PLATFORM OVERVIEW", "header"],
    "TERMINAL은 오디오 신호와 데이터가 교차하는 무기질적인 정거장을 설계하는",
    "서울 기반의 테크노 플랫폼입니다.",
    " ",
    "[ DESIGN PRINCIPLE ]",
    "불필요한 시각적 장식을 덜어내고, 정교하게 통제된 환경을 구축하는 데 집중합니다.",
    "오직 텍스트와 필수적인 빛으로만 공간을 렌더링하는",
    "CLI(Command Line Interface) 시스템처럼, 가장 본질적이고 미니멀한 형태를 지향합니다.",
    " ",
    "[ AUDIO ENGINE ]",
    "초기 미래주의(Early Futurism)의 원초적 질감을 담은",
    "최면적이고 미래지향적인(Hypnotic & Futuristic) 테크노.",
    " ",
    "[ OBJECTIVE ]",
    "TERMINAL은 단순한 관람객을 위한 무대를 구축하지 않습니다.",
    "이곳에 접속한 모든 객체가 개별 노드(Node)로서 시스템 연산에 참여하고,",
    "미지의 궤도를 함께 탐색하는 완전한 동기화를 목표로 합니다.",
    " ",
    "터미널 아키텍트 : STANN LUMO",
    ""
  ]'::jsonb,
  '[
    ["TERMINAL — PLATFORM OVERVIEW", "header"],
    "TERMINAL is a Seoul-based techno platform designing an industrial station",
    "where audio signals and data intersect.",
    " ",
    "[ DESIGN PRINCIPLE ]",
    "Stripping away non-essential visual elements, we focus on constructing",
    "a precisely controlled environment. Much like a CLI (Command Line Interface)",
    "rendered only by essential light and text, we aim for the pure, minimal",
    "essence of the space.",
    " ",
    "[ AUDIO ENGINE ]",
    "Hypnotic and futuristic techno, heavily influenced by the raw textures",
    "of early futurism.",
    " ",
    "[ OBJECTIVE ]",
    "TERMINAL does not build stages for mere spectators. Our objective is total",
    "synchronization — where every logged-in entity becomes an active node,",
    "participating in the system''s calculation to explore uncharted",
    "trajectories together.",
    " ",
    "TERMINAL ARCHITECT : STANN LUMO",
    ""
  ]'::jsonb,
  0);

-- voyage
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'voyage', NULL,
  '[
    ["VOYAGE LOG — TERMINAL", "header"],
    "TERMINAL의 항해는 계속된다.",
    " ",
    "각 시퀀스는 새로운 좌표를 설정한다.",
    "우리는 접속된 모든 노드와 함께 미지의 궤도를 탐색하며,",
    "매 이터레이션마다 시스템을 확장하고 새로운 섹터를 개척한다.",
    " ",
    "오디오 신호는 정거장을 이동하고, 데이터는 교차하며,",
    "플랫폼은 멈추지 않는다.",
    " ",
    ["이것이 TERMINAL의 영구적인 디렉티브다.", "system"],
    ["경고: 장시간 연속되는 루프(Hypnotic Loop)는 인지 감각을 왜곡할 수 있습니다.", "error"],
    ""
  ]'::jsonb,
  '[
    ["VOYAGE LOG — TERMINAL", "header"],
    "The voyage of TERMINAL continues.",
    " ",
    "Each sequence sets new coordinates.",
    "We navigate uncharted trajectories with every connected node,",
    "expanding the system and pioneering new sectors with each iteration.",
    " ",
    "Audio signals traverse stations, data intersects,",
    "and the platform never stops.",
    " ",
    ["This is the permanent directive of TERMINAL.", "system"],
    ["Warning: Prolonged continuous loops (Hypnotic Loops) may distort cognitive senses.", "error"],
    ""
  ]'::jsonb,
  0);

-- help
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'help', NULL,
  '[
    ["터미널 코어 인덱스", "header"],
    "about    — 시스템 개요 및 운영 목적",
    "lineup   — 참가 객체(아티스트) 라인업 조회",
    "gate     — 접속 게이트 좌표 및 일정 (일시/장소)",
    "whois    — 시스템 아카이브 검색 (예: whois stann)",
    "transmit  — 시스템 통신망(방명록) 조회 및 전송",
    "live     — 이벤트 실시간 채팅 채널 접속",
    "link     — 외부 데이터 네트워크 연결",
    "status   — 현재 세션 가동 로그",
    "settings — 시스템 언어 및 로컬 환경 설정",
    "",
    ["전체 명령어 목록을 보려면 ''commands''를 입력하세요.", "system"],
    ""
  ]'::jsonb,
  '[
    ["TERMINAL CORE INDEX", "header"],
    "about    — Project overview and purpose",
    "lineup   — Artist lineup inquiry",
    "gate     — Date & Venue",
    "whois    — System archive search (ex. whois stann)",
    "transmit  — View and transmit messages",
    "live     — Live event channel",
    "link     — External directories",
    "status   — System operation logs",
    "settings — Language & environment settings",
    "",
    ["Type ''commands'' to see all available system commands.", "system"],
    ""
  ]'::jsonb,
  0);

-- commands
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'commands', NULL,
  '[
    ["전체 시스템 명령어 매니페스트", "header"],
    ["[ 시스템 코어 ]", "system"],
    "about, help, commands, status, settings, systems, voyage, clear",
    ["[ 데이터 아카이브 ]", "system"],
    "lineup, gate, event, link, whoami, whois, transmit, live, name",
    ["[ 유틸리티 & 보안 ]", "system"],
    "date, time, echo, history, sudo",
    ["[ 시스템 진단 ]", "system"],
    "ping, scan, weather, matrix",
    ""
  ]'::jsonb,
  '[
    ["ALL SYSTEM COMMAND MANIFEST", "header"],
    ["[ SYSTEM CORE ]", "system"],
    "about, help, commands, status, settings, systems, voyage, clear",
    ["[ DATA ARCHIVE ]", "system"],
    "lineup, gate, event, link, whoami, whois, transmit, live, name",
    ["[ UTILITIES & SECURITY ]", "system"],
    "date, time, echo, history, sudo",
    ["[ DIAGNOSTICS ]", "system"],
    "ping, scan, weather, matrix",
    ""
  ]'::jsonb,
  0);

-- ping
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'ping', NULL,
  '[
    ["[ PING ] 메인 오디오 서버 응답 대기 중...", "progress"],
    "응답 시간: 14ms",
    ["모든 패킷 스트림 정상 수신 확인 완료.", "success"],
    ""
  ]'::jsonb,
  '[
    ["[ PING ] Waiting for main audio server response...", "progress"],
    "Response time: 14ms",
    ["All packet streams received correctly.", "success"],
    ""
  ]'::jsonb,
  0);

-- weather
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'weather', NULL,
  '[
    ["[ 환경 데이터 스캔 중... ]", "progress"],
    ["경고: 미확인 오디오 신호가 감지되었습니다.", "error"],
    "시스템 출력이 불안정해질 수 있습니다.",
    "안전한 수준으로 볼륨 조절하고 시스템 청각 보호 모드를 발동하십시오.",
    ""
  ]'::jsonb,
  '[
    ["[ SCANNING ENVIRONMENT... ]", "progress"],
    ["WARNING: Unidentified audio signal detected.", "error"],
    "System output may become unstable.",
    "Adjust volume to a safe level and activate auditory protection.",
    ""
  ]'::jsonb,
  0);

-- matrix
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'matrix', NULL,
  '[
    "파란 약을 먹으면 여기서 끝난다. 침대에서 깨어나 네가 믿고 싶은 걸 믿게 되겠지.",
    "빨간 약을 먹으면 원더랜드에 남아 토끼굴이 얼마나 깊은지 보여주겠다.",
    ["선택은 너의 몫이다.", "system"],
    ""
  ]'::jsonb,
  '[
    "You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe.",
    "You take the red pill - you stay in Wonderland and I show you how deep the rabbit-hole goes.",
    ["The choice is yours.", "system"],
    ""
  ]'::jsonb,
  0);

-- history
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'history', NULL,
  '[
    ["[ ERROR ] 접근 권한이 부족합니다.", "header"],
    ["보안 수준 LEVEL 2 이상의 인가된 마스터 노드만 열람할 수 있습니다.", "error"],
    ""
  ]'::jsonb,
  '[
    ["[ ERROR ] INSUFFICIENT CLEARANCE.", "header"],
    ["Only authorized master nodes with security LEVEL 2 or higher may access.", "error"],
    ""
  ]'::jsonb,
  0);

-- historyAdmin
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'historyAdmin', NULL,
  '[
    ["[ 시스템 로그 — 관리자 접근 허용됨 ]", "header"],
    ["ADMIN CLEARANCE: 세션 기록 열람 권한이 확인되었습니다.", "success"],
    ["보안 수준 LEVEL 5 — 접근 허가.", "success"],
    ["세션 기록은 클라이언트 메모리에만 저장됩니다. 브라우저를 닫으면 소멸합니다.", "system"],
    ""
  ]'::jsonb,
  '[
    ["[ SYSTEM LOG — ADMIN ACCESS GRANTED ]", "header"],
    ["ADMIN CLEARANCE: Session log access confirmed.", "success"],
    ["SECURITY LEVEL 5 — ACCESS PERMITTED.", "success"],
    ["Session history is stored in client memory only. Cleared on browser close.", "system"],
    ""
  ]'::jsonb,
  0);

-- welcome (boot.ts)
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'welcome', NULL,
  '[
    ["TERMINAL CORE SYSTEM — 터미널 접근이 허가되었습니다", "success"],
    ["''event''로 파티 정보, ''lineup''으로 라인업 조회. ''help''를 입력하면 전체 목록을 확인할 수 있습니다.", "system"],
    ["", "divider"]
  ]'::jsonb,
  '[
    ["TERMINAL CORE SYSTEM — ACCESS GRANTED", "success"],
    ["Type ''event'' for party info, ''lineup'' for artists. Type ''help'' to see all commands.", "system"],
    ["", "divider"]
  ]'::jsonb,
  0);

-- resume (boot.ts)
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
(NULL, 'resume', NULL,
  '[
    ["TERMINAL CORE SYSTEM — 세션이 재개되었습니다", "success"],
    ["''help'' 를 입력하면 사용 가능한 커맨드를 확인할 수 있습니다.", "system"],
    ["", "divider"]
  ]'::jsonb,
  '[
    ["TERMINAL CORE SYSTEM — SESSION RESUMED", "success"],
    ["Type ''help'' to see available commands.", "system"],
    ["", "divider"]
  ]'::jsonb,
  0);

-- ============================================================
-- 이벤트 종속 텍스트 (event_id = TERMINAL [01])
-- ============================================================

-- lineup
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
('00000000-0000-0000-0000-000000000001', 'lineup', NULL,
  '[
    ["AUDIO CONTROLLERS [01]", "header"],
    ["[01]  STANN LUMO", "success"],
    ["[02]  MARCUS L", "success"],
    ["[03]  NUSNOOM", "success"],
    ["────────────────────", "system"],
    "Format: Hypnotic, Futuristic Techno",
    ""
  ]'::jsonb,
  '[
    ["AUDIO CONTROLLERS [01]", "header"],
    ["[01]  STANN LUMO", "success"],
    ["[02]  MARCUS L", "success"],
    ["[03]  NUSNOOM", "success"],
    ["────────────────────", "system"],
    "Format: Hypnotic, Futuristic Techno",
    ""
  ]'::jsonb,
  0);

-- gate
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
('00000000-0000-0000-0000-000000000001', 'gate', NULL,
  '[
    ["접속 게이트 좌표 [01]", "header"],
    ["TERMINAL [01] : BOOT SEQUENCE", "system"],
    ["", "divider"],
    "일  시 : 26-03-07 (토) 23:00 KST",
    "장  소 : Faust, Seoul",
    ["", "divider"],
    "* 시스템 동기화 및 메인 오디오 세션에 접속하십시오.",
    ""
  ]'::jsonb,
  '[
    ["TARGET COORDINATES [01]", "header"],
    ["TERMINAL [01] : BOOT SEQUENCE", "system"],
    ["", "divider"],
    "DATE  : 26-03-07 (SAT) 23:00 KST",
    "VENUE : Faust, Seoul",
    ["", "divider"],
    "* Synchronize system and connect to the main audio session.",
    ""
  ]'::jsonb,
  0);

-- event
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
('00000000-0000-0000-0000-000000000001', 'event', NULL,
  '[
    ["TERMINAL [01] : BOOT SEQUENCE", "header"],
    ["Maiden Voyage to the Unknown Sector.", "system"],
    ["", "divider"],
    "[ LINEUP ]",
    ["  STANN LUMO", "success"],
    ["  MARCUS L", "success"],
    ["  NUSNOOM", "success"],
    " ",
    "[ INFO ]",
    "  DATE  : 26-03-07 (토) 23:00 KST",
    "  VENUE : Faust, Seoul",
    " ",
    "[ ENGINE ]",
    ["  Hypnotic & Futuristic Techno", "success"],
    ["", "divider"],
    ["* 시스템 동기화 준비를 완료하십시오.", "system"],
    ""
  ]'::jsonb,
  '[
    ["TERMINAL [01] : BOOT SEQUENCE", "header"],
    ["Maiden Voyage to the Unknown Sector.", "system"],
    ["", "divider"],
    "[ LINEUP ]",
    ["  STANN LUMO", "success"],
    ["  MARCUS L", "success"],
    ["  NUSNOOM", "success"],
    " ",
    "[ INFO ]",
    "  DATE  : 26-03-07 (SAT) 23:00 KST",
    "  VENUE : Faust, Seoul",
    " ",
    "[ ENGINE ]",
    ["  Hypnotic & Futuristic Techno", "success"],
    ["", "divider"],
    ["* Complete system synchronization and prepare for departure.", "system"],
    ""
  ]'::jsonb,
  0);

-- link
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
('00000000-0000-0000-0000-000000000001', 'link', NULL,
  '[
    ["외부 네트워크 경로", "header"],
    ["* STANN LUMO 접근 (Instagram)", "link", "https://www.instagram.com/stannlumo/"],
    ["* TERMINAL HUB (Instagram)", "link", "https://www.instagram.com/terminal_hub/"],
    ""
  ]'::jsonb,
  '[
    ["EXTERNAL LINKS", "header"],
    ["* Stann Lumo Archive", "link", "https://www.instagram.com/stannlumo/"],
    ["* Terminal Network", "link", "https://www.instagram.com/terminal_hub/"],
    ""
  ]'::jsonb,
  0);

-- boot (BootLine[] → ContentItem[] 형식으로 저장, [{text, type}] 형식)
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
('00000000-0000-0000-0000-000000000001', 'boot', NULL,
  '[
    {"text": "TERMINAL CORE — 시스템 초기 부팅 시작", "type": "system"},
    {"text": "...", "type": "system"},
    {"text": "[ OK ] 커널 코어 모듈 로딩...", "type": "output"},
    {"text": "[ OK ] 로컬 스토리지 마운트 중...", "type": "output"},
    {"text": "[ OK ] 네트워크 라우팅 매트릭스 초기화...", "type": "output"},
    {"text": "[ OK ] 오디오 주파수 대역 보정 중...", "type": "output"},
    {"text": "[ -- ] 세션 매니페스트 스캔...", "type": "system"},
    {"text": "[ OK ] 데이터 로드 완료: 3명의 메인 노드 확인됨.", "type": "output"},
    {"text": "[ -- ] 동기화 게이트 좌표 확인...", "type": "system"},
    {"text": "[ OK ] 게이트: Faust, Seoul / 26-03-07 23:00 KST", "type": "output"},
    {"text": "...", "type": "system"},
    {"text": "", "type": "divider"},
    {"text": "시스템 상태: 정상 가동 (OPERATIONAL)", "type": "success"},
    {"text": "모든 준비가 완료되었습니다. 터미널 제어권을 이양합니다.", "type": "success"},
    {"text": "", "type": "divider"}
  ]'::jsonb,
  '[
    {"text": "TERMINAL CORE — SYSTEM BOOT INITIATED", "type": "system"},
    {"text": "...", "type": "system"},
    {"text": "[ OK ] Loading kernel modules...", "type": "output"},
    {"text": "[ OK ] Mounting local storage...", "type": "output"},
    {"text": "[ OK ] Initializing network routing matrix...", "type": "output"},
    {"text": "[ OK ] Calibrating frequency bands...", "type": "output"},
    {"text": "[ -- ] Scanning session manifest...", "type": "system"},
    {"text": "[ OK ] Nodes loaded: 3 personnel confirmed.", "type": "output"},
    {"text": "[ -- ] Verifying gate coordinates...", "type": "system"},
    {"text": "[ OK ] Gate: Faust, Seoul / 26-03-07 23:00 KST", "type": "output"},
    {"text": "...", "type": "system"},
    {"text": "", "type": "divider"},
    {"text": "STATUS: OPERATIONAL", "type": "success"},
    {"text": "All systems ready. Transferring terminal control.", "type": "success"},
    {"text": "", "type": "divider"}
  ]'::jsonb,
  0);

-- wake
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
('00000000-0000-0000-0000-000000000001', 'wake', NULL,
  '[
    {"text": "[ -- ] 슬립 모드 해제 중...", "type": "system"},
    {"text": "[ OK ] 세션 상태 복원됨.", "type": "output"},
    {"text": "[ OK ] 게이트: Faust, Seoul / 26-03-07 23:00 KST", "type": "output"},
    {"text": "[ OK ] 시스템 재개.", "type": "success"},
    {"text": "", "type": "divider"}
  ]'::jsonb,
  '[
    {"text": "[ -- ] Waking from sleep...", "type": "system"},
    {"text": "[ OK ] Session state restored.", "type": "output"},
    {"text": "[ OK ] Gate: Faust, Seoul / 26-03-07 23:00 KST", "type": "output"},
    {"text": "[ OK ] System resumed.", "type": "success"},
    {"text": "", "type": "divider"}
  ]'::jsonb,
  0);

-- whois — stann
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
('00000000-0000-0000-0000-000000000001', 'whois', 'stann',
  '[
    ["아카이브 검색: STANN", "header"],
    ["[DB 검색 중...]", "progress"],
    " ",
    ["엔티티 식별: STANN LUMO", "success"],
    ["역할: 시스템 아키텍트 / 최면 코어(Hypnotic Core)", "success"],
    "상태: [활성화 (ACTIVE)]",
    ["데이터 로그:", "system"],
    "- 베이스 좌표: 서울. 원초적인 사운드와 고강도 에너지(High-Intensity)를 출력함.",
    "- 본능적인 리듬과 딥 믹싱으로 이질적인(Otherworldly) 대기 상태를 렌더링함.",
    "- 전통적 테크노의 파라미터를 확장하여 압도적인 몰입감(Immersion)을 생성.",
    "- 현재 소속 노드: 클럽 파우스트(Faust, Seoul) 레지던트 오퍼레이터.",
    ["- Soundcloud: https://soundcloud.com/stannlumo", "link", "https://soundcloud.com/stannlumo"],
    ""
  ]'::jsonb,
  '[
    ["ARCHIVE SEARCH: STANN", "header"],
    ["[SEARCHING DB...]", "progress"],
    " ",
    ["ENTITY: STANN LUMO", "success"],
    ["ROLE: System Architect / Hypnotic Core", "success"],
    "STATUS: [ACTIVE]",
    ["DATA_LOG:", "system"],
    "- Base Coordinates: Seoul. Outputs primal sound and high-intensity energy.",
    "- Renders otherworldly atmospheres via instinctive rhythm and deep mixing.",
    "- Expands traditional techno parameters to generate powerful immersion.",
    "- Current Assigned Node: Resident Operator at Faust (Seoul).",
    ["- Soundcloud: https://soundcloud.com/stannlumo", "link", "https://soundcloud.com/stannlumo"],
    ""
  ]'::jsonb,
  0);

-- whois — marcus
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
('00000000-0000-0000-0000-000000000001', 'whois', 'marcus',
  '[
    ["아카이브 검색: MARCUS L", "header"],
    ["[DB 검색 중...]", "progress"],
    " ",
    ["엔티티 식별: MARCUS L", "success"],
    ["역할: 섹터 네비게이터 / 로컬 네트워크 코어", "success"],
    "상태: [활성화 (ACTIVE)]",
    ["데이터 로그:", "system"],
    "- 베이스 좌표: 서울. 과거(Legacy)와 미래(Futuristic)의 프로토콜을 교차하는 고출력 에너지를 발산함.",
    "- 로컬 씬의 아키텍처를 확장하고 문화를 주도하는 핵심 인프라.",
    "- 출력 주파수 대역: 딥 테크노, 인더스트리얼, 트랜스, 90s 클래식.",
    "- 글로벌 라우팅 이력: 영국(UK), 베를린(Berlin).",
    "- 2014년 서브 네트워크 ''@Ameniia'' 및 ''Kammer Radio & Records'' 구축.",
    "- 아시아 주요 거점 노드 ''클럽 파우스트(Faust)''의 소유자(Superuser)로, 댄스 뮤직의 미래 비전을 전 세계로 전송 중.",
    ""
  ]'::jsonb,
  '[
    ["ARCHIVE SEARCH: MARCUS L", "header"],
    ["[SEARCHING DB...]", "progress"],
    " ",
    ["ENTITY: MARCUS L", "success"],
    ["ROLE: Sector Navigator / Local Network Core", "success"],
    "STATUS: [ACTIVE]",
    ["DATA_LOG:", "system"],
    "- Base Coordinates: Seoul. Outputs high-yield energy bridging legacy protocols and futuristic concepts.",
    "- Core infrastructure expanding the local network architecture and cultural topology.",
    "- Frequency Output Spectrum: Deep Techno, Industrial, Trance, 90s Classics.",
    "- Global Routing History: UK, Berlin.",
    "- Initialized sub-networks ''@Ameniia'' and ''Kammer Radio & Records'' in 2014.",
    "- Superuser and proprietor of Node ''FAUST'', providing a crucial platform for worldwide data transfer.",
    ""
  ]'::jsonb,
  0);

-- whois — nusnoom
INSERT INTO terminal_texts (event_id, category, sub_key, content_ko, content_en, sort_order) VALUES
('00000000-0000-0000-0000-000000000001', 'whois', 'nusnoom',
  '[
    ["아카이브 검색: NUSNOOM", "header"],
    ["[DB 검색 중...]", "progress"],
    " ",
    ["엔티티 식별: NUSNOOM", "success"],
    ["역할: 주파수 및 대기 상태 제어 (Atmosphere Control)", "success"],
    "상태: [활성화 (ACTIVE)]",
    ["데이터 로그:", "system"],
    "- 베이스 좌표: 서울. 현재 소속 노드: 클럽 파우스트(Faust) 레지던트 오퍼레이터.",
    "- 고속 연산 비트(Fast-paced beats)에 자연의 파형(Organic Waveforms)과 아프리칸 타악기 데이터를 병합하여 최면적인 루프 생성.",
    "- 접속된 노드(관객)들을 소리가 유기체(Living matter)로 변환되는 시뮬레이션 환경으로 동기화시킴.",
    "- 타이베이 폰샵(Pawnshop) 노드 4주년 프로토콜에서 독자적인 사운드 시그니처를 성공적으로 전송함.",
    "- 베를린의 전설적인 메인프레임 ''Tresor''에 Faust 시스템과 함께 접속하여 글로벌 네트워크 평판을 확립.",
    ""
  ]'::jsonb,
  '[
    ["ARCHIVE SEARCH: NUSNOOM", "header"],
    ["[SEARCHING DB...]", "progress"],
    " ",
    ["ENTITY: NUSNOOM", "success"],
    ["ROLE: Frequency & Atmosphere Control", "success"],
    "STATUS: [ACTIVE]",
    ["DATA_LOG:", "system"],
    "- Base Coordinates: Seoul. Current Assigned Node: Resident Operator at Faust.",
    "- Merges high-velocity processing with organic waveforms and percussive data to generate hypnotic loops.",
    "- Renders an untamed, simulated terrain where sound transforms into living matter.",
    "- Executed cross-server protocol at Pawnshop (Taipei) 4th Anniversary, expanding network reach.",
    "- Logged a major milestone at legacy mainframe ''Tresor'' (Berlin) alongside the FAUST system, solidifying global status.",
    ""
  ]'::jsonb,
  0);
