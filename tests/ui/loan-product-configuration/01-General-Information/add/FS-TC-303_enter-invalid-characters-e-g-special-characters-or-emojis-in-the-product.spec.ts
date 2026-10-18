import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-303: Enter invalid characters (e.g., special characters or emojis) in the product name and ensure that the system displays an error or prevents submission. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-303");
});