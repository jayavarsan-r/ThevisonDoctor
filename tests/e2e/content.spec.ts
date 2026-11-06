import { expect, test } from "@playwright/test";
import { ROUTES } from "./routes";

const BANNED = /\b(best|No\.\s?1|world[- ]class|guaranteed|100\s?%)\b/i;

test.describe("content rules in production", () => {
  for (const route of ROUTES) {
    test(`${route}: no drafts, unverified credentials or banned claims`, async ({ page }) => {
      await page.goto(route);
      const text = await page.locator("body").innerText();
      expect(text).not.toContain("DRAFT — NOT VERIFIED");
      expect(text).not.toContain("[Draft]");
      // Qualifications are unverified — they must not be published.
      expect(text).not.toContain("O.D. (Switzerland)");
      expect(text).not.toMatch(BANNED);
      expect(text).not.toMatch(/eye surgeon|eye specialist doctor/i);
    });
  }

  test("the clinician's name always carries O.D. (SWISS)", async ({ page }) => {
    for (const route of ["/", "/about", "/eye-care", "/eye-care/myopia-management"]) {
      await page.goto(route);
      const text = await page.locator("main").innerText();
      const mentions = text.match(/Dr\. Subash V[^\n]{0,20}/g) ?? [];
      expect(mentions.length).toBeGreaterThan(0);
      for (const m of mentions) expect(m).toMatch(/^Dr\. Subash V, O\.D\. \(SWISS\)/);
      expect(text).not.toMatch(/Subash V, Optometrist|Doctor of Optometry/i);
    }
  });

  test("office address is labelled as by appointment", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("Our office · visits by appointment").first()).toBeVisible();
    await expect(page.locator("main")).toContainText("22, C-1, Ganapathy Rao Nagar");
    await expect(page.locator("iframe")).toHaveCount(0);
  });

  test("footer carries the emergency note on every page", async ({ page }) => {
    await page.goto("/eye-care");
    await expect(page.locator("footer")).toContainText("We do not provide emergency care.");
  });

  test("every service page explains when to go to a hospital instead", async ({ page }) => {
    for (const slug of [
      "home-eye-consultation",
      "eye-screening",
      "myopia-management",
      "vision-therapy",
      "specialty-contact-lenses",
      "comprehensive-eye-examination",
    ]) {
      await page.goto(`/eye-care/${slug}`);
      await expect(
        page.getByRole("heading", { name: "When to go to a hospital instead" }),
      ).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toContainText("in Chennai");
    }
  });

  test("the published fellowship shows its confirmed facts", async ({ page }) => {
    await page.goto("/academy/programs/fellowship-advanced-clinical-optometry");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Fellowship in Advanced Clinical Optometry",
    );
    const rail = page.getByRole("complementary", { name: "Program details" });
    await expect(rail).toContainText("6 months");
    await expect(rail).toContainText("Hybrid");
    await expect(rail).toContainText("₹29,999");
    await expect(rail).toContainText("January and July");
    await expect(rail).toContainText("January 2027");
    await expect(rail).toContainText("Aradhana Eye Care Hospital");
    await expect(
      page.getByRole("note").filter({ hasText: "does not, by itself, confer" }),
    ).toBeVisible();
    // No accreditation is claimed.
    await expect(page.locator("main")).not.toContainText(/accredited by/i);
  });

  test("the explorer lists every program and invites notifications for what's next", async ({
    page,
  }) => {
    await page.goto("/academy");
    await expect(
      page.getByRole("heading", { name: "Fellowship in Advanced Clinical Optometry" }).first(),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Certifications", exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Certification in Retinal Diagnostics and Imaging (CRDI)",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Certification in Clinical Ocular Diagnostics and Examination Skills (CODES)",
      }),
    ).toBeVisible();
    // With only a few programs there are no filters to choose from.
    await expect(page.getByRole("group", { name: "Program type" })).toHaveCount(0);
    await expect(page.locator("main")).toContainText(
      /Coming next:\s*short-term clinical workshops and CME/,
    );
    await expect(page.getByRole("link", { name: "Get notified" }).first()).toHaveAttribute(
      "href",
      "/academy/enquire?intent=notify",
    );
  });

  test("the profile shows the name, summary and specialities", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "Dr. Subash V, O.D. (SWISS)" })).toBeVisible();
    const main = page.locator("main");
    await expect(main).toContainText(
      "Dr. Subash V, O.D. (SWISS) leads The Vision Doctor Academy and Eye Care Services. He has 5 years of clinical expertise",
    );
    for (const s of [
      "Squint correction",
      "Low vision rehabilitation",
      "Speciality contact lenses",
    ]) {
      await expect(main).toContainText(s);
    }
    await expect(page.getByRole("region", { name: "Faculty" })).toContainText("guest sessions");
  });

  test("navigation says About us and links to the blog", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "About us" })).toHaveAttribute("href", "/about");
    await expect(nav.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });

  test("top bar offers the other audience", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /For patients/ })).toHaveAttribute(
      "href",
      "/eye-care",
    );
    await page.goto("/eye-care/myopia-management");
    await expect(page.getByRole("link", { name: /For learners/ })).toHaveAttribute(
      "href",
      "/academy",
    );
    await expect(page.getByRole("link", { name: /For patients/ })).toHaveCount(0);
  });

  test("sections carry no 01/02 numbering", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/\b0[1-9] — /);
    expect(text).not.toMatch(/Path 0\d/i);
  });

  test("certifications show the confirmed course details", async ({ page }) => {
    await page.goto(
      "/academy/programs/certification-clinical-ocular-diagnostics-examination-skills",
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Certification in Clinical Ocular Diagnostics and Examination Skills (CODES)",
    );
    const rail = page.getByRole("complementary", { name: "Program details" });
    await expect(rail).toContainText("4 weeks");
    await expect(rail).toContainText("Hybrid");
    await expect(rail).toContainText("₹8,999");
    await expect(rail).toContainText("10–15 participants");
    await expect(rail).toContainText("January 2027");
    await expect(rail).toContainText("Every month");
    await expect(rail).toContainText("Aradhana Eye Care Hospital");
    await expect(page.locator("main")).toContainText("Diploma in Optometry graduates");
    await expect(page.locator("main")).not.toContainText(/accredited by/i);

    await page.goto("/academy/programs/certification-retinal-diagnostics-imaging");
    await expect(page.locator("main")).toContainText(
      "Optical Coherence Tomography (OCT): principles and interpretation",
    );
    const crdi = page.getByRole("complementary", { name: "Program details" });
    await expect(crdi).toContainText("₹8,999");
    await expect(crdi).toContainText("Aradhana Eye Care Hospital");
    await expect(crdi).toContainText("Cash or UPI · instalments accepted (plan varies by course)");
    await expect(page.locator("main")).toContainText("Optometry students and interns");
    await expect(page.locator("main")).toContainText("Diploma in Optometry graduates");
  });

  test("old certification URLs redirect to the renamed courses", async ({ page }) => {
    await page.goto("/academy/programs/certification-retinal-imaging-diagnostics");
    await expect(page).toHaveURL(/\/academy\/programs\/certification-retinal-diagnostics-imaging$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Certification in Retinal Diagnostics and Imaging (CRDI)",
    );
  });

  test("the fellowship lists expert guest faculty and instalments", async ({ page }) => {
    await page.goto("/academy/programs/fellowship-advanced-clinical-optometry");
    const faculty = page.getByRole("region", { name: "Faculty" });
    await expect(faculty).toContainText("Learn from expert guest faculty");
    await expect(faculty).toContainText("national-level speakers");
    await expect(page.locator("main")).toContainText(
      "Cash or UPI. Instalments are accepted; the plan varies by course.",
    );
    await expect(faculty).toContainText("announced to enrolled students closer to each session");
    await expect(page.locator("main")).toContainText(
      "Certificate issued by The Vision Doctor Academy",
    );
    await expect(page.locator("main")).not.toContainText("no government accreditation");
  });

  test("the clinician profile shows patients seen", async ({ page }) => {
    for (const route of ["/", "/about", "/eye-care/vision-therapy"]) {
      await page.goto(route);
      const main = page.locator("main");
      await expect(main).toContainText("36,000+");
      await expect(main).toContainText(/patients seen/i);
    }
  });

  test("before-and-after cases appear with labelled photos and a caveat", async ({ page }) => {
    await page.goto("/eye-care");
    const cases = page.locator("#cases");
    await expect(
      cases.getByRole("heading", { name: "Ptosis (drooping upper eyelids)" }),
    ).toBeVisible();
    await expect(cases.getByRole("heading", { name: "Squint (strabismus)" })).toBeVisible();
    await expect(cases.getByRole("img", { name: /^Before:/ }).first()).toBeVisible();
    await expect(cases.getByRole("img", { name: /^After/ }).first()).toBeVisible();
    await expect(cases).toContainText("Each case is one person's experience");
    // Each service page shows only its own case.
    await page.goto("/eye-care/vision-therapy");
    await expect(page.getByRole("heading", { name: "Squint (strabismus)" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Ptosis/ })).toHaveCount(0);
    // The squint article links the case too.
    await page.goto("/blog/squint-strabismus-signs-causes-treatment");
    await expect(
      page.getByRole("heading", { name: "From our practice: before and after" }),
    ).toBeVisible();
  });

  test("brand strip shows the partner logos and can be paused", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Brand collaborations" })).toBeVisible();
    const strip = page.locator("#brands-marquee");
    for (const name of [
      "Aradhana Eye Care Hospital",
      "Menicon",
      "CureSee",
      "Acuitiz",
      "iWorld Optometry Clinic & Opticals",
      "VV Vision Clinic",
    ]) {
      await expect(strip.getByRole("img", { name, exact: true })).toHaveCount(1);
    }
    await expect(strip).not.toContainText("Brand partner");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: /on LinkedIn/ })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/the-vision-doctor-academy-eye-care-services/",
    );
    await expect(footer.getByRole("link", { name: /on Facebook/ })).toHaveAttribute(
      "href",
      "https://www.facebook.com/share/19RS4o6uq9/",
    );
    await expect(footer.getByRole("link", { name: /on YouTube/ })).toHaveAttribute(
      "href",
      "https://www.youtube.com/@the.visiondoctor",
    );
    await expect(footer.getByRole("link", { name: /on Instagram/ })).toHaveAttribute(
      "href",
      "https://www.instagram.com/the.visiondoctor/",
    );
  });

  test("the footer shows the Udyam registration", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toContainText(/Udyam \(MSME\):\s*UDYAM-TN-02-0517785/);
  });

  test("Google site verification is in the head", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="google-site-verification"]')).toHaveAttribute(
      "content",
      "3MiwxColfz7E4FqDBFF72B4iwsnA6kvf9w4eSEKSxhY",
    );
  });
});

test.describe("blog SEO", () => {
  test("article has a short title, description, canonical and structured data", async ({
    page,
  }) => {
    await page.goto("/blog/glaucoma-symptoms-early-detection");
    const title = await page.title();
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/Glaucoma/);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length ?? 0).toBeGreaterThan(80);
    expect(description?.length ?? 999).toBeLessThanOrEqual(160);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/blog\/glaucoma-symptoms-early-detection$/,
    );
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(
      "\n",
    );
    expect(ld).toContain('"BlogPosting"');
    expect(ld).toContain('"MedicalCondition"');
    expect(ld).toContain('"FAQPage"');
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Glaucoma");
    // Safety: urgent symptoms point to hospital care.
    await expect(page.getByRole("note").filter({ hasText: "hospital emergency" })).toBeVisible();
  });

  test("blog index lists every article", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("link", { name: /Dry eye disease/ })).toBeVisible();
    await expect(page.locator("main article")).toHaveCount(14);
  });

  test("unknown article returns 404", async ({ page }) => {
    const res = await page.goto("/blog/not-a-real-article");
    expect(res?.status()).toBe(404);
  });
});
