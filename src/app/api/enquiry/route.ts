
import nodemailer from "nodemailer";
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



const MAX_BYTES = 16_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (t) => now - t < WINDOW_MS,
  );

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) hits.clear();

  return recent.length > MAX_PER_WINDOW;
}

const reply = (status: number, body: Record<string, unknown>) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export async function POST(request: Request) {
  const raw = await request.text();

  if (new TextEncoder().encode(raw).length > MAX_BYTES) {
    return reply(413, {
      ok: false,
      message: "Your enquiry is too long.",
    });
  }

  let body: unknown;

  try {
    body = JSON.parse(raw);
  } catch {
    return reply(400, {
      ok: false,
      message: "We couldn't read your enquiry. Please try again.",
    });
  }

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
    const issues = parsed.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));

    return reply(400, {
      ok: false,
      message: "Please check the highlighted fields and try again.",
      issues,
    });
  }

  const data = parsed.data;

  // Honeypot: silently discard spam.
  if (data.website) {
    return reply(200, {
      ok: true,
      ref: makeEnquiryRef(data.kind),
    });
  }

  // Cloudflare Turnstile verification.
  if (process.env.TURNSTILE_SECRET_KEY) {
    const verified = await verifyTurnstile(
      data.turnstileToken,
      ip,
    );

    if (!verified) {
      return reply(400, {
        ok: false,
        message:
          "We couldn't verify the form. Please refresh the page and try again.",
      });
    }
  }

  const ref = makeEnquiryRef(data.kind);
  const record = toRecord(ref, data);

  const outcome = await deliver(ref, data, record);

  // No email service configured.
  if (outcome === "unconfigured" || outcome === "dev") {
    return reply(200, {
      ok: false,
      ref,
      mailto: mailtoFor(ref, data, record),
    });
  }

  // Every configured delivery service failed.
  if (outcome === "failed") {
    console.error(`[enquiry] ${ref}: all delivery channels failed`);

    return reply(502, {
      ok: false,
      message:
        "We couldn't send your enquiry. Please try again or contact us directly.",
    });
  }

  return reply(200, {
    ok: true,
    ref,
  });
}

// ------------------------------------------
// FORMATTING
// ------------------------------------------

type Row = [label: string, value: string];

function titleOf(
  list: { slug: string; title: string }[],
  slug: string,
) {
  return list.find((x) => x.slug === slug)?.title ?? slug;
}

function toRecord(ref: string, d: Enquiry): Row[] {
  const submitted = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

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
      [
        "Program",
        d.program ? titleOf(programs, d.program) : "—",
      ],
      [
        "Specialities",
        d.specialities.map((s) => specialityLabels[s]).join(", ") || "—",
      ],
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
      d.service === "not-sure"
        ? "Not sure — help me choose"
        : titleOf(services, d.service),
    ],
    ["For", forWhomLabels[d.forWhom]],
    ["Age", `${d.age} years`],
    ["Gender", genderLabels[d.gender]],
    ...(d.forWhom === "child"
      ? [
          [
            "Parent/guardian confirmed",
            d.guardianConfirm ? "Yes" : "No",
          ] as Row,
        ]
      : []),
    ["Preferred place", visitTypeLabels[d.visitType]],
    ["Area", d.area],
    ["Pincode", d.pincode || "—"],
    ["Preferred time", preferredTimeLabels[d.preferredTime]],
    ...contact,
  ];
}

// ------------------------------------------
// EMAIL TEMPLATE
// ------------------------------------------

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

function subjectFor(ref: string, d: Enquiry) {
  const kind =
    d.kind === "academy" ? "Academy Enquiry" : "Eye Care Enquiry";

  const name = d.name.replace(/[\r\n]+/g, " ").trim();

  return `[${kind}] ${ref} — ${name}`;
}

function bodyFor(d: Enquiry, record: Row[]) {
  const kind =
    d.kind === "academy" ? "Academy enquiry" : "Eye care enquiry";

  return `${kind} received via The Vision Doctor website.

${record.map(([key, value]) => `${key}: ${value}`).join("\n")}
`;
}

function htmlFor(d: Enquiry, ref: string, record: Row[]) {
  const kind =
    d.kind === "academy" ? "Academy Enquiry" : "Eye Care Enquiry";

  const rows = record
    .map(
      ([label, value]) => `
        <tr>
          <td style="
            padding:13px 15px;
            border-bottom:1px solid #e8edf2;
            color:#64748b;
            font-size:13px;
            font-weight:600;
            width:38%;
            vertical-align:top;
          ">
            ${escapeHtml(label)}
          </td>
          <td style="
            padding:13px 15px;
            border-bottom:1px solid #e8edf2;
            color:#172033;
            font-size:14px;
            line-height:1.6;
            vertical-align:top;
            white-space:pre-wrap;
            word-break:break-word;
          ">
            ${escapeHtml(value)}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Enquiry - The Vision Doctor</title>
    </head>

    <body style="
      margin:0;
      padding:30px 12px;
      background:#f3f6fa;
      font-family:Arial,Helvetica,sans-serif;
    ">
      <div style="
        max-width:620px;
        margin:0 auto;
        background:#ffffff;
        border-radius:12px;
        overflow:hidden;
        border:1px solid #e5eaf0;
      ">

        <div style="
          padding:28px 30px;
          background:#102a43;
          color:#ffffff;
        ">
          <div style="
            font-size:12px;
            letter-spacing:2px;
            text-transform:uppercase;
            color:#b9d8e9;
            margin-bottom:10px;
          ">
            The Vision Doctor
          </div>

          <h1 style="
            margin:0;
            font-size:25px;
            line-height:1.3;
            font-weight:700;
          ">
            New Website Enquiry
          </h1>

          <p style="
            margin:10px 0 0;
            color:#d5e3ed;
            font-size:14px;
          ">
            You have received a new ${escapeHtml(kind.toLowerCase())}.
          </p>
        </div>

        <div style="padding:28px 30px;">

          <div style="
            padding:15px;
            background:#edf5f8;
            border-radius:8px;
            margin-bottom:22px;
          ">
            <div style="
              font-size:11px;
              color:#526779;
              text-transform:uppercase;
              letter-spacing:1px;
            ">
              Enquiry reference
            </div>

            <div style="
              margin-top:5px;
              font-size:18px;
              font-weight:700;
              color:#102a43;
            ">
              ${escapeHtml(ref)}
            </div>
          </div>

          <h2 style="
            font-size:17px;
            color:#102a43;
            margin:0 0 15px;
          ">
            Enquiry Details
          </h2>

          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="
              width:100%;
              border-collapse:collapse;
              border:1px solid #e8edf2;
            "
          >
            ${rows}
          </table>

          <p style="
            margin:25px 0 0;
            color:#64748b;
            font-size:13px;
            line-height:1.7;
          ">
            This enquiry was submitted through The Vision Doctor
            website. Please follow up with the customer using
            their preferred contact method.
          </p>

        </div>

        <div style="
          padding:18px 30px;
          background:#f8fafc;
          border-top:1px solid #e8edf2;
          text-align:center;
        ">
          <p style="
            margin:0;
            font-size:12px;
            color:#8492a6;
          ">
            Automated notification from The Vision Doctor website.
          </p>
        </div>

      </div>
    </body>
  </html>
  `;
}

// ------------------------------------------
// DELIVERY
// ------------------------------------------

type DeliveryOutcome =
  | "ok"
  | "failed"
  | "unconfigured"
  | "dev";

async function deliver(
  ref: string,
  d: Enquiry,
  record: Row[],
): Promise<DeliveryOutcome> {
  const jobs: Promise<void>[] = [];

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;

  const to =
    process.env.ENQUIRY_TO_EMAIL || site.email;

  const webhook = process.env.SHEETS_WEBHOOK_URL;

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // Gmail SMTP.
  if (smtpUser && smtpPass) {
    jobs.push(
      sendSmtp(smtpUser, smtpPass, to, ref, d, record),
    );
  }

  // Resend.
  if (resendKey && from) {
    jobs.push(
      sendEmail(resendKey, from, to, ref, d, record),
    );
  }

  // Google Sheets webhook.
  if (webhook) {
    jobs.push(
      postWebhook(webhook, ref, d.kind, record),
    );
  }

  if (!jobs.length) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[enquiry] ${ref}: no delivery configured in development.`,
      );

      return "dev";
    }

    return "unconfigured";
  }

  const results = await Promise.allSettled(jobs);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `[enquiry] ${ref}: delivery channel ${index + 1} failed: ${
          String(result.reason).slice(0, 200)
        }`,
      );
    }
  });

  return results.some(
    (result) => result.status === "fulfilled",
  )
    ? "ok"
    : "failed";
}

// ------------------------------------------
// RESEND EMAIL
// ------------------------------------------

async function sendEmail(
  key: string,
  from: string,
  to: string,
  ref: string,
  d: Enquiry,
  record: Row[],
) {
  const resend = new Resend(key);

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: subjectFor(ref, d),
    html: htmlFor(d, ref, record),
    text: bodyFor(d, record),
    ...(d.email ? { replyTo: d.email } : {}),
  });

  if (error) {
    throw new Error(`Resend delivery failed: ${error.message}`);
  }

  if (!data?.id) {
    throw new Error("Resend did not return an email ID.");
  }

  console.info(`[enquiry] ${ref}: Resend accepted email ${data.id}`);
}

// ------------------------------------------
// SMTP EMAIL
// ------------------------------------------

async function sendSmtp(
  user: string,
  pass: string,
  to: string,
  ref: string,
  d: Enquiry,
  record: Row[],
) {
  const port = Number(process.env.SMTP_PORT || 465);

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  await transport.sendMail({
    from: `"${site.shortName} website" <${user}>`,
    to,
    subject: subjectFor(ref, d),
    text: bodyFor(d, record),
    html: htmlFor(d, ref, record),
    ...(d.email ? { replyTo: d.email } : {}),
  });
}

// ------------------------------------------
// MAILTO FALLBACK
// ------------------------------------------

function mailtoFor(
  ref: string,
  d: Enquiry,
  record: Row[],
) {
  const to =
    process.env.ENQUIRY_TO_EMAIL || site.email;

  const q = new URLSearchParams({
    subject: subjectFor(ref, d),
    body: bodyFor(d, record),
  });

  return `mailto:${to}?${q.toString().replace(/\+/g, "%20")}`;
}

// ------------------------------------------
// GOOGLE SHEETS WEBHOOK
// ------------------------------------------

async function postWebhook(
  url: string,
  ref: string,
  kind: string,
  record: Row[],
) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref,
      kind,
      fields: Object.fromEntries(record),
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    throw new Error(`Webhook responded ${res.status}`);
  }
}

// ------------------------------------------
// CLOUDFLARE TURNSTILE
// ------------------------------------------

async function verifyTurnstile(
  token: string,
  ip: string,
) {
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY ?? "",
          response: token,
          ...(ip !== "unknown" ? { remoteip: ip } : {}),
        }),
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!res.ok) return false;

    const json = (await res.json()) as {
      success?: boolean;
    };

    return json.success === true;
  } catch {
    return false;
  }
}
