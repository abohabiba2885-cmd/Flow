import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-133: Ensure that the required indicator (the red asterisk) is visible next to the \"Product Name\" label when the product name field is mandatory - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-133");
});