import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-148: Enter invalid product codes such as \"12345\" or \"INVALID\" in the Product ID field and check if the system rejects them with an error message. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-148");
});