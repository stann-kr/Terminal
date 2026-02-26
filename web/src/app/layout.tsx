import type { Metadata, Viewport } from "next";
import { COLORS } from "@/lib/colors";
import { JetBrains_Mono, Orbit } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["300", "400", "500", "700"],
});

const orbit = Orbit({
  subsets: ["latin"],
  variable: "--font-orbit",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "TERMINAL",
  description: "A Voyage to the Unknown Sector.",
  openGraph: {
    title: "TERMINAL",
    description: "A Voyage to the Unknown Sector.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
  viewportFit: "cover",
  themeColor: COLORS.DARK_BG,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${orbit.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased overflow-hidden" suppressHydrationWarning>
        {/* React hydration 전에 localStorage에서 테마/언어를 즉시 적용하여 FOUC 방지 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('terminal_theme');if(t)document.documentElement.setAttribute('data-theme',t);var l=localStorage.getItem('terminal_lang');if(l)document.documentElement.lang=l;}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
