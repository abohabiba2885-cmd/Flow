import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-344: Validate that the Product Description field text area expands correctly when the user inputs a large amount of text, up to the defined maximum height. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-344");
});