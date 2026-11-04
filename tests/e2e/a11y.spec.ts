import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ROUTES } from "./routes";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("accessibility (axe, WCAG 2.2 AA)", () => {
  for (const route of ROUTES) {
    test(`${route} has no detectable violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
      }));
      expect(summary).toEqual([]);
    });
  }

  test("404 page has no detectable violations", async ({ page }) => {
    await page.goto("/missing-page");
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("academy form error state has no detectable violations", async ({ page }) => {
    await page.goto("/academy/enquire");
    await page.getByRole("button", { name: "Enquire now" }).last().click();
    await expect(page.getByRole("alert").first()).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("skip link moves focus to main content", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium");
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });
});
