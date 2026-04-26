# Detection Matrix

A complete overview of all patterns detected by the plugin.

## Redundant Roles

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| R1 | `<button role="button">` | Role equals implicit role | Remove role |
| R2 | `<nav role="navigation">` | Redundant landmark role | Remove role |
| R3 | `<ul role="list">` | Implicit list role | Remove role |
| R4 | `<li role="listitem">` | Implicit listitem role | Remove role |
| R5 | `<table role="table">` | Implicit table role | Remove role |

## Destructive Roles

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| R6 | `<button role="none">` | Removes interactive semantics | Remove role |
| R7 | `<a href role="presentation">` | Breaks accessibility | Remove role |
| R8 | `<ul role="presentation">` | Removes structural meaning | Remove role |

## Role / ARIA Conflicts

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| A1 | `role="alert" aria-live="polite"` | Conflicts with implicit assertive | Remove aria-live |
| A2 | `role="status" aria-live="assertive"` | Conflicting politeness | Remove aria-live |
| A3 | `role="log" aria-live="assertive"` | Redundant or conflicting | Remove aria-live |

## Unsupported ARIA Attributes

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| A4 | `<div aria-checked="true">` | No valid role context | Remove attribute |
| A5 | `<button aria-valuenow="5">` | Invalid attribute for role | Remove attribute |
| A6 | `<img aria-expanded="true">` | Unsupported attribute | Remove attribute |

## Default ARIA Values

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| D1 | `aria-hidden="false"` | Default value | Remove attribute |
| D2 | `aria-required="false"` | Default value | Remove attribute |
| D3 | `aria-expanded="false"` | Default (static only) | Remove attribute |
| D4 | `aria-pressed="false"` | Default value | Remove attribute |

## Empty / Invalid ARIA

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| D5 | `aria-label=""` | Empty label | Remove attribute |
| D6 | `aria-*=""` | Invalid empty attribute | Remove attribute |

## Interactivity Conflicts

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| I1 | `<button aria-hidden="true">` | Focusable but hidden | Remove aria-hidden |
| I2 | `<a href aria-hidden="true">` | Contradiction | Remove aria-hidden |
| I3 | `[tabindex] + aria-hidden` | Focusable but hidden | Remove aria-hidden |
