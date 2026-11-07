
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "Learn how The Vision Doctor collects, uses, stores and protects your personal information when you use our website and enquiry forms.",
  alternates: { canonical: "/privacy" },
  robots: legal.reviewed ? undefined : { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy notice"
      lead="Your privacy matters to us. This notice explains what personal information The Vision Doctor collects, why we collect it, how we use and protect it, and the choices available to you."
    >
      <p>
        <strong>Last updated:</strong> 7 November 2026
      </p>

      <h2>1. Who we are</h2>
      <p>
        {site.name} (&quot;we&quot;, &quot;us&quot; or &quot;our&quot;) operates
        this website and provides information about our academy and eye care
        services. We determine how and why the personal information submitted
        through this website is processed and act as the Data Fiduciary for
        the purposes of India&apos;s Digital Personal Data Protection Act,
        2023 (&quot;DPDP Act&quot;), as and when its relevant provisions
        become applicable.
      </p>
      <p>
        Our contact details are:
      </p>
      <ul>
        <li>
          Business: {site.name}
        </li>
        <li>
          Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
        <li>
          Phone: {site.phone.display}
        </li>
        <li>
          Registered address: {site.registeredAddress}
        </li>
        <li>
          Udyam registration: {site.registrations[0]?.value}
        </li>
      </ul>

      <h2>2. Personal information we collect</h2>
      <p>
        We collect information that you voluntarily provide through our
        website enquiry forms or when you contact us directly. We collect
        only the information reasonably required to respond to your enquiry
        and provide the service you have requested.
      </p>

      <h3>Academy enquiries</h3>
      <p>When you enquire about our academy, we may collect:</p>
      <ul>
        <li>Your name and phone or WhatsApp number.</li>
        <li>Your email address, if you choose to provide it.</li>
        <li>The subject of your enquiry and the programme or speciality you are interested in.</li>
        <li>Your career stage and professional qualification, where relevant.</li>
        <li>Your organisation's name, if you enquire about institutional training.</li>
        <li>Your message and preferred method of contact.</li>
      </ul>

      <h3>Eye care enquiries</h3>
      <p>When you enquire about our eye care services, we may collect:</p>
      <ul>
        <li>Your name and phone or WhatsApp number.</li>
        <li>Your email address, if you choose to provide it.</li>
        <li>The eye care service you are enquiring about.</li>
        <li>Whether the appointment is for you or another person.</li>
        <li>The age and gender of the person for whom the appointment is requested.</li>
        <li>Your preferred appointment location and time.</li>
        <li>Your area or locality and pincode, if provided.</li>
        <li>An optional message about arranging the appointment.</li>
      </ul>

      <p>
        <strong>
          We do not request medical history, symptoms, prescriptions,
          diagnostic reports or date of birth through our website enquiry
          forms.
        </strong>{" "}
        Please avoid including medical records or other sensitive health
        information in website forms, email messages or WhatsApp enquiries.
        Any medical information required for an appointment should be
        discussed directly with our authorised eye care professionals.
      </p>

      <p>
        If you contact us by phone, WhatsApp or email, we receive the
        information you choose to share through that channel. Third-party
        communication services, including WhatsApp, process information
        under their own terms and privacy policies.
      </p>

      <p>
        Our website infrastructure and security services may also process
        limited technical information, such as IP address, browser and
        device information, access timestamps and security logs, where
        necessary to operate, protect and maintain the website.
      </p>

      <h2>3. How and why we use your information</h2>
      <p>
        We use the information collected through this website for the
        following purposes:
      </p>
      <ul>
        <li>To receive, review and respond to your enquiries.</li>
        <li>To answer questions about academy programmes, eligibility, dates and fees.</li>
        <li>To arrange, coordinate and confirm eye care appointments.</li>
        <li>To contact you through your selected communication channel.</li>
        <li>To operate, maintain and protect our website and enquiry services.</li>
        <li>To prevent spam, misuse, fraud and unauthorised access.</li>
        <li>To meet applicable legal and regulatory requirements.</li>
        <li>To understand website usage through analytics, but only where you have permitted analytics.</li>
      </ul>

      <p>
        We process information submitted through enquiry forms on the basis
        of the consent you provide when submitting the form. You may
        withdraw your consent by contacting us using the details in
        section 1. Withdrawal does not affect processing that took place
        before your withdrawal.
      </p>
      <p>
        We do not sell your personal information, rent it to third parties
        or use your enquiry information for third-party advertising.
        We do not use your enquiry details for unrelated marketing
        communications without your permission.
      </p>

      <h2>4. How long we retain your information</h2>
      <p>
        We retain enquiry information for up to 12 months after our last
        meaningful interaction with you, unless a longer period is required
        by applicable law or is reasonably necessary to resolve a dispute,
        protect our legal interests or fulfil a legitimate legal obligation.
      </p>
      <p>
        Once the information is no longer required, we will securely delete
        or irreversibly anonymise it. Certain technical, security and
        processing records may be retained separately for the periods
        required by applicable law.
      </p>

      <h2>5. Who we share your information with</h2>
      <p>
        We do not sell or commercially rent your personal information.
        We may share information with service providers who help us operate
        our website and respond to enquiries. These may include:
      </p>
      <ul>
        <li>Website hosting and infrastructure providers.</li>
        <li>Email and enquiry form delivery services.</li>
        <li>Business email, document and enquiry storage services.</li>
        <li>Website security and spam prevention services.</li>
        <li>Website analytics providers, but only when you allow analytics.</li>
      </ul>
      <p>
        These providers may process information on our behalf for the
        purposes described in this notice. We expect service providers
        handling personal information for us to apply appropriate
        confidentiality and security safeguards.
      </p>
      <p>
        We may also disclose information where required by law, a valid
        legal request or a competent government authority, or where
        disclosure is necessary to protect our legal rights and prevent
        fraud or misuse.
      </p>
      <p>
        Depending on the service provider and its infrastructure,
        information may be processed or stored in India or another
        country. Any transfer of personal information outside India
        will be subject to applicable Indian legal requirements.
      </p>

      <h2>6. Children's privacy</h2>
      <p>
        Our website is intended to be used by adults. We do not invite
        children to submit enquiries independently.
      </p>
      <p>
        Where an eye care appointment is requested for a person under
        18 years of age, the enquiry must be submitted by the child's
        parent or lawful guardian, who is responsible for providing
        the necessary information and consent on the child's behalf.
        We collect only the details reasonably required to arrange
        the requested service.
      </p>
      <p>
        We do not knowingly collect personal information directly from
        children or use children's information for behavioural tracking
        or targeted advertising. If we become aware that a child has
        submitted personal information directly, we will take appropriate
        steps to delete it unless its retention is required by law.
      </p>

      <h2>7. Your privacy choices and rights</h2>
      <p>
        You may contact us at any time to request information about
        the personal data we hold about you or to:
      </p>
      <ul>
        <li>Request access to information about your personal data and how it is used.</li>
        <li>Request correction, completion or updating of inaccurate or incomplete information.</li>
        <li>Request deletion of personal information that we no longer need to retain.</li>
        <li>Withdraw consent for processing based on your consent.</li>
        <li>Raise a concern or grievance about how your information is handled.</li>
        <li>Nominate another person to exercise your applicable privacy rights where permitted by law.</li>
      </ul>
      <p>
        To make a request, email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> with the subject
        &quot;Privacy Request&quot;. You may also contact us by phone at{" "}
        {site.phone.display}. We may ask you for reasonable information
        to verify your identity before acting on a request.
      </p>
      <p>
        We will review and respond to requests in accordance with
        applicable law. We may retain information where necessary to
        comply with legal obligations or resolve disputes.
      </p>

      <h2>8. Grievance redressal</h2>
      <p>
        If you have a question, concern or complaint about how we collect,
        use or protect your personal information, please contact us:
      </p>
      <ul>
        <li>
          Grievance contact: {site.name}
        </li>
        <li>
          Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
        <li>
          Phone: {site.phone.display}
        </li>
        <li>
          Registered address: {site.registeredAddress}
        </li>
      </ul>
      <p>
        We aim to acknowledge and resolve privacy-related grievances
        within 30 calendar days of receiving them. If additional time
        is required, we will communicate the status of your grievance.
      </p>
      <p>
        Where applicable under the DPDP Act, you may approach the
        Data Protection Board of India after following our grievance
        redressal process.
      </p>

      <h2 id="cookies">9. Cookies and browser storage</h2>
      <p>
        We do not use advertising cookies or advertising trackers on
        this website. We use limited browser storage to remember
        website preferences and, subject to your choice, measure
        website usage.
      </p>
      <ul>
        <li>
          <strong>tvd_consent:</strong> Uses browser local storage to
          remember whether you have allowed or declined analytics.
          You can change your choice by clearing this site's browser
          storage and making a new selection when the consent banner
          appears.
        </li>
        <li>
          <strong>tvd_path:</strong> Uses browser session storage to
          remember whether you selected the &quot;learn&quot; or
          &quot;eye care&quot; pathway on the home page. This preference
          lasts for the current browser tab session.
        </li>
        <li>
          <strong>Analytics storage:</strong> If you allow analytics,
          the analytics service may use its own cookies or similar
          technologies to measure website visits and usage.
        </li>
      </ul>
      <p>
        Analytics is not loaded until you choose &quot;Allow analytics&quot;
        on the consent banner. We do not intentionally send names,
        phone numbers, email addresses, enquiry messages or health
        information to our analytics service.
      </p>

      <h2>10. How we protect your information</h2>
      <p>
        We use reasonable technical and organisational measures to
        protect the personal information entrusted to us. These
        include encrypted connections (HTTPS), restricted access
        to enquiry information and measures intended to prevent
        unauthorised access, misuse, alteration or disclosure.
      </p>
      <p>
        Access to enquiry information is limited to people who need
        it to respond to enquiries and coordinate the requested
        services.
      </p>
      <p>
        No method of electronic transmission or storage is completely
        secure. If a personal data breach affects your information,
        we will take appropriate steps to investigate, mitigate the
        impact and notify affected individuals and relevant authorities
        as required by applicable law.
      </p>

      <h2>11. Updates to this privacy notice</h2>
      <p>
        We may update this notice when our website, services, data
        handling practices or applicable legal requirements change.
        The latest version will be published on this page with its
        updated date.
      </p>
      <p>
        Your continued use of the website does not replace any consent
        that we are required to obtain from you. Where a new purpose
        requires consent, we will seek it separately.
      </p>
      <p>
        For information about the rules governing your use of this
        website, please read our{" "}
        <Link href="/terms">Terms of Use</Link>.
      </p>
    </LegalPage>
  );
}
