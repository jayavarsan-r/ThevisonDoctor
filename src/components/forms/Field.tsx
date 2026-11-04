import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClasses = (invalid?: boolean) =>
  cn(
    "h-12 w-full rounded-btn border bg-white px-4 text-[16px] text-ink transition-colors duration-150 placeholder:text-slate-500 hover:border-blue-200",
    invalid ? "border-error" : "border-slate-300",
  );

export const textareaClasses = (invalid?: boolean) =>
  cn(
    "min-h-32 w-full rounded-btn border bg-white px-4 py-3 text-[16px] text-ink transition-colors duration-150 placeholder:text-slate-500 hover:border-blue-200",
    invalid ? "border-error" : "border-slate-300",
  );

/** ids for aria-describedby: hint first, then error. */
export function describedBy(id: string, hint?: ReactNode, error?: string) {
  return (
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") ||
    undefined
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="flex items-start gap-1.5 text-meta font-medium text-error">
      <CircleAlert aria-hidden strokeWidth={1.75} className="mt-[3px] size-4 shrink-0" />
      {error}
    </p>
  );
}

/** Label above, control, helper text in slate-600, error linked via aria-describedby (§4.10). */
export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-meta font-medium text-ink">
        {label}
        {optional ? <span className="font-normal text-slate-600"> (optional)</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-meta text-slate-600">
          {hint}
        </p>
      ) : null}
      <FieldError id={id} error={error} />
    </div>
  );
}

/** Fieldset with legend for radio and checkbox groups. */
export function FieldGroup({
  id,
  legend,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  legend: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-describedby={describedBy(id, hint, error)}
      aria-invalid={error ? true : undefined}
      className={cn("flex flex-col gap-3 focus:outline-none", className)}
    >
      <legend className="mb-3 text-meta font-medium text-ink">
        {legend}
        {optional ? <span className="font-normal text-slate-600"> (optional)</span> : null}
      </legend>
      {hint ? (
        <p id={`${id}-hint`} className="-mt-2 text-meta text-slate-600">
          {hint}
        </p>
      ) : null}
      {children}
      <FieldError id={id} error={error} />
    </fieldset>
  );
}

export const optionCardClasses = (invalid?: boolean) =>
  cn(
    "flex min-h-12 cursor-pointer items-start gap-3 rounded-btn border bg-white px-4 py-3 text-[15px] text-ink transition-colors duration-150 hover:border-blue-200",
    "has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600",
    invalid ? "border-error" : "border-slate-300",
  );

export const nativeCheckClasses =
  "mt-[3px] size-[18px] shrink-0 accent-blue-600 focus-visible:outline-none";
