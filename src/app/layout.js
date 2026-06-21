import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lexmora - Premium Life Lessons & Wisdom Sharing Platform",
  description: "Share and discover premium life lessons and wisdom on Lexmora.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-zinc-900 text-white dark:bg-blue-600 px-4 py-2 rounded-md z-[100] outline-none ring-2 ring-blue-500 font-semibold text-sm transition-all"
          >
            Skip to main content
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
