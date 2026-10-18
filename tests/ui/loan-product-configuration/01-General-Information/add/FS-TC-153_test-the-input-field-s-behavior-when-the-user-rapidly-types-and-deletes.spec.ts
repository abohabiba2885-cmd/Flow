import { test } from '@playwright/test';
import { runGeneralProductSetupCase } from './general-product-setup.helpers';

test("FS-TC-153: Test the input fieldâ€™s behavior when the user rapidly types and deletes characters to ensure that it handles quick input without freezing or crashing. - Copy", async ({ page }, testInfo) => {
  await runGeneralProductSetupCase(page, testInfo, "FS-TC-153");
});