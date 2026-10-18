import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-018: [LS-NEW-018] Count unsubmitted Loan Structure changes in the change banner", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-018");
});
