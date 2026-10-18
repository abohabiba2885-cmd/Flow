import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-170: Explore the scenario where the user scrolls through a long list of currencies and verify that the Currency dropdown supports smooth scrolling and easy navigation. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-170");
});