# Implementation Plan: eslint-plugin-prefer-implicit

## Overview

Build an ESLint plugin (TypeScript, ESLint ^10 flat config only) that enforces implicit HTML semantics over explicit ARIA attributes and roles. The plugin ships six rules, shared utility modules, a recommended config preset, and comprehensive tests (example-based via RuleTester + property-based via fast-check). The project uses Vitest for testing and Changesets for release management.

## Tasks

- [x] 1. Project scaffolding and build setup
  - [x] 1.1 Initialize the project with `git init`, create `package.json` with name `eslint-plugin-prefer-implicit`, ESM type, `main`/`types`/`exports` fields pointing to `dist/`, peer dependency on `eslint ^10.0.0`, dev dependencies (`typescript`, `vitest`, `eslint`, `fast-check`, `@changesets/cli`), and `build`, `test`, `lint` scripts
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7, 12.3, 12.4_
  - [x] 1.2 Create `tsconfig.json` configured for ESM output (`module: "NodeNext"`, `target: "ES2022"`, `declaration: true`, `outDir: "dist"`, `rootDir: "src"`)
    - _Requirements: 1.1_
  - [x] 1.3 Create `vitest.config.ts` with TypeScript support
    - _Requirements: 1.3_
  - [x] 1.4 Create `.changeset/config.json` for single-package Changesets configuration
    - _Requirements: 1.4, 12.1, 12.2_
  - [x] 1.5 Create `.gitignore` excluding `node_modules`, `dist`, `.changeset/*.md` temp files, and other build artifacts
    - _Requirements: 1.5_
  - [x] 1.6 Run `npm install` to install all dependencies
    - _Requirements: 1.1_

- [x] 2. Shared utilities — ARIA data module
  - [x] 2.1 Create `src/utils/aria-data.ts` with all declarative lookup tables: `IMPLICIT_ROLE_MAP`, `ROLE_ARIA_LIVE_MAP`, `SUPPORTED_ARIA_BY_ROLE`, `DEFAULT_ARIA_VALUES`, `INTERACTIVE_ELEMENTS`, `STRUCTURAL_ELEMENTS`, `DESTRUCTIVE_ROLES`
    - Populate `IMPLICIT_ROLE_MAP` with element-to-implicit-role mappings including conditional entries (e.g., `<a>` requires `href`)
    - Populate `ROLE_ARIA_LIVE_MAP` with role-to-implied-aria-live mappings (alert→assertive, status→polite, log→polite, marquee→off, timer→off)
    - Populate `SUPPORTED_ARIA_BY_ROLE` with global ARIA attributes set and per-role extensions
    - Populate `DEFAULT_ARIA_VALUES` with spec-defined default values for aria-* attributes
    - Populate `INTERACTIVE_ELEMENTS`, `STRUCTURAL_ELEMENTS`, and `DESTRUCTIVE_ROLES` sets
    - _Requirements: 3.1–3.5, 4.1–4.3, 5.1–5.3, 6.1–6.3, 7.1–7.4, 8.1–8.3_
  - [x] 2.2 Write unit tests for `aria-data.ts` in `tests/utils/aria-data.test.ts`
    - Verify all maps are non-empty and contain expected key entries
    - Verify conditional entries in IMPLICIT_ROLE_MAP work correctly
    - _Requirements: 11.1_

- [x] 3. Shared utilities — attribute utilities module
  - [x] 3.1 Create `src/utils/attribute-utils.ts` with parser-agnostic helpers: `getElementName`, `getStaticAttributeValue`, `hasAttribute`, `isDynamicValue`, `getAttributeNode`
    - Handle ESTree/JSX node shapes (`JSXOpeningElement`, `JSXAttribute` with `Literal` value)
    - Handle Vue node shapes (`VElement`, `VAttribute` with `VLiteral` value)
    - Handle Angular node shapes (`Element$1`, `TextAttribute` vs `BoundAttribute`)
    - Handle plain HTML node shapes (`Tag`/`Element` with string attribute values)
    - Return `null` gracefully for unknown AST shapes
    - _Requirements: 9.1–9.5, 10.1–10.4_
  - [x] 3.2 Write unit tests for `attribute-utils.ts` in `tests/utils/attribute-utils.test.ts`
    - Test static value extraction for JSX literal attributes
    - Test dynamic value detection for JSX expressions
    - Test `getElementName` returns lowercase tag name or null for components
    - Test `hasAttribute` and `getAttributeNode` helpers
    - _Requirements: 10.1–10.4, 11.1_

- [x] 4. Checkpoint — Verify shared utilities compile and tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement rule: no-redundant-role
  - [x] 5.1 Create `src/rules/no-redundant-role.ts` implementing the rule
    - Define `meta` with `type: "suggestion"`, `fixable: "code"`, `messages` with `redundantRole` messageId
    - Implement `create()` visitor for `JSXOpeningElement` (and other element node types)
    - Look up element in `IMPLICIT_ROLE_MAP`, check condition if present, compare static role value to implicit role
    - Report violation with autofix that removes the `role` attribute via `fixer.remove()`
    - Skip dynamic role values
    - _Requirements: 3.1–3.8_
  - [x] 5.2 Write example-based tests for `no-redundant-role` in `tests/rules/no-redundant-role.test.ts`
    - Use ESLint `RuleTester` with JSX parser options
    - Valid cases: different role than implicit, dynamic role value, element with no implicit role, `<div role="button">`
    - Invalid cases: `<button role="button">`, `<nav role="navigation">`, `<ul role="list">`, `<li role="listitem">`, `<table role="table">`
    - Verify autofix output removes the role attribute
    - _Requirements: 3.1–3.8, 11.2, 11.8_
  - [x] 5.3 Write property test for no-redundant-role
    - **Property 1: Redundant role detection is consistent with the implicit role map**
    - Use fast-check to generate random (element, role) pairs from `IMPLICIT_ROLE_MAP`
    - Verify violation iff role matches implicit role; no violation otherwise
    - **Validates: Requirements 3.6, 3.8**

- [x] 6. Implement rule: no-destructive-role
  - [x] 6.1 Create `src/rules/no-destructive-role.ts` implementing the rule
    - Define `meta` with `type: "suggestion"`, `fixable: "code"`, `messages` with `destructiveRole` messageId
    - Check if element is in `INTERACTIVE_ELEMENTS` or `STRUCTURAL_ELEMENTS` (for `<a>`, also check `hasAttribute(node, "href")`)
    - Report violation when static role is in `DESTRUCTIVE_ROLES`, autofix removes role attribute
    - Skip dynamic role values
    - _Requirements: 4.1–4.5_
  - [x] 6.2 Write example-based tests for `no-destructive-role` in `tests/rules/no-destructive-role.test.ts`
    - Valid cases: non-interactive element with `role="none"`, `<a>` without href with `role="presentation"`, dynamic role
    - Invalid cases: `<button role="none">`, `<a href="#" role="presentation">`, `<ul role="presentation">`
    - Verify autofix output
    - _Requirements: 4.1–4.5, 11.3, 11.8_
  - [x] 6.3 Write property test for no-destructive-role
    - **Property 2: Destructive role detection covers all interactive and structural elements**
    - Use fast-check to generate (element from INTERACTIVE_ELEMENTS ∪ STRUCTURAL_ELEMENTS, role from DESTRUCTIVE_ROLES) pairs
    - Verify violation is always reported for these combinations
    - **Validates: Requirements 4.4**

- [-] 7. Implement rule: no-conflicting-aria
  - [x] 7.1 Create `src/rules/no-conflicting-aria.ts` implementing the rule
    - Define `meta` with `type: "suggestion"`, `fixable: "code"`, `messages` with `conflictingAria` messageId
    - Look up role in `ROLE_ARIA_LIVE_MAP`, compare static `aria-live` value to implied value
    - Report violation when values differ, autofix removes `aria-live` attribute
    - No violation when `aria-live` matches implied value (redundant but not conflicting)
    - Skip dynamic `aria-live` values
    - _Requirements: 5.1–5.6_
  - [x] 7.2 Write example-based tests for `no-conflicting-aria` in `tests/rules/no-conflicting-aria.test.ts`
    - Valid cases: `role="alert" aria-live="assertive"` (matching), role not in map, dynamic aria-live, no aria-live attribute
    - Invalid cases: `role="alert" aria-live="polite"`, `role="status" aria-live="assertive"`, `role="log" aria-live="assertive"`
    - Verify autofix output
    - _Requirements: 5.1–5.6, 11.4, 11.8_
  - [x] 7.3 Write property test for no-conflicting-aria
    - **Property 3: Conflicting aria-live detection is consistent with the role-to-live map**
    - Use fast-check to generate (role from ROLE_ARIA_LIVE_MAP, aria-live value) pairs
    - Verify violation iff aria-live differs from implied value; no violation when matching
    - **Validates: Requirements 5.4, 5.6**

- [x] 8. Checkpoint — Verify first three rules compile and tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement rule: no-unsupported-aria
  - [x] 9.1 Create `src/rules/no-unsupported-aria.ts` implementing the rule
    - Define `meta` with `type: "suggestion"`, `fixable: "code"`, `messages` with `unsupportedAria` messageId
    - Determine effective role: explicit static role, or implicit role from `IMPLICIT_ROLE_MAP`
    - For each `aria-*` attribute on the node, check if it's in `SUPPORTED_ARIA_BY_ROLE[effectiveRole]`
    - Report violation for unsupported attributes with static values, autofix removes the attribute
    - Skip elements with no determinable role, skip dynamic attribute values
    - _Requirements: 6.1–6.5_
  - [x] 9.2 Write example-based tests for `no-unsupported-aria` in `tests/rules/no-unsupported-aria.test.ts`
    - Valid cases: supported attribute on element, dynamic attribute value, element with no role
    - Invalid cases: `<div aria-checked="true">`, `<button aria-valuenow="5">`, `<img aria-expanded="true">`
    - Verify autofix output
    - _Requirements: 6.1–6.5, 11.5, 11.8_
  - [x] 9.3 Write property test for no-unsupported-aria
    - **Property 4: Unsupported ARIA attributes are detected based on the role's supported set**
    - Use fast-check to generate (role, aria-* attribute) pairs where attribute is NOT in supported set
    - Verify violation is reported for unsupported attributes
    - **Validates: Requirements 6.4**

- [x] 10. Implement rule: no-default-aria
  - [x] 10.1 Create `src/rules/no-default-aria.ts` implementing the rule
    - Define `meta` with `type: "suggestion"`, `fixable: "code"`, `messages` with `defaultAriaValue` and `emptyAriaValue` messageIds
    - For each `aria-*` attribute, check if static value equals `DEFAULT_ARIA_VALUES[attrName]` or is empty string `""`
    - Report violation for default values and empty values, autofix removes the attribute
    - Skip dynamic attribute values
    - _Requirements: 7.1–7.8_
  - [x] 10.2 Write example-based tests for `no-default-aria` in `tests/rules/no-default-aria.test.ts`
    - Valid cases: non-default values (`aria-hidden="true"`), dynamic values
    - Invalid cases: `aria-hidden="false"`, `aria-required="false"`, `aria-expanded="false"`, `aria-pressed="false"`, `aria-label=""`, `aria-describedby=""`
    - Verify autofix output and correct messageId usage
    - _Requirements: 7.1–7.8, 11.6, 11.8_
  - [x] 10.3 Write property test for no-default-aria
    - **Property 5: Default and empty ARIA values are detected**
    - Use fast-check to generate (aria-* attribute, value) pairs from `DEFAULT_ARIA_VALUES`
    - Verify violation when value matches default; also verify empty string triggers violation
    - **Validates: Requirements 7.6, 7.7**

- [x] 11. Implement rule: no-hidden-focusable
  - [x] 11.1 Create `src/rules/no-hidden-focusable.ts` implementing the rule
    - Define `meta` with `type: "suggestion"`, `fixable: "code"`, `messages` with `hiddenFocusable` messageId
    - Check if `aria-hidden="true"` is set as static value
    - Determine focusability: element in `INTERACTIVE_ELEMENTS` (with `<a>` requiring `href`), or `tabindex` >= 0
    - Report violation for focusable + hidden elements, autofix removes `aria-hidden`
    - No violation for `tabindex="-1"`, skip dynamic `aria-hidden` values
    - _Requirements: 8.1–8.6_
  - [x] 11.2 Write example-based tests for `no-hidden-focusable` in `tests/rules/no-hidden-focusable.test.ts`
    - Valid cases: `tabindex="-1"` with `aria-hidden="true"`, non-focusable element with `aria-hidden="true"`, dynamic `aria-hidden`
    - Invalid cases: `<button aria-hidden="true">`, `<a href="#" aria-hidden="true">`, `<div tabindex="0" aria-hidden="true">`
    - Verify autofix output
    - _Requirements: 8.1–8.6, 11.7, 11.8_
  - [x] 11.3 Write property test for no-hidden-focusable
    - **Property 6: Hidden-focusable conflict detection**
    - Use fast-check to generate focusable elements from `INTERACTIVE_ELEMENTS` with `aria-hidden="true"`
    - Verify violation is always reported; verify `tabindex="-1"` produces no violation
    - **Validates: Requirements 8.3, 8.4, 8.6**

- [x] 12. Checkpoint — Verify all six rules compile and tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Plugin entry point and recommended config
  - [x] 13.1 Create `src/index.ts` as the plugin entry point
    - Default export conforming to ESLint flat config plugin interface with `meta` (name, version), `rules` (all six rules), and `configs` properties
    - Attach `configs.recommended` preset enabling all six rules at `"warn"` severity with self-referencing plugin
    - Use namespace `prefer-implicit`
    - _Requirements: 2.1–2.4_
  - [x] 13.2 Write integration tests verifying the plugin loads correctly
    - Verify the default export has `meta`, `rules`, and `configs` properties
    - Verify `configs.recommended` enables all six rules
    - Verify each rule name is accessible under the `prefer-implicit` namespace
    - _Requirements: 2.1–2.4, 11.1_

- [x] 14. Cross-cutting property tests
  - [x] 14.1 Write property test for dynamic value safety
    - **Property 7: Dynamic values are never flagged**
    - Use fast-check to generate JSX elements with dynamic attribute values (expressions) for each rule
    - Verify no violations are reported for any rule when attributes are dynamic
    - **Validates: Requirements 3.7, 4.5, 5.5, 6.5, 7.8, 8.5, 9.5, 10.5**
  - [x] 14.2 Write property test for autofix round-trip correctness
    - **Property 8: Autofix round-trip produces valid code**
    - Use fast-check to generate elements with static violations for each rule
    - Apply autofix, re-lint the fixed output, verify the violation is gone and no new violations introduced
    - **Validates: Requirements 3.6, 4.4, 5.4, 6.4, 7.7, 8.4**

- [x] 15. Build verification and README
  - [x] 15.1 Run `npm run build` to compile TypeScript and verify `dist/` output is correct
    - _Requirements: 1.1, 1.6, 1.7_
  - [x] 15.2 Create `README.md` documenting the plugin's purpose, installation, flat config setup, recommended config usage, and all six rules with examples
    - _Requirements: 1.8_

- [x] 16. Final checkpoint — Ensure all tests pass and build succeeds
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after logical groups of work
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases from the detection matrix
- The implementation language is TypeScript as specified in the design document
- All rules use ESLint's `RuleTester` for example-based tests and `fast-check` with `Linter` API for property-based tests
