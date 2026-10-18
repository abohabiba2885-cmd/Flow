import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1245: Select and save each Repayment Frequency option", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1245");
});
