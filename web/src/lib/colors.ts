/**
 * TERMINAL 디자인 시스템 색상 상수
 * Single Source of Truth로 관리되어 layout.tsx(themeColor) 및 globals.css 등에서 참조됩니다.
 */
export const COLORS = {
  // Brand Colors (공통)
  ORANGE: "#FC6736", // 요청 받은 메인 컬러
  ORANGE_DIM: "#E05A2E",
  ORANGE_GLOW: "rgba(252, 103, 54, 0.25)",

  // Theme: Dark
  DARK_BG: "#1c1c1c",
  DARK_SURFACE: "#252525",
  DARK_BORDER: "#4a5a67",
  DARK_TEXT: "#eaefef",
  DARK_MUTED: "#4a5a67",

  // Theme: Light
  LIGHT_BG: "#EFECEC", // 요청 받은 라이트 배경
  LIGHT_SURFACE: "#FFFFFF",
  LIGHT_BORDER: "#D0D0D0",
  LIGHT_TEXT: "#1c1c1c",
  LIGHT_MUTED: "#7B7B7B",

  // Feedback Colors (공통)
  ERROR: "#ff6b6b",
  SUCCESS: "#FC6736",
} as const;
