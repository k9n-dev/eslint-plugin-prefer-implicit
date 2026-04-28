import { RuleTester } from "eslint";
import rule from "../../src/rules/no-redundant-aria.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-redundant-aria", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // aria-level on h1 set to a different value (Req 2.2)
    { code: '<h1 aria-level="2">Title</h1>' },
    { code: '<h2 aria-level="3">Subtitle</h2>' },

    // No implicit value for div — aria-level is fine
    { code: '<div aria-level="1">content</div>' },

    // progress with aria-valuemin different from implicit "0"
    { code: '<progress aria-valuemin="5" />' },

    // Dynamic values — should be skipped (Req 2.3)
    { code: "<h1 aria-level={level}>Title</h1>" },

    // Component names are skipped (Req 2.5)
    { code: '<MyHeading aria-level="1" />' },

    // No aria attributes at all
    { code: "<h1>Title</h1>" },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — should trigger the rule with autofix (Req 2.1, 2.4, 2.6)
  // ---------------------------------------------------------------------------
  invalid: [
    // h1 with aria-level="1" is redundant
    {
      code: '<h1 aria-level="1">Title</h1>',
      output: "<h1>Title</h1>",
      errors: [{ messageId: "redundantAria" }],
    },
    // h2 with aria-level="2" is redundant
    {
      code: '<h2 aria-level="2">Subtitle</h2>',
      output: "<h2>Subtitle</h2>",
      errors: [{ messageId: "redundantAria" }],
    },
    // h6 with aria-level="6" is redundant
    {
      code: '<h6 aria-level="6">Deep</h6>',
      output: "<h6>Deep</h6>",
      errors: [{ messageId: "redundantAria" }],
    },
    // progress with aria-valuemin="0" is redundant
    {
      code: '<progress aria-valuemin="0" />',
      output: "<progress />",
      errors: [{ messageId: "redundantAria" }],
    },
    // hr with aria-orientation="horizontal" is redundant
    {
      code: '<hr aria-orientation="horizontal" />',
      output: "<hr />",
      errors: [{ messageId: "redundantAria" }],
    },
  ],
});
