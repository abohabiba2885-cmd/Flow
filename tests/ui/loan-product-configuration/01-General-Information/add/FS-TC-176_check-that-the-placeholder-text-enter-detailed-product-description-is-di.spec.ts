import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-176: Check that the placeholder text \"Enter detailed product description\" is displayed correctly when the Product Description field text area is empty. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-176");
});