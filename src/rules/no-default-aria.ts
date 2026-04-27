/**
 * Rule: no-default-aria
 *
 * Disallow ARIA attributes that are set to their specification-defined default
 * value (e.g., `aria-hidden="false"`) or to an empty string (e.g.,
 * `aria-label=""`). These attributes are redundant or invalid and should be
 * removed.
 */

import type { Rule } from "eslint";
import { DEFAULT_ARIA_VALUES } from "../utils/aria-data.js";
import {
  getStaticAttributeValue,
  getAttributeNode,
} from "../utils/attribute-utils.js";
import { createElementVisitors } from "../utils/create-visitors.js";

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
 * Checks an element node for ARIA attributes that are set to their default
 * value or to an empty string, and reports violations with autofix.
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  const ariaAttrs = getAriaAttributes(node);

  for (const { name } of ariaAttrs) {
    const value = getStaticAttributeValue(node, name);

    // Skip dynamic or missing values — we cannot safely analyse them.
    if (value === null) continue;

    if (value === "") {
      // Empty aria-* attribute value — always invalid.
      const reportNode = getAttributeNode(node, name);
      if (reportNode) {
        context.report({
          node: reportNode,
          messageId: "emptyAriaValue",
          data: { attribute: name },
          fix(fixer) {
            return fixer.remove(reportNode);
          },
        });
      }
    } else if (DEFAULT_ARIA_VALUES[name] === value) {
      // Attribute is set to its spec-defined default — redundant.
      const reportNode = getAttributeNode(node, name);
      if (reportNode) {
        context.report({
          node: reportNode,
          messageId: "defaultAriaValue",
          data: { attribute: name, value },
          fix(fixer) {
            return fixer.remove(reportNode);
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
        "Disallow ARIA attributes set to their default value or empty string",
    },
    fixable: "code",
    schema: [],
    messages: {
      defaultAriaValue:
        'The attribute "{{attribute}}" is set to its default value "{{value}}". Remove the redundant attribute.',
      emptyAriaValue:
        'The attribute "{{attribute}}" has an empty value. Remove the invalid attribute.',
    },
  },
  create(context) {
    return createElementVisitors(context, checkElement);
  },
};

export default rule;
