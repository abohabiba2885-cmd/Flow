import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-147: Test the Product ID input field with an empty submission and verify that an appropriate error message is displayed, indicating that the field is required. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-147");
});