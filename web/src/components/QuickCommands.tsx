import React from "react";
import type { QuickCommand } from "@/lib/constants";

interface QuickCommandsProps {
  isInputActive: boolean;
  isCmdsFading: boolean;
  displayedCommands: QuickCommand[];
  handleCommand: (cmd: string) => void;
  isLiveMode: boolean;
  isAnimatingRef: React.MutableRefObject<boolean>;
  setIsAnimatingInput: (v: boolean) => void;
  setQuickCmdContext: (v: string | null) => void;
  setInput: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  typeAndExecute: (
    cmd: string,
    opts?: { stageOnly?: boolean; nextContext?: string | null },
  ) => void;
  quickCmdContext: string | null;
  pendingFlowRef: React.MutableRefObject<string | null>;
  nodeId: string;
  isInputVisible: boolean;
}

export default function QuickCommands({
  isInputActive,
  isCmdsFading,
  displayedCommands,
  handleCommand,
  isLiveMode,
  isAnimatingRef,
  setIsAnimatingInput,
  setQuickCmdContext,
  setInput,
  inputRef,
  typeAndExecute,
  quickCmdContext,
  pendingFlowRef,
  nodeId,
  isInputVisible,
}: QuickCommandsProps) {
  return (
    <div
      className={`quick-cmd-wrapper mt-3 ${!isInputVisible ? "collapsed" : ""}`}
    >
      <div
        className="quick-cmd-inner flex flex-wrap gap-3 px-4"
        style={{
          opacity: isInputVisible
            ? isCmdsFading || !isInputActive
              ? 0
              : 1
            : 0,
          transform: isInputActive ? "translateY(0)" : "translateY(8px)",
          pointerEvents: isInputActive ? "auto" : "none",
          transition: isInputActive
            ? isCmdsFading
              ? "opacity 80ms ease-in, transform 250ms ease-out"
              : "opacity 200ms ease-out, transform 250ms ease-out"
            : "opacity 80ms ease-in, transform 80ms ease-in",
        }}
      >
        {displayedCommands.map((qcmd) => (
          <button
            key={qcmd.cmd}
            onClick={() => {
              if (isLiveMode) {
                handleCommand(qcmd.cmd);
                return;
              }
              if (qcmd.back) {
                if (isAnimatingRef.current) return;
                isAnimatingRef.current = true;
                setIsAnimatingInput(true);
                setTimeout(() => {
                  setQuickCmdContext(null);
                  setInput("");
                  if (
                    typeof window !== "undefined" &&
                    window.matchMedia("(hover: hover) and (pointer: fine)")
                      .matches
                  ) {
                    inputRef.current?.focus();
                  }
                  setIsAnimatingInput(false);
                  isAnimatingRef.current = false;
                }, 80);
                return;
              } else if (qcmd.cmd === "settings") {
                typeAndExecute(qcmd.cmd, { nextContext: "settings" });
              } else if (qcmd.cmd === "whois") {
                typeAndExecute(qcmd.cmd, { nextContext: "whois" });
              } else if (qcmd.cmd === "transmit") {
                typeAndExecute(qcmd.cmd, { nextContext: "transmit" });
              } else if (qcmd.cmd.startsWith("name ")) {
                if (qcmd.flow) {
                  pendingFlowRef.current = qcmd.flow;
                }
                typeAndExecute(qcmd.cmd, {
                  nextContext: "name",
                  stageOnly: qcmd.stageOnly,
                });
              } else if (
                quickCmdContext === "settings" ||
                qcmd.cmd.startsWith("settings ") ||
                quickCmdContext === "whois" ||
                qcmd.cmd.startsWith("whois ") ||
                quickCmdContext === "transmit"
              ) {
                if (qcmd.back) {
                  pendingFlowRef.current = null;
                }
                const resolvedCmd = qcmd.readNodeId
                  ? `transmit ${typeof window !== "undefined" ? localStorage.getItem("terminal_node_id") || nodeId : nodeId} `
                  : qcmd.cmd;
                typeAndExecute(resolvedCmd, {
                  nextContext: null,
                  stageOnly: qcmd.stageOnly,
                });
              } else {
                typeAndExecute(qcmd.cmd, { stageOnly: qcmd.stageOnly });
              }
            }}
            disabled={!isInputActive}
            className={`
            px-1 py-0.5 border text-xs font-mono uppercase tracking-widest
            transition-all duration-300 ease-in-out
            focus:outline-none
            disabled:opacity-30 disabled:cursor-not-allowed
            ${
              qcmd.back
                ? "border-[var(--grey-border)] text-[var(--grey-muted)] hover:border-[var(--grey-text)] hover:text-[var(--grey-text)]"
                : "border-[var(--grey-border)] text-[var(--grey-text)] hover:border-[var(--orange)] hover:text-[var(--orange)] hover:bg-[rgba(255,155,81,0.05)] active:bg-[rgba(255,155,81,0.15)] focus:border-[var(--orange)] focus:text-[var(--orange)]"
            }
          `}
          >
            [{qcmd.label}]
          </button>
        ))}
      </div>
    </div>
  );
}
