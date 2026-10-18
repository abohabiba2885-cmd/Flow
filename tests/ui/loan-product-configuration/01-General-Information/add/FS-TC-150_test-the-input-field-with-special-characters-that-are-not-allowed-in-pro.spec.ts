import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-150: Test the input field with special characters that are not allowed in product codes (e.g., `@`, `#`, `Positive Tests: - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-150");
});