import { TerminalLine } from "./types";

export const LINE_COLOR: Record<TerminalLine["type"], string> = {
  system: "text-[var(--grey-muted)]",
  output: "text-[var(--grey-text)]",
  success: "text-[var(--orange)]",
  error: "text-[var(--error)]",
  input: "text-[var(--orange)] font-bold",
  link: "text-[var(--grey-text)] hover:text-[var(--orange)] hover:underline cursor-pointer transition-colors",
  header: "", // Uses .terminal-header from globals.css directly
  divider: "",
  progress: "text-[var(--grey-muted)] font-mono",
  live: "text-[var(--grey-text)]", // live chat messages — same color as output, with fadeIn animation
};

export type QuickCommand = {
  label: string;
  cmd: string;
  stageOnly?: boolean;
  back?: boolean;
  flow?: "transmit" | "live";
  readNodeId?: boolean; // 클릭 시점에 localStorage에서 nodeId를 동적으로 읽어 cmd에 주입
};

export const DEFAULT_QUICK_COMMANDS: QuickCommand[] = [
  { label: "about", cmd: "about" },
  { label: "lineup", cmd: "lineup" },
  { label: "gate", cmd: "gate" },
  { label: "whois", cmd: "whois" },
  { label: "transmit", cmd: "transmit" },
  { label: "live", cmd: "live" },
  { label: "link", cmd: "link" },
  { label: "status", cmd: "status" },
  { label: "settings", cmd: "settings" },
  { label: "help", cmd: "help" },
];

export const AVAILABLE_COMMANDS = [
  "about",
  "clear",
  "commands",
  "echo",
  "event",
  "gate",
  "help",
  "lineup",
  "link",
  "settings",
  "settings lang ko",
  "settings lang en",
  "settings theme dark",
  "settings theme light",
  "settings reset",
  "status",
  "sudo",
  "sudo login stann",
  "systems",
  "voyage",
  "whois",
  "whois stann",
  "whois marcus",
  "whois nusnoom",
  "whoami",
  "transmit",
  "live",
  "name",
  "date",
  "time",
  "ping",
  "weather",
  "scan",
  "matrix",
  "history",
];

export const EASTER_EGG_TEXT = `
  >> ACCESS GRANTED. WELCOME TO THE UNKNOWN SECTOR. <<
  >> MAIDEN VOYAGE <<
  >> You have discovered the hidden layer. Good job, traveler. <<
`;
