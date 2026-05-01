import Providers from "@/components/providers";
import ReportWebVitals from "@/components/report-web-vitals";
import BgGradient from "@/components/shared/bg-gradient";
import Navbar from "@/components/shared/navbar/navbar";
import { Toaster } from "@packages/ui";
import "github-markdown-css/github-markdown.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "LinkUp – Social Media for Programmers",
  description:
    "Connect, share, and collaborate with programmers worldwide on LinkUp, the social media platform built for developers.",
  keywords: [
    "programming",
    "developers",
    "social media",
    "tech community",
    "LinkUp",
  ],
  authors: [{ name: "LinkUp Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <BgGradient />
          <Navbar />
          <div className="relative z-10">{children}</div>
          <Toaster />
        </Providers>
        <ReportWebVitals />
      </body>
    </html>
  );
}
