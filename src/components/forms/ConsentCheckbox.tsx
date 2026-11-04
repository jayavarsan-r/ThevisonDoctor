import Link from "next/link";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/cn";
import { describedBy, FieldError, nativeCheckClasses } from "./Field";

export function ConsentCheckbox({
  id,
  registration,
  error,
  children,
}: {
  id: string;
  registration: UseFormRegisterReturn;
  error?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-btn border bg-white px-4 py-3.5 text-[15px] text-ink",
          error ? "border-error" : "border-slate-300",
        )}
      >
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, undefined, error)}
          className={nativeCheckClasses}
          {...registration}
        />
        <span>
          {children ?? (
            <>
              I agree that The Vision Doctor may use these details to reply to my enquiry, as
              described in the{" "}
              <Link href="/privacy" className="link" target="_blank">
                privacy notice<span className="sr-only"> (opens in a new tab)</span>
              </Link>
              .
            </>
          )}
        </span>
      </label>
      <FieldError id={id} error={error} />
    </div>
  );
}
