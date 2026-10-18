import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-297: Verify that the product name input field accepts valid product names, such as \"Micro Business Loan\" or \"Group Lending Product\". - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-297");
});