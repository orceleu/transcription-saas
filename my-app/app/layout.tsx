import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PREVIEW_IMG_META } from "./constKey/key";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AudiScribe - #1,High precision Audio & Video transcription software.",
  description:
    "transcribe any audio or video with 98% accuracy to text in few second,upload your audio/video & transcription start automatically.",
  openGraph: {
    description:
      "transcribe any audio or video with 98% accuracy to text in few second,upload your audio/video & transcription start automatically.",
    siteName: "AudiScribe ",
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
