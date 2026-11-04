"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Patient-facing areas: the top bar offers the way back to the Academy there. */
const PATIENT_AREAS = ["/eye-care", "/thank-you/eye-care", "/blog"];

/** "For patients →" everywhere, except inside patient pages, where it becomes "For learners →". */
export function AudienceSwitch() {
  const pathname = usePathname();
  const inPatientArea = PATIENT_AREAS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return inPatientArea ? (
    <Link href="/academy" className="font-medium underline-offset-[3px] hover:underline">
      For learners <span aria-hidden>→</span>
    </Link>
  ) : (
    <Link href="/eye-care" className="font-medium underline-offset-[3px] hover:underline">
      For patients <span aria-hidden>→</span>
    </Link>
  );
}
