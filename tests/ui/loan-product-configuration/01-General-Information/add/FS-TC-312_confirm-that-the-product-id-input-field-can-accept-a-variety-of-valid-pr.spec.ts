import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-312: Confirm that the Product ID input field can accept a variety of valid product codes, including alphanumeric combinations and special characters (if applicable). - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-312");
});