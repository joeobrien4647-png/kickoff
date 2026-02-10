import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kickoff",
  description: "World Cup 2026 Road Trip Planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AppShell>{children}</AppShell>
        <Toaster
          theme="light"
          position="bottom-right"
          style={
            {
              "--normal-bg": "var(--popover)",
              "--normal-text": "var(--popover-foreground)",
              "--normal-border": "var(--border)",
              "--border-radius": "var(--radius)",
            } as React.CSSProperties
          }
        />
      </body>
    </html>
  );
}
