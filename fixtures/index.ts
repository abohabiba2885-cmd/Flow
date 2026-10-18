import { test as base, expect, Page } from '@playwright/test';
import { LoanProductWizardPage } from '../pages/loan-product-configuration/LoanProductWizardPage';
import { stepPages } from '../pages/loan-product-configuration/StepPages';
import { generalInfo, loanStructure } from '../test-data/loan-product-configuration/baseline';
import { logIn } from '../helpers/common/auth';

type Steps = ReturnType<typeof stepPages>;

type Fixtures = {
  wizard: LoanProductWizardPage;
  steps: Steps;
  /** Controlled Edit record from EDIT_PRODUCT_ID. Fails (not skips) when missing so the block is visible. */
  editProductId: string;
  /** QA-owned product whose Associated Workflow step is Pending (no workflow). Used and changed by EDIT-S05-002 / EDIT-S10-001. */
  editProductIdNoWorkflow: string;
  /** Creates a draft through Add Step 1 and returns its id (requires the URL to switch to /edit/{id}; see gap G-04). */
  createDraftProduct: () => Promise<{ id: string; code: string }>;
  apiLog: { method: string; url: string; status?: number }[];
  /** Page logged in as FLOWSKY_RESTRICTED_EMAIL (no product-config permission). Skips when not configured. */
  restrictedPage: Page;
};

export const test = base.extend<Fixtures>({
  wizard: async ({ page }, use) => {
    await use(new LoanProductWizardPage(page));
  },
  steps: async ({ page }, use) => {
    await use(stepPages(page));
  },
  editProductId: async ({}, use) => {
    const id = process.env.EDIT_PRODUCT_ID;
    if (!id) throw new Error('EDIT_PRODUCT_ID is not set. Edit tests are BLOCKED until a controlled QA-owned product id is provided.');
    await use(id);
  },
  editProductIdNoWorkflow: async ({}, use) => {
    const id = process.env.EDIT_PRODUCT_ID_NO_WORKFLOW;
    if (!id) throw new Error('EDIT_PRODUCT_ID_NO_WORKFLOW is not set. Provide a QA-owned product with no associated workflow (Step 5 Pending).');
    await use(id);
  },
  createDraftProduct: async ({ page }, use) => {
    await use(async () => createDraft(page));
  },
  apiLog: async ({ page }, use) => {
    const log: { method: string; url: string; status?: number }[] = [];
    page.on('response', (res) => {
      const req = res.request();
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method())) log.push({ method: req.method(), url: res.url(), status: res.status() });
    });
    await use(log);
  },
  restrictedPage: async ({ browser }, use, testInfo) => {
    const email = process.env.FLOWSKY_RESTRICTED_EMAIL;
    const password = process.env.FLOWSKY_RESTRICTED_PASSWORD;
    testInfo.skip(!email || !password, 'BLOCKED: FLOWSKY_RESTRICTED_EMAIL / FLOWSKY_RESTRICTED_PASSWORD not set (G-16).');
    const context = await browser.newContext({ storageState: undefined, baseURL: testInfo.project.use.baseURL });
    const page = await context.newPage();
    await logIn(page, email!, password!);
    await use(page);
    await context.close();
  },
});

async function createDraft(page: Page): Promise<{ id: string; code: string }> {
  const wizard = new LoanProductWizardPage(page);
  const steps = stepPages(page);
  const data = generalInfo();
  await wizard.gotoAdd();
  await steps.general.fillAll(data);
  await wizard.saveAndContinue();
  await wizard.expectOnStep('Loan Structure');
  const id = wizard.currentProductId();
  if (!id) throw new Error('Draft id not found in URL after Step 1. Confirm how Add assigns the record id (gap G-04).');
  return { id, code: data.productCode! };
}

export { expect, loanStructure };
