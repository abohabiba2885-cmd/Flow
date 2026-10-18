import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-141: Test the product name input field\u0027s responsiveness by resizing the browser window and ensuring that the input field maintains its functionality and layout. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-141");
});