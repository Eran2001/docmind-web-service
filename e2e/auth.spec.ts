import { expect, test } from "@playwright/test";

const password = "password123";

async function register(page: import("@playwright/test").Page, email: string) {
  await page.goto("/register");
  await page.getByPlaceholder("Enter your fullname").fill("Auth Tester");
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Create a password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/collections$/);
}

test("a signed-out visitor is sent to the sign-in page and back after signing in", async ({
  page,
}) => {
  const email = `auth-${Date.now()}@test.com`;
  await register(page, email);
  await page.getByRole("button", { name: /Sign out/ }).click();
  await expect(page).toHaveURL(/\/login/);

  await page.goto("/collections");
  await expect(page).toHaveURL(/\/login\?next=/);

  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/collections$/);
});

test("a wrong password shows an error and stays on the sign-in page", async ({
  page,
}) => {
  const email = `auth-wrong-${Date.now()}@test.com`;
  await register(page, email);
  await page.getByRole("button", { name: /Sign out/ }).click();

  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Enter your password").fill("not-the-password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Invalid email or password.")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});
