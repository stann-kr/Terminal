/**
 * TERMINAL 디자인 시스템 색상 상수
 * Single Source of Truth로 관리되어 layout.tsx(themeColor) 및 globals.css 등에서 참조됩니다.
 */
export const COLORS = {
  // Brand Colors
  ORANGE: "#ff9b51",
  ORANGE_DIM: "#cc7b41",
  ORANGE_GLOW: "rgba(255, 155, 81, 0.25)",

  // Grey Scale
  GREY_BG: "#1c1c1c",
  GREY_SURFACE: "#252525",
  GREY_BORDER: "#4a5a67",
  GREY_TEXT: "#eaefef",
  GREY_MUTED: "#4a5a67",

  // Feedback Colors
  ERROR: "#ff6b6b",
  SUCCESS: "#ff9b51", // 브랜드 컬러와 동일하게 유지
} as const;
