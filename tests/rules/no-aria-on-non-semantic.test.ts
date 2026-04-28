import { RuleTester } from "eslint";
import rule from "../../src/rules/no-aria-on-non-semantic.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-aria-on-non-semantic", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // Concrete role with aria attributes — allowed (Req 4.3)
    { code: '<div role="button" aria-label="x" />' },

    // role="none" without aria attributes — allowed (Req 4.2)
    { code: '<div role="none" />' },

    // role="presentation" without aria attributes — allowed (Req 4.2)
    { code: '<div role="presentation" />' },

    // Dynamic role value — should be skipped (Req 4.6)
    { code: '<div role={role} aria-label="x" />' },

    // Dynamic aria value on presentation element — should be skipped (Req 4.4)
    { code: '<div role="none" aria-label={label} />' },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — should trigger the rule with autofix (Req 4.1, 4.5)
  // ---------------------------------------------------------------------------
  invalid: [
    // role="none" with aria-label
    {
      code: '<div role="none" aria-label="x" />',
      output: '<div role="none" />',
      errors: [{ messageId: "ariaOnNonSemantic" }],
    },
    // role="presentation" with aria-hidden
    {
      code: '<span role="presentation" aria-hidden="true" />',
      output: '<span role="presentation" />',
      errors: [{ messageId: "ariaOnNonSemantic" }],
    },
    // Multiple aria attributes on one presentation element — two errors
    // ESLint applies fixes one at a time per pass; output shows first fix applied
    {
      code: '<div role="none" aria-label="x" aria-describedby="d" />',
      output: '<div role="none" aria-describedby="d" />',
      errors: [
        { messageId: "ariaOnNonSemantic" },
        { messageId: "ariaOnNonSemantic" },
      ],
    },
  ],
});
