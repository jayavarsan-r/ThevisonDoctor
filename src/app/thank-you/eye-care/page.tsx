import type { Metadata } from "next";
import { HospitalInsteadNote } from "@/components/care/HospitalInsteadNote";
import { CARE_NEXT_STEPS } from "@/components/care/ServiceSteps";
import { ThankYou } from "@/components/forms/ThankYou";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

export default function CareThankYouPage() {
  const titles = Object.fromEntries(getServices().map((s) => [s.slug, s.title]));
  return (
    <section className="bg-blue-50">
      <div className="container-page flex max-w-[960px] flex-col gap-12 py-14 md:py-24">
        <ThankYou
          kind="care"
          titles={titles}
          steps={CARE_NEXT_STEPS}
          links={[
            { href: "/eye-care", label: "Eye care services" },
            { href: "/", label: "Back to home" },
          ]}
        />
        <HospitalInsteadNote
          id="thanks-hospital"
          title="While you wait: when to go to a hospital instead"
        />
      </div>
    </section>
  );
}
