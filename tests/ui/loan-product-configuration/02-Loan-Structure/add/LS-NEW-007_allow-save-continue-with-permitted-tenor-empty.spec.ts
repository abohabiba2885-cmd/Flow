import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-007: [LS-NEW-007] Allow Save & Continue with Permitted Tenor empty", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-007");
});
