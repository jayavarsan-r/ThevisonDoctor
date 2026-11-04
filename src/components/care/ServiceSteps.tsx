import { CalendarCheck, MessageSquareText, PhoneCall } from "lucide-react";
import { cn } from "@/lib/cn";

export const APPOINTMENT_STEPS = [
  {
    title: "Enquire",
    text: "Send the form or WhatsApp us with the service you need and your area.",
    icon: MessageSquareText,
  },
  {
    title: "We call to confirm",
    text: "We confirm the place, time and fee with you before anything is booked.",
    icon: PhoneCall,
  },
  {
    title: "Your visit",
    text: "Your appointment takes place at a confirmed location or at your home.",
    icon: CalendarCheck,
  },
];

/** Used beside the booking form ("What happens next"). */
export const CARE_NEXT_STEPS = [
  { title: "We call you", text: "We confirm the service, the place and a suitable time." },
  { title: "We confirm the fee", text: "You'll know the fee before anything is booked." },
  { title: "Your appointment", text: "At a confirmed location in Chennai or at your home." },
];

/** "How appointments work" — Enquire → We call to confirm → Your visit. */
export function ServiceSteps({
  variant = "inline",
  className,
}: {
  variant?: "inline" | "cards";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <ol className={cn("flex flex-col gap-4 md:flex-row md:items-center md:gap-3", className)}>
        {APPOINTMENT_STEPS.map((s, i) => (
          <li key={s.title} className="flex items-center gap-3">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-[13px] font-semibold text-blue-900">
              {i + 1}
            </span>
            <span className="text-[15px] font-semibold text-ink">{s.title}</span>
            {i < APPOINTMENT_STEPS.length - 1 ? (
              <span aria-hidden className="hidden h-px w-10 bg-blue-200 md:block" />
            ) : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className={cn("grid gap-5 md:grid-cols-3", className)}>
      {APPOINTMENT_STEPS.map((s, i) => {
        const Icon = s.icon;
        return (
          <li
            key={s.title}
            data-reveal
            style={{ "--i": i } as React.CSSProperties}
            className="flex flex-col gap-4 rounded-card border border-line bg-white p-6 sm:p-7"
          >
            <div className="flex items-center justify-between">
              <Icon aria-hidden strokeWidth={1.5} className="size-8 text-blue-900" />
            </div>
            <h3 className="text-[19px] font-semibold text-ink">{s.title}</h3>
            <p className="text-[15px] text-slate-600">{s.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
