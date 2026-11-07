
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Fees, cancellation & refund policy",
  description:
    "Understand The Vision Doctor's payment terms, cancellations, rescheduling and refund procedures for Academy programs and eye care appointments.",
  alternates: { canonical: "/refund-policy" },
  robots: legal.reviewed ? undefined : { index: false, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Fees, cancellation & refund policy"
      lead="We aim to make our fees and payment terms transparent. This policy explains how payments, cancellations, rescheduling and refunds are handled for our Academy programs and eye care appointments."
    >
      <p>
        <strong>Last updated:</strong> 7 November 2026
      </p>

      <h2>1. Academy programs, workshops and CME</h2>

      <h3>Program fees</h3>
      <p>
        The applicable fee for each Academy program, workshop or
        Continuing Medical Education (CME) activity will be communicated
        before enrolment. The fee and included services will be explained
        before you confirm your registration.
      </p>
      <p>
        Any additional charges, where applicable, will be communicated
        before payment. Your registration is confirmed once the required
        payment has been received and acknowledged by us.
      </p>

      <h3>Payment methods</h3>
      <p>
        We accept the following payment methods:
        {" "}{site.payment.methods}.{" "}
        {site.payment.instalments}
      </p>
      <p>
        A payment acknowledgement or receipt will be provided for
        payments received. Please retain your payment confirmation
        for future reference.
      </p>

      <h3>Cancellation by participants</h3>
      <p>
        If you are unable to attend a registered program, please
        contact us as early as possible by email or phone.
      </p>
      <ul>
        <li>
          <strong>Before the program begins:</strong> Cancellation
          and refund requests will be reviewed based on the program's
          specific terms, the timing of the request and any services
          or arrangements already provided.
        </li>
        <li>
          <strong>Requests close to the program date:</strong> Refunds
          may be limited where arrangements, materials or other
          non-recoverable costs have already been incurred.
        </li>
        <li>
          <strong>After the program begins:</strong> Fees are generally
          non-refundable once the participant has accessed the program
          or attended the sessions, except where a refund is required
          under applicable law or approved by us in exceptional
          circumstances.
        </li>
      </ul>
      <p>
        Depending on availability and the program's terms, we may
        offer a transfer to a future batch or an alternative program
        instead of a refund. Such transfers require prior approval
        from our team.
      </p>

      <h3>Cancellation or rescheduling by The Vision Doctor</h3>
      <p>
        We reserve the right to cancel, postpone or reschedule a
        program due to unforeseen circumstances, operational
        requirements or insufficient registrations.
      </p>
      <p>
        If we cancel a program, registered participants will be
        offered the choice of:
      </p>
      <ul>
        <li>A full refund of the amount paid for the cancelled program; or</li>
        <li>Transfer of the registration to another available program or batch, subject to availability and the participant's agreement.</li>
      </ul>
      <p>
        If we reschedule a program, participants may choose to
        attend on the revised dates or request a refund if they
        cannot attend. We will communicate any changes as early
        as reasonably possible.
      </p>

      <h2>2. Eye care appointments</h2>

      <h3>Consultation and service fees</h3>
      <p>
        Applicable consultation, examination or home-visit charges
        will be communicated to you before the appointment is
        confirmed. Fees may vary depending on the service requested,
        location and nature of the appointment.
      </p>
      <p>
        We will explain the applicable charges and any additional
        costs before proceeding with a service. No additional
        service will be charged without communicating the relevant
        fee to you.
      </p>

      <h3>Appointment cancellation and rescheduling</h3>
      <p>
        If you need to cancel or reschedule an appointment, please
        inform us as early as possible by calling or messaging us
        on WhatsApp at {site.phone.display}.
      </p>
      <ul>
        <li>
          <strong>Rescheduling:</strong> Appointments may be
          rescheduled subject to availability and confirmation
          from our team.
        </li>
        <li>
          <strong>Cancellation:</strong> You may cancel an
          appointment by contacting us before the scheduled visit.
        </li>
        <li>
          <strong>Home visits:</strong> If a home visit has been
          arranged, please notify us as early as possible to
          avoid unnecessary travel and scheduling costs.
        </li>
        <li>
          <strong>Missed appointments:</strong> If you are unable
          to attend a confirmed appointment, please contact us
          to arrange another suitable time.
        </li>
      </ul>
      <p>
        Any advance payment collected for an appointment will
        be reviewed for refund or adjustment depending on the
        service status and any costs already incurred.
      </p>

      <h3>Changes by The Vision Doctor</h3>
      <p>
        If we need to cancel or reschedule an appointment due
        to unforeseen circumstances or staff availability, we
        will inform you and help arrange an alternative
        appointment.
      </p>
      <p>
        If we are unable to provide a prepaid service, the
        amount paid for that service will be refunded or
        adjusted against another appointment, subject to
        your preference and applicable law.
      </p>

      <h2>3. Refund process and timelines</h2>
      <p>
        All eligible refund requests will be reviewed and
        communicated to the participant or customer.
      </p>
      <ul>
        <li>
          Approved refunds will ordinarily be initiated
          within 7–10 business days after approval.
        </li>
        <li>
          Refunds will generally be processed through the
          original payment method used for the transaction.
        </li>
        <li>
          The time taken for the refunded amount to appear
          in your account may depend on your bank or
          payment service provider.
        </li>
        <li>
          If the original payment method is unavailable,
          we may request alternative bank details to
          process the refund securely.
        </li>
      </ul>
      <p>
        We may request transaction details or payment
        confirmation to verify a refund request. Please
        ensure that the information provided is accurate.
      </p>

      <h2>4. Non-refundable charges</h2>
      <p>
        Where applicable, charges for services already
        delivered, materials already supplied or expenses
        already incurred may not be refundable. Any such
        non-refundable charges will be communicated before
        registration or payment wherever reasonably possible.
      </p>
      <p>
        Nothing in this policy is intended to limit any
        rights or remedies available to customers under
        applicable consumer protection laws.
      </p>

      <h2>5. How to request a cancellation or refund</h2>
      <p>
        To request a cancellation, rescheduling or refund,
        please contact us using the details below:
      </p>
      <ul>
        <li>
          Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
        <li>
          Phone / WhatsApp: {site.phone.display}
        </li>
      </ul>
      <p>
        To help us process your request quickly, please
        include your name, registered phone number, program
        or appointment details, payment date and transaction
        reference, where applicable.
      </p>
      <p>
        We aim to acknowledge refund and cancellation
        requests within 3 business days and communicate
        the outcome after reviewing the request.
      </p>

      <h2>6. Policy updates</h2>
      <p>
        The Vision Doctor may update this policy from time
        to time to reflect changes in our services,
        operational procedures or applicable laws.
        The latest version will always be published on
        this page along with its updated date.
      </p>
      <p>
        For questions about our services and website usage,
        please refer to our other policies or contact us
        directly.
      </p>
    </LegalPage>
  );
}
