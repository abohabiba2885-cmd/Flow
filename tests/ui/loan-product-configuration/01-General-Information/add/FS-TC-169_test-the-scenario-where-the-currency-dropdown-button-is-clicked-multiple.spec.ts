import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-169: Test the scenario where the currency dropdown button is clicked multiple times rapidly and verify that it does not cause any errors or unexpected behavior. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-169");
});