import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-006: [LS-NEW-006] Accept a Permitted Tenor that is not a multiple of Min Months", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-006");
});
