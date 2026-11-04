import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Placeholder } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of use",
  alternates: { canonical: "/terms" },
  robots: legal.reviewed ? undefined : { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" lead="The terms that apply when you use this website.">
      <h2>1. About this website</h2>
      <p>
        This website is operated by {site.name}. By using it, you agree to these terms. If you do
        not agree, please do not use the website.
      </p>

      <h2>2. General information, not medical advice</h2>
      <p>
        Eye care pages on this website give general information only. They are not a diagnosis and
        do not replace an eye examination. Read our{" "}
        <Link href="/medical-disclaimer">medical information disclaimer</Link>.
      </p>

      <h2>3. Enquiries are not bookings or enrolments</h2>
      <p>
        Sending an enquiry form does not book an appointment or reserve a place on a program. An
        appointment is booked only when we have confirmed the place, time and fee with you. A place
        on a program is secured only on the terms set out on that program&apos;s page and in our{" "}
        <Link href="/refund-policy">fees and refund policy</Link>.
      </p>

      <h2>4. Program information</h2>
      <p>
        We aim to keep program details accurate. Dates, venues, faculty and fees may change; if they
        change after you enrol, we will tell you and explain your options. We only describe a
        program as accredited when the accrediting body has approved it.
      </p>

      <h2>5. Acceptable use</h2>
      <ul>
        <li>Do not submit false, misleading or someone else&apos;s details.</li>
        <li>Do not try to disrupt, overload or gain unauthorised access to the website.</li>
        <li>
          Do not copy the website&apos;s content for commercial use without our written permission.
        </li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        Text, graphics, the logo and design of this website belong to {site.name} or its licensors.{" "}
        <Placeholder>confirm ownership of the logo and brand assets</Placeholder>
      </p>

      <h2>7. Links to other services</h2>
      <p>
        Links to WhatsApp and other services are provided for convenience. Those services are
        governed by their own terms and privacy policies.
      </p>

      <h2>8. Liability</h2>
      <p>
        To the extent permitted by law, we are not liable for loss arising from reliance on general
        information on this website. Nothing in these terms limits liability that cannot be limited
        by law. <Placeholder>lawyer to finalise the liability clause</Placeholder>
      </p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by the laws of India.{" "}
        <Placeholder>jurisdiction, e.g. courts at Chennai</Placeholder>
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
