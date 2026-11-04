import { Resend } from "resend";
import { programs } from "@/content/programs";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { specialityLabels, stageLabels } from "@/content/taxonomy";
import { makeEnquiryRef } from "@/lib/ref";
import {
  contactLabels,
  enquirySchema,
  forWhomLabels,
  genderLabels,
  intentLabels,
  preferredTimeLabels,
  visitTypeLabels,
  type Enquiry,
} from "@/lib/validation";

/**
 * POST /api/enquiry — receives Academy and Eye Care enquiries.
 *
 * Delivery: Resend email (RESEND_API_KEY + ENQUIRY_FROM_EMAIL) and/or a Google
 * Apps Script webhook (SHEETS_WEBHOOK_URL). With neither configured, dev logs
 * the submission and production refuses it (503) so no enquiry is silently lost.
 * Personal data is never written to production logs.
 */

const MAX_BYTES = 16_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const reply = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BYTES)
    return reply(413, { ok: false, message: "Your enquiry is too long." });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply(400, { ok: false, message: "We couldn't read your enquiry. Please try again." });
  }

  // Behind a proxy/CDN the platform sets x-forwarded-for; the first entry is the client.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return reply(429, {
      ok: false,
      message:
        "Too many enquiries from this connection. Please wait a few minutes, or WhatsApp us.",
    });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
    return reply(400, {
      ok: false,
      message: "Please check the highlighted fields and try again.",
      issues,
    });
  }
  const data = parsed.data;

  // Honeypot filled → pretend success, deliver nothing.
  if (data.website) return reply(200, { ok: true, ref: makeEnquiryRef(data.kind) });

  if (process.env.TURNSTILE_SECRET_KEY) {
    const verified = await verifyTurnstile(data.turnstileToken, ip);
    if (!verified) {
      return reply(400, {
        ok: false,
        message: "We couldn't verify the form. Please refresh the page and try again.",
      });
    }
  }

  const ref = makeEnquiryRef(data.kind);
  const record = toRecord(ref, data);
  const outcome = await deliver(ref, data, record);

  if (outcome === "unconfigured") {
    console.error(`[enquiry] ${ref} not delivered: no delivery channel configured`);
    return reply(503, { ok: false, message: "Online enquiries are not available right now." });
  }
  if (outcome === "failed") {
    console.error(`[enquiry] ${ref} delivery failed on every channel`);
    return reply(502, { ok: false, message: "We couldn't send your enquiry." });
  }
  return reply(200, { ok: true, ref });
}

// ---------- Formatting ----------

type Row = [label: string, value: string];

function titleOf(list: { slug: string; title: string }[], slug: string) {
  return list.find((x) => x.slug === slug)?.title ?? slug;
}

function toRecord(ref: string, d: Enquiry): Row[] {
  const submitted = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const common: Row[] = [
    ["Reference", ref],
    ["Submitted", `${submitted} IST`],
  ];
  const contact: Row[] = [
    ["Name", d.name],
    ["Phone", d.phone],
    ["Email", d.email || "—"],
    ["Preferred contact", contactLabels[d.preferredContact]],
    ["Message", d.message || "—"],
  ];

  if (d.kind === "academy") {
    return [
      ...common,
      ["Enquiry", "Academy"],
      ["About", intentLabels[d.intent]],
      ["Program", d.program ? titleOf(programs, d.program) : "—"],
      ["Specialities", d.specialities.map((s) => specialityLabels[s]).join(", ") || "—"],
      ["Stage", d.stage ? stageLabels[d.stage] : "—"],
      ["Qualification", d.qualification || "—"],
      ["Organisation", d.organisation || "—"],
      ...contact,
    ];
  }
  return [
    ...common,
    ["Enquiry", "Eye care"],
    [
      "Service",
      d.service === "not-sure" ? "Not sure — help me choose" : titleOf(services, d.service),
    ],
    ["For", forWhomLabels[d.forWhom]],
    ["Age", `${d.age} years`],
    ["Gender", genderLabels[d.gender]],
    ...(d.forWhom === "child"
      ? ([["Parent/guardian confirmed", d.guardianConfirm ? "Yes" : "No"]] as Row[])
      : []),
    ["Preferred place", visitTypeLabels[d.visitType]],
    ["Area", d.area],
    ["Pincode", d.pincode || "—"],
    ["Preferred time", preferredTimeLabels[d.preferredTime]],
    ...contact,
  ];
}

// ---------- Delivery ----------

async function deliver(
  ref: string,
  d: Enquiry,
  record: Row[],
): Promise<"ok" | "failed" | "unconfigured" | "dev"> {
  const jobs: Promise<void>[] = [];
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const to = process.env.ENQUIRY_TO_EMAIL || site.email;
  const webhook = process.env.SHEETS_WEBHOOK_URL;

  if (resendKey && from) jobs.push(sendEmail(resendKey, from, to, ref, d, record));
  if (webhook) jobs.push(postWebhook(webhook, ref, d.kind, record));

  if (!jobs.length) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[enquiry] dev mode — not delivered (configure RESEND_API_KEY or SHEETS_WEBHOOK_URL)\n` +
          record.map(([k, v]) => `  ${k}: ${v}`).join("\n"),
      );
      return "dev";
    }
    return "unconfigured";
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r, i) => {
    if (r.status === "rejected")
      console.error(`[enquiry] ${ref} channel ${i + 1} failed: ${String(r.reason).slice(0, 200)}`);
  });
  return results.some((r) => r.status === "fulfilled") ? "ok" : "failed";
}

async function sendEmail(
  key: string,
  from: string,
  to: string,
  ref: string,
  d: Enquiry,
  record: Row[],
) {
  const resend = new Resend(key);
  const kind = d.kind === "academy" ? "Academy enquiry" : "Eye care enquiry";
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `[${kind}] ${ref} — ${d.name}`,
    text: `${kind} received via the website.\n\n${record.map(([k, v]) => `${k}: ${v}`).join("\n")}\n`,
    ...(d.email ? { replyTo: d.email } : {}),
  });
  if (error) throw new Error(error.message);
}

async function postWebhook(url: string, ref: string, kind: string, record: Row[]) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ref, kind, fields: Object.fromEntries(record) }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

async function verifyTurnstile(token: string, ip: string) {
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY ?? "",
        response: token,
        ...(ip !== "unknown" ? { remoteip: ip } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
