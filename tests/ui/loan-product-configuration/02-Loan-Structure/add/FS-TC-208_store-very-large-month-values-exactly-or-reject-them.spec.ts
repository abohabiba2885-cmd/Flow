import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-208: Store very large month values exactly or reject them", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-208");
});
