import { useCallback, useRef } from "react";
import type { LanguageType, TerminalLine } from "@/lib/types";
import { processCommand, uid } from "@/lib/commands/index";
import { supabase } from "@/lib/supabase";

export function useCommandExecution(
  language: LanguageType | null,
  isLiveMode: boolean,
  activeSessionId: string | null,
  setHistory: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
  typeOutLines: (lines: TerminalLine[]) => Promise<void>,
  setCommandHistory: React.Dispatch<React.SetStateAction<string[]>>,
  setHistoryIndex: (idx: number) => void,
  scrollToBottom: () => void,
  enterLiveMode: (sessionId: string) => void,
  leaveLiveMode: () => void,
  setQuickCmdContext: React.Dispatch<React.SetStateAction<string | null>>,
  handleLanguageSelection: (lang: LanguageType) => void,
  isAnimatingRef: React.MutableRefObject<boolean>,
) {
  const pendingFlowRef = useRef<string | null>(null);

  const handleCommand = useCallback(
    async (cmd: string) => {
      const trimmedCmd = cmd.trim();
      if (!trimmedCmd) return;

      setCommandHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);

      // 언어 미선택 상태: "1" → EN, "2" → KO 즉시 처리
      if (language === null) {
        if (trimmedCmd === "1" || trimmedCmd === "2") {
          setHistory((prev) => [
            ...prev,
            { id: `in-${uid()}`, text: `> ${trimmedCmd}`, type: "input" },
          ]);
          handleLanguageSelection(trimmedCmd === "1" ? "en" : "ko");
          scrollToBottom();
          return;
        }
        // 언어 미선택 상태에서 다른 명령어 입력 시 안내
        setHistory((prev) => [
          ...prev,
          { id: `in-${uid()}`, text: `> ${trimmedCmd}`, type: "input" },
          { id: `lang-err-${uid()}`, text: "[ SYS ] Select language first: type 1 (EN) or 2 (KO)", type: "system" },
        ]);
        scrollToBottom();
        return;
      }

      if (isLiveMode && activeSessionId) {
        if (trimmedCmd === "/leave") {
          leaveLiveMode();
          setHistory((prev) => [
            ...prev,
            { id: `in-${uid()}`, text: `> ${trimmedCmd}`, type: "input" },
            {
              id: `live-exit-${uid()}`,
              text: "[ LIVE CHANNEL DISCONNECTED ]",
              type: "system",
            },
            { id: `div-${uid()}`, text: "", type: "divider" },
          ]);
          scrollToBottom();
          setQuickCmdContext("live-choice");
        } else {
          setHistory((prev) => [
            ...prev,
            { id: `in-${uid()}`, text: `> ${trimmedCmd}`, type: "input" },
          ]);
          scrollToBottom();

          let nodeName = "unknown";
          let nodeId = "unknown";
          if (typeof window !== "undefined") {
            nodeName =
              localStorage.getItem("terminal_name") ||
              localStorage.getItem("terminal_node_id") ||
              "unknown";
            nodeId = localStorage.getItem("terminal_node_id") || "unknown";
          }
          try {
            const { error } = await supabase.from("live_messages").insert({
              session_id: activeSessionId,
              nick: nodeName,
              message: trimmedCmd,
              device_id: nodeId,
              user_agent: navigator.userAgent,
            });
            if (error) {
              setHistory((prev) => [
                ...prev,
                {
                  id: `err-${uid()}`,
                  text:
                    error.code === "429"
                      ? "[ SYS ] Too fast. Please wait."
                      : "[ ERROR ] Message failed.",
                  type: "error",
                },
              ]);
            }
          } catch {
            setHistory((prev) => [
              ...prev,
              {
                id: `err-${uid()}`,
                text: "[ ERROR ] Network error.",
                type: "error",
              },
            ]);
          }
        }
        return;
      }

      setHistory((prev) => [
        ...prev,
        { id: `in-${uid()}`, text: `> ${trimmedCmd}`, type: "input" },
      ]);
      scrollToBottom();

      const result = await processCommand(trimmedCmd, language || "en");

      if (result.shouldClear) {
        setHistory([]);
      } else if (result.lines.length > 0) {
        await typeOutLines(result.lines);
      }

      if (result.action) {
        if (result.action.type === "ENTER_LIVE") {
          enterLiveMode(result.action.sessionId);
        } else if (result.action.type === "LIVE_NO_NAME_CHOICE") {
          setQuickCmdContext("live-choice");
        } else if (result.action.type === "CHANGE_LANG") {
          handleLanguageSelection(result.action.payload);
        } else if (result.action.type === "CHANGE_THEME") {
          if (typeof window !== "undefined") {
            localStorage.setItem("terminal_theme", result.action.payload);
            document.documentElement.setAttribute(
              "data-theme",
              result.action.payload,
            );
          }
        } else if (result.action.type === "RESET") {
          if (typeof window !== "undefined") {
            localStorage.removeItem("terminal_lang");
            localStorage.removeItem("terminal_theme");
            localStorage.removeItem("terminal_user_type");
            window.location.reload();
          }
        }
      }

      if (cmd.startsWith("name ") && pendingFlowRef.current) {
        const flow = pendingFlowRef.current;
        pendingFlowRef.current = null;
        if (flow === "live") {
          handleCommand("live --node");
        } else if (flow === "transmit") {
          setQuickCmdContext("transmit");
        }
      }

      scrollToBottom();
    },
    [
      language,
      isLiveMode,
      activeSessionId,
      setHistory,
      typeOutLines,
      setCommandHistory,
      setHistoryIndex,
      scrollToBottom,
      enterLiveMode,
      leaveLiveMode,
      setQuickCmdContext,
      handleLanguageSelection,
      isAnimatingRef,
    ],
  );

  return { handleCommand, pendingFlowRef };
}
