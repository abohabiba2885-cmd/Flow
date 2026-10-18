import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-029: [LS-NEW-029] Show down payment labels and helper texts consistent with the selected basis", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-029");
});
