import { RuleTester } from "eslint";
import rule from "../../src/rules/no-hidden-focusable.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-hidden-focusable", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // tabindex="-1" with aria-hidden="true" — not focusable (Req 8.6)
    { code: '<div tabindex="-1" aria-hidden="true" />' },
    { code: '<span tabindex="-1" aria-hidden="true">hidden</span>' },

    // Non-focusable element with aria-hidden="true" (Req 8.1–8.3)
    { code: '<div aria-hidden="true" />' },
    { code: '<span aria-hidden="true">decorative</span>' },
    { code: '<p aria-hidden="true">hidden text</p>' },

    // <a> without href is not focusable — allowed with aria-hidden
    { code: '<a aria-hidden="true">not a link</a>' },

    // Dynamic aria-hidden — should be skipped (Req 8.5)
    { code: "<button aria-hidden={isHidden} />" },
    { code: "<a href='#' aria-hidden={condition} />" },
    { code: "<div tabindex={0} aria-hidden={hidden} />" },

    // No aria-hidden attribute at all
    { code: "<button />" },
    { code: '<a href="#">link</a>' },
    { code: '<div tabindex="0">focusable</div>' },

    // aria-hidden="false" — not hidden
    { code: '<button aria-hidden="false" />' },
    { code: '<a href="#" aria-hidden="false">link</a>' },

    // Component names are skipped (not HTML elements)
    { code: '<MyButton aria-hidden="true" />' },

    // Non-numeric tabindex with aria-hidden — not focusable
    { code: '<div tabindex="abc" aria-hidden="true" />' },

    // Negative tabindex other than -1 — not focusable (parsed < 0)
    { code: '<div tabindex="-2" aria-hidden="true" />' },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — should trigger the rule with autofix
  // ---------------------------------------------------------------------------
  invalid: [
    // Req 8.1: <button aria-hidden="true"> — natively focusable + hidden
    {
      code: '<button aria-hidden="true" />',
      output: "<button />",
      errors: [{ messageId: "hiddenFocusable" }],
    },

    // Req 8.2: <a href="#" aria-hidden="true"> — focusable link + hidden
    {
      code: '<a href="#" aria-hidden="true">click</a>',
      output: '<a href="#">click</a>',
      errors: [{ messageId: "hiddenFocusable" }],
    },

    // Req 8.3: <div tabindex="0" aria-hidden="true"> — tabindex makes it focusable
    {
      code: '<div tabindex="0" aria-hidden="true" />',
      output: '<div tabindex="0" />',
      errors: [{ messageId: "hiddenFocusable" }],
    },

    // Additional interactive elements with aria-hidden="true"
    {
      code: '<input aria-hidden="true" />',
      output: "<input />",
      errors: [{ messageId: "hiddenFocusable" }],
    },
    {
      code: '<select aria-hidden="true" />',
      output: "<select />",
      errors: [{ messageId: "hiddenFocusable" }],
    },
    {
      code: '<textarea aria-hidden="true" />',
      output: "<textarea />",
      errors: [{ messageId: "hiddenFocusable" }],
    },
    {
      code: '<details aria-hidden="true">content</details>',
      output: "<details>content</details>",
      errors: [{ messageId: "hiddenFocusable" }],
    },
    {
      code: '<summary aria-hidden="true">toggle</summary>',
      output: "<summary>toggle</summary>",
      errors: [{ messageId: "hiddenFocusable" }],
    },
    {
      code: '<iframe aria-hidden="true" />',
      output: "<iframe />",
      errors: [{ messageId: "hiddenFocusable" }],
    },
    {
      code: '<embed aria-hidden="true" />',
      output: "<embed />",
      errors: [{ messageId: "hiddenFocusable" }],
    },

    // Positive tabindex with aria-hidden="true"
    {
      code: '<span tabindex="1" aria-hidden="true">text</span>',
      output: '<span tabindex="1">text</span>',
      errors: [{ messageId: "hiddenFocusable" }],
    },

    // tabindex="0" on non-interactive element
    {
      code: '<p tabindex="0" aria-hidden="true">text</p>',
      output: '<p tabindex="0">text</p>',
      errors: [{ messageId: "hiddenFocusable" }],
    },
  ],
});
