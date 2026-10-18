/** Independent calculators used to derive expected values in assertions. */

/** Header completion % observed on staging: 0, 29, 43, 71, 86, 100 for 0, 2, 3, 5, 6, 7 completed steps (7 steps). */
export function completionPercent(completedSteps: number, totalSteps = 7): number {
  return Math.round((completedSteps / totalSteps) * 100);
}

/** Flat interest = principal x annual rate x months / 12 (assumption A-03 in the earlier Financial Rules suite; confirm with PO). */
export function flatInterest(principal: number, annualRatePct: number, months: number): number {
  return round2((principal * (annualRatePct / 100) * months) / 12);
}

/** Decreasing (annuity) installment with monthly rate = annual / 12. */
export function annuityInstallment(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  return round2((principal * r) / (1 - Math.pow(1 + r, -months)));
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Formats 1000000 as "1,000,000" (observed amount formatting). */
export function thousands(n: number): string {
  return n.toLocaleString('en-US');
}
