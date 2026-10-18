import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-132: Check that the placeholder text \"e.g., Micro Business Loan, Group Lending Product\" is displayed correctly when the product name input field is empty. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-132");
});