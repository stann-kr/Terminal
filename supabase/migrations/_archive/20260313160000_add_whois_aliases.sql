-- ============================================================
-- Phase 3-2: terminal_texts.aliases 컬럼 추가 (WHOIS 동적 별칭 지원)
-- ============================================================

-- 1. aliases text[] 컬럼 추가
--    whois 카테고리 행에 사용자 입력 별칭 배열 저장 (예: ['stannlumo', 'stann-lumo'])
--    신규 아티스트 추가 시 코드 수정 없이 DB에서 별칭 관리 가능
ALTER TABLE terminal_texts
  ADD COLUMN IF NOT EXISTS aliases text[];

-- 2. 기존 whois 행에 초기 별칭 데이터 삽입
UPDATE terminal_texts
SET aliases = ARRAY['stannlumo', 'stann-lumo']
WHERE category = 'whois' AND sub_key = 'stann';

UPDATE terminal_texts
SET aliases = ARRAY['marcusl', 'marcus-l']
WHERE category = 'whois' AND sub_key = 'marcus';

UPDATE terminal_texts
SET aliases = ARRAY['nusnoom']
WHERE category = 'whois' AND sub_key = 'nusnoom';
