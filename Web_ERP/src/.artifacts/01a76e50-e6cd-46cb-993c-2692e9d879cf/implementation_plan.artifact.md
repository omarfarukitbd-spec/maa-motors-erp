# Implementation Plan: Fix Account Number Generation and Zone Saving

This plan addresses the issue where the new account number design (Zone Code + Serial) is not being correctly saved to the database, and fixes the error encountered when adding a new zone.

## User Review Required

> [!IMPORTANT]
> The current implementation of `saveNewCustomer` only saves the 4-digit serial as the account number. I will change this to `ZoneCode + Serial` to match the UI preview. Please confirm if this is the desired format (e.g., if Zone Code is `11` and Serial is `0001`, the account number will be `110001`).

## Proposed Changes

### [Component Name] Database Access Layer (DAO)

#### [MODIFY] [dao.js](file:///D:/Office Excel/Web_ERP/src/dao.js)
- Remove redundant `getByCustomer` methods from `SettingsDAO`, `ZoneDAO`, `UserDAO`, `ExpenseDAO`, and `AuditDAO`.
- Ensure `SettingsDAO.getNextAccountNo` and `peekNextAccountNo` are consistent.

### [Component Name] Customer Management

#### [MODIFY] [customer.js](file:///D:/Office Excel/Web_ERP/src/customer.js)
- **Fix `saveNewCustomer`**: Update the logic to fetch the selected zone's code and prepend it to the generated serial number before saving.
- **Improve `quickAddZone`**: Add more descriptive error messages to help diagnose why a zone cannot be saved (e.g., checking if it's a permission issue or a missing index).
- Ensure the `accountNo` is correctly displayed and handled during editing.

### [Component Name] Admin Panel (Audit)

#### [MODIFY] [admin.js](file:///D:/Office Excel/Web_ERP/src/admin.js)
- Verify if any admin tools for account numbers need adjustment based on the new `ZoneCode + Serial` format.

## Verification Plan

### Automated Tests
- I will manually verify the fix by simulating the zone addition and customer saving flows.

### Manual Verification
1.  **Add a New Zone**: Verify that a new zone with a specific code can be saved without error.
2.  **Create a New Customer**: Select the new zone and verify that the generated account number in the UI and the one saved in Firestore both follow the `ZoneCode + Serial` format.
3.  **Edit Customer**: Verify that editing a customer preserves or correctly updates the account number if the zone changes (if applicable).
