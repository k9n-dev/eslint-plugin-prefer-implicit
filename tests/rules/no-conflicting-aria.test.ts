import { RuleTester } from "eslint";
import rule from "../../src/rules/no-conflicting-aria.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-conflicting-aria", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // Matching aria-live — redundant but not conflicting (Req 5.6)
    { code: '<div role="alert" aria-live="assertive" />' },
    { code: '<div role="status" aria-live="polite" />' },
    { code: '<div role="log" aria-live="polite" />' },
    { code: '<div role="marquee" aria-live="off" />' },
    { code: '<div role="timer" aria-live="off" />' },

    // Role not in ROLE_ARIA_LIVE_MAP — no implied live value to conflict with
    { code: '<div role="button" aria-live="polite" />' },
    { code: '<div role="navigation" aria-live="assertive" />' },
    { code: '<div role="dialog" aria-live="off" />' },

    // Dynamic aria-live value — should be skipped (Req 5.5)
    { code: '<div role="alert" aria-live={liveValue} />' },
    { code: '<div role="status" aria-live={getLive()} />' },

    // No aria-live attribute at all
    { code: '<div role="alert" />' },
    { code: '<div role="status" />' },
    { code: '<div role="log" />' },

    // Dynamic role value — role is null so rule skips
    { code: '<div role={dynamicRole} aria-live="polite" />' },

    // No role attribute at all
    { code: '<div aria-live="polite" />' },

    // Component names are skipped (no element name resolution needed here,
    // but the rule only checks role which is still read from attributes)
    { code: '<MyAlert role="alert" aria-live="assertive" />' },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — should trigger the rule with autofix
  // ---------------------------------------------------------------------------
  invalid: [
    // Req 5.1: role="alert" implies aria-live="assertive", but aria-live="polite" conflicts
    {
      code: '<div role="alert" aria-live="polite" />',
      output: '<div role="alert" />',
      errors: [{ messageId: "conflictingAria" }],
    },

    // Req 5.2: role="status" implies aria-live="polite", but aria-live="assertive" conflicts
    {
      code: '<div role="status" aria-live="assertive" />',
      output: '<div role="status" />',
      errors: [{ messageId: "conflictingAria" }],
    },

    // Req 5.3: role="log" implies aria-live="polite", but aria-live="assertive" conflicts
    {
      code: '<div role="log" aria-live="assertive" />',
      output: '<div role="log" />',
      errors: [{ messageId: "conflictingAria" }],
    },

    // role="alert" with aria-live="off" conflicts (assertive expected)
    {
      code: '<div role="alert" aria-live="off" />',
      output: '<div role="alert" />',
      errors: [{ messageId: "conflictingAria" }],
    },

    // role="status" with aria-live="off" conflicts (polite expected)
    {
      code: '<div role="status" aria-live="off" />',
      output: '<div role="status" />',
      errors: [{ messageId: "conflictingAria" }],
    },

    // role="log" with aria-live="off" conflicts (polite expected)
    {
      code: '<div role="log" aria-live="off" />',
      output: '<div role="log" />',
      errors: [{ messageId: "conflictingAria" }],
    },

    // role="marquee" implies aria-live="off", but aria-live="polite" conflicts
    {
      code: '<div role="marquee" aria-live="polite" />',
      output: '<div role="marquee" />',
      errors: [{ messageId: "conflictingAria" }],
    },

    // role="timer" implies aria-live="off", but aria-live="assertive" conflicts
    {
      code: '<div role="timer" aria-live="assertive" />',
      output: '<div role="timer" />',
      errors: [{ messageId: "conflictingAria" }],
    },

    // Verify autofix works on elements with additional attributes (Req 5.4)
    {
      code: '<section role="alert" aria-live="polite" class="banner">content</section>',
      output: '<section role="alert" class="banner">content</section>',
      errors: [{ messageId: "conflictingAria" }],
    },
  ],
});
