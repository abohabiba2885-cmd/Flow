import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-179: Validate that the user is prevented from entering more characters than the maximum limit (if one exists) and that an error is displayed in Product Description field. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-179");
});