import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1284: Handle unsaved Step 2 edits on page reload without implicit save", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1284");
});
