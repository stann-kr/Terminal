import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "TERMINAL [01]",
  description: "THE UNIVERSAL JOURNEY OF STANN LUMO. 2026.03.07 / Faust, Seoul",
  openGraph: {
    title: "TERMINAL [01]",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={jetbrainsMono.variable}>
      <head>
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
