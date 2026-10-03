import path from "node:path";
import { expect, test } from "@playwright/test";

const fixture = path.join(__dirname, "fixtures", "handbook.md");

test("register, create a collection, upload a document, ask a question and open the citation", async ({
  page,
}) => {
  const email = `journey-${Date.now()}@test.com`;

  // Register
  await page.goto("/register");
  await page.getByPlaceholder("Enter your fullname").fill("Journey Tester");
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Create a password").fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/collections$/);

  // Create a collection and open it
  // The header button and the empty-state button both open the dialog.
  await page.getByRole("button", { name: "New collection" }).first().click();
  await page.getByPlaceholder("e.g. Sales Enablement").fill("Handbook");
  await page.getByRole("button", { name: "Create collection" }).click();
  await page.getByRole("link", { name: /Handbook/ }).click();
  await expect(page).toHaveURL(/\/collections\/[^/]+$/);

  // Upload the fixture and wait for the worker to index it
  await page.locator('input[type="file"]').setInputFiles(fixture);
  await expect(page.getByText("handbook.md")).toBeVisible();
  // exact: the page also says "0 ready · 1 queued", which a plain text match would accept too early.
  await expect(page.getByText("Ready", { exact: true })).toBeVisible({
    timeout: 60_000,
  });

  // Ask a question: the answer streams in with a citation
  await page.getByRole("link", { name: "Open chat" }).click();
  await expect(page).toHaveURL(/\/chat/);
  await page
    .getByLabel("Message")
    .fill("How many days of paid time off do employees get?");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(/25 days of paid time off/).first(),
  ).toBeVisible();
  const citation = page.getByRole("button", { name: "Open source 1" });
  await expect(citation).toBeVisible();

  // Clicking the citation opens the source passage
  await citation.click();
  await expect(page.getByText(/Unused days up to 5 carry over/)).toBeVisible();
});
