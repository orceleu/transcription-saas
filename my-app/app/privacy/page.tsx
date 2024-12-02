import React from "react";
import { Metadata } from "next";
import { EMAIL_ADDRESS, PREVIEW_IMG_META } from "../constKey/key";

export const metadata: Metadata = {
  title: "Privacy",
  openGraph: {
    description: "Privacy policy.",
    siteName: "Audiscribe AI",
    type: "article",
    images: [
      {
        url: PREVIEW_IMG_META,
      },
    ],
  },
};

export default function Privacy() {
  return (
    <div className="privacy-policy max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 02/12/2024</p>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. Data Collection</h2>
        <p className="mb-2">We only collect the following information:</p>
        <ul className="list-disc pl-6">
          <li>
            Email address: when you register or contact us through our site.
          </li>
        </ul>
        <p>
          We do not collect browsing data, such as IP addresses or activity on
          the site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">2. Use of Data</h2>
        <p>We use your email address solely for the following purposes:</p>
        <ul className="list-disc pl-6">
          <li>Providing you with information about our services.</li>
          <li>Responding to your questions or inquiries.</li>
          <li>
            Sending you important notifications related to your account or our
            services.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          3. Sharing of Information
        </h2>
        <p>
          Your personal information will not be sold, rented, or traded with
          third parties. However, we may share your data when necessary with:
        </p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Third-party service providers</strong>: for instance, to
            send emails. These providers are obligated to maintain the
            confidentiality of your information.
          </li>
          <li>
            <strong>Legal authorities</strong>: if required by law.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          4. Data Storage and Protection
        </h2>
        <p>
          Your information is stored on secure servers. We implement technical
          and organizational measures to safeguard your data against
          unauthorized access, loss, or alteration.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">5. Cookies</h2>
        <p>
          We do not use cookies or similar technologies to track your activity
          on our site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">6. Your Rights</h2>
        <p>
          You have the following rights regarding your personal information:
        </p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Access</strong>: Obtain a copy of the data we hold about
            you.
          </li>
          <li>
            <strong>Modification</strong>: Correct your information if it is
            inaccurate.
          </li>
          <li>
            <strong>Deletion</strong>: Request the deletion of your data from
            our systems.
          </li>
        </ul>
        <p>
          To exercise these rights, please contact us at:{" "}
          <a
            title="contact us"
            href={`mailto:${EMAIL_ADDRESS}`}
            className="text-blue-500"
          >
            AudiscribeContact.com
          </a>
          .
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">7. Changes to the Policy</h2>
        <p>
          We may update this Privacy Policy at any time. Any changes will be
          posted on this page with an updated date.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">8. Contact</h2>
        <p>
          If you have any questions or concerns regarding this Privacy Policy,
          please contact us:
        </p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Email</strong>:{" "}
            <a
              title="contact us"
              href={`mailto:${EMAIL_ADDRESS}`}
              className="text-blue-500"
            >
              AudiscribeContact.com
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
