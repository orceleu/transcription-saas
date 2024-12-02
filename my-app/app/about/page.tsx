import React from "react";
import { Metadata } from "next";
import { EMAIL_ADDRESS, PREVIEW_IMG_META } from "../constKey/key";
export const metadata: Metadata = {
  title: "About",
  openGraph: {
    description: "About audiscribe.",
    siteName: "Audiscribe AI",
    type: "website",
    images: [
      {
        url: PREVIEW_IMG_META,
      },
    ],
  },
};
export default function About() {
  return (
    <div className="about-page max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About Audiscribe</h1>

      <p className="mb-6 text-lg text-gray-700">
        Welcome to <strong>Audiscribe</strong>, your reliable partner for
        seamless audio and video transcription into text. We are dedicated to
        providing accurate, fast, and affordable transcription services designed
        to simplify your workflows and save you time.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-700">
          At Audiscribe, our mission is to empower individuals and businesses by
          transforming their audio and video content into clear, actionable
          text. Whether it&apos;s for meetings, lectures, podcasts, or videos,
          we strive to deliver transcripts that enhance accessibility and
          productivity.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Why Choose Us?</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>
            <strong>Accuracy</strong>: Our advanced technology ensures precise
            transcriptions with minimal errors.
          </li>
          <li>
            <strong>Speed</strong>: Get your transcripts delivered quickly
            without compromising on quality.
          </li>
          <li>
            <strong>Affordability</strong>: Flexible pricing with a
            pay-as-you-go model—purchase credits only when you need them.
          </li>
          <li>
            <strong>User-Friendly</strong>: An intuitive platform that&apos;s
            easy to use for everyone, from individuals to teams.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Who We Serve</h2>
        <p className="text-gray-700">
          Audiscribe is designed for anyone who needs professional transcription
          services:
        </p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>
            Content creators looking to convert podcasts or videos into text.
          </li>
          <li>Businesses needing meeting or interview transcripts.</li>
          <li>Students and researchers wanting lecture or seminar notes.</li>
          <li>Anyone aiming to make audio or video content more accessible.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Our Commitment</h2>
        <p className="text-gray-700">
          We understand the importance of your content, which is why we&apos;re
          committed to maintaining the highest standards of security and
          confidentiality. With Audiscribe, your data is always in safe hands.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Get in Touch</h2>
        <p className="text-gray-700">
          Have questions or feedback? We&apos;d love to hear from you! Contact
          us at{" "}
          <a href={`mailto:${EMAIL_ADDRESS}`} className="text-blue-500">
            AudiscribeContact.com
          </a>{" "}
          and let us know how we can assist you.
        </p>
      </section>
    </div>
  );
}
