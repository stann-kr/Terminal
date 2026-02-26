import { useState, useRef, useEffect, useCallback } from "react";
import type {
  LanguageType,
  TerminalLine,
  ContentItem,
  BootLine,
} from "@/lib/types";
import { COMMAND_TEXTS } from "@/lib/texts";
import { uid } from "@/lib/commands/index";

export function useBoot(
  setHistory: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
  typeOutLines: (lines: TerminalLine[]) => Promise<void>,
  scrollToBottom: () => void,
  setQuickCmdContext: React.Dispatch<React.SetStateAction<string | null>>,
) {
  const [isBooting, setIsBooting] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [language, setLanguage] = useState<LanguageType | null>(null);
  const hasBootedRef = useRef(false);

  useEffect(() => {
    setIsInitialized(true);
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("terminal_lang") as LanguageType;
      if (savedLang === "ko" || savedLang === "en") {
        setLanguage(savedLang);
      }
    }
  }, []);

  const handleLanguageSelection = useCallback((lang: LanguageType) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("terminal_lang", lang);
      document.documentElement.lang = lang;
    }
  }, []);

  const runSystemSequence = useCallback(
    async (selectedLang: LanguageType) => {
      if (hasBootedRef.current) return;
      hasBootedRef.current = true;
      setIsBooting(true);

      const isReturning =
        typeof window !== "undefined" &&
        localStorage.getItem("terminal_user_type") === "returning";

      if (typeof window !== "undefined") {
        localStorage.setItem("terminal_user_type", "returning");
      }

      setHistory([]);

      const bootLines = isReturning
        ? COMMAND_TEXTS.wakeSequence[selectedLang]
        : COMMAND_TEXTS.bootSequence[selectedLang];

      const endMessage = isReturning
        ? COMMAND_TEXTS.resumeMessage[selectedLang]
        : COMMAND_TEXTS.welcomeMessage[selectedLang];

      await typeOutLines(
        bootLines.map((item: BootLine) => {
          return {
            id: `boot-${uid()}`,
            text: item.text,
            type: item.type as TerminalLine["type"],
          };
        }),
      );

      setHistory((prev) => [
        ...prev,
        ...endMessage.map((item: ContentItem) => {
          const text = typeof item === "string" ? item : item[0];
          const type = typeof item === "string" ? "output" : item[1];
          return {
            id: `welcome-${uid()}`,
            text,
            type: type as TerminalLine["type"],
          };
        }),
      ]);

      scrollToBottom();
      setIsBooting(false);
      setQuickCmdContext(null);
    },
    [setHistory, typeOutLines, scrollToBottom, setQuickCmdContext],
  );

  useEffect(() => {
    if (language === null || hasBootedRef.current) return;
    runSystemSequence(language);
  }, [language, runSystemSequence]);

  return {
    isBooting,
    setIsBooting,
    isInitialized,
    language,
    setLanguage,
    hasBootedRef,
    handleLanguageSelection,
    runSystemSequence,
  };
}
