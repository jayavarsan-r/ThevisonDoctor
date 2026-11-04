import type { Metadata } from "next";
import { HospitalInsteadNote } from "@/components/care/HospitalInsteadNote";
import { LegalPage } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { site } from "@/content/site";
import { getClinician } from "@/lib/content";

export const metadata: Metadata = {
  title: "Medical information disclaimer",
  alternates: { canonical: "/medical-disclaimer" },
  robots: legal.reviewed ? undefined : { index: false, follow: true },
};

export default function MedicalDisclaimerPage() {
  const c = getClinician();
  return (
    <LegalPage
      title="Medical information disclaimer"
      lead="What the eye care information on this website is, and what it is not."
    >
      <h2>1. General information only</h2>
      <p>
        The eye care pages on this website describe our services in general terms. They are not a
        diagnosis, are not personal advice and do not replace an eye examination. Lists of common
        reasons for booking an appointment are not a diagnosis.
      </p>

      <h2>2. Who provides care</h2>
      <p>
        Eye care services are provided by {c.displayName}. Where an assessment suggests you need
        medical or surgical treatment, we will refer you to an ophthalmologist or a hospital.
      </p>

      <h2>3. No emergency care</h2>
      <p>{site.emergencyNote}</p>

      <h2>4. Outcomes</h2>
      <p>
        Every person&apos;s eyes are different. Management plans depend on an individual assessment,
        and we do not promise particular results from any assessment, therapy or lens.
      </p>

      <h2>5. Academy content</h2>
      <p>
        Academy pages describe training for eye-care professionals. They are not clinical guidance
        for patients.
      </p>

      <div className="mt-10">
        <HospitalInsteadNote id="disclaimer-hospital" />
      </div>
    </LegalPage>
  );
}
