
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Read the terms and conditions governing your use of The Vision Doctor website, Academy information and eye care enquiry services.",
  alternates: { canonical: "/terms" },
  robots: legal.reviewed ? undefined : { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      lead="These terms explain the conditions that apply when you access or use The Vision Doctor website. Please read them carefully before using our website or submitting an enquiry."
    >
      <p>
        <strong>Last updated:</strong> 7 November 2026
      </p>

      <h2>1. About this website</h2>
      <p>
        This website is operated by {site.name} ("we", "us" or "our").
        It provides information about our Academy programs, educational
        activities and eye care services.
      </p>
      <p>
        By accessing or using this website, you agree to comply with
        these Terms of Use and applicable Indian laws. If you do not
        agree with these terms, please discontinue using the website.
      </p>
      <p>
        These terms apply to your use of the website and do not replace
        any separate agreement, consent or service-specific terms
        communicated to you when you enrol in a program or receive
        an eye care service.
      </p>

      <h2>2. General information and medical disclaimer</h2>
      <p>
        Information published on our eye care pages is intended for
        general educational and informational purposes only. It should
        not be considered medical advice, a professional diagnosis
        or a substitute for an in-person eye examination or consultation
        with a qualified healthcare professional.
      </p>
      <p>
        Individual eye care requirements vary. You should consult an
        appropriate healthcare professional before making decisions
        about your eye health, treatment or medical care.
      </p>
      <p>
        Do not delay or avoid seeking professional medical attention
        because of information published on this website.
      </p>
      <p>
        Please read our{" "}
        <Link href="/medical-disclaimer">Medical Information Disclaimer</Link>
        {" "}for additional information.
      </p>

      <h2>3. Enquiries, appointments and enrolments</h2>
      <p>
        Submitting an enquiry through this website does not constitute
        a confirmed appointment, service booking or Academy enrolment.
      </p>

      <h3>Eye care appointments</h3>
      <p>
        An appointment is confirmed only after our team communicates
        and agrees with you on the service, location, appointment time
        and applicable fees.
      </p>
      <p>
        Submitting an appointment request does not guarantee
        availability at your preferred time or location.
      </p>

      <h3>Academy programs and workshops</h3>
      <p>
        Enquiring about a program does not reserve a seat or guarantee
        admission. Enrolment is confirmed according to the eligibility
        requirements, availability, payment conditions and any
        program-specific terms communicated by us.
      </p>
      <p>
        Please refer to our{" "}
        <Link href="/refund-policy">
          Fees, Cancellation & Refund Policy
        </Link>
        {" "}for information about payments, cancellations,
        rescheduling and refunds.
      </p>

      <h2>4. Accuracy of information and program changes</h2>
      <p>
        We make reasonable efforts to ensure that the information
        published on this website is accurate and up to date.
        However, program details, course schedules, faculty,
        venues, availability, service offerings and fees may
        change from time to time.
      </p>
      <p>
        Where a material change affects an existing enrolment or
        confirmed appointment, we will make reasonable efforts
        to communicate the change and explain the available options.
      </p>
      <p>
        We will only describe a program, workshop or educational
        activity as accredited or officially recognised where
        the relevant approval or recognition has been obtained.
      </p>

      <h2>5. Acceptable use of the website</h2>
      <p>
        You agree to use this website responsibly and in accordance
        with applicable laws. In particular, you must not:
      </p>
      <ul>
        <li>Submit false, misleading, fraudulent or unauthorised information.</li>
        <li>Submit another person's personal information without appropriate authority or consent.</li>
        <li>Attempt to gain unauthorised access to the website, its servers or related systems.</li>
        <li>Introduce malicious software, viruses or harmful code.</li>
        <li>Disrupt, damage, overload or interfere with the operation or security of the website.</li>
        <li>Use automated systems, bots or scraping tools to collect website information without our written permission.</li>
        <li>Use the website for unlawful, fraudulent, abusive or harmful purposes.</li>
        <li>Reproduce or commercially exploit website content without appropriate authorisation.</li>
      </ul>
      <p>
        We reserve the right to restrict or suspend access to the
        website where we reasonably believe these terms have been
        violated or where necessary to protect our website, users
        or services.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        Unless otherwise stated, the content published on this
        website, including text, graphics, photographs, illustrations,
        logos, branding, page layouts and design elements, is owned
        by {site.name} or used under appropriate permission or licence.
      </p>
      <p>
        All applicable intellectual property rights are reserved.
        You may access, view and use website content for personal,
        non-commercial and informational purposes.
      </p>
      <p>
        You must not reproduce, republish, distribute, modify,
        publicly display or commercially exploit our content,
        branding or website materials without prior written
        permission from the relevant rights holder.
      </p>
      <p>
        Third-party names, trademarks, logos and materials appearing
        on this website remain the property of their respective
        owners and are used only where authorised or appropriate.
      </p>

      <h2>7. Third-party websites and services</h2>
      <p>
        Our website may contain links to third-party websites,
        platforms or services, including WhatsApp and external
        communication services.
      </p>
      <p>
        These links are provided for convenience. We do not control
        third-party websites and are not responsible for their
        content, availability, security, privacy practices or
        terms of service.
      </p>
      <p>
        Your use of third-party services is governed by their
        respective terms and privacy policies. We recommend
        reviewing those policies before sharing personal
        information through external services.
      </p>

      <h2>8. Website availability and security</h2>
      <p>
        We aim to keep our website accessible and functioning
        properly. However, we do not guarantee uninterrupted,
        error-free or continuous availability.
      </p>
      <p>
        Access may occasionally be interrupted due to maintenance,
        technical issues, security requirements, network problems
        or circumstances beyond our reasonable control.
      </p>
      <p>
        We reserve the right to modify, suspend or discontinue
        any part of the website where reasonably necessary.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the extent permitted by applicable law, {site.name}
        shall not be responsible for losses arising from:
      </p>
      <ul>
        <li>Temporary website interruptions, technical failures or service unavailability.</li>
        <li>Errors or omissions in general informational content, where such errors are not caused by negligence or wilful misconduct.</li>
        <li>Reliance on general website information without obtaining appropriate professional advice.</li>
        <li>Third-party websites, platforms or services linked from our website.</li>
        <li>Unauthorised access or events beyond our reasonable control, despite reasonable security measures.</li>
      </ul>
      <p>
        Nothing in these terms excludes or limits any liability
        that cannot legally be excluded or limited under applicable
        Indian law, including liability arising from fraud,
        wilful misconduct or other non-excludable obligations.
      </p>
      <p>
        Nothing in these terms affects your statutory rights as
        a consumer or limits any remedies available under
        applicable consumer protection legislation.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to use this website lawfully and responsibly.
        To the extent permitted by law, you may be responsible
        for losses or claims arising directly from your unlawful
        use of the website, fraudulent submissions or deliberate
        violation of these terms or the rights of others.
      </p>

      <h2>11. Governing law and jurisdiction</h2>
      <p>
        These Terms of Use are governed by and interpreted
        in accordance with the laws of India.
      </p>
      <p>
        Subject to applicable law and the jurisdiction of
        competent consumer and statutory authorities, courts
        in Chennai, Tamil Nadu, India shall have jurisdiction
        over disputes arising from these terms.
      </p>

      <h2>12. Changes to these terms</h2>
      <p>
        We may update or revise these Terms of Use from time
        to time to reflect changes in our services, website
        functionality, business practices or applicable laws.
      </p>
      <p>
        Updated terms will be published on this page with
        the revised date. We encourage you to review this
        page periodically.
      </p>

      <h2>13. Severability</h2>
      <p>
        If any provision of these terms is determined to be
        invalid, unlawful or unenforceable, the remaining
        provisions will continue to apply to the extent
        permitted by law.
      </p>

      <h2>14. Contact information</h2>
      <p>
        If you have questions or concerns about these Terms
        of Use, please contact us:
      </p>
      <ul>
        <li>Business: {site.name}</li>
        <li>
          Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
        <li>Phone: {site.phone.display}</li>
        <li>Address: {site.registeredAddress}</li>
      </ul>
    </LegalPage>
  );
}
