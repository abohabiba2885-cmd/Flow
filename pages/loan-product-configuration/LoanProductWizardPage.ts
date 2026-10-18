import { expect, Locator, Page } from '@playwright/test';
import { BaseForm } from './BaseForm';

export const STEP_NAMES = [
  'General Information',
  'Loan Structure',
  'Financial Rules',
  'Eligibility Criteria',
  'Associated Workflow',
  'Decision Engine',
  'Merchants',
] as const;
export type StepName = (typeof STEP_NAMES)[number];
export type StepStatus = 'In Progress' | 'Completed' | 'Pending';

/** Wizard shell shared by Add (/loan-product-config/add) and Edit (/loan-product-config/edit/{id}). */
export class LoanProductWizardPage extends BaseForm {
  constructor(page: Page) {
    super(page);
  }

  async gotoAdd(): Promise<void> {
    await this.page.goto('/loan-product-config/add');
    await expect(this.page.getByText('Create New Loan Product')).toBeVisible();
  }

  async gotoEdit(productId: string | number): Promise<void> {
    await this.page.goto(`/loan-product-config/edit/${productId}`);
    await expect(this.page.getByText('Edit Loan Product')).toBeVisible();
  }

  get saveAndContinueButton(): Locator {
    return this.page.getByRole('button', { name: /Save & Continue/ });
  }
  get previousButton(): Locator {
    return this.page.getByRole('button', { name: 'Previous' });
  }
  get cancelButton(): Locator {
    return this.page.getByRole('button', { name: 'Cancel' });
  }
  get updateProductButton(): Locator {
    return this.page.getByRole('button', { name: /Update Product/ });
  }
  /** Final button on Add Step 7 was not shown in the recording (gap G-03); the regex covers likely labels. */
  get createProductButton(): Locator {
    return this.page.getByRole('button', { name: /Create Product|Save Product|Finish|Submit/ });
  }
  get changeBanner(): Locator {
    return this.page.getByText(/fields? changed in/).first();
  }
  get discardChangesButton(): Locator {
    return this.page.getByRole('button', { name: 'Discard changes' });
  }
  get submitForReviewButton(): Locator {
    return this.page.getByRole('button', { name: 'Submit for Review' });
  }

  /** Status text under a stepper item ("In Progress" | "Completed" | "Pending"). */
  stepItem(step: StepName): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText(step, { exact: true }) })
      .filter({ hasText: /In Progress|Completed|Pending/ })
      .filter({ hasText: /STEP \d/i })
      .last();
  }

  async expectStepStatus(step: StepName, status: StepStatus): Promise<void> {
    await expect(this.stepItem(step)).toContainText(status);
  }

  async expectCompletion(percent: number): Promise<void> {
    await expect(this.page.getByText(new RegExp(`^\\s*${percent}%`)).first()).toBeVisible();
  }

  async saveAndContinue(): Promise<void> {
    await expect(this.saveAndContinueButton).toBeEnabled();
    await this.saveAndContinueButton.click();
  }

  /**
   * Asserts the visible step body. Uses a text marker observed on each step, because in Edit
   * a revisited step keeps the status "Completed" rather than "In Progress".
   */
  async expectOnStep(step: StepName): Promise<void> {
    const markers: Record<StepName, string | RegExp> = {
      'General Information': 'Product Description',
      'Loan Structure': /Minimum Amount/,
      'Financial Rules': /Disbursement Rules/,
      'Eligibility Criteria': 'Age Requirements',
      'Associated Workflow': 'Select Workflow',
      'Decision Engine': 'Choose Your Engine',
      Merchants: /Merchants currently enabled for this loan product/,
    };
    await expect(this.page.getByText(markers[step]).first()).toBeVisible();
  }

  /** Clicks Save & Continue only if enabled. Returns whether the click happened. */
  async attemptContinue(): Promise<boolean> {
    if (await this.saveAndContinueButton.isEnabled()) {
      await this.saveAndContinueButton.click();
      return true;
    }
    return false;
  }

  /** Banner text such as "21 fields changed in Loan Structure - not yet submitted for review." */
  async bannerCount(): Promise<number> {
    const text = (await this.changeBanner.innerText()).trim();
    const m = text.match(/(\d+)\s+fields?\s+changed/);
    if (!m) throw new Error(`Unexpected banner text: ${text}`);
    return Number(m[1]);
  }

  /** Product id from the current URL (/loan-product-config/edit/{id}); null on /add. */
  currentProductId(): string | null {
    const m = this.page.url().match(/\/loan-product-config\/edit\/(\d+)/);
    return m ? m[1] : null;
  }
}
