import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acme  youtube mp3",
  description: "the official next js ",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};
export default function YoutubeMp3() {
  return (
    <>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur nulla
        quae harum velit ullam ipsa, repudiandae pariatur, deserunt temporibus
        voluptate corporis facilis ducimus consequatur placeat laudantium nisi
        sunt explicabo eum.
      </p>
    </>
  );
}
