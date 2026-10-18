# Edit workflow-level cases

These cases cover opening an existing product, product-list behavior and cross-cutting behavior that is not owned by one wizard step. The executable specs are under `tests/ui/loan-product-configuration/workflow-level/edit/`.

For step-specific cases, see the [seven-step documentation](../../).

## Cases

- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-001-open-existing-product.spec.ts`
- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-002-invalid-product-id.spec.ts`
- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-003-unauthorized-user-cannot-edit.spec.ts`
- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-022-banner-accumulates-changed-steps.spec.ts`
- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-023-discard-changes-reverts.spec.ts`
- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-024-submit-for-review-from-banner.spec.ts`
- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-025-pending-edits-not-live.spec.ts`
- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-026-edit-while-pending-review.spec.ts`
- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-027-concurrent-edit-detection.spec.ts`
- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-028-existing-loans-unaffected.spec.ts`
- `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-030-product-list-search-and-columns.spec.ts`
