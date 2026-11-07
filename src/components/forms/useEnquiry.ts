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
  /** Set when the enquiry was handed to the visitor's email app instead of sent by us. */
  const [emailHandoff, setEmailHandoff] = useState<string | null>(null);
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
    setEmailHandoff(null);
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
        mailto?: string;
      } | null;
      if (json?.mailto) {
        // No online delivery configured: open the visitor's email app, addressed to us.
        track("enquiry_submit", { kind, channel: "email-app" });
        setEmailHandoff(json.mailto);
        window.location.href = json.mailto;
        return;
      }
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

  return { serverError, emailHandoff, summaryRef, onFocusCapture, summary, submit };
}
