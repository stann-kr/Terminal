import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabase 클라이언트 인스턴스
 * 터미널 [01]의 방명록(Guestbook) 연동을 위해 사용됩니다.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
