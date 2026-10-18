import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-139: Simulate a user who uses keyboard shortcuts (like Ctrl+V) to paste a product name and check if the input field correctly reflects the pasted name. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-139");
});