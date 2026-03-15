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
  live: "text-[var(--grey-text)]",
  button:
    "text-[var(--orange)] hover:text-[var(--orange-dim)] cursor-pointer font-bold transition-colors",
};

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
