import { COMMAND_TEXTS } from "../texts";
import type { CommandHandler } from "../types";
import { parseContent } from "../utils";
import { supabase } from "../supabase";

export const admin: CommandHandler = async (args, lang) => {
  const adminEmail =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_KEY;

  if (typeof window === "undefined") {
    return parseContent(COMMAND_TEXTS.adminDenied, lang);
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAuthenticated =
    !!session || localStorage.getItem("terminal_admin") === "true";

  const sub = args[0]?.toLowerCase();

  if (sub === "login") {
    const password = args[1];
    if (!adminEmail || !password) {
      console.error("ADMIN_AUTH_ERROR: Missing email or password");
      return parseContent(COMMAND_TEXTS.adminError, lang);
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password,
      });
      if (error) throw error;

      localStorage.setItem("terminal_admin", "true");
      return parseContent(COMMAND_TEXTS.adminLoginSuccess, lang);
    } catch (err) {
      console.error("ADMIN_LOGIN_FAILED:", err);
      return parseContent(COMMAND_TEXTS.adminLoginFail, lang);
    }
  }

  if (sub === "logout") {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("terminal_admin");
      return parseContent(COMMAND_TEXTS.adminLogoutSuccess, lang);
    } catch (err) {
      console.error("ADMIN_LOGOUT_FAILED:", err);
      return parseContent(COMMAND_TEXTS.adminError, lang);
    }
  }

  if (!isAuthenticated) {
    if (args.length === 0) {
      return parseContent(COMMAND_TEXTS.adminDenied, lang);
    }
    return parseContent(COMMAND_TEXTS.commandNotFound("admin"), lang);
  }

  if (args.length === 0) {
    return parseContent(COMMAND_TEXTS.adminHelp, lang);
  }

  const sub2 = args[1]?.toLowerCase();

  if (sub === "live") {
    if (sub2 === "open") {
      const name = args.slice(2).join(" ").trim() || "LIVE SESSION";
      try {
        const { error } = await supabase
          .from("live_sessions")
          .insert({ name, is_force_open: true });
        if (error) throw error;
        return parseContent(COMMAND_TEXTS.adminLiveOpened, lang);
      } catch (err) {
        console.error("ADMIN_LIVE_OPEN_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }

    if (sub2 === "add") {
      const timePattern = /^\d{2}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      const addArgs = args.slice(2);
      let startRaw: string | undefined;
      let endRaw: string | undefined;
      let nameArgs: string[];
      if (
        addArgs.length >= 2 &&
        timePattern.test(addArgs[addArgs.length - 1]) &&
        timePattern.test(addArgs[addArgs.length - 2])
      ) {
        endRaw = addArgs[addArgs.length - 1];
        startRaw = addArgs[addArgs.length - 2];
        nameArgs = addArgs.slice(0, addArgs.length - 2);
      } else if (
        addArgs.length >= 1 &&
        timePattern.test(addArgs[addArgs.length - 1])
      ) {
        startRaw = addArgs[addArgs.length - 1];
        nameArgs = addArgs.slice(0, addArgs.length - 1);
      } else {
        nameArgs = addArgs;
      }
      const name = nameArgs.join(" ").trim();
      if (!name || !startRaw)
        return parseContent(COMMAND_TEXTS.adminError, lang);
      const toUtc = (kst: string) =>
        new Date("20" + kst + ":00+09:00").toISOString();
      try {
        const { error } = await supabase.from("live_sessions").insert({
          name,
          is_force_open: false,
          starts_at: toUtc(startRaw),
          ends_at: endRaw ? toUtc(endRaw) : null,
        });
        if (error) throw error;
        return parseContent(COMMAND_TEXTS.adminLiveScheduled, lang);
      } catch (err) {
        console.error("ADMIN_LIVE_ADD_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }

    if (sub2 === "close") {
      const targetName = args.slice(2).join(" ").trim();
      try {
        let sessionId: string | undefined;
        if (targetName) {
          const { data } = await supabase
            .from("live_sessions")
            .select("id")
            .ilike("name", targetName)
            .is("closed_at", null)
            .limit(1);
          sessionId = data?.[0]?.id;
          if (!sessionId)
            return parseContent(COMMAND_TEXTS.adminLiveNotFound, lang);
        } else {
          const { data } = await supabase
            .from("live_sessions")
            .select("id")
            .eq("is_force_open", true)
            .is("closed_at", null)
            .limit(1);
          sessionId = data?.[0]?.id;
          if (!sessionId) return parseContent(COMMAND_TEXTS.adminError, lang);
        }
        const { error } = await supabase
          .from("live_sessions")
          .update({
            closed_at: new Date().toISOString(),
            is_force_open: false,
          })
          .eq("id", sessionId);
        if (error) throw error;
        return parseContent(COMMAND_TEXTS.adminLiveClosed, lang);
      } catch (err) {
        console.error("ADMIN_LIVE_CLOSE_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }

    if (sub2 === "delete") {
      const targetName = args.slice(2).join(" ").trim();
      if (!targetName) return parseContent(COMMAND_TEXTS.adminError, lang);
      try {
        const { data } = await supabase
          .from("live_sessions")
          .select("id")
          .ilike("name", targetName)
          .is("closed_at", null)
          .limit(1);
        const sessionId = data?.[0]?.id;
        if (!sessionId)
          return parseContent(COMMAND_TEXTS.adminLiveNotFound, lang);
        const { error } = await supabase
          .from("live_sessions")
          .delete()
          .eq("id", sessionId);
        if (error) throw error;
        return parseContent(COMMAND_TEXTS.adminLiveDeleted, lang);
      } catch (err) {
        console.error("ADMIN_LIVE_DELETE_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }

    if (sub2 === "status") {
      try {
        const { data, error } = await supabase
          .from("live_sessions")
          .select("id, name, is_force_open, starts_at, ends_at, closed_at")
          .order("created_at", { ascending: false })
          .limit(20);
        if (error) throw error;
        return parseContent(COMMAND_TEXTS.adminSessionStatus(data || []), lang);
      } catch (err) {
        console.error("ADMIN_LIVE_STATUS_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }

    if (sub2 === "clear") {
      try {
        const { data: active } = await supabase
          .from("live_sessions")
          .select("id")
          .is("closed_at", null)
          .order("is_force_open", { ascending: false })
          .limit(1);
        if (!active?.[0]) return parseContent(COMMAND_TEXTS.adminError, lang);
        const { error } = await supabase
          .from("live_messages")
          .delete()
          .eq("session_id", active[0].id);
        if (error) throw error;
        return parseContent(COMMAND_TEXTS.adminLiveCleared, lang);
      } catch (err) {
        console.error("ADMIN_LIVE_CLEAR_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }
  }

  if (sub === "ann") {
    const msg = args.slice(1).join(" ").trim();
    if (sub2 === "clear") {
      try {
        const { error } = await supabase
          .from("app_config")
          .update({ value: "" })
          .eq("key", "announcement");
        if (error) throw error;
        return parseContent(COMMAND_TEXTS.adminAnnCleared, lang);
      } catch (err) {
        console.error("ADMIN_ANN_CLEAR_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }
    if (!msg) return parseContent(COMMAND_TEXTS.adminError, lang);
    try {
      const { error } = await supabase
        .from("app_config")
        .update({ value: msg })
        .eq("key", "announcement");
      if (error) throw error;
      return parseContent(COMMAND_TEXTS.adminAnnSent, lang);
    } catch (err) {
      console.error("ADMIN_ANN_SEND_FAILED:", err);
      return parseContent(COMMAND_TEXTS.adminError, lang);
    }
  }

  return parseContent(COMMAND_TEXTS.commandNotFound("admin"), lang);
};
