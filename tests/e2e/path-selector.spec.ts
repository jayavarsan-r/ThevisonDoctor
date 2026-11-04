import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

/**
 * Acceptance checks for the "Focus pull" path selector redesign.
 * Viewports are set per block, so this file runs in the desktop project only
 * (the mobile project ignores it in playwright.config.ts).
 */

const TINT = "rgb(239, 246, 255)";
const NAVY = "rgb(11, 23, 54)";
const MOBILE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const DESKTOP = { viewport: { width: 1440, height: 900 } };

async function openSection(page: Page, url = "/") {
  await page.goto(url);
  const section = page.locator("#path");
  await section.scrollIntoViewIfNeeded();
  // Wait for the first reveal (panel rises in over 600ms).
  await expect(section).toHaveAttribute("data-revealed", "");
  await page.waitForTimeout(700);
  return section;
}

const panel = (page: Page) => page.locator("#path .path-panel");
const careTab = (page: Page) => page.locator('#path [data-path-tab="care"]');
const learnTab = (page: Page) => page.locator('#path [data-path-tab="learn"]');

test.describe("mobile 390×844", () => {
  test.use(MOBILE);

  test("section is at most 760px tall with no horizontal scroll", async ({ page }) => {
    const section = await openSection(page);
    for (const state of ["learn", "care"] as const) {
      if (state === "care") await careTab(page).click();
      const box = await section.boundingBox();
      expect(box!.height, `${state} height`).toBeLessThanOrEqual(760);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("a horizontal swipe on the panel switches paths", async ({ page }) => {
    await openSection(page);
    const box = (await panel(page).boundingBox())!;
    // Start on the text column (below the 168px visual band), away from the chip row.
    const y = box.y + 300;
    const start = box.x + box.width * 0.75;
    await page.mouse.move(start, y);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) await page.mouse.move(start - i * 12, y);
    await page.mouse.up();
    await expect(careTab(page)).toHaveAttribute("aria-selected", "true");
    await expect(panel(page)).toHaveCSS("background-color", TINT);
  });
});

test.describe("desktop 1440×900", () => {
  test.use(DESKTOP);

  test("section fits in one 900px screen", async ({ page }) => {
    const section = await openSection(page);
    for (const state of ["learn", "care"] as const) {
      if (state === "care") await careTab(page).click();
      const box = await section.boundingBox();
      expect(box!.height, `${state} height`).toBeLessThanOrEqual(900);
    }
  });

  test("keyboard: Tab reaches the switch, ArrowRight selects Care", async ({ page }) => {
    await openSection(page);
    await page.getByRole("link", { name: "Find eye care" }).first().focus();
    await page.keyboard.press("Tab");
    await expect(learnTab(page)).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(careTab(page)).toBeFocused();
    await expect(careTab(page)).toHaveAttribute("aria-selected", "true");
    await expect(panel(page)).toHaveCSS("background-color", TINT);
    await expect(
      page
        .locator('[data-path-content="care"]')
        .getByRole("link", { name: /Book an eye appointment/ }),
    ).toBeVisible();
    await expect(page.locator("#path [role=status]")).toHaveText("Showing: Eye care path");
    // Home/End move between tabs too.
    await page.keyboard.press("Home");
    await expect(learnTab(page)).toHaveAttribute("aria-selected", "true");
    await expect(panel(page)).toHaveCSS("background-color", NAVY);
  });

  test("?path=care shows Care before hydration — no flash of Learn", async ({ page }) => {
    // Block every JS chunk so React never hydrates; only the inline boot script runs.
    // (CSS lives in the same folder, so only scripts are blocked.)
    await page.route("**/_next/static/chunks/**", (route) =>
      route.request().resourceType() === "script" ? route.abort() : route.continue(),
    );
    await page.goto("/?path=care", { waitUntil: "domcontentloaded" });
    const section = page.locator("#path");
    await expect(section).toHaveAttribute("data-active", "care");
    await expect(page.locator('[data-path-content="learn"]')).toHaveCSS("visibility", "hidden");
    await expect(page.locator("#path [data-path-indicator]")).toHaveCSS(
      "background-color",
      "rgb(37, 99, 235)",
    );
    await expect(panel(page)).toHaveCSS("background-color", TINT);
  });

  test("?path=care loads with Care active after hydration", async ({ page }) => {
    await openSection(page, "/?path=care");
    await expect(careTab(page)).toHaveAttribute("aria-selected", "true");
    await expect(panel(page)).toHaveCSS("background-color", TINT);
    await expect(page.locator("#path")).not.toHaveAttribute("data-boot", /.+/);
  });

  test("chart lines and service chips are real links with clear names", async ({ page }) => {
    await openSection(page);
    // One fellowship is published, so its line goes straight to the program page.
    await expect(
      page.getByRole("link", { name: "Fellowships: admissions open — view program" }),
    ).toHaveAttribute("href", "/academy/programs/fellowship-advanced-clinical-optometry");
    // Two certifications are published (no dates yet): the line opens that group.
    await expect(page.getByRole("link", { name: "Certifications: view programs" })).toHaveAttribute(
      "href",
      "/academy#certification-programs",
    );
    await expect(
      page.getByRole("link", { name: "Clinical training: coming soon — get notified" }),
    ).toHaveAttribute("href", "/academy/enquire?intent=notify");
    await careTab(page).click();
    await expect(
      page.getByRole("link", { name: /^Home visits — Home eye consultation$/ }),
    ).toHaveAttribute("href", "/eye-care/home-eye-consultation");
    // Inactive panel content is inert: its links can't be focused or clicked.
    await expect(page.locator('[data-path-content="learn"]')).toHaveAttribute("inert", "");
    await expect(page.locator('[data-path-content="care"]')).not.toHaveAttribute("inert", /.*/);
  });

  test("axe: no serious or critical violations in either state", async ({ page }) => {
    await openSection(page);
    for (const state of ["learn", "care"] as const) {
      if (state === "care") {
        await careTab(page).click();
        await page.waitForTimeout(800);
      }
      const results = await new AxeBuilder({ page })
        .include("#path")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      const serious = results.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => `${state}: ${v.id} — ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
      expect(serious).toEqual([]);
    }
  });
});

test.describe("reduced motion", () => {
  test.use({ ...DESKTOP, reducedMotion: "reduce" });

  test("no running animations after 1s, and switching still works", async ({ page }) => {
    await page.goto("/");
    await page.locator("#path").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const running = () =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((a) => a.playState === "running")
            .map((a) => (a.effect as KeyframeEffect | null)?.target?.toString() ?? "?").length,
      );
    expect(await running()).toBe(0);
    await careTab(page).click();
    await expect(careTab(page)).toHaveAttribute("aria-selected", "true");
    await expect(panel(page)).toHaveCSS("background-color", TINT);
    await page.waitForTimeout(1000);
    expect(await running()).toBe(0);
  });
});

test.describe("screenshots", () => {
  test.skip(!process.env.PATH_SCREENSHOTS, "set PATH_SCREENSHOTS=1 to refresh screenshots");
  const dir = "screenshots/path-selector";

  for (const [name, opts] of [
    ["desktop", DESKTOP],
    ["mobile", MOBILE],
  ] as const) {
    test.describe(name, () => {
      test.use(opts);
      test(`${name} learn and care`, async ({ page }) => {
        mkdirSync(dir, { recursive: true });
        const section = await openSection(page);
        await page.waitForTimeout(1200);
        await section.screenshot({ path: `${dir}/${name}-learn.png` });
        await careTab(page).click();
        await page.waitForTimeout(1600);
        await section.screenshot({ path: `${dir}/${name}-care.png` });
      });
    });
  }
});
