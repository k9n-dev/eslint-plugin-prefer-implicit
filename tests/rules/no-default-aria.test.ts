import { RuleTester } from "eslint";
import rule from "../../src/rules/no-default-aria.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-default-aria", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // Non-default values (Req 7.8 — no violation for non-default static values)
    { code: '<div aria-hidden="true" />' },
    { code: '<div aria-required="true" />' },
    { code: '<div aria-expanded="true" />' },
    { code: '<div aria-pressed="true" />' },
    { code: '<div aria-disabled="true" />' },
    { code: '<div aria-checked="true" />' },
    { code: '<div aria-selected="true" />' },
    { code: '<div aria-busy="true" />' },

    // Non-empty aria-label / aria-describedby
    { code: '<div aria-label="Close dialog" />' },
    { code: '<div aria-describedby="help-text" />' },

    // Dynamic values — should be skipped (Req 7.8)
    { code: "<div aria-hidden={isHidden} />" },
    { code: "<div aria-expanded={expanded} />" },
    { code: "<div aria-pressed={pressed} />" },
    { code: "<div aria-label={label} />" },

    // No aria-* attributes at all
    { code: "<div />" },
    { code: '<button type="submit" />' },

    // Component names with aria attributes (still checked, but non-default values)
    { code: '<MyComponent aria-hidden="true" />' },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — should trigger the rule with autofix
  // ---------------------------------------------------------------------------
  invalid: [
    // Req 7.1: aria-hidden="false" is the default
    {
      code: '<div aria-hidden="false" />',
      output: "<div />",
      errors: [{ messageId: "defaultAriaValue" }],
    },

    // Req 7.2: aria-required="false" is the default
    {
      code: '<input aria-required="false" />',
      output: "<input />",
      errors: [{ messageId: "defaultAriaValue" }],
    },

    // Req 7.3: aria-expanded="false" is the default
    {
      code: '<div aria-expanded="false" />',
      output: "<div />",
      errors: [{ messageId: "defaultAriaValue" }],
    },

    // Req 7.4: aria-pressed="false" is the default
    {
      code: '<button aria-pressed="false" />',
      output: "<button />",
      errors: [{ messageId: "defaultAriaValue" }],
    },

    // Req 7.5: aria-label="" is an empty value
    {
      code: '<div aria-label="" />',
      output: "<div />",
      errors: [{ messageId: "emptyAriaValue" }],
    },

    // Req 7.6: aria-describedby="" is an empty value
    {
      code: '<div aria-describedby="" />',
      output: "<div />",
      errors: [{ messageId: "emptyAriaValue" }],
    },

    // Additional default-value cases from DEFAULT_ARIA_VALUES
    {
      code: '<div aria-disabled="false" />',
      output: "<div />",
      errors: [{ messageId: "defaultAriaValue" }],
    },
    {
      code: '<div aria-checked="false" />',
      output: "<div />",
      errors: [{ messageId: "defaultAriaValue" }],
    },
    {
      code: '<div aria-selected="false" />',
      output: "<div />",
      errors: [{ messageId: "defaultAriaValue" }],
    },
    {
      code: '<div aria-busy="false" />',
      output: "<div />",
      errors: [{ messageId: "defaultAriaValue" }],
    },
    {
      code: '<div aria-modal="false" />',
      output: "<div />",
      errors: [{ messageId: "defaultAriaValue" }],
    },

    // Additional empty-value cases (Req 7.6 — any aria-* with empty string)
    {
      code: '<div aria-labelledby="" />',
      output: "<div />",
      errors: [{ messageId: "emptyAriaValue" }],
    },

    // Autofix with surrounding attributes preserved (Req 7.7)
    {
      code: '<div class="box" aria-hidden="false" id="main" />',
      output: '<div class="box" id="main" />',
      errors: [{ messageId: "defaultAriaValue" }],
    },
    {
      code: '<span aria-label="" role="img" />',
      output: '<span role="img" />',
      errors: [{ messageId: "emptyAriaValue" }],
    },

    // Multiple violations on the same element — both attributes removed
    {
      code: '<div aria-hidden="false" aria-expanded="false" />',
      output: '<div aria-expanded="false" />',
      errors: [
        { messageId: "defaultAriaValue" },
        { messageId: "defaultAriaValue" },
      ],
    },
  ],
});
