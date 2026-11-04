"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FieldErrors, FieldValues } from "react-hook-form";
import { track } from "@/lib/analytics";
import type { SummaryError } from "./FormStatus";

type Kind = "academy" | "care";

/**
 * Shared submit / error-summary behaviour for both enquiry forms.
 * `fieldOrder` maps field names to element ids, in on-screen order.
 */
export function useEnquiry<T extends FieldValues>({
  kind,
  fieldOrder,
  thankYou,
}: {
  kind: Kind;
  fieldOrder: [keyof T & string, string][];
  thankYou: (ref: string, data: T) => string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const started = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const onFocusCapture = () => {
    if (started.current) return;
    started.current = true;
    track("enquiry_start", { kind });
  };

  const summary = (errors: FieldErrors<T>): SummaryError[] =>
    fieldOrder
      .filter(([name]) => errors[name]?.message)
      .map(([name, id]) => ({ id, message: String(errors[name]?.message) }));

  const submit = async (data: T) => {
    setServerError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        ref?: string;
        message?: string;
      } | null;
      if (!res.ok || !json?.ok || !json.ref) {
        throw new Error(json?.message || "We couldn't send your enquiry.");
      }
      track("enquiry_submit", { kind });
      router.push(thankYou(json.ref, data));
    } catch (err) {
      track("enquiry_error", { kind });
      setServerError(err instanceof Error ? err.message : "We couldn't send your enquiry.");
    }
  };

  return { serverError, summaryRef, onFocusCapture, summary, submit };
}
