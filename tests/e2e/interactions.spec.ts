import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("hero H1 is real text and the path selector switches with the keyboard", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "See further. Learn deeper. Care better.",
    );

    const learn = page.locator('#path [role="tab"][data-path-tab="learn"]');
    const care = page.locator('#path [role="tab"][data-path-tab="care"]');
    await expect(learn).toHaveAttribute("aria-selected", "true");
    await learn.focus();
    await page.keyboard.press("ArrowRight");
    await expect(care).toHaveAttribute("aria-selected", "true");
    await expect(
      page
        .locator('[data-path-content="care"]')
        .getByRole("link", { name: /Book an eye appointment/ }),
    ).toBeVisible();

    // Choice is remembered for the session.
    await page.reload();
    await expect(page.locator('#path [data-path-tab="care"]')).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("?path=care preselects the eye care path", async ({ page }) => {
    await page.goto("/?path=care");
    await expect(page.locator('#path [data-path-tab="care"]')).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("FAQ tabs switch audiences and accordions open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "For patients" }).click();
    const q = page.getByRole("button", { name: "Is this a walk-in clinic?" });
    await q.click();
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("No. All consultations are by appointment")).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("desktop Academy menu lists the published program", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto("/about");
    await page.getByRole("button", { name: "Academy" }).click();
    await expect(
      page.getByRole("link", { name: /Fellowship in Advanced Clinical Optometry/ }).first(),
    ).toBeVisible();
    // Two certifications share one menu entry that opens their group.
    await expect(page.getByRole("link", { name: /^Certifications/ }).first()).toHaveAttribute(
      "href",
      "/academy#certification-programs",
    );
    // The published fellowship is featured as the next intake.
    await expect(page.getByRole("link", { name: "View program" }).first()).toHaveAttribute(
      "href",
      "/academy/programs/fellowship-advanced-clinical-optometry",
    );
  });

  test("mobile menu opens as a dialog, hides the action bar and closes on navigation", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    const bar = page.locator("[data-mobile-action-bar]");
    await expect(bar).toBeVisible();
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(bar).toBeHidden();
    await dialog.getByRole("link", { name: /I'm here for eye care/ }).click();
    await expect(page).toHaveURL(/\/eye-care$/);
    await expect(dialog).toBeHidden();
    await expect(
      page.locator("[data-mobile-action-bar]").getByRole("link", { name: "Book eye care" }),
    ).toBeVisible();
  });
});

test.describe("academy enquiry form", () => {
  test("empty submit shows an error summary linked to fields", async ({ page }) => {
    await page.goto("/academy/enquire");
    await page.getByRole("button", { name: "Enquire now" }).last().click();
    const summary = page.getByRole("alert").filter({ hasText: "problem" }).first();
    await expect(summary).toBeVisible();
    await expect(summary.getByRole("link", { name: "Enter your name." })).toHaveAttribute(
      "href",
      "#ae-name",
    );
    await expect(page.locator("#ae-name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#ae-name")).toHaveAttribute("aria-describedby", /ae-name-error/);
  });

  test("intent from the URL changes the submit label", async ({ page }) => {
    await page.goto("/academy/enquire?intent=notify");
    await expect(page.getByRole("radio", { name: "Notify me about new intakes" })).toBeChecked();
    await expect(page.getByRole("button", { name: "Get notified" })).toBeVisible();
  });

  test("valid enquiry reaches the thank-you page with its reference", async ({ page }) => {
    await page.route("**/api/enquiry", async (route) => {
      const body = route.request().postDataJSON();
      expect(body.kind).toBe("academy");
      expect(body).not.toHaveProperty("dateOfBirth");
      await route.fulfill({ json: { ok: true, ref: "TVD-A-261013-K7QM" } });
    });
    await page.goto("/academy/enquire");
    await page.getByLabel("Your name").fill("Asha R");
    await page.getByLabel("Phone or WhatsApp number").fill("95141 62051");
    await page.getByLabel("I am a…").selectOption("student-intern");
    await page.getByRole("checkbox", { name: /I agree/ }).check();
    await page.getByRole("button", { name: "Enquire now" }).last().click();
    await expect(page).toHaveURL(/\/thank-you\/academy\?ref=TVD-A-261013-K7QM/);
    await expect(page.getByText("TVD-A-261013-K7QM")).toBeVisible();
    const wa = page.getByRole("link", { name: /Continue on WhatsApp/ });
    await expect(wa).toHaveAttribute("href", /TVD-A-261013-K7QM/);
  });

  test("server failure offers WhatsApp and phone", async ({ page }) => {
    await page.route("**/api/enquiry", (route) =>
      route.fulfill({
        status: 503,
        json: { ok: false, message: "Online enquiries are not available right now." },
      }),
    );
    await page.goto("/academy/enquire");
    await page.getByLabel("Your name").fill("Asha R");
    await page.getByLabel("Phone or WhatsApp number").fill("9514162051");
    await page.getByLabel("I am a…").selectOption("practising-optometrist");
    await page.getByRole("checkbox", { name: /I agree/ }).check();
    await page.getByRole("button", { name: "Enquire now" }).last().click();
    await expect(page.getByText("Online enquiries are not available right now.")).toBeVisible();
    await expect(page.getByRole("alert").getByRole("link", { name: /WhatsApp/ })).toBeVisible();
  });
});

test.describe("eye care enquiry form", () => {
  test("never asks for medical history, symptoms or date of birth", async ({ page }) => {
    await page.goto("/eye-care");
    const form = page.locator("#book form");
    await expect(form).toBeVisible();
    const labels = (await form.locator("label, legend").allInnerTexts()).join(" ").toLowerCase();
    expect(labels).not.toMatch(/symptom|medical history|date of birth|dob/);
    // Age and gender were added at the client's request (not date of birth).
    await expect(form.getByLabel("Age (years)")).toBeVisible();
    await expect(form.getByLabel("Gender")).toBeVisible();
  });

  test("a child appointment needs parent or guardian confirmation", async ({ page }) => {
    await page.goto("/eye-care/myopia-management");
    const form = page.locator("#book form");
    await form.getByRole("radio", { name: "My child" }).check();
    await form.getByLabel("Age (years)").fill("9");
    await form.getByLabel("Gender").selectOption("female");
    await form.getByRole("radio", { name: "No preference" }).check();
    await form.getByLabel("Your area or locality in Chennai").fill("Kolathur");
    await form.getByLabel("Your name").fill("Meena K");
    await form.getByLabel("Phone or WhatsApp number").fill("9514162051");
    await form.getByRole("checkbox", { name: /I agree/ }).check();
    await form.getByRole("button", { name: "Book an eye appointment" }).click();
    await expect(
      page.getByText("Please confirm you are the child's parent or guardian.").first(),
    ).toBeVisible();
  });

  test("service page pre-fills the service", async ({ page }) => {
    await page.goto("/eye-care/specialty-contact-lenses");
    await expect(page.locator("#ce-service")).toHaveValue("specialty-contact-lenses");
  });
});

test.describe("brand strip motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the logo strip moves and can be paused", async ({ page }) => {
    await page.goto("/");
    const strip = page.locator("#brands-marquee");
    await expect(strip.locator(".marquee-track")).toHaveCSS("animation-play-state", "running");
    await page.getByRole("button", { name: "Pause logo animation" }).click();
    await expect(strip).toHaveAttribute("data-paused", "");
    await expect(strip.locator(".marquee-track")).toHaveCSS("animation-play-state", "paused");
    await page.getByRole("button", { name: "Play logo animation" }).click();
    await expect(strip).not.toHaveAttribute("data-paused", /.*/);
  });
});
