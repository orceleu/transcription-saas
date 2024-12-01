import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { LoaderIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy",
  openGraph: {
    description: "Privacy policy.",
    siteName: "Audiscribe AI",
    images: [
      {
        url: "https://cloud.appwrite.io/v1/storage/buckets/67225954001822e6e440/files/6748e76d0009ecc19f44/view?project=67224b080010c36860d8&project=67224b080010c36860d8&mode=admin",
      },
    ],
  },
};
const ClientComponent = dynamic(
  () => import("../clientComponent/authLanding"),
  {
    ssr: false,
    loading: () => <LoaderIcon className="animate-spin" />,
  }
);
export default function Privacy() {
  return (
    <>
      <p>privacy</p>
      <br />
      <ClientComponent />
    </>
  );
}
