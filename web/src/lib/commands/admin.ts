import { COMMAND_TEXTS } from "../texts";
import type { CommandHandler, ContentItem, I18nContentItem } from "../types";
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

  if (sub === "event") {
    if (sub2 === "list") {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("id, slug, title, status, date")
          .order("date", { ascending: false });
        if (error) throw error;
        return parseContent(COMMAND_TEXTS.adminEventList(data || []), lang);
      } catch (err) {
        console.error("ADMIN_EVENT_LIST_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }
    if (sub2 === "activate") {
      const targetSlug = args[2];
      if (!targetSlug) return parseContent(COMMAND_TEXTS.adminError, lang);
      try {
        await supabase
          .from("events")
          .update({ status: "archived" })
          .eq("status", "active");
        const { error } = await supabase
          .from("events")
          .update({ status: "active" })
          .eq("slug", targetSlug);
        if (error) throw error;
        return parseContent(COMMAND_TEXTS.adminEventActivated, lang);
      } catch (err) {
        console.error("ADMIN_EVENT_ACTIVATE_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }
    if (sub2 === "clone") {
      const srcSlug = args[2];
      const newSlug = args[3];
      const newTitleArgs = args.slice(4).join(" ").trim();
      if (!srcSlug || !newSlug)
        return parseContent(COMMAND_TEXTS.adminError, lang);
      try {
        const { data: srcEvent } = await supabase
          .from("events")
          .select()
          .eq("slug", srcSlug)
          .single();
        if (!srcEvent) return parseContent(COMMAND_TEXTS.adminError, lang);

        let { data: newEvent } = await supabase
          .from("events")
          .select()
          .eq("slug", newSlug)
          .maybeSingle();

        if (!newEvent) {
          const newTitle = newTitleArgs || `${srcEvent.title} (Clone)`;
          const { data: inserted, error: insertErr } = await supabase
            .from("events")
            .insert({
              slug: newSlug,
              title: newTitle,
              date: srcEvent.date,
              venue: srcEvent.venue,
              status: "upcoming",
              metadata: srcEvent.metadata,
            })
            .select()
            .single();
          if (insertErr) throw insertErr;
          newEvent = inserted;
        }

        const { data: texts } = await supabase
          .from("terminal_texts")
          .select()
          .eq("event_id", srcEvent.id);

        if (texts && texts.length > 0) {
          const newTexts = texts.map((t) => ({
            event_id: newEvent.id,
            category: t.category,
            sub_key: t.sub_key,
            description: t.description,
            content_ko: t.content_ko,
            content_en: t.content_en,
            sort_order: t.sort_order,
          }));
          const { error: txtErr } = await supabase
            .from("terminal_texts")
            .insert(newTexts);
          if (txtErr) throw txtErr;
        }

        return parseContent(COMMAND_TEXTS.adminEventCloned, lang);
      } catch (err) {
        console.error("ADMIN_EVENT_CLONE_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }
  }

  if (sub === "text") {
    if (sub2 === "list") {
      const showAll = args[2] === "all";
      try {
        let query = supabase
          .from("terminal_texts")
          .select("category, description, sub_key")
          .order("category");
        if (!showAll) {
          const { data: activeEvent } = await supabase
            .from("events")
            .select("id")
            .eq("status", "active")
            .maybeSingle();
          if (activeEvent) {
            query = query.eq("event_id", activeEvent.id);
          }
        }
        const { data, error } = await query;
        if (error) throw error;
        return parseContent(COMMAND_TEXTS.adminTextList(data || []), lang);
      } catch (err) {
        console.error("ADMIN_TEXT_LIST_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }
    if (sub2 === "preview") {
      const cat = args[2];
      const subKey = args[3];
      if (!cat) return parseContent(COMMAND_TEXTS.adminError, lang);
      try {
        let query = supabase
          .from("terminal_texts")
          .select("content_ko, content_en, event_id")
          .eq("category", cat);
        if (subKey) {
          query = query.eq("sub_key", subKey);
        } else {
          query = query.is("sub_key", null);
        }
        const { data: activeEvent } = await supabase
          .from("events")
          .select("id")
          .eq("status", "active")
          .maybeSingle();
        if (activeEvent) {
          query = query.or(`event_id.is.null,event_id.eq.${activeEvent.id}`);
        } else {
          query = query.is("event_id", null);
        }
        const { data, error } = await query;
        if (error || !data || data.length === 0)
          return parseContent(COMMAND_TEXTS.adminError, lang);

        let txt = data[0];
        if (data.length > 1) {
          const eventTxt = data.find((d) => d.event_id !== null);
          if (eventTxt) txt = eventTxt;
        }

        const content = lang === "ko" ? txt.content_ko : txt.content_en;

        const contentItems = Array.isArray(content) ? (content as ContentItem[]) : [];
        const previewItem: I18nContentItem = {
          ko: [
            [`[ PREVIEW ] TEXT: ${cat} ${subKey || ""}`.trim(), "header"],
            ...contentItems,
            ["", "output"],
          ],
          en: [
            [`[ PREVIEW ] TEXT: ${cat} ${subKey || ""}`.trim(), "header"],
            ...contentItems,
            ["", "output"],
          ],
        };
        return parseContent(previewItem, lang);
      } catch (err) {
        console.error("ADMIN_TEXT_PREVIEW_FAILED:", err);
        return parseContent(COMMAND_TEXTS.adminError, lang);
      }
    }
  }

  if (sub === "cache" && sub2 === "reload") {
    try {
      const { textService } = await import("../services/text-service");
      await textService.reinitialize();
      return parseContent(COMMAND_TEXTS.adminCacheReloaded, lang);
    } catch (err) {
      console.error("ADMIN_CACHE_RELOAD_FAILED:", err);
      return parseContent(COMMAND_TEXTS.adminError, lang);
    }
  }

  return parseContent(COMMAND_TEXTS.commandNotFound("admin"), lang);
};
