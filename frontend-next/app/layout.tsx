import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BgGradient from "@/components/shared/BgGradient";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import Navbar from "@/components/shared/navbar/Navbar";
import "github-markdown-css/github-markdown.css";
import ReportWebVitals from "@/components/ReportWebVitals";

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
