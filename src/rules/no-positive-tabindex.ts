/**
 * Rule: no-positive-tabindex
 *
 * Disallow positive tabindex values. A positive tabindex disrupts the natural
 * tab order and makes navigation unpredictable for keyboard and assistive
 * technology users.
 */

import type { Rule } from "eslint";
import {
  getStaticAttributeValue,
  getAttributeNode,
} from "../utils/attribute-utils.js";
import { createElementVisitors } from "../utils/create-visitors.js";

/**
 * Checks an element node for a positive tabindex attribute value and reports
 * a violation if the parsed integer value is greater than 0.
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  const value = getStaticAttributeValue(node, "tabindex");
  if (value === null) return;

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return;

  if (parsed > 0) {
    const attrNode = getAttributeNode(node, "tabindex");
    context.report({
      node: attrNode ?? node,
      messageId: "positiveTabindex",
      data: { value },
    });
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow positive tabindex values that disrupt natural tab order",
    },
    schema: [],
    messages: {
      positiveTabindex:
        'Avoid using tabindex="{{value}}". A positive tabindex disrupts the natural tab order.',
    },
  },
  create(context) {
    return createElementVisitors(context, checkElement);
  },
};

export default rule;
