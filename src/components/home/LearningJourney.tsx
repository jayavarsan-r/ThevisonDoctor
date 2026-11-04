import { AdmissionsSteps } from "@/components/academy/AdmissionsSteps";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** "From enquiry to the clinic floor." (§6.5) */
export function LearningJourney() {
  return (
    <section aria-labelledby="journey-title" className="bg-blue-50 section-y">
      <div className="container-page">
        <SectionHeader
          id="journey-title"
          label="How it works"
          title="From enquiry to the clinic floor."
        />
        <AdmissionsSteps className="mt-12 md:mt-16" />
        <div className="mt-12 flex flex-col gap-6 border-t border-blue-200 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="measure text-meta text-slate-600">
            Practical exposure, equipment and clinical settings are described on each program page.
          </p>
          <Button href="/academy/enquire" arrow>
            Start an enquiry
          </Button>
        </div>
      </div>
    </section>
  );
}
