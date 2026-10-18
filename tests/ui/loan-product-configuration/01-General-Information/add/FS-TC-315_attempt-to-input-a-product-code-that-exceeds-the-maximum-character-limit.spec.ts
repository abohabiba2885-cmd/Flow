import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-315: Attempt to input a product code that exceeds the maximum character limit (if any) and ensure that the system prevents this entry. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-315");
});