import { expect, Locator, Page } from '@playwright/test';
import { BaseForm } from './BaseForm';
import { GeneralInfoData, LoanStructureData, FinancialRulesData, EligibilityData } from '../../test-data/loan-product-configuration/types';

/** Step 1 - General Information */
export class GeneralInformationStep extends BaseForm {
  async fillAll(d: GeneralInfoData): Promise<void> {
    await this.fill('Product Name', d.productName);
    if (d.productCode !== undefined) await this.fill('Product Code / ID', d.productCode);
    await this.select('Product Type', d.productType);
    await this.select('Currency', d.currency);
    if (d.status) await this.select('Status', d.status);
    if (d.fiscalYear) await this.select('Fiscal Year', d.fiscalYear);
    if (d.description !== undefined) await this.fill('Product Description', d.description);
  }
  get descriptionCounter(): Locator {
    return this.page.getByText(/\d+\/1000 characters/);
  }
}

/** Step 2 - Loan Structure */
export class LoanStructureStep extends BaseForm {
  async fillAll(d: LoanStructureData): Promise<void> {
    await this.fill('Minimum Amount', d.minAmount);
    await this.fill('Maximum Amount', d.maxAmount);
    await this.select('Select tenure type', d.tenureType);
    await this.fill('Min Months', d.minMonths);
    await this.fill('Max Months', d.maxMonths);
    if (d.permittedTenor !== undefined) await this.fill('Permitted Tenor', d.permittedTenor);
    await this.select('Repayment Frequency', d.repaymentFrequency);
    await this.setToggle('Down Payment Options', d.downPayment.enabled);
    if (d.downPayment.enabled) {
      await this.choose('Percentage');
      await this.choose(d.downPayment.basis);
      await this.fill('Minimum Down Payment (%)', d.downPayment.minPct);
      await this.fill('Maximum Down Payment (%)', d.downPayment.maxPct);
    }
    await this.setToggle('Transactions number', d.limits.maxTransactions !== undefined);
    if (d.limits.maxTransactions !== undefined) await this.fill('Max Transactions number', d.limits.maxTransactions);
    await this.setToggle('Applications number per user', d.limits.maxApplications !== undefined);
    if (d.limits.maxApplications !== undefined) await this.fill('Max Applications number', d.limits.maxApplications);
    await this.setToggle('Enable sharing limit with others', d.limits.maxSharing !== undefined);
    if (d.limits.maxSharing !== undefined) await this.fill('Max Number of sharing', d.limits.maxSharing);
    await this.setToggle('Loan Guarantor', d.guarantor.enabled);
    if (d.guarantor.enabled) {
      await this.fill('Minimum Number', d.guarantor.min);
      await this.fill('Maximum Number', d.guarantor.max);
      await this.select('Guarantor type', d.guarantor.type);
    }
  }
}

/** Step 3 - Financial Rules (tabs: Interest Rate, Fees, Disbursement Rules, Collection Rules, Rounding) */
export class FinancialRulesStep extends BaseForm {
  tab(name: 'Interest Rate' | 'Fees' | 'Disbursement Rules' | 'Collection Rules' | 'Rounding'): Locator {
    return this.page.getByRole('tab', { name }).or(this.page.getByRole('button', { name, exact: true })).first();
  }
  async openTab(name: Parameters<FinancialRulesStep['tab']>[0]): Promise<void> {
    await this.tab(name).click();
  }
  get addFeeButton(): Locator {
    return this.page.getByRole('button', { name: /Add New/ });
  }
  get removeFeeButtons(): Locator {
    return this.page.getByRole('button', { name: /Remove/ });
  }
  get disbursementRequiredMessage(): Locator {
    return this.page.getByText('At least one disbursement method is required');
  }
  /** Removes every fee row in the Fees List. */
  async removeAllFees(): Promise<void> {
    while ((await this.removeFeeButtons.count()) > 0) {
      await this.removeFeeButtons.first().click();
    }
  }
  async selectDisbursementMethod(method: string): Promise<void> {
    await this.page.getByText('Select method', { exact: true }).click();
    await this.page.getByRole('option', { name: method }).or(this.page.getByText(method, { exact: true })).last().click();
    await this.page.keyboard.press('Escape');
  }
  selectedMethodChip(method: string): Locator {
    return this.page.getByText('Selected Methods:').locator('xpath=following::*').filter({ hasText: method }).first();
  }
  async fillAll(d: FinancialRulesData): Promise<void> {
    await this.openTab('Interest Rate');
    await this.fill('Interest Rate', d.interestRate);
    await this.select('Interest Type', d.interestType);
    await this.openTab('Fees');
    await this.setToggle('Admin fee', d.adminFee.enabled);
    if (d.adminFee.enabled) {
      await this.choose(d.adminFee.basis);
      await this.fill('PERCENTAGE', d.adminFee.percentage);
    }
    if (d.removeAllFees) await this.removeAllFees();
    await this.openTab('Disbursement Rules');
    await this.selectDisbursementMethod(d.disbursementMethod);
    await this.fill('Processing Days', d.processingDays);
    await this.openTab('Collection Rules');
    for (const t of ['Late Fee', 'Late Installment Rule', 'Allow Partial Payment', 'Allow Early Settlement']) {
      await this.setToggle(t, false);
    }
    await this.openTab('Rounding');
  }
}

/** Step 4 - Eligibility Criteria */
export class EligibilityStep extends BaseForm {
  get summary(): Locator {
    return this.page.getByText('Eligibility Summary').locator('xpath=..');
  }
  async fillAll(d: EligibilityData): Promise<void> {
    await this.fill('Minimum Age', d.minAge);
    await this.fill('Maximum Age', d.maxAge);
    await this.setToggle('Minimum Monthly Income', d.minMonthlyIncome !== undefined);
    if (d.minMonthlyIncome !== undefined) await this.fill('Minimum Monthly Income (EGP)', d.minMonthlyIncome);
    await this.setToggle('Credit Score Requirement', d.minCreditScore !== undefined);
    if (d.minCreditScore !== undefined) await this.fill('Minimum Credit Score', d.minCreditScore);
  }
}

/** Step 5 - Associated Workflow */
export class AssociatedWorkflowStep extends BaseForm {
  workflowCard(name: string): Locator {
    return this.page.locator('div').filter({ has: this.page.getByText(name, { exact: true }) }).filter({ has: this.page.getByText(/Edit Workflow/) }).last();
  }
  async selectWorkflow(name: string): Promise<void> {
    await this.workflowCard(name).getByRole('radio').first().check({ force: true });
  }
  get workflowRadios(): Locator {
    return this.page.getByRole('radio');
  }
}

/**
 * Step 6 - Decision Engine.
 * Design confirmed by the PO on 16-Oct-2026 (G-26): no "Connect Decision Engine" step. Selecting an engine shows
 * "Configure Field Mappings" at once, and the engine is linked automatically when the product is saved.
 */
export class DecisionEngineStep extends BaseForm {
  get engineDropdown(): Locator {
    return this.page.getByText('Select a decision engine...', { exact: true }).first().or(this.page.getByRole('combobox').first());
  }
  /** Removed by design (G-26); kept so specs can assert it is absent. */
  get connectButton(): Locator {
    return this.page.getByRole('button', { name: /Connect Decision Engine/ });
  }
  get configureMappingsNotice(): Locator {
    return this.page.getByText('The decision engine will be linked automatically when you save the product.');
  }
  get fieldMappingHeading(): Locator {
    return this.page.getByText('Field Mapping Configuration', { exact: true });
  }
  get saveMappingsButton(): Locator {
    return this.page.getByRole('button', { name: /Save Mappings/ });
  }
  get mappingsSavedMessage(): Locator {
    return this.page.getByRole('alert').filter({ hasText: 'Mappings saved' });
  }
  async chooseEngine(name: string): Promise<void> {
    // Staging renders a native <select> with placeholder "Select decision engine...".
    const native = this.page.locator('select').filter({ has: this.page.locator('option', { hasText: name }) });
    if (await native.count()) {
      await native.first().selectOption({ label: name });
    } else {
      await this.engineDropdown.click();
      await this.page.getByRole('option', { name }).or(this.page.getByText(name, { exact: true })).last().click();
    }
  }
  /** Waits for the mapping section that appears after an engine is selected. */
  async expectMappingReady(): Promise<void> {
    await expect(this.configureMappingsNotice).toBeVisible();
    await expect(this.fieldMappingHeading).toBeVisible();
  }
  /** Mapping tab, e.g. "financial (0)" / "Financial (1)": the number is the count of mapped fields. */
  mappingTab(group: 'financial' | 'personal'): Locator {
    return this.page.getByRole('tab', { name: new RegExp(`^${group} `, 'i') });
  }
  /** Fields render only after their tab is opened. */
  async openMappingTab(group: 'financial' | 'personal'): Promise<void> {
    await this.mappingTab(group).click();
    await expect(this.page.getByRole('tabpanel')).toBeVisible();
  }
  /** Row of one engine input, found by its key, e.g. "financial.credit_score". Comboboxes: 0 = Workflow, 1 = Customer. */
  mappingRow(fieldKey: string): Locator {
    return this.page
      .getByRole('tabpanel')
      .locator('div')
      .filter({ has: this.page.getByText(fieldKey, { exact: true }) })
      .filter({ has: this.page.getByRole('combobox') })
      .last();
  }
  async mapToCustomer(fieldKey: string, option?: string): Promise<string> {
    await this.mappingRow(fieldKey).getByRole('combobox').nth(1).click();
    const choice = option
      ? this.page.getByRole('option', { name: option, exact: true })
      : this.page.getByRole('option').filter({ hasNotText: 'No mapping' }).first();
    const label = (await choice.innerText()).trim();
    await choice.click();
    return label;
  }
}

/** Step 7 - Merchants (read-only, sourced from the Merchants Management System) */
export class MerchantsStep extends BaseForm {
  get readOnlyNote(): Locator {
    return this.page.getByText(/This list is read-only here - manage merchant enablement in MMS/);
  }
  get emptyState(): Locator {
    return this.page.getByText('No merchants enabled', { exact: true });
  }
  get loading(): Locator {
    return this.page.getByText('Loading merchants...');
  }
}

/** Loan Products list (/loan-product-config) */
export class ProductListPage extends BaseForm {
  async goto(): Promise<void> {
    await this.page.goto('/loan-product-config', { waitUntil: 'domcontentloaded' }); // full 'load' can exceed 30 s on staging
    await expect(this.page.getByRole('heading', { name: 'Loan Products' }).or(this.page.getByText('Loan Products', { exact: true })).first()).toBeVisible();
  }
  async search(text: string): Promise<void> {
    const box = this.page.getByPlaceholder('Search products by name, ID, or description...');
    await box.fill(text);
    await box.press('Enter');
  }
  row(text: string): Locator {
    return this.page.getByRole('row').filter({ hasText: text }).or(this.page.locator('tr, [role="row"], div').filter({ hasText: text }).filter({ hasText: /ACTIVE|INACTIVE|Draft|PENDING REVIEW/i })).first();
  }
  get addButton(): Locator {
    return this.page.getByRole('button', { name: /Add Loan Product/ }).or(this.page.getByRole('link', { name: /Add Loan Product/ })).first();
  }
}

export function stepPages(page: Page) {
  return {
    general: new GeneralInformationStep(page),
    structure: new LoanStructureStep(page),
    financial: new FinancialRulesStep(page),
    eligibility: new EligibilityStep(page),
    workflow: new AssociatedWorkflowStep(page),
    engine: new DecisionEngineStep(page),
    merchants: new MerchantsStep(page),
    list: new ProductListPage(page),
  };
}

export { expect };
