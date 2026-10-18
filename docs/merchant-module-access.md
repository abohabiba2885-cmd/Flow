# Merchant module automation: what is needed

**Status (17 Oct 2026):** 145 distinct merchant-module test cases have no Playwright script. The application under test is the Merchants Management System (`https://mms-staging.flowsky.co`), plus the Flow back-office screens for merchant oversight. No login and no screen evidence are available yet, so no selector can be verified.

## Where the cases are

| Workbook | Merchant cases |
|---|---:|
| `test-cases/loan-product-configuration/source/Flowsky_Minimum_Coverage_Jira_TestCases.xlsx` | 131 |
| `test-cases/merchant-module/source/Flowsky_Merchant_Module_Full_Coverage_2026-10-15.xlsx` | 115 (102 duplicate the row above by title) |
| `test-cases/merchant-module/source/Flowsky_FS-643-645_Story_Scoped_2026-10-15.xlsx` | 30 settlement-cycle cases |

Distinct by title: **145**.

| Area | Cases |
|---|---:|
| Finance Configuration | 29 |
| Onboarding | 22 |
| Finance & Wallet | 14 |
| Purchase | 13 |
| Compliance | 10 |
| Refund | 10 |
| Activation & Users | 9 |
| Settlement | 9 |
| Product Integration | 7 |
| Risk & Blocking | 6 |
| Merchant Dashboard | 4 |
| Branch | 4 |
| Notifications & Audit | 4 |
| Oversight | 3 |
| Settlement cycles (FS-643/644/645) | 1 not already counted above |

## What is needed, and where to get it

| # | Item | Why | Where to get it |
|---|---|---|---|
| 1 | One staging user per role, filled into `.env` (keys already in `.env.example`) | The cases act as different roles | Flow platform/DevOps team or the QA lead who administers staging users |
| | - Merchant Admin (`MMS_MERCHANT_ADMIN_*`) | Onboarding, users, dashboard | |
| | - Branch Manager BM-1 (`MMS_BRANCH_MANAGER_*`) | Branch cases | |
| | - Sales Person SP-1, assigned to branch BR-1 (`MMS_SALES_PERSON_*`) | Purchase and refund (71 cases mention SP-1) | |
| | - Flow Merchant Acquisition Officer and Manager (`FLOW_ACQUISITION_*`) | Onboarding approval (maker-checker) | |
| | - Flow Finance Officer FO-1 (`FLOW_FINANCE_OFFICER_*`) | Finance configuration and settlement | |
| | - Flow Compliance Officer (`FLOW_COMPLIANCE_OFFICER_*`) | Compliance cases | |
| 2 | QA-owned test data on staging | Cases start from it | Same team as item 1 |
| | - Merchant MER-A, active, with branch BR-1 active (`MMS_MERCHANT_ID`, `MMS_BRANCH_ID`) | | |
| | - Eligible customer CUST-1 with an active credit limit (`MMS_CUSTOMER_NATIONAL_ID`) | Purchase and refund | |
| | - Settlement account ACC-1 (approved, default) | Finance and settlement | |
| | - An approved, active loan product enabled for MER-A | Purchase uses it | Loan Product Configuration: approve one QA product |
| 3 | Screens of the merchant flows: a screen recording (like `2026-10-16_16-34-44.mp4` for LPC) or the Figma file | Selectors and expected texts must come from the real UI | Product Owner or design team. Figma "Flow - Merchants Portal" returns 403 to automation, so send PNG exports or a recording |
| 4 | How purchases are created in test (customer app, QR or API) and whether an OTP is involved | 13 purchase and 10 refund cases need a purchase | Backend team / PO |
| 5 | Confirmation that automation may create merchants, branches and users on MMS staging, and how to clean them up | Tests create data | QA lead / PO |

## What happens after delivery

1. Add an `mms-chromium` Playwright project with its own base URL and login per role.
2. Create `tests/ui/merchant-module/<area>/<ID>-<slug>.spec.ts`, one spec per case. The workbook IDs (FLOW-001…) are reused across workbooks, so the merchant cases get IDs `MM-001…` mapped to their source rows in a catalog sheet.
3. Run, then report passed, failed and skipped with reasons, as for LPC.
