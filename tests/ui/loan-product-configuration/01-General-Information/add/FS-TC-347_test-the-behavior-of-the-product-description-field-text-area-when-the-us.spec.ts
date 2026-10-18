import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-347: Test the behavior of the Product Description field text area when the user switches between different input languages or keyboard layouts, ensuring that the placeholder text and input still function correctly. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-347");
});