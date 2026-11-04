const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return { y, m, d };
}

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * "2027-01-12" → "12 Jan 2027" (UI format, §11); "2027-01" → "January 2027"
 * when only the month is confirmed. Timezone-independent.
 */
export function formatDate(iso: string) {
  const { y, m, d } = parts(iso);
  if (y && m && !d) return `${MONTHS_LONG[m - 1]} ${y}`;
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Date block for event rows: { day: "12", month: "JAN", year: "2027" }. */
export function dateBlock(iso: string) {
  const { y, m, d } = parts(iso);
  return {
    day: String(d).padStart(2, "0"),
    month: MONTHS[m - 1]?.toUpperCase() ?? "",
    year: String(y),
  };
}

/** 30000 → "₹30,000" with Indian digit grouping. */
export function formatINR(amount: number) {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}`;
}

/** Today's date in India as YYYY-MM-DD. */
export function todayInIndia(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
