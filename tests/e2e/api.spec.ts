import { expect, test } from "@playwright/test";
import { randomIp } from "./routes";

const valid = {
  kind: "academy",
  intent: "notify",
  program: "",
  specialities: ["myopia"],
  name: "Test Learner",
  phone: "9514162051",
  email: "",
  stage: "student-intern",
  qualification: "",
  organisation: "",
  preferredContact: "whatsapp",
  message: "",
  consent: true,
  website: "",
  turnstileToken: "",
};

test.describe("/api/enquiry", () => {
  test.skip(({ isMobile }) => isMobile, "API tests run once");

  test("rejects invalid payloads with field issues", async ({ request }) => {
    const res = await request.post("/api/enquiry", {
      data: { ...valid, phone: "123", consent: false },
      headers: { "x-forwarded-for": randomIp() },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    const paths = json.issues.map((i: { path: string }) => i.path);
    expect(paths).toEqual(expect.arrayContaining(["phone", "consent"]));
  });

  test("silently accepts honeypot submissions without delivering", async ({ request }) => {
    const res = await request.post("/api/enquiry", {
      data: { ...valid, website: "http://spam.example" },
      headers: { "x-forwarded-for": randomIp() },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  test("valid enquiry is delivered, or refused when no channel is configured", async ({
    request,
  }) => {
    const res = await request.post("/api/enquiry", {
      data: valid,
      headers: { "x-forwarded-for": randomIp() },
    });
    // 200 when RESEND / SHEETS env vars are set; 503 in a production build without them.
    expect([200, 503]).toContain(res.status());
    const json = await res.json();
    if (res.status() === 200) expect(json.ref).toMatch(/^TVD-A-\d{6}-[A-Z2-9]{4}$/);
    else expect(json.ok).toBe(false);
  });

  test("rate limits repeated submissions from one address", async ({ request }) => {
    const ip = randomIp();
    const statuses: number[] = [];
    for (let i = 0; i < 8; i++) {
      const res = await request.post("/api/enquiry", {
        data: { ...valid, phone: "1" },
        headers: { "x-forwarded-for": ip },
      });
      statuses.push(res.status());
    }
    expect(statuses).toContain(429);
  });
});
