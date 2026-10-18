import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-135: Confirm that the product name input field allows a maximum character limit, if applicable, and that it displays an appropriate message when the limit is reached. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-135");
});