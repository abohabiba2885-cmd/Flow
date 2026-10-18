import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-317: Verify how the system handles a product ID that is a duplicate of an existing product ID (if applicable) and ensure that the user receives a relevant message. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-317");
});