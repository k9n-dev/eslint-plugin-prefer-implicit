# Requirements Document

## Introduction

This document defines the requirements for `eslint-plugin-prefer-implicit`, an ESLint plugin that enforces implicit HTML semantics over explicit ARIA attributes and roles. The plugin follows the principle: "If the browser already knows it, don't repeat it." It targets ESLint ^10.0.0 using flat config format, is written in TypeScript, and supports plain HTML, JSX, and common frameworks (Vue, React, Angular). The project uses Vitest for testing, Changesets for release management, and is published via NPM.

## Glossary

- **Plugin**: The `eslint-plugin-prefer-implicit` ESLint plugin package
- **Rule_Engine**: The core ESLint rule processing logic within the Plugin
- **AST_Analyzer**: The component that inspects AST nodes for HTML elements and their attributes
- **Autofix_Engine**: The component that generates safe, automated code fixes for detected violations
- **Implicit_Role**: The ARIA role that a browser assigns to an HTML element by default without explicit declaration (e.g., `<button>` has implicit role "button")
- **Redundant_Role**: An explicitly declared `role` attribute that matches the element's Implicit_Role
- **Destructive_Role**: A `role` attribute value (e.g., "none", "presentation") that removes the native semantics of an interactive or structural element
- **Conflicting_ARIA**: An ARIA attribute whose value contradicts the implicit behavior of the element's declared role
- **Unsupported_ARIA**: An ARIA attribute applied to an element whose role does not support that attribute per the WAI-ARIA specification
- **Default_ARIA_Value**: An ARIA attribute set to its specification-defined default value, making it redundant
- **Static_Value**: An attribute value written as a literal string in the source code (e.g., `aria-hidden="false"`)
- **Dynamic_Value**: An attribute value bound to a variable or expression at runtime (e.g., `:aria-hidden="isHidden"`, `{condition ? "true" : "false"}`)
- **Flat_Config**: The ESLint configuration format used in ESLint v9+ where configuration is defined in `eslint.config.js` using JavaScript objects
- **Changesets**: A tool for managing versioning and changelogs in multi-package or single-package repositories

## Requirements

### Requirement 1: Project Scaffolding and Build Setup

**User Story:** As a developer, I want a properly scaffolded TypeScript project with build tooling, so that I can develop, test, and publish the ESLint plugin.

#### Acceptance Criteria

1. THE Plugin project SHALL use TypeScript as the source language with a `tsconfig.json` configured for ESM output
2. THE Plugin project SHALL declare ESLint `^10.0.0` as a peer dependency in `package.json`
3. THE Plugin project SHALL use Vitest as the test runner with a configuration that supports TypeScript
4. THE Plugin project SHALL include a Changesets configuration for versioning and CHANGELOG generation
5. THE Plugin project SHALL include a `.gitignore` file that excludes `node_modules`, `dist`, and other build artifacts
6. THE Plugin project SHALL include `build`, `test`, and `lint` scripts in `package.json`
7. THE Plugin project SHALL configure `package.json` with `main`, `types`, and `exports` fields pointing to compiled output for NPM publishing
8. THE Plugin project SHALL include a README.md documenting the plugin's purpose, installation, configuration, and all available rules

### Requirement 2: Plugin Entry Point and Flat Config Integration

**User Story:** As a developer using ESLint 10, I want to import the plugin and use it with flat config, so that I can enable the rules in my project.

#### Acceptance Criteria

1. THE Plugin SHALL export a default object conforming to the ESLint flat config plugin interface with a `rules` property containing all six rules
2. THE Plugin SHALL export a `configs.recommended` flat config preset that enables all six rules at their default severity
3. WHEN a consumer imports the Plugin in an `eslint.config.js` file, THE Plugin SHALL be usable via the `plugins` property without additional adapters
4. THE Plugin SHALL use the namespace `prefer-implicit` so that rules are referenced as `prefer-implicit/no-redundant-role`, `prefer-implicit/no-destructive-role`, etc.

### Requirement 3: Rule — no-redundant-role

**User Story:** As a developer, I want to be warned when I add a `role` attribute that matches an element's implicit role, so that I can remove unnecessary redundancy.

#### Acceptance Criteria

1. WHEN a `<button>` element has `role="button"`, THE Rule_Engine SHALL report a violation indicating the role is redundant
2. WHEN a `<nav>` element has `role="navigation"`, THE Rule_Engine SHALL report a violation indicating the role is redundant
3. WHEN a `<ul>` element has `role="list"`, THE Rule_Engine SHALL report a violation indicating the role is redundant
4. WHEN a `<li>` element has `role="listitem"`, THE Rule_Engine SHALL report a violation indicating the role is redundant
5. WHEN a `<table>` element has `role="table"`, THE Rule_Engine SHALL report a violation indicating the role is redundant
6. WHEN a redundant role is detected on a Static_Value, THE Autofix_Engine SHALL remove the `role` attribute from the element
7. WHEN a `role` attribute contains a Dynamic_Value, THE Rule_Engine SHALL skip analysis and report no violation
8. WHEN an element has a `role` that differs from its implicit role, THE Rule_Engine SHALL report no violation

### Requirement 4: Rule — no-destructive-role

**User Story:** As a developer, I want to be warned when a `role` attribute removes the native semantics of an interactive or structural element, so that I can prevent accessibility regressions.

#### Acceptance Criteria

1. WHEN a `<button>` element has `role="none"`, THE Rule_Engine SHALL report a violation indicating the role is destructive
2. WHEN an `<a>` element with an `href` attribute has `role="presentation"`, THE Rule_Engine SHALL report a violation indicating the role is destructive
3. WHEN a `<ul>` element has `role="presentation"`, THE Rule_Engine SHALL report a violation indicating the role is destructive
4. WHEN a destructive role is detected on a Static_Value, THE Autofix_Engine SHALL remove the `role` attribute from the element
5. WHEN a `role` attribute contains a Dynamic_Value, THE Rule_Engine SHALL skip analysis and report no violation

### Requirement 5: Rule — no-conflicting-aria

**User Story:** As a developer, I want to be warned when an ARIA attribute conflicts with the implicit behavior of a declared role, so that I can avoid confusing assistive technologies.

#### Acceptance Criteria

1. WHEN an element has `role="alert"` and `aria-live="polite"`, THE Rule_Engine SHALL report a violation because `role="alert"` implies `aria-live="assertive"`
2. WHEN an element has `role="status"` and `aria-live="assertive"`, THE Rule_Engine SHALL report a violation because `role="status"` implies `aria-live="polite"`
3. WHEN an element has `role="log"` and `aria-live="assertive"`, THE Rule_Engine SHALL report a violation because `role="log"` implies `aria-live="polite"`
4. WHEN a conflicting ARIA attribute is detected on a Static_Value, THE Autofix_Engine SHALL remove the conflicting `aria-live` attribute
5. WHEN the `aria-live` attribute contains a Dynamic_Value, THE Rule_Engine SHALL skip analysis and report no violation
6. WHEN an element has `role="alert"` and `aria-live="assertive"`, THE Rule_Engine SHALL report no violation because the values are consistent

### Requirement 6: Rule — no-unsupported-aria

**User Story:** As a developer, I want to be warned when I use an ARIA attribute on an element whose role does not support it, so that I can remove ineffective attributes.

#### Acceptance Criteria

1. WHEN a `<div>` element (without an explicit role) has `aria-checked="true"`, THE Rule_Engine SHALL report a violation because the generic role does not support `aria-checked`
2. WHEN a `<button>` element has `aria-valuenow="5"`, THE Rule_Engine SHALL report a violation because the button role does not support `aria-valuenow`
3. WHEN an `<img>` element has `aria-expanded="true"`, THE Rule_Engine SHALL report a violation because the img role does not support `aria-expanded`
4. WHEN an unsupported ARIA attribute is detected on a Static_Value, THE Autofix_Engine SHALL remove the unsupported attribute
5. WHEN the ARIA attribute contains a Dynamic_Value, THE Rule_Engine SHALL skip analysis and report no violation

### Requirement 7: Rule — no-default-aria

**User Story:** As a developer, I want to be warned when I set an ARIA attribute to its specification-defined default value, so that I can remove unnecessary clutter.

#### Acceptance Criteria

1. WHEN an element has `aria-hidden="false"`, THE Rule_Engine SHALL report a violation indicating the value is the default
2. WHEN an element has `aria-required="false"`, THE Rule_Engine SHALL report a violation indicating the value is the default
3. WHEN an element has `aria-expanded="false"` as a Static_Value and the element is not dynamically controlled, THE Rule_Engine SHALL report a violation indicating the value is the default
4. WHEN an element has `aria-pressed="false"`, THE Rule_Engine SHALL report a violation indicating the value is the default
5. WHEN an element has `aria-label=""`, THE Rule_Engine SHALL report a violation indicating the value is empty
6. WHEN an element has any `aria-*` attribute with an empty string value, THE Rule_Engine SHALL report a violation indicating the value is empty or invalid
7. WHEN a default or empty ARIA attribute is detected on a Static_Value, THE Autofix_Engine SHALL remove the attribute
8. WHEN the ARIA attribute contains a Dynamic_Value, THE Rule_Engine SHALL skip analysis and report no violation

### Requirement 8: Rule — no-hidden-focusable

**User Story:** As a developer, I want to be warned when an element is both focusable and hidden from assistive technologies, so that I can resolve the interactivity conflict.

#### Acceptance Criteria

1. WHEN a `<button>` element has `aria-hidden="true"`, THE Rule_Engine SHALL report a violation indicating the element is focusable but hidden
2. WHEN an `<a>` element with an `href` attribute has `aria-hidden="true"`, THE Rule_Engine SHALL report a violation indicating the element is focusable but hidden
3. WHEN an element has a `tabindex` attribute (value >= 0) and `aria-hidden="true"`, THE Rule_Engine SHALL report a violation indicating the element is focusable but hidden
4. WHEN a hidden-focusable conflict is detected on a Static_Value, THE Autofix_Engine SHALL remove the `aria-hidden` attribute
5. WHEN the `aria-hidden` attribute contains a Dynamic_Value, THE Rule_Engine SHALL skip analysis and report no violation
6. WHEN an element has `tabindex="-1"` and `aria-hidden="true"`, THE Rule_Engine SHALL report no violation because the element is not focusable

### Requirement 9: Framework Compatibility

**User Story:** As a developer using React, Vue, or Angular, I want the plugin to work with my framework's template syntax, so that I can enforce implicit semantics across my codebase.

#### Acceptance Criteria

1. THE Plugin SHALL analyze JSX syntax used in React and similar frameworks
2. THE Plugin SHALL analyze Vue single-file component `<template>` blocks when used with an appropriate ESLint parser (e.g., `vue-eslint-parser`)
3. THE Plugin SHALL analyze Angular template syntax when used with an appropriate ESLint parser (e.g., `angular-eslint`)
4. THE Plugin SHALL analyze plain HTML files when used with an appropriate ESLint HTML parser
5. WHEN a framework uses a binding syntax for an attribute value (e.g., `:aria-hidden`, `[attr.aria-hidden]`, `{expression}`), THE Rule_Engine SHALL treat the attribute as a Dynamic_Value and skip analysis

### Requirement 10: Static vs Dynamic Value Detection

**User Story:** As a developer, I want the plugin to distinguish between static and dynamic attribute values, so that autofix is only applied when it is safe.

#### Acceptance Criteria

1. WHEN an attribute value is a string literal (e.g., `aria-hidden="false"`), THE AST_Analyzer SHALL classify the value as a Static_Value
2. WHEN an attribute value is a Vue binding (e.g., `:aria-hidden="isHidden"`), THE AST_Analyzer SHALL classify the value as a Dynamic_Value
3. WHEN an attribute value is a JSX expression (e.g., `aria-hidden={condition}`), THE AST_Analyzer SHALL classify the value as a Dynamic_Value
4. WHEN an attribute value is an Angular binding (e.g., `[attr.aria-hidden]="isHidden"`), THE AST_Analyzer SHALL classify the value as a Dynamic_Value
5. WHEN a value is classified as a Dynamic_Value, THE Autofix_Engine SHALL not generate a fix for that attribute

### Requirement 11: Testing Coverage

**User Story:** As a contributor, I want comprehensive tests for every rule, so that I can confidently make changes without introducing regressions.

#### Acceptance Criteria

1. THE Plugin project SHALL include Vitest test files for each of the six rules
2. WHEN tests are run for the `no-redundant-role` rule, THE test suite SHALL cover all five redundant role patterns (R1–R5), valid cases, and Dynamic_Value skip cases
3. WHEN tests are run for the `no-destructive-role` rule, THE test suite SHALL cover all three destructive role patterns (R6–R8), valid cases, and Dynamic_Value skip cases
4. WHEN tests are run for the `no-conflicting-aria` rule, THE test suite SHALL cover all three conflict patterns (A1–A3), valid non-conflicting cases, and Dynamic_Value skip cases
5. WHEN tests are run for the `no-unsupported-aria` rule, THE test suite SHALL cover all three unsupported patterns (A4–A6), valid cases, and Dynamic_Value skip cases
6. WHEN tests are run for the `no-default-aria` rule, THE test suite SHALL cover all six default/empty patterns (D1–D6), valid non-default cases, and Dynamic_Value skip cases
7. WHEN tests are run for the `no-hidden-focusable` rule, THE test suite SHALL cover all three interactivity conflict patterns (I1–I3), valid cases (e.g., `tabindex="-1"`), and Dynamic_Value skip cases
8. THE test suite for each rule SHALL verify that the Autofix_Engine produces the correct output for fixable violations

### Requirement 12: Release and Publishing Pipeline

**User Story:** As a maintainer, I want automated versioning and changelog generation, so that I can publish releases to NPM consistently.

#### Acceptance Criteria

1. THE Plugin project SHALL include a `.changeset` directory with a Changesets configuration file specifying the package as a single-package repository
2. THE Plugin project SHALL include scripts or documentation for running `changeset version` and `changeset publish`
3. THE Plugin project SHALL configure `package.json` with the package name `eslint-plugin-prefer-implicit`, a license field, and repository metadata for NPM publishing
4. THE Plugin project SHALL include `files` field in `package.json` to ensure only compiled output and essential files are included in the published package
