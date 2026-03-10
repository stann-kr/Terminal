/**
 * 폴백 텍스트 — Supabase DB 연결 실패 시 사용.
 * 기존 static.ts / boot.ts의 하드코딩 데이터를 보존.
 */
import {
  help,
  commands,
  about,
  lineup,
  voyage,
  gate,
  event,
  link,
  ping,
  weather,
  matrix,
  history,
  historyAdmin,
} from "./static";
import {
  bootSequence,
  wakeSequence,
  welcomeMessage,
  resumeMessage,
} from "./boot";

export const fallback = {
  help,
  commands,
  about,
  lineup,
  voyage,
  gate,
  event,
  link,
  ping,
  weather,
  matrix,
  history,
  historyAdmin,
  boot: bootSequence,
  wake: wakeSequence,
  welcome: welcomeMessage,
  resume: resumeMessage,
};
