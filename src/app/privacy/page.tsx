import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Placeholder } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How The Vision Doctor collects, uses and protects the personal data you share through this website.",
  alternates: { canonical: "/privacy" },
  robots: legal.reviewed ? undefined : { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy notice"
      lead="How we collect, use and protect the personal data you share with us through this website, written to follow India's Digital Personal Data Protection Act, 2023 and the DPDP Rules."
    >
      <h2>1. Who we are</h2>
      <p>
        {site.name} (&quot;we&quot;, &quot;us&quot;) decides why and how your personal data is
        processed, and is the Data Fiduciary for the purposes of the Digital Personal Data
        Protection Act, 2023 (&quot;DPDP Act&quot;).
      </p>
      <p>
        Contact: <a href={`mailto:${site.email}`}>{site.email}</a> · {site.phone.display}. Legal
        entity name and registered address:{" "}
        <Placeholder>legal entity name and registered address</Placeholder>.
      </p>

      <h2>2. What we collect</h2>
      <p>
        We only collect what you type into our enquiry forms, and what you choose to send us
        directly.
      </p>
      <h3>Academy enquiry form</h3>
      <ul>
        <li>Your name, phone or WhatsApp number and, optionally, your email address</li>
        <li>
          What your enquiry is about, the program or specialities you&apos;re interested in, and
          your career stage
        </li>
        <li>
          Optionally, your qualification, your organisation (for institutional training) and a
          message
        </li>
        <li>How you would like us to contact you</li>
      </ul>
      <h3>Eye care enquiry form</h3>
      <ul>
        <li>Your name, phone or WhatsApp number and, optionally, your email address</li>
        <li>The service you need, who the appointment is for, your preferred place and time</li>
        <li>The age and gender of the person the appointment is for</li>
        <li>Your area or locality and, optionally, your pincode</li>
        <li>Optionally, a short message about arranging the visit</li>
      </ul>
      <p>
        <strong>
          We do not ask for medical history, symptoms or date of birth through this website.
        </strong>{" "}
        Please don&apos;t include medical details in a form or message — we discuss these with you
        directly.
      </p>
      <p>
        If you contact us by WhatsApp, phone or email, we receive whatever you choose to send
        through that channel. WhatsApp is operated by WhatsApp LLC under its own privacy policy.
      </p>

      <h2>3. Why we use it</h2>
      <ul>
        <li>To reply to your enquiry and answer your questions</li>
        <li>To share program dates, eligibility and fees you have asked about</li>
        <li>To arrange and confirm an eye care appointment</li>
      </ul>
      <p>
        We process this data on the basis of your consent, which you give when you tick the consent
        box on a form. You can withdraw consent at any time by contacting us (section 7). Withdrawal
        does not affect processing that took place before it. We do not sell your data or use it for
        advertising.
      </p>

      <h2>4. How long we keep it</h2>
      <p>
        We keep enquiry data for{" "}
        <Placeholder>retention period, e.g. 12 months after our last contact</Placeholder>, or until
        you ask us to erase it, unless the law requires us to keep it for longer. After that we
        delete it.
      </p>

      <h2>5. Who processes it for us</h2>
      <p>
        We use a small number of service providers (Data Processors) who handle data only on our
        instructions:
      </p>
      <ul>
        <li>
          Email delivery of enquiries: <Placeholder>email provider, e.g. Resend</Placeholder>
        </li>
        <li>
          Enquiry log: <Placeholder>e.g. Google Workspace / Google Sheets</Placeholder>
        </li>
        <li>
          Website hosting: <Placeholder>hosting provider</Placeholder>
        </li>
        <li>Spam protection, if enabled: Cloudflare Turnstile</li>
        <li>
          Website analytics, only if you allow it:{" "}
          <Placeholder>Google Analytics 4 or Plausible</Placeholder>
        </li>
      </ul>
      <p>
        Some providers may store data outside India. Where they do, we rely on the transfer being
        permitted under the DPDP Act. <Placeholder>list of countries, if any</Placeholder>
      </p>

      <h2>6. Children&apos;s data</h2>
      <p>
        Enquiries about a child must be made by the child&apos;s parent or lawful guardian, who
        gives consent on the child&apos;s behalf. The eye care form asks the person enquiring to
        confirm they are the child&apos;s parent or guardian. We do not knowingly collect personal
        data directly from children, and we do not track or target children with analytics or
        advertising.
      </p>

      <h2>7. Your rights</h2>
      <p>Under the DPDP Act you can ask us to:</p>
      <ul>
        <li>tell you what personal data we hold about you and how we use it</li>
        <li>correct, complete or update it</li>
        <li>erase it, where we no longer need it for the purpose you gave it for</li>
        <li>nominate another person to exercise your rights if you die or become unable to</li>
      </ul>
      <p>
        To make a request, email <a href={`mailto:${site.email}`}>{site.email}</a> with the subject
        &quot;Data request&quot;. We may need to confirm your identity before acting on it.
      </p>

      <h2>8. Grievances</h2>
      <p>
        If you have a concern about how we handle your data, contact our grievance contact:{" "}
        <Placeholder>name, email and phone of the grievance officer</Placeholder>. We will respond
        within <Placeholder>response period required by the DPDP Rules</Placeholder>. If you are not
        satisfied with our response, you may complain to the Data Protection Board of India.
      </p>

      <h2 id="cookies">9. Cookies, browser storage and analytics</h2>
      <p>
        We do not use advertising cookies. We only load analytics after you choose &quot;Allow
        analytics&quot; on the banner, and we never send names, contact details, messages or health
        information to analytics.
      </p>
      <ul>
        <li>
          <strong>tvd_consent</strong> (browser local storage) remembers your analytics choice.
          Clear your browser storage for this site to change it.
        </li>
        <li>
          <strong>tvd_path</strong> (browser session storage) remembers whether you chose
          &quot;learn&quot; or &quot;eye care&quot; on the home page, until you close the tab.
        </li>
        <li>
          If you allow analytics, the analytics provider may set its own cookies to count visits:{" "}
          <Placeholder>cookie names and duration for the chosen provider</Placeholder>
        </li>
      </ul>

      <h2>10. Security</h2>
      <p>
        Enquiries are sent over an encrypted connection (HTTPS) and are only available to the people
        who reply to them. No method of transmission or storage is completely secure; if a personal
        data breach affects you, we will tell you and the Data Protection Board as the DPDP Rules
        require.
      </p>

      <h2>11. Changes to this notice</h2>
      <p>
        We will update this page if our practices change, and show the date of the latest version at
        the top. See also our <Link href="/terms">terms of use</Link>.
      </p>
    </LegalPage>
  );
}
