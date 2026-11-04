"use client";

import { CircleCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { track } from "@/lib/analytics";
import { ENQUIRY_REF_PATTERN } from "@/lib/ref";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Props = {
  kind: "academy" | "care";
  /** slug → title for programs or services, so the URL can't inject arbitrary text. */
  titles: Record<string, string>;
  steps: { title: string; text: string }[];
  links: { href: string; label: string }[];
};

export function ThankYou(props: Props) {
  return (
    <Suspense fallback={<ThankYouView {...props} />}>
      <ThankYouFromQuery {...props} />
    </Suspense>
  );
}

function ThankYouFromQuery(props: Props) {
  const q = useSearchParams();
  const rawRef = q.get("ref") ?? "";
  const ref = ENQUIRY_REF_PATTERN.test(rawRef) ? rawRef : undefined;
  const slug = q.get(props.kind === "academy" ? "program" : "service") ?? "";
  const subject = props.titles[slug];
  return <ThankYouView {...props} enquiryRef={ref} subject={subject} live />;
}

function ThankYouView({
  kind,
  steps,
  links,
  enquiryRef,
  subject,
  live,
}: Props & { enquiryRef?: string; subject?: string; live?: boolean }) {
  const fired = useRef(false);

  useEffect(() => {
    if (!live || fired.current) return;
    fired.current = true;
    // Guard against double firing across re-mounts and reloads of the same enquiry.
    const key = `tvd_lead_${enquiryRef ?? "unknown"}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // storage unavailable — the ref guard still prevents double firing in this view
    }
    track("generate_lead", { kind });
  }, [live, enquiryRef, kind]);

  const about = subject ?? (kind === "academy" ? "the Academy" : "an eye appointment");
  const waText = enquiryRef
    ? `Hi, I sent enquiry ${enquiryRef} about ${about}.`
    : `Hi, I've just sent an enquiry about ${about}.`;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <CircleCheck aria-hidden strokeWidth={1.5} className="size-14 text-blue-600" />
        <h1 className="font-display text-h1 font-medium text-ink">
          Thank you — we&apos;ve received your enquiry.
        </h1>
        {enquiryRef ? (
          <p className="text-slate-600">
            Your reference:{" "}
            <span className="font-mono text-[15px] font-medium tracking-[0.06em] text-ink">
              {enquiryRef}
            </span>
          </p>
        ) : null}
        {site.responseTime ? (
          <p className="text-slate-600">We usually reply {site.responseTime}.</p>
        ) : null}
      </div>

      <div className="rounded-card bg-blue-50 p-6 sm:p-8">
        <h2 className="eyebrow text-blue-900">What happens next</h2>
        <ol className="mt-5 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 md:flex-col md:gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-[14px] font-semibold text-blue-900">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[16px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-0.5 text-[15px] text-slate-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          href={buildWhatsAppLink(kind === "academy" ? "academy" : "care", waText)}
          variant="secondary"
          icon={<WhatsAppIcon />}
          data-wa-context="enquiry"
        >
          Continue on WhatsApp
        </Button>
        {links.map((l) => (
          <Button key={l.href} href={l.href} variant="outline" arrow>
            {l.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
