import * as path from 'path';

/** Staging front end. Used only when neither BASE_URL nor the legacy LOAN_PRODUCT_APP_URL is set. */
export const DEFAULT_BASE_URL = 'https://frontend.aws-stage.flowsky.co';

/** Session written by fixtures/global-setup.ts after a credential login. */
export const DEFAULT_STORAGE_STATE = path.resolve(__dirname, '../../.auth/user.json');

/**
 * Single source of truth for the application origin.
 * BASE_URL wins; LOAN_PRODUCT_APP_URL is still accepted for the step suites migrated from Flow.
 */
export function baseUrl(): string {
  return process.env.BASE_URL || process.env.LOAN_PRODUCT_APP_URL || DEFAULT_BASE_URL;
}

/** A pre-recorded session (PLAYWRIGHT_STORAGE_STATE) replaces the credential login when it is set. */
export function storageStatePath(): string {
  const preRecorded = process.env.PLAYWRIGHT_STORAGE_STATE;
  return preRecorded ? path.resolve(preRecorded) : DEFAULT_STORAGE_STATE;
}

export function appUrl(urlPath: string): string {
  return new URL(urlPath, baseUrl()).toString();
}
