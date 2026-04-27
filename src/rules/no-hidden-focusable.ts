/**
 * Rule: no-hidden-focusable
 *
 * Disallow elements that are both focusable and hidden from assistive
 * technologies via `aria-hidden="true"`. For example, `<button aria-hidden="true">`
 * creates a conflict: the element is interactive but invisible to screen readers.
 */

import type { Rule } from "eslint";
import { INTERACTIVE_ELEMENTS } from "../utils/aria-data.js";
import {
  getElementName,
  getStaticAttributeValue,
  hasAttribute,
  getAttributeNode,
} from "../utils/attribute-utils.js";
import { createElementVisitors } from "../utils/create-visitors.js";
import { removeAttribute } from "../utils/fix-utils.js";

/**
 * Checks an element node for a hidden-focusable conflict and reports
 * a violation if the element is both focusable and aria-hidden="true".
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  const ariaHidden = getStaticAttributeValue(node, "aria-hidden");
  if (ariaHidden !== "true") return;

  let isFocusable = false;
  let elementLabel: string | null = null;

  const elementName = getElementName(node);

  // Check native focusability via INTERACTIVE_ELEMENTS
  if (elementName !== null && INTERACTIVE_ELEMENTS.has(elementName)) {
    if (elementName === "a") {
      // <a> is only focusable when it has an href attribute
      if (hasAttribute(node, "href")) {
        isFocusable = true;
        elementLabel = elementName;
      }
    } else {
      isFocusable = true;
      elementLabel = elementName;
    }
  }

  // Check focusability via tabindex attribute
  if (!isFocusable) {
    const tabindexValue = getStaticAttributeValue(node, "tabindex");
    if (tabindexValue !== null) {
      const parsed = parseInt(tabindexValue, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        isFocusable = true;
        elementLabel = elementName ?? "this element";
      }
    }
  }

  if (!isFocusable) return;

  const attrNode = getAttributeNode(node, "aria-hidden");
  context.report({
    node: attrNode ?? node,
    messageId: "hiddenFocusable",
    data: { element: elementLabel! },
    fix(fixer) {
      if (attrNode) {
        return removeAttribute(context, fixer, attrNode);
      }
      return null;
    },
  });
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow elements that are both focusable and aria-hidden=\"true\"",
    },
    fixable: "code",
    schema: [],
    messages: {
      hiddenFocusable:
        'The element <{{element}}> is focusable but has aria-hidden="true". Remove aria-hidden to avoid hiding interactive content from assistive technologies.',
    },
  },
  create(context) {
    return createElementVisitors(context, checkElement);
  },
};

export default rule;
