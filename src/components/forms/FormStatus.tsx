"use client";

import { CircleAlert } from "lucide-react";
import { forwardRef } from "react";
import { buildWhatsAppLink, telLink } from "@/lib/whatsapp";
import { site } from "@/content/site";

export type SummaryError = { id: string; message: string };

/** Error summary at the top of the form, with links to each field (§12). */
export const ErrorSummary = forwardRef<HTMLDivElement, { errors: SummaryError[] }>(
  function ErrorSummary({ errors }, ref) {
    if (!errors.length) return null;
    return (
      <div
        ref={ref}
        tabIndex={-1}
        role="alert"
        aria-labelledby="error-summary-title"
        className="rounded-card border-2 border-error bg-white p-5 focus:outline-none"
      >
        <h2
          id="error-summary-title"
          className="flex items-center gap-2 text-[17px] font-semibold text-error"
        >
          <CircleAlert aria-hidden strokeWidth={1.75} className="size-5" />
          {errors.length === 1
            ? "There is 1 problem with your enquiry"
            : `There are ${errors.length} problems with your enquiry`}
        </h2>
        <ul className="mt-3 flex flex-col gap-1.5">
          {errors.map((e) => (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                onClick={(ev) => {
                  ev.preventDefault();
                  const el = document.getElementById(e.id);
                  el?.focus();
                  el?.scrollIntoView({ block: "center" });
                }}
                className="text-[15px] text-error underline underline-offset-[3px] hover:decoration-2"
              >
                {e.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

/** Server or network failure — always offers WhatsApp and phone as a fallback. */
export function FormStatus({
  error,
  context,
}: {
  error: string | null;
  context: "academy" | "care";
}) {
  return (
    <div role="alert" aria-live="assertive">
      {error ? (
        <div className="rounded-card border border-error bg-white p-5">
          <p className="font-semibold text-error">{error}</p>
          <p className="mt-1 text-[15px] text-slate-600">
            Please try again, or reach us on{" "}
            <a
              href={buildWhatsAppLink(context)}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-context={context}
              className="link"
            >
              WhatsApp<span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            or{" "}
            <a href={telLink} className="link">
              {site.phone.display}
            </a>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
