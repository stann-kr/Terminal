import type { Metadata, Viewport } from "next";
import { COLORS } from "@/lib/colors";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "TERMINAL",
  description: "THE UNIVERSAL JOURNEY OF STANN LUMO.",
  openGraph: {
    title: "TERMINAL",
    description: "THE UNIVERSAL JOURNEY OF STANN LUMO.",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TERMINAL",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
  themeColor: COLORS.GREY_BG,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={jetbrainsMono.variable}
      style={
        {
          "--orange": COLORS.ORANGE,
          "--orange-dim": COLORS.ORANGE_DIM,
          "--orange-glow": COLORS.ORANGE_GLOW,
          "--grey-bg": COLORS.GREY_BG,
          "--grey-surface": COLORS.GREY_SURFACE,
          "--grey-border": COLORS.GREY_BORDER,
          "--grey-text": COLORS.GREY_TEXT,
          "--grey-muted": COLORS.GREY_MUTED,
          "--error": COLORS.ERROR,
        } as React.CSSProperties
      }
    >
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
