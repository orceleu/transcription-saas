import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PREVIEW_IMG_META } from "./constKey/key";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auddai - #1,High precision Audio & Video to text converter.",
  description:
    "transcribe any audio or video with 98% accuracy to text in a few minutes,upload your audio/video and transcription starts automatically.",
  openGraph: {
    description: "AI service for transcribing audio and video to text.",
    siteName: "Auddai",
    type: "website",
    images: [
      {
        url: PREVIEW_IMG_META,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
