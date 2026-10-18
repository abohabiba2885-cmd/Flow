import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-143: Check that the placeholder text \"e.g., MF001, GL001\" is visible when the input Product ID field is empty. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-143");
});