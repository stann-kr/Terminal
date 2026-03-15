/**
 * TERMINAL 디자인 시스템 색상 상수
 * Single Source of Truth로 관리되어 layout.tsx(themeColor) 및 globals.css 등에서 참조됩니다.
 */
export const COLORS = {
  // Brand Colors: 시안/틸 인광 (Alien Romulus Rook's Terminal)
  ORANGE: "#00d4ff", // Primary Cyan
  ORANGE_DIM: "#0099bb",
  ORANGE_GLOW: "rgba(0, 212, 255, 0.25)",

  // Theme: Dark (near-black)
  DARK_BG: "#0a0a0a",
  DARK_SURFACE: "#0d1117",
  DARK_BORDER: "#1a3a4a",
  DARK_TEXT: "#c8d6e0",
  DARK_MUTED: "#0099bb",

  // Theme: Light
  LIGHT_BG: "#EFECEC",
  LIGHT_SURFACE: "#FFFFFF",
  LIGHT_BORDER: "#D0D0D0",
  LIGHT_TEXT: "#1c1c1c",
  LIGHT_MUTED: "#007a94",

  // Feedback Colors (공통)
  ERROR: "#ff6b6b",
  SUCCESS: "#00d4ff",
} as const;
