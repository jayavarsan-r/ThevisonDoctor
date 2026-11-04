"use client";

import { useId, useState, type FormEvent } from "react";
import { inputClasses } from "@/components/forms/Field";
import { track } from "@/lib/analytics";

/**
 * Checks a pincode against the home-visit list (§8.1). Only rendered when the
 * list has entries; otherwise the page shows the "tell us your area" sentence.
 * The pincode itself is never sent to analytics.
 */
export function PincodeChecker({ pincodes }: { pincodes: string[] }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<null | "yes" | "no" | "invalid">(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const pin = value.trim();
    if (!/^\d{6}$/.test(pin)) {
      setResult("invalid");
      return;
    }
    const covered = pincodes.includes(pin);
    setResult(covered ? "yes" : "no");
    track("pincode_check", { covered });
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-3 rounded-card border border-line bg-white p-5"
    >
      <label htmlFor={id} className="text-meta font-medium text-ink">
        Check your pincode for home visits
      </label>
      <div className="flex gap-3">
        <input
          id={id}
          inputMode="numeric"
          maxLength={6}
          autoComplete="postal-code"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-describedby={`${id}-result`}
          aria-invalid={result === "invalid" ? true : undefined}
          className={inputClasses(result === "invalid")}
        />
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center rounded-btn bg-blue-600 px-5 text-[15px] font-semibold text-white hover:bg-blue-700"
        >
          Check
        </button>
      </div>
      <p id={`${id}-result`} role="status" aria-live="polite" className="text-[15px]">
        {result === "yes" ? (
          <span className="text-ink">
            Yes — we visit homes in {value.trim()}. Send an enquiry below to arrange a time.
          </span>
        ) : result === "no" ? (
          <span className="text-slate-600">
            {value.trim()} isn&apos;t on our list yet. Tell us your area and we&apos;ll confirm
            whether we can visit.
          </span>
        ) : result === "invalid" ? (
          <span className="text-error">Enter a 6-digit pincode.</span>
        ) : null}
      </p>
    </form>
  );
}
