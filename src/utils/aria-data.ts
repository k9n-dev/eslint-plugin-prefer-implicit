/**
 * Declarative lookup tables for ARIA/HTML semantics.
 *
 * Where possible, data is derived from the `aria-query` package which tracks
 * the WAI-ARIA 1.2 W3C Recommendation. Manual overrides are documented inline.
 */

import { roles } from "aria-query";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * An entry in the implicit role map. When `condition` is present, the implicit
 * role only applies if the element has the specified attribute.
 */
export interface ImplicitRoleEntry {
  role: string;
  condition?: { attribute: string };
}

// ---------------------------------------------------------------------------
// 1. IMPLICIT_ROLE_MAP
// ---------------------------------------------------------------------------

/**
 * Maps HTML element names to their implicit ARIA role.
 * Conditional entries indicate the element must have a specific attribute
 * for the implicit role to apply (e.g. `<a>` requires `href`).
 *
 * Maintained manually: aria-query's elementRoles uses a different key format
 * (JSON-serialised concept objects with optional attributes) that doesn't map
 * cleanly to the simple element-name lookup this plugin needs.
 */
export const IMPLICIT_ROLE_MAP: Record<string, ImplicitRoleEntry> = {
  a:        { role: "link",          condition: { attribute: "href" } },
  article:  { role: "article" },
  aside:    { role: "complementary" },
  button:   { role: "button" },
  datalist: { role: "listbox" },
  details:  { role: "group" },
  dialog:   { role: "dialog" },
  fieldset: { role: "group" },
  footer:   { role: "contentinfo" },
  form:     { role: "form" },
  h1:       { role: "heading" },
  h2:       { role: "heading" },
  h3:       { role: "heading" },
  h4:       { role: "heading" },
  h5:       { role: "heading" },
  h6:       { role: "heading" },
  header:   { role: "banner" },
  hr:       { role: "separator" },
  img:      { role: "img" },
  input:    { role: "textbox" },
  li:       { role: "listitem" },
  main:     { role: "main" },
  menu:     { role: "list" },
  nav:      { role: "navigation" },
  ol:       { role: "list" },
  optgroup: { role: "group" },
  option:   { role: "option" },
  output:   { role: "status" },
  progress: { role: "progressbar" },
  select:   { role: "combobox" },
  summary:  { role: "button" },
  table:    { role: "table" },
  tbody:    { role: "rowgroup" },
  td:       { role: "cell" },
  textarea: { role: "textbox" },
  tfoot:    { role: "rowgroup" },
  th:       { role: "columnheader" },
  thead:    { role: "rowgroup" },
  tr:       { role: "row" },
  ul:       { role: "list" },
};

// ---------------------------------------------------------------------------
// 2. ROLE_ARIA_LIVE_MAP
// ---------------------------------------------------------------------------

/**
 * Maps ARIA roles to their implied `aria-live` value.
 * Used by the no-conflicting-aria rule.
 *
 * Derived from aria-query (roles with non-null aria-live prop values), plus
 * manual entries for `marquee` ("off") and `timer` ("off") which aria-query
 * stores as null but the WAI-ARIA spec defines as implicitly "off".
 */
export const ROLE_ARIA_LIVE_MAP: Record<string, string> = {
  // Derived from aria-query
  ...Object.fromEntries(
    [...roles.entries()]
      .filter(([, v]) => v.props["aria-live"] !== null && v.props["aria-live"] !== undefined)
      .map(([k, v]) => [k, v.props["aria-live"] as string]),
  ),
  // Manual: WAI-ARIA spec defines these as implicitly "off", aria-query stores null
  marquee: "off",
  timer:   "off",
};

// ---------------------------------------------------------------------------
// 3. SUPPORTED_ARIA_BY_ROLE
// ---------------------------------------------------------------------------

/**
 * Maps ARIA roles to the set of `aria-*` attributes they support.
 * Used by the no-unsupported-aria rule.
 *
 * Derived from aria-query's role props. Each role's props object contains all
 * supported aria-* attributes as keys (values are defaults or null).
 *
 * Manual additions:
 * - `aria-invalid` and `aria-errormessage` are global ARIA attributes present
 *   in the spec but missing from aria-query's props for some roles. We add
 *   them to every role's supported set to avoid false positives.
 */

/** Extra global attributes that aria-query omits from some role props. */
const EXTRA_GLOBAL = ["aria-invalid", "aria-errormessage"] as const;

function buildSupportedSet(roleProps: Record<string, unknown>): Set<string> {
  return new Set([...Object.keys(roleProps), ...EXTRA_GLOBAL]);
}

export const SUPPORTED_ARIA_BY_ROLE: Record<string, Set<string>> = Object.fromEntries(
  [...roles.entries()].map(([roleName, roleDef]) => [
    roleName,
    buildSupportedSet(roleDef.props as unknown as Record<string, unknown>),
  ]),
);

// ---------------------------------------------------------------------------
// 4. DEFAULT_ARIA_VALUES
// ---------------------------------------------------------------------------

/**
 * Maps `aria-*` attributes to their specification-defined default values.
 * Used by the no-default-aria rule.
 *
 * Maintained manually: aria-query stores default values as the prop value
 * (e.g. `"aria-atomic": "true"` for alert), but these are role-specific
 * defaults, not the global attribute defaults this rule targets.
 */
export const DEFAULT_ARIA_VALUES: Record<string, string> = {
  "aria-hidden":          "false",
  "aria-required":        "false",
  "aria-expanded":        "false",
  "aria-pressed":         "false",
  "aria-disabled":        "false",
  "aria-checked":         "false",
  "aria-selected":        "false",
  "aria-grabbed":         "false",
  "aria-atomic":          "false",
  "aria-busy":            "false",
  "aria-modal":           "false",
  "aria-multiline":       "false",
  "aria-multiselectable": "false",
  "aria-readonly":        "false",
};

// ---------------------------------------------------------------------------
// 5. INTERACTIVE_ELEMENTS
// ---------------------------------------------------------------------------

/**
 * Set of HTML elements that are natively focusable without `tabindex`.
 * For `<a>`, focusability requires an `href` attribute — checked at the call site.
 */
export const INTERACTIVE_ELEMENTS: Set<string> = new Set([
  "a",
  "button",
  "details",
  "embed",
  "iframe",
  "input",
  "select",
  "summary",
  "textarea",
]);

// ---------------------------------------------------------------------------
// 6. STRUCTURAL_ELEMENTS
// ---------------------------------------------------------------------------

/**
 * Set of HTML elements that are structural (lists, tables, definition lists)
 * and should not have their semantics removed.
 */
export const STRUCTURAL_ELEMENTS: Set<string> = new Set([
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "td",
  "th",
  "dl",
  "dt",
  "dd",
  "menu",
]);

// ---------------------------------------------------------------------------
// 7. DESTRUCTIVE_ROLES
// ---------------------------------------------------------------------------

/**
 * Set of role values that strip native semantics from elements.
 */
export const DESTRUCTIVE_ROLES: Set<string> = new Set([
  "none",
  "presentation",
]);

// ---------------------------------------------------------------------------
// 8. VALID_ARIA_ROLES
// ---------------------------------------------------------------------------

/**
 * Set of all valid WAI-ARIA role values (lowercase).
 * Derived directly from aria-query which tracks the WAI-ARIA 1.2 spec.
 *
 * Includes all roles: widget, document structure, landmark, live region,
 * window/composite, and abstract roles. Abstract roles are included because
 * they ARE valid role names per the spec (they exist in the ontology).
 * The no-invalid-role rule checks if a role *exists*;
 * the no-abstract-role rule checks if it's *usable*.
 */
export const VALID_ARIA_ROLES: Set<string> = new Set(roles.keys());

// ---------------------------------------------------------------------------
// 9. ABSTRACT_ROLES
// ---------------------------------------------------------------------------

/**
 * Set of abstract WAI-ARIA roles that exist only as ontological superclasses
 * and must not be used by content authors.
 * Derived directly from aria-query (roles where abstract === true).
 * Used by the no-abstract-role rule.
 */
export const ABSTRACT_ROLES: Set<string> = new Set(
  [...roles.entries()]
    .filter(([, v]) => v.abstract)
    .map(([k]) => k),
);

// ---------------------------------------------------------------------------
// 10. IMPLICIT_ARIA_VALUES
// ---------------------------------------------------------------------------

/**
 * Maps HTML element names to their implicit ARIA attribute values.
 * This is distinct from `IMPLICIT_ROLE_MAP` (which maps elements to roles) —
 * this maps elements to the ARIA *attribute values* they imply by default.
 * Used by the no-redundant-aria rule.
 *
 * Maintained manually: these are HTML-AAM implicit values, not ARIA role
 * defaults. aria-query does not model this relationship.
 */
export const IMPLICIT_ARIA_VALUES: Record<string, Record<string, string>> = {
  h1: { "aria-level": "1" },
  h2: { "aria-level": "2" },
  h3: { "aria-level": "3" },
  h4: { "aria-level": "4" },
  h5: { "aria-level": "5" },
  h6: { "aria-level": "6" },
  input: { "aria-required": "false" },
  textarea: { "aria-required": "false" },
  select: { "aria-required": "false" },
  details: { "aria-expanded": "false" },
  dialog: { "aria-modal": "false" },
  hr: { "aria-orientation": "horizontal" },
  progress: { "aria-valuemin": "0", "aria-valuemax": "100" },
};
