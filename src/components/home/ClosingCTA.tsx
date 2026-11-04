import { Button } from "@/components/ui/Button";

/** Two side-by-side closing panels (§6.11). */
export function ClosingCTA() {
  return (
    <section aria-label="Get started" className="bg-white pt-0 pb-16 md:pb-24">
      <div className="container-page grid gap-5 md:grid-cols-2">
        <div
          data-surface="dark"
          className="flex min-h-64 flex-col justify-between gap-10 rounded-card border border-blue-900 bg-blue-900 p-8 sm:p-10"
        >
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-medium text-white">
            Ready to build a speciality?
          </h2>
          <Button href="/academy" variant="light" arrow className="self-start">
            Explore programs
          </Button>
        </div>
        <div className="flex min-h-64 flex-col justify-between gap-10 rounded-card border border-blue-200 bg-blue-50 p-8 sm:p-10">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-medium text-ink">
            Need an eye appointment?
          </h2>
          <Button href="/eye-care#book" arrow className="self-start">
            Book an eye appointment
          </Button>
        </div>
      </div>
    </section>
  );
}
