/**
 * Rule: no-conflicting-aria
 *
 * Disallow `aria-live` values that conflict with the implicit live region
 * behavior of a declared role. For example, `role="alert" aria-live="polite"`
 * conflicts because `role="alert"` implies `aria-live="assertive"`.
 */

import type { Rule } from "eslint";
import { ROLE_ARIA_LIVE_MAP } from "../utils/aria-data.js";
import {
  getStaticAttributeValue,
  getAttributeNode,
} from "../utils/attribute-utils.js";
import { createElementVisitors } from "../utils/create-visitors.js";
import { removeAttribute } from "../utils/fix-utils.js";

/**
 * Checks an element node for a conflicting `aria-live` attribute and reports
 * a violation if the explicit `aria-live` value differs from the role's
 * implied live region value.
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  const role = getStaticAttributeValue(node, "role");
  if (role === null) return;

  const impliedLive = ROLE_ARIA_LIVE_MAP[role];
  if (impliedLive === undefined) return;

  const ariaLive = getStaticAttributeValue(node, "aria-live");
  if (ariaLive === null) return;

  // Only report when the values conflict — matching (redundant) is acceptable.
  if (ariaLive !== impliedLive) {
    const attrNode = getAttributeNode(node, "aria-live");
    context.report({
      node: attrNode ?? node,
      messageId: "conflictingAria",
      data: { ariaLive, role, impliedLive },
      fix(fixer) {
        if (attrNode) {
          return removeAttribute(context, fixer, attrNode);
        }
        return null;
      },
    });
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow aria-live values that conflict with the implicit live region behavior of a declared role",
    },
    fixable: "code",
    schema: [],
    messages: {
      conflictingAria:
        'The aria-live value "{{ariaLive}}" conflicts with role "{{role}}" which implies aria-live="{{impliedLive}}". Remove the conflicting aria-live attribute.',
    },
  },
  create(context) {
    return createElementVisitors(context, checkElement);
  },
};

export default rule;
