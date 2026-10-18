import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-306: Verify how the system handles a product name that is a duplicate of an existing product name (if applicable) and ensure that the user receives a relevant message. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-306");
});