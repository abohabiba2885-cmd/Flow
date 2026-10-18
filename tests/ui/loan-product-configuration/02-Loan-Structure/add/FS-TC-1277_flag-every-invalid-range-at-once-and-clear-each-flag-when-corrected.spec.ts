import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1277: Flag every invalid range at once and clear each flag when corrected", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1277");
});
