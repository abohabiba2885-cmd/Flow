import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-145: Validate that the Product ID input field is focused when the user clicks on the label. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-145");
});