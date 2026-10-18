import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-019: [LS-NEW-019] Restore last submitted values with Discard changes", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-019");
});
