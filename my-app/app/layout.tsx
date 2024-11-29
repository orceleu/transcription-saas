import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AudiScribe - #1,High precision Audio & Video transcription software.",
  description:
    "transcribe any audio or video with 98% accuracy in text in few second,upload your audio/video & transcription start automatically.",
  openGraph: {
    description:
      "transcribe any audio or video with 98% accuracy in text in few second,upload your audio/video & transcription start automatically.",
    siteName: "AudiScribe ",
    type: "website",
    images: [
      {
        url: "https://cloud.appwrite.io/v1/storage/buckets/67225954001822e6e440/files/6749426c000d887d8013/view?project=67224b080010c36860d8&project=67224b080010c36860d8&mode=admin",
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
