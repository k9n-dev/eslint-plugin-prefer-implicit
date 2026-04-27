/**
 * Shared utility for creating framework-agnostic element visitors.
 *
 * Handles the differences between:
 *   - JSX (JSXOpeningElement) — works with standard ESLint visitors
 *   - Vue (VElement) — requires `defineTemplateBodyVisitor` from vue-eslint-parser
 *   - Angular (Element) — works with standard ESLint visitors via @angular-eslint/template-parser
 */

import type { Rule } from "eslint";

/**
 * Creates the appropriate visitor object for a rule that needs to inspect
 * HTML-like element nodes across JSX, Vue, and Angular templates.
 *
 * @param context - The ESLint rule context
 * @param checkElement - The function to call for each element node
 * @returns A visitor object suitable for the `create` return value
 */
export function createElementVisitors(
  context: Rule.RuleContext,
  checkElement: (context: Rule.RuleContext, node: any) => void,
): Record<string, (node: any) => void> {
  const parserServices = (context as any).parserServices ?? (context.sourceCode as any).parserServices;

  // Vue: use defineTemplateBodyVisitor when available
  if (
    parserServices &&
    typeof parserServices.defineTemplateBodyVisitor === "function"
  ) {
    return parserServices.defineTemplateBodyVisitor({
      VElement(node: any) {
        checkElement(context, node);
      },
    });
  }

  // JSX + Angular + fallback
  return {
    JSXOpeningElement(node: any) {
      checkElement(context, node);
    },
    // Angular template parser produces Element nodes
    Element(node: any) {
      checkElement(context, node);
    },
    // Fallback for VElement if defineTemplateBodyVisitor is not available
    VElement(node: any) {
      checkElement(context, node);
    },
  };
}
