import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4053: Restore Loan Structure values after Save & Continue and returning from Step 3", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4053");
});
