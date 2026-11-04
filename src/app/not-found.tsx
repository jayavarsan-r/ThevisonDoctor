import type { Metadata } from "next";
import { OpticalRings } from "@/components/motif/OpticalRings";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <OpticalRings
        rings={9}
        focal={4}
        className="absolute top-1/2 right-[-40%] -z-10 w-[900px] max-w-none -translate-y-1/2 opacity-80 md:right-[-12%]"
      />
      <div className="container-page flex min-h-[70svh] flex-col justify-center gap-6 py-20">
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="max-w-[14ch] font-display text-display font-medium text-ink">
          This page is out of focus.
        </h1>
        <p className="measure-lead text-lead text-slate-600">
          The page you were looking for has moved or doesn&apos;t exist. Try one of these instead.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/academy" arrow>
            Explore the Academy
          </Button>
          <Button href="/eye-care" variant="outline">
            Find eye care
          </Button>
          <Button href="/" variant="outline">
            Home
          </Button>
        </div>
      </div>
    </section>
  );
}
