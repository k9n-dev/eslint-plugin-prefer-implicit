/**
 * Shared autofix utilities.
 *
 * Provides a whitespace-aware attribute removal helper so that
 * `<input aria-required="false" />` becomes `<input />` instead of
 * `<input  />` (double space).
 */

import type { Rule } from "eslint";

/**
 * Creates a fix that removes an attribute node **and** the leading whitespace
 * that separated it from the preceding token.
 *
 * Falls back to a plain `fixer.remove()` when the source text is unavailable
 * or the range cannot be determined.
 */
export function removeAttribute(
  context: Rule.RuleContext,
  fixer: Rule.RuleFixer,
  attrNode: any,
): Rule.Fix | null {
  if (!attrNode) return null;

  const range: [number, number] | undefined = attrNode.range;
  if (!range) {
    // No range information — fall back to the default remove.
    return fixer.remove(attrNode);
  }

  const sourceText = context.sourceCode?.text ?? (context as any).getSourceCode?.()?.text;
  if (!sourceText) {
    return fixer.remove(attrNode);
  }

  // Walk backwards from the attribute start to consume whitespace (spaces,
  // tabs) but stop at newlines — we don't want to eat preceding lines.
  let start = range[0];
  while (start > 0 && (sourceText[start - 1] === " " || sourceText[start - 1] === "\t")) {
    start--;
  }

  // If we consumed all whitespace back to a newline or the start of the
  // string, keep exactly one space so the tag doesn't collapse
  // (e.g. `<button role="button">` → `<button>`, not `<button>`).
  // Actually, collapsing is fine — `<button>` is valid.  But we need to
  // be careful: if the character right before `start` is NOT whitespace
  // and NOT `<` / tag-name, we should keep one space.
  //
  // Simpler heuristic: if the character at `start` is not whitespace and
  // the original start was different (i.e. we consumed something), we
  // already stopped at the right boundary.  If we consumed nothing, just
  // do a plain remove.
  if (start === range[0]) {
    return fixer.remove(attrNode);
  }

  return fixer.removeRange([start, range[1]]);
}
