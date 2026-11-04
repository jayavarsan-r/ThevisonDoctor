import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Native select with the brand chevron. Native for accessibility and mobile pickers. */
export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(function Select({ className, invalid, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-12 w-full appearance-none rounded-btn border bg-white pr-10 pl-4 text-[16px] text-ink transition-colors duration-150 hover:border-blue-200",
          invalid ? "border-error" : "border-slate-300",
          className,
        )}
        {...props}
      />
      <ChevronDown
        aria-hidden
        strokeWidth={1.5}
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-blue-900"
      />
    </div>
  );
});
