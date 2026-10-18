import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-142: Verify that the Product ID input field accepts valid product codes such as \"MF001\" and \"GL001\" without any errors. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-142");
});