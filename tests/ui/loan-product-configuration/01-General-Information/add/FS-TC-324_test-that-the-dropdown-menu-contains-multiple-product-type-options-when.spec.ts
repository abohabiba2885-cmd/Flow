import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-324: Test that the dropdown menu contains multiple product type options when opened. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-324");
});