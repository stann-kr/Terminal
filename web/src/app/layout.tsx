import type { Metadata, Viewport } from "next";
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
  themeColor: "#1a1a1a",
};

import NoiseOverlay from "@/components/NoiseOverlay";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={jetbrainsMono.variable}>
      <body className="antialiased">
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
