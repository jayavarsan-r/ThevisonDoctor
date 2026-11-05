import type { Metadata } from "next";
import { LegalPage, Placeholder } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Fees, cancellation & refund policy",
  alternates: { canonical: "/refund-policy" },
  robots: legal.reviewed ? undefined : { index: false, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Fees, cancellation & refund policy"
      lead="How fees, payment, cancellations and refunds work for Academy programs and eye care appointments."
    >
      <h2>1. Academy programs, workshops and CME</h2>
      <h3>Fees</h3>
      <p>
        Each program page states the fee and what it includes. We confirm the fee with you before
        you enrol.
      </p>
      <h3>Payment</h3>
      <p>
        Accepted payment methods: {site.payment.methods.toLowerCase()}. {site.payment.instalments} A
        receipt is issued for every payment.
      </p>
      <h3>If you cancel</h3>
      <ul>
        <li>
          More than <Placeholder>number of days</Placeholder> before the start date:{" "}
          <Placeholder>refund amount or percentage</Placeholder>
        </li>
        <li>
          Within <Placeholder>number of days</Placeholder> of the start date:{" "}
          <Placeholder>refund or transfer terms</Placeholder>
        </li>
        <li>
          After the program starts: <Placeholder>terms</Placeholder>
        </li>
      </ul>
      <h3>If we cancel or reschedule</h3>
      <p>
        If we cancel a program, you can choose a full refund or a place on another intake. If we
        change the dates, you can choose to move to the new dates or receive a full refund.{" "}
        <Placeholder>confirm these commitments</Placeholder>
      </p>

      <h2>2. Eye care appointments</h2>
      <p>
        We confirm the fee with you when we call, before anything is booked. Payment is taken{" "}
        <Placeholder>when and how payment is taken</Placeholder>.
      </p>
      <h3>Cancelling or rescheduling</h3>
      <p>
        Please tell us as early as you can if you need to cancel or move an appointment — call or
        WhatsApp {site.phone.display}.{" "}
        <Placeholder>notice period and any cancellation fee for home visits</Placeholder>
      </p>

      <h2>3. How refunds are paid</h2>
      <p>
        Approved refunds are paid to the original payment method within{" "}
        <Placeholder>number of working days</Placeholder>.
      </p>

      <h2>4. Questions</h2>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a> or call {site.phone.display}.
      </p>
    </LegalPage>
  );
}
