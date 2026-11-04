import { expect, test } from "@playwright/test";
import { ROUTES } from "./routes";

test.describe("smoke", () => {
  for (const route of ROUTES) {
    test(`${route} renders with one h1 and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main")).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test("unknown route shows the 404 page", async ({ page }) => {
    const res = await page.goto("/this-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page is out of focus.");
    await expect(page.getByRole("link", { name: "Explore the Academy" })).toBeVisible();
  });

  test("draft programs have no page in production", async ({ page }) => {
    const res = await page.goto("/academy/programs/clinical-training-ocular-diagnostics");
    expect(res?.status()).toBe(404);
  });

  test("robots, sitemap and OG image are served", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Disallow: /thank-you/");
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const xml = await sitemap.text();
    expect(xml).toContain("/eye-care/home-eye-consultation");
    expect(xml).not.toContain("/thank-you");
    const og = await request.get("/opengraph-image");
    expect(og.headers()["content-type"]).toContain("image/png");
  });
});
