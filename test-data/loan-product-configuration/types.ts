export interface GeneralInfoData {
  productName: string;
  productCode?: string;
  productType: string;
  currency: string;
  status?: string;
  fiscalYear?: string;
  description?: string;
}

export interface LoanStructureData {
  minAmount: number;
  maxAmount: number;
  tenureType: string;
  minMonths: number;
  maxMonths: number;
  permittedTenor?: number;
  repaymentFrequency: string;
  downPayment: { enabled: boolean; basis: string; minPct: number; maxPct: number };
  limits: { maxTransactions?: number; maxApplications?: number; maxSharing?: number };
  guarantor: { enabled: boolean; min: number; max: number; type: string };
}

export interface FinancialRulesData {
  interestRate: number;
  interestType: string;
  adminFee: { enabled: boolean; basis: string; percentage: number };
  removeAllFees: boolean;
  disbursementMethod: string;
  processingDays: number;
}

export interface EligibilityData {
  minAge: number;
  maxAge: number;
  minMonthlyIncome?: number;
  minCreditScore?: number;
}
