/**
 * Rule: no-redundant-aria
 *
 * Disallow ARIA attributes that are set to their implicit value for the given
 * HTML element (e.g., `aria-level="1"` on `<h1>`). These attributes are
 * redundant because the browser already exposes the same value via the
 * element's implicit semantics.
 */

import type { Rule } from "eslint";
import { IMPLICIT_ARIA_VALUES } from "../utils/aria-data.js";
import {
  getElementName,
  getStaticAttributeValue,
  getAttributeNode,
} from "../utils/attribute-utils.js";
import { createElementVisitors } from "../utils/create-visitors.js";
import { removeAttribute } from "../utils/fix-utils.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Collects all `aria-*` attributes from an element node, returning each
 * attribute's name and its raw AST node. Works across JSX, Vue, and generic
 * HTML/Angular AST shapes.
 */
function getAriaAttributes(
  node: any,
): Array<{ name: string; attrNode: any }> {
  const result: Array<{ name: string; attrNode: any }> = [];
  let attrs: any[] = [];

  if (node.type === "JSXOpeningElement" && Array.isArray(node.attributes)) {
    attrs = node.attributes;
  } else if (node.type === "VElement" && node.startTag?.attributes) {
    attrs = node.startTag.attributes;
  } else if (Array.isArray(node.attributes)) {
    attrs = node.attributes;
  }

  for (const attr of attrs) {
    let name: string | null = null;

    if (attr.type === "JSXAttribute" && attr.name?.name) {
      name = typeof attr.name.name === "string" ? attr.name.name : null;
    } else if (attr.type === "VAttribute" && attr.key?.name) {
      name = typeof attr.key.name === "string" ? attr.key.name : null;
    } else if (typeof attr.name === "string") {
      name = attr.name;
    }

    if (name && name.startsWith("aria-")) {
      result.push({ name, attrNode: attr });
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Core check
// ---------------------------------------------------------------------------

/**
 * Checks an element node for ARIA attributes that match the element's implicit
 * ARIA values, and reports violations with autofix.
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  const elementName = getElementName(node);

  // Skip components (unknown implicit values)
  if (elementName === null) return;

  // Look up implicit ARIA values for this element
  const implicitValues = IMPLICIT_ARIA_VALUES[elementName];
  if (!implicitValues) return;

  const ariaAttrs = getAriaAttributes(node);

  for (const { name } of ariaAttrs) {
    const value = getStaticAttributeValue(node, name);

    // Skip dynamic or missing values — we cannot safely analyse them.
    if (value === null) continue;

    // Check if the attribute value matches the implicit value for this element
    if (implicitValues[name] === value) {
      const reportNode = getAttributeNode(node, name);
      if (reportNode) {
        context.report({
          node: reportNode,
          messageId: "redundantAria",
          data: { attribute: name, value, element: elementName },
          fix(fixer) {
            return removeAttribute(context, fixer, reportNode);
          },
        });
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Rule definition
// ---------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow ARIA attributes set to their implicit value on HTML elements",
    },
    fixable: "code",
    schema: [],
    messages: {
      redundantAria:
        'The attribute "{{attribute}}" is set to its implicit value "{{value}}" on <{{element}}>. Remove the redundant attribute.',
    },
  },
  create(context) {
    return createElementVisitors(context, checkElement);
  },
};

export default rule;
