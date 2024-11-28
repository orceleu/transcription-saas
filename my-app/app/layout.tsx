import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "#1,High precision Audio & Video transcription software.",
  openGraph: {
    description:
      "transcribe any audio or video with 98% accuracy in text in few second,upload your audio/video & transcription start automatically.",
    siteName: "Audiscribe AI",
    type: "website",
    images: [
      {
        url: "https://cloud.appwrite.io/v1/storage/buckets/67225954001822e6e440/files/6748e76d0009ecc19f44/view?project=67224b080010c36860d8&project=67224b080010c36860d8&mode=admin",
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
