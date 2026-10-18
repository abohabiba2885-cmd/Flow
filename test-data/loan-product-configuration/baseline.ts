import { GeneralInfoData, LoanStructureData, FinancialRulesData, EligibilityData } from './types';

/**
 * Baseline valid data. Every value is taken from an observed screen (16-Oct-2026 recording, product 563)
 * or from the Loan Structure / Financial Rules source workbooks - not invented.
 */
export function uniqueCode(prefix = process.env.TEST_PRODUCT_PREFIX || 'QA-LPC'): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

export function generalInfo(overrides: Partial<GeneralInfoData> = {}): GeneralInfoData {
  const code = uniqueCode();
  return {
    productName: `QA Loan Product ${code}`,
    productCode: code,
    productType: 'Business Loan', // observed option
    currency: 'EGP - Egyptian Pound', // observed option
    status: 'Active', // observed default
    fiscalYear: '360 days', // observed default
    description: 'Created by Playwright automation for Loan Product Configuration tests.',
    ...overrides,
  };
}

export const loanStructure: LoanStructureData = {
  minAmount: 10000, // observed 10,000
  maxAmount: 1000000, // observed 1,000,000
  tenureType: 'Monthly',
  minMonths: 6,
  maxMonths: 12,
  permittedTenor: 3,
  repaymentFrequency: 'Monthly',
  downPayment: { enabled: true, basis: 'From principle amount', minPct: 10, maxPct: 50 },
  limits: { maxTransactions: 5, maxApplications: 2, maxSharing: 2 },
  guarantor: { enabled: true, min: 1, max: 2, type: 'First Degree' },
};

export const financialRules: FinancialRulesData = {
  interestRate: 10, // observed entry
  interestType: 'Flat', // observed
  adminFee: { enabled: true, basis: 'From loan amount (principal)', percentage: 2 },
  removeAllFees: true, // observed: all fee rows removed before saving
  disbursementMethod: 'Mobile Wallet', // observed option
  processingDays: 1, // observed
};

export const eligibility: EligibilityData = {
  minAge: 18, // observed
  maxAge: 65, // observed
  minMonthlyIncome: 5000, // placeholder value shown in the field ("e.g., 5000")
  minCreditScore: 600, // inside helper range "typically 300-850"
};

export const workflowName = 'Default Workflow'; // observed workflow (active, v1.0.0)
export const decisionEngineName = 'Credit Lending - Egyptian Banking Rules'; // observed engine option
