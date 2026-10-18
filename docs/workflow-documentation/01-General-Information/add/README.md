# Add Loan Product Config - Step 01 - General Information

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Add Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-ADD-001 | Add page opens on Step 1 with 0% and documented defaults | Critical | LPC-REQ-001, LPC-REQ-002 | Automated | `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-001-add-page-initial-state-and-defaults.spec.ts` |
| FLOW-LPC-ADD-002 | Save & Continue with valid General Information opens Loan Structure | Critical | LPC-REQ-003, LPC-REQ-008 | Automated | `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-002-complete-general-information-valid.spec.ts` |
| FLOW-LPC-ADD-003 | Each empty required Step 1 field blocks Save & Continue (incl. Currency anomaly) | High | LPC-REQ-003, LPC-REQ-033 | Automated | `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-003-required-fields-block-save.spec.ts` |
| FLOW-LPC-ADD-004 | Product Description accepts 999 and 1000 characters and stops at 1001 | Medium | LPC-REQ-004 | Automated | `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-004-description-1000-character-boundary.spec.ts` |
| FLOW-LPC-ADD-005 | Whitespace-only Product Name / Code are treated as empty | Medium | LPC-REQ-003, LPC-REQ-006 | Candidate | `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-005-name-and-code-whitespace-handling.spec.ts` |
| FLOW-LPC-ADD-006 | Product Code / ID already used by another product is rejected | High | LPC-REQ-006 | Candidate | `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-006-duplicate-product-code-rejected.spec.ts` |
| FLOW-LPC-ADD-007 | Step 1 dropdowns contain the observed reference values | Low | LPC-REQ-003 | Automated | `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-007-dropdown-options-observed-values.spec.ts` |
| FLOW-LPC-ADD-008 | Cancel on Step 1 leaves the wizard without creating a product | High | LPC-REQ-007 | Automated | `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-008-cancel-does-not-create-product.spec.ts` |
| FLOW-LPC-ADD-009 | HTML/script in Product Name and Description is stored as text, not executed | Medium | LPC-REQ-030 | Automated | `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-009-script-input-stored-as-text.spec.ts` |

## Steps and expected results

### FLOW-LPC-ADD-001 - Add page opens on Step 1 with 0% and documented defaults
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* None

1. Open /loan-product-config/add. -> **Expected:** Header 'Create New Loan Product', breadcrumb 'Loan Product Configuration / Add New Product', 0% Completed.
2. Review the stepper. -> **Expected:** General Information = In Progress; the other 6 steps = Pending.
3. Review Step 1 fields. -> **Expected:** Product Name, Product Code / ID empty and editable; Product Type 'Select a product type'; Currency empty; Status 'Active'; Fiscal Year '360 days'; counter '0/1000 characters'.

### FLOW-LPC-ADD-002 - Save & Continue with valid General Information opens Loan Structure
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Name 'QA Loan Product <code>'; Code QA-LPC-<timestamp>; Type Business Loan; Currency EGP - Egyptian Pound; Status Active; Fiscal Year 360 days; description text.

1. Open Add page and fill all Step 1 fields with the test data. -> **Expected:** Values accepted; Save & Continue enabled.
2. Click Save & Continue. -> **Expected:** Loan Structure step opens.
3. Review stepper and header. -> **Expected:** General Information = Completed, Loan Structure = In Progress, header 14% Completed.

### FLOW-LPC-ADD-003 - Each empty required Step 1 field blocks Save & Continue (incl. Currency anomaly)
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Baseline Step 1 data with one of: Product Name, Product Code / ID, Product Type, Currency left empty.

1. Fill all required fields except Product Name; try Save & Continue. -> **Expected:** Button disabled or required error shown; Step 1 remains.
2. Repeat with Product Code / ID empty. -> **Expected:** Same - Step 1 remains.
3. Repeat with Product Type not selected. -> **Expected:** Same - Step 1 remains.
4. Repeat with Currency not selected. -> **Expected:** Same - Step 1 remains (observed defect candidate G-05: button was enabled).

### FLOW-LPC-ADD-004 - Product Description accepts 999 and 1000 characters and stops at 1001
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Strings of 999, 1000 and 1001 characters.

1. Enter 999 characters. -> **Expected:** Counter shows 999/1000 characters.
2. Enter 1000 characters. -> **Expected:** Counter shows 1000/1000 characters; value accepted.
3. Enter 1001 characters. -> **Expected:** Value limited to 1000 characters or a length error is shown and Save & Continue is blocked.

### FLOW-LPC-ADD-005 - Whitespace-only Product Name / Code are treated as empty
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Product Name = '   '; Product Code = '   '; then values with leading/trailing spaces.

1. Fill Step 1 with whitespace-only Product Name. -> **Expected:** Treated as empty: Save & Continue blocked.
2. Fill with whitespace-only Product Code / ID. -> **Expected:** Treated as empty: Save & Continue blocked.
3. Fill name/code with leading and trailing spaces and save. -> **Expected:** Values saved trimmed (to confirm).

### FLOW-LPC-ADD-006 - Product Code / ID already used by another product is rejected
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Ability to create a draft (G-04).  
*Test data:* Code generated by the first draft; same code reused.

1. Create a draft with code QA-LPC-<ts> through Step 1. -> **Expected:** Draft saved.
2. Open Add again and enter the same code with valid other fields; Save & Continue. -> **Expected:** Duplicate code error shown; no second product created.

### FLOW-LPC-ADD-007 - Step 1 dropdowns contain the observed reference values
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Expected options: Business Loan; EGP - Egyptian Pound; Active; 360 days.

1. Open Product Type. -> **Expected:** Contains 'Business Loan'.
2. Open Currency. -> **Expected:** Contains 'EGP - Egyptian Pound'.
3. Open Status. -> **Expected:** Contains 'Active'.
4. Open Fiscal Year. -> **Expected:** Contains '360 days'; helper 'Day-count basis used in rate and late-fee calculations' shown.

### FLOW-LPC-ADD-008 - Cancel on Step 1 leaves the wizard without creating a product
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Unique code QA-LPC-<ts>.

1. Fill Step 1 with valid data. -> **Expected:** Values accepted.
2. Click Cancel. -> **Expected:** User leaves the Add page (target page not observed).
3. Search the product list for the code. -> **Expected:** No product found.

### FLOW-LPC-ADD-009 - HTML/script in Product Name and Description is stored as text, not executed
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Name: <img src=x onerror=alert(1)>QA; Description: <script>alert(1)</script>

1. Fill Step 1 with the payloads and Save & Continue. -> **Expected:** Saved or rejected by validation; no dialog executes.
2. Open the product list and search the code. -> **Expected:** Name rendered as literal text; no dialog executes.

## Additional automation paths

- `tests/ui/loan-product-configuration/01-General-Information/add/FLOW-LPC-ADD-S01-001-step-1-shows-required-markers-placeholders-and-defaults.spec.ts`
