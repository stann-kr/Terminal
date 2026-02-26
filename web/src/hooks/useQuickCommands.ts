import { useState, useRef, useEffect, useMemo } from "react";
import type { QuickCommand } from "@/lib/constants";
import { DEFAULT_QUICK_COMMANDS } from "@/lib/constants";

export function useQuickCommands(
  isLiveMode: boolean,
  language: string | null,
  input: string,
  isAnimatingInput: boolean,
  quickCmdContext: string | null,
) {
  const [isCmdsFading, setIsCmdsFading] = useState(false);
  const [displayedCommands, setDisplayedCommands] = useState<QuickCommand[]>(
    DEFAULT_QUICK_COMMANDS,
  );
  const latestCommandsRef = useRef<QuickCommand[]>(DEFAULT_QUICK_COMMANDS);

  const currentQuickCommands = useMemo(() => {
    const BACK_BTN: QuickCommand = {
      label: "← back",
      cmd: "__back__",
      back: true,
    };
    let commands: QuickCommand[] = DEFAULT_QUICK_COMMANDS;

    if (isLiveMode) {
      commands = [{ label: "/leave", cmd: "/leave" }];
    } else if (language === null) {
      commands = [
        { label: "1 (EN)", cmd: "1" },
        { label: "2 (KO)", cmd: "2" },
      ];
    } else {
      const trimmedInput = input.trim().toLowerCase();
      const parts = trimmedInput.split(/\s+/);
      const activeCtx = trimmedInput ? parts[0] : quickCmdContext;

      if (activeCtx === "settings") {
        if (!trimmedInput || parts.length === 1) {
          commands = [
            BACK_BTN,
            { label: "lang en", cmd: "settings lang en" },
            { label: "lang ko", cmd: "settings lang ko" },
            { label: "theme dark", cmd: "settings theme dark" },
            { label: "theme light", cmd: "settings theme light" },
            { label: "reset", cmd: "settings reset" },
          ];
        } else if (parts[1] === "lang") {
          commands = [
            BACK_BTN,
            { label: "lang en", cmd: "settings lang en" },
            { label: "lang ko", cmd: "settings lang ko" },
          ];
        } else if (parts[1] === "theme") {
          commands = [
            BACK_BTN,
            { label: "theme dark", cmd: "settings theme dark" },
            { label: "theme light", cmd: "settings theme light" },
          ];
        } else if (parts[1] === "reset") {
          commands = [BACK_BTN, { label: "reset", cmd: "settings reset" }];
        }
      } else if (activeCtx === "live-choice") {
        let nodeId = "unknown";
        if (typeof window !== "undefined") {
          nodeId = localStorage.getItem("terminal_node_id") || "unknown";
        }
        commands = [
          BACK_BTN,
          {
            label: language === "ko" ? "이름 설정" : "set name",
            cmd: "name ",
            stageOnly: true,
            flow: "live",
          },
          {
            label: language === "ko" ? `${nodeId} 로 접속` : `enter: ${nodeId}`,
            cmd: "live --node",
          },
        ];
      } else if (activeCtx === "whois") {
        commands = [
          BACK_BTN,
          { label: "stann", cmd: "whois stann" },
          { label: "marcus", cmd: "whois marcus" },
          { label: "nusnoom", cmd: "whois nusnoom" },
        ];
      } else if (activeCtx === "sudo") {
        commands = [
          BACK_BTN,
          { label: "login stann", cmd: "sudo login stann" },
        ];
      } else if (activeCtx === "name") {
        const nameVal = input
          .trimStart()
          .replace(/^name\s*/i, "")
          .trim();
        const savedName =
          typeof window !== "undefined"
            ? localStorage.getItem("terminal_name")
            : null;
        const REMOVE_NAME_BTN: QuickCommand = {
          label: language === "ko" ? "이름 제거" : "remove name",
          cmd: "name clear",
        };
        if (nameVal.toLowerCase() === "clear") {
          commands = [BACK_BTN, REMOVE_NAME_BTN];
        } else if (nameVal.length > 0) {
          commands = [
            BACK_BTN,
            {
              label:
                language === "ko" ? `"${nameVal}" 설정` : `set "${nameVal}"`,
              cmd: `name ${nameVal}`,
            },
          ];
        } else {
          commands = savedName ? [BACK_BTN, REMOVE_NAME_BTN] : [BACK_BTN];
        }
      } else if (activeCtx === "transmit") {
        const transmitParts = input.trim().split(/\s+/);
        const hasTransmitMessage =
          input.trimStart().startsWith("transmit ") &&
          !isAnimatingInput &&
          transmitParts.length >= 3;

        let nodeId = "unknown";
        if (typeof window !== "undefined") {
          nodeId = localStorage.getItem("terminal_node_id") || "unknown";
        }

        if (hasTransmitMessage) {
          commands = [
            BACK_BTN,
            {
              label: language === "ko" ? "신호 전송 (SEND)" : "SEND SIGNAL",
              cmd: input,
            },
          ];
        } else if (
          input.trimStart().startsWith("transmit ") &&
          !isAnimatingInput
        ) {
          commands = [BACK_BTN];
        } else {
          const savedName =
            typeof window !== "undefined"
              ? localStorage.getItem("terminal_name")
              : null;
          if (savedName) {
            commands = [
              BACK_BTN,
              {
                label: language === "ko" ? "메시지 작성" : "write message",
                cmd: `transmit ${savedName} `,
                stageOnly: true,
              },
              {
                label: language === "ko" ? "이름 설정" : "set name",
                cmd: "name ",
                stageOnly: true,
                flow: "transmit",
              },
            ];
          } else {
            commands = [
              BACK_BTN,
              {
                label: language === "ko" ? "이름 설정" : "set name",
                cmd: "name ",
                stageOnly: true,
                flow: "transmit",
              },
              {
                label:
                  language === "ko"
                    ? `${nodeId} 로 작성`
                    : `write as: ${nodeId}`,
                cmd: "transmit ",
                stageOnly: true,
                readNodeId: true,
              },
            ];
          }
        }
      }
    }
    // commands가 비어있는 극단적 상황 방지 (최소 DEFAULT 노출)
    return commands.length > 0 ? commands : DEFAULT_QUICK_COMMANDS;
  }, [input, quickCmdContext, language, isLiveMode, isAnimatingInput]);

  latestCommandsRef.current = currentQuickCommands;

  useEffect(() => {
    const prev = displayedCommands.map((c) => c.cmd).join(",");
    const next = latestCommandsRef.current.map((c) => c.cmd).join(",");

    if (prev !== next) {
      setIsCmdsFading(true);
      const timer = setTimeout(() => {
        setDisplayedCommands(latestCommandsRef.current);
        setIsCmdsFading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentQuickCommands, displayedCommands]);

  return { isCmdsFading, displayedCommands };
}
