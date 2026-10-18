# Coverage Matrix

Requirement ids are derived from evidence (video, Loan Structure and Financial Rules suites) because Jira stories were not accessible (G-01).

| Requirement | Description | Source | Add | Edit | Cases | Automated | Status | Gaps |
|---|---|---|---|---|---|---|---|---|
| LPC-REQ-001 | Wizard has 7 ordered steps with statuses In Progress / Completed / Pending and a header completion % (ROUND(completed/7*100)). | Video (Add + Edit) | FLOW-LPC-ADD-001<br>FLOW-LPC-ADD-038 | FLOW-LPC-EDIT-001 | 3 | 3 | Covered (scripted) | - |
| LPC-REQ-002 | Add page opens as 'Create New Loan Product', 0% completed, Step 1 In Progress; defaults Status = Active, Fiscal Year = 360 days, Currency empty. | Video (Add) | FLOW-LPC-ADD-001 | - | 1 | 1 | Covered (scripted) | - |
| LPC-REQ-003 | Step 1 required fields (*): Product Name, Product Code / ID, Product Type, Currency, Fiscal Year. Status and Description are optional. | Video (Add) | FLOW-LPC-ADD-002<br>FLOW-LPC-ADD-003<br>FLOW-LPC-ADD-005<br>FLOW-LPC-ADD-007 | FLOW-LPC-EDIT-006 | 5 | 4 | Partially scripted | G-05, G-10, G-11, G-12 |
| LPC-REQ-004 | Product Description limited to 1000 characters with a live counter 'n/1000 characters'. | Video (Add) | FLOW-LPC-ADD-004 | - | 1 | 1 | Covered (scripted) | - |
| LPC-REQ-005 | Product Code / ID is read-only in Edit. | Video (Edit 563) | - | FLOW-LPC-EDIT-004 | 1 | 1 | Covered (scripted) | - |
| LPC-REQ-006 | Product Code / ID uniqueness and format. | Not documented - gap G-10 | FLOW-LPC-ADD-005<br>FLOW-LPC-ADD-006 | - | 2 | 0 | Designed - blocked/pending | G-04, G-10, G-11 |
| LPC-REQ-007 | Cancel leaves the wizard without saving the current step. | Button observed; behaviour proposed | FLOW-LPC-ADD-008 | FLOW-LPC-EDIT-007 | 2 | 2 | Covered (scripted) | - |
| LPC-REQ-008 | Save & Continue saves the step, marks it Completed and opens the next step; product shows 'Saved as draft'. | Video (Edit) | FLOW-LPC-ADD-002<br>FLOW-LPC-ADD-010<br>FLOW-LPC-ADD-015<br>FLOW-LPC-ADD-036<br>FLOW-LPC-ADD-041 | FLOW-LPC-EDIT-001<br>FLOW-LPC-EDIT-005<br>FLOW-LPC-EDIT-010 | 8 | 6 | Partially scripted | G-03, G-04 |
| LPC-REQ-009 | Previous returns to the prior step keeping entered data. | LS suite | FLOW-LPC-ADD-014 | - | 1 | 1 | Covered (scripted) | - |
| LPC-REQ-010 | Loan Structure rules (amount range, tenure, down payment, limits, guarantor) per Loan Structure suite. | LS-REQ-001..037 | FLOW-LPC-ADD-010<br>FLOW-LPC-ADD-011<br>FLOW-LPC-ADD-012<br>FLOW-LPC-ADD-013 | FLOW-LPC-EDIT-008<br>FLOW-LPC-EDIT-009 | 6 | 6 | Covered (scripted) | - |
| LPC-REQ-011 | Financial Rules (interest, fees, disbursement, collection, rounding) per Financial Rules suite; admin fee 'Maximum 100% from principle amount'. | FR-REQ-001..043 + video | FLOW-LPC-ADD-015<br>FLOW-LPC-ADD-017<br>FLOW-LPC-ADD-018<br>FLOW-LPC-ADD-042 | FLOW-LPC-EDIT-011<br>FLOW-LPC-EDIT-013 | 6 | 5 | Partially scripted | G-06, G-13 |
| LPC-REQ-012 | At least one disbursement method is required ('At least one disbursement method is required'). | Video (Edit) | FLOW-LPC-ADD-016 | FLOW-LPC-EDIT-014 | 2 | 2 | Covered (scripted) | - |
| LPC-REQ-013 | Collection rule toggles (Late Fee, Late Installment Rule, Partial Payment, Early Settlement) are optional; LATE MAXIMUM DAYS* required when Late Fee is on. | Video (Edit) | FLOW-LPC-ADD-019<br>FLOW-LPC-ADD-020 | FLOW-LPC-EDIT-012 | 3 | 3 | Covered (scripted) | - |
| LPC-REQ-014 | Eligibility Minimum Age* and Maximum Age* are required. | Video (Edit) | FLOW-LPC-ADD-021<br>FLOW-LPC-ADD-022 | FLOW-LPC-EDIT-015 | 3 | 3 | Covered (scripted) | G-18 |
| LPC-REQ-015 | Minimum Monthly Income (EGP)* and Minimum Credit Score* become visible and required when their toggles are on. | Video (Edit) | FLOW-LPC-ADD-023 | - | 1 | 1 | Covered (scripted) | - |
| LPC-REQ-016 | Credit score helper 'typically 300-850 range'; enforcement unknown (0 was accepted). | Video; gap G-07 | FLOW-LPC-ADD-024 | - | 1 | 0 | Designed - blocked/pending | G-07 |
| LPC-REQ-017 | Occupation criteria: Allowed / Disallowed with 'Select occupation'. | Video (Edit) | FLOW-LPC-ADD-025 | - | 1 | 0 | Designed - blocked/pending | - |
| LPC-REQ-018 | Geographic criteria: Governorate -> City -> Area cascade; child disabled until parent selected. | Video (Edit) | FLOW-LPC-ADD-026 | - | 1 | 1 | Covered (scripted) | G-19 |
| LPC-REQ-019 | Eligibility Summary reflects entered criteria (e.g. 'Age: 18 - 65 years'). | Video (Edit) | FLOW-LPC-ADD-021 | FLOW-LPC-EDIT-015 | 2 | 2 | Covered (scripted) | - |
| LPC-REQ-020 | Associated Workflow: select one workflow (radio) showing steps, version, creator, with 'Edit Workflow' link. | Video (Edit) | FLOW-LPC-ADD-027<br>FLOW-LPC-ADD-028<br>FLOW-LPC-ADD-029<br>FLOW-LPC-ADD-042 | FLOW-LPC-EDIT-016 | 5 | 2 | Partially scripted | G-09, G-13 |
| LPC-REQ-021 | Decision Engine: selecting an engine shows field mapping at once; the engine is linked automatically when the product is saved (no 'Connect Decision Engine' step, G-26). | Video (Edit) | FLOW-LPC-ADD-030 | FLOW-LPC-EDIT-017 | 2 | 2 | Covered (scripted) | G-26 (resolved) |
| LPC-REQ-022 | Field Mapping: Financial/Personal tabs, Workflow/Customer mapping per field, 'Save Mappings (n)' enabled when n > 0. | Video (Edit) | FLOW-LPC-ADD-030<br>FLOW-LPC-ADD-032 | FLOW-LPC-EDIT-017 | 3 | 3 | Covered (scripted) | - |
| LPC-REQ-023 | Merchants step is read-only (managed in MMS) with loading and empty states. | Video (Edit); Merchant PDF | FLOW-LPC-ADD-034 | FLOW-LPC-EDIT-021 | 2 | 2 | Covered (scripted) | - |
| LPC-REQ-024 | Edit: 'Update Product' -> 'Product updated successfully!', 100%, banner cleared, list Review Status PENDING REVIEW. | Video (Edit + list) | - | FLOW-LPC-EDIT-018<br>FLOW-LPC-EDIT-019 | 2 | 2 | Covered (scripted) | G-14 |
| LPC-REQ-025 | Add: final action on Step 7 creates the product. | Not observed - gap G-03 | FLOW-LPC-ADD-035<br>FLOW-LPC-ADD-036 | - | 2 | 0 | Designed - blocked/pending | G-03, G-04 |
| LPC-REQ-026 | Edit change banner 'N fields changed in <steps> - not yet submitted for review.' with Discard changes / Submit for Review. | Video (Edit) | - | FLOW-LPC-EDIT-005<br>FLOW-LPC-EDIT-008<br>FLOW-LPC-EDIT-015<br>FLOW-LPC-EDIT-022<br>FLOW-LPC-EDIT-023<br>FLOW-LPC-EDIT-024 | 6 | 4 | Partially scripted | G-21, G-23 |
| LPC-REQ-027 | Product list: search by name/ID/description, filters, columns, counters, pagination. | Video (list) | - | FLOW-LPC-EDIT-030 | 1 | 1 | Covered (scripted) | - |
| LPC-REQ-028 | Pending (unapproved) edits do not change the active version. | Proposed - gap G-15 | - | FLOW-LPC-EDIT-025<br>FLOW-LPC-EDIT-026<br>FLOW-LPC-EDIT-028 | 3 | 0 | Designed - blocked/pending | G-15, G-24 |
| LPC-REQ-029 | Only authorised roles can add or edit products. | Proposed - gap G-16 | FLOW-LPC-ADD-039 | FLOW-LPC-EDIT-003 | 2 | 0 | Designed - blocked/pending | G-16 |
| LPC-REQ-030 | Server-side validation mirrors UI rules. | Proposed - gap G-17 | FLOW-LPC-ADD-009 | - | 1 | 0 | Designed - blocked/pending | G-17 |
| LPC-REQ-031 | Concurrent edits of the same product are detected. | Proposed - gap G-20 | - | FLOW-LPC-EDIT-027 | 1 | 0 | Designed - blocked/pending | G-20 |
| LPC-REQ-032 | Invalid or unknown edit id is handled without exposing a form. | Proposed | - | FLOW-LPC-EDIT-002 | 1 | 0 | Designed - blocked/pending | - |
| LPC-REQ-033 | Save & Continue must not proceed while a required field is empty. | Video anomaly - gaps G-05, G-06 | FLOW-LPC-ADD-003<br>FLOW-LPC-ADD-011<br>FLOW-LPC-ADD-017 | FLOW-LPC-EDIT-006<br>FLOW-LPC-EDIT-013 | 5 | 5 | Covered (scripted) | G-05, G-06 |
| LPC-REQ-034 | Required decision-engine field mappings are enforced (or engine optional). | Video anomaly - gap G-08 | FLOW-LPC-ADD-031<br>FLOW-LPC-ADD-033 | - | 2 | 0 | Designed - blocked/pending | G-08 |
| LPC-REQ-035 | Repeated clicks on save/update do not create duplicate records or versions. | Proposed (error guessing) | FLOW-LPC-ADD-037 | FLOW-LPC-EDIT-020 | 2 | 1 | Partially scripted | G-17 |

## Supplemental automation cases

These spec-only IDs were not present in the original Add/Edit workbook. They are retained in the consolidated catalog and linked to their current automation paths; requirement mapping remains unassigned unless stated in the source.

| Case ID | Workflow location | Automation spec |
|---|---|---|
| `FLOW-LPC-ADD-S00A-001` | `workflow-level/add` | `tests/ui/loan-product-configuration/workflow-level/add/FLOW-LPC-ADD-S00A-001-loan-products-list-shows-counters-search-filters-columns-and.spec.ts` |
| `FLOW-LPC-ADD-S01-001` | `01-General-Information/add` | `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-S01-001-step-1-shows-required-markers-placeholders-and-defaults.spec.ts` |
| `FLOW-LPC-EDIT-S03D-001` | `03-Financial-Rules/edit` | `tests/ui/loan-product-configuration/03-Financial-Rules/edit/FLOW-LPC-EDIT-S03D-001-delinquency-duration-unit-and-collection-rules-helper-texts.spec.ts` |
| `FLOW-LPC-EDIT-S04-001` | `04-Eligibility-Criteria/edit` | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/edit/FLOW-LPC-EDIT-S04-001-age-fields-are-required-and-accept-whole-numbers-only.spec.ts` |
| `FLOW-LPC-EDIT-S04-002` | `04-Eligibility-Criteria/edit` | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/edit/FLOW-LPC-EDIT-S04-002-minimum-monthly-income-toggle-reveals-a-required-field.spec.ts` |
| `FLOW-LPC-EDIT-S04-003` | `04-Eligibility-Criteria/edit` | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/edit/FLOW-LPC-EDIT-S04-003-credit-score-0-keeps-save-continue-disabled-turning-the-togg.spec.ts` |
| `FLOW-LPC-EDIT-S04-004` | `04-Eligibility-Criteria/edit` | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/edit/FLOW-LPC-EDIT-S04-004-geographic-cascade-city-and-area-disabled-without-a-governor.spec.ts` |
| `FLOW-LPC-EDIT-S05-001` | `05-Associated-Workflow/edit` | `tests/ui/loan-product-configuration/05-Associated-Workflow/edit/FLOW-LPC-EDIT-S05-001-workflow-cards-show-name-description-status-steps-version-cr.spec.ts` |
| `FLOW-LPC-EDIT-S05-002` | `05-Associated-Workflow/edit` | `tests/ui/loan-product-configuration/05-Associated-Workflow/edit/FLOW-LPC-EDIT-S05-002-save-continue-stays-disabled-until-a-workflow-is-selected.spec.ts` |
| `FLOW-LPC-EDIT-S06-001` | `06-Decision-Engine/edit` | `tests/ui/loan-product-configuration/06-Decision-Engine/edit/FLOW-LPC-EDIT-S06-001-field-mapping-lists-engine-fields-defaults-to-no-mapping-and.spec.ts` |
| `FLOW-LPC-EDIT-S06-002` | `06-Decision-Engine/edit` | `tests/ui/loan-product-configuration/06-Decision-Engine/edit/FLOW-LPC-EDIT-S06-002-mapping-fields-updates-the-tab-count-and-enables-save-mappin.spec.ts` |
| `FLOW-LPC-EDIT-S10-001` | `07-Merchants/edit` | `tests/ui/loan-product-configuration/07-Merchants/edit/FLOW-LPC-EDIT-S10-001-list-shows-the-update-with-workflows-counter-pending-review.spec.ts` |
