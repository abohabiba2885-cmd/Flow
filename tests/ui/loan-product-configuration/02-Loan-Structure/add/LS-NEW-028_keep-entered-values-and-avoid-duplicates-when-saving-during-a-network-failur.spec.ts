import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-028: [LS-NEW-028] Keep entered values and avoid duplicates when saving during a network failure", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-028");
});
