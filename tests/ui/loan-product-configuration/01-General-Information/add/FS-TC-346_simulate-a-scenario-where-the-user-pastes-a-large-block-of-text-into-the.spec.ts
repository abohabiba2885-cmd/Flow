import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-346: Simulate a scenario where the user pastes a large block of text into the Product Description field text area to check for performance issues or formatting errors. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-346");
});