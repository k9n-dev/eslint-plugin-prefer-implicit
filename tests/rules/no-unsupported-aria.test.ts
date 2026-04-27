import { RuleTester } from "eslint";
import rule from "../../src/rules/no-unsupported-aria.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-unsupported-aria", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // Supported attribute on element — button supports aria-expanded (Req 6.1–6.3)
    { code: '<button aria-expanded="true" />' },
    { code: '<button aria-pressed="true" />' },

    // Link (via implicit role on <a href>) supports aria-expanded
    { code: '<a href="#" aria-expanded="true">link</a>' },

    // Global ARIA attributes are supported on all roles
    { code: '<button aria-label="Submit" />' },
    { code: '<div aria-hidden="true" />' },
    { code: '<img aria-labelledby="desc" />' },
    { code: '<nav aria-describedby="info" />' },

    // Dynamic attribute value — should be skipped (Req 6.5)
    { code: "<div aria-checked={isChecked} />" },
    { code: "<button aria-valuenow={val} />" },
    { code: "<img aria-expanded={expanded} />" },

    // Element with no determinable role — skipped
    { code: '<span aria-checked="true" />' },

    // Component names are skipped (not HTML elements)
    { code: '<MyButton aria-valuenow="5" />' },
    { code: '<CustomImg aria-expanded="true" />' },

    // Element with explicit role that supports the attribute
    { code: '<div role="checkbox" aria-checked="true" />' },
    { code: '<div role="slider" aria-valuenow="5" />' },

    // Element with no aria-* attributes at all
    { code: "<button />" },
    { code: '<div role="button" />' },

    // <a> without href has no implicit role — skipped
    { code: '<a aria-expanded="true">text</a>' },

    // <div> without explicit role is not in IMPLICIT_ROLE_MAP — skipped
    { code: '<div aria-checked="true" />' },

    // <input> has implicit role "textbox" — textbox supports aria-required
    { code: '<input aria-required="true" />' },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — should trigger the rule with autofix
  // ---------------------------------------------------------------------------
  invalid: [
    // Req 6.1: <div role="generic"> does not support aria-checked
    // (div has no implicit role in the map, so we use an explicit role)
    {
      code: '<div role="generic" aria-checked="true" />',
      output: '<div role="generic" />',
      errors: [{ messageId: "unsupportedAria" }],
    },

    // Req 6.2: <button> (implicit role "button") does not support aria-valuenow
    {
      code: '<button aria-valuenow="5" />',
      output: "<button />",
      errors: [{ messageId: "unsupportedAria" }],
    },

    // Req 6.3: <img> (implicit role "img") does not support aria-expanded
    {
      code: '<img aria-expanded="true" />',
      output: "<img />",
      errors: [{ messageId: "unsupportedAria" }],
    },

    // Req 6.4: Autofix removes the unsupported attribute (verified by output)
    // <nav> (implicit role "navigation") does not support aria-checked
    {
      code: '<nav aria-checked="true">links</nav>',
      output: "<nav>links</nav>",
      errors: [{ messageId: "unsupportedAria" }],
    },

    // <button> does not support aria-selected
    {
      code: '<button aria-selected="true" />',
      output: "<button />",
      errors: [{ messageId: "unsupportedAria" }],
    },

    // <img> does not support aria-pressed
    {
      code: '<img aria-pressed="true" />',
      output: "<img />",
      errors: [{ messageId: "unsupportedAria" }],
    },

    // Explicit role overrides implicit — div with role="button" does not support aria-valuenow
    {
      code: '<div role="button" aria-valuenow="5" />',
      output: '<div role="button" />',
      errors: [{ messageId: "unsupportedAria" }],
    },

    // <a href> has implicit role "link" which does not support aria-checked
    {
      code: '<a href="#" aria-checked="true">link</a>',
      output: '<a href="#">link</a>',
      errors: [{ messageId: "unsupportedAria" }],
    },

    // Multiple unsupported attributes on one element — each reported separately
    {
      code: '<img aria-expanded="true" aria-checked="false" />',
      output: '<img aria-checked="false" />',
      errors: [
        { messageId: "unsupportedAria" },
        { messageId: "unsupportedAria" },
      ],
    },

    // Autofix preserves other attributes (Req 11.8)
    {
      code: '<button aria-valuenow="5" aria-label="Submit">click</button>',
      output: '<button aria-label="Submit">click</button>',
      errors: [{ messageId: "unsupportedAria" }],
    },
  ],
});
